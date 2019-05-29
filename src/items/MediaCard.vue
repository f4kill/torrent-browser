<template>
	<article class="media-card" v-bind:class="{ open: isOpen }" v-on:click="toggle()">
		<section class="content">
			<img class="owned-icon" src="@/assets/owned.svg"/>
			<div class="infos">
				<h1 class="title" :title="title">{{ title }}</h1>
				<h2 class="release-year">{{ release_year }}</h2>
			</div>
			<canvas class="shadow"></canvas>
			<img class="poster" :src="poster_url || '@/assets/poster.png'"/>
		</section>

		<aside class="more">
			<div class="more-wrapper">
				<div class="tabs-select segmented">
					<button>Infos film</button>
					<button class="checked">Ajout torrent</button>
					<button>Ajout avancé</button>
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
</template>

<script>
export default {
	name: 'MediaCard',

	props: {
		title: {
			type: String,
			default: 'Loading...',
		},
		release_year: {
			type: String,
			default: '...',
		},
		poster_url: String,
	},

	data() {
		return {
			isOpen: false,
		};
	},

	methods: {
		open() {
			this.isOpen = true;
		},

		close() {
			this.isOpen = false;
		},

		toggle() {
			this.isOpen = !this.isOpen;
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

	.content {
		position: relative;
	}

	.poster {
		display: block;

		width: 100%;
		height: auto;

		border-radius: 10px;

		background: white;
		/*opacity: 0;*/
		/*visibility: hidden;*/
	}

	.shadow {
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

	&.owned {
		.media-poster {
			opacity: .55;
		}

		.owned-icon {
			display: initial;
		}
	}

	.owned-icon {
		display: none;
		position: absolute;
		right: 0;
		top: 0;
		z-index: 1;

		width: 20%;
		height: auto;
	}

	.infos {
		position: absolute;
		left: 0; bottom: 0; right: 0;

		padding: 20px;
		padding-top: 60px;
		border-radius: 0 0 10px 10px;

		background-image: linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 100%);

		opacity: 0;
		transition: opacity .3s ease;
	}

	&:hover:not(.owned) .media-card-infos,
	&.open:not(.owned) .media-card-infos {
		opacity: 1;
	}

	.title,
	.release-year {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;

		color: white;
		font-size: 1.1em;
		font-weight: 400;

		margin: .5em 0;
	}

	.release-year {
		color: #DDD;
		margin-bottom: 0;
	}

	.title {
		font-size: 16px;
	}

	&.open:not(.match) {
		margin-bottom: 430px;
	}

	&.open:not(.match) .media-more {
		height: 400px;
	}

	.more {
		position: absolute;
		left: 25px;
		right: 25px;

		height: 0;
		overflow: hidden;

		margin-top: 15px;

		color: #3D3D3D;

		transition: height .3s ease;

		section {
			position: absolute;
			width: 100%;
		}

		table {
			width: 100%;
		}

		.classic-results td:nth-child(3) {
			text-align: right;
		}

		td:first-child,
		th:first-child {
			padding-left: 0;
		}

		td:last-child,
		th:last-child {
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
	}
}
</style>
