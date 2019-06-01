import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import $ from 'jQuery';
import App from './App.vue';
import router from './router';
import config from './config';

window.$ = $;

library.add(faPlusCircle);

Vue.component('font-awesome-icon', FontAwesomeIcon);

// Vue.config.productionTip = false;

// store helpers
function request(store, action, params = {}) {
	params.api_key = store.state.tMDB.key;

	return {
		url: 'http://tbapi.dev.local:80/proxy.php',

		params,
		dataType: 'json',

		method: 'get',
		headers: {
			'X-Proxy-URL': store.state.tMDB.url + store.state.tMDB.version + action,
		},
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
		return match[0];
	}
	return ''; // failed
}

async function asyncForEach(array, callback) {
	for (let index = 0; index < array.length; index += 1) {
		await callback(array[index], index, array);
	}
}

Vue.use(Vuex);

const store = new Vuex.Store({
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
				const medias = await axios(request(store, `/${this.state.tMDB.method}/${this.state.tMDB.media}`), {
					sort_by: this.state.tMDB.sort,
					primary_release_year: 2018,
				});

				// pre format data
				asyncForEach(medias.data.results, async (el, i) => {
					medias.data.results[i].release_year = parseYear(store, el.release_date);
					medias.data.results[i].poster_url = tMDBImageUrl(store, el.poster_path);

					const plex = await axios({
						url: 'http://tbapi.dev.local/proxy.php',

						params: {
							query: el.title,
							'X-Plex-Token': state.plex.token,
						},
						dataType: 'xml',

						method: 'get',
						headers: {
							'X-Proxy-URL': `${state.plex.url}search`,
						},
					});

					console.log(plex.data);
					$(plex.data).find('Video').each((j, video) => {
						console.log(video);
						if ($(video).attr('title') === el.title && $(video).attr('year') === el.release_year) {
							console.log('match');
						}
					});
				});

				commit('medias', medias.data.results);
			}
		},
	},
});

Vue.config.productionTip = false;

new Vue({
	router,
	store,
	render: h => h(App),

	beforeCreate() {
		this.$store.dispatch('init');
	},
}).$mount('#app');
