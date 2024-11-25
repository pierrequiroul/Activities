const presence = new Presence({
		clientId: "629428243061145640",
	}),
	browsingTimestamp = Math.floor(Date.now() / 1000);

const enum Assets {
	Likes = "https://cdn.rcd.gg/PreMiD/websites/P/Pinterest/assets/0.png",
	Logo = "https://cdn.rcd.gg/PreMiD/websites/P/Pinterest/assets/logo.png",
	Loading = "https://i.imgur.com/6s5f2TA\u002egif",
}

presence.on("UpdateData", async () => {
	const presenceData: PresenceData = {
			largeImageKey: Assets.Logo,
			startTimestamp: browsingTimestamp,
		},
		{ pathname, hostname, href } = document.location,
		buttons = await presence.getSetting<boolean>("buttons"),
		ideasHubPage =
			document.querySelector('[data-test-id="ideas-hub-page-header"]') ||
			document.querySelector('[data-test-id="control-ideas-redesign-header"]'),
		search = document.querySelector<HTMLInputElement>(
			'input[aria-label="Search"],input[aria-label="search"]'
		),
		video = document.querySelector<HTMLVideoElement>("video");

	if (hostname === "help.pinterest.com") {
		presenceData.details = "Viewing the help center";
		presence.setActivity(presenceData);
		return;
	}
	switch (true) {
		case document.readyState !== "complete": {
			presenceData.details = "Loading";
			presenceData.smallImageKey = Assets.Loading;
			break;
		}
		case !!search?.value: {
			presenceData.details = !pathname.includes("/search/")
				? "Searching for"
				: "Viewing search results for";
			presenceData.state = search.value;
			presenceData.smallImageKey = Assets.Search;
			break;
		}
		case !!document.querySelector(
			'[data-layout-shift-boundary-id="ProfilePageContainer"]'
		): {
			presenceData.details = "Viewing profile of";
			presenceData.state = document.querySelector(
				'[data-test-id="profile-name"]'
			)?.textContent;
			presenceData.buttons = [{ label: "View Profile", url: href }];
			break;
		}

		case pathname.includes("/pin/"): {
			const creatorProfile = document
					.querySelector('[data-test-id="official-user-attribution"]')
					?.querySelector<HTMLAnchorElement>("a")?.href,
				likesEl = document.querySelector(
					'[data-test-id="Reaction"]'
				)?.textContent;
			presenceData.details =
				JSON.parse(
					document.querySelector('[data-test-id="leaf-snippet"]')?.textContent
				)?.headline ?? "Viewing a pin";

			if (!isNaN(video?.duration)) {
				delete presenceData.startTimestamp;
				if (!video.paused) {
					[presenceData.startTimestamp, presenceData.endTimestamp] =
						presence.getTimestampsfromMedia(video);
				}
				presenceData.smallImageKey = video.paused ? Assets.Pause : Assets.Play;
				presenceData.smallImageText = video.paused ? "Paused" : "Playing back";
				presenceData.state = `Viewing a video pin by: ${
					document.querySelector(
						'[data-test-id="creator-profile-name"],[data-test-id="username"]'
					)?.textContent
				}`;
				presenceData.buttons = creatorProfile
					? [
							{ label: "Watch Video Pin", url: href },
							{
								label: "View Creator's Profile",
								url: creatorProfile,
							},
					  ]
					: [{ label: "Watch Video Pin", url: href }];
			} else {
				if (likesEl) {
					presenceData.smallImageKey = Assets.Likes;
					presenceData.smallImageText = `${likesEl} likes`;
				}
				presenceData.state = `Viewing pin by: ${
					document.querySelector(
						'[data-test-id="creator-profile-name"],[data-test-id="username"]'
					)?.textContent
				}`;
				presenceData.buttons = creatorProfile
					? [
							{ label: "View Pin", url: href },
							{
								label: "View Creator's Profile",
								url: creatorProfile,
							},
					  ]
					: [{ label: "View Pin", url: href }];
			}
			break;
		}
		case pathname.includes("/ideas/") &&
			!!pathname.match(/[0-9]{12}/gm)?.length: {
			presenceData.details = `Browsing through ideas about: ${ideasHubPage?.textContent}`;
			presenceData.state = Array.from(
				document.querySelectorAll('[data-test-id="breadcrumb"]') || []
			)
				.map(x => x?.textContent)
				.join(" => ");
			presenceData.buttons = [{ label: "Browse Through Ideas", url: href }];
			break;
		}
		case pathname.includes("/videos/"): {
			presenceData.details = "Browsing through videos";
			break;
		}
		case pathname === "/": {
			presenceData.details = "Viewing the homepage";
			break;
		}
		default: {
			presenceData.details = "Viewing an unknown page";
		}
	}

	if (!buttons && presenceData.buttons) delete presenceData.buttons;
	if (presenceData.details) presence.setActivity(presenceData);
});
