export const stringsMap = {
	play: "general.playing",
	pause: "general.paused",
	search: "general.search",
	searchSomething: "general.searchSomething",
	searchFor: "general.searchFor",
	browsing: "general.browsing",
	//viewing: "general.viewing",
	viewPage: "general.viewPage",
	viewAPage: "general.viewAPage",
	viewAccount: "general.viewAccount",
	viewChannel: "general.viewChannel",
	viewCategory: "general.viewCategory",
	viewHome: "general.viewHome",
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
	on: "general.on",
};

export function getAdditionnalStrings(
	lang: string,
	strings: typeof stringsMap
): typeof stringsMap {
	switch (lang) {
		case "fr-FR": {
			strings.deferred = "En Différé";
			strings.aPodcast = "un Podcast";
			strings.aRadio = "une Radio";
			strings.listening = "Écoute";
			strings.privacy = "Lecture privée";
			strings.startsIn = "Commence dans";
			strings.on = "sur";

			// Improved translation in context
			strings.viewAPage = "Regarde une page";
			strings.waitingLive = "Attend le démarrage du direct";
			strings.watchingLive = "Regarde un direct";
			break;
		}
		case "nl-NL": {
			strings.deferred = "Uitgestelde";
			strings.aPodcast = "";
			strings.aRadio = "";
			strings.listening = "";
			strings.privacy = "";
			strings.startsIn = "";
			strings.on = "op";
			break;
		}
		case "de-DE": {
			strings.deferred = "Zeitversetzt";
			strings.aPodcast = "";
			strings.aRadio = "";
			strings.listening = "";
			strings.privacy = "";
			strings.startsIn = "";
			strings.on = "auf";
			break;
		}
		default: {
			strings.deferred = "Deferred";
			strings.aPodcast = "a Podcast";
			strings.aRadio = "a Radio";
			strings.listening = "Listening";
			strings.privacy = "Private play";
			strings.startsIn = "Starts in";
			strings.on = "on";
			break;
		}
	}
	return strings;
}

export const enum LargeAssets { // Other default assets can be found at index.d.ts
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

export function getLocalizedAssets(
	lang: string,
	assetName: string
): LargeAssets {
	switch (assetName) {
		case "Ad":
			switch (lang) {
				case "fr-FR":
					return LargeAssets.AdFr;
				default:
					return LargeAssets.AdEn;
			}
		default:
			return LargeAssets.Binoculars; // Default fallback
	}
}

export function exist(selector: string): boolean {
	return document.querySelector(selector) !== null;
}

// Mainly used to truncate largeImageKeyText because the limit is 128 characters
export function limitText(input: string, maxLength = 128): string {
	const ellipsis = " ...";

	// If input is within limit, return it as is
	if (input.length <= maxLength) return input;

	// Truncate to 125 characters (leaving room for ellipsis)
	let truncated = input.slice(0, maxLength - ellipsis.length);

	// If the truncated text ends mid-word, remove the partial word
	if (truncated.lastIndexOf(" ") !== -1)
		truncated = truncated.slice(0, truncated.lastIndexOf(" "));

	return truncated + ellipsis;
}

// Copy of the function in Youtube utils
let cachedTime = 0;
export function adjustTimeError(time: number, acceptableError: number): number {
	if (Math.abs(time - cachedTime) > acceptableError) cachedTime = time;
	return cachedTime;
}

export const colorsMap = new Map<string, string | number[][]>([
	/*
	Plain color in hexadecimal ex: #ffaa00
	Gradient colors in RGB ex: [R, G, B, GradientOffset]
	*/
	// Default colors
	["", "#ffcc00"],
	// Category colors
	["séries", "#b92561"],
	["films", "#7e55a5"],
	[
		"animés",
		[
			[255, 226, 63, 0.2],
			[255, 9, 119, 0.5],
			[59, 124, 154, 0.75],
		],
	],
	["sport", "#15c6a4"],
	["info", "#109aa9"],
	["kids", "#434b66"],
	["documentaires", "#345a4a"],
	["divertissement", "#444d90"],
	[
		"noir jaune belge",
		[
			[7, 7, 7, 0.15],
			[198, 170, 34, 0.45],
			[194, 57, 57, 0.8],
		],
	],
	["lifestyle", "#714e6e"],
	["culture", "#863d67"],
	["musique", "#4a6f6f"],
	[
		"lgbtqia+",
		[
			[242, 130, 10, 0.2],
			[142, 171, 102, 0.3],
			[156, 60, 115, 0.6],
			[68, 37, 128, 0.8],
		],
	],
	["décodage médias", "#b26e38"],
	["archives sonuma", "#663c2a"],
	["direct", "#e55232"],
	// Channel colors
	["la une", "#ee372b"],
	["tipik", "#0df160"],
	["la trois", "#9b49a1"],
	["classic 21", "#8c408a"],
	["la premiere", "#083e7a"],
	["vivacite", "#f93308"],
	["musiq3", "#d63c4d"],
	["tarmac", "#222222"],
	["jam", "#222222"],
	["viva", "#f93308"],
]);

interface ChannelInfo {
	channel: string;
	type: ActivityType;
	logo: LargeAssets;
	color: string | number[][]; // Optional property
}

export function getChannel(channel: string): ChannelInfo {
	channel = channel.toLowerCase().replace(/[éè]/g, "e");
	switch (true) {
		case ["la une", "laune"].includes(channel): {
			return {
				channel: "La Une",
				type: ActivityType.Watching,
				logo: LargeAssets.LaUne,
				color: colorsMap.get("la une"),
			};
		}
		case ["tipik"].includes(channel): {
			return {
				channel: "Tipik",
				type: ActivityType.Watching,
				logo: LargeAssets.Tipik,
				color: colorsMap.get("tipik"),
			};
		}
		case ["la trois", "latrois"].includes(channel): {
			return {
				channel: "La Trois",
				type: ActivityType.Watching,
				logo: LargeAssets.LaTrois,
				color: colorsMap.get("la trois"),
			};
		}
		case ["classic 21", "classic21", "classic"].includes(channel): {
			return {
				channel: "Classic 21",
				type: ActivityType.Listening,
				logo: LargeAssets.Classic21,
				color: colorsMap.get("classic 21"),
			};
		}
		case ["la premiere", "lapremiere", "la"].includes(channel): {
			return {
				channel: "La Première",
				type: ActivityType.Listening,
				logo: LargeAssets.LaPremiere,
				color: colorsMap.get("la premiere"),
			};
		}
		case ["vivacite"].includes(channel): {
			return {
				channel: "Vivacité",
				type: ActivityType.Listening,
				logo: LargeAssets.Vivacite,
				color: colorsMap.get("vivacite"),
			};
		}
		case ["musiq3"].includes(channel): {
			return {
				channel: "Musiq3",
				type: ActivityType.Listening,
				logo: LargeAssets.Musiq3,
				color: colorsMap.get("musiq3"),
			};
		}
		case ["tarmac"].includes(channel): {
			return {
				channel: "Tarmac",
				type: ActivityType.Listening,
				logo: LargeAssets.Tarmac,
				color: colorsMap.get("tarmac"),
			};
		}
		case ["jam"].includes(channel): {
			return {
				channel: "Jam",
				type: ActivityType.Listening,
				logo: LargeAssets.Jam,
				color: colorsMap.get("jam"),
			};
		}
		case ["viva"].includes(channel): {
			return {
				channel: "Viva+",
				type: ActivityType.Listening,
				logo: LargeAssets.Viva,
				color: colorsMap.get("viva"),
			};
		}
		case ["ixpe"].includes(channel): {
			return {
				channel: "Ixpé",
				type: ActivityType.Watching,
				logo: LargeAssets.Ixpe,
				color: colorsMap.get(""),
			};
		}
		case ["ab3"].includes(channel): {
			return {
				channel: "AB3",
				type: ActivityType.Watching,
				logo: LargeAssets.AB3,
				color: colorsMap.get(""),
			};
		}
		case ["abxplore"].includes(channel): {
			return {
				channel: "ABXPLORE",
				type: ActivityType.Watching,
				logo: LargeAssets.ABXPLORE,
				color: colorsMap.get(""),
			};
		}
		case ["ln24"].includes(channel): {
			return {
				channel: "LN24",
				type: ActivityType.Watching,
				logo: LargeAssets.LN24,
				color: colorsMap.get(""),
			};
		}
		case ["nrj"].includes(channel): {
			return {
				channel: "NRJ",
				type: ActivityType.Watching,
				logo: LargeAssets.NRJ,
				color: colorsMap.get(""),
			};
		}
		case ["arte"].includes(channel): {
			return {
				channel: "Arte",
				type: ActivityType.Watching,
				logo: LargeAssets.Arte,
				color: colorsMap.get(""),
			};
		}
		case ["bruzz"].includes(channel): {
			return {
				channel: "BRUZZ",
				type: ActivityType.Watching,
				logo: LargeAssets.BRUZZ,
				color: colorsMap.get(""),
			};
		}
		case ["brf"].includes(channel): {
			return {
				channel: "BRF",
				type: ActivityType.Watching,
				logo: LargeAssets.BRF,
				color: colorsMap.get(""),
			};
		}
		case ["kids"].includes(channel): {
			return {
				channel: "RTBF Auvio",
				type: ActivityType.Watching,
				logo: LargeAssets.Kids,
				color: colorsMap.get(""),
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
				logo: LargeAssets.MediasProx,
				color: colorsMap.get(""),
			};
		}
		default: {
			return {
				channel: "RTBF Auvio",
				type: ActivityType.Watching,
				logo: LargeAssets.Auvio,
				color: colorsMap.get(""),
			};
		}
	}
}

// Adapted veryCrunchy's function from YouTube Presence https://github.com/PreMiD/Presences/pull/8000

export const cropPreset = {
	// Crop values in percent correspond to Left, Right, Top, Bottom.
	squared: [0, 0, 0, 0],
	vertical: [0.22, 0.22, 0, 0.3],
	horizontal: [0.425, 0.025, 0, 0],
};

export async function getThumbnail(
	src: string = LargeAssets.Logo,
	cropPercentages: typeof cropPreset.squared = cropPreset.squared, // Left, Right, top, Bottom
	borderColor: string | number[][] = colorsMap.get(""),
	borderWidth = 15,
	progress = 2
): Promise<string> {
	return new Promise(resolve => {
		const img = new Image(),
			wh = 320; // Size of the square thumbnail

		img.crossOrigin = "anonymous";
		img.src = src;

		img.onload = async function () {
			let croppedWidth,
				croppedHeight,
				cropX = 0,
				cropY = 0;

			// Determine if the image is landscape or portrait
			const isLandscape = img.width > img.height;

			if (isLandscape) {
				// Landscape mode: use left and right crop percentages
				const cropLeft = img.width * cropPercentages[0];
				croppedWidth = img.width - cropLeft - img.width * cropPercentages[1];
				croppedHeight = img.height;
				cropX = cropLeft;
			} else {
				// Portrait mode: use top and bottom crop percentages
				const cropTop = img.height * cropPercentages[2];
				croppedWidth = img.width;
				croppedHeight = img.height - cropTop - img.height * cropPercentages[3];
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

				if (Array.isArray(borderColor)) {
					// Create a triangular gradient
					const gradient = ctx.createLinearGradient(0, 0, wh, wh);
					for (const colorStep of borderColor) {
						gradient.addColorStop(
							colorStep[3], // Use the fourth value as the step position
							`rgba(${colorStep[0]}, ${colorStep[1]}, ${colorStep[2]}, 1)` // Use RGB, alpha fixed at 1
						);
					}
					ctx.fillStyle = gradient;
				} else {
					// borderColor for the border
					ctx.fillStyle = borderColor;
				}

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
			resolve(LargeAssets.Logo);
		};
	});
}
