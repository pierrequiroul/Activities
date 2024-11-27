export const stringsMap = {
	//play: "general.playing",
	//pause: "general.paused",
	//search: "general.search",
	//searchSomething: "general.searchSomething",
	//searchFor: "general.searchFor",
	browsing: "general.browsing",
	//viewing: "general.viewing",
	//viewPage: "general.viewPage",
	//viewAPage: "general.viewAPage",
	//viewAccount: "general.viewAccount",
	//viewChannel: "general.viewChannel",
	//viewCategory: "general.viewCategory",
	//viewHome: "general.viewHome",
	//viewList: "netflix.viewList",
	//viewSerie: "general.viewSerie",
	//viewShow: "general.viewShow",
	//viewMovie: "general.viewMovie",
	//buttonViewPage: "general.buttonViewPage",
	//watching: "general.watching",
	//watchingAd: "youtube.ad",
	//watchingLive: "general.watchingLive",
	//watchingShow: "general.watchingShow",
	//watchingMovie: "general.watchingMovie",
	//live: "general.live",
	//waitingLive: "general.waitingLive",
	//waitingLiveThe: "general.waitingLiveThe",
	//home: "twitch.home",
	// Custom strings
	deferred: "general.deferred",
	//aPodcast: "general.aPodcast",
	//listening: "general.listening",
	//privacy: "general.privacy",
	//aRadio: "general.aRadio",
	//startsIn: "general.startsIn",
};

export function getAdditionnalStrings(lang: string, strings: typeof stringsMap): typeof stringsMap {
	switch (lang) {
		case "fr-FR": {
			strings.deferred = "En Différé";

			break;
		}
		case "nl-NL": {
			strings.deferred = "Uitgestelde";

			break;
		}
		case "de-DE": {
			strings.deferred = "Zeitversetzt";

			break;
		}
		default: {
			strings.deferred = "Deferred";

			break;
		}
	}
	return strings;
}

export const enum LargeAssets { // Other default assets can be found at index.d.ts
	Icon = "https://i.imgur.com/aWohjs9.png",
	Logo = "https://i.imgur.com/6mE4m6d.png",
	Animated = "",
	TF1 = "https://imgur.com/Ky3l5MZ.png",
	Deffered = "https://imgur.com/cA3mQhL.gif",
	Binoculars = "https://imgur.com/aF3TWVK.png",
	Privacy = "https://imgur.com/nokHvhE.png",
	LiveAnimated = "https://imgur.com/oBXFRPE.gif",
	AdEn = "https://cdn.rcd.gg/PreMiD/websites/R/RTLplay/assets/4.png",
	AdFr = "https://cdn.rcd.gg/PreMiD/websites/R/RTLplay/assets/5.png",
}