import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import App from './App.vue';
import router from './router';

const store = new Vuex.Store({
	async fetch({ store }) {
		// base api config
		const tMDB = {
			key: '59dadcc24f4a0f0f5c863344dd30f309',
			url: 'https://api.themoviedb.com/',
			version: 3,

			genres: {},

			method: 'discover',
			media: 'movie',
			sort: 'popularity.desc',
		};


		const config = await axios.get(this.request('/configuration'));

		const [movieGenres, tvGenres] = await Promise.all([
			axios.get(this.request('/genre/movie/list')),
			axios.get(this.request('/genre/tv/list')),
		]);

		// Update state once with all 3 responses
		tMDB.config = config.data;
		tMDB.genres = {
			movie: movieGenres.data,
			tv: tvGenres.data,
		};

		store.commit('tMDB', tMDB);

		const media = await axios(this.request(`/${this.method}/${this.media}`), {
			sort_by: this.sort,
			primary_release_year: 2018,
		});

		store.commit('media', media);
	},

	mutations: {
		tMDB(state, data) {
			state.tMDB = data;
		},
	},

	methods: {
		request(action, data = {}) {
			data.api_key = this.key;

			return {
				url: 'http://tbapi.dev.local/proxy.php',

				data,
				dataType: 'json',

				method: 'get',
				headers: {
					'X-Proxy-URL': this.url + this.version + action,
				},

				error(...args) {
					if (window.debug) {
						console.log(`${action} error`, args);
					}
				},
			};
		},

		tMDBImageUrl(path, size = 'w500') {
			// make sure https media is configured
			if (typeof this.config.images.secure_base_url === 'undefined') {
				return this.config.images.base_url + size + path;
			}

			// if no config is set you're fucked anyway
			return this.config.images.secure_base_url + size + path;
		},

		parseYear(date) {
			const match = date.match(/(\d){4}/);
			if (match.length > 0) {
				return match[0];
			}
			return ''; // failed
		},
	},
});

Vue.config.productionTip = false;

new Vue({
	router,
	store,
	render: h => h(App),

	computed() {

	},
}).$mount('#app');
