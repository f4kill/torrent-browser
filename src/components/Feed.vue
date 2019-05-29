<template>
	<div v-if="medias.length > 0" class="feed">
		<MediaCard
			v-for="media in medias"
			:key="media.id"
			v-bind="media"
			v-bind:close="closeCards"
			v-on:card-open="closeAllCards()"
		/>
	</div>

	<div v-else>
		Loading...
	</div>
</template>

<script>
import { mapState } from 'vuex';
import MediaCard from '@/items/MediaCard.vue';

export default {
	name: 'Feed',

	components: {
		MediaCard,
	},

	data() {
		return {
			closeCards: false,
		};
	},

	computed: mapState(['medias']),

	created() {
		// load data
		this.$store.dispatch('refresh');

		// load can be dismissed if config isn't yet loaded
		// on config state change try to load again
		this.$store.subscribe((mutation) => {
			if (['config', 'genres'].indexOf(mutation.type) + 1) {
				this.$store.dispatch('refresh');
			}
		});
	},

	methods: {
		// triggered by child event 'card-open'
		closeAllCards() {
			// this prop is watched by MediaCard
			// on toggleevery child will close
			// except the one who emitted the event
			this.closeCards = !this.closeCards;
		},
	},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.feed {
	display: flex;
	position: relative;

	flex-wrap: wrap;
	justify-content: space-between;
}
</style>
