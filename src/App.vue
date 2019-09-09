<template>
  <div id="app">
    <router-view v-if="isRouterAlive"></router-view>
  </div>
</template>
<script>
export default {
  name: "basetable",
  data() {
    return {
      isRouterAlive: true
    };
  },
  created() {
    // this.loadUrl();
    // setInterval(() => {
    //   this.loadUrl();
    // }, 10000);
  },
  methods: {
    reload() {
      this.isRouterAlive = false;
      this.$nextTick(() => (this.isRouterAlive = true));
    },
    // loadUrl() {
    //   this.$axios.get(`AutoTask/CreateScreenshotTask`).then(res => {});
    // }
  },
  computed: {},
  watch: {
    $route: function(to, from) {
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    }
  }
};
</script>
<style>
@import "./assets/css/main.css";
@import "./assets/css/color-dark.css";
/*深色主题*/
/*@import "./assets/css/theme-green/color-green.css";   浅绿色主题*/
</style>