import { GraphQL } from "./routes/graphql";
import { MQTT } from "./routes/mqtt";
import { Profile } from "./routes/profile";
import { Rest } from "./routes/rest";
import { Settings } from "./routes/settings";
import { SocketIO } from "./routes/socketio";
import { ServerSentEvents } from "./routes/sse";
import { Websocket } from "./routes/websocket";

const presence = new Presence({
	clientId: "792735245488488458",
});

export const enum Assets {
	Logo = "https://cdn.rcd.gg/PreMiD/websites/H/Hoppscotch/assets/logo.png",
	Rest = "https://cdn.rcd.gg/PreMiD/websites/H/Hoppscotch/assets/0.png",
	GraphQL = "https://cdn.rcd.gg/PreMiD/websites/H/Hoppscotch/assets/1.png",
	Websocket = "https://cdn.rcd.gg/PreMiD/websites/H/Hoppscotch/assets/2.png",
	ServerSentEvents = "https://cdn.rcd.gg/PreMiD/websites/H/Hoppscotch/assets/3.png",
	SocketIO = "https://cdn.rcd.gg/PreMiD/websites/H/Hoppscotch/assets/4.png",
	MQTT = "https://cdn.rcd.gg/PreMiD/websites/H/Hoppscotch/assets/5.png",
	Settings = "https://cdn.rcd.gg/PreMiD/websites/H/Hoppscotch/assets/6.png",
	Profile = "https://cdn.rcd.gg/PreMiD/websites/H/Hoppscotch/assets/7.png",
}

const BASE = {
		name: "Hoppscotch",
		largeImageKey: Assets.Logo,
		startTimestamp: Math.floor(Date.now() / 1000),
	},
	Route = {
		"/": Rest,
		"/graphql": GraphQL,
		"/realtime/websocket": Websocket,
		"/realtime/sse": ServerSentEvents,
		"/realtime/socketio": SocketIO,
		"/realtime/mqtt": MQTT,
		"/settings": Settings,
		"/profile": Profile,
	} as {
		[key: string]: () => PresenceData | null;
	};

presence.on("UpdateData", async () => {
	const currentRoute = Route[document.location.pathname];

	if (!currentRoute) return;

	const presenceData = currentRoute();

	if (presenceData === null) return;

	presence.setActivity({ ...BASE, ...presenceData });
});
