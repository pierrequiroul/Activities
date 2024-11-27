const presence = new Presence({
		clientId: "1310744215478730864",
	}),
	browsingTimestamp = Math.floor(Date.now() / 1000),
	getStrings = async () => {
		return presence.getStrings(
			{browsing: "general.browsing"},
			await presence.getSetting<string>("lang").catch(() => "en")
		);
	};
	
let oldLang: string = null,
	strings: Awaited<ReturnType<typeof getStrings>>,
	oldPath = document.location.pathname;

const enum Assets { // Other default assets can be found at index.d.ts
	Logo = "https://i.imgur.com/GDkR7b4.png",
}

presence.on("UpdateData", async () => {
	const { /*hostname, href,*/ pathname } = document.location,
	pathParts = pathname.split("/"),
	presenceData: PresenceData = {
		name: "TF1+",
		largeImageKey: Assets.Logo, // Default
		largeImageText: "TF1+",
		type: ActivityType.Watching,
	},
	[
		lang,
		//usePresenceName,
		//useChannelName,
		//usePrivacyMode,
		//useTimestamps,
		//useButtons,
		//usePoster,
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
		strings = await getStrings();
	}

	if (oldPath !== pathname) 
		oldPath = pathname;
	
	switch(true) {
		case pathParts.length === 0: {
			presenceData.details = "hihi";
			presenceData.state = pathParts[0];
			presenceData.startTimestamp = browsingTimestamp;
		}


	}

	presence.setActivity(presenceData);
});
