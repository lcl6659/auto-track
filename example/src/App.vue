<template>
  <div id="app">
    <div @click="getApp_track('nanan')">你好</div>
    <HelloWorld msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'

export default {
  name: 'App',
  components: {
    HelloWorld
  },
  data () {
    return {
      baseTrackProps: {
        appName: 'ardf'
      }
    }
  },
  created () {
    console.log('app')
  },
  methods: {
    getApp_track (name) {
      console.log(name, this.baseTrackProps)
    }
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
  margin-top: 60px;
}
</style>
