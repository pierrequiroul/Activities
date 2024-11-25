export function getImage(): string | undefined {
	for (const img of document.images) {
		if (
			["poster anime", "Poster Anime", "Anime Cover"].includes(
				String(img.attributes.getNamedItem("alt")?.value)
			)
		)
			return String(img.src);
	}
}

export function getTitle(): string | undefined {
	const nt = document.querySelector(".title-nt"),
		ro = document.querySelector(".title-rm"),
		en = document.querySelector(".title-en");

	if (en) return en.textContent;
	if (ro) return ro.textContent;
	if (nt) return nt.textContent;

	return document.querySelector("h1")?.textContent;
}

export function getEpisode(): number {
	let episode = 1;
	const query = [...document.querySelectorAll("h3")]
		.find(a => a.textContent.includes("Episode"))
		?.textContent?.replace("Episode ", "");

	if (query) episode = Number(query);

	return episode;
}

export function getId(): number {
	const { search, pathname } = document.location;

	for (const [key, value] of search
		.substr(1)
		.split("&")
		.map(s => s.split("=")))
		if (key === "id") return Number(value);

	for (const path of pathname.split("/"))
		if (path.match(/^(\d+)$/)) return Number(path);
}
