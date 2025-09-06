import { ActivityType, Assets, getTimestamps, getTimestampsFromMedia, timestampFromFormat } from 'premid'
import {
  ActivityAssets,
  checkStringLanguage,
  cropPreset,
  generateImageWithBackground,
  // exist,
  // formatDuration,
  // getChannel,
  getColor,
  // getLocalizedAssets,
  getSetting,
  getThumbnail,
  limitText,
  presence,
  strings,
} from './util.js'

const browsingTimestamp = Math.floor(Date.now() / 1000)
const slideshow = new Slideshow()

let oldPath = document.location.pathname

presence.on('UpdateData', async () => {
  const baseUrl = document.querySelector('link[hreflang=fr-fr]')!.getAttribute('href')!
  const { href, pathname } = new URL(baseUrl)
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
    // usePresenceName,
    // useChannelName,
    // usePrivacyMode,
    // usePoster,
    // useButtons,
  ] = [
    getSetting<string>('lang', 'en'),
    // getSetting<boolean>('usePresenceName'),
    // getSetting<boolean>('useChannelName'),
    // getSetting<boolean>('usePrivacyMode'),
    // getSetting<boolean>('usePoster'),
    // getSetting<number>('useButtons'),
  ]

  // Update strings if user selected another language.
  if (!checkStringLanguage(newLang))
    return

  if (oldPath !== pathname) {
    oldPath = pathname
    // slideshow.deleteAllSlides()
  }

  let useSlideshow = false
  const routeKey = document.querySelector('meta[name="custom:route_key"]')!.getAttribute('content')!

  switch (true) {
    /* HOMEPAGE
    https://www.tf1.fr/ (France)
    https://www.tf1.fr/fr-be/ (Belgium)
    https://www.tf1.fr/fr-ch/ (Switzerland)
    */
    case routeKey === 'HOME': {
      presenceData.details = strings.browsing
      presenceData.state = strings.viewHome
      break
    }
    /* ACCOUNT & PROFILE SWITCHING
    https://www.tf1.fr/fr-be/mon-compte (Account settings)
    https://www.tf1.fr/fr-be/profils (Switch profiles)
    */
    case ['PROFILE', 'ACCOUNT'].includes(routeKey): {
      presenceData.details = strings.browsing
      presenceData.state = strings.viewAccount
      break
    }
    case ['CATEGORY'].includes(routeKey): {
      const category = document.querySelector('meta[name=keywords]')?.getAttribute('content')?.split(', ')[0]
      presenceData.details = category || strings.browsing
      presenceData.state = category ? strings.viewCategory.replace(':', '') : strings.viewACategory
      break
    }
    case routeKey === 'PROGRAM': {
      // Exemple de récupération des données API (à adapter selon l'intégration réelle)
      const mediaId = pathParts[2]
      const apiResponse = await fetch(`https://www.tf1.fr/graphql/fr-be/web?id=a38bd8c4326fc54edab69c78de0223b1380aaebc&variables=%7B%22programSlug%22%3A%22${mediaId}%22%2C%22isOrderActionEnabled%22%3Atrue%7D`)
        .then(r => r.json())
        .catch(() => null)
      const item = apiResponse?.data?.callToActionByProgramSlug?.items?.[0]
      const name = item?.video?.program?.name || strings.browsing
      const subLabel = item?.video?.program?.decoration?.subLabel || ''
      const typology = item?.video?.program?.typology || ''
      const programImage = document.querySelector('img[data-testid=program-page-cover-logo]')!.getAttribute('src')!
      presenceData.details = name
      presenceData.state = [subLabel, typology].filter(Boolean).join(' • ')

      /* presenceData.largeImageKey = await getThumbnail(
            logo,
            cropPreset.squared,
            getColor("gradient"),
        ) */
      presenceData.largeImageKey = await generateImageWithBackground(programImage)
      break
    }
    case routeKey === 'VIDEO': {
      break
    }
    case routeKey === 'LIVE': {
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
