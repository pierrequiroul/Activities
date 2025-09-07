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
    slideshow.deleteAllSlides()
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
    case ['PROGRAM'].includes(routeKey): {
      useSlideshow = true
      const title = document.querySelector('span[aria-current=page]')?.textContent
      let tags: string[] = []
      for (const tag of document.querySelectorAll('div[data-testid=program-cover] li')) {
        if (tag.textContent) tags.push(tag.textContent)
      }
      const description = document.querySelector('p.default-2')?.textContent
      const posterElement = document.querySelector("div[data-testid=program-cover] div.bg-tertiary img")
      const poster = posterElement ? await getThumbnail(posterElement!.getAttribute('src') || '') : ActivityAssets.TF1

      presenceData.details = title
      presenceData.state = `${tags[0]} - ${tags[1]}`

      presenceData.largeImageKey = poster
      presenceData.largeImageText = description

      const presenceDataSlide1 = structuredClone(presenceData) // Deep copy
      presenceDataSlide1.state = `${tags[2]} - ${tags[3]}`

      slideshow.addSlide('poster-image', presenceData, 5000)
      slideshow.addSlide('background-image', presenceDataSlide1, 5000)
      break
    }
    case ['PROGRAM_VIDEOS'].includes(routeKey): {
      useSlideshow = true
      const title = document.querySelector('main a span.px-1')?.textContent
      let tags: string[] = []
      for (const tag of document.querySelectorAll('nav[aria-label="Vous êtes ici"] ol li')) {
        if (tag.textContent) tags.push(tag.textContent)
      }
      if (tags.length >= 3) {
        tags.splice(0, 3)
      } else {
        tags.splice(0, 2)
      }

      presenceData.details = title
      presenceData.state = `${strings.viewing} ${tags.join('・')}`

      for (let count = 0; count < 20; count++) {
        const description = document.querySelectorAll('ul article div.gap-y-1 span')[count]?.textContent;
        const poster = document.querySelectorAll('ul article div.bg-tertiary img')[count]?.getAttribute('src');

        const slide = structuredClone(presenceData);
        slide.largeImageKey = poster ? await getThumbnail(poster, cropPreset.horizontal) : ActivityAssets.TF1;
        slide.largeImageText = description || 'TF1+';
        slideshow.addSlide(count.toString(), slide, 5000);
      }
      console.log(slideshow)
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
