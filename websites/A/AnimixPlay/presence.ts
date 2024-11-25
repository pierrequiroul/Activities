const presence = new Presence({
		clientId: "1278380348731818081",
	}),
	browsingTimestamp = Math.floor(Date.now() / 1000);

const enum Assets { // Other default assets can be found at index.d.ts
	Logo = "https://cdn.rcd.gg/PreMiD/websites/A/AnimixPlay/assets/logo.png",
}

let video = {
	duration: 0,
	currentTime: 0,
};

presence.on("iFrameData", (data: { duration: number; currentTime: number }) => {
	video = data;
});

presence.on("UpdateData", async () => {
	const presenceData: PresenceData = {
			largeImageKey: Assets.Logo,
		},
		{ pathname, href } = document.location;

	if (
		href.startsWith("https://animixplay.fun/") ||
		href.startsWith("https://animixplay.best/")
	)
		presenceData.details = "Browsing Anime";
	presenceData.startTimestamp = browsingTimestamp;

	if (href.startsWith("https://www1.animixplayer.top/")) {
		const titleAndEpisode = document.querySelector(".animetitle").textContent;

		[presenceData.startTimestamp, presenceData.endTimestamp] =
			presence.getTimestamps(
				Math.floor(video.currentTime),
				Math.floor(video.duration)
			);
		presenceData.details = `Watching ${titleAndEpisode.replace(
			/Episode [0-9]+/,
			""
		)}`;
		presenceData.state = `On ${titleAndEpisode.match(/Episode [0-9]+/)}`;

		presenceData.smallImageKey = Assets.Play;
		presenceData.smallImageText = "Playing";
	}

	if (href.startsWith("https://animixplay.st/")) {
		if (pathname.startsWith("/v1")) {
			presenceData.details = `Watching ${
				document.querySelector(".animetitle").textContent
			}`;
			presenceData.state = `On ${
				document.querySelector("#eptitleplace").textContent
			}`;

			presenceData.smallImageKey = Assets.Play;
			presenceData.smallImageText = "Playing";
		} else presenceData.details = "Browsing Anime";
	}
	presence.setActivity(presenceData);
});
