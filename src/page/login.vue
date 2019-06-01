// 用户登录	June
<template>
  <div class="login_page fillcontain">
    <transition name="form-fade" mode="in-out">
      <section class="form_contianer">
        <!-- <div class="f_c_left">
          <img src="../../img/标题.png" alt>
        </div> -->
        <div class="f_c_right">
          <div class="f_c_r_form">
          <div>
            <img src="../../img/login_form_header.png" alt="" class="f_c_r_form_img">
          </div>
            <p class="form_header">用户登陆</p>
            <el-form :model="loginForm" ref="loginForm" :rules="rules" class="f_c_r_form_form">
              <el-form-item prop="userName">
                <div class="f_input" @click="activeClass(1)" :class="{f_input_active:active == 1}">
                  <span class="iconfont icon-geren" style="font-size:25px"></span>
                  <input
                    type="text"
                    v-model="loginForm.userName"
                    @keyup.enter="submitForm('loginForm')"
                  >
                </div>
              </el-form-item>
              <el-form-item prop="passWord">
                <div class="f_input" @click="activeClass(2)" :class="{f_input_active:active == 2}">
                  <span class="iconfont icon-ai241" style="font-size:30px"></span>
                  <input
                    type="password"
                    v-model="loginForm.passWord"
                    @keyup.enter="submitForm('loginForm')"
                  >
                </div>
              </el-form-item>
              <div class="f_c_r_form_btn"> 
                <el-button type="success" round @click="submitForm('loginForm')" class="submit_btn">登陆</el-button>
              </div>
            </el-form>
          </div>
        </div>
      </section>
    </transition>
  </div>
</template>

<script>
import { menuData } from "../utils/util";
import { getLogin } from "@/api/getData.js";
import qs from "qs";
import { setTimeout } from "timers";
import Aes from '@/api/aesutils.js'
export default {
  data() {
    // 校验规则
    const validPhone = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入用户名"));
      } else if (!/^([0-9]|[a-zA-Z]){6,16}$/.test(value)) {
        callback(new Error("请输入正确手机号码"));
      } else {
        callback();
      }
    };
    const validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        callback();
      }
    };
    return {
      active: 0,
      loginForm: {
        userName: "",
        passWord: ""
      },
      showLogin: true,
      rules: {
        userName: [{ validator: validPhone, trigger: "change" }],
        passWord: [
          { validator: validatePass, trigger: "change" },
          { min: 5, message: "请输入大于6位数的密码", trigger: "change" }
        ]
      }
    };
  },
  mounted() {
    this.showLogin = false;
  },
  computed: {},
  methods: {
    // 提交
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let un = Aes.encrypt(this.loginForm.userName)
          let psw = Aes.encrypt(this.loginForm.passWord)
          let loginForm = {
            userName: un,
            passWord: psw
          }
          const obj = {
            data: qs.stringify(loginForm) || "",
            headers: {
              "Content-type": "application/x-www-form-urlencoded"
            }
          };
          //接口
          window.localStorage.setItem("token", "");
          this.axiosReq(this.apis.login, "post", obj).then(res => {
            if (res.data && res.data.status === 200) {
              window.localStorage.setItem("token", res.data.data);
              this.$message({
                type: "success",
                message: res.data.msg
              });
              this.$router.push({
                path: "/manage"
              });
              // setTimeout(()=> {

              // })
              // },1000)
            } else {
              if(res.data.msg){
                this.$message.error(res.data.msg);
                return;
              } else {
                return;
              }
              
            }
          });
        } else {
          // console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    async getUserInfo() {
      await this.axiosReq(this.apis.userInfo, "get").then(res => {
        const resData = res.data;
        const userInfo = menuData(resData);
        this.$store.dispatch("getUserInfo", userInfo);
      });
    },
    getunReadyNews() {
      this.axiosReq(this.apis.unReadyNew, "get").then(res => {
        const resData = res;
      });
    },
    activeClass(num) {
      this.active = num;
    }
  }
};
</script>

<style lang="less" scoped>
@import "../style/mixin";
.login_page {
  width: 100%;
  height: 100vh;
  min-height: 740px;
  box-sizing: border-box;
  background-image: url("../../img/login_bgi.jpg");
  background-size: 100% 100%;
  padding: 137px 427px;
}
.icon-ai241{
  font-size:20px;
}
// 表单
.form_contianer {
  width: 310px;
  height: 480px;
  position: absolute;
  right: 20%;
  margin: auto 0;
  border-radius: 8px;
  text-align: center;
  background-color: rgba(255, 255, 255,0.8);
  padding:40px 50px;
  // // 表单左背景
  // .f_c_left {
  //   flex: 1;
  //   width: 100%;
  //   position: relative;
  //   top: -6%;
  //   left: -6%;
  //   img {
  //     width: 90%;
  //     height: 115%;
  //   }
  //   // background-image: url("../../img/标题.png");
  //   // background-size:100% 120%;
  // }
  .f_c_right {
    flex: 1;
    opacity:1;
    .f_c_r_form {
      // 表单头部
      .form_header {
        text-align: center;
        font-size: 24px;
        color: #333333;
        margin: 22px 0 58px 0;
      }
      .f_c_r_form_form {
        text-align: left;
        .el-form-item {
          margin-bottom: 40px;
          font-size: 18px;
          .el-form-item__content {
            .f_input {
              border-bottom: 1px solid #333;
              line-height: 30px;
              span {
                font-size: 23px;
              }
              input {
                width: 80%;
                background:none;
                font-size: 20px;
              }
            }
            .f_input_active {
              border-bottom: 1px solid #00ae87;
              color: #00ae87;
            }
          }
        }
        .f_c_r_form_btn{
          width: 100%;
          text-align:center;
          margin-top:60px;
        }
        .submit_btn {
          width: 80%;
          font-size: 16px;
          opacity: 0.8;
        }
        .el-button--success {
          background-color: #00ae87;
          border-color: #00ae87;
        }
      }
    }
  }
}
.tip {
  font-size: 12px;
  color: red;
}
.form-fade-enter-active,
.form-fade-leave-active {
  transition: all 1s;
}
.form-fade-enter,
.form-fade-leave-active {
  transform: translate3d(0, -50px, 0);
  opacity: 0;
}
</style>
