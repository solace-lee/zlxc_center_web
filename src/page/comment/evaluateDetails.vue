<template>
  <div class="evaluateDetails">
    <!-- 头部 -->
    <el-row class="b_t_header">
      <el-col :span="22" class="asd">
        <div>
          <span class="green"></span>
          <strong>商品评价详情页</strong>
        </div>
      </el-col>

      <el-col :span="2">
        <el-button plain @click="$router.go(-1)">返回</el-button>
      </el-col>
    </el-row>
    <!-- 列表项目 -->
    <div class="v_body">
      <div class="v_b_first">
        <span>商品信息</span>
      </div>
      <el-row class="b_top">
        <el-col :span="3">
          <div>
            <img :src="goods.imgUrl" alt>
          </div>
        </el-col>
        <el-col :span="21" class="right">
          <div>
            <span class="color999">商品名称：</span>
            <span>{{goods.name}}</span>
          </div>
          <div>
            <span class="color999">折扣价:</span>
            <span class="mr10">￥{{goods.discountPrice}}</span>
            <span class="color999">销售价:</span>
            <s class="color999">￥{{goods.originalPrice}}</s>
          </div>
          <div class="color999">已有{{total}}条评论</div>
        </el-col>
      </el-row>
      <div class="v_b_first">
        <span>评论商信息</span>
      </div>
      <el-row class="b_bottom" v-for="(item, index ) in table" :key="index" :gutter="20">
        <el-col :span="1">
          <div>
            <img :src="item.imgUrl" alt class="img1">
          </div>
        </el-col>
        <el-col :span="21" class="mb10">
          <div class="mb10">
            <span>{{item.userName}}</span>
          </div>
          <el-row class="mb10">
            <el-col :span="2">等级评分</el-col>
            <el-col :span="5">
              <el-rate disabled :colors="['#00ae87','#00ae87','#00ae87']" v-model="item.level"></el-rate>
            </el-col>
          </el-row>
          <div style="margin-bottom:15px;">
            <span class="color999 mr30">{{item.createTime}}</span>
            <span class="color999">{{item.specificationName}}</span>
          </div>
          <div>
           <a :href="item.commentImg" target="_blank">
              <img :src="item.commentImg" alt class="contentImg">
            </a>
          </div>
          <div>
            <span>{{item.content}}</span>
          </div>
          <div class="border" v-if="item.replyContent">
            <el-row>
              <el-col :span="1.5">商家回复：</el-col>
              <el-col :span="20">{{item.replyContent}}</el-col>
            </el-row>
          </div>
          <div class="right">
            <el-button size="small" plain v-if="item.replyContent">已回复</el-button>
            <el-button
              size="small"
              type="success"
              plain
              @click="reply(item)"
              v-if="!item.replyContent"
            >待回复</el-button>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- 弹窗-回复 -->
    <el-dialog title="回复" :visible.sync="dialogFormVisible" center width="500px">
      <el-input type="textarea" :rows="4" placeholder="请输入回复内容" v-model="textarea"></el-input>
      <div class="btn">
        <el-button type="success" @click="postData()">回复</el-button>
        <el-button @click="dialogFormVisible = !dialogFormVisible">返回</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      table: [], //回复列表
      goods: {}, //商品详情
      dialogFormVisible: false, //控制弹窗
      replyLi: {}, //回复所需信息
      total: 0,
      textarea: ""
    };
  },
  created() {
    this.getCommodity();
    this.getData();
  },
  methods: {
    // 接口
    // 初始化-获取评论列表
    getData() {
      let id = this.$route.query.id;
      if (id) {
        this.axiosReq(this.apis.queryDetailComment + id, "get").then(res => {
          if (res.data.status == 200) {
            this.table = res.data.data.items;
            this.total = res.data.data.total;
          }
        });
      } else {
        this.$router.replace({
          path: "/evaluate"
        });
      }
    },
    // 初始化-获取评论商品信息
    getCommodity() {
      let id = this.$route.query.id;
      let obj = {
        params: {
          commodityId: id
        }
      };
      if (id) {
        this.axiosReq(this.apis.queryByCommodityId, "get", obj).then(res => {
          if (res.data.status == 200) {
            this.goods = res.data.data;
          }
        });
      } else {
        this.$router.replace({
          path: "/evaluate"
        });
      }
    },
    // 回复
    postReply(val) {
      let obj = {
        data: {
          commentId: this.replyLi.commentId,
          shopId: this.replyLi.shopId,
          replyContent: this.textarea
        }
      };
      this.axiosReq(this.apis.replyUser, "post", obj).then(res => {
        if (res.data.status == 200) {
          this.$message({
            type: "success",
            message: res.data.msg
          });
        } else {
          this.$message.error(res.data.msg);
        }
        this.getData();
      });
    },
    //
    // 打开弹窗
    reply(val) {
      this.replyLi = {};
      this.textarea = "";
      this.dialogFormVisible = !this.dialogFormVisible;
      this.replyLi = val;
    },
    postData() {
      if (this.textarea == "") {
        this.$message({
          type: "warning",
          message: "请填写回复内容"
        });
        return;
      } else {
        this.postReply();
        this.dialogFormVisible = !this.dialogFormVisible;
      }
    }
  }
};
</script>

<style lang="less">
.evaluateDetails {
  width: 100%;
  min-height: 100%;
  .mb10 {
    margin-bottom: 5px;
  }
  .btn {
    width: 100%;
    margin-top: 10px;
    text-align: center;
  }
  .b_t_header {
    height: 100%;
    padding: 10px 20px;
    font-size: 16px;
    background-color: #fff;
    .asd {
      max-height: 32px;
      line-height: 32px;
      .green {
        display: inline-block;
        vertical-align: middle;
        width: 4px;
        height: 22px;
        background-color: #00ae87;
      }
    }
  }
  .contentImg{
    width: 100px;
    height: 100px;
  }
  .v_body {
    .v_b_first {
      width: 97.5%;
      padding: 20px;
      font-size: 16px;
      background-color: #f0f4f5;
    }
    .b_top {
      font-size: 15px;
      padding: 20px;
      background-color: #fff;
      img {
        width: 80%;
        height: 80%;
      }
      .right {
        div {
          margin-bottom: 15px;
        }
      }
    }
    .b_bottom {
      font-size: 15px;
      background-color: #fff;
      padding: 20px;
      .img1 {
        width: 100%;
        height: 50px;
      }
      .right {
        div {
          margin-bottom: 10px;
        }
      }
      .border {
        width: 99%;
        border: 1px solid #00ae87;
        margin: 10px 0px;
        color: #00ae87;
        padding: 15px 0px 15px 15px;
        position: relative;
      }
      .border::before {
        content: "123";
        position: absolute;
        font-size: 0;
        border: 12px solid transparent;
        border-top-color: #00ae87; /*这里的颜色一定要跟上面demo边框颜色一样*/
        right: 20px;
        bottom: -24px;
      }
      .border::after {
        content: "123";
        position: absolute;
        font-size: 0;
        border: 12px solid transparent;
        border-top-color: #fff; /*这里的颜色一定要跟上面demo边框颜色一样*/
        right: 20px;
        bottom: -22px;
      }
    }
  }
  .color999 {
    color: #999;
  }
  .mr10 {
    margin-right: 10px;
  }
  .mr30 {
    margin-right: 30px;
  }
}
</style>
