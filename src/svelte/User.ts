import { writable } from 'svelte/store';

declare const window: WindowAPI;

interface User {
	library: any[],
	queue: any[]
}

export const profile = writable({library: [], queue: []});

async function init () {
	profile.set(await window.app.readUserProfile());
}

async function addToLibrary(game: any) {
	if (!inLibrary(game) && game.id !== -9999) {
		profile.update(value => {
			value.library.push(game);
			window.app.writeUserProfile(JSON.stringify(value));
			return value;
		});
	}
}

async function addToQueue(game: any) {
	if (!inQueue(game) && game.id !== -9999) {
		profile.update(value => {
			value.queue.push(game);
			window.app.writeUserProfile(JSON.stringify(value));
			return value;
		});
	}
}

async function removeFromLibrary(game: any) {
	profile.update(value => {
		value.library = value.library.filter(el => el.id !== game.id);
		window.app.writeUserProfile(JSON.stringify(value));
		return value;
	});
}

async function removeFromQueue(game: any) {
	profile.update(value => {
		value.queue = value.queue.filter(el => el.id !== game.id);
		window.app.writeUserProfile(JSON.stringify(value));
		return value;
	});
}

function isFirstGame(game: number) {
	let isFirst = false;

	profile.update(value => {
		isFirst = value.queue[0].id === game;
		return value;
	});

	return isFirst;
}

function writeLibrary(array: any[]) {
	profile.update(value => {
		value.library = array;
		window.app.writeUserProfile(JSON.stringify(value));
		return value;
	});
}

function writeQueue(array: any[]) {
	profile.update(value => {
		value.queue = array;
		window.app.writeUserProfile(JSON.stringify(value));
		return value;
	});
}

function inLibrary(game: number): boolean {
	let inLibrary = false;

	profile.update(value => {
		inLibrary = value.library.some(({id}) => id === game);
		return value;
	});

	return inLibrary;
}

function inQueue(game: number): boolean {
	let inQueue = false;

	profile.update(value => {
		inQueue = value.queue.some(({id}) => id === game);
		return value;
	});

	return inQueue;
}

export default {
	init,
	addToLibrary,
	addToQueue,
	removeFromLibrary,
	removeFromQueue,
	isFirstGame,
	writeLibrary,
	writeQueue,
	inLibrary,
	inQueue
}