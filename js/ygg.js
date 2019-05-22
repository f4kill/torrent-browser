const CATEGORIES = {
	ALL: 'all',
	VIDEO: 2145,
	GAMES: 2142,
	APPS: 2144
}
const SUB_CATEGORIES = {
	VIDEO : {              
		ANIMATION: 2178,
		ANIMATION_SERIES: 2179,
		CONCERT: 2180,
		DOCUMENTARY: 2181,
		TV_SHOW: 2182,
		FILM: 2183,
		TV_SERIES: 2184,
		SHOW: 2185,
		SPORT: 2186
	}
}



function YggRowToObject($row) {
	let link =  $row.find('#torrent_name');
	let name = link.text();
	name = name.replace(/\r?\n|\r/, '').trim();

	let obj = {
		name: name,
		page: link.attr('href')
	};

	return obj;
}

/*var database = (function () {
    var database = null;
    $.ajax({
        'async': false,
        'global': false,
        'url': '/db.json',
        'dataType': "json",
        'success': function (data) {
            database = data;
        }
    });
    return database;
})();

var el = $( '<div></div>' );

	// https://www2.yggtorrent.ch/engine/search?do=search&order=desc&sort=completed
	// https://www2.yggtorrent.ch/engine/search?&category=2145&sub_category=all&do=search
	// https://www2.yggtorrent.ch/engine/search?name=&description=&file=&uploader=&category=2145&sub_category=2183&do=search
	$.ajax({
		//JSONP API
		url : '/proxy.php',
		data: {
			csurl: 'https://www2.yggtorrent.ch/engine/search',
			do: 'search',
			category: CATEGORIES.VIDEO,
			sub_category: SUB_CATEGORIES.VIDEO.FILM,
			order: 'desc',
			sort: 'completed'
		},
		dataType: 'html',
		//work with the response
		success: function(rawData) {
			el.html(rawData);
			console.log(YggRowToObject(el.find('[id="#torrents"] .results tbody tr').first()));
		},
		error: function(rawData) {
			console.log(arguments);
		}
	});
*/