<template>
 
</template>

<script>
import MediaCard from '@/items/MediaCard.vue';

export default {
	name: 'HelloWorld',
	props: {
		msg: String,
	},
	components: {
		MediaCard,
	},
};
function request(action, success, data) {
	const requestData = data || {};

	requestData.api_key = this.key;

	$.ajax({
		url: 'proxy.php',
		data,
		dataType: 'json',

		beforeSend: (jqXHR) => {
			jqXHR.setRequestHeader('X-Proxy-URL', this.url + this.version + action);
		},

		success,

		error(...args) {
			if (window.debug) {
				console.log(`${action} error`, args);
			}
		},
	});
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
