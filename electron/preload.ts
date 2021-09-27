import { contextBridge, ipcRenderer } from "electron";
import Compressor from 'compressorjs';

contextBridge.exposeInMainWorld('api', {
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
	},
	
	compressFiles: async (files: string[]) => {
		let data = await ipcRenderer.invoke('compress', files);

		return data;
	},

	compress: async (file: string) => {
		let promise = new Promise<string>(async (resolve, reject) => {
			new Compressor(await fetch(file).then(res => res.blob()), {
				quality: 0.2,
				maxHeight: 600,
				maxWidth: 480,
	
				success(res: Blob) {
					resolve(URL.createObjectURL(res));
				},
				
				error(err: any) {
					console.log(err);
				}
			});
		});
		
		return promise;
	},
});