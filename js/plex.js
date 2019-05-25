class Plex {
	constructor(ip, port, token) {
		this.databasesLocation = "/plex";
		this.serverIp = ip;
		this.serverPort = port;
		this.serverToken = token;
	}

	search(query, callback) {
		$.ajax({
			dataType: 'xml',
			url: 'proxy.php',
			data: {
				'X-Plex-Token': this.serverToken,
				query: query
			},
			beforeSend: request => {
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
}