const presence = new Presence({
	clientId: "1256196660657393714",
});

let isFetching = false;

const enum Assets {
	Logo = "https://cdn.rcd.gg/PreMiD/websites/M/Max/assets/logo.png",
}

let fetchedInfo: {
	included: {
		attributes: {
			alternateId: string;
			src?: string;
			name?: string;
			episodeNumber?: number;
			seasonNumber?: number;
			videoType?: string;
		};
		id: string;
		relationships?: {
			images: {
				data: {
					id: string;
				}[];
			};
			show: {
				data: {
					id: string;
				};
			};
		};
	}[];
	path: string;
};

function findAlternateId(id: string) {
	return fetchedInfo.included?.find(x => x.attributes?.alternateId === id);
}

function findId(id: string) {
	return fetchedInfo.included?.find(x => x.id === id);
}

async function fetchPageInfo() {
	const { pathname } = location;

	if (isFetching || fetchedInfo?.path === pathname) return;
	isFetching = true;

	try {
		fetchedInfo = await fetch(
			`https://default.any-amer.prd.api.max.com/cms/routes${pathname}?include=default&page[items.size]=10`,
			{
				method: "GET",
				credentials: "include",
			}
		).then(res => res.json());
	} catch {
		isFetching = false;
		return false;
	}

	fetchedInfo.path = pathname;
	isFetching = false;

	return true;
}

function getTitleInfo(usePresenceName?: boolean) {
	if (!fetchedInfo) return;

	if (location.pathname.includes("/video/")) {
		const episodeInfo = findAlternateId(location.pathname.split("/")[3]),
			showInfo = findAlternateId(episodeInfo?.relationships.show.data.id);

		if (!episodeInfo || !showInfo) return;

		return {
			name: usePresenceName ? showInfo.attributes.name : "Max",
			details: usePresenceName
				? episodeInfo.attributes.name
				: showInfo.attributes.name,
			state:
				episodeInfo.attributes.videoType === "MOVIE"
					? "Movie"
					: usePresenceName
					? `Season ${episodeInfo.attributes.seasonNumber}, Episode ${episodeInfo.attributes.episodeNumber}`
					: `S${episodeInfo.attributes.seasonNumber}:E${episodeInfo.attributes.episodeNumber} ${episodeInfo.attributes.name}`,
			largeImageKey: findId(showInfo.relationships.images.data[5].id).attributes
				.src,
		};
	}

	const info = findAlternateId(location.pathname.split("/")[2]);
	return {
		state: info?.attributes.name,
		largeImageKey: findId(info?.relationships.images.data[5].id)?.attributes
			.src,
	};
}

presence.on("UpdateData", async () => {
	const presenceData: PresenceData = {
			type: ActivityType.Watching,
			largeImageKey: Assets.Logo,
		},
		[usePresenceName, showCoverArt] = await Promise.all([
			presence.getSetting<boolean>("usePresenceName"),
			presence.getSetting<boolean>("cover"),
		]);
	await fetchPageInfo();

	switch (document.location.pathname.split("/")[1]) {
		case "show": {
			Object.assign(presenceData, getTitleInfo());
			presenceData.details = "Viewing a show:";
			break;
		}
		case "movie": {
			Object.assign(presenceData, getTitleInfo());
			presenceData.details = "Viewing a movie:";
			break;
		}
		case "video": {
			const video = document.querySelector("video");
			Object.assign(presenceData, getTitleInfo(usePresenceName));

			if (video) {
				if (!video.paused) {
					[presenceData.startTimestamp, presenceData.endTimestamp] =
						presence.getTimestampsfromMedia(video);
				}

				presenceData.smallImageKey = video.paused ? Assets.Pause : Assets.Play;
				presenceData.smallImageText = video.paused ? "Paused" : "Playing";
			}
			break;
		}
		default: {
			presenceData.details = "Browsing...";
			break;
		}
	}

	if (!showCoverArt) presenceData.largeImageKey = Assets.Logo;

	if (presenceData.details) presence.setActivity(presenceData);
	else presence.setActivity();
});
