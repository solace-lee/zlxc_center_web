//消息通知  June
// import { constants } from 'http2';
<template>
  <div class="news">
    <div class="list">
      <div class="b_t_header">
        <span></span>
        消息中心
      </div>
      <el-table
        :data="tableData"
        :header-cell-style="{background:'#f0f4f5'}"
        stripe
        :show-header="false"
        style="width: 100%; background-color:#f0f4f5;margin-bottom:30px;"
        @row-click="editLi"
      >
        <el-table-column label="商品图片" prop="fenglie" width="50px">
          <template slot-scope="scope">
            <img :src="scope.row.messageImg" alt="获取失败">
          </template>
        </el-table-column>
        <el-table-column label="发送人" prop="messageContent"></el-table-column>
        <el-table-column label="状态" width="80px">
          <template slot-scope="scope">
            <div>-{{scope.row.msgStatus | value}}-</div>
          </template>
        </el-table-column>
        <el-table-column label="信息" prop="messageContent" width="800px"></el-table-column>
        <el-table-column label="时间" prop="createTime" align="center"></el-table-column>
        <el-table-column label="发送人" prop="sender" align="center"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="danger" plain @click.stop="open(scope.row.userMsgId)">
              <span class="iconfont icon-lajitong"></span>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="Pagination" style="text-align: right;margin-top: 10px;">
        <el-pagination
          :current-page="currentPage"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="currentRow"
          :total="count" @size-change = "sizeChange" @current-change = "currentChange" @prev-click = "prevClick" @next-click = "nextClick"
          layout="total, sizes, prev, pager, next, jumper"
        ></el-pagination>
      </div>
    </div>

    <!-- 弹窗-编辑 -->
    <el-dialog title="消息详情" :visible.sync="dialogFormVisible" center width="500px">
      <div class="editNew">
        <el-row style="margin-bottom:20px">
          <el-col :span="3">
            <img :src="li.messageImg" alt>
          </el-col>
          <el-col :span="10">
            <span>{{li.createTime}}</span>
            <span>{{li.msgStatus | value}}</span>
          </el-col>
        </el-row>

        <div>
          <span>收件人：</span>
          <span>{{li.sender}}</span>
        </div>
        <div>
          <span>时间：</span>
          <span>{{li.createTime}}</span>
        </div>
        <div class="message" v-html="li.messageContent"></div>
        <div>消息链接:</div>
        <a :href="li.businessHandleUrl">{{li.businessHandleUrl}}</a>
      </div>
    </el-dialog>
  </div>
</template>


<script>
export default {
  data() {
    return {
      pageNum: 1, //页数
      pageSize: 10, //每页几条
      total: 0, //总页数
      totalPage: 0, //
      tableData: [], //所有消息列表
      dialogFormVisible: false,
      count: 1000,
      currentRow: 10,
      currentPage: 1,
      li: {},
    };
  },
  components: {},
  created() {
    this.allNews();
  },
  watch: {
    dialogFormVisible() {
      this.allNews()
    },
    //tab切换
    // activeName: function(activeName) {
    //   if (activeName == "all") {
    //     this.init();
    //     this.allNews(1, 15);
    //   } else if (activeName == "first") {
    //     this.init();
    //     this.getSystemNews(1, 15);
    //   } else if (activeName == "second") {
    //     this.init();
    //     this.transformNews(1, 15);
    //   }
    // },
    //页数  切换页面会初始化页面为1，此时改变页数的active
    currentPage(currentPage) {
      if (currentPage == 1) {
        this.currentPage = 1;
      }
    }
  },
  methods: {
    // 接口
    // 获取列表
    allNews() {
      let obj = {
        params: {
          pageNum: this.currentPage,
          pageSize: this.pageSize
        }
      };
      this.axiosReq(this.apis.allNews, "get", obj).then(res => {
        if (res.status == 200) {
          this.tableData = res.data.items;
          this.count = res.data.total
          this.currentPage = res.data.totalPage
        } else {
          err.message = "获取列表失败";
        }
      });
    },
    // 删除
    delData(id) {
      this.axiosReq(this.apis.deleteMsg + id, "DELETE").then(res => {
        // console.log(res);
        if (res.status == 204) {
          this.$message({
            message: "删除成功",
            type: "success"
          });
        } else {
          this.$message.error("删除失败");
        }
        this.allNews();
      });
    },
    //已读
    editData(id) {
      this.axiosReq(this.apis.editMsg + id, "get").then(res => {
        // console.log(res);
        if (res.status == 200) {
          this.li = res.data;
        }
      });
    },

    editLi(val) {
      this.dialogFormVisible = !this.dialogFormVisible;
      this.editData(val.userMsgId);
    },
    // 删除
    open(id) {
      this.$confirm("你确定要删除此消息吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        center: true
      })
        .then(() => {
          this.delData(id);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },

    sizeChange(currentRow){
      //currentRow 改变时会触发
      this.currentRow = currentRow;
      this.getOrderList();
    },

    currentChange(currentPage){
      //currentPage 改变时会触发
      this.currentPage = currentPage;
      this.getOrderList();
    },

    prevClick(currentPage){
      //用户点击上一页按钮改变当前页后触发
      this.currentPage = currentPage;
      this.getOrderList();
    },
    
    nextClick(currentPage){
      //用户点击下一页按钮改变当前页后触发
      this.currentPage = currentPage;
      this.getOrderList();
    }

    //初始化
    // init() {
    //   this.currentPage = 1;
    //   this.count = 0;
    // },
    // //平台消息
    // async getSystemNews(pageNum, pageSize) {
    //   await this.axiosReq(
    //     this.apis.systemNews + "?pageNum=" + pageNum + "&pageSize=" + pageSize,
    //     "get"
    //   ).then(res => {
    //     const resData = res;
    //     if (resData.status == 200) {
    //       if (resData.data.total !== 0) {
    //         this.tableData = resData.data.items;
    //         this.count = resData.data.total;
    //         //给数据添加个删除方便渲染
    //         this.tableData.map(item => {
    //           item.delString = "删除";
    //         });
    //       } else {
    //         this.tableData = [];
    //         this.count = 0;
    //       }
    //     }
    //   });
    // },
    // //交易消息
    // async transformNews(pageNum, pageSize) {
    //   await this.axiosReq(
    //     this.apis.transformNews +
    //       "?pageNum=" +
    //       pageNum +
    //       "&pageSize=" +
    //       pageSize,
    //     "get"
    //   ).then(res => {
    //     const resData = res;
    //     if (resData.status == 200) {
    //       if (resData.data.total !== 0) {
    //         this.tableData = resData.data.items;
    //         this.count = resData.data.total;
    //         //给数据添加个删除方便渲染
    //         this.tableData.map(item => {
    //           item.delString = "删除";
    //         });
    //       }
    //     } else {
    //       this.tableData = [];
    //       this.count = 0;
    //     }
    //   });
    // },
    // //全部消息
    // async allNews(pageNum, pageSize) {
    //   await this.axiosReq(
    //     this.apis.allNews + "?pageNum=" + pageNum + "&pageSize=" + pageSize,
    //     "get"
    //   ).then(res => {
    //     const resData = res;
    //     if (resData.status == 200) {
    //       if (resData.data.total !== 0) {
    //         this.tableData = resData.data.items;
    //         this.count = resData.data.total;
    //         //给数据添加个删除方便渲染
    //         this.tableData.map(item => {
    //           item.delString = "删除";
    //         });
    //       } else {
    //         this.tableData = [];
    //         this.count = 0;
    //       }
    //     }
    //   });
    // },
    // //删除消息
    // async del(userMsgId) {
    //   this.$confirm("您确定要删除吗?", "提示", {
    //     confirmButtonText: "确定",
    //     cancelButtonText: "取消",
    //     type: "warning"
    //   })
    //     .then(() => {
    //       this.axiosReq(this.apis.delNews + "/" + userMsgId, "delete").then(
    //         res => {
    //           const resData = res;
    //           if (resData.status == 204) {
    //             this.$message({
    //               type: "success",
    //               message: "删除成功!"
    //             });
    //             this.init();
    //             this.allNews(1, 15);
    //           }
    //         }
    //       );
    //     })
    //     .catch(() => {
    //       this.$message({
    //         type: "info",
    //         message: "已取消删除"
    //       });
    //     });
    // },
    // handleSizeChange(val) {
    //   console.log(val);
    //   console.log(`每页 ${val} 条`);
    // },
    // //切换页数 通过页数请求
    // handleCurrentChange(val) {
    //   this.currentPage = val;
    //   const activeName = this.activeName;
    //   if (activeName == "first") {
    //     this.getSystemNews(this.currentPage, 15);
    //   } else if (activeName == "second") {
    //     this.transformNews(this.currentPage, 15);
    //   }
    // }
  },
  filters: {
    value(data) {
      if (data == 0) {
        return "未读";
      } else if (data == 1) {
        return "已读";
      }
    }
  }
};
</script>

<style lang='less' >
.news {
  img {
    width: 100%;
  }
  .el-dialog__header {
    background-color: #ccc;
  }
  .editNew {
    min-height: 300px;
    .message {
      width: 100%;
      margin: 50px 0px;
    }
    .img {
      width: 100%;
      height: 100px;
    }
  }
  .list {
    width: 100%;
    height: 100%;
    .b_t_header {
      padding: 20px;
      font-size: 16px;
      background-color: #fff;
      span {
        display: inline-block;
        vertical-align: middle;
        width: 4px;
        height: 22px;
        background-color: #00ae87;
      }
    }
    .icon-lajitong {
      color: #ff0000;
      font-size: 30px;
    }
  }
}
</style>