const presence = new Presence({
		clientId: "794408060847390760",
	}),
	strings = presence.getStrings({
		playing: "general.playing",
		paused: "general.paused",
		browsing: "general.browsing",
		episode: "presence.media.info.episode",
	}),
	browsingTimestamp = Math.floor(Date.now() / 1000);

presence.on("UpdateData", async () => {
	const presenceData: PresenceData = {
		largeImageKey: "https://cdn.rcd.gg/PreMiD/websites/E/Exxen/assets/logo.png",
	};
	if (document.location.pathname.includes("watch")) {
		const video: HTMLVideoElement = document.querySelector(".rmp-video"),
			episodeName = document.querySelector(".content-name").textContent,
			episode = episodeName.split(".Bölüm")[0].split(" ")[
				episodeName.split(".Bölüm")[0].split(" ").length - 1
			],
			[startTimestamp, endTimestamp] = presence.getTimestamps(
				video.currentTime,
				video.duration
			);
		presenceData.details = episodeName
			.replace(`${episode}.Bölüm`, "")
			.replace(`Episode ${episode}`, "");
		presenceData.state = (await strings).episode.replace("{0}", episode);
		if (!video.paused) {
			presenceData.smallImageKey = Assets.Play;
			presenceData.smallImageText = (await strings).playing;
			[presenceData.startTimestamp, presenceData.endTimestamp] = [
				startTimestamp,
				endTimestamp,
			];
		} else {
			presenceData.smallImageKey = Assets.Pause;
			presenceData.smallImageText = (await strings).paused;
		}
	} else {
		presenceData.startTimestamp = browsingTimestamp;
		presenceData.details = (await strings).browsing;
		if (document.location.pathname.includes("detail"))
			presenceData.state = document.querySelector(".title").textContent;
	}
	presence.setActivity(presenceData);
});
