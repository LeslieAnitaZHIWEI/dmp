<template>
  <div id="app">
    <router-view v-if="isRouterAlive"/>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      isRouterAlive: true
    }
  },
  computed: {},
  watch: {},
  created() {
  },
  methods: {
    reload() {
      this.isRouterAlive = false
      this.$nextTick(function() {
        this.isRouterAlive = true
      })
    }
  },
  provide() {
    return {
      reload: this.reload
    }
  }
}
</script>
<style lang="scss">
  #app {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
</style>
