<template>
  <div class="manage">
  	<div id="">
  	</div>
    <!-- <el-row class="magage_inner"> -->
    <!-- <el-col :default-active="defaultActive" class="menu">
    </el-col>-->
    <el-container style="height: 95%;">
      <!-- 头部 -->
      <el-header class="m_header">
        <div class="m_h_left">
          <img src="../../img/首页/logo.png" alt>
          <strong class="text">助力乡村会员中心</strong>
          <div class="province">{{userInfo.provinceName}}</div>
          <div class="city">{{userInfo.cityName}}</div>
          <div class="district">{{userInfo.districtName}}</div>
        </div>
        <div class="m_h_rigth">
          <div @click="goNew()">
            <el-badge :value="unReadyNum" v-if="unReadyNum !== 0">
              <img src="../../img/首页/icon_notice.png" alt>
            </el-badge>
            <el-badge v-if="unReadyNum == 0">
              <img src="../../img/首页/icon_notice.png" alt>
            </el-badge>
          </div>
          <div>
            <img src="../../img/首页/icon_user.png" alt>
          </div>
          <div></div>
          <div class="name2">
            <el-tag type="success" v-if="userInfo.userType == 6">平台管理</el-tag>
            <el-tag type="success" v-if="userInfo.userType == 4">运营商/商家</el-tag>
            <el-tag type="info" v-if="userInfo.userType == 3">运营商</el-tag>
            <el-tag type="warning" v-if="userInfo.userType == 2">普通商家</el-tag>
            {{userInfo.nickname}}
          </div>
          <div class="name">
            <el-button plain @click="signOut">注销</el-button>
          </div>
        </div>
      </el-header>
      <!-- 身体-左侧导航栏 -->
      <el-container>
        <el-aside width="200px">
          <el-menu
            style="height: 100%;overflow:scroll; background:linear-gradient(#00ae87, #2f96cd);"
            text-color="#fff"
            active-text-color="#ccc"
            class="el-menu-vertical-demo"
            :unique-opened="true" 
            router
          >
            <!-- <el-menu-item index="manage" style="min-width: 160px;overflow: hidden; ">
                <i class="el-icon-menu"></i>
                <span>个人中心</span>
            </el-menu-item>-->

            <div v-for="(item,index) in userInfo.menus" :key="index">
              <el-submenu v-if="item.preMenuId == 0" style="color=#fff" :index="item.menuName">
                <!-- 列表组-父 -->
                <template slot="title">
                  <i class="iconfont" :class="item.menuUrl"></i>
                  <span>{{item.menuName}}</span>
                </template>
                <!-- 列表组-子 -->
                <div v-for="(itemInner,index) in userInfo.menus" :key="index">
                  <el-menu-item
                    :index="itemInner.menuUrl"
                    v-if="itemInner.preMenuId == item.roleMenuId"
                    style="min-width: 160px;overflow: hidden;"
                  >{{itemInner.menuName}}</el-menu-item>
                </div>
              </el-submenu>
            </div>
          </el-menu>
        </el-aside>
        <!-- 身体-右侧 -->
        <el-main class="m_b_right">
          <keep-alive>
              <router-view v-if="$route.meta.keepAlive"></router-view>
          </keep-alive>
          <router-view v-if="!$route.meta.keepAlive"></router-view>
        </el-main>
      </el-container>
      <!-- 脚部 -->
      <el-footer
        class="footer"
        height="10px"
      >"Copyright © 2017 Company name All rights reserved广东承石网络科技有限公司 粤ICP备18044288号-1 粤公网安备 44011102001755号"</el-footer>
    </el-container>
  </div>
</template>

<script>
import { menuData } from "../utils/util";
import Ffooter from "../components/footer";
export default {
  data() {
    return {
      test: false,
      userInfo: {},
      unReadyNum: 0,
      currentMenu: ""
    };
  },
  components: {
    Ffooter
  },
  // created() {
  //   if(!this.userInfo){
  //     this.getUserInfo();
  //   }
  //   window.location.href
  // },
  computed: {},
  created() {
    this.recoverMenu();
    this.getUserInfo();
  },
  mounted() {
    this.getNweNum();
  },
  methods: {
    handleSelect(key, keyPath) {
      // console.log(key, keyPath);
    },
    recoverMenu() {
      //恢复菜单栏状态
      let currentUrl = window.location.href;
      // this.currentMenu = currentUrl.split("#")[1].split("/")[1];
    },
    // 接口-初始化
    getUserInfo() {
      this.axiosReq(this.apis.userInfo, "get").then(res => {
        if (res.status === 200) {
          this.userInfo = res.data;
        } else {
          this.$message.error(res.message);
        }
        // const resData = res.data
        // const userInfo = menuData(resData)
        // this.$store.dispatch('getUserInfo',userInfo)
      });
    },
    getNweNum() {
      this.axiosReq(this.apis.unReadyNews, "get").then(res => {
        if ( res.data && res.data.status == 200) {
          this.unReadyNum = res.data.data.row;
        }
      });
    },
    goNew() {
      this.$router.push({
        path: "/news"
      });
    },
    loginOut() {
      this.$store.dispatch("removeToken");
      // this.$store.dispatch('removeUserInfo')
    },
    signOut() {
      window.localStorage.setItem("token", "");
      this.$router.replace({ path: "login" });
    }
  },
  computed () {
  }
};
</script>

<style lang="less" scoped>
.manage {
  min-width: 1200px;
  height: 99vh;
  .m_header {
    height: 80px;
    display: -webkit-flex;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding: 0 28px;
    .m_h_left {
      flex: 1;
      display: flex;
      align-items: center;
      img {
        vertical-align: middle;
      }
      .text {
        font-size: 18px;
        color: #333333;
        font-family: "PingFang-SC-Regular";
      }
      .province {
        margin-left: 1.5rem;
        color: #00ae87;
        font-weight: bold;
      }
      .city {
        font-weight: bold;
        color: #00ae87;
      }
      .district {
        font-weight: bold;
        color: #00ae87;
      }
    }
    .m_h_rigth {
      flex: 1;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      div {
        margin-left: 30px;
      }
      .name {
        font-size: 16px;
      }
      .name2 {
        margin-left: 0px;
      }
    }
  }
  // 修改导航栏颜色（父hover）
  .el-submenu .el-submenu__title:hover > span {
    color: #00ae87;
  }
  .is-active{
    background-color: #e7f7f5;
    >.el-submenu__title{
      >span{
        color:#00ae87 !important;
      }
    }
  }
  .is-opened{
    background-color: #e7f7f5;
    >.el-submenu__title{
      >span{
        color:#00ae87 !important;
      }
    }
  }
  // 修改导航栏颜色（子背景）
  .el-menu-item {
    background-color: #0fa69d;
  }
  // 修改导航栏颜色（子hover）
  .el-menu-item:focus,
  .el-menu-item:hover {
    outline: 0.5 !important;
    color:#ccc !important;
    .el-icon-menu {
    color:#ccc!important;
    }
  }

  .m_b_right {
    height: 84vh;
    overflow: scroll;
    background-color: #f5f7f8;
  }
  .magage_inner {
    display: flex;
    flex: 1;
    min-width: 160px;
    .menu {
      flex: 160px 0 0;
      min-height: 100%;
      background-color: #324057;
    }
    .router {
      flex: 1;
    }
  }
  .footer {
    height: 100%;
    box-sizing: border-box;
    line-height: 50px;
    background: #fff;
    text-align: center;
    color: #999999;
    z-index: 1000;
  }
  .data_section {
    padding: 20px;
    margin-bottom: 40px;
    .section_title {
      text-align: center;
      font-size: 30px;
      margin-bottom: 10px;
      margin-left: -10%;
    }
    .data_list {
      text-align: center;
      font-size: 14px;

      border-radius: 6px;
      background: #e5e9f2;
      height: 57px;
      .data_num {
        color: #333;
        font-size: 26px;
        margin-top: 4%;
      }
      .head {
        border-radius: 6px;
        font-size: 22px;
        padding: 4px 0;
        color: #fff;
        display: inline-block;
      }
    }
    .today_head {
      background: #ff9800;
    }
    .all_head {
      background: #20a0ff;
    }
  }
  .wan {
    .sc(16px, #333);
  }
}
@import "../style/mixin";
</style>
