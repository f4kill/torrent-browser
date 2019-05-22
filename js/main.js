$(document).ready(function() {
	let plex = new Plex(plexUrl, '32400', plexApiKey);
	let themoviedb = new MovieAPI(themoviedbApiKey, plex);


	/*$('#target').load(
		'proxy.php', {
			csurl: 'https://www2.yggtorrent.ch/engine/search',
			param1: value1,
			param2: value2
		}
	);*/

	/*$.ajax({
	   type: "POST",
	   contentType: "application/x-www-form-urlencoded",
	   url: "http://website/index.php",        
	   data: { username: "myuser", password: "123456" },
	   success: function(data) {
			console.log("success ", data.response);
		},
		error: function(data) {
			console.log("error ", data.error);
		},
		dataType: "html"               
	});*/




	// getConfig(function() {
	// 	// $('.main-feed-footer').append($('#load-more').clone().removeAttr('id'));
	// 	// triggerLoad();
	// 	// updateForm();
	// });

	setupListeners();

});

function setupListeners() {

	$(".segmented label input[type=radio]").each(function() {
		$(this).on("change", function() {
			if($(this).is(":checked")) {
			   $(this).parent().siblings().each(function() {
					$(this).removeClass("checked");
				});
				$(this).parent().addClass("checked");
			}
		});
	});












	// $('.utd-form').submit(function(event) {
	// 	event.preventDefault();
	// });

	// $('.utd-form :input').change(function(event) {
	// 	updateResults($(this).closest('.utd-parent'));
	// });

	// $('.utd-form :input[name="media_type"]').change(function(event) {
	// 	updateForm();
	// });

	// $(window).scroll(function(argument) {
	// 	triggerLoad();
	// });
	
	// $(window).scroll(function() {
	// 	$autoStick = $('.auto-stick');
	// 	$autoStick.each(function() {
	// 		let $this = $(this);
	// 		if($this.getBoundingClientRect().top <= 0) {
	// 			$this.addClass('stick');
	// 		} else {
	// 			$this.removeClass('stick');
	// 		}
	// 	});
	// });
}


function requestTMDb(callback, request = { method: "discover", media_type: "movie" } ) {
	// if(api.url == undefined || api.version == undefined || api.key == undefined || request.method == undefined) {
	// 	return false;
	// }

	url = `${api.url}${api.version}/${request.method}`;

	if (request.method !== 'find') {
		url += '/' + request.media_type;
	}

	url += '?api_key=' + api.key;

	if (typeof request.language === 'string') {
		url += '&language=' + request.language;
	}
	if (typeof request.query === 'string' && method === 'search') {
		url += '&query=' + request.query;
	}

	if(request.method === '/discover') {
		if (request.media_type === 'movie') {
			url += '&include_video=true';
		}

		if(typeof request.genre === 'string') {
			url += '&with_genres=' + request.genre;
		}

		if(typeof request.genre === 'array') {
			url += '&with_genres=' + request.genre.join(',');
		}
	}

	if (typeof request.page === 'number' && request.page > 0) {
		url += '&page=' + request.page;
	} else {
		url += '&page=1';
	}

	if (typeof request.region !== 'undefined') {
		url += '&region=' + request.region;
	}


	if (typeof request.include_adult !== 'undefined') {
		url += '&include_adult=' + request.include_adult;
	}

	jsonpRequest(callback, url);
}


function appendPage(parsedData, $container, $layout, $sectionLayout) {

	// create new page
	$container.append($('<div class="page"></div>').attr('utd-page', parsedData.page));
	$container = $container.find(`[utd-page="${parsedData.page}"]`);

	for (var key in parsedData.results) {
		// skip loop if the property is from prototype
		if (!parsedData.results.hasOwnProperty(key)) continue;

		appendSection(parsedData.results[key], $container, $layout, $sectionLayout);
	}
}

function appendSection(sectionData, $container, $layout) {

	sectionData.forEach(function(item, index) {
		// find if movie or tv
		let itemType = item.media_type;
		if(typeof itemType !== 'string') {
			itemType = typeof item.first_air_date === 'undefined' ? 'movie' : 'tv';
		}

		// get element layout
		let element = $layout.clone();
		element.removeAttr('id').removeClass('layout');

		// set id, to easily update fields
		element.attr('utd-id', item.id);

		// fill fields using custom attrs
		element.find('[utd-content]').each(function(index, field) {
			setContent(index, field, item);
		});

		element.find('[utd-link]').each(function(index, field) {
			setLink(index, field, item);
		});

		element.find('[utd-image]').each(function(index, field) {
			setImage(index, field, item);
		});

		//setTimeout(function() {
			$container.append(element);
		//}, 8*index); // for the stylez
		element = undefined;
	});
}

function updateForm() {
	// update genres
	let genreSelect = $('.utd-form [name="genre"]');
	genreSelect.each(function() {
		let $this = $(this);
		let request = getRequest($(this).closest('.utd-form'));
		if(typeof genres[request.media_type].genres === 'object') {
			$this.html('');
			genres[request.media_type].genres.forEach(function(genre, index) {
				$this.append(`<option value="${genre.id}" ${index == 0 ? 'checked':''}>${genre.name}</option>`);
			});
		}
	})
}

function setContent(index, field, itemData) {
	field = $(field);
	// which data is asked for ?
	let key = field.attr('utd-content');
	if(typeof key === 'undefined') {
		return;
	}

	// get data
	let content = itemData[key];
	if(key == 'release_date' && typeof itemData[key] === 'string') {
		content = parseDate(content);
	}
	field.html(content);
}

function setLink(index, field, itemData) {
	// make link from id
	$(field).attr('href', itemUrl(itemData[id], itemType));
}

function setImage(index, field, itemData) {
	field = $(field);

	// get type & size
	let key = field.attr('utd-image');
	if(typeof key === 'undefined') {
		return;
	}
	let size = field.attr('utd-image-size');

	// default size
	if (typeof size === 'undefined') {
		size = "w500";
	}

	// make url from path and size
	field.attr('src', imageUrl(itemData[key], size));
};

function itemUrl(id, type = 'movie') {
	// may need to add more code for artists and things
	return `https://www.themoviedb.org/${type}/${id}`;
}

function parseMultiSearch(rawData) {
	let parsedData = {};
	parsedData.results = {};
	parsedData.page = rawData.page;
	parsedData.total_results = rawData.total_results;
	parsedData.total_pages = rawData.total_pages;

	// if not a multi search
	if (typeof rawData.results[0].media_type === 'undefined') {
		// nothing to parse
		parsedData.results.all = rawData.results;
		return parsedData;
	}
	// default array
	parsedData.results.remains = [];

	// store each type of item in its corresponding category
	rawData.results.forEach(function(item) {
		// get item type
		let key = item.media_type;

		// create category for this item
		if(typeof parsedData.results[key] === 'undefined') {
			parsedData.results[key] = [];
		}
		parsedData.results[key].push(item);
	});

	return parsedData;
}

// will be called every update of value
var updateResults = debounce(function($parent, $layout) {
	if($layout === undefined) {
		var $layout = $parent.find('.layout');
	}

	if (!$parent.hasClass('loading')) {
		$parent.addClass('loading');
		let $container = $parent.find('.utd-content');
		let $form = $parent.find('.utd-form');
		let request = getRequest($form);

		requestTMDb(function(rawData) {
			var parsedData = parseMultiSearch(rawData);

			$container.html('');
			appendPage(parsedData, $container, $layout);

			$parent.removeClass('loading');
		}, request);
	}
}, 60);

function triggerLoad() {
	$('button.load-more:not(#load-more)').each(function() {
		if(isScrolledIntoView(this)) {
			this.onclick();
		}
	});
}

function loadMore(thisel) {
	let $this = $(thisel);
	if(!$this.hasClass('loading')) {
		$this.addClass('loading');
		let $parent = $this.closest('.utd-parent');
		let $container = $parent.find('.utd-content');
		let $layout = $parent.find('.layout');
		let $form = $parent.find('.utd-form');
		let request = getRequest($form);
		request.page = parseInt($parent.find('[utd-page]:last-of-type').attr('utd-page')) + 1;

		requestTMDb(function(rawData) {
			var parsedData = parseMultiSearch(rawData);
			appendPage(parsedData, $container, $layout);

			$this.removeClass('loading');
		}, request);
	}
}

//var request = {}
function getRequest($form) { // formEl
	let request = {};

	request.method = $form.find('[name="method"]').val();
	// /request/multi
	// /discover
	// /find
	if(request.method === 'search') {
		request.query = $form.find('[name="query"]').val();
	}

	if(request.method === 'discover') {
		let year = $form.find('[name="year"]').val()
		let genre = $form.find('[name="genre"]').val();
		if(typeof year !== 'undefined' && year != '-') {
			request.year = parseInt(year);
		}
		if(typeof genre !== 'undefined') {
			request.genre = genre;
		}
	}
	request.media_type = $form.find('[name=media_type]:checked').val();

	request.first_page = $form.find('[name="page"]').val();
	request.page_count = $form.find('[name="page_count"]').val();

	return request;
}





















// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
function debounce(func, wait, immediate) {
	let timeout;
	return function() {
		let context = this, args = arguments;
		let later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		let callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};

function closestInArray(value, array) {
	// init with first delta and minimum value
	let prev = Math.abs(array[0] - value);
	let min = array[0];
	array.forEach(function(entry, index) {
		// delta for each value
		let delta = Math.abs(entry - value);

		// if delta is lower than previous, its lower than every previous
		if (delta < prev) {
			// save the new minimum
			min = entry;
		}

		// new prev before new loop
		prev = delta;
	});

	// found minimum
	return min;
}

function isScrolledIntoView(elem) {
	var docViewTop = $(window).scrollTop();
	var docViewBottom = docViewTop + $(window).height();

	var elemTop = $(elem).offset().top;
	var elemBottom = elemTop + $(elem).height();

	return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
}