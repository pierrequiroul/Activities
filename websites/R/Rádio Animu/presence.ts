const presence = new Presence({
		clientId: "1159205639852138628",
	}),
	strings = presence.getStrings({
		play: "general.playing",
	}),
	browsingTimestamp = Math.floor(Date.now() / 1000);

let artist: string, title: string, artwork: string, playing: boolean;

presence.on(
	"iFrameData",
	(data: {
		playing: boolean;
		artist: string;
		title: string;
		artwork: string;
	}) => {
		({ playing } = data);
		if (playing) ({ artist, title, artwork } = data);
	}
);

presence.on("UpdateData", async () => {
	const presenceData: PresenceData = {
		largeImageKey:
			"https://cdn.rcd.gg/PreMiD/websites/R/R%C3%A1dio%20Animu/assets/logo.png",
		startTimestamp: browsingTimestamp,
	};

	if (playing) {
		presenceData.type = ActivityType.Listening;
		presenceData.details = artist;
		presenceData.state = title;
		presenceData.smallImageKey = Assets.Play;
		presenceData.smallImageText = (await strings).play;
		presenceData.largeImageKey = artwork;
	} else if (document.location.pathname.includes("/grade/")) {
		presenceData.details = "Grade de Programação";
		presenceData.smallImageKey = Assets.Reading;
	} else if (document.location.pathname.includes("/pedidos/")) {
		presenceData.details = "Pedidos";
		presenceData.smallImageKey = Assets.Reading;
	} else if (document.location.pathname.includes("/equipe/")) {
		presenceData.details = "Equipe";
		presenceData.smallImageKey = Assets.Reading;
	} else if (document.location.pathname.includes("/sobre/")) {
		presenceData.details = "Sobre";
		presenceData.smallImageKey = Assets.Reading;
	} else if (document.location.pathname.includes("/fazerparte/")) {
		presenceData.details = "Faça Parte da Equipe";
		presenceData.smallImageKey = Assets.Reading;
	} else if (document.location.pathname.includes("/parceria/")) {
		presenceData.details = "Parceria";
		presenceData.smallImageKey = Assets.Reading;
	} else if (document.location.pathname.includes("/suafansingaqui/")) {
		presenceData.details = "Sua Fansing Aqui";
		presenceData.smallImageKey = Assets.Reading;
	} else if (document.location.pathname.includes("/historia/")) {
		presenceData.details = "História";
		presenceData.smallImageKey = Assets.Reading;
	} else if (document.location.pathname === "/") {
		presenceData.details = "Página inicial";
		presenceData.smallImageKey = Assets.Reading;
	} else {
		presenceData.details = "Algures por aqui...";
		presenceData.smallImageKey = Assets.Reading;
	}

	if (!presenceData.details) presence.setActivity();
	else presence.setActivity(presenceData);
});
