<template>
	<div v-if="medias.length > 0" class="feed">
		<MediaCard
			v-for="media in medias"
			:key="media.id"
			v-bind="media"
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

	computed: mapState(['medias']),

	created() {
		this.$store.dispatch('refresh');

		this.$store.subscribe((mutation) => {
			if (['config', 'genres'].indexOf(mutation.type) + 1) {
				this.$store.dispatch('refresh');
			}
		});
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
