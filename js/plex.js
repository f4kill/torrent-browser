class Plex {
	constructor(ip, port, token) {
		// back end
		this.databasesLocation = "/plex";
		this.serverIp = ip;
		this.serverPort = port;
		this.serverToken = token;

		this.load();

		// front end
		this.displayContainer = '.library-container';

		this.setupListeners();
	}

	load(retryOnFail = true) {
		this.loaded = false;
		let url = this.databasesLocation + '/' + this.serverIp + '/db.xml';

		$.ajax(url, {
			dataType: 'xml',

			//work with the response
			success: (data) => {
		        // xml = $.parseXML(data);
		        this.database = data;
			},
			error: function() {
				if(window.debug) {
					console.log('plex.load error', url, arguments);
				}

				if(retryOnFail) {
					this.update();
				}
			}
		});
	}

	update() {
		let url = 'http://' + this.serverIp + ':' + this.serverPort + '/library/sections/1/all/';
		$.ajax(url, {
			data: {
				'X-Plex-Token': this.serverToken
			},
			dataType: 'xml',

			success: (data) => {
				this.save(data.documentElement.outerHTML);
			},
			error: function() {
				if(window.debug) {
					console.log('plex.update error', url, arguments);
				}
			}
		});
	}

	save(data) {
		let xhr = $.ajax({
			type: 'POST',
			url: '/plex/save.php',
			data: {
				write: 1,
				data: data,
				server: this.serverIp
			},
			success: () => {
				this.load(false);
			},
			error: function() {
				if(window.debug) {
					console.log('plex.save error', arguments);
				}
			}
		});
	}

	search(query, callback) {
		$.ajax({
			type: 'GET',
			url: 'http://' + this.serverIp + ':' + this.serverPort + '/search',
			data: {
				'X-Plex-Token': this.serverToken,
				query: query
			},
			success: callback,
			error: function() {
				if(window.debug) {
					console.log('plex.search error', arguments);
				}
			}
		});
	}

	setupListeners() {
		$(document).on('click', 'button.load-library', () => {
			console.log(this.database);
		});
		
		$(document).on('click', 'button.load-library', () => {

		});
	}
}


/* 

1 read
2 404
3 request from server
4 update
5 read

*/