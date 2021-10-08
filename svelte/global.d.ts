/// <reference types="svelte"/>

interface WindowAPI extends Window {
	api: {
		search(name: object) : Promise<any[]>,
		getDetails(id: number): Promise<any>,
		openWebsite(url: string): void,
		compressFiles(files: string[], width = 600, height = 480): Promise<string[]>
		compress(file: string, width = 600, height = 480): Promise<string>
	}
}
