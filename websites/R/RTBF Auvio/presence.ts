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
		buttonViewPage: "general.buttonViewPage",
		watching: "general.watching",
		watchingAd: "youtube.ad",
		watchingLive: "general.watchingLive",
		watchingShow: "general.watchingShow",
		buttonWatchStream: "general.buttonWatchStream",
		buttonWatchVideo: "general.buttonWatchVideo",
		live: "general.live",
	}),
	browsingTimestamp = Math.floor(Date.now() / 1000);

const enum Assets { // Other default assets can be found at index.d.ts
	Logo = "https://i.imgur.com/m2gRowq.png",
	Animated = "",
	LaUne = "",
	Tipik = "",
	LaTrois = "",
	Classic21 = "",
	LaPremiere = "",
	Vivacite = "",
	Musiq3 = "",
	Tarmac = "",
	Jam = "",
	Viva = "",
	Ixpe = "",
	MediasProx = "",
	AB3 = "",
	ABXPLORE = "",
	LN24 = "",
	NRJ = "",
	Arte = "",
	BRUZZ = "",
	BRF = "",
}

function getChannel(channel: string) {
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
		default: {
			return {
				channel: "",
				type: "watching",
				logo: Assets.Logo,
			};
		}
	}
}

presence.on("UpdateData", async () => {
	const presenceData: PresenceData = {
			largeImageKey: Assets.Logo, // Default
		},
		{ /*hostname,*/ href, pathname } = document.location,
		[privacy, time, buttons] = await Promise.all([
			presence.getSetting<boolean>("privacy"),
			presence.getSetting<boolean>("time"),
			presence.getSetting<number>("buttons"),
		]);

	switch (true) {
		/* Main page 
	Page principale
	(https://www.rtlplay.be/) */
		case pathname === "/": {
			presenceData.details = (await strings).browsing;

			presenceData.smallImageKey = Assets.Reading;
			presenceData.smallImageText = (await strings).browsing;

			if (time) presenceData.startTimestamp = browsingTimestamp;

			break;
		}

		/* Research page 
	Page de recherche
	(https://www.rtlplay.be/recherche) */
		case pathname.includes("explorer"): {
			presenceData.details = (await strings).searchSomething;

			presenceData.smallImageKey = Assets.Search;
			presenceData.smallImageText = (await strings).search;

			if (time) presenceData.startTimestamp = browsingTimestamp;

			break;
		}

		/* My account page 
	Page Mon compte
	(https://www.rtlplay.be/mon-compte) */
		case pathname.includes("mes_informations"): {
			presenceData.details = privacy
				? (await strings).viewAPage
				: (await strings).viewAccount;

			presenceData.smallImageKey = Assets.Reading;
			presenceData.smallImageText = (await strings).browsing;

			if (time) presenceData.startTimestamp = browsingTimestamp;

			break;
		}

		/* Watching an ad 
	Regarde une publicité
	(Any Player or Livestream page) 
		case document.querySelector(
			"div.sc-3kw2pp-0.jqFqPu.sc-18trp4n-6.sc-bff0kr-0.cQaAsL.lmxHAW > div.sc-18trp4n-3.bVsrtw > h1"
		) !== null: {
			// Check if the tag with the text Publicité exist
			presenceData.details = (await strings).watchingAd;
			presenceData.state = privacy
				? ""
				: getTitleTrimmed(document.querySelector("head > title").textContent); // Content of the title tag

			presenceData.smallImageKey = Assets.Viewing;
			presenceData.smallImageText = (await strings).viewing;

			if (time) presenceData.startTimestamp = browsingTimestamp;

			break;
		}
	
		/* Live channel page
	Page d'une chaîne en direct
	(ex: https://www.rtlplay.be/tvi/direct)
		case pathname.includes("direct"): {
			presenceData.details = privacy
				? (await strings).watchingLive
				: `${(await strings).watching} ${getLivestream(pathname).channel}`;
			presenceData.state = privacy
				? ""
				: `${
						document.querySelector("div.sc-18trp4n-3.bVsrtw > h1").textContent
				  }`; // Content of the first line

			presenceData.largeImageKey = getLivestream(pathname).logo;
			presenceData.smallImageKey = Assets.Live;
			presenceData.smallImageText = (await strings).live;

			if (time) {
				if (
					document.querySelector('[type="duration"]').textContent.includes("-")
				) {
					presenceData.endTimestamp = presence.getTimestamps(
						0,
						presence.timestampFromFormat(
							document
								.querySelector('[type="duration"]')
								.textContent.replace("-", "")
						)
					)[1];
				} else {
					presenceData.endTimestamp = presence.getTimestamps(
						presence.timestampFromFormat(
							document.querySelector('[type="currentTime"]').textContent
						),
						presence.timestampFromFormat(
							document.querySelector('[type="duration"]').textContent
						)
					)[1];
				}
			}

			if (buttons) {
				presenceData.buttons = [
					{
						label: (await strings).buttonWatchStream,
						url: href, // We are not redirecting directly to the raw stream, it's only the livestream page
					},
				];
			}

			break;
		}

		/* Channel HUB page
	Page HUB d'une chaîne
	(ex: https://www.rtlplay.be/tvi) 
		case pathname.includes("tvi") ||
			pathname.includes("club") ||
			pathname.includes("plug") ||
			pathname.includes("bel") ||
			pathname.includes("contact"): {
			presenceData.details = privacy
				? (await strings).viewAPage
				: (await strings).viewChannel;
			presenceData.state = privacy ? "" : `${getLivestream(pathname).channel}`;

			presenceData.largeImageKey = getLivestream(pathname).logo;
			presenceData.smallImageKey = Assets.Reading;
			presenceData.smallImageText = (await strings).browsing;

			if (time) presenceData.startTimestamp = browsingTimestamp;

			break;
		}

		/* Show, Serie, Movie page 
	Page d'une émission, une série, un film
	(ex: https://www.rtlplay.be/chicago-fire-p_8947) */
		case pathname.split("/")[1] === "emission" ||
			pathname.split("/")[1] === "media": {
			if (pathname.split("/")[1] === "emission") {
				presenceData.details = privacy
					? (await strings).viewAPage
					: `${(await strings).viewPage} ${
							document.querySelector("main > nav > ul > li:nth-child(2) > a")
								.textContent
					  }`;
				presenceData.state = privacy
					? ""
					: document.querySelector(
							"main > div.PageContent_infosContainer__zAcrU > div.DetailsTitle_title__mdRHD.DetailsTitle_spacer__vsWzR > h1"
					  ).textContent;
			} else {
				presenceData.details = privacy
					? (await strings).viewAPage
					: `${(await strings).viewPage} ${document
							.querySelector("main > nav > ul > li:nth-child(2) > a")
							.textContent.split("-")[1]
							.trim()}`;
				presenceData.state = privacy
					? ""
					: document.querySelector(
							"main > div.PageContent_infosContainer__zAcrU > div.DetailsTitle_title__mdRHD.DetailsTitle_spacer__vsWzR > h1"
					  ).textContent;
				presenceData.largeImageKey = getChannel(
					document
						.querySelector(
							"main > div.PageContent_infosContainerInPage__7P1ux > div.DetailsTitle_channelCategory__vh_cY.DetailsTitle_spacer__vsWzR > div.DetailsTitle_channelCategory__vh_cY > p"
						)
						.textContent.split("-")[0]
						.trim()
						.toLowerCase()
				).logo;
			}
			presenceData.smallImageKey = Assets.Reading;
			presenceData.smallImageText = (await strings).browsing;

			if (time) presenceData.startTimestamp = browsingTimestamp;

			if (buttons) {
				presenceData.buttons = [
					{
						label: (await strings).viewAPage,
						url: href,
					},
				];
			}

			break;
		}

		/* Category (Theme) page 
	Page Catégorie (Thématique)
	(ex: https://www.rtlplay.be/rtl_play/divertissement-rtl-play-f_405) */
		case pathname.includes("categorie"): {
			presenceData.details = (await strings).viewCategory;
			presenceData.state = privacy
				? ""
				: document.querySelector(
						"main > div.PageContent_titleContainer__7lGrX > h1"
				  ).textContent;

			presenceData.smallImageKey = Assets.Reading;
			presenceData.smallImageText = (await strings).browsing;

			if (time) presenceData.startTimestamp = browsingTimestamp;

			if (buttons) {
				presenceData.buttons = [
					{
						label: (await strings).buttonViewPage,
						url: href,
					},
				];
			}

			break;
		}

		/* Video player 
	Lecteur vidéo
	(ex: https://www.rtlplay.be/the-power-p_25630/episode-01-c_13062282) 
		case document.querySelector("div.sc-18trp4n-3.bVsrtw > h1") !== null: {
			presenceData.details = privacy
				? (await strings).watchingShow
				: `${(await strings).watching} ${
						document.querySelector("div.sc-18trp4n-3.bVsrtw > h1").textContent
				  }`; // Content of first line
			// If 1st line === 2nd line then it's a Movie, 1st line !== 2nd line then it's a Tv Show
			if (
				document
					.querySelector("div.sc-18trp4n-3.bVsrtw > h1")
					.textContent.toLowerCase() !==
				document
					.querySelector("div.sc-3kw2pp-0.jqFqPu.sc-18trp4n-6.cQaAsL > h2")
					.textContent.toLocaleLowerCase()
			) {
				presenceData.state = privacy
					? ""
					: document.querySelector(
							"div.sc-3kw2pp-0.jqFqPu.sc-18trp4n-6.cQaAsL > h2"
					  ).textContent; // Content of second line
			}

			presenceData.largeImageKey = Assets.Logo;
			if (
				document
					.querySelector("#player-control-playpause")
					.getAttribute("aria-label") === "Lecture"
			) {
				presenceData.smallImageKey = Assets.Pause;
				presenceData.smallImageText = (await strings).pause;
			} else {
				presenceData.smallImageKey = Assets.Play;
				presenceData.smallImageText = (await strings).play;
			}

			if (time) {
				if (
					document.querySelector('[type="duration"]').textContent.includes("-")
				) {
					presenceData.endTimestamp = presence.getTimestamps(
						0,
						presence.timestampFromFormat(
							document
								.querySelector('[type="duration"]')
								.textContent.replace("-", "")
						)
					)[1];
				} else {
					presenceData.endTimestamp = presence.getTimestamps(
						presence.timestampFromFormat(
							document.querySelector('[type="currentTime"]').textContent
						),
						presence.timestampFromFormat(
							document.querySelector('[type="duration"]').textContent
						)
					)[1];
				}
			}

			if (buttons) {
				presenceData.buttons = [
					{
						label: (await strings).buttonWatchVideo,
						url: href, // We are not redirecting directly to the raw video stream, it's only the player page
					},
				];
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
