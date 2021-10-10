import Compressor from 'compressorjs';


export async function compressFiles(files: string[], width = 500, height = 400) {			
	let promise = new Promise<string[]>(async (resolve, reject) => {
		let images: string[] = [];
		let imageBlob: Blob[] = [];

		for (let i = 0; i < files.length; i++) {
			imageBlob.push(await (await fetch(files[i])).blob());
		}

		for (let i = 0; i < files.length; i++) {
			new Compressor(imageBlob[i], {
				quality: 0.6,
				width: width,
				height: height,
	
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
}

export async function compress(file: string, width = 500, height = 400) {
	let promise = new Promise<string>(async (resolve, reject) => {
		new Compressor(await fetch(file).then(res => res.blob()), {
			quality: 0.6,
			width: width,
			height: height,

			success(res: Blob) {
				resolve(URL.createObjectURL(res));
			},
			
			error(err: any) {
				console.log(err);
			}
		});
	});

	return promise;
}

export default {
	compressFiles,
	compress
}