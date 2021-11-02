/// <reference types="svelte"/>

declare module '*.png';
declare module '*.svg';

interface WindowAPI extends Window {
	anima: {
		init(): void,
		search(name: object): Promise<any[]>,
		getDetails(id: number): Promise<any>,
		openWebsite(url: string): void,
	},
	
	app: {
		readUserProfile(): Promise<any>,
		writeUserProfile(data: string): void,
		init(): void,
		quit(): void,
	}
}
