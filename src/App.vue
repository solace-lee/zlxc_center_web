<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {};
</script>

<style lang="less">
@import "./style/common";
@import "../fonts/index/iconfont.css";
#app {
  box-sizing: border-box;
  min-width: 1200px;
  height: 100%;
  // 修改导航栏颜色（子icon）
  .manage {
    .el-menu-item i {
      color: #fff;
    }
    // 修改导航栏颜色（父icon）
    .el-submenu__title i {
      color: #fff !important;
    }
      .el-submenu > .el-submenu__title:hover > i::before {
        color: #00ae87;
      }
      .is-active> .el-submenu__title> i::before{
        color:#00ae87 !important;
      }
      .is-opened> .el-submenu__title> i::before{
        color:#00ae87 !important;
      }
  }
}
</style>
