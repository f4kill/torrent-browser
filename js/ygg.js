class Ygg {

	static ACTIONS = {
		SEARCH: 'search'
	}

	static CATEGORIES = {
		ALL: 'all',
		VIDEO: 2145,
		GAMES: 2142,
		APPS: 2144
	}
	static SUB_CATEGORIES = {
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

	constructor() {
		// https://www2.yggtorrent.ch/engine/search?do=search&order=desc&sort=completed
		// https://www2.yggtorrent.ch/engine/search?&category=2145&sub_category=all&do=search
		// https://www2.yggtorrent.ch/engine/search?name=&description=&file=&uploader=&category=2145&sub_category=2183&do=search

		$.ajax({
			//JSONP API
			url : '/proxy.php',
			data: {
				csurl: 'https://www.ygg.to'
			},
			dataType: 'html',
			//work with the response
			success: function(answer) {
				console.log(arguments);
			},
			error: function() {
				console.log(arguments);
			}
		});
	}

	searchTorrent(query, sub_category) {
		$.ajax({
			//JSONP API
			url : '/proxy.php',
			data: {
				csurl: 'https://www2.yggtorrent.ch/engine/search',
				do: this.SEARCH,
				category: this.CATEGORIES.VIDEO,
				sub_category: sub_category,
				order: 'desc',
				sort: 'completed'
			},
			dataType: 'html',
			//work with the response
			success: function(answer) {
				let $answer = $('<div></div>');
				$answer.html(answer);

				let results = $answer.find('[id="#torrents"] .results tbody tr');

				results.each((i, row) => )
				console.log(this.parseRow(el.find('[id="#torrents"] .results tbody tr').first()));
			},
			error: function() {
				console.log(arguments);
			}
		});
	}

	getTorrentInfos(id) {

	}

	parseRow($row) {
		let link =  $row.find('#torrent_name');
		let name = link.text();
		name = name.replace(/\r?\n|\r/, '').trim();

		let obj = {
			name: name,
			page: link.attr('href')
		};

		return obj;
	}

	parseTorrentPage() {

	}
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
*/