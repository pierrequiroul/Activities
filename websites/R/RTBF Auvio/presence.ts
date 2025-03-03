import { ActivityType, Assets, getTimestamps, getTimestampsFromMedia, timestampFromFormat } from 'premid'
import {
  ActivityAssets,
  checkStringLanguage,
  colorsMap,
  cropPreset,
  // getLocalizedAssets,
  exist,
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

presence.on('UpdateData', async () => {
  const { /* hostname, href, */ pathname } = document.location
  const pathParts = pathname.split('/')
  const presenceData: PresenceData = {
    name: 'Auvio',
    largeImageKey: ActivityAssets.Auvio, // Default
    largeImageText: 'RTBF Auvio',
    type: ActivityType.Watching,
  }
  const [
    newLang,
    usePresenceName,
    // useChannelName,
    usePrivacyMode,
    useTimestamps,
    useButtons,
    usePoster,
  ] = [
    getSetting<string>('lang', 'en'),
    getSetting<boolean>('usePresenceName'),
    // presence.getSetting<boolean>("useChannelName"),
    getSetting<boolean>('usePrivacyMode'),
    getSetting<boolean>('useTimestamps'),
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

      presenceData.smallImageKey = ActivityAssets.Binoculars
      presenceData.smallImageText = strings.browsing

      if (usePrivacyMode) {
        presenceData.state = strings.viewAPage

        presenceData.smallImageKey = ActivityAssets.Privacy
        presenceData.smallImageText = strings.privacy
      }
      else if (pathname === '/') {
        // HOME PAGE
        presenceData.state = strings.viewHome
        if (useTimestamps)
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
                // const temp = strings.on.replace('{1}', pathParts[1]!.includes('chaine') ? categoryTitle : 'Auvio')
                const temp = '{0} on {1}'.replace('{1}', pathParts[1]!.includes('chaine') ? categoryTitle : 'Auvio') // Delete this

                tempData.largeImageText = tempData.state = temp.replace('{0}', limitText(mediaTitle, 128 - temp.length))
              }
              slideshow.addSlide(mediaTitle, tempData, 5000)
            }
          }
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

        const bChannelCategoryShown = document.querySelectorAll('.DetailsTitle_channelCategory__vh_cY > p').length > 1
        const channelCategory = (bChannelCategoryShown ? document.querySelectorAll('.DetailsTitle_channelCategory__vh_cY > p')[0]!.textContent : 'default')!
        const durationElement = document.querySelector('p.PictoBar_text__0Y_kv')

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
          const titleElements = document.querySelectorAll('div.DetailsTitle_title__mdRHD')
          title = titleElements.length > 0 ? titleElements[titleElements.length - 1]?.textContent?.trim() ?? strings.browsing : strings.browsing

          const subtitleElements = document.querySelectorAll('div.DetailsTitle_subtitle__D30rn')
          if (subtitleElements.length > 0) {
            const lastSubtitle = subtitleElements[subtitleElements.length - 1]?.textContent?.trim()
            if (lastSubtitle) {
              title = title.replace(lastSubtitle, '')

              // Check if title matches the last breadcrumb item (case insensitive)
              if (
                breadcrumbData?.itemListElement
                && breadcrumbData.itemListElement.length > 0
                && title.toLowerCase() === breadcrumbData.itemListElement[breadcrumbData.itemListElement.length - 1]?.name?.toLowerCase()
              ) {
                title = lastSubtitle // Subtitle is more relevant in this case
              }
            }
          }

          /* MEDIA PAGE */
          let subtitle = bChannelCategoryShown ? `${channelCategory} - ` : ''
          subtitle += durationElement ? durationElement.textContent?.trim() ?? '' : ''

          if (breadcrumbData?.itemListElement) {
            for (let i = 1; i < breadcrumbData.itemListElement.length; i++) {
              // Get Genres
              const genreName = breadcrumbData.itemListElement[i]?.name?.trim()
              if (genreName && genreName !== title) {
                subtitle += ` - ${genreName.replace(/s$/i, '')}` // Remove trailing 's'
              }
            }
          }

          if (['live'].includes(pathParts[1]!)) {
            if (exist('.LiveCountdown_container__zxHMI')) {
              const countdown = exist('.LiveCountdown_countdown__vevrl')
                ? document.querySelector('.LiveCountdown_countdown__vevrl')!.textContent!
                : ''
              presenceData.details = title

              if (Date.now() % 2 === 0 && exist('.PictoBar_soon__g_vHQ')) {
                presenceData.state = strings.startsIn.replace('{0}', countdown)
              }
              else {
                presenceData.state = document.querySelector('.PictoBar_soon__g_vHQ')!.textContent!.replace('|', '')
              }

              presenceData.smallImageKey = ActivityAssets.Waiting
              presenceData.smallImageText = strings.waitingLive
            }
            else {
              presenceData.details = title
              presenceData.state = subtitle

              presenceData.smallImageKey = ActivityAssets.Binoculars
              presenceData.smallImageText = strings.browsing
            }
          }
          else {
            presenceData.details = title
            presenceData.state = subtitle

            presenceData.smallImageKey = ActivityAssets.Binoculars
            presenceData.smallImageText = strings.browsing
          }

          if (breadcrumbData?.itemListElement?.length) {
            presenceData.largeImageText = breadcrumbData.itemListElement.at(-1)?.name ?? ''
          }
          else {
            presenceData.largeImageText = ''
          }
        }
        else {
          /* MEDIA PLAYER PAGE */

          // Update the variables only if the overlay is visible and the elements are found
          title = document.querySelector('.TitleDetails_title__vsoUq')?.textContent ?? title
          subtitle = document.querySelector('.TitleDetails_subtitle__y1v4e')?.textContent ?? subtitle
          category = document.querySelector('.TitleDetails_category__Azvos')?.textContent ?? category

          const videoArray = document.querySelectorAll('div.redbee-player-media-container > video')
          const video = videoArray[videoArray.length - 1] as HTMLVideoElement

          if (usePresenceName)
            presenceData.name = title

          /* LIVE VIDEO PLAYER */
          if (['live'].includes(pathParts[1]!)) {
            presenceData.details = title

            if (Date.now() % 2 === 0) {
              presenceData.state = bChannelCategoryShown
                ? `${strings.watchingLive} sur ${channelCategory}`
                : `${strings.watchingLive} sur Auvio`
            }
            else {
              presenceData.state = subtitle
            }

            if (['direct'].includes(category!.toLowerCase())) {
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

            if (useTimestamps) {
              if (video.paused) {
                presenceData.startTimestamp = browsingTimestamp
                delete presenceData.endTimestamp
              }
              else {
                presenceData.startTimestamp = browsingTimestamp
                presenceData.endTimestamp = browsingTimestamp + 6000
              }
            }
          }
          else {
            /* VOD VIDEO PLAYER */
            presenceData.details = title
            presenceData.state = bChannelCategoryShown
              ? `${channelCategory} - ${subtitle}`
              : subtitle

            if (document.querySelector('.sas-ctrl-countdown')?.textContent !== '') {
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

            if (useTimestamps) {
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

          const channelCategoryElement = document.querySelector('div.DetailsTitle_channelCategory__vh_cY')
          presenceData.largeImageText += channelCategoryElement
            ? ` - ${channelCategoryElement.textContent?.trim() ?? ''}`
            : ''
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
    && !useTimestamps
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
