const channel = new BroadcastChannel("sw-messages");

addEventListener("load", async e => {
	const reg = await navigator.serviceWorker?.register("/service-worker.js");
	Notification.requestPermission();
	console.log("Registered for " + reg.scope);
});

channel.addEventListener("message", event => {
	console.dir(event.data.action);
});

document.querySelector("#test").addEventListener("click", async () => {
	self.registration.showNotification("TEST", {
		body: "I'm trying to do some notifs.",
		// actions: [{ title: "Reload", action: "reload" }],
		badge,
		icon,
		tag: "test",
		renotify: true,
	});
});
