import { ActivityType, Assets, getTimestamps, getTimestampsFromMedia, timestampFromFormat } from 'premid'
import {
  ActivityAssets,
  checkStringLanguage,
  colorsMap,
  cropPreset,
  exist,
  formatDuration,
  getChannel,
  getLocalizedAssets,
  getSetting,
  getThumbnail,
  limitText,
  presence,
  strings,
} from './util.js'

const browsingTimestamp = Math.floor(Date.now() / 1000)
const slideshow = new Slideshow()

let oldPath = document.location.pathname
let title = ''
let subtitle = ''
let category = ''
let isMediaPage = false
let isMediaPlayer = false
let startLiveTimebar = ''
let endLiveTimebar = ''

presence.on('UpdateData', async () => {
  const { /* hostname, href, */ pathname } = document.location
  const pathParts = pathname.split('/')
  const presenceData: PresenceData = {
    name: 'Auvio',
    largeImageKey: ActivityAssets.Auvio, // Default
    largeImageText: 'RTBF Auvio',
    smallImageKey: ActivityAssets.Binoculars,
    smallImageText: strings.browsing,
    type: ActivityType.Watching,
  }
  const [
    newLang,
    usePresenceName,
    useChannelName,
    usePrivacyMode,
    useButtons,
    usePoster,
  ] = [
    getSetting<string>('lang', 'en'),
    getSetting<boolean>('usePresenceName'),
    getSetting<boolean>('useChannelName'),
    getSetting<boolean>('usePrivacyMode'),
    getSetting<number>('useButtons'),
    getSetting<boolean>('usePoster'),
  ]

  // Update strings if user selected another language.
  if (!checkStringLanguage(newLang))
    return

  if (oldPath !== pathname) {
    oldPath = pathname
    slideshow.deleteAllSlides()
  }

  let useSlideshow = false

  switch (true) {
    /* PODCAST PLAYER

    When a podcast is played, it appears in an audio player at the bottom of the screen.
    Once a podcast has been launched, it is visible at all times throughout the site until the website is refreshed. */
    case exist('#audioPlayerContainer'): {
      if (document.querySelector('#PlayerUIAudioPlayPauseButton')?.getAttribute('aria-label') === 'pause') {
        const firstLine = document.querySelector('.PlayerUIAudio_titleText__HV4Y2')?.textContent ?? ''
        const secondLine = document.querySelector('.PlayerUIAudio_subtitle__uhGA4')?.textContent ?? ''
        const duration = document.querySelector('.PlayerUIAudio_duration__n7hxV')?.textContent ?? '0'

        /* RADIO LIVE FEED

        Direct radios are in the same place as podcasts, and play in the same audio player.
        The only difference is in the duration field, which is equal to “direct”, or the back to direct button if in deferred mode. */
        if (duration === 'DIRECT' || exist('#PlayerUIAudioGoToLiveButton')) {
          const channelName = (firstLine.includes(' - ') ? firstLine.split(' - ')[0] : firstLine.match(/^\w+/)?.[0])!
          const coverArt = decodeURIComponent(
            document.querySelector('.PlayerUIAudio_logoContainer__6ffGY > span > img')?.getAttribute('src')?.replace('/_next/image?url=', '').split('&w')[0] ?? '',
          )

          presenceData.name = usePrivacyMode || !usePresenceName ? strings.aRadio : getChannel(channelName).channel
          presenceData.type = ActivityType.Listening

          presenceData.smallImageKey = usePrivacyMode
            ? ActivityAssets.Privacy
            : ActivityAssets.ListeningLive
          presenceData.smallImageText = usePrivacyMode
            ? strings.privatePlay
            : strings.play

          presenceData.startTimestamp = browsingTimestamp

          if (usePrivacyMode) {
            presenceData.details = strings.listeningTo.replace('{0}', ' ').replace('{1}', strings.aRadio)
          }
          else {
            useSlideshow = true
            /* RADIO SHOW NAME

            The first line of the audio player is the name of the program with which it is presented. */

            const showData = structuredClone(presenceData) // Deep copy

            showData.details = firstLine.replace(/\([^()]+\)(?!.*\([^()]+\))/, '').trim() || firstLine
            showData.state = (firstLine.includes(' - ') ? firstLine.split(' - ')[1]!.match(/\(([^()]+)\)(?!.*\([^()]+\))/)?.pop() : '') || ''

            showData.largeImageKey = coverArt.includes(
              'https://ds.static.rtbf.be/default/',
            ) // Must not match default auvio image https://ds.static.rtbf.be/default/image/770x770/default-auvio_0.jpg
              ? getChannel(channelName).logo
              : await getThumbnail(
                coverArt,
                cropPreset.squared,
                getChannel(channelName).color,
              )
            showData.largeImageText += ' - Radio'

            slideshow.addSlide('SHOW', showData, 5000)

            /* RADIO SONG NAME

            The second line shows the music currently playing on the radio, with the artist in brackets.
            Sometimes no music is played and it's just an audio program. */

            const songData = structuredClone(presenceData) // Deep copy

            if (secondLine.match(/\([^()]+\)(?!.*\([^()]+\))/)) {
              // If it has parentheses, it's probably a song.
              songData.details = secondLine
                .replace(/\([^()]+\)(?!.*\([^()]+\))/, '')
                .trim()
              songData.state = secondLine.match(/\(([^()]+)\)(?!.*\([^()]+\))/)!.pop() || strings.live
            }
            else {
              // If it is not, it's probably an audio program
              songData.details = secondLine.length > 30 ? secondLine.slice(0, secondLine.slice(0, 30).lastIndexOf(' ')) : secondLine
              songData.state = secondLine.length > 30 ? secondLine.slice(songData.details.length).trim() : ''
            }

            songData.largeImageKey = firstLine.includes(' - ') ? getChannel(channelName).logo : await getThumbnail(coverArt, cropPreset.squared, getChannel(channelName).color)
            songData.largeImageText += ' - Radio'

            slideshow.addSlide('SONG', songData, 5000)
          }
        }
        else {
          /* VOD PODCAST

          Podcasts can be original programs or past broadcasts. */

          presenceData.name = usePresenceName && !usePrivacyMode ? firstLine : strings.aPodcast
          presenceData.type = ActivityType.Listening

          presenceData.details = !usePrivacyMode
            ? firstLine
            : strings.listeningTo.replace('{0}', ' ').replace('{1}', strings.aPodcast)

          presenceData.state = !usePrivacyMode ? secondLine : ''

          presenceData.smallImageKey = usePrivacyMode
            ? ActivityAssets.Privacy
            : ActivityAssets.ListeningVOD
          presenceData.smallImageText = usePrivacyMode
            ? strings.privatePlay
            : strings.play;

          [presenceData.startTimestamp, presenceData.endTimestamp] = getTimestamps(
            timestampFromFormat(duration.split('/')?.[0] ?? duration),
            timestampFromFormat(duration.split('/')?.[1] ?? duration),
          )

          if (usePoster) {
            presenceData.largeImageKey = await getThumbnail(
              decodeURIComponent(
                // the url is a weird relative encoded link
                document.querySelector('.PlayerUIAudio_logoContainer__6ffGY > span > img')!.getAttribute('src')!.replace('/_next/image?url=', '').split('&w')[0]!,
              ),
              cropPreset.squared,
              getChannel('default').color,
            )
          }
          if (!usePrivacyMode)
            presenceData.largeImageText += ' - Podcasts'
        }
      }
      break
    }
    /* RESEARCH (Page de recherche)

    (https://auvio.rtbf.be/explorer) */
    case ['explorer'].includes(pathParts[1]!): {
      const searchQuery = (
        document.querySelector(
          'input.PageContent_inputSearch__8B4AC',
        ) as HTMLInputElement
      ).value

      if (searchQuery !== '') {
        presenceData.details = strings.browsing
        presenceData.state = `${strings.searchFor} ${searchQuery}`
      }
      else {
        presenceData.details = strings.browsing
        presenceData.state = strings.searchSomething
      }
      presenceData.smallImageKey = Assets.Search
      presenceData.smallImageText = strings.search

      break
    }

    /* ACCOUNT & ACCOUNT SETTINGS PAGE

    (ex: https://auvio.rtbf.be/mes_informations) */
    case [
      'mes_informations',
      'controle_parental',
      'portabilite',
      'mes_offres_premium',
      'langues_sous_titres',
      'parametres_lecture',
    ].includes(pathParts[1]!): {
      presenceData.details = usePrivacyMode ? strings.browsing : document.querySelector('.UserGateway_title__PkVAb')!.textContent
      presenceData.state = usePrivacyMode ? strings.viewAPage : strings.viewAccount

      presenceData.smallImageKey = usePrivacyMode || document.querySelector('.HeaderUser_text__tpHR7')!.textContent!.toLowerCase().includes('se connecter')
        ? ActivityAssets.Binoculars
        : document.querySelector('.HeaderUser_avatar__pbBy2 > span > img')!.getAttribute('src')
      presenceData.smallImageText = usePrivacyMode
        ? strings.browsing
        : document.querySelector('.HeaderUser_text__tpHR7')!.textContent

      presenceData.largeImageKey = ActivityAssets.Logo
      break
    }
    case ['media', 'live', 'emission'].includes(pathParts[1]!): {
      if (usePrivacyMode) {
        if (!exist('#player')) {
          presenceData.details = strings.browsing
          presenceData.state = strings.viewAPage
        }
        else {
          switch (true) {
            case pathParts[1] === 'media': {
              presenceData.state = strings.watchingMovie
              break
            }
            case pathParts[1] === 'emission': {
              presenceData.state = strings.watchingShow
              break
            }
            case pathParts[1] === 'live': {
              presenceData.state = strings.watchingLive
              break
            }
          }
          presenceData.details = 'watch'
        }
      }
      else {
        useSlideshow = true

        // Retrieving JSON
        let breadcrumbData: { itemListElement: { name: string }[] } | undefined
        let mediaData: any

        for (
          let i = 0;
          i
          < document.querySelectorAll('script[type=\'application/ld+json\']')
            .length;
          i++
        ) {
          const data = JSON.parse(
            document.querySelectorAll('script[type=\'application/ld+json\']')[i]?.textContent ?? '{}',
          )
          if (['BreadcrumbList'].includes(data['@type']))
            breadcrumbData = data as { itemListElement: { name: string }[] }
          if (['Movie', 'Episode', 'BroadcastEvent', 'VideoObject'].includes(data['@type']))
            mediaData = data
        }

        const channelCategoryElements = document.querySelectorAll('div.DetailsTitle_channelCategory__vh_cY > div')
        const bChannelCategoryShown = channelCategoryElements.length > 1
        const channelCategory = channelCategoryElements[0]?.textContent ?? ''

        if (usePoster) {
          const mediaImage = mediaData?.image || mediaData?.thumbnailUrl || mediaData?.broadcastOfEvent?.image?.url
          if (mediaImage) {
            presenceData.largeImageKey = await getThumbnail(
              mediaImage,
              cropPreset.horizontal,
              getChannel(channelCategory).color,
            )
          }
        }

        if (!exist('#player')) {
          // MEDIA PAGE
          isMediaPage = true
          if (isMediaPlayer) {
            slideshow.deleteAllSlides()
            isMediaPlayer = false
          }

          const titleElements = document.querySelectorAll('div.DetailsTitle_title__mdRHD')
          title = titleElements.length > 0 ? titleElements[titleElements.length - 1]?.textContent?.trim() ?? strings.browsing : strings.browsing

          const subtitleElements = document.querySelectorAll('div.DetailsTitle_subtitle__D30rn')
          const subtitle = subtitleElements[subtitleElements.length - 1]?.textContent?.trim()

          const durationElement = document.querySelector('p.PictoBar_text__0Y_kv')
          let infos = bChannelCategoryShown ? `${channelCategory} ・` : ''
          infos += durationElement ? `${durationElement.textContent?.trim() ?? ''} ・` : ''
          infos += breadcrumbData?.itemListElement ? `${breadcrumbData.itemListElement[1]?.name.replace(/s$/i, '') ?? ''}` : ''

          presenceData.smallImageKey = ActivityAssets.Binoculars
          presenceData.smallImageText = strings.browsing

          presenceData.details = subtitle ? title.replace(subtitle, '') : title

          // SLIDE: SUBTITLE
          if (subtitle) {
            presenceData.state = subtitle // subtitle
            slideshow.addSlide('SUBTITLE', presenceData, 10000)
          }

          // SLIDE: METADATAS INFOS
          const infosData = structuredClone(presenceData)
          infosData.state = infos
          slideshow.addSlide('INFOS', infosData, 10000)

          // LIVE MEDIA PAGE
          const soonElement = document.querySelector('.PictoBar_soon__g_vHQ')
          const countdownElement = document.querySelector('.LiveCountdown_countdown__vevrl')

          presenceData.smallImageKey = ActivityAssets.Waiting
          presenceData.smallImageText = strings.waitingLive

          if (['live'].includes(pathParts[1]!) && (soonElement || countdownElement)) {
            // SLIDE: SOON TEXT: "Demain à 15h59"
            if (soonElement) {
              const soonData = structuredClone(presenceData)
              soonData.state = soonElement.textContent!.replace('|', '')

              slideshow.addSlide('TIME', soonData, 5000)
            }

            // SLIDE: COUNTDOWN: "Retrouvez nous en direct dans XX:XX:XX"
            if (countdownElement) {
              const countdownData = structuredClone(presenceData)
              countdownData.state = strings.startsIn.replace('{0}', formatDuration(countdownElement.textContent!))

              slideshow.addSlide('COUNTDOWN', countdownData, 5000)
            }
          }
        }
        else {
          // MEDIA PLAYER PAGE
          isMediaPlayer = true
          if (isMediaPage) {
            slideshow.deleteAllSlides()
            isMediaPage = false
          }

          // Update the variables only if the overlay is visible and the elements are found
          title = document.querySelector('.TitleDetails_title__vsoUq')?.textContent ?? title
          subtitle = document.querySelector('.TitleDetails_subtitle__y1v4e')?.textContent ?? subtitle
          category = document.querySelector('.TitleDetails_category__Azvos')?.textContent ?? category

          const videoArray = document.querySelectorAll('div.redbee-player-media-container > video')
          const video = videoArray[videoArray.length - 1] as HTMLVideoElement
          const adCountdownElement = document.querySelector('.sas-ctrl-countdown')

          // LIVE VIDEO PLAYER
          if (['live'].includes(pathParts[1]!)) {
            if (usePresenceName)
              presenceData.name = title
            else if (useChannelName && bChannelCategoryShown)
              presenceData.name = channelCategory

            presenceData.details = title
            presenceData.state = subtitle

            // PLAYER STATUS
            if (adCountdownElement && adCountdownElement.textContent !== '') {
              presenceData.smallImageText = strings.ad
              presenceData.smallImageKey = getLocalizedAssets(newLang, 'Ad')
            }
            else if (['direct'].includes(category!.toLowerCase())) {
              presenceData.smallImageKey = !video.paused
                ? ActivityAssets.LiveAnimated
                : Assets.Pause
              presenceData.smallImageText = !video.paused
                ? strings.live
                : strings.pause
            }
            else if (category!.toLowerCase() === 'en différé') {
              presenceData.smallImageKey = !video.paused
                ? ActivityAssets.Deferred
                : Assets.Pause
              presenceData.smallImageText = !video.paused
                ? strings.deferred
                : strings.pause
            }

            if (adCountdownElement && adCountdownElement.textContent !== '') {
              presenceData.smallImageText = strings.ad
              presenceData.smallImageKey = getLocalizedAssets(newLang, 'Ad')
            }
            else if (video.paused) {
              presenceData.startTimestamp = browsingTimestamp
              delete presenceData.endTimestamp
            }
            else {
              startLiveTimebar = document.querySelector('.PlayerUITimebar_textLeft__5bfI_')?.textContent ?? startLiveTimebar
              endLiveTimebar = document.querySelector('.PlayerUITimebar_textRight__Qd04m')?.textContent ?? endLiveTimebar

              const startTimeSec = timestampFromFormat(`${startLiveTimebar.replace('h', ':')}:00`)
              const endTimeSec = timestampFromFormat(`${endLiveTimebar.replace('h', ':')}:00`)

              /* if (startTimeSec > endTimeSec) {
                [presenceData.startTimestamp, presenceData.endTimestamp] = getTimestamps(
                  Math.floor(new Date().setHours(0, 0, 0, 0) / 1000),
                  Math.floor(new Date().setHours(0, 0, 0, 0) / 1000) + 86400 + endTimeSec,
                )
              }
              else { */
              presenceData.startTimestamp = browsingTimestamp// Math.floor((new Date().setHours(0, 0, 0, 0) / 1000) + startTimeSec)
              presenceData.endTimestamp = browsingTimestamp + 3600 // Math.floor((new Date().setHours(0, 0, 0, 0) / 1000) + endTimeSec)

              // }
              presenceData.state = `${presenceData.startTimestamp} ${presenceData.endTimestamp} ${startTimeSec} ${endTimeSec} ${browsingTimestamp}`
            }

            // if (subtitle)
            slideshow.addSlide('TITLE', presenceData, 10000)

            // SLIDE STATUS
            const statusData = structuredClone(presenceData)
            statusData.state = bChannelCategoryShown
              ? strings.on.replace('{0)', strings.watchingLive).replace('{1}', channelCategory)
              : strings.on.replace('{0)', strings.watchingLive).replace('{1}', 'Auvio')

            // slideshow.addSlide('STATUS', statusData, 10000)
          }
          else {
            // VOD VIDEO PLAYER
            if (usePresenceName)
              presenceData.name = title

            presenceData.details = title
            presenceData.state = bChannelCategoryShown
              ? `${channelCategory} - ${subtitle}`
              : subtitle
            presenceData.state = title
            // PLAYER STATUS
            if (adCountdownElement && adCountdownElement.textContent !== '') {
              presenceData.smallImageText = strings.ad
              presenceData.smallImageKey = getLocalizedAssets(newLang, 'Ad')
            }
            else {
              presenceData.smallImageKey = !video.paused
                ? Assets.Play
                : Assets.Pause
              presenceData.smallImageText = !video.paused
                ? strings.play
                : strings.pause
            }

            if (video.paused) {
              presenceData.startTimestamp = browsingTimestamp
              delete presenceData.endTimestamp
            }
            else {
              presenceData.startTimestamp = getTimestampsFromMedia(video)[0]
              presenceData.endTimestamp = getTimestampsFromMedia(video)[1]
            }
          }
        }
      }
      break
    }
    /* HOME PAGE, CATEGORY & CHANNEL PAGE

    (ex: https://auvio.rtbf.be/categorie/sport-9 or https://auvio.rtbf.be/chaine/la-une-1) */

    case pathname === '/' // Homepage
      || [
        'categorie',
        'direct', // Considered as a category
        'podcasts', // Considered as a category
        'kids', // Considered as a category
        'mon-auvio',
        'chaine',
        'mot-cle',
        'premium',
      ].includes(pathParts[1]!): {
      presenceData.details = strings.browsing

      if (usePrivacyMode) {
        presenceData.state = strings.viewAPage

        presenceData.smallImageKey = ActivityAssets.Privacy
        presenceData.smallImageText = strings.privacy
      }
      else if (pathname === '/') {
        // HOME PAGE
        presenceData.state = strings.viewHome
        presenceData.startTimestamp = browsingTimestamp
      }
      else {
        // CATEGORY AND CHANNEL PAGE
        const categoryTitle = document.querySelector('h1')!.textContent!.length < 20 // Sometimes the title is way too long
          ? document.querySelector('h1')!.textContent!
          : document.querySelector('li:nth-last-child() > span')!.textContent! // Last of breadcrumb list

        presenceData.details = pathParts[1] === 'podcasts' ? `${categoryTitle} & Radios` : categoryTitle

        presenceData.state = strings.viewCategory.replace(':', '')

        // Fallback
        presenceData.largeImageKey = await getThumbnail(
          getChannel(pathParts[1]!).logo,
          cropPreset.squared,
          colorsMap.get(categoryTitle.toLowerCase().replace(/[éè]/g, 'e')) || colorsMap.get(''),
        )
        presenceData.largeImageText = `Catégorie ${categoryTitle} sur Auvio`

        if (usePoster) {
          useSlideshow = true
          const selector = exist('img.TileProgramPoster_hoverPicture__v5RJX')
            ? 'img.TileProgramPoster_hoverPicture__v5RJX' // If programs cover art are in portrait
            : 'img.TileMedia_hoverPicture__RGh_m' // If programs cover art are in landscape

          for (
            let index = 0;
            index < document.querySelector('.swiper-wrapper')!.childElementCount;
            index++
          ) {
            const src = decodeURIComponent(
              document.querySelectorAll(selector)[index]?.getAttribute('src')!.replace('/_next/image?url=', '').split('&w')[0] || '',
            )

            // Sometimes url starts with data:image and it doesn't render well, so we take no risks
            if (!src.match('data:image') && src !== '') {
              const tempData = structuredClone(presenceData) // Deep copy
              const mediaTitle = document.querySelectorAll(selector)[index]?.getAttribute('title') || index.toString()

              tempData.largeImageKey = await getThumbnail(
                src,
                exist('img.TileProgramPoster_hoverPicture__v5RJX')
                  ? cropPreset.vertical
                  : cropPreset.horizontal,
                colorsMap.get(categoryTitle.toLowerCase().replace(/[éè]/g, 'e')) || colorsMap.get(''),
              )
              if (mediaTitle !== index.toString()) {
                const temp = strings.on.replace('{1}', pathParts[1]!.includes('chaine') ? categoryTitle : 'Auvio')
                tempData.largeImageText = tempData.state = temp.replace('{0}', limitText(mediaTitle, 128 - temp.length))
              }
              slideshow.addSlide(mediaTitle, tempData, 5000)
            }
          }
        }
      }
      break
    }

    // In case we need a default
    default: {
      presenceData.details = strings.viewAPage
      presenceData.state = pathname
      break
    }
  }

  if (
    (presenceData.startTimestamp || presenceData.endTimestamp)
  ) {
    delete presenceData.startTimestamp
    delete presenceData.endTimestamp
  }
  if (presenceData.details === '')
    delete presenceData.details
  if (presenceData.state === '')
    delete presenceData.state

  if ((!useButtons || usePrivacyMode) && presenceData.buttons)
    delete presenceData.buttons
  if (useSlideshow) {
    presence.setActivity(slideshow)
  }
  else if (presenceData.details) {
    presence.setActivity(presenceData)
  }
  else {
    presence.clearActivity()
  }
})
