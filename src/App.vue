<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div>
    <router-view/>
  </div>
</template>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}

body {
	font-family: Open sans, Helvetica, sans-serif;
	font-weight: 300;
	font-size: 12px;
	background-color: #E9ECED;
}

a {
	color: inherit;
	text-decoration: none;
}

td, th {
	font-size: 14px;
	padding: 10px;
}
</style>
