import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('anima', {
	search: async (name: string) => {
		let data = await ipcRenderer.invoke('search', name);
		return data;
	},

	getDetails: async (id: number) => {
		let data = await ipcRenderer.invoke('get-details', id);
		return data;
	},
	
	openWebsite: (url: string) => {
		ipcRenderer.send('open-website', url);
	}
});

contextBridge.exposeInMainWorld('app', {
	readUserProfile: async () => {
		let data = await ipcRenderer.invoke('read-user-profile');
		return data;
	},

	writeUserProfile: (data: string) => {
		ipcRenderer.send('write-user-profile', data);
	},
	
	init: async () => {
		ipcRenderer.send('init');
	},

	quit: () => {
		ipcRenderer.send('quit');
	},
});
