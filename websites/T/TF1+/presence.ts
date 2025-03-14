import { ActivityType, Assets, getTimestamps, getTimestampsFromMedia, timestampFromFormat } from 'premid'
import {
  ActivityAssets,
  checkStringLanguage,
  cropPreset,
  //exist,
  //formatDuration,
  //getChannel,
  getColor,
  //getLocalizedAssets,
  getSetting,
  getThumbnail,
  limitText,
  presence,
  strings,
  generateImageWithBackground
} from './util.js'

const browsingTimestamp = Math.floor(Date.now() / 1000)
const slideshow = new Slideshow()

let oldPath = document.location.pathname

presence.on('UpdateData', async () => {
  const { href, pathname } = document.location
  const pathParts = pathname.split('/')
  const presenceData: PresenceData = {
    name: 'TF1+',
    largeImageKey: ActivityAssets.TF1, // Default
    largeImageText: 'TF1+',
    smallImageKey: ActivityAssets.Binoculars,
    smallImageText: strings.browsing,
    type: ActivityType.Watching,
  }
  const [
    newLang,
    //usePresenceName,
    //useChannelName,
    //usePrivacyMode,
    //usePoster,
    //useButtons,
  ] = [
    getSetting<string>('lang', 'en'),
    //getSetting<boolean>('usePresenceName'),
    //getSetting<boolean>('useChannelName'),
    //getSetting<boolean>('usePrivacyMode'),
    //getSetting<boolean>('usePoster'),
    //getSetting<number>('useButtons'),
  ]

  // Update strings if user selected another language.
  if (!checkStringLanguage(newLang))
    return

  if (oldPath !== pathname) {
    oldPath = pathname
    //slideshow.deleteAllSlides()
  }
  
  let useSlideshow = false
  const routeKey = document.querySelector('meta[name="custom:route_key"]')!.getAttribute("content")!

  switch (true) {
    case routeKey === "HOME": {
        presenceData.details = strings.browsing
        presenceData.state = strings.viewHome
        break
    }
    case ["PROFILE", "ACCOUNT"].includes(routeKey): {
        presenceData.details = strings.browsing
        presenceData.state = strings.viewAccount
        break
    }
    case routeKey === "CATEGORY_REPLAY_CATALOG": {
        presenceData.details = strings.browsing
        presenceData.state = strings.viewCategory
        break
    }
    case routeKey === "PROGRAM_HOME": {
        let mediaData
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
            if (['TVSeries', 'Movie'].includes(data['@type']))
              mediaData = data
          }

        const title = document.querySelector("h1.inline")?.textContent
        const subtitle = document.querySelector("p.inline")?.textContent
        const logo = await generateImageWithBackground(
            document.querySelector("div.grid > div > picture > img")?.getAttribute("src")!,
            "white",
            0.55,
            0,
            0
        )

        presenceData.details = title
        presenceData.state = subtitle
        
        /*presenceData.largeImageKey = await getThumbnail(
            logo,
            cropPreset.squared,
            getColor("gradient"),
        )*/
        presenceData.largeImageKey = logo
        break
    }
    case routeKey === "VIDEO": {
        presenceData.details = strings.browsing
        presenceData.state = strings.watchingShow
        break
    }
    case routeKey === "LIVE": {
        presenceData.details = strings.browsing
        presenceData.state = strings.watchingLive
        break
    }
    

    // In case we need a default
    default: {
      presenceData.details = strings.viewAPage
      break
    }
  }

  if (presenceData.details === '')
    delete presenceData.details
  if (presenceData.state === '')
    delete presenceData.state

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