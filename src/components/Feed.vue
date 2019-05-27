<template>
	<div class="feed">
		<article v-for="media in medias" class="media-card">
			<section class="content">
				<img class="owned" src="img/owned.svg"/>
				<div class="infos">
					<h1 class="title" :title="media.title">{{ media.title }}</h1>
					<h2 class="release-year">{{ this.parseYear(media.release_date) }}</h2>
				</div>
				<canvas class="shadow"></canvas>
				<img class="poster" :src="poster || '@/assets/poster.png'"/>
			</section>

			<aside class="more">
				<div class="more-wrapper">
					<div class="tabs-select segmented">
						<button>>Infos film</button>
						<button class="checked">Ajout torrent</button>
						<button>>Ajout avancé</button>
					</div>
					<section class="film-info">
					</section>
					<section class="classic-results">
						<table class="torrent-results">
							<tr>
								<th>Nom</th>
								<th>Tags</th>
								<th>Popularité</th>
								<th>Contrôles</th>
							</tr>
						</table>
					</section>
					<section class="advanced-results"></section>
				</div>
			</aside>
		</article>
	</div>
</template>

<script>
import axios from 'axios';
import tMDB from '@/components/mixins/tMDB';

export default {
	name: 'Feed',

	data() {
		return {
			medias: [],
		};
	},

	mounted() {
		console.log('mounted');
		this.fetchData();
	},

	watch: {
		// refresh on route change
		$route: 'fetchData',
	},

	mixins: [tMDB],

	methods: {
		fetchData() {
			const rq = this.request(`/${this.method}/${this.media}`);
			console.log(rq);

			axios(rq, {
				sort_by: this.sort,
				primary_release_year: 2018,
			}).then((data) => {
				this.medias = data;
			});
		},
	},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

.media-card {
	min-width: 0;
	flex: 0 0 calc(20% - 50px);

	padding: 25px;
	transition: margin-bottom .3s ease;
}

.media-card-content {
	position: relative;
}

.media-poster {
	display: block;

	width: 100%;
	height: auto;

	border-radius: 10px;

	background: white;
	/*opacity: 0;*/
	/*visibility: hidden;*/
}

.media-card-shadow {
	position: absolute;
	top: 0;
	left: 50%;
	z-index: -1;

	transform: translateX(-50%);

	width: calc(100% + 20px);
	height: calc(100% + 20px);

	object-fit: cover;

	/*filter: blur(10px);*/
}

.media-card.match .media-poster {
	opacity: .55;
}

.media-owned {
	display: none;
	position: absolute;
	right: 0;
	top: 0;
	z-index: 1;

	width: 20%;
	height: auto;
}

.media-card.match .media-owned {
	display: initial;
}

.media-card-infos {
	position: absolute;
	left: 0; bottom: 0; right: 0;

	padding: 20px;
	padding-top: 60px;
	border-radius: 0 0 10px 10px;

	background-image: linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 100%);

	opacity: 0;
	transition: opacity .3s ease;
}

.media-card:hover:not(.owned) .media-card-infos,
.media-card.open:not(.owned) .media-card-infos {
	opacity: 1;
}

.media-title,
.media-year {
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;

	color: white;
	font-size: 1.1em;
	font-weight: 400;

	margin: .5em 0;
}

.media-year {
	color: #DDD;
	margin-bottom: 0;
}

.media-title {
	font-size: 16px;
}

.media-card.open:not(.match) {
	margin-bottom: 430px;
}

.media-card.open:not(.match) .media-more {
	height: 400px;
}

.media-more {
	position: absolute;
	left: 25px;
	right: 25px;

	height: 0;
	overflow: hidden;

	margin-top: 15px;

	color: #3D3D3D;

	transition: height .3s ease;
}

.media-more section {
	position: absolute;
	width: 100%;
}

.media-more table {
	width: 100%;
}

.classic-results td:nth-child(3) {
	text-align: right;
}

.media-more td:first-child,
.media-more th:first-child {
	padding-left: 0;
}

.media-more td:last-child,
.media-more th:last-child {
	padding-right: 0;
}

.download-torrent {
	font-size: 16px;

	margin: 0;
	padding: 0;
	border: none;

	background: none;
	cursor: pointer;
}

</style>
