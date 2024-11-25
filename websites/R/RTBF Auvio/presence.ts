import {
	stringsMap,
	getAdditionnalStrings,
	LargeAssets,
	//getLocalizedAssets,
	exist,
	limitText,
	adjustTimeError,
	getChannel,
	getThumbnail,
	cropPreset,
	colorsMap
} from "./util";

const presence = new Presence({
		clientId: "1241444837476274268",
	}),
	browsingTimestamp = Math.floor(Date.now() / 1000),
	getStrings = async () => {
		return presence.getStrings(
			stringsMap,
			await presence.getSetting<string>("lang").catch(() => "en")
		);
	},
	slideshow = presence.createSlideshow();

let oldLang: string = null,
	strings: Awaited<ReturnType<typeof getStrings>>,
	oldPath = document.location.pathname,
	title = "Default Title",
	subtitle = "Default Subtitle",
	category = "Default Category";

presence.on("UpdateData", async () => {
	const { /*hostname, href,*/ pathname } = document.location,
		pathParts = pathname.split("/"),
		presenceData: PresenceData = {
			name: "Auvio",
			largeImageKey: LargeAssets.Auvio, // Default
			largeImageText: "RTBF Auvio",
			type: ActivityType.Watching,
		},
		[
			lang,
			usePresenceName,
			//useChannelName,
			usePrivacyMode,
			useTimestamps,
			useButtons,
			usePoster,
		] = await Promise.all([
			presence.getSetting<string>("lang").catch(() => "en"),
			presence.getSetting<boolean>("usePresenceName"),
			//presence.getSetting<boolean>("useChannelName"),
			presence.getSetting<boolean>("usePrivacyMode"),
			presence.getSetting<boolean>("useTimestamps"),
			presence.getSetting<number>("useButtons"),
			presence.getSetting<boolean>("usePoster"),
		]);

	if (oldLang !== lang || !strings) {
		oldLang = lang;
		strings = getAdditionnalStrings(lang, await getStrings());
	}

	if (oldPath !== pathname) {
		oldPath = pathname;
		slideshow.deleteAllSlides();
	}

	switch (true) {
		/* 
		PODCAST PLAYER 

		When a podcast is played, it appears in an audio player at the bottom of the screen. 
		Once a podcast has been launched, it is visible at all times throughout the site until the website is refreshed.
		*/
		case exist("#audioPlayerContainer") &&
			document
				.querySelector("#PlayerUIAudioPlayPauseButton")
				.getAttribute("aria-label") === "pause": {
			const firstLine = exist(".PlayerUIAudio_titleText__HV4Y2") ? document.querySelector(
					".PlayerUIAudio_titleText__HV4Y2"
				).textContent : "",
				secondLine = exist(".PlayerUIAudio_subtitle__uhGA4") ? document.querySelector(
					".PlayerUIAudio_subtitle__uhGA4"
				).textContent : "",
				duration = exist(".PlayerUIAudio_duration__n7hxV") ? document.querySelector(
					".PlayerUIAudio_duration__n7hxV"
				).textContent : "";

			/* 
			RADIO LIVE FEED 
			
			Direct radios are in the same place as podcasts, and play in the same audio player. 
			The only difference is in the duration field, which is equal to “direct”, or the back to direct button if in deferred mode.
			*/
			if (duration === "DIRECT" || exist("#PlayerUIAudioGoToLiveButton")) {
				const channelName = firstLine.includes(" - ")
						? firstLine.split(" - ")[0]
						: firstLine.match(/^\w+/)[0],
					coverArt = decodeURIComponent(
						document
							.querySelector(".PlayerUIAudio_logoContainer__6ffGY > span > img")
							.getAttribute("src")
							.replace("/_next/image?url=", "")
							.split("&w")[0]
					);

				presenceData.name =
				usePrivacyMode || !usePresenceName
						? strings.aRadio
						: getChannel(channelName).channel;
				presenceData.type = ActivityType.Listening;

				presenceData.smallImageKey = usePrivacyMode
					? LargeAssets.Privacy
					: LargeAssets.Listening;
				presenceData.smallImageText = usePrivacyMode ? strings.privacy : strings.play;

				if (usePrivacyMode)
					presenceData.details = `${strings.listening} ${strings.aRadio}`;
				else if (Date.now() % 2 === 0 || secondLine === "") {
					/* RADIO SHOW NAME 
					
					The first line of the audio player is the name of the program with which it is presented.
					*/

					presenceData.details =
						firstLine.replace(/\(([^()]+)\)(?!.*\([^()]+\))/, "").trim() ||
						firstLine;
					presenceData.state =
						(firstLine.includes(" - ")
							? firstLine
									.split(" - ")[1]
									.match(/\(([^()]+)\)(?!.*\([^()]+\))/)
									?.pop()
							: "") || "";

					presenceData.largeImageKey = coverArt.includes(
						"https://ds.static.rtbf.be/default/"
					)
						? // Must not match default auvio image https://ds.static.rtbf.be/default/image/770x770/default-auvio_0.jpg
						  getChannel(channelName).logo
						: await getThumbnail(
								coverArt,
								cropPreset.squared,
								getChannel(channelName).color
						  );
					presenceData.largeImageText += " - Radio";
				} else {
					/* RADIO SONG NAME 
					
					The second line shows the music currently playing on the radio, with the artist in brackets.
					Sometimes no music is played and it's just an audio program.
					*/

					if (secondLine.match(/\(([^()]+)\)(?!.*\([^()]+\))/)) {
						// If it has parentheses, it's probably a song.
						presenceData.details = secondLine
							.replace(/\(([^()]+)\)(?!.*\([^()]+\))/, "")
							.trim();
						presenceData.state =
							secondLine.match(/\(([^()]+)\)(?!.*\([^()]+\))/).pop() || "";
					} else {
						// If it is not, it's probably an audio program
						presenceData.details =
							secondLine.length > 30
								? secondLine.slice(0, secondLine.slice(0, 30).lastIndexOf(" "))
								: secondLine;
						presenceData.state =
							secondLine.length > 30
								? secondLine.slice(presenceData.details.length).trim()
								: "";
					}

					presenceData.largeImageKey = firstLine.includes(" - ")
						? getChannel(channelName).logo
						: await getThumbnail(
								coverArt,
								cropPreset.squared,
								getChannel(channelName).color
						  );
					presenceData.largeImageText += " - Radio";
				}
			} else {
				/* 
				VOD PODCAST 
				
				Podcasts can be original programs or past broadcasts.
				*/
				presenceData.name =
					usePresenceName &&
					!usePrivacyMode
						? firstLine
						: strings.aPodcast;
				presenceData.type = ActivityType.Listening;

				presenceData.details =
					!usePrivacyMode
						? firstLine
						: `${strings.listening} ${strings.aPodcast}`;

				presenceData.state =
					!usePrivacyMode ? secondLine : "";

				presenceData.smallImageKey = usePrivacyMode
					? LargeAssets.Privacy
					: LargeAssets.Listening;
				presenceData.smallImageText = usePrivacyMode ? strings.privacy : strings.play;

				if (usePoster) {
					/*const progress =
						presence.timestampFromFormat(duration.split("/")[0]) /
						presence.timestampFromFormat(duration.split("/")[1]);*/

					presenceData.largeImageKey = await getThumbnail(
						decodeURIComponent( // the url is a weird relative encoded link
							document
								.querySelector(
									".PlayerUIAudio_logoContainer__6ffGY > span > img"
								)
								.getAttribute("src")
								.replace("/_next/image?url=", "")
								.split("&w")[0]
						),
						cropPreset.squared,
						getChannel("default").color
					);
				}
				if (!usePrivacyMode) presenceData.largeImageText += " - Podcasts";
			}
			break;
		}
		/* HOME PAGE, CATEGORY & CHANNEL PAGE

		to do:
		- color outline per categories

		(ex: https://auvio.rtbf.be/categorie/sport-9 or https://auvio.rtbf.be/chaine/la-une-1) */
		case [
			"categorie",
			"direct", // Considered as category
			"podcasts", // Considered as category
			"kids", // Considered as category
			"mon-auvio",
			"chaine",
			"mot-cle",
			"premium"
		].includes(pathParts[1]) || pathname === "/": {

			presenceData.details = strings.browsing;

			presenceData.smallImageKey = LargeAssets.Binoculars;
			presenceData.smallImageText = strings.browsing;

			if (usePrivacyMode) {
				presenceData.state = strings.viewAPage;
	
				presenceData.smallImageKey = LargeAssets.Privacy;
				presenceData.smallImageText = strings.privacy;
			} else if (pathname === "/") {
					// HOME PAGE
					presenceData.state = strings.viewHome;
					if (useTimestamps) presenceData.startTimestamp = browsingTimestamp;
				} else {
					// CATEGORY AND CHANNEL PAGE
					const categoryTitle = document.querySelector("h1").textContent;

					presenceData.details = pathParts[1] === "podcasts"
						? `${categoryTitle} & Radios`
						: categoryTitle;

					switch (pathParts[1]) {
						case "chaine": {
							presenceData.state = strings.viewChannel.replace(":", "");

							presenceData.largeImageKey = getChannel(categoryTitle).logo;
							presenceData.largeImageText = getChannel(categoryTitle).channel;
							break;
						}
						case "mon-auvio": {
							presenceData.state = strings.viewPage.replace(":", "");
							break;
						}
						default: {
							presenceData.state = strings.viewCategory.replace(":", "");

							if (usePoster) {

								presenceData.largeImageKey = LargeAssets.Logo;
								presenceData.largeImageText = `Catégorie ${categoryTitle} sur Auvio`;

								const selector = exist("img.TileProgramPoster_hoverPicture__v5RJX")
										? "img.TileProgramPoster_hoverPicture__v5RJX" // If programs cover art are in portrait
										: "img.TileMedia_hoverPicture__RGh_m";// If programs cover art are in landscape
										
								for (let index = 0; index < 5/*document.querySelector(".swiper-wrapper").childElementCount*/; index++) {
									const tempData = structuredClone(presenceData), // Deep copy
									mediaTitle = document.querySelectorAll(selector)[index]?.getAttribute("title") || index.toString();
									tempData.largeImageKey = await getThumbnail(
										decodeURIComponent(
											document
												.querySelectorAll(selector)
												[index].getAttribute("src")
												.replace("/_next/image?url=", "")
												.split("&w")[0]
										),
										exist("img.TileProgramPoster_hoverPicture__v5RJX") ? cropPreset.vertical : cropPreset.horizontal,
										colorsMap.get(categoryTitle.toLowerCase()) || colorsMap.get("")

									);
									if (mediaTitle !== index.toString()) {
										tempData.largeImageText = " sur Auvio";
										tempData.largeImageText = limitText(mediaTitle, 128 - tempData.largeImageText.length) + tempData.largeImageText;
									}
									slideshow.addSlide(mediaTitle, tempData, 5000);
								}
							}
						break;
						}
					}
				}
		break;
		}

		/* RESEARCH (Page de recherche)

		(https://auvio.rtbf.be/explorer) */
		case ["explorer"].includes(pathParts[1]): {

			const searchQuery = (document.querySelector("input.PageContent_inputSearch__8B4AC") as HTMLInputElement).value;

			if (searchQuery !== "") {
				presenceData.details = strings.browsing;
				presenceData.state = `${strings.searchFor} ${searchQuery}`;
			} else {
				presenceData.details = strings.browsing;
				presenceData.state = strings.searchSomething;
			}
			presenceData.smallImageKey = Assets.Search;
			presenceData.smallImageText = strings.search;

			break;
		}

		/* ACCOUNT & ACCOUNT SETTINGS PAGE

		(ex: https://auvio.rtbf.be/mes_informations) */
		case [
			"mes_informations",
			"controle_parental",
			"portabilite",
			"mes_offres_premium",
			"langues_sous_titres",
			"parametres_lecture",
		].includes(pathParts[1]): {
			presenceData.details = usePrivacyMode
				? strings.browsing
				: document.querySelector(".UserGateway_title__PkVAb").textContent;
			presenceData.state = usePrivacyMode ? strings.viewAPage : strings.viewAccount;

			presenceData.smallImageKey = usePrivacyMode || document.querySelector(".HeaderUser_text__tpHR7").textContent.toLowerCase().includes("se connecter")
				? LargeAssets.Binoculars
				: document
						.querySelector(".HeaderUser_avatar__pbBy2 > span > img")
						.getAttribute("src");
			presenceData.smallImageText = usePrivacyMode
				? strings.browsing
				: document.querySelector(".HeaderUser_text__tpHR7").textContent;

			presenceData.largeImageKey = LargeAssets.Logo;
			break;
		}
		case ["media", "live", "emission"].includes(pathParts[1]): {
			let breadcrumbData, mediaData;
			if (usePrivacyMode) {
				if (!exist("#player")) {
					presenceData.details = strings.browsing;
					presenceData.state = strings.viewAPage;
				} else {
					switch (true) {
						case pathParts[1] === "media": {
							presenceData.state = strings.watchingMovie;
							break;
						}
						case pathParts[1] === "emission": {
							presenceData.state = strings.watchingShow;
							break;
						}
						case pathParts[1] === "live": {
							presenceData.state = strings.watchingLive;
							break;
						}
					}
					presenceData.details = "watch";
				}
			} else {
				// Retrieving JSON

				for (
					let i = 0;
					i <
					document.querySelectorAll("script[type='application/ld+json']")
						.length;
					i++
				) {
					const data = JSON.parse(
						document.querySelectorAll("script[type='application/ld+json']")[i]
							.textContent
					);
					if (["BreadcrumbList"].includes(data["@type"])) breadcrumbData = data;
					if (["Movie", "Episode", "BroadcastEvent"].includes(data["@type"]))
						mediaData = data;
				}

				/* Processing title

					*/
				title = document.querySelectorAll("div.DetailsTitle_title__mdRHD")[
					document.querySelectorAll("div.DetailsTitle_title__mdRHD").length - 1
				].textContent;
				if (exist("div.DetailsTitle_subtitle__D30rn")) {
					title = title.replace(
						document.querySelectorAll("div.DetailsTitle_subtitle__D30rn")[
							document.querySelectorAll("div.DetailsTitle_subtitle__D30rn")
								.length - 1
						].textContent,
						""
					); // Subtitle is nested in the same div as the title..
					if (
						title.toLowerCase() ===
						breadcrumbData.itemListElement[
							breadcrumbData.itemListElement.length - 1
						].name.toLowerCase()
					) {
						// If so, it means that the title is more like a topic and the subtitle is more relevant is this case
						title = document.querySelectorAll(
							"div.DetailsTitle_subtitle__D30rn"
						)[
							document.querySelectorAll("div.DetailsTitle_subtitle__D30rn")
								.length - 1
						].textContent;
					}
				}

				const bChannelCategoryShown =
						document.querySelectorAll(
							".DetailsTitle_channelCategory__vh_cY > p"
						).length > 1,
					channelCategory = bChannelCategoryShown
						? document.querySelectorAll(
								".DetailsTitle_channelCategory__vh_cY > p"
						  )[0].textContent
						: "default";

				if (!exist("#player")) {
					/*
						MEDIA PAGE
					*/
					subtitle = bChannelCategoryShown ? `${channelCategory} - ` : "";
					subtitle += document.querySelector("p.PictoBar_text__0Y_kv")
						? document.querySelector("p.PictoBar_text__0Y_kv").textContent
						: ""; // Get Duration
					if (breadcrumbData) {
						for (let i = 1; i < breadcrumbData.itemListElement.length; i++) {
							// Get Genres
							if (breadcrumbData.itemListElement[i].name !== title) {
								subtitle += ` - ${breadcrumbData.itemListElement[
									i
								].name.replace(/s$/i, "")}`;
							}
						}
					}

					if (["live"].includes(pathParts[1])) {
						category = "direct";
						if (exist(".LiveCountdown_container__zxHMI")) {
							const countdown = exist(".LiveCountdown_countdown__vevrl")
								? document.querySelector(".LiveCountdown_countdown__vevrl")
										.textContent
								: "";
							presenceData.details = title;

							if (Date.now() % 2 === 0 && exist(".PictoBar_soon__g_vHQ"))
								presenceData.state = `${strings.startsIn} ${countdown}`;
							else {
								presenceData.state = document
									.querySelector(".PictoBar_soon__g_vHQ")
									.textContent.replace("|", "");
							}

							presenceData.smallImageKey = LargeAssets.Waiting;
							presenceData.smallImageText = strings.waitingLive;
						} else {
							presenceData.details = title;
							presenceData.state = subtitle;

							presenceData.smallImageKey = LargeAssets.Binoculars;
							presenceData.smallImageText = strings.browsing;
						}
					} else {
						presenceData.details = title;
						presenceData.state = subtitle;

						presenceData.smallImageKey = LargeAssets.Binoculars;
						presenceData.smallImageText = strings.browsing;
					}

					if (usePoster) {
						presenceData.largeImageKey = await getThumbnail(
							mediaData.image || mediaData.broadcastOfEvent.image.url,
							cropPreset.horizontal,
							getChannel(channelCategory).color
						);
					}

					presenceData.largeImageText = breadcrumbData
						? breadcrumbData.itemListElement[
								breadcrumbData.itemListElement.length - 1
						  ].name
						: "";
				} else {
					/* 
						MEDIA PLAYER PAGE
					*/
					if (document.querySelector("#ui-wrapper > div")) {
						// Update the variables only if the overlay is visible and the elements are found
						title =
							document.querySelector(".TitleDetails_title__vsoUq")
								?.textContent || title;
						subtitle =
							document.querySelector(".TitleDetails_subtitle__y1v4e")
								?.textContent || subtitle;
						category =
							document.querySelector(".TitleDetails_category__Azvos")
								?.textContent || category;
					}

					const video = document.querySelectorAll(
						"div.redbee-player-media-container > video"
					)[
						document.querySelectorAll(
							"div.redbee-player-media-container > video"
						).length - 1
					] as HTMLVideoElement;
					//let progress = video.currentTime / video.duration;

					if (usePresenceName) presenceData.name = title;

					if (useTimestamps) {
						if(video.paused) {
							presenceData.startTimestamp = browsingTimestamp;
							delete presenceData.endTimestamp;
						} else {
							presenceData.startTimestamp = adjustTimeError(presence.getTimestampsfromMedia(video)[0], 5);
							presenceData.endTimestamp = adjustTimeError(presence.getTimestampsfromMedia(video)[1], 5);
						}
					}
						

					/* LIVE VIDEO PLAYER */
					if (["live"].includes(pathParts[1])) {
						/*progress =
							parseFloat(
								(
									document.querySelector(
										".PlayerUITimebar_timebarNow__HoN7c"
									) as HTMLElement
								).style.width.replace("%", "")
							) / 100;*/

						presenceData.details = title;

						if (Date.now() % 2 === 0) {
							presenceData.state = bChannelCategoryShown
								? `${strings.watchingLive} sur ${channelCategory}`
								: `${strings.watchingLive} sur Auvio`;
						} else presenceData.state = subtitle;

						/*if (
							document.querySelector(".sas-ctrl-countdown").textContent !== ""
						) {
							presenceData.smallImageKey = getLocalizedAssets(lang, "Ad");
							presenceData.smallImageText = strings.watchingAd;
						} else */if (["direct"].includes(category.toLowerCase())) {
							presenceData.smallImageKey = video.played
								? Assets.Live
								: Assets.Pause;
							presenceData.smallImageText = video.played
								? strings.live
								: strings.pause;
						} else if (category.toLowerCase() === "en différé") {
							presenceData.smallImageKey = video.played
								? LargeAssets.Deffered
								: Assets.Pause;
						}
						presenceData.smallImageText = video.played
							? strings.deferred
							: strings.pause;

						/* VOD VIDEO PLAYER */
					} else {
						presenceData.details = title;
						presenceData.state = bChannelCategoryShown
							? `${channelCategory} - ${subtitle}`
							: subtitle;

						/*if (
							document.querySelector(".sas-ctrl-countdown")?.textContent !== ""
						) {
							presenceData.smallImageKey = getLocalizedAssets(lang, "Ad");
							presenceData.smallImageText = strings.watchingAd;
						} else {*/
							presenceData.smallImageKey = video.played
								? Assets.Play
								: Assets.Pause;
							presenceData.smallImageText = video.played
								? strings.play
								: strings.pause;
						//}
					}

					if (usePoster) {
						presenceData.largeImageKey = await getThumbnail(
							mediaData.image || mediaData.broadcastOfEvent.image.url,
							cropPreset.horizontal,
							getChannel(channelCategory).color
						);
					}
					presenceData.largeImageText += document.querySelector(
						"div.DetailsTitle_channelCategory__vh_cY"
					)
						? ` - ${
								document.querySelector(
									"div.DetailsTitle_channelCategory__vh_cY"
								).textContent
						  }`
						: "";
				}
			}
			break;
		}

		// In case we need a default
		default: {
			presenceData.details = strings.viewAPage;
			presenceData.state = pathname;
			break;
		}
	}

	if ((presenceData.startTimestamp || presenceData.endTimestamp) && !useTimestamps) {
		delete presenceData.startTimestamp;
		delete presenceData.endTimestamp;
	}
	if (presenceData.details === "") delete presenceData.details;
	if (presenceData.state === "") delete presenceData.state;

	if ((!useButtons || usePrivacyMode) && presenceData.buttons)
		delete presenceData.buttons;

	if (slideshow.getSlides().length > 0) {
		presence.setActivity(slideshow);
		console.log(slideshow);
	} else if (presenceData.details) presence.setActivity(presenceData);
	else presence.clearActivity();
});
