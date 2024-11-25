const presence = new Presence({
		clientId: "941627291304329226",
	}),
	browsingTimestamp = Math.floor(Date.now() / 1000);

const enum Assets {
	Logo = "https://cdn.rcd.gg/PreMiD/websites/V/Videoland/assets/0.gif",
}

presence.on("UpdateData", async () => {
	const presenceData: PresenceData = {
			largeImageKey: Assets.Logo,
			startTimestamp: browsingTimestamp,
		},
		{ href } = document.location,
		[privacy, buttons, covers] = await Promise.all([
			presence.getSetting<boolean>("privacy"),
			presence.getSetting<boolean>("buttons"),
			presence.getSetting<boolean>("covers"),
		]),
		video = document.querySelector("video"),
		getInfo = document.querySelectorAll('[type="application/ld+json"]')?.[1]
			?.textContent
			? JSON.parse(
					document.querySelectorAll('[type="application/ld+json"]')?.[1]
						?.textContent
			  )
			: "";

	if (video) {
		delete presenceData.startTimestamp;
		presenceData.details = getInfo.name;
		presenceData.state = `S${getInfo.partOfSeason.seasonNumber}:A${getInfo.episodeNumber}`;
		presenceData.largeImageKey = document
			.querySelector<HTMLMetaElement>('[property="og:image"]')
			.content.split("?")[0];
		presenceData.smallImageKey = video.paused ? Assets.Pause : Assets.Play;
		presenceData.smallImageText = video.paused
			? "Gepauzeerd"
			: "Aan het afspelen";
		if (!video.paused) {
			[presenceData.startTimestamp, presenceData.endTimestamp] =
				presence.getTimestampsfromMedia(video);
		}
		presenceData.buttons = [
			{
				label: "Bekijk Video",
				url: href,
			},
		];
	} else if (href.match(/[0-9]{4}/gm)) {
		presenceData.details = `Bekijkt: ${
			document
				.querySelector<HTMLMetaElement>("meta[property='og:title']")
				?.content.toLowerCase()
				?.split("op videoland")?.[0] ??
			document.querySelector("title")?.textContent?.split("op videoland")?.[0]
		}`;
		presenceData.largeImageKey = document
			.querySelector("article")
			.querySelector("source")
			.getAttribute("srcset")
			.split("?")[0];
		if (
			document
				.querySelector<HTMLMetaElement>('[name="description"]')
				?.content?.includes("afleveringen")
		) {
			presenceData.buttons = [
				{
					label: "Bekijk Serie",
					url: href,
				},
			];
		} else {
			presenceData.buttons = [
				{
					label: "Bekijk Film",
					url: href,
				},
			];
		}
	} else if (document.querySelector('[class*="is-active"]')) {
		presenceData.details = `Bekijkt ${document
			.querySelector('[class*="is-active"]')
			?.textContent?.toLowerCase()}`;
	} else if (document.querySelector("article")) {
		presenceData.details = `Bekijkt: ${
			document
				.querySelector<HTMLMetaElement>("meta[property='og:title']")
				?.content.toLowerCase()
				.split("on videoland")[0]
				.split("op videoland")[0]
		} ${href.split("main-")?.[1].split("-")?.[0]}`;
	} else presenceData.details = "Aan het browsen";

	if ((!buttons || privacy) && presenceData.buttons)
		delete presenceData.buttons;
	if ((!covers || privacy) && presenceData.largeImageKey !== Assets.Logo)
		presenceData.largeImageKey = Assets.Logo;
	if (privacy && presenceData.state) delete presenceData.state;
	if (presenceData.details) presence.setActivity(presenceData);
	else presence.setActivity();
});
