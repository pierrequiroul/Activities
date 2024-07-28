const presence = new Presence({
		clientId: "1241444837476274268",
	}),
	browsingTimestamp = Math.floor(Date.now() / 1000),
	getStrings = async () => {
		return presence.getStrings(
			{
				play: "general.playing",
			pause: "general.paused",
			search: "general.search",
			searchSomething: "general.searchSomething",
			browsing: "general.browsing",
			viewing: "general.viewing",
			viewPage: "general.viewPage",
			viewAPage: "general.viewAPage",
			viewAccount: "general.viewAccount",
			viewChannel: "general.viewChannel",
			viewCategory: "general.viewCategory",
			viewList: "netflix.viewList",
			viewSerie: "general.viewSerie",
			viewShow: "general.viewShow",
			viewMovie: "general.viewMovie",
			buttonViewPage: "general.buttonViewPage",
			watching: "general.watching",
			watchingAd: "youtube.ad",
			watchingLive: "general.watchingLive",
			watchingShow: "general.watchingShow",
			buttonWatchStream: "general.buttonWatchStream",
			buttonWatchVideo: "general.buttonWatchVideo",
			live: "general.live",
			waitingLive: "general.waitingLive",
			waitingLiveThe: "general.waitingLiveThe",
			},
			await presence.getSetting<string>("lang").catch(() => "en")
		);
	};
let oldLang: string = null,
	strings: Awaited<ReturnType<typeof getStrings>>,
	subtitle = "none",
	category = "none";

/*let currentTitle: string,
	liveStatus: string,
	videoStatus: string, // Example of possible statuses
	window.player = { currentTitle, liveStatus, videoStatus };
	
	function updatePlayer(title: string, isLive: string, status: string) {
		player.currentTitle = title;
		player.liveStatus = isLive;
		player.videoStatus = status;
	}
*/
const enum Assets { // Other default assets can be found at index.d.ts
	Logo = "https://i.imgur.com/m2gRowq.png",
	Animated = "",
	Auvio = "https://imgur.com/Ky3l5MZ.png",
	Differed = "https://imgur.com/uvRMlkv.png",
	Waiting = "https://imgur.com/W4XSjjC.png",
	Listening = "https://imgur.com/0yWcS5h.png",
	LaUne = "https://imgur.com/tmFLVEZ.png",
	Tipik = "https://imgur.com/w7nj6WR.png",
	LaTrois = "https://imgur.com/7VaOFVk.png",
	Classic21 = "https://imgur.com/Ocr1zGu.png",
	LaPremiere = "https://imgur.com/Ffjsqzu.png",
	Vivacite = "https://imgur.com/57XKm7C.png",
	Musiq3 = "https://imgur.com/syQuNbG.png",
	Tarmac = "https://imgur.com/cVqhgnM.png",
	Jam = "https://imgur.com/TmXgxdW.png",
	Viva = "https://imgur.com/gSR3YWE.png",
	Ixpe = "https://imgur.com/FGu3BY9.png",
	MediasProx = "https://imgur.com/Roa6C5I.png",
	AB3 = "https://imgur.com/utT3GeJ.png",
	ABXPLORE = "https://imgur.com/lCMetzW.png",
	LN24 = "https://imgur.com/mLQfLVU.png",
	NRJ = "https://imgur.com/ffN5YyQ.png",
	Arte = "https://imgur.com/3IJaVaj.png",
	BRUZZ = "https://imgur.com/SNtrrxL.png",
	BRF = "https://imgur.com/pcdX4gD.png",
	Kids = "https://imgur.com/hCECgHg.png",
}

function getChannel(channel: string) {
	channel = channel.toLowerCase();
	switch (true) {
		case ["la une","laune"].includes(channel): {
			return {
				channel: "La Une",
				type: ActivityType.Watching,
				logo: Assets.LaUne,
			};
		}
		case ["tipik"].includes(channel): {
			return {
				channel: "Tipik",
				type: ActivityType.Watching,
				logo: Assets.Tipik,
			};
		}
		case ["la trois","latrois"].includes(channel): {
			return {
				channel: "La Trois",
				type: ActivityType.Watching,
				logo: Assets.LaTrois,
			};
		}
		case ["classic 21","classic21"].includes(channel): {
			return {
				channel: "Classic 21",
				type: ActivityType.Listening,
				logo: Assets.Classic21,
			};
		}
		case ["la premiere","la première","lapremiere"].includes(channel): {
			return {
				channel: "La Première",
				type: ActivityType.Listening,
				logo: Assets.LaPremiere,
			};
		}
		case ["vivacite","vivacité"].includes(channel): {
			return {
				channel: "Vivacité",
				type: ActivityType.Listening,
				logo: Assets.Vivacite,
			};
		}
		case ["musiq3"].includes(channel): {
			return {
				channel: "Musiq3",
				type: ActivityType.Listening,
				logo: Assets.Musiq3,
			};
		}
		case ["tarmac"].includes(channel): {
			return {
				channel: "Tarmac",
				type: ActivityType.Listening,
				logo: Assets.Tarmac,
			};
		}
		case ["jam"].includes(channel): {
			return {
				channel: "Jam",
				type: ActivityType.Listening,
				logo: Assets.Jam,
			};
		}
		case ["viva"].includes(channel): {
			return {
				channel: "Viva+",
				type: ActivityType.Listening,
				logo: Assets.Viva,
			};
		}
		case ["ixpe"].includes(channel): {
			return {
				channel: "Ixpé",
				type: ActivityType.Watching,
				logo: Assets.Ixpe,
			};
		}
		case ["medias de proximite","médias de proximité"].includes(channel): {
			return {
				channel: "Médias de proximité",
				type: ActivityType.Watching,
				logo: Assets.MediasProx,
			};
		}
		case ["ab3"].includes(channel): {
			return {
				channel: "AB3",
				type: ActivityType.Watching,
				logo: Assets.AB3,
			};
		}
		case ["abxplore"].includes(channel): {
			return {
				channel: "ABXPLORE",
				type: ActivityType.Watching,
				logo: Assets.ABXPLORE,
			};
		}
		case ["ln24"].includes(channel): {
			return {
				channel: "LN24",
				type: ActivityType.Watching,
				logo: Assets.LN24,
			};
		}
		case ["nrj"].includes(channel): {
			return {
				channel: "NRJ",
				type: ActivityType.Watching,
				logo: Assets.NRJ,
			};
		}
		case ["arte"].includes(channel): {
			return {
				channel: "Arte",
				type: ActivityType.Watching,
				logo: Assets.Arte,
			};
		}
		case ["bruzz"].includes(channel): {
			return {
				channel: "BRUZZ",
				type: ActivityType.Watching,
				logo: Assets.BRUZZ,
			};
		}
		case ["brf"].includes(channel): {
			return {
				channel: "BRF",
				type: ActivityType.Watching,
				logo: Assets.BRF,
			};
		}
		case ["kids"].includes(channel): {
			return {
				channel: "RTBF Auvio",
				type: ActivityType.Watching,
				logo: Assets.Kids,
			};
		}
		default: {
			return {
				channel: "RTBF Auvio",
				type: ActivityType.Watching,
				logo: Assets.Auvio,
			};
		}
	}
}

function exist(selector: string) {
	return document.querySelector(selector) !== null;
}

presence.on("UpdateData", async () => {
	const presenceData: PresenceData = {
			name: "Auvio",
			largeImageKey: Assets.Auvio, // Default
			largeImageText: "RTBF Auvio",
			type: ActivityType.Watching,
		},
		{ /*hostname,*//* href,*/ pathname } = document.location,
		[lang, privacy, time, buttons] = await Promise.all([
			presence.getSetting<string>("lang").catch(() => "en"),
			presence.getSetting<boolean>("privacy"),
			presence.getSetting<boolean>("time"),
			presence.getSetting<number>("buttons"),
		]);

	if (oldLang !== lang || !strings) {
		oldLang = lang;
		strings = await getStrings();
	}

	switch (true) {
		/* MAIN PAGE (Page principale)

	(https://auvio.rtbf.be/) */
		case pathname === "/": {
			presenceData.details = strings.browsing;

			presenceData.smallImageKey = Assets.Reading;
			presenceData.smallImageText = strings.browsing;

			if (time) presenceData.startTimestamp = browsingTimestamp;

			break;
		}

		/* RESEARCH (Page de recherche)

	(https://auvio.rtbf.be/explorer) */
		case ["explorer"].includes(pathname.split("/")[1]): {
			presenceData.details = strings.searchSomething;

			presenceData.smallImageKey = Assets.Search;
			presenceData.smallImageText = strings.search;

			if (time) presenceData.startTimestamp = browsingTimestamp;

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
		].includes(pathname.split("/")[1]): {
			presenceData.details = privacy
				? strings.viewAPage
				: strings.viewAccount;

			presenceData.smallImageKey = Assets.Reading;
			presenceData.smallImageText = strings.browsing;

			if (time) presenceData.startTimestamp = browsingTimestamp;

			break;
		}
		case [
			"media",
			"live",
			"emission",
		].includes(pathname.split("/")[1]): {
			let breadcrumbData,
			mediaData;
			
			// Retrieving JSON
			for (let i = 0; i < document.querySelectorAll("script[type='application/ld+json']").length; i++ ) {
				const data = JSON.parse(document.querySelectorAll("script[type='application/ld+json']")[i].textContent);
				if (["BreadcrumbList"].includes(data["@type"]) )
					breadcrumbData = data;
				if (["Movie","Episode","BroadcastEvent"].includes(data["@type"])) 
					mediaData = data;
			}

			/* Processing title

			*/
			let title = document.querySelectorAll("div.DetailsTitle_title__mdRHD")[document.querySelectorAll("div.DetailsTitle_title__mdRHD").length - 1].textContent;
			if(document.querySelector("div.DetailsTitle_subtitle__D30rn")) {
				if (title === breadcrumbData.itemListElement[breadcrumbData.itemListElement - 1].name) // If so, it means that the title is more like a topic and the subtitle is more relevant is this case
					title = document.querySelectorAll("div.DetailsTitle_subtitle__D30rn")[document.querySelectorAll("div.DetailsTitle_subtitle__D30rn").length - 1].textContent;
				 else 
					title = title.replace(document.querySelectorAll("div.DetailsTitle_subtitle__D30rn")[document.querySelectorAll("div.DetailsTitle_subtitle__D30rn").length - 1].textContent, ""); // Subtitle is nested in the same div as the title..
			}
				
			presenceData.largeImageKey = mediaData.image || mediaData.broadcastOfEvent.image.url;

			if (!exist("div#video-2 > div > div > video")) {
				/*
					MEDIA PAGE
				*/
				let subtitle = document.querySelector("p.PictoBar_text__0Y_kv")
					? document.querySelector("p.PictoBar_text__0Y_kv").textContent
					: ""; // Get Duration
				if (breadcrumbData) {
					for (let i = 1; i < breadcrumbData.itemListElement.length; i++) {// Get Genres
						if(breadcrumbData.itemListElement[i].name !== title)
							subtitle += ` - ${breadcrumbData.itemListElement[i].name.replace(/s$/i, "")}`;
					}
				}

				presenceData.details = privacy ? strings.viewAPage : strings.viewPage;
				presenceData.state = privacy ? "" : title;
				
				presenceData.largeImageText = subtitle;

				presenceData.smallImageKey = Assets.Reading;
				presenceData.smallImageText = strings.browsing;

				//presenceData.state = title;
				//presenceData.largeImageText = breadcrumbData ? breadcrumbData.itemListElement.reverse()[0].name : "";
				if (time) presenceData.startTimestamp = browsingTimestamp;
			} else {
				/* 
					MEDIA PLAYER PAGE
				*/
				const video = document.querySelector("div > video") as HTMLVideoElement;

				if (["live"].includes(pathname.split("/")[1])) {
					presenceData.smallImageKey = video.paused ? Assets.Pause : Assets.Live;
					presenceData.smallImageText = video.paused ? strings.pause : strings.live;
				} else {
					presenceData.smallImageKey = video.paused ? Assets.Pause : Assets.Differed;
					presenceData.smallImageText = video.paused ? strings.pause : "En Différé";
				}

				if (document.querySelector("#ui-wrapper > div")) {
					title = document.querySelector("TitleDetails_title__vsoUq").textContent;
					subtitle = document.querySelector("TitleDetails_subtitle__y1v4e").textContent;
					category = document.querySelector("TitleDetails_category__Azvos").textContent;
				}

				presenceData.name = title;

				presenceData.state = subtitle;
				presenceData.details = category;

				presenceData.largeImageText += document.querySelector("div.DetailsTitle_channelCategory__vh_cY") ? ` - ${document.querySelector("div.DetailsTitle_channelCategory__vh_cY").textContent}` : "";

				presenceData.smallImageKey = video.paused ? Assets.Pause : Assets.Play;
				presenceData.smallImageText = video.paused ? strings.pause : strings.play;

			}
			break;
		}
		/* CATEGORY & CHANNEL PAGE

	(ex: https://auvio.rtbf.be/categorie/sport-9 or https://auvio.rtbf.be/chaine/la-une-1) */
		case [
			"categorie", 
			"direct", // Considered as category
			"podcasts", // Considered as category
			"kids", // Considered as category
			"mon-auvio", 
			"chaine",
			"mot-cle"
		].includes(pathname.split("/")[1]): {
			
			const title = document.querySelector("h1").textContent;
			presenceData.state = privacy
			? ""
			: title;

			switch(true) {
				default: {
					presenceData.details = privacy
						? strings.viewAPage
						: strings.viewCategory;
					break;
				}
				case ["chaine"].includes(pathname.split("/")[1]): {
					presenceData.details = privacy
						? strings.viewAPage
						: strings.viewChannel;
					break;
				}
				case ["mon-auvio"].includes(pathname.split("/")[1]): {
					presenceData.details = privacy
						? strings.viewAPage
						: strings.viewList;
					break;
				}
			}
			
			presenceData.largeImageKey = getChannel(title).logo;
			presenceData.largeImageText = getChannel(title).channel;

			presenceData.smallImageKey = Assets.Reading;
			presenceData.smallImageText = strings.browsing;

			if (time) presenceData.startTimestamp = browsingTimestamp;

			break;
		}
		
		/*
		case exist("div > video"): {
			const channelName = document.querySelector(
				"div.DetailsTitle_channelCategory__vh_cY.DetailsTitle_spacer__vsWzR > a, div.DetailsTitle_channelCategory__vh_cY > div > p"
			).textContent; // Sometimes it's an a or a p

			presenceData.state = document.querySelector(
				"#ui-wrapper .TitleDetails_title__vsoUq"
			).textContent;
			presenceData.largeImageKey = getChannel(channelName).logo;

			if (["live"].includes(pathname.split("/")[1])) {
				presenceData.details = strings.watchingLive;

				if (buttons) {
					presenceData.buttons = [
						{
							label: strings.buttonWatchStream,
							url: href, // We are not redirecting directly to the raw stream, it's only the livestream page
						},
					];
				}

				if (
					document
						.querySelector('button[id="PlayerUIButtonPlayPause"]')
						.getAttribute("aria-label") === "pause"
				) {
					if (
						document
							.querySelector("#ui-wrapper .TitleDetails_liveCategory__Mifvw")
							.textContent.toLowerCase() === "direct"
					) {
						presenceData.smallImageKey = Assets.Live;
						presenceData.smallImageText = strings.watchingLive;
						if (time) {
							presenceData.endTimestamp = presence.getTimestamps(
								browsingTimestamp,
								new Date(
									new Date().setHours(
										parseInt(
											document
												.querySelectorAll(
													'p[class="PlayerUITimebar_text__YB0il"]'
												)[1]
												.textContent.split("h")[0]
										),
										parseInt(
											document
												.querySelectorAll(
													'p[class="PlayerUITimebar_text__YB0il"]'
												)[1]
												.textContent.split("h")[1]
										),
										0,
										0
									)
								).getTime()
							)[1];
						}
					} else {
						presenceData.smallImageKey = Assets.Differed;
						presenceData.smallImageText = strings.watchingLive;
						if (time) presenceData.startTimestamp = browsingTimestamp;

						if (buttons) {
							presenceData.buttons = [
								{
									label: strings.buttonWatchVideo,
									url: href, // We are not redirecting directly to the raw stream, it's only the livestream page
								},
							];
						}
					}
				} else {
					presenceData.smallImageKey = Assets.Pause;
					presenceData.smallImageText = strings.pause;
					delete presenceData.startTimestamp;
				}
			} else {
				presenceData.details = `${strings.watching} ${
					document.querySelector(
						"main > nav > ul:last-of-type > li:nth-of-type(2) > a"
					).textContent
				}`;

				if (time) {
					presenceData.endTimestamp = presence.getTimestampsfromMedia(
						document.querySelector("#player > div > div > div > div > div > video")
					)[1];
				}

				if (buttons) {
					presenceData.buttons = [
						{
							label: strings.buttonWatchVideo,
							url: href, // We are not redirecting directly to the raw stream, it's only the livestream page
						},
					];
				}

				if (
					document
						.querySelector('button[id="PlayerUIButtonPlayPause"]')
						.getAttribute("aria-label") === "pause"
				) {
					presenceData.smallImageKey = Assets.Play;
					presenceData.smallImageText = strings.play;
				} else {
					presenceData.smallImageKey = Assets.Pause;
					presenceData.smallImageText = strings.pause;
					delete presenceData.endTimestamp;
				}
			}
			break;
		}

		/* MOVIE PAGE 
		case exist(
			"div.DetailsTitle_title__mdRHD.DetailsTitle_spacer__vsWzR > h1"
		): {
			// Check if we have a Show Title

			const mediaName = document.querySelector(
					"head > meta:nth-child(19)"
				); // We get the last tag of the breadcrumb list ul (ex: Accueil > Films > Drame > <Title>)
				/*mediaFullName = document.querySelector(
					"div.DetailsTitle_title__mdRHD.DetailsTitle_spacer__vsWzR > h1"
				); // We get the last h1 because div content can be overlayed in desktop

			if (time) presenceData.startTimestamp = browsingTimestamp;

			if (
				["live"].includes(pathname.split("/")[1]) &&
				!exist("#quickResumeButton")
			) {
				presenceData.details = privacy
					? strings.waitingLive
					: `${strings.waitingLiveThe}`;

				presenceData.state = privacy
				? ""
				: mediaName.textContent;
				/*presenceData.state = privacy
					? ""
					: mediaFullName.textContent === "" // Sometimes it has an empty h1 (ex: JT 19h30)
					? mediaName.textContent
					: `${mediaName.textContent} : ${(mediaFullName.textContent =
							mediaFullName.textContent.replace(
								new RegExp(
									mediaName.textContent.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
								),
								""
							))}`;
				
				presenceData.smallImageKey = Assets.Waiting;
				presenceData.smallImageText = strings.waitingLiveThe;

				if (time) {
					presenceData.endTimestamp = presence.getTimestamps(
						0,
						presence.timestampFromFormat(
							document.querySelector("div.LiveCountdown_countdown__vevrl > p")
								.textContent
						)
					)[1];
				}
			} else {
				presenceData.details = privacy
					? strings.viewAPage
					: `${strings.viewPage} ${
							document.querySelector(
								"main > nav > ul:last-of-type > li:nth-of-type(2) > a"
							).textContent
					  }`;

				presenceData.state = privacy ? "" : mediaName.textContent;

				presenceData.smallImageKey = Assets.Viewing;
				presenceData.smallImageText = strings.viewAPage;
			}

			if (exist("div.DetailsTitle_channelCategory__vh_cY > p")) {
				// Detect if we have Channel tag
				presenceData.largeImageKey = getChannel(
					document.querySelector("div.DetailsTitle_channelCategory__vh_cY > p")
						.textContent
				).logo;
				presenceData.largeImageText = getChannel(
					document.querySelector("div.DetailsTitle_channelCategory__vh_cY > p")
						.textContent
				).channel;
			} else {
				presenceData.largeImageKey = Assets.Auvio;
				presenceData.largeImageText = "Auvio";
			}

			break;
		}
		*/
		// In case we need a default
		default: {
			presenceData.details = pathname;
			break;
		}
	}

	if ((presenceData.startTimestamp || presenceData.endTimestamp) && !time) {
		delete presenceData.startTimestamp;
		delete presenceData.endTimestamp;
	}
	if (presenceData.details === "") delete presenceData.details;
	if (presenceData.state === "") delete presenceData.state;

	if ((!buttons || privacy) && presenceData.buttons)
		delete presenceData.buttons;

	if (presenceData.details) presence.setActivity(presenceData);
	else presence.setActivity();
});
