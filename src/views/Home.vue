<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
    
	<section class="content">
		<Filters/>
		<Feed/>
	</section>
  </div>

</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue';
import Filters from '@/components/Filters.vue';
import Feed from '@/components/Feed.vue';

export default {
  name: 'home',
  components: {
    HelloWorld,
    Filters,
    Feed,
  },
};
</script>
