const iframe = new iFrame();

iframe.on("UpdateData", async () => {
	const video = document.querySelector("video");
	if (!isNaN(video?.duration)) {
		iframe.send({
			currentTime: video.currentTime,
			duration: video.duration,
			paused: video.paused,
		});
	}
});
