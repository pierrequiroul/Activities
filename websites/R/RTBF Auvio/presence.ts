const presence = new Presence({
		clientId: "1241444837476274268",
	}),
	getStrings = async () => {
		return presence.getStrings(
			{
				play: "general.playing",
				pause: "general.paused",
				search: "general.search",
				searchSomething: "general.searchSomething",
				browsing: "general.browsing",
				//viewing: "general.viewing",
				viewPage: "general.viewPage",
				viewAPage: "general.viewAPage",
				viewAccount: "general.viewAccount",
				viewChannel: "general.viewChannel",
				viewCategory: "general.viewCategory",
				//viewHome: "general.viewHome",
				//viewList: "netflix.viewList",
				//viewSerie: "general.viewSerie",
				//viewShow: "general.viewShow",
				//viewMovie: "general.viewMovie",
				//buttonViewPage: "general.buttonViewPage",
				//watching: "general.watching",
				watchingAd: "youtube.ad",
				watchingLive: "general.watchingLive",
				watchingShow: "general.watchingShow",
				watchingMovie: "general.watchingMovie",
				live: "general.live",
				waitingLive: "general.waitingLive",
				waitingLiveThe: "general.waitingLiveThe",
				home: "twitch.home",
				// Custom strings
				deferred: "general.deferred",
				aPodcast: "general.aPodcast",
				listening: "general.listening",
				privacy: "general.privacy",
				aRadio: "general.aRadio",
				startsIn: "general.startsIn",
			},
			await presence.getSetting<string>("lang").catch(() => "en")
		);
	};
let oldLang: string = null,
	strings: Awaited<ReturnType<typeof getStrings>>;

function getAdditionnalStrings(lang: string) {
	switch (true) {
		case ["fr-FR"].includes(lang): {
			strings.deferred = "En Différé";
			strings.aPodcast = "un Podcast";
			strings.aRadio = "une Radio";
			strings.listening = "Écoute";
			strings.privacy = "Lecture privée";
			strings.startsIn = "Commence dans";

			// Improved translation in context
			strings.viewAPage = "Regarde une page";
			strings.waitingLive = "Attend le démarrage du direct";
			strings.watchingLive = "Regarde un direct";
			break;
		}
		case ["nl-NL"].includes(lang): {
			strings.deferred = "Uitgestelde";
			strings.aPodcast = "";
			strings.aRadio = "";
			strings.listening = "";
			strings.privacy = "";
			strings.startsIn = "";
			break;
		}
		case ["de-DE"].includes(lang): {
			strings.deferred = "Zeitversetzt";
			strings.aPodcast = "";
			strings.aRadio = "";
			strings.listening = "";
			strings.privacy = "";
			strings.startsIn = "";
			break;
		}
		default: {
			strings.deferred = "Deferred";
			strings.aPodcast = "a Podcast";
			strings.aRadio = "a Radio";
			strings.listening = "Listening";
			strings.privacy = "Private play";
			strings.startsIn = "Starts in";
			break;
		}
	}
}

let title = "Default Title",
	subtitle = "Default Subtitle",
	category = "Default Category";

const enum Assets { // Other default assets can be found at index.d.ts
	Logo = "https://i.imgur.com/m2gRowq.png",
	Animated = "",
	Auvio = "https://imgur.com/Ky3l5MZ.png",
	Deffered = "https://imgur.com/cA3mQhL.gif",
	Waiting = "https://imgur.com/KULD0Ja.png",
	Listening = "https://imgur.com/FppuGVE.png",
	Binoculars = "https://imgur.com/aF3TWVK.png",
	Privacy = "https://imgur.com/nokHvhE.png",
	LiveAnimated = "https://imgur.com/oBXFRPE.gif",
	AdEn = "https://cdn.rcd.gg/PreMiD/websites/R/RTLplay/assets/4.png",
	AdFr = "https://cdn.rcd.gg/PreMiD/websites/R/RTLplay/assets/5.png",
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
	channel = channel.toLowerCase().replace(/[éè]/g, "e");
	const defaultColor = "#FFFF00";
	switch (true) {
		case ["la une", "laune"].includes(channel): {
			return {
				channel: "La Une",
				type: ActivityType.Watching,
				logo: Assets.LaUne,
				color: "#ee372b",
			};
		}
		case ["tipik"].includes(channel): {
			return {
				channel: "Tipik",
				type: ActivityType.Watching,
				logo: Assets.Tipik,
				color: "#0df160",
			};
		}
		case ["la trois", "latrois"].includes(channel): {
			return {
				channel: "La Trois",
				type: ActivityType.Watching,
				logo: Assets.LaTrois,
				color: "#9b49a1",
			};
		}
		case ["classic 21", "classic21", "classic"].includes(channel): {
			return {
				channel: "Classic 21",
				type: ActivityType.Listening,
				logo: Assets.Classic21,
				color: "#8c408a",
			};
		}
		case ["la premiere", "lapremiere", "la"].includes(channel): {
			return {
				channel: "La Première",
				type: ActivityType.Listening,
				logo: Assets.LaPremiere,
				color: "#083e7a",
			};
		}
		case ["vivacite"].includes(channel): {
			return {
				channel: "Vivacité",
				type: ActivityType.Listening,
				logo: Assets.Vivacite,
				color: "#f93308",
			};
		}
		case ["musiq3"].includes(channel): {
			return {
				channel: "Musiq3",
				type: ActivityType.Listening,
				logo: Assets.Musiq3,
				color: "#d63c4d",
			};
		}
		case ["tarmac"].includes(channel): {
			return {
				channel: "Tarmac",
				type: ActivityType.Listening,
				logo: Assets.Tarmac,
				color: "#222222",
			};
		}
		case ["jam"].includes(channel): {
			return {
				channel: "Jam",
				type: ActivityType.Listening,
				logo: Assets.Jam,
				color: "#222222",
			};
		}
		case ["viva"].includes(channel): {
			return {
				channel: "Viva+",
				type: ActivityType.Listening,
				logo: Assets.Viva,
				color: "#f93308",
			};
		}
		case ["ixpe"].includes(channel): {
			return {
				channel: "Ixpé",
				type: ActivityType.Watching,
				logo: Assets.Ixpe,
				color: defaultColor,
			};
		}
		case ["ab3"].includes(channel): {
			return {
				channel: "AB3",
				type: ActivityType.Watching,
				logo: Assets.AB3,
				color: defaultColor,
			};
		}
		case ["abxplore"].includes(channel): {
			return {
				channel: "ABXPLORE",
				type: ActivityType.Watching,
				logo: Assets.ABXPLORE,
				color: defaultColor,
			};
		}
		case ["ln24"].includes(channel): {
			return {
				channel: "LN24",
				type: ActivityType.Watching,
				logo: Assets.LN24,
				color: defaultColor,
			};
		}
		case ["nrj"].includes(channel): {
			return {
				channel: "NRJ",
				type: ActivityType.Watching,
				logo: Assets.NRJ,
				color: defaultColor,
			};
		}
		case ["arte"].includes(channel): {
			return {
				channel: "Arte",
				type: ActivityType.Watching,
				logo: Assets.Arte,
				color: defaultColor,
			};
		}
		case ["bruzz"].includes(channel): {
			return {
				channel: "BRUZZ",
				type: ActivityType.Watching,
				logo: Assets.BRUZZ,
				color: defaultColor,
			};
		}
		case ["brf"].includes(channel): {
			return {
				channel: "BRF",
				type: ActivityType.Watching,
				logo: Assets.BRF,
				color: defaultColor,
			};
		}
		case ["kids"].includes(channel): {
			return {
				channel: "RTBF Auvio",
				type: ActivityType.Watching,
				logo: Assets.Kids,
				color: defaultColor,
			};
		}
		case [
			"medias de proximite",
			"antenne centre",
			"bx1",
			"bouke",
			"canal zoom",
			"matele",
			"notele",
			"rtc",
			"telemb",
			"telesambre",
			"tv com",
			"tvcom",
			"tv lux",
			"tvlux",
			"vedia",
		].includes(channel): {
			return {
				channel: "Médias de proximité",
				type: ActivityType.Watching,
				logo: Assets.MediasProx,
				color: defaultColor,
			};
		}
		default: {
			return {
				channel: "RTBF Auvio",
				type: ActivityType.Watching,
				logo: Assets.Auvio,
				color: defaultColor,
			};
		}
	}
}

function exist(selector: string) {
	return document.querySelector(selector) !== null;
}

// Adapted veryCrunchy's function from YouTube Presence https://github.com/PreMiD/Presences/pull/8000
async function getThumbnail(
	src: string,
	cropLeftPercentage = 0,
	cropRightPercentage = 0,
	cropTopPercentage = 0,
	cropBottomPercentage = 0,
	progress = 1,
	borderWidth = 30,
	borderColor = "#FFFF00"
): Promise<string> {
	return new Promise(resolve => {
		const img = new Image(),
			wh = 320; // Size of the square thumbnail

		img.crossOrigin = "anonymous";
		img.src = src;

		img.onload = function () {
			let croppedWidth,
				croppedHeight,
				cropX = 0,
				cropY = 0;

			// Determine if the image is landscape or portrait
			const isLandscape = img.width > img.height;

			if (isLandscape) {
				// Landscape mode: use left and right crop percentages
				const cropLeft = img.width * cropLeftPercentage;
				croppedWidth = img.width - cropLeft - img.width * cropRightPercentage;
				croppedHeight = img.height;
				cropX = cropLeft;
			} else {
				// Portrait mode: use top and bottom crop percentages
				const cropTop = img.height * cropTopPercentage;
				croppedWidth = img.width;
				croppedHeight =
					img.height - cropTop - img.height * cropBottomPercentage;
				cropY = cropTop;
			}

			// Determine the scale to fit the cropped image into the square canvas
			let newWidth, newHeight, offsetX, offsetY;

			if (isLandscape) {
				newWidth = wh - 2 * borderWidth;
				newHeight = (newWidth / croppedWidth) * croppedHeight;
				offsetX = borderWidth;
				offsetY = (wh - newHeight) / 2;
			} else {
				newHeight = wh - 2 * borderWidth;
				newWidth = (newHeight / croppedHeight) * croppedWidth;
				offsetX = (wh - newWidth) / 2;
				offsetY = borderWidth;
			}

			const tempCanvas = document.createElement("canvas");
			tempCanvas.width = wh;
			tempCanvas.height = wh;
			const ctx = tempCanvas.getContext("2d"),
				// Remap progress from 0-1 to 0.03-0.97
				remappedProgress = 0.07 + progress * (0.93 - 0.07);

			// 1. Fill the canvas with a black background
			ctx.fillStyle = "#080808";
			ctx.fillRect(0, 0, wh, wh);

			// 2. Draw the radial progress bar
			if (remappedProgress > 0) {
				ctx.beginPath();
				ctx.moveTo(wh / 2, wh / 2);
				const startAngle = Math.PI / 4; // 45 degrees in radians, starting from bottom-right

				ctx.arc(
					wh / 2,
					wh / 2,
					wh,
					startAngle,
					startAngle + 2 * Math.PI * remappedProgress
				);
				ctx.lineTo(wh / 2, wh / 2);
				ctx.fillStyle = borderColor; // Yellow color for the progress bar
				ctx.fill();
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
				newHeight
			);

			resolve(tempCanvas.toDataURL("image/png"));
		};

		img.onerror = function () {
			resolve(src);
		};
	});
}

presence.on("UpdateData", async () => {
	const presenceData: PresenceData = {
			name: "Auvio",
			largeImageKey: Assets.Auvio, // Default
			largeImageText: "RTBF Auvio",
			type: ActivityType.Watching,
		},
		{ /*hostname, href,*/ pathname } = document.location,
		[lang, usePresenceName, privacy, time, buttons, poster] = await Promise.all(
			[
				presence.getSetting<string>("lang").catch(() => "en"),
				presence.getSetting<boolean>("usePresenceName"),
				presence.getSetting<boolean>("privacy"),
				presence.getSetting<boolean>("timestamp"),
				presence.getSetting<number>("buttons"),
				presence.getSetting<boolean>("usePosterImage"),
			]
		);

	if (oldLang !== lang || !strings) {
		oldLang = lang;
		strings = await getStrings();
		getAdditionnalStrings(lang);
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
					privacy || !usePresenceName
						? strings.aRadio
						: getChannel(channelName).channel;
				presenceData.type = ActivityType.Listening;

				presenceData.smallImageKey = privacy
					? Assets.Privacy
					: Assets.Listening;
				presenceData.smallImageText = privacy ? strings.privacy : strings.play;

				if (privacy)
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
								0,
								0,
								0,
								0,
								1.5,
								20,
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
								0,
								0,
								0,
								0,
								1.5,
								20,
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
					!privacy
						? firstLine
						: strings.aPodcast;
				presenceData.type = ActivityType.Listening;

				presenceData.details =
					!privacy
						? firstLine
						: `${strings.listening} ${strings.aPodcast}`;

				presenceData.state =
					!privacy ? secondLine : "";

				presenceData.smallImageKey = privacy
					? Assets.Privacy
					: Assets.Listening;
				presenceData.smallImageText = privacy ? strings.privacy : strings.play;

				if (poster) {
					const progress =
						presence.timestampFromFormat(duration.split("/")[0]) /
						presence.timestampFromFormat(duration.split("/")[1]);

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
						0,
						0,
						0,
						0,
						progress,
						20,
						getChannel("default").color
					);
				}
				if (!privacy) presenceData.largeImageText += " - Podcasts";
			}
			break;
		}
		/* CATEGORY & CHANNEL PAGE

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
		].includes(pathname.split("/")[1]) || pathname === "/": {
			presenceData.smallImageKey = Assets.Binoculars;
			presenceData.smallImageText = strings.browsing;

			if (pathname === "/")
				presenceData.details = privacy ? strings.viewAPage : strings.home;
			else {
				const title = document.querySelector("h1").textContent;

				presenceData.details = privacy
					? strings.browsing
					: pathname.split("/")[1] === "podcasts"
					? `${title} & Radios`
					: title;

				switch (true) {
					default: {
						presenceData.state = privacy
							? strings.viewAPage
							: strings.viewCategory.replace(":", "");

						if (poster) {
							/* We randomly pick a cover image from that category in the first swiper*/
							const random = Math.floor(Math.random() * (document.querySelector(".swiper-wrapper").childElementCount - 1)),
								selector = exist("img.TileProgramPoster_hoverPicture__v5RJX")
									? "img.TileProgramPoster_hoverPicture__v5RJX" // If programs cover art are in portrait
									: "img.TileMedia_hoverPicture__RGh_m"; // If programs cover art are in landscape

							presenceData.largeImageKey = await getThumbnail(
								decodeURIComponent(
									document
										.querySelectorAll(selector)
										[random].getAttribute("src")
										.replace("/_next/image?url=", "")
										.split("&w")[0]
								),
								0.22,
								0.22,
								0,
								0.3,
								1.5,
								15
							);
							if (exist(".TileMedia_title__331RH > h3")) {
								presenceData.largeImageText += exist(
									".TileMedia_title__331RH > h3 > div > p"
								)
									? ` - ${document
											.querySelectorAll(".TileMedia_title__331RH > h3")
											[random].textContent.replace(
												document.querySelectorAll(
													".TileMedia_title__331RH > h3 > div > p"
												)[random].textContent,
												""
											)}`
									: ` - ${
											document.querySelectorAll(".TileMedia_title__331RH > h3")[
												random
											].textContent
									  }`;
							}
						}
						break;
					}
					case ["chaine"].includes(pathname.split("/")[1]): {
						presenceData.state = privacy
							? strings.viewAPage
							: strings.viewChannel.replace(":", "");

						presenceData.largeImageKey = getChannel(title).logo;
						presenceData.largeImageText = getChannel(title).channel;
						break;
					}
					case ["mon-auvio"].includes(pathname.split("/")[1]): {
						presenceData.state = privacy
							? strings.viewAPage
							: strings.viewPage.replace(":", "");
						break;
					}
				}
			}

			break;
		}
		/* RESEARCH (Page de recherche)

	(https://auvio.rtbf.be/explorer) */
		case ["explorer"].includes(pathname.split("/")[1]): {
			presenceData.details = strings.browsing;
			presenceData.state = strings.searchSomething;

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
		].includes(pathname.split("/")[1]): {
			presenceData.details = privacy
				? strings.browsing
				: document.querySelector(".UserGateway_title__PkVAb").textContent;
			presenceData.state = privacy ? strings.viewAPage : strings.viewAccount;

			presenceData.smallImageKey = privacy || document.querySelector(".HeaderUser_text__tpHR7").textContent.toLowerCase().includes("se connecter")
				? Assets.Binoculars
				: document
						.querySelector(".HeaderUser_avatar__pbBy2 > span > img")
						.getAttribute("src");
			presenceData.smallImageText = privacy
				? strings.browsing
				: document.querySelector(".HeaderUser_text__tpHR7").textContent;

			presenceData.largeImageKey = Assets.Logo;
			break;
		}
		case ["media", "live", "emission"].includes(pathname.split("/")[1]): {
			let breadcrumbData, mediaData;
			if (privacy) {
				if (!exist("#player")) {
					presenceData.details = strings.browsing;
					presenceData.state = strings.viewAPage;
				} else {
					switch (true) {
						case pathname.split("/")[1] === "media": {
							presenceData.state = strings.watchingMovie;
							break;
						}
						case pathname.split("/")[1] === "emission": {
							presenceData.state = strings.watchingShow;
							break;
						}
						case pathname.split("/")[1] === "live": {
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

					if (["live"].includes(pathname.split("/")[1])) {
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

							presenceData.smallImageKey = Assets.Waiting;
							presenceData.smallImageText = strings.waitingLive;
						} else {
							presenceData.details = title;
							presenceData.state = subtitle;

							presenceData.smallImageKey = Assets.Binoculars;
							presenceData.smallImageText = strings.browsing;
						}
					} else {
						presenceData.details = title;
						presenceData.state = subtitle;

						presenceData.smallImageKey = Assets.Binoculars;
						presenceData.smallImageText = strings.browsing;
					}

					if (poster) {
						presenceData.largeImageKey = await getThumbnail(
							mediaData.image || mediaData.broadcastOfEvent.image.url,
							0.425,
							0.025,
							0,
							0,
							1,
							20,
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
					let progress = video.currentTime / video.duration;

					if (usePresenceName) presenceData.name = title;

					/* LIVE VIDEO PLAYER */
					if (["live"].includes(pathname.split("/")[1])) {
						progress =
							parseFloat(
								(
									document.querySelector(
										".PlayerUITimebar_timebarNow__HoN7c"
									) as HTMLElement
								).style.width.replace("%", "")
							) / 100;

						presenceData.details = title;

						if (Date.now() % 2 === 0) {
							presenceData.state = bChannelCategoryShown
								? `${strings.watchingLive} sur ${channelCategory}`
								: `${strings.watchingLive} sur Auvio`;
						} else presenceData.state = subtitle;

						if (
							document.querySelector(".sas-ctrl-countdown").textContent !== ""
						) {
							presenceData.smallImageKey = ["fr-FR"].includes(lang)
								? Assets.AdFr
								: Assets.AdEn;
							presenceData.smallImageText = strings.watchingAd;
						} else if (["direct"].includes(category.toLowerCase())) {
							presenceData.smallImageKey = video.played
								? Assets.Live
								: Assets.Pause;
							presenceData.smallImageText = video.played
								? strings.live
								: strings.pause;
						} else if (category.toLowerCase() === "en différé") {
							presenceData.smallImageKey = video.played
								? Assets.Deffered
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

						if (
							document.querySelector(".sas-ctrl-countdown").textContent !== ""
						) {
							presenceData.smallImageKey = ["fr-FR"].includes(lang)
								? Assets.AdFr
								: Assets.AdEn;
							presenceData.smallImageText = strings.watchingAd;
						} else {
							presenceData.smallImageKey = video.played
								? Assets.Play
								: Assets.Pause;
							presenceData.smallImageText = video.played
								? strings.play
								: strings.pause;
						}
					}

					if (poster) {
						presenceData.largeImageKey = await getThumbnail(
							mediaData.image || mediaData.broadcastOfEvent.image.url,
							0.425,
							0.025,
							0,
							0,
							progress,
							20,
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
