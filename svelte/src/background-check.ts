	
	// let titleElement: HTMLElement;
	// function getImageLightness(imageSrc, callback) {
  //   let img = document.createElement("img");
  //   img.src = imageSrc;
  //   img.style.display = "none";
  //   document.body.appendChild(img);

  //   let colorSum = 0;

  //   img.onload = function() {
	// 		let left = titleElement.getBoundingClientRect().left;
	// 		let top = titleElement.getBoundingClientRect().top;
	// 		let right = titleElement.getBoundingClientRect().width;
	// 		let bottom = titleElement.getBoundingClientRect().bottom;

	// 		// create canvas
	// 		let canvas = document.createElement("canvas");
	// 		canvas.width = window.outerWidth;
	// 		canvas.height = window.outerHeight;

	// 		let ctx = canvas.getContext("2d");
	// 		ctx.drawImage(img, 0, 0);

	// 		let imageData = ctx.getImageData(left, top, right, bottom);
	// 		let data = imageData.data;
	// 		let r,g,b,avg;

	// 		for(let x = 0, len = data.length; x < len; x+=4) {
	// 				r = data[x];
	// 				g = data[x+1];
	// 				b = data[x+2];

	// 				avg = Math.floor((r+g+b)/3);
	// 				colorSum += avg;
	// 		}

	// 		let brightness = Math.floor(colorSum / (right*bottom));
	// 		callback(brightness);
	// 		canvas.remove();
	// 		img.remove();
	// 	}
	// }

	// function setFontColor(value: number) {
	// 	if 			(value >= 0 && value <= 126) titleColor = 'text-white'; 
	// 	else if (value >= 127) titleColor = 'text-white'; 
	// 	// else if (number >= 75 && number <= 100) metaColor = 'green';
	// }