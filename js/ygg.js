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
			},
			dataType: 'html',
			beforeSend: function(request) {
				request.setRequestHeader("X-Proxy-URL", 'https://www2.yggtorrent.ch/engine/search');
			},
			//work with the response
			success: answer => {
				let $answer = $('<div></div>');
				$answer.html(answer);

				let table = $answer.find('[id="#torrents"] table');
				if(table.length > 0) {
					let array = this.parseTable(table);

					callback(array);
				} else {
					console.log('error parsing ygg');
				}
			},
			error: function() {
				console.log(arguments);
			}
		});
	}

	getTorrentInfos(id) {

	}

	parseTable($table) {
		let headers = [];

		// get table headers
		$table.find('th').each((i, el) => {
			let $el = $(el);
			let name = $el.text();

			// some of them are links
			if(name.length == 0) {
				name = $el.find('a').text();
			}

			headers.push(name);
		});

		console.log(headers);

		let array = [];

		// make each row an object with properties named from the headers
		$table.find('tbody tr').each((i, el) => {
			let cols = $(el).find('td');
			let row = {};

			// assign each td to its key
			headers.forEach((header, i) => {
				row[header] = cols[i];
			});

			// clean, extract and format the data
			let parsedRow = this.parseRow(row);

			array.push(parsedRow);
		});

		return array;
	}

	parseRow(rowObj) {
		// rowObj keys : Type Nom NFO Comm. Age Taille Compl. Seed Leech
		let $torrentLink = $(rowObj.Nom).find('a');
		let rawName = $torrentLink.text();

		let data = this.extractTags(rawName);

		let row = {
			name: data.name,
			rawName: rawName,
			link: $torrentLink.attr('href'),
			age: rowObj.Age.innerHtml,
			size: rowObj.Taille.innerHtml,
			completed: parseInt(rowObj['Compl.'].innerHtml),
			seed: parseInt(rowObj.Seed.innerHtml),
			leech: parseInt(rowObj.Leech.innerHtml),
			tags: data.tags,
			year: data.year
		};

		return row;
	}

	parseTorrentPage() {

	}

	extractTags(name) {
		let data = {
			tags: []
		};

		name = name.replaceAll(/\r?\n|\r/, '').trim()

		// store year specificaly
		let yearRegex = /\d{4}(?!p)/;
		let yearMatch = name.match(yearRegex);
		if(yearMatch != null) {
			data.year = parseInt(yearMatch[0]);
		}
		// remove the year
		name = name.replace(yearRegex, '');

		// handle tags with dots
		if(name.indexOf('5.1') != -1) data.tags.push('5.1');
		if(name.indexOf('7.1') != -1) data.tags.push('7.1');
		name = name.replaceAll(/((5\.1)|(7\.1))/, '');

		// replace parentheses brackets and dots by a space
		let rawTags = name.replaceAll(/[\[\]\(\)\.]/, ' ');

		let knowTags = [
			// resolution
			'1080p',
			'720p',
			'UHD',

			// language
			'VFQ',
			'VF2',
			'MULTi',
			'TRUEFRENCH',
			'FRENCH',

			// sound
			'DTS-HD',

			// codec
			'x264-gold',
			'x264',
			'HEVC',

			// source
			'BluRay',
		];

		knowTags.forEach(test => {
			if(rawTags.indexOf(test) != -1) {
				data.tags.push(test);
				rawTags.replaceAll(test, '');
			}
		});

		data.name = rawTags.replace(/\s+/g, ' ');
		console.log(data);
		return data;
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