module.exports = {
	devServer: {
		host: 'torrent-browser.dev.local',
		disableHostCheck: true,
		proxy: {
			'^/plex': {
				target: 'http://plex.mrik.pw:32400',
				ws: true,
				changeOrigin: true,
				pathRewrite: path => path.replace('/plex', '/'),
				hostRewrite: 'torrent-browser.dev.local:8080',
			},
			'^/ygg': {
				target: 'http://tbapi.dev.local',
				ws: true,
				changeOrigin: true,
				pathRewrite: path => path.replace('/ygg', '/proxy.php'),
			},
			'^/tmdb': {
				target: 'http://api.themoviedb.org',
				ws: true,
				changeOrigin: true,
				pathRewrite: path => path.replace('/tmdb', '/'),
				hostRewrite: 'torrent-browser.dev.local:8080',
			},
		},
	},
};
