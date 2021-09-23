/// <reference types="svelte"/>

interface WindowAPI extends Window {
	api: {
		search(name: object) : any,
		getDetails(id: number): any,
		openWebsite(url: string): void,
		partyjs: any
	}
}
