<template>
  <div class="wrapper">
    <v-head style="position: fixed;z-index:2;width:100%"></v-head>
    <v-sidebar style="position: fixed;width:225px;overflow: hidden;"></v-sidebar>
    <div class="content-box" style="z-index:1;width:calc(100% -225px)">
      <div class="content">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import vHead from "./Header.vue";
import vSidebar from "./Sidebar.vue";
export default {
  data() {
    return {};
  },
  components: {
    vHead,
    vSidebar
  }
};
</script>
<style>
</style>

