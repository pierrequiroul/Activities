import { ActivityType } from 'premid'

export const presence = new Presence({
  clientId: '1310744215478730864',
})

export const stringMap = {
  play: 'general.playing',
  pause: 'general.paused',
  search: 'general.search',
  searchSomething: 'general.searchSomething',
  searchFor: 'general.searchFor',
  browsing: 'general.browsing',
  privacy: 'general.privacy',
  viewAPage: 'general.viewAPage',
  viewPage: 'general.viewPage',
  viewAccount: 'general.viewAccount',
  viewCategory: 'general.viewCategory',
  viewHome: 'general.viewHome',
  buttonViewPage: 'general.buttonViewPage',
  buttonWatchVideo: 'general.buttonWatchVideo',
  buttonWatchStream: 'general.buttonWatchStream',
  watchingLive: 'general.watchingLive',
  watchingShow: 'general.watchingShow',
  watchingMovie: 'general.watchingMovie',
  live: 'general.live',
  listeningTo: 'general.listeningTo',
  waitingLive: 'general.waitingLive',
  ad: 'youtube.ad',
  // Custom strings
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

// Sets the current language to fetch strings for and returns whether any strings are loaded.
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

export enum ActivityAssets { // Other default assets can be found at index.d.ts
  Logo = 'https://imgur.com/aWohjs9.png',
  TF1 = 'https://imgur.com/6mE4m6d.png',
  Binoculars = 'https://imgur.com/aF3TWVK.png',
  Privacy = 'https://imgur.com/nokHvhE.png',
  Waiting = 'https://imgur.com/KULD0Ja.png',
  // Media
  ListeningPaused = 'https://imgur.com/6qvsVLa.png',
  ListeningVOD = 'https://imgur.com/m4YOJuH.gif',
  ListeningLive = 'https://imgur.com/8nd4UdO.gif',
  Deferred = 'https://imgur.com/uvRMlkv.png',
  DeferredAnimated = 'https://imgur.com/cA3mQhL.gif',
  LiveAnimated = 'https://imgur.com/oBXFRPE.gif',
  // Localized
  AdEn = 'https://cdn.rcd.gg/PreMiD/websites/R/RTLplay/assets/4.png',
  AdFr = 'https://cdn.rcd.gg/PreMiD/websites/R/RTLplay/assets/5.png',
  // Channels
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

  if (input.length <= maxLength)
    return input

  let truncated = input.slice(0, maxLength - ellipsis.length)

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

export function getColor(string: string) {
  const formattedString = string.toLowerCase().replaceAll(/[éè]/g, 'e').replaceAll(' ', '').replaceAll('-', '')
  const colorsMap = new Map<string, string | number[][]>([
    /* Plain color in hexadecimal ex: #ffaa00
    Gradient colors in RGB ex: [R, G, B, GradientOffset] */
    // Default colors
    ['', '#ffcc00'],
    ['default', '#ffcc00'],
    [
      'gradient',
      [
        [7, 0, 130, 0],
        [1, 1, 245, 1],
      ]
    ],
    // Category colors
    [
      'animes',
      [
        [255, 226, 63, 0.2],
        [255, 9, 119, 0.5],
        [59, 124, 154, 0.75],
      ],
    ],
  ])
  return colorsMap.get(formattedString) ?? colorsMap.get('')
}

interface ChannelInfo {
  channel: string
  type: ActivityType
  logo: ActivityAssets
  color: string | number[][]
  found: boolean
}

export function getChannel(channel: string): ChannelInfo {
  const channelFormatted = channel.toLowerCase().replaceAll(/[éè]/g, 'e').replaceAll('-', '').replaceAll(' ', '')
  switch (true) {
    case ['laune'].includes(channelFormatted): {
      return {
        channel: 'La Une',
        type: ActivityType.Watching,
        logo: ActivityAssets.Logo,
        color: getColor('la une')!,
        found: true,
      }
    }
    default: {
      return {
        channel: 'RTBF Auvio',
        type: ActivityType.Watching,
        logo: ActivityAssets.TF1,
        color: getColor('')!,
        found: false,
      }
    }
  }
}

export const cropPreset = {
  // Crop values in percent correspond to Left, Right, Top, Bottom.
  squared: [0, 0, 0, 0],
  vertical: [0.22, 0.22, 0, 0.3],
  horizontal: [0.40, 0, 0, 0],
}

export async function generateImageWithBackground(
    src: string = ActivityAssets.Logo,
    backgroundColor: string | number[][],
    dezoom: number = 1,
    offsetX: number = 0,
    offsetY: number = 0
): Promise<string> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = src;
        img.crossOrigin = "anonymous"; 

        img.onload = function () {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            if (!ctx) {
                reject(new Error("Impossible d'obtenir le contexte du canvas"));
                return;
            }

            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const pixels = imageData.data;

            let top = canvas.height, bottom = 0, left = canvas.width, right = 0;
            let found = false;

            for (let y = 0; y < canvas.height; y++) {
                for (let x = 0; x < canvas.width; x++) {
                    let index = (y * canvas.width + x) * 4;
                    let alpha = pixels[index + 3]!;

                    if (alpha > 0) {
                        found = true;
                        if (y < top) top = y;
                        if (y > bottom) bottom = y;
                        if (x < left) left = x;
                        if (x > right) right = x;
                    }
                }
            }

            if (!found) {
                reject(new Error("L'image est totalement transparente !"));
                return;
            }

            // Dimensions de la zone visible
            const imgWidth = right - left + 1;
            const imgHeight = bottom - top + 1;

            // Création du canvas final (fond + image centrée)
            const finalSize = Math.max(imgWidth, imgHeight) * 2;
            const outputCanvas = document.createElement("canvas");
            const outputCtx = outputCanvas.getContext("2d");

            if (!outputCtx) {
                reject(new Error("Impossible d'obtenir le contexte du canvas de sortie"));
                return;
            }

            outputCanvas.width = finalSize;
            outputCanvas.height = finalSize;

            // Appliquer le fond
            if (Array.isArray(backgroundColor)) {
                const gradient = outputCtx.createLinearGradient(0, canvas.width, 0, 0);
                backgroundColor.forEach(([r, g, b, offset]) => {
                    gradient.addColorStop(offset!, `rgb(${r}, ${g}, ${b})`);
                });
                outputCtx.fillStyle = gradient;
            } else {
                outputCtx.fillStyle = backgroundColor;
            }
            outputCtx.fillRect(0, 0, finalSize, finalSize);

            // Nouvelle taille de l'image après dézoom
            const scaledWidth = imgWidth / dezoom;
            const scaledHeight = imgHeight / dezoom;

            // Positionner le PNG au centre avec translation
            const destX = (finalSize - scaledWidth) / 2 + offsetX;
            const destY = (finalSize - scaledHeight) / 2 + offsetY;

            // Dessiner le PNG recadré sur le fond
            outputCtx.drawImage(
                canvas, left, top, imgWidth, imgHeight, // Source
                destX, destY, scaledWidth, scaledHeight // Destination
            );

            // Retourne l’image finale en Base64
            resolve(outputCanvas.toDataURL("image/png"));
        };

        img.onerror = (err) => reject(err);
    });
}

export async function getThumbnail(
  src: string = ActivityAssets.Logo,
  cropPercentages: typeof cropPreset.squared = cropPreset.squared, // Left, Right, top, Bottom
  borderColor: string | number[][] = getColor('')!,
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
            const gradient = ctx.createLinearGradient(0, wh, 0, 0)
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