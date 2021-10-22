declare const window: WindowAPI;

interface User {
	library: any[],
	queue: any[]
}

let profile: User;

async function init () {
	profile = await window.app.readUserProfile();
}

async function addToLibrary(game: any) {
	if (!inLibrary(game) && game.id !== -9999) {
		profile.library.push(game);

		window.app.writeUserProfile(JSON.stringify(profile));
	}
}

async function addToQueue(game: any) {
	if (!inQueue(game) && game.id !== -9999) {
		profile.queue.push(game);
	
		window.app.writeUserProfile(JSON.stringify(profile));
	}
}

async function removeFromLibrary(game: any) {
	profile.library = profile.library.filter(el => el.id !== game.id);
	window.app.writeUserProfile(JSON.stringify(profile));
}

async function removeFromQueue(game: any) {
	profile.queue = profile.queue.filter(el => el.id !== game.id);
	window.app.writeUserProfile(JSON.stringify(profile));
}

function readLibrary(): any[] {
	return profile.library;
}

function readQueue(): any[] {
	return profile.queue;
}

function inLibrary(game: number): boolean {
	return profile.library.some(({id}) => id === game);
}

function inQueue(game: number): boolean {
	return profile.queue.some(({id}) => id === game);
}

export default {
	init,
	addToLibrary,
	addToQueue,
	removeFromLibrary,
	removeFromQueue,
	readLibrary,
	readQueue,
	inLibrary,
	inQueue
}