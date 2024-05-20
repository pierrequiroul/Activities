const presence = new Presence({
		clientId: "1241444837476274268",
	}),
	strings = presence.getStrings({
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
	}),
	browsingTimestamp = Math.floor(Date.now() / 1000);

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
		case channel.includes("la une"): {
			return {
				channel: "La Une",
				type: "tv",
				logo: Assets.LaUne,
			};
		}
		case channel.includes("tipik"): {
			return {
				channel: "Tipik",
				type: "tv",
				logo: Assets.Tipik,
			};
		}
		case channel.includes("la trois"): {
			return {
				channel: "La Trois",
				type: "tv",
				logo: Assets.LaTrois,
			};
		}
		case channel.includes("classic 21"): {
			return {
				channel: "Classic 21",
				type: "radio",
				logo: Assets.Classic21,
			};
		}
		case channel.includes("la premiere") || channel.includes("la première"): {
			return {
				channel: "La Première",
				type: "radio",
				logo: Assets.LaPremiere,
			};
		}
		case channel.includes("vivacite") || channel.includes("vivacité"): {
			return {
				channel: "Vivacité",
				type: "radio",
				logo: Assets.Vivacite,
			};
		}
		case channel.includes("musiq3"): {
			return {
				channel: "Musiq3",
				type: "radio",
				logo: Assets.Musiq3,
			};
		}
		case channel.includes("tarmac"): {
			return {
				channel: "Tarmac",
				type: "radio",
				logo: Assets.Tarmac,
			};
		}
		case channel.includes("jam"): {
			return {
				channel: "Jam",
				type: "radio",
				logo: Assets.Jam,
			};
		}
		case channel.includes("viva"): {
			return {
				channel: "Viva+",
				type: "radio",
				logo: Assets.Viva,
			};
		}
		case channel.includes("ixpe") || channel.includes("ixpé"): {
			return {
				channel: "Ixpé",
				type: "tv",
				logo: Assets.Ixpe,
			};
		}
		case channel.includes("medias de proximite") ||
			channel.includes("médias de proximité"): {
			return {
				channel: "Médias de proximité",
				type: "tv",
				logo: Assets.MediasProx,
			};
		}
		case channel.includes("ab3"): {
			return {
				channel: "AB3",
				type: "tv",
				logo: Assets.AB3,
			};
		}
		case channel.includes("abxplore"): {
			return {
				channel: "ABXPLORE",
				type: "tv",
				logo: Assets.ABXPLORE,
			};
		}
		case channel.includes("ln24"): {
			return {
				channel: "LN24",
				type: "tv",
				logo: Assets.LN24,
			};
		}
		case channel.includes("nrj"): {
			return {
				channel: "NRJ",
				type: "tv",
				logo: Assets.NRJ,
			};
		}
		case channel.includes("arte"): {
			return {
				channel: "Arte",
				type: "tv",
				logo: Assets.Arte,
			};
		}
		case channel.includes("bruzz"): {
			return {
				channel: "BRUZZ",
				type: "tv",
				logo: Assets.BRUZZ,
			};
		}
		case channel.includes("brf"): {
			return {
				channel: "BRF",
				type: "tv",
				logo: Assets.BRF,
			};
		}
		case channel.includes("kids"): {
			return {
				channel: "Auvio Kids",
				type: "tv",
				logo: Assets.Kids,
			};
		}
		default: {
			return {
				channel: "",
				type: "watching",
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
			largeImageKey: Assets.Logo, // Default
		},
		{ /*hostname,*//* href,*/ pathname } = document.location,
		[privacy, time, buttons] = await Promise.all([
			presence.getSetting<boolean>("privacy"),
			presence.getSetting<boolean>("time"),
			presence.getSetting<number>("buttons"),
		]);

	switch (true) {
		/* MAIN PAGE (Page principale)

	(https://auvio.rtbf.be/) */
		case pathname === "/": {
			presenceData.details = (await strings).browsing;

			presenceData.smallImageKey = Assets.Reading;
			presenceData.smallImageText = (await strings).browsing;

			if (time) presenceData.startTimestamp = browsingTimestamp;

			break;
		}

		/* RESEARCH (Page de recherche)

	(https://auvio.rtbf.be/explorer) */
		case ["explorer"].includes(pathname.split("/")[1]): {
			presenceData.details = (await strings).searchSomething;

			presenceData.smallImageKey = Assets.Search;
			presenceData.smallImageText = (await strings).search;

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
				? (await strings).viewAPage
				: (await strings).viewAccount;

			presenceData.smallImageKey = Assets.Reading;
			presenceData.smallImageText = (await strings).browsing;

			if (time) presenceData.startTimestamp = browsingTimestamp;

			break;
		}
		case [
			"media",
			"live",
			"emission"
		].includes(pathname.split("/")[1]): {
			console.log("Movie page");
			// Extracting JSON LD scripts
			const scripts = document.querySelectorAll('script[type="application/ld+json"]');
			let jsonData = null,
			title,
			genre,
			mediaType;

			// Find the last JSON LD script with "@type" as "BreadcrumbList"
			for (let i = scripts.length - 1; i >= 0; i--) {
				const script = scripts[i];
				try {
					const data = JSON.parse(script.textContent.trim());
					if (data["@type"] === "BreadcrumbList") {
						jsonData = data;
						break;
					}
				} catch (error) {
					console.error("Error parsing JSON:", error);
				}
			}

			if (jsonData) {
				const itemList = jsonData.itemListElement;
				if (itemList && itemList.length >= 2) {
					title = itemList[itemList.length - 1].name,
					 genre = itemList[itemList.length - 2].name,
					 mediaType = itemList[1].name;
					console.log("Title:", title);
					console.log("Genre:", genre);
					console.log("Media Type:", mediaType);
				} else 
					console.log("Not enough items in the list to extract data.");
				
			} else 
				console.log("No valid JSON LD script found.");
			

			presenceData.state = privacy
			? ""
			: title;

			switch(true) {
				case ["films"].includes(mediaType.normalize().toLowerCase()): {
					console.log("Movie");
					presenceData.details = privacy
						? (await strings).viewAPage
						: (await strings).viewMovie; 
					break;
				}
				case ["series"].includes(mediaType.normalize().toLowerCase()): {
					console.log("Série");
					presenceData.details = privacy
						? (await strings).viewAPage
						: (await strings).viewSerie;
					break;
				}
				default: {
					console.log("Undefined");
					presenceData.details = privacy
						? (await strings).viewAPage
						: `${(await strings).viewing.replace(":"," un.e")} ${mediaType.toLowerCase().replace(/s$/,"")} :`;
					break;
				}
			}
			
			// presenceData.largeImageKey = getChannel(channel).logo;
			// presenceData.largeImageText = getChannel(channel).channel;

			presenceData.smallImageKey = Assets.Reading;
			presenceData.smallImageText = (await strings).browsing;

			if (time) presenceData.startTimestamp = browsingTimestamp;

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
			"chaine"
		].includes(pathname.split("/")[1]): {
			
			const title = document.querySelector("h1").textContent;
			presenceData.state = privacy
			? ""
			: title;

			switch(true) {
				default: {
					presenceData.details = privacy
						? (await strings).viewAPage
						: (await strings).viewCategory;
					break;
				}
				case ["chaine"].includes(pathname.split("/")[1]): {
					presenceData.details = privacy
						? (await strings).viewAPage
						: (await strings).viewChannel;
					break;
				}
				case ["mon-auvio"].includes(pathname.split("/")[1]): {
					presenceData.details = privacy
						? (await strings).viewAPage
						: (await strings).viewList;
					break;
				}
			}
			
			presenceData.largeImageKey = getChannel(title).logo;
			presenceData.largeImageText = getChannel(title).channel;

			presenceData.smallImageKey = Assets.Reading;
			presenceData.smallImageText = (await strings).browsing;

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
				presenceData.details = (await strings).watchingLive;

				if (buttons) {
					presenceData.buttons = [
						{
							label: (await strings).buttonWatchStream,
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
						presenceData.smallImageText = (await strings).watchingLive;
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
						presenceData.smallImageText = (await strings).watchingLive;
						if (time) presenceData.startTimestamp = browsingTimestamp;

						if (buttons) {
							presenceData.buttons = [
								{
									label: (await strings).buttonWatchVideo,
									url: href, // We are not redirecting directly to the raw stream, it's only the livestream page
								},
							];
						}
					}
				} else {
					presenceData.smallImageKey = Assets.Pause;
					presenceData.smallImageText = (await strings).pause;
					delete presenceData.startTimestamp;
				}
			} else {
				presenceData.details = `${(await strings).watching} ${
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
							label: (await strings).buttonWatchVideo,
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
					presenceData.smallImageText = (await strings).play;
				} else {
					presenceData.smallImageKey = Assets.Pause;
					presenceData.smallImageText = (await strings).pause;
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
					? (await strings).waitingLive
					: `${(await strings).waitingLiveThe}`;

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
				presenceData.smallImageText = (await strings).waitingLiveThe;

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
					? (await strings).viewAPage
					: `${(await strings).viewPage} ${
							document.querySelector(
								"main > nav > ul:last-of-type > li:nth-of-type(2) > a"
							).textContent
					  }`;

				presenceData.state = privacy ? "" : mediaName.textContent;

				presenceData.smallImageKey = Assets.Viewing;
				presenceData.smallImageText = (await strings).viewAPage;
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
