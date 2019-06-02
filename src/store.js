import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import $ from 'jQuery';

window.$ = $;

// Vue.config.productionTip = false;

// store helpers
function request(store, action, params = {}) {
	params.api_key = store.state.tMDB.key;

	return {
		url: `tmdb/${store.state.tMDB.version + action}`,

		params,
		dataType: 'json',

		method: 'get',
	};
}

function tMDBImageUrl(store, path, size = 'w500') {
	// make sure https media is configured
	if (typeof store.state.tMDB.config.images.secure_base_url === 'undefined') {
		return store.state.tMDB.config.images.base_url + size + path;
	}

	// if no config is set you're fucked anyway
	return store.state.tMDB.config.images.secure_base_url + size + path;
}

function parseYear(store, date) {
	const match = date.match(/(\d){4}/);
	if (match.length > 0) {
		return parseInt(match[0], 10);
	}
	return ''; // failed
}

function plexBatchRequest(store, titles) {
	const requests = [];

	titles.forEach((title) => {
		requests.push(axios.request({
			url: '/plex/search',

			params: {
				query: title,
				'X-Plex-Token': store.state.plex.token,
			},
			dataType: 'xml',

			method: 'get',
		}));
	});

	return requests;
}

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		plex: {
			url: config.plexUrl,
			token: config.plexKey,
		},
		tMDB: {
			key: config.tMDBKey,
			url: 'https://api.themoviedb.org/',
			version: 3,

			genres: {},

			method: 'discover',
			media: 'movie',
			sort: 'popularity.desc',
		},
		medias: [],
	},

	mutations: {
		config(state, data) {
			state.tMDB.config = data;
		},
		genres(state, data) {
			state.tMDB.genres = data;
		},
		medias(state, data) {
			state.medias = data;
		},
	},

	actions: {
		async init({ commit }) {
			// wait for tMDB configuration
			const config = await axios.request(request(store, '/configuration'));
			const movieGenres = await axios.request(request(store, '/genre/movie/list'));
			const tvGenres = await axios.request(request(store, '/genre/tv/list'));

			// Update state once with all 3 responses
			commit('config', config.data);
			commit('genres', {
				movie: movieGenres.data,
				tv: tvGenres.data,
			});
		},

		async refresh({ commit, state }) {
			// these states are needed before refresh
			if (typeof state.tMDB.config !== 'undefined' && typeof state.tMDB.genres !== 'undefined') {
				// use current filters to get new data
				const medias = await axios(request(store, `/${this.state.tMDB.method}/${this.state.tMDB.media}`, {
					sort_by: this.state.tMDB.sort,
					primary_release_year: 2018,
				}));

				const titles = medias.data.results.map(media => media.title);
				const plex = await axios.all(plexBatchRequest(store, titles));

				// pre format data
				medias.data.results.forEach((el, i) => {
					medias.data.results[i].release_year = parseYear(store, el.release_date);
					medias.data.results[i].poster_url = tMDBImageUrl(store, el.poster_path);

					medias.data.results[i].owned = false;
					if (typeof plex[i].data.MediaContainer.Metadata !== 'undefined') {
						plex[i].data.MediaContainer.Metadata.forEach((media) => {
							if (media.title === el.title && el.release_year === media.year) {
								medias.data.results[i].owned = true;
							}
						});
					}
				});

				commit('medias', medias.data.results);
			}
		},
	},
});