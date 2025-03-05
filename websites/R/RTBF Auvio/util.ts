import { ActivityType } from 'premid'

export const presence = new Presence({
  clientId: '1241444837476274268',
})

export const stringMap = {
  play: 'general.playing',
  pause: 'general.paused',
  search: 'general.search',
  searchSomething: 'general.searchSomething',
  searchFor: 'general.searchFor',
  browsing: 'general.browsing',
  privacy: 'general.privacy',
  // viewing: "general.viewing",
  viewPage: 'general.viewPage',
  viewAPage: 'general.viewAPage',
  viewAccount: 'general.viewAccount',
  viewChannel: 'general.viewChannel',
  viewCategory: 'general.viewCategory',
  viewHome: 'general.viewHome',
  // viewList: "netflix.viewList",
  // viewSerie: "general.viewSerie",
  // viewShow: "general.viewShow",
  // viewMovie: "general.viewMovie",
  // buttonViewPage: "general.buttonViewPage",
  // watching: "general.watching",
  watchingAd: 'youtube.ad',
  watchingLive: 'general.watchingLive',
  watchingShow: 'general.watchingShow',
  watchingMovie: 'general.watchingMovie',
  live: 'general.live',
  listeningTo: 'general.listeningTo',
  waitingLive: 'general.waitingLive',
  waitingLiveThe: 'general.waitingLiveThe',
  home: 'twitch.home',
  ad: 'youtube.ad',
  // Custom strings
  deferred: 'RTBFAuvio.deferred',
  aPodcast: 'RTBFAuvio.aPodcast',
  aRadio: 'RTBFAuvio.aRadio',
  toARadio: 'RTBFAuvio.toARadio',
  toAPodcast: 'RTBFAuvio.toAPodcast',
  privatePlay: 'RTBFAuvio.privatePlay',
  startsIn: 'RTBFAuvio.startsIn',
  endsIn: 'RTBFAuvio.endsIn',
  liveEnded: 'RTBFAuvio.liveEnded',
  on: 'RTBFAuvio.on',
}

// eslint-disable-next-line import/no-mutable-exports
export let strings: Awaited<
  ReturnType<typeof presence.getStrings<typeof stringMap>>
>

let oldLang: string | null = null
let currentTargetLang: string | null = null
let fetchingStrings = false
let stringFetchTimeout: number | null = null

function fetchStrings() {
  if (oldLang === currentTargetLang && strings)
    return
  if (fetchingStrings)
    return
  const targetLang = currentTargetLang
  fetchingStrings = true
  stringFetchTimeout = setTimeout(() => {
    presence.error(`Failed to fetch strings for ${targetLang}.`)
    fetchingStrings = false
  }, 5e3)
  presence.info(`Fetching strings for ${targetLang}.`)
  presence
    .getStrings(stringMap)
    .then((result) => {
      if (targetLang !== currentTargetLang)
        return
      if (stringFetchTimeout)
        clearTimeout(stringFetchTimeout)
      strings = result
      fetchingStrings = false
      oldLang = targetLang
      presence.info(`Fetched strings for ${targetLang}.`)
    })
    .catch(() => null)
}

setInterval(fetchStrings, 3000)
fetchStrings()

/**
 * Sets the current language to fetch strings for and returns whether any strings are loaded.
 */
export function checkStringLanguage(lang: string): boolean {
  currentTargetLang = lang
  return !!strings
}

const settingsFetchStatus: Record<string, number> = {}
const cachedSettings: Record<string, unknown> = {}

function startSettingGetter(setting: string) {
  if (!settingsFetchStatus[setting]) {
    let success = false
    settingsFetchStatus[setting] = setTimeout(() => {
      if (!success)
        presence.error(`Failed to fetch setting '${setting}' in time.`)
      delete settingsFetchStatus[setting]
    }, 2000)
    presence
      .getSetting(setting)
      .then((result) => {
        cachedSettings[setting] = result
        success = true
      })
      .catch(() => null)
  }
}

export function getSetting<E extends string | boolean | number>(
  setting: string,
  fallback: E | null = null,
): E {
  startSettingGetter(setting)
  return (cachedSettings[setting] as E) ?? fallback
}
/*
export function getAdditionnalStrings(
  lang: string,
  strings: typeof stringsMap,
): typeof stringsMap {
  switch (lang) {
    case 'fr-FR': {
      strings.deferred = 'En Différé'
      strings.aPodcast = 'un Podcast'
      strings.aRadio = 'une Radio'
      strings.listening = 'Écoute'
      strings.privacy = 'Lecture privée'
      strings.startsIn = 'Commence dans'
      strings.on = 'sur'

      // Improved translation in context
      strings.viewAPage = 'Regarde une page'
      strings.waitingLive = 'Attend le démarrage du direct'
      strings.watchingLive = 'Regarde un direct'
      break
    }
    case 'nl-NL': {
      strings.deferred = 'Uitgestelde'
      strings.aPodcast = ''
      strings.aRadio = ''
      strings.listening = ''
      strings.privacy = ''
      strings.startsIn = ''
      strings.on = 'op'
      break
    }
    case 'de-DE': {
      strings.deferred = 'Zeitversetzt'
      strings.aPodcast = ''
      strings.aRadio = ''
      strings.listening = ''
      strings.privacy = ''
      strings.startsIn = ''
      strings.on = 'auf'
      break
    }
    default: {
      strings.deferred = 'Deferred'
      strings.aPodcast = 'a Podcast'
      strings.aRadio = 'a Radio'
      strings.listening = 'Listening'
      strings.privacy = 'Private play'
      strings.startsIn = 'Starts in'
      strings.on = 'on'
      break
    }
  }
  return strings
} */

export enum ActivityAssets { // Other default assets can be found at index.d.ts
  Logo = 'https://i.imgur.com/m2gRowq.png',
  Animated = '',
  Auvio = 'https://imgur.com/Ky3l5MZ.png',
  Binoculars = 'https://imgur.com/aF3TWVK.png',
  Privacy = 'https://imgur.com/nokHvhE.png',
  Waiting = 'https://imgur.com/KULD0Ja.png',
  // Media
  ListeningPaused = 'https://imgur.com/6qvsVLa.png',
  ListeningVOD = 'https://imgur.com/m4YOJuH.gif',
  ListeningLive = 'https://imgur.com/8nd4UdO.gif',
  Deferred = 'https://i.imgur.com/uvRMlkv.png',
  DeferredAnimated = 'https://imgur.com/cA3mQhL.gif',
  LiveAnimated = 'https://imgur.com/oBXFRPE.gif',
  // Localized
  AdEn = 'https://cdn.rcd.gg/PreMiD/websites/R/RTLplay/assets/4.png',
  AdFr = 'https://cdn.rcd.gg/PreMiD/websites/R/RTLplay/assets/5.png',
  // Channels
  LaUne = 'https://imgur.com/tmFLVEZ.png',
  Tipik = 'https://imgur.com/w7nj6WR.png',
  LaTrois = 'https://imgur.com/7VaOFVk.png',
  Classic21 = 'https://imgur.com/Ocr1zGu.png',
  LaPremiere = 'https://imgur.com/Ffjsqzu.png',
  Vivacite = 'https://imgur.com/57XKm7C.png',
  Musiq3 = 'https://imgur.com/syQuNbG.png',
  Tarmac = 'https://imgur.com/cVqhgnM.png',
  Jam = 'https://imgur.com/TmXgxdW.png',
  Viva = 'https://imgur.com/gSR3YWE.png',
  Ixpe = 'https://imgur.com/FGu3BY9.png',
  MediasProx = 'https://imgur.com/Roa6C5I.png',
  AB3 = 'https://imgur.com/utT3GeJ.png',
  ABXPLORE = 'https://imgur.com/lCMetzW.png',
  LN24 = 'https://imgur.com/mLQfLVU.png',
  NRJ = 'https://imgur.com/ffN5YyQ.png',
  Arte = 'https://imgur.com/3IJaVaj.png',
  BRUZZ = 'https://imgur.com/SNtrrxL.png',
  BRF = 'https://imgur.com/pcdX4gD.png',
  Kids = 'https://imgur.com/hCECgHg.png',
}

export function getLocalizedAssets(
  lang: string,
  assetName: string,
): ActivityAssets {
  switch (assetName) {
    case 'Ad':
      switch (lang) {
        case 'fr-FR':
          return ActivityAssets.AdFr
        default:
          return ActivityAssets.AdEn
      }
    default:
      return ActivityAssets.Binoculars // Default fallback
  }
}

export function exist(selector: string): boolean {
  return document.querySelector(selector) !== null
}

// Mainly used to truncate largeImageKeyText because the limit is 128 characters
export function limitText(input: string, maxLength = 128): string {
  const ellipsis = ' ...'

  // If input is within limit, return it as is
  if (input.length <= maxLength)
    return input

  // Truncate to 125 characters (leaving room for ellipsis)
  let truncated = input.slice(0, maxLength - ellipsis.length)

  // If the truncated text ends mid-word, remove the partial word
  if (truncated.includes(' '))
    truncated = truncated.slice(0, truncated.lastIndexOf(' '))

  return truncated + ellipsis
}

export function formatDuration(time: string | number) {
  let totalSeconds: number

  if (typeof time === 'string') {
    const parts = time.split(':').map(Number)
    if (parts.length !== 3 || parts.some(Number.isNaN)) {
      throw new Error('Invalid time format. Expected HH:MM:SS')
    }
    const [hours, minutes, seconds] = parts
    totalSeconds = hours! * 3600 + minutes! * 60 + seconds!
  }
  else if (typeof time === 'number') {
    totalSeconds = time
  }
  else {
    throw new TypeError('Invalid input. Expected a string or number.')
  }

  const weeks = Math.floor(totalSeconds / (7 * 24 * 3600))
  const days = Math.floor((totalSeconds % (7 * 24 * 3600)) / (24 * 3600))
  const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  if (weeks > 0) {
    return days > 0 ? `${weeks}s & ${days}j` : `${weeks}s`
  }
  else if (days > 0) {
    return hours > 0 ? `${days}j & ${hours}h` : `${days}d`
  }
  else if (hours > 0) {
    return minutes > 0 ? `${hours}h${minutes < 10 ? `0${minutes}` : minutes}` : `${hours}h`
  }
  else if (minutes > 0) {
    return `${minutes} min`
  }
  else {
    return `${seconds} sec`
  }
}

export const colorsMap = new Map<string, string | number[][]>([
/* Plain color in hexadecimal ex: #ffaa00
Gradient colors in RGB ex: [R, G, B, GradientOffset] */
  // Default colors
  ['', '#ffcc00'],
  ['default', '#ffcc00'],
  // Category colors
  ['series', '#b92561'],
  ['films', '#7e55a5'],
  [
    'animes',
    [
      [255, 226, 63, 0.2],
      [255, 9, 119, 0.5],
      [59, 124, 154, 0.75],
    ],
  ],
  ['sport', '#15c6a4'],
  ['info', '#109aa9'],
  ['kids', '#434b66'],
  ['documentaires', '#345a4a'],
  ['divertissement', '#444d90'],
  [
    'noir jaune belge',
    [
      [7, 7, 7, 0.15],
      [198, 170, 34, 0.45],
      [194, 57, 57, 0.8],
    ],
  ],
  ['lifestyle', '#714e6e'],
  ['culture', '#863d67'],
  ['musique', '#4a6f6f'],
  [
    'lgbtqia+',
    [
      [242, 130, 10, 0.2],
      [142, 171, 102, 0.3],
      [156, 60, 115, 0.6],
      [68, 37, 128, 0.8],
    ],
  ],
  ['decodage médias', '#b26e38'],
  ['archives sonuma', '#663c2a'],
  ['direct', '#e55232'],
  // Channel colors
  ['la une', '#ee372b'],
  ['tipik', '#0df160'],
  ['la deux', '#ec088f'],
  ['la trois', '#9b49a1'],
  ['classic 21', '#8c408a'],
  ['la premiere', '#083e7a'],
  ['vivacite', '#f93308'],
  ['musiq3', '#d63c4d'],
  ['tarmac', '#222222'],
  ['jam', '#222222'],
  ['viva', '#f93308'],
])

interface ChannelInfo {
  channel: string
  type: ActivityType
  logo: ActivityAssets
  color: string | number[][] // Optional property
}

export function getChannel(channel: string): ChannelInfo {
  channel = channel.toLowerCase().replace(/[éè]/g, 'e').replace('-', ' ')
  switch (true) {
    case ['la une', 'laune'].includes(channel): {
      return {
        channel: 'La Une',
        type: ActivityType.Watching,
        logo: ActivityAssets.LaUne,
        color: colorsMap.get('la une')!,
      }
    }
    case ['tipik'].includes(channel): {
      return {
        channel: 'Tipik',
        type: ActivityType.Watching,
        logo: ActivityAssets.Tipik,
        color: colorsMap.get('tipik')!,
      }
    }
    case ['la trois', 'latrois'].includes(channel): {
      return {
        channel: 'La Trois',
        type: ActivityType.Watching,
        logo: ActivityAssets.LaTrois,
        color: colorsMap.get('la trois')!,
      }
    }
    case ['classic 21', 'classic21', 'classic'].includes(channel): {
      return {
        channel: 'Classic 21',
        type: ActivityType.Listening,
        logo: ActivityAssets.Classic21,
        color: colorsMap.get('classic 21')!,
      }
    }
    case ['la premiere', 'lapremiere', 'la'].includes(channel): {
      return {
        channel: 'La Première',
        type: ActivityType.Listening,
        logo: ActivityAssets.LaPremiere,
        color: colorsMap.get('la premiere')!,
      }
    }
    case ['vivacite'].includes(channel): {
      return {
        channel: 'Vivacité',
        type: ActivityType.Listening,
        logo: ActivityAssets.Vivacite,
        color: colorsMap.get('vivacite')!,
      }
    }
    case ['musiq3'].includes(channel): {
      return {
        channel: 'Musiq3',
        type: ActivityType.Listening,
        logo: ActivityAssets.Musiq3,
        color: colorsMap.get('musiq3')!,
      }
    }
    case ['tarmac'].includes(channel): {
      return {
        channel: 'Tarmac',
        type: ActivityType.Listening,
        logo: ActivityAssets.Tarmac,
        color: colorsMap.get('tarmac')!,
      }
    }
    case ['jam'].includes(channel): {
      return {
        channel: 'Jam',
        type: ActivityType.Listening,
        logo: ActivityAssets.Jam,
        color: colorsMap.get('jam')!,
      }
    }
    case ['viva'].includes(channel): {
      return {
        channel: 'Viva+',
        type: ActivityType.Listening,
        logo: ActivityAssets.Viva,
        color: colorsMap.get('viva')!,
      }
    }
    case ['ixpe'].includes(channel): {
      return {
        channel: 'Ixpé',
        type: ActivityType.Watching,
        logo: ActivityAssets.Ixpe,
        color: colorsMap.get('')!,
      }
    }
    case ['ab3'].includes(channel): {
      return {
        channel: 'AB3',
        type: ActivityType.Watching,
        logo: ActivityAssets.AB3,
        color: colorsMap.get('')!,
      }
    }
    case ['abxplore'].includes(channel): {
      return {
        channel: 'ABXPLORE',
        type: ActivityType.Watching,
        logo: ActivityAssets.ABXPLORE,
        color: colorsMap.get('')!,
      }
    }
    case ['ln24'].includes(channel): {
      return {
        channel: 'LN24',
        type: ActivityType.Watching,
        logo: ActivityAssets.LN24,
        color: colorsMap.get('')!,
      }
    }
    case ['nrj'].includes(channel): {
      return {
        channel: 'NRJ',
        type: ActivityType.Watching,
        logo: ActivityAssets.NRJ,
        color: colorsMap.get('')!,
      }
    }
    case ['arte'].includes(channel): {
      return {
        channel: 'Arte',
        type: ActivityType.Watching,
        logo: ActivityAssets.Arte,
        color: colorsMap.get('')!,
      }
    }
    case ['bruzz'].includes(channel): {
      return {
        channel: 'BRUZZ',
        type: ActivityType.Watching,
        logo: ActivityAssets.BRUZZ,
        color: colorsMap.get('')!,
      }
    }
    case ['brf'].includes(channel): {
      return {
        channel: 'BRF',
        type: ActivityType.Watching,
        logo: ActivityAssets.BRF,
        color: colorsMap.get('')!,
      }
    }
    case ['kids'].includes(channel): {
      return {
        channel: 'RTBF Auvio',
        type: ActivityType.Watching,
        logo: ActivityAssets.Kids,
        color: colorsMap.get('')!,
      }
    }
    case [
      'medias de proximite',
      'antenne centre',
      'bx1',
      'bouke',
      'canal zoom',
      'matele',
      'notele',
      'rtc',
      'telemb',
      'telesambre',
      'tv com',
      'tvcom',
      'tv lux',
      'tvlux',
      'vedia',
    ].includes(channel): {
      return {
        channel: 'Médias de proximité',
        type: ActivityType.Watching,
        logo: ActivityAssets.MediasProx,
        color: colorsMap.get('')!,
      }
    }
    default: {
      return {
        channel: 'RTBF Auvio',
        type: ActivityType.Watching,
        logo: ActivityAssets.Auvio,
        color: colorsMap.get('')!,
      }
    }
  }
}

// Adapted veryCrunchy's function from YouTube Presence https://github.com/PreMiD/Presences/pull/8000

export const cropPreset = {
  // Crop values in percent correspond to Left, Right, Top, Bottom.
  squared: [0, 0, 0, 0],
  vertical: [0.22, 0.22, 0, 0.3],
  horizontal: [0.425, 0.025, 0, 0],
}

export async function getThumbnail(
  src: string = ActivityAssets.Logo,
  cropPercentages: typeof cropPreset.squared = cropPreset.squared, // Left, Right, top, Bottom
  borderColor: string | number[][] = colorsMap.get('')!,
  borderWidth = 15,
  progress = 2,
): Promise<string> {
  if (!src.match('data:image')) {
    return new Promise((resolve) => {
      const img = new Image()
      const wh = 320 // Size of the square thumbnail

      img.crossOrigin = 'anonymous'
      img.src = src

      img.onload = async function () {
        let croppedWidth
        let croppedHeight
        let cropX = 0
        let cropY = 0

        // Determine if the image is landscape or portrait
        const isLandscape = img.width > img.height

        if (isLandscape) {
        // Landscape mode: use left and right crop percentages
          const cropLeft = img.width * cropPercentages[0]!
          croppedWidth = img.width - cropLeft - img.width * cropPercentages[1]!
          croppedHeight = img.height
          cropX = cropLeft
        }
        else {
        // Portrait mode: use top and bottom crop percentages
          const cropTop = img.height * cropPercentages[2]!
          croppedWidth = img.width
          croppedHeight = img.height - cropTop - img.height * cropPercentages[3]!
          cropY = cropTop
        }

        // Determine the scale to fit the cropped image into the square canvas
        let newWidth, newHeight, offsetX, offsetY

        if (isLandscape) {
          newWidth = wh - 2 * borderWidth
          newHeight = (newWidth / croppedWidth) * croppedHeight
          offsetX = borderWidth
          offsetY = (wh - newHeight) / 2
        }
        else {
          newHeight = wh - 2 * borderWidth
          newWidth = (newHeight / croppedHeight) * croppedWidth
          offsetX = (wh - newWidth) / 2
          offsetY = borderWidth
        }

        const tempCanvas = document.createElement('canvas')
        tempCanvas.width = wh
        tempCanvas.height = wh
        const ctx = tempCanvas.getContext('2d')!
        // Remap progress from 0-1 to 0.03-0.97
        const remappedProgress = 0.07 + progress * (0.93 - 0.07)

        // 1. Fill the canvas with a black background
        ctx.fillStyle = '#080808'
        ctx.fillRect(0, 0, wh, wh)

        // 2. Draw the radial progress bar
        if (remappedProgress > 0) {
          ctx.beginPath()
          ctx.moveTo(wh / 2, wh / 2)
          const startAngle = Math.PI / 4 // 45 degrees in radians, starting from bottom-right

          ctx.arc(
            wh / 2,
            wh / 2,
            wh,
            startAngle,
            startAngle + 2 * Math.PI * remappedProgress,
          )
          ctx.lineTo(wh / 2, wh / 2)

          if (Array.isArray(borderColor)) {
          // Create a triangular gradient
            const gradient = ctx.createLinearGradient(0, 0, wh, wh)
            for (const colorStep of borderColor) {
              gradient.addColorStop(
                colorStep[3]!, // Use the fourth value as the step position
                `rgba(${colorStep[0]}, ${colorStep[1]}, ${colorStep[2]}, 1)`, // Use RGB, alpha fixed at 1
              )
            }
            ctx.fillStyle = gradient
          }
          else {
          // borderColor for the border
            ctx.fillStyle = borderColor
          }

          ctx.fill()
        }

        // 3. Draw the cropped image centered and zoomed out based on the borderWidth
        ctx.drawImage(
          img,
          cropX,
          cropY,
          croppedWidth,
          croppedHeight,
          offsetX,
          offsetY,
          newWidth,
          newHeight,
        )

        resolve(tempCanvas.toDataURL('image/png'))
      }

      img.onerror = function () {
        resolve(ActivityAssets.Logo)
      }
    })
  }
  else {
    return ActivityAssets.Logo
  }
}
