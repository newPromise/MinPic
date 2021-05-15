<template>
  <div class="home">
    <div class="left-sidebar">
      <Menu></Menu>
    </div>
    <div class="container">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import Menu from './menu'
export default {
  components: {
    Menu
  }
}
</script>

<style lang="scss">
body {
  margin: 0;
}
.home {
  width: 100vw;
  height: 100vh;
  display: flex;
  .left-sidebar {
    display: none;
    flex: none;
    width: 250px;
    background: #31353E;
  }
  .container {
    flex: 1;
    width: 100%;
    height: 100%;
  }
}
</style>