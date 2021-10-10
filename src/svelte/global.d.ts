/// <reference types="svelte"/>

interface WindowAPI extends Window {
	api: {
		search(name: object) : Promise<any[]>,
		getDetails(id: number): Promise<any>,
		openWebsite(url: string): void
	}
}
