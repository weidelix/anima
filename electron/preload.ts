import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld('api', {
	search: async (name : string) => {
		let data = await ipcRenderer.invoke('search', name);
		return data;
	},

	getDetails: async (id : number) => {
		let data = await ipcRenderer.invoke('get-details', id);
		return data;
	},

	openWebsite: (url : string) => {
		ipcRenderer.send('open-website', url);
	},
});