import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import App from './App.vue';
import router from './router';

// store helpers
function request(store, action, data = {}) {
	data.api_key = store.state.tMDB.key;

	return {
		url: 'http://tbapi.dev.local:80/proxy.php',

		data,
		dataType: 'json',

		method: 'get',
		headers: {
			'X-Proxy-URL': store.state.tMDB.url + store.state.tMDB.version + action,
		},

		error(...args) {
			if (window.debug) {
				console.log(`${action} error`, args);
			}
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

Vue.use(Vuex);

const store = new Vuex.Store({
	state: {
		tMDB: {
			key: '59dadcc24f4a0f0f5c863344dd30f309',
			url: 'https://api.themoviedb.com/',
			version: 3,

			genres: {},

			method: 'discover',
			media: 'movie',
			sort: 'popularity.desc',
		},
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
		async init({ storeInstance }) {
			console.log('fetch');

			const config = await axios.get(request(store, '/configuration'));

			const [movieGenres, tvGenres] = await Promise.all([
				axios.get(request(store, '/genre/movie/list')),
				axios.get(request(store, '/genre/tv/list')),
			]);

			console.log('config ok');

			// Update state once with all 3 responses
			storeInstance.commit('config', config);
			storeInstance.commit('genres', {
				movie: movieGenres.data,
				tv: tvGenres.data,
			});
		},

		async refresh({ commit }) {
			console.log('refresh');
			const medias = await axios(request(store, `/${this.state.tMDB.method}/${this.state.tMDB.media}`), {
				sort_by: this.state.tMDB.sort,
				primary_release_year: 2018,
			});

			commit('medias', medias);
		},
	},
});

Vue.config.productionTip = false;

new Vue({
	router,
	store,
	render: h => h(App),

	created() {
		this.$store.dispatch('init');
	},
}).$mount('#app');
