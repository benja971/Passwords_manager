// 21.12.17

const use_cache = false;

const badge = '/img/badge_icon_x192.png';
const icon = '/img/round_icon_x512.png';

// Install event
self.addEventListener('install', async e => {
	console.log('Service worker installed');

	// Show notification
	self.registration.showNotification('Update', {
		body: 'App is updating...',
		badge,
		icon,
		tag: 'update',
		requireInteraction: true
	});

	self.skipWaiting();
});

// Activate event
self.addEventListener('activate', async e => {
	console.log('Service worker activated');

	// Delete main and nav caches
	caches.delete('main');
	caches.delete('nav');

	// Show notification
	self.registration.showNotification('Update', {
		body: 'App updated.',
		actions: [{ title: 'Reload', action: 'reload' }],
		badge,
		icon,
		tag: 'update',
		renotify: true
	});

	self.clients.claim();
});

// Fetch event
self.addEventListener('fetch', e => e.respondWith(respond(e)));

async function fetchAndCache(req, cache_name) {
	// Fetch request
	const fetch_res = await fetch(req);

	if (use_cache && req.method !== 'POST') {
		// Open cache and save a cloned result
		const cache = await caches.open(cache_name);
		cache.put(req, fetch_res.clone());
	}

	return fetch_res;
}

async function respond(e) {
	// Try to get response from cache
	const cached_res = await caches.match(e.request);

	// If response is found, return it
	if (cached_res) return cached_res;

	// If request is not found, try to fetch it
	return await fetchAndCache(e.request, 'main');
}

// Refresh clients
async function refreshClients() {
	const client_list = await self.clients.matchAll();
	for (const client of client_list) client.navigate?.('/');
}

// Notification click
self.addEventListener('notificationclick', e => {
	console.log('Notification clicked');
	console.dir(e);

	// Close action
	if (e.action === 'close') e.notification.close();

	// Reload action
	if (e.action === 'reload') {
		e.notification.close();
		refreshClients();
	}
});

// Notification close
self.addEventListener('notificationclose', e => {});

// Broadcast channel
const channel = new BroadcastChannel('sw-messages');

// Broadcast messages
channel.addEventListener('message', async e => {});
