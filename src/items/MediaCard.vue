<template>
	<article
		class="media-card"
		v-bind:class="{ open: isOpen, owned }"
		v-on:click="toggle()"
	>
		<section class="content">
			<img v-if="owned" class="owned-icon" src="@/assets/owned.svg"/>
			<div class="infos">
				<h1 class="title" :title="title">{{ title }}</h1>
				<h2 class="release-year">{{ release_year }}</h2>
			</div>
			<canvas class="shadow"></canvas>
			<img class="poster" :src="poster_url || '@/assets/poster.png'"/>
		</section>

		<aside v-on:click.stop class="more">
			<div class="more-wrapper">
				<div class="tabs-select segmented">
					<button>Infos film</button>
					<button class="checked">Ajout torrent</button>
					<button>Ajout avancé</button>
				</div>
				<section class="film-info">
				</section>

				<TorrentTable
					v-if="isOpen"
					v-bind:title="title"
				/>

				<section class="advanced-results"></section>
			</div>
		</aside>
	</article>
</template>

<script>
import TorrentTable from '@/items/TorrentTable.vue';

export default {
	name: 'MediaCard',

	components: {
		TorrentTable,
	},

	props: {
		title: {
			type: String,
			default: 'Loading...',
		},
		release_year: {
			type: Number,
			default: null,
		},
		poster_url: String,
		close: {
			type: Boolean,
			default: false,
		},
		owned: {
			type: Boolean,
			default: false,
		},
	},

	data() {
		return {
			isOpen: false,
			willOpen: false,
		};
	},

	methods: {
		toggle() {
			if (this.owned) {
				return;
			}

			if (!this.isOpen) {
				this.willOpen = true;
				this.$emit('card-open');
			} else {
				this.isOpen = false;
			}
		},
	},

	watch: {
		// the close is toggled when parent receives 'card-open' event
		close() {
			// is this the child who emitted 'card-open'
			if (this.willOpen) {
				// then we must open
				this.isOpen = true;
				this.willOpen = false;
			} else {
				// others must close
				this.isOpen = false;
			}
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
		.poster {
			opacity: .55;
		}
	}

	.owned-icon {
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

	&:hover:not(.owned) .infos,
	&.open:not(.owned) .infos {
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

	&.open:not(.match) .more {
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
	}
}
</style>
