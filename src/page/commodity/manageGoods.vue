<template>
  <div class="manageGoods">
    <!-- 头部 -->
    <el-row class="b_t_header" >
      <el-col :span="10" class="asd">
        <div>
          <span class="green"></span>
          <strong>商品管理</strong>
        </div>
      </el-col>

      <el-col :span="14">
        <el-row :gutter="20" type="flex" justify="end">
          <el-col :span="8">
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
          <el-col :span="8">
            <div class="bor">
              <span>商品标签:</span>
              <el-select v-model="commodityArea" clearable placeholder="请选择" style="width:70%;">
                 <div v-for="(item,index) in label" :key="index">
                  <el-option :label="item.name" :value="item.id"></el-option>
                </div>
              </el-select>
            </div>
          </el-col>
          <el-col :span="7">
            <div class="bor">
              <span>品牌:</span>
              <el-input
                v-model="brandName"
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
    <el-table
      :data="tableData"
      :header-cell-style="{background:'#f0f4f5'}"
      stripe
      style="width: 100%; background-color:#f0f4f5;margin-bottom:30px;"
    >
      <el-table-column label="商品" align="center" min-width="100px" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-row type="flex" align="middle">
            <el-col :span="8">
              <img :src="scope.row.imgUrl" alt class="img">
            </el-col>
            <el-col :span="16">
              <div class="text">{{scope.row.name}}</div>
            </el-col>
          </el-row>
        </template>
      </el-table-column>

      <el-table-column label="品牌" prop="brandName" align="center"></el-table-column>
      <el-table-column label="是否上下架" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.isPutaway | names2}}</span>
        </template>
      </el-table-column>

      <el-table-column label="商品标签" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.commodityArea | names}}</span>
        </template>
      </el-table-column>
      <el-table-column label="最高价" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.commodityArea == 4">积分:{{ scope.row.originalPrice}}</span>
          <span v-if="scope.row.commodityArea !== 4">￥{{ scope.row.originalPrice}}</span>
        </template>
      </el-table-column>
      <el-table-column label="最低价" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.commodityArea == 4">积分:{{ scope.row.discountPrice}}</span>
          <span v-if="scope.row.commodityArea !== 4">￥{{ scope.row.discountPrice}}</span>
        </template>
      </el-table-column>
      <el-table-column label="库存" align="center" prop="quantity"></el-table-column>
      <el-table-column label="商品id" align="center" prop="commodityId"></el-table-column>
      <el-table-column label="审核状态" align="center" prop="reviewStatus">
        <template slot-scope="scope">
          <span v-if="scope.row.reviewStatus == 1" class="green">{{ scope.row.reviewStatus | value}}</span>
          <span v-if="scope.row.reviewStatus == 0" class="red">{{ scope.row.reviewStatus | value}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="200px">
        <template slot-scope="scope">
          <!-- <el-button
            size="mini"
            type="danger"
            plain
            @click="popDialog(scope.row.commodityId , 1)"
            v-if="scope.row.reviewStatus == 0"
          >
            <span class="iconfont icon-cuowuguanbiquxiao"></span>
          </el-button>
          <el-button
            size="mini"
            type="success"
            plain
            @click="popDialog(scope.row.commodityId,0)"
            v-if="scope.row.reviewStatus == 1"
          >
            <span class="iconfont icon-zhengquewancheng"></span>
          </el-button>-->
          <el-tooltip effect="dark" content="编辑" placement="top">
            <el-button size="mini" type="primary" plain @click="goEdit(scope.row.commodityId)">
              <span class="iconfont icon-bianjishuru"></span>
            </el-button>
          </el-tooltip>
          
          <el-tooltip effect="dark" content="删除" placement="top">
            <el-button size="mini" type="danger" plain @click="open2(scope.row.commodityId)">
              <span class="iconfont icon-lajitongshanchu"></span>
            </el-button>
          </el-tooltip>
          
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
      <div class="deltext"><span >你确定要删除此商品吗?</span></div>
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
      currentPage4: 1,
      commodityArea: JSON.parse(window.sessionStorage.getItem('mg_commodityArea') || '""'), //标签选择
      name: JSON.parse(window.sessionStorage.getItem('mg_name') || '""'), //商品名称
      brandName: JSON.parse(window.sessionStorage.getItem('mg_brandName') || '""'), //品牌
      page: JSON.parse(window.sessionStorage.getItem('mg_page') || '1'),
      rows: JSON.parse(window.sessionStorage.getItem('mg_rows') || '10'),
      centerDialogVisible:false,//删除弹窗
      delId: Number, //需要删除的id
      total: 0,
      tableData: [],
      label: [],//标签
    };
  },
  created() {
    // this.getbrandManage();
    this.getData();
    this.getLabel();
  },
   beforeRouteEnter (to, from, next) {
    if(from.path != "/visitor"){
      window.sessionStorage.removeItem('mg_commodityArea')  //标签选择
      window.sessionStorage.removeItem('mg_name') //商品名称
      window.sessionStorage.removeItem('mg_brandName')//品牌
      window.sessionStorage.removeItem('mg_page')
      window.sessionStorage.removeItem('mg_rows')
    }
    next();
  },
  methods: {
    // 接口
    // 获取信息
    getData() {
      let obj = {
        params: {
          name: this.name,
          brandName: this.brandName,
          commodityArea: this.commodityArea,
          page: this.page,
          rows: this.rows
        }
      };
      this.axiosReq(this.apis.goodsList, "get", obj).then(res => {
        if (res.status == 200) {
          this.tableData = res.data.items;
          this.total = res.data.total;
        } else {
          this.$message({
            message: "获取商品列表失败",
            type: "warning"
          });
        }
      });
    },
    //删除
    deleteData(id) {
      this.axiosReq(this.apis.delGoods + id, "get").then(res => {
        if (res.status == 200) {
          this.$message({
            type: "success",
            message: "删除成功!"
          });
          this.centerDialogVisible =! this.centerDialogVisible
          this.getData();
        } else {
          this.$message({
            type: "warning",
            message: "删除失败"
          });
        }
      });
    },
    //
    //获取品牌
    // getbrandManage() {
    //   this.axiosReq(this.apis.getBrandManage, "post", {
    //     page: 1,
    //     rows: 10
    //   }).then(res => {
    //     console.log(res);
    //   });
    // },
    // 获取标签
    getLabel() {
      this.axiosReq(this.apis.labelList, "get").then(res => {
        if (res.status == 200) {
          this.label = res.data.data;
        }
      });
    },
    // 脚部分页
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
    //去往编辑页
    goEdit(id) {
      this.$router.push({
        path: "/visitor?id=" + id
      });
    },
    //审核
    // popDialog(allId, num) {
    //   let id = Qs.stringify({ ids: allId }, { indices: false });
    //   let status = Qs.stringify({ status: num }, { indices: false });
    //   console.log(id, num);
    //   this.axiosReq(this.apis.commodityReview + id + "&" + status, "post").then(
    //     res => {
    //       if (res.data.status == 200) {
    //         this.$message({
    //           type: "success",
    //           message: res.data.msg
    //         });
    //         this.getData();
    //       }
    //     }
    //   );
    // },
    // 弹窗-删除
    open2(id) {
      this.centerDialogVisible =! this.centerDialogVisible
      this.delId = id
    },
    //确认删除
    goDel() {
      this.deleteData(this.delId);
    }
  },
  watch: {
    commodityArea: {
      handler (val, oldVal) {
        window.sessionStorage.setItem('mg_commodityArea',JSON.stringify(val))
      },
      deep:true
    },
    name: {
      handler (val, oldVal) {
        window.sessionStorage.setItem('mg_name',JSON.stringify(val))
      },
      deep:true
    },
      brandName: {
      handler (val, oldVal) {
        window.sessionStorage.setItem('mg_brandName',JSON.stringify(val))
      },
      deep:true
    },
    page: {
      handler (val, oldVal) {
        window.sessionStorage.setItem('mg_page',JSON.stringify(val))
      },
      deep:true
    },
    rows: {
      handler (val, oldVal) {
        window.sessionStorage.setItem('mg_rows',JSON.stringify(val))
      },
      deep:true
    }
  },
  filters: {
    names(data) {
      if (data == 0) {
        return "普通商品";
      } else if (data == 1) {
        return "生态商品";
      } else if (data == 2) {
        return "一村一品";
      } else if (data == 3) {
        return "会员商品";
      } else if (data == 4) {
        return "积分商品";
      }
    },
    names2(data) {
      if (data == 0) {
        return "下架";
      } else if (data == 1) {
        return "上架";
      }
    },

    value(data) {
      if (data == 0) {
        return "未通过";
      } else if (data == 1) {
        return "已通过";
      }
    }
  }
};
</script>

<style lang="less">
.manageGoods {
  width: 100%;
  min-height: 100%;
  .red {
    color: rgba(245, 7, 7, 0.333);
  }
  .green {
    color: #00ae87;
  }
  .check {
    width: 100%;
    text-align: center;
  }
  .goods {
    width: 100%;
    display: flex;
    justify-content: flex-start;
    div {
      flex: 1;
    }
  }
  .img {
    width:100%;
    display: inline-block;
    vertical-align: middle;
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
      .el-input__icon {
        height: 100%;
        line-height: 50%;
      }
    }
    .bor2 {
      height: 100%;
      display: flex;
      align-items:center;
      font-size: 20px;
    }
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
