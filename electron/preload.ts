import { contextBridge, ipcRenderer } from "electron";
import Compressor from 'compressorjs';

contextBridge.exposeInMainWorld('api', {
	search: async (name: string) => {
		let data = await ipcRenderer.invoke('search', name);
		return data.results;
	},

	getDetails: async (id: number) => {
		let data = await ipcRenderer.invoke('get-details', id);
		return data;
	},
	
	openWebsite: (url: string) => {
		ipcRenderer.send('open-website', url);
	},
	
	compressFiles: async (files: string[]) => {			
		let promise = new Promise<string[]>(async (resolve, reject) => {
			let images: string[] = [];
			let imageBlob: Blob[] = [];

			for (let i = 0; i < files.length; i++) {
				imageBlob.push(await (await fetch(files[i])).blob());
			}

			for (let i = 0; i < files.length; i++) {
				new Compressor(imageBlob[i], {
					quality: 0.6,
					maxHeight: 600,
					maxWidth: 480,
		
					success(res: Blob) {
						images[i] = URL.createObjectURL(res);

						if (!images.includes(undefined)) {
							resolve(images);
						}
					},
					
					error(err: any) {
						console.log(err);
					}
				});
			}
		});
		
		return promise;
	},

	compress: async (file: string) => {
		let promise = new Promise<string>(async (resolve, reject) => {
			new Compressor(await fetch(file).then(res => res.blob()), {
				quality: 0.6,
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