class Ygg {

	static get ACTIONS () {
		return { SEARCH: 'search' };
	}

	static get CATEGORIES () {
		return {
			ALL: 'all',
			VIDEO: 2145,
			GAMES: 2142,
			APPS: 2144
		};
	}
	static get SUB_CATEGORIES () {
		return {
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
	}

	constructor() {
		// https://www2.yggtorrent.ch/engine/search?do=search&order=desc&sort=completed
		// https://www2.yggtorrent.ch/engine/search?&category=2145&sub_category=all&do=search
		// https://www2.yggtorrent.ch/engine/search?name=&description=&file=&uploader=&category=2145&sub_category=2183&do=search

		$.ajax({
			//JSONP API
			url : '/proxy.php',
			data: {
				csurl: 'https://ygg.to'
			},
			dataType: 'html',
			//work with the response
			success: function(answer) {
				// console.log(arguments);
			},
			error: function() {
				console.log(arguments);
			}
		});
	}

	searchTorrent(query, sub_category, callback) {

		$.ajax({
			//JSONP API
			url : '/proxy.php',
			data: {
				name: query,
				do: Ygg.ACTIONS.SEARCH,
				category: Ygg.CATEGORIES.VIDEO,
				sub_category: sub_category,
				sort: 'completed',
				order: 'desc'
			}, //  `http://www2.yggtorrent.ch/engine/search?name=${query}&do=${Ygg.SEARCH}&category=${Ygg.CATEGORIES.VIDEO}&order=desc&sort=completed$sub_category=${sub_category}`
			dataType: 'html',
			beforeSend: function(request) {
				request.setRequestHeader("X-Proxy-URL", 'https://www2.yggtorrent.ch/engine/search');
			},
			//work with the response
			success: answer => {
				let $answer = $('<div></div>');
				$answer.html(answer);

				let container = $answer.find('[id="#torrents"]');
				console.log($answer.find('form').serialize());
				if(container.length > 0) {
					let results =  container.find('tr');
					let array = [];

					results.each((i, row) => {
						array[i] = this.parseRow($(row));
					});

					callback(array);
				} else {
					callback([{name:'error'}]);
				}
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
			link: link.attr('href')
		};

		return obj;
	}

	parseTorrentPage() {

	}
}

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

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