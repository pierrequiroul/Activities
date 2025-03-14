import { Assets } from 'premid'

const presence = new Presence({
  clientId: '666412985513672715',
})
const browsingTimestamp = Math.floor(Date.now() / 1000)
const strings = presence.getStrings({
  play: 'general.playing',
  pause: 'general.paused',
})

// ! Songs timestamp will reset on new song (see further below)
let songTimestamp = Math.floor(Date.now() / 1000)
let currentTitle = ''
let lastTitle = ''

enum ActivityAssets {
  Gold = 'https://cdn.rcd.gg/PreMiD/websites/O/OnlyHit/assets/0.png',
  Logo = 'https://cdn.rcd.gg/PreMiD/websites/O/OnlyHit/assets/1.png',
  Japan = 'https://cdn.rcd.gg/PreMiD/websites/O/OnlyHit/assets/2.png',
  Kpop = 'https://cdn.rcd.gg/PreMiD/websites/O/OnlyHit/assets/3.png',
}

presence.on('UpdateData', async () => {
  const presenceData: PresenceData = {}
  const [format1, format2, showElapsed] = await Promise.all([
    presence.getSetting<string>('sFormat1'),
    presence.getSetting<string>('sFormat2'),
    presence.getSetting<boolean>('tElapsed'),
  ])

  // ! Merch website
  if (document.location.hostname === 'onlyhit.merchforall.com') {
    //* Show timestamp if the setting is enabled and set largeImageKey
    if (showElapsed)
      presenceData.startTimestamp = browsingTimestamp

    presenceData.largeImageKey = ActivityAssets.Logo
    presenceData.smallImageKey = Assets.Reading

    //* If they have site information enabled
    if (document.location.hash.includes('/cart')) {
      presenceData.details = 'Store - Viewing cart'
    }
    else if (document.location.pathname === '/') {
      if (document.querySelector('.popup-container.active')) {
        presenceData.details = 'Store - Viewing product:'
        presenceData.state = document.querySelector(
          '.popup-container.active .product-title',
        )?.textContent
      }
      else {
        presenceData.details = 'Browsing through'
        presenceData.state = 'the store...'
      }
    }
  }
  else {
    // ! Normal website
    //* Set largeImageKey to the radio type
    switch (document.querySelector('.stream-name')?.textContent) {
      case 'OnlyHit Gold':
        presenceData.largeImageKey = ActivityAssets.Gold
        break
      case 'OnlyHit Japan':
        presenceData.largeImageKey = ActivityAssets.Japan
        break
      case 'OnlyHit K-Pop':
        presenceData.largeImageKey = ActivityAssets.Kpop
        break
      default:
        presenceData.largeImageKey = ActivityAssets.Logo
        break
    }

    //* Get track information
    const artist = document.querySelector('.artist')?.textContent
    const title = document.querySelector('.title')?.textContent
    const paused = document.querySelector<HTMLElement>('.fa-pause.pause-button')?.style.cssText === 'display: none;'

    //* Set state details and image to track information.
    presenceData.details = format1
      .replace('%song%', title ?? '')
      .replace('%artist%', artist ?? '')
    presenceData.state = format2
      .replace('%song%', title ?? '')
      .replace('%artist%', artist ?? '')
    presenceData.smallImageKey = paused ? Assets.Pause : Assets.Play
    presenceData.smallImageText = paused
      ? (await strings).pause
      : (await strings).play

    //* Refresh timestamp if a new song is playing
    currentTitle = title ?? ''
    if (currentTitle !== lastTitle) {
      lastTitle = currentTitle
      songTimestamp = Math.floor(Date.now() / 1000)
    }

    //* Show timestamp if the setting is enabled
    if (showElapsed)
      presenceData.startTimestamp = songTimestamp
    else delete presenceData.startTimestamp

    //* If they have site information enabled
    // ! Check if user is on homepage or not
    if (
      document.location.pathname !== '/'
      && !document.location.pathname.includes('video-version')
    ) {
      //* Show timestamp if the setting is enabled
      if (showElapsed)
        presenceData.startTimestamp = browsingTimestamp
      else delete presenceData.startTimestamp

      //* Get page title, and set smallImageText to track information
      const page = document.querySelector('.main_title')?.textContent?.trim()
      presenceData.smallImageText = `"${title}" by ${artist}`

      //* Show page information
      if (document.location.pathname.includes('/contact')) {
        presenceData.details = 'Contacting OnlyHit'
        delete presenceData.state
        presenceData.smallImageKey = Assets.Writing
      }
      else if (page?.includes('Request a Song')) {
        presenceData.details = 'Requesting a song'
        presenceData.state = `for ${page.split(' - ')[0]}`
        presenceData.smallImageKey = Assets.Writing
      }
      else if (document.location.pathname.includes('/programs/')) {
        presenceData.details = 'Viewing program:'
        presenceData.state = page
        presenceData.smallImageKey = Assets.Reading
      }
      else if (document.location.pathname.includes('/programs')) {
        presenceData.details = 'Browsing through'
        presenceData.state = 'the upcoming programs'
        presenceData.smallImageKey = Assets.Reading
      }
      else if (document.location.pathname.includes('/played-tracks')) {
        presenceData.details = 'Browsing through the'
        presenceData.state = 'recently played tracks'
        presenceData.smallImageKey = Assets.Reading
      }
      else if (document.location.pathname.includes('/team/')) {
        presenceData.details = 'Viewing OnlyHit team member:'
        presenceData.state = page
        presenceData.smallImageKey = Assets.Reading
      }
      else if (document.location.pathname.includes('/team')) {
        presenceData.details = 'Viewing the OnlyHit Team'
        delete presenceData.state
        presenceData.smallImageKey = Assets.Reading
      }
      else if (document.location.pathname.includes('/where-to-listen')) {
        presenceData.details = 'Viewing where you can'
        presenceData.state = 'listen to OnlyHit'
        presenceData.smallImageKey = Assets.Reading
      }
      else if (document.location.pathname.includes('/discord-bot')) {
        presenceData.details = 'Viewing the Discord Bot'
        delete presenceData.state
        presenceData.smallImageKey = Assets.Reading
      }
      else if (document.location.pathname.includes('/search')) {
        presenceData.details = 'Searching for:';
        [, presenceData.state] = page?.split('"') ?? []
        presenceData.smallImageKey = Assets.Search
      }
      else {
        //* Show normal page information if there isn't a "special" one set above
        presenceData.details = 'Viewing page:'
        presenceData.state = page
        presenceData.smallImageKey = Assets.Reading
      }
    }
  }

  //* Sets the presenceData, if there is no details it sets empty data (Which will still show "Playing OnlyHit")
  if (presenceData.details)
    presence.setActivity(presenceData)
  else presence.setActivity()
})
