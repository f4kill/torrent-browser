$(document).ready(function() {
	let ygg = new Ygg();
	let plex = new Plex(plexUrl, '32400', plexApiKey);
	let themoviedb = new MovieAPI(themoviedbApiKey, plex, ygg);


	setupListeners();
});

function setupListeners() {

	$(document).on('change', '.segmented label input[type=radio]', function() {
		if($(this).is(':checked')) {
		   $(this).parent().siblings().each(function() {
				$(this).removeClass('checked');
			});
			$(this).parent().addClass('checked');
		}
	});

	$(document).on('load', 'img.media-poster', () => {
		console.log('trigger');
		let blur = 20;

		let canvas = $(this).siblings('canvas.media-card-shadow')[0];
		if(canvas != undefined) {
			blur *= window.devicePixelRatio;
			let margin = blur + 2;
			canvas.getContext("2d").drawImage(this, margin, margin, canvas.width - margin*2, canvas.height - margin*2);

			stackBlurCanvasRGBA(canvas, 0, 0, canvas.width, canvas.height, blur);
		}
	}).each(function() {
		console.log('complete', this)
		if(this.complete) $(this).trigger('load');
	});
}

function imageToBlurredCanvas(image, blur) {
	let $image = $(image);

	var canvas = document.createElement("canvas");
	blur *=  window.devicePixelRatio;
	canvas.width = image.offsetWidth + blur * 2 + 4;
	canvas.height = image.offsetHeight + blur * 2 + 4;
	canvas.getContext("2d").drawImage(image, blur + 2, blur + 2, image.width, image.height);

	stackBlurCanvasRGBA(canvas, 0, 0, canvas.width, canvas.height, blur);

	return canvas;
}