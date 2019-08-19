<template>
  <v-app id="app">
    <router-view/>
  </v-app>
</template>

<style>
.fullheight {
  height: 100%;
  width: 100%;
  margin-right: 0!important;
  margin-left: 0!important;
}

#app, html, body, .v-tabs-items, .v-window__container {
  height: 100%!important;
  width: 100%;
  background: #fff;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
