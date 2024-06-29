<template>
  <Navibar></Navibar>
  <router-view></router-view>
  <Footer></Footer>
</template>

<script>

import Navibar from './components/Navibar.vue'
import Footer from './components/Footer.vue'

export default {
  name: 'App',
  components: {
    Navibar,
    Footer
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: 0,0;
  padding: 0,0;
  background-color: #171717;
}


html,body{
  width: 100%;
  
  margin: 0;
}

</style>
