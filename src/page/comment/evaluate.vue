<template>
  <div class="evaluate">
    <!-- 头部 -->
    <el-row class="b_t_header">
      <el-col :span="8" class="asd">
        <div>
          <span class="green"></span>
          <strong>评论管理</strong>
        </div>
      </el-col>

      <el-col :span="16">
        <el-row :gutter="20" type="flex" justify="end">
          <!-- <el-col :span="9">
            <div class="bor">
              <span>选择日期:</span>
              <el-date-picker
                v-model="time"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy/MM/dd"
              ></el-date-picker>
            </div>
          </el-col>
          <el-col :span="7">
            <div class="bor">
              <span>买家账号:</span>
              <el-input
                v-model="userAccount"
                placeholder="请输入内容"
                style="width:50%;"
                @keyup.enter.native="getSearch"
              ></el-input>
            </div>
          </el-col> -->
          <el-col :span="7">
            <div class="bor">
              <span>商品名称:</span>
              <el-input
                v-model="name"
                placeholder="请输入内容"
                style="width:50%;"
                @keyup.enter.native="getSearch"
              ></el-input>
            </div>
          </el-col>
          <el-col :span="1">
            <div class="bor2" @click="getSearch">
              <span class="el-icon-search"></span>
            </div>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <!-- 列表项目 -->
    <!-- ref="multipleTable" -->
    <!-- @selection-change="handleSelectionChange" -->
    <el-table
      :data="tableData"
      :header-cell-style="{background:'#f0f4f5'}"
      stripe
      style="width: 100%; background-color:#f0f4f5;margin-bottom:30px;"
    >
      <!-- <el-table-column label="全选/反选" type="selection" width="30"></el-table-column> -->
      <el-table-column label="商品图片" min-width="90px"  align="center">
        <template slot-scope="scope">
            <img :src="scope.row.imgUrl" alt class="img">
        </template>
      </el-table-column>
      <el-table-column label="商品" align="center" min-width="130px" show-overflow-tooltip>
        <template slot-scope="scope">
            <div>{{scope.row.name}}</div>
        </template>
      </el-table-column>
      <el-table-column label="商品标签" prop="content" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.commodityArea == 0 ">普通商品</span>
          <span v-if="scope.row.commodityArea == 1 ">生态商品</span>
          <span v-if="scope.row.commodityArea == 2 ">一村一品</span>
          <span v-if="scope.row.commodityArea == 3 ">会员商品</span>
          <span v-if="scope.row.commodityArea == 4 ">积分商品</span>
        </template>
      </el-table-column>
      <el-table-column label="商品品牌" prop="brandName" align="center"></el-table-column>
      <el-table-column label="销量" prop="salesVolume" align="center"></el-table-column>
      <el-table-column label="评论数" prop="count" align="center"></el-table-column>
      <!-- <el-table-column label="等级" align="center">
        <template slot-scope="scope">
          <el-rate v-model="scope.row.level" disabled :colors="['#00ae87','#00ae87','#00ae87']"></el-rate>
        </template>
      </el-table-column> -->
      <el-table-column label="操作" align="center" width="200px">
        <template slot-scope="scope">
          <el-tooltip effect="dark" content="查看详情" placement="top">
            <el-button
              size="mini"
              type="primary"
              plain
              @click="dialogFormVisible(scope.row.commodityId)"
            >
              <span class="iconfont icon-ai-eye"></span>
            </el-button>
          </el-tooltip>
          
          <!-- <el-tooltip effect="dark" content="删除" placement="top">
            <el-button size="mini" type="danger" plain @click="open2(scope.row.commentId)">
              <span class="iconfont icon-lajitongshanchu"></span>
            </el-button>
          </el-tooltip> -->
        </template>
      </el-table-column>
    </el-table>
    <!-- 脚部 -->
    <div class="bm_foot">
      <el-pagination
        class="Pagination"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage4"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="rows"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>

    <!-- 弹窗-删除 -->
    <el-dialog
      title="提醒"
      :visible.sync="centerDialogVisible"
      width="28%"
      center>
      <div class="delIcon"><span class="iconfont icon-gantanhao-yuankuang"></span></div>
      <div class="deltext"><span >你确定要删除此品牌吗?</span></div>
      <div slot="footer" class="dialog-footer">
        <el-button class="btn" @click="goDel()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Qs from "qs";
export default {
  data() {
    return {
      // time: [], //时间
      // userAccount: "", //搜索用户名
      total: 0, //总页数
      page: JSON.parse(window.sessionStorage.getItem('el_page') || '1'), //业数
      rows: JSON.parse(window.sessionStorage.getItem('el_rows') || '10'), //条数
      name: JSON.parse(window.sessionStorage.getItem('el_name') || '""'), //搜索分类名
      currentPage4: 1,
      tableData: [], //列表
      centerDialogVisible:false,//删除弹窗
      delId: -1, //需要删除的id
      multipleSelection: [],
      ids: []
    };
  },
  created() {
    this.getData();
  },
  beforeRouteEnter (to, from, next) {
    if(from.path != "/evaluateDetails"){
      window.sessionStorage.removeItem('el_page')  //标签选择
      window.sessionStorage.removeItem('el_rows') //商品名称
      window.sessionStorage.removeItem('el_name')//品牌
    }
    next();
  },
  methods: {
    // 接口
    // 初始化
    getData() {
      let obj = {
        params: {
          name: this.name,
          page: this.page,
          rows: this.rows
        }
      };
      // if (this.time != null) {
      //   obj.params = {
      //     startDate: this.time ? this.time[0] : "",
      //     endDate: this.time ? this.time[1] : "",
      //     userAccount: this.userAccount,
      //     name: this.name,
      //     page: this.page,
      //     rows: this.rows
      //   };
      // } else {
      //   obj.params = {
      //     userAccount: this.userAccount,
      //     name: this.name,
      //     page: this.page,
      //     rows: this.rows
      //   };
      // }
      this.axiosReq(this.apis.query, "get", obj).then(res => {
        if (res.status == 200) {
          this.tableData = res.data.data.items;
          this.total = res.data.data.total;
        } else {
          this.$message({
            message: "获取商品列表失败",
            type: "warning"
          });
        }
      });
    },
    // 删除
    delData(idss) {
      let obj = {
        params: {
          ids: idss
        }
      };
      this.axiosReq(this.apis.deleteComment, "get", obj).then(res => {
        if (res.status == 200) {
          this.$message({
            message: "删除成功",
            type: "success"
          });
          this.centerDialogVisible =! this.centerDialogVisible
          this.getData();
        } else {
          this.$message.error("删除失败");
        }
        
      });
    },
    //分页
    handleSizeChange(val) {
      this.rows = val;
      this.getData();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getData();
    },
    // 搜索
    getSearch() {
      this.getData();
    },
    // 去往详情页
    dialogFormVisible(id) {
      console.log(id);
      this.$router.push({
        path: "/evaluateDetails?id=" + id
      });
    },
    // 弹窗-删除
    open2(id) {
      this.centerDialogVisible =! this.centerDialogVisible
      this.delId = id
    },
    //确认删除
    goDel() {
      this.delData(this.delId);
    }
    // handleSelectionChange(val) {
    //   this.multipleSelection = val;
    //   this.ids = [];
    //   this.multipleSelection.forEach(item => {
    //     this.ids.push(item.commentId);
    //   });
    //   this.ids = Qs.stringify({ ids: this.ids }, { indices: false });
    //   console.log(this.ids);
    // }
  },
  watch: {
    name: {
      handler (val, oldVal) {
        window.sessionStorage.setItem('el_name',JSON.stringify(val))
      },
      deep:true
    },
    page: {
      handler (val, oldVal) {
        window.sessionStorage.setItem('el_page',JSON.stringify(val))
      },
      deep:true
    },
    rows: {
      handler (val, oldVal) {
        window.sessionStorage.setItem('el_rows',JSON.stringify(val))
      },
      deep:true
    }
  },
};
</script>

<style lang="less">
.evaluate {
  width: 100%;
  min-height: 100%;
  .bor2 {
    width: 100%;
    height: 100%;
    display: flex;
    align-items:center;
    font-size: 20px;
  }
  .b_t_header {
    height: 100%;
    padding: 10px 20px;
    font-size: 16px;
    background-color: #fff;
    .el-input__inner {
      max-height: 30px;
      line-height: 30px;
      border: none;
    }
    .el-date-editor--daterange.el-input__inner {
      width: 70%;
      padding: 0;
      .el-range-input {
        width: 50%;
      }
    }

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
    .bor {
      color: #999;
      width: 100%;
      padding: 1px 2px;
      border: 1px solid #999999;
      border-radius: 4px;
    }
    
  }
  .img {
    width: 50%;
    height: 80px;
    display: inline-block;
    vertical-align: middle;
  }
  .bm_foot {
    width: 100%;
    display: flex;
    justify-content: flex-start;
    .btn {
      width: 100px;
      background-color: #00ae87;
    }
    .Pagination {
      flex: 1;
      text-align: right;
    }
  }
  .el-dialog__header {
    background-color: #f0f4f5;
  }
  .delIcon{
    span{
      font-size:48px;
      color: #ff7001;
    }
    width: 100%;
    text-align:center;
    margin:40px 0px 30px 0px;
  }
  .deltext{
    span{
      font-size:16px;
    }
    width: 100%;
    text-align:center;
    margin:0px 0px 50px 0px;
  }
  .btn {
      width: 100px;
      background-color: #00ae87;
      color:#fff;
    }
    .el-button--danger{
      background:#fff;
    }
    .el-button--primary{
      background:#fff;
    }
}
</style>
