const presence = new Presence({ clientId: "1244143703660953651" }),
	browsingTimestamp = Math.floor(Date.now() / 1000);

const enum Assets {
	Logo = "https://cdn.rcd.gg/PreMiD/websites/W/Wolfery/assets/logo.png",
}

// TODO: Find potential links for adding presence button to open character sheet. (v1.1.0)

let detailMsg = "Roleplaying on Wolfery.com",
	stateMsg = "",
	appLocation = null;

presence.on("UpdateData", async () => {
	const characterPrivacy = await presence.getSetting<boolean>(
		"characterPrivacy"
	);

	appLocation = document
		.querySelector(".panel--titletxt")
		.textContent.toLowerCase();

	const getCharacterName = () =>
		document.querySelector(".namesection--title").textContent;

	switch (appLocation) {
		case "awake":
		case "character info": {
			let characterName = getCharacterName();

			if (characterPrivacy) {
				stateMsg = "";
				characterName = "";
			} else stateMsg = `Awake As: ${characterName}`;
			break;
		}
		case "character select": {
			stateMsg = "✏️ Choosing Character";
			detailMsg = null;
			break;
		}
		case "character settings": {
			stateMsg = "🔧 Tweaking Character Settings";
			detailMsg = null;
			break;
		}
		default: {
			stateMsg = "Roleplaying";
			detailMsg = null;
		}
	}

	presence.setActivity({
		details: detailMsg,
		state: stateMsg,
		largeImageKey: Assets.Logo,
		startTimestamp: browsingTimestamp,
	});
});
