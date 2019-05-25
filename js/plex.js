class Plex {
	constructor(ip, port, token) {
		// back end
		this.databasesLocation = "/plex";
		this.serverIp = ip;
		this.serverPort = port;
		this.serverToken = token;
		this.loaded = false;

		// front end
		this.displayContainer = '.library-container';

		this.setupListeners();
	}

	search(query, callback) {
		$.ajax({
			dataType: 'xml',
			url: 'proxy.php',
			data: {
				'X-Plex-Token': this.serverToken,
				query: query
			},
			beforeSend: function(request) {
				request.setRequestHeader("X-Proxy-URL", 'https://' + this.serverIp + ':' + this.serverPort + '/search')
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
