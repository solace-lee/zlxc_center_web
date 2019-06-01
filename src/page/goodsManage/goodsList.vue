<template>
  <div class="goodsList">
    <!-- 头部 -->
    <el-row class="b_t_header">
      <el-col :span="10" class="asd">
        <div>
          <span class="green"></span>
          <strong>商品管理</strong>
        </div>
      </el-col>

      <el-col :span="14">
        <el-row :gutter="20" type="flex" justify="end">
          <el-col :span="7">
            <div class="bor">
              <span>商品名称:</span>
              <el-input placeholder="按照商品名称搜索" style="width:70%;" v-model="goodsName" clearable @keyup.enter.native="searchGoodes()"></el-input>
            </div>
          </el-col>
          <el-col :span="7">
            <div class="bor">
              <span>品牌名称:</span>
              <el-input placeholder="按照品牌搜索" style="width:70%;" v-model="brandName" clearable @keyup.enter.native="searchGoodes()"></el-input>
            </div>
          </el-col>
          <!-- <el-col :span="7">
            <div class="bor">
              <span>标签名称:</span>
              <el-input placeholder="按照标签搜索" style="width:70%;" v-model="labelName" clearable></el-input>
            </div>
          </el-col> -->
          <el-button icon="el-icon-search" type="success" size="small" style="margin-left:10px;" @click="searchGoodes()"> </el-button>
        </el-row>
      </el-col>
    </el-row>
    <!-- 列表项目 -->
    <el-table
      :data="goodsTableData"
      :header-cell-style="{background:'#f0f4f5'}"
      stripe
      style="width: 100%; background-color:#f0f4f5;margin-bottom:30px;"
    >
      <el-table-column label="商品" prop="name" align="center">
        <template slot-scope="scope">
          <div style="display:flex;display:-webkit-flex;align-items: center;justify-content:  flex-start;">
            <img :src="scope.row.imgUrl" alt="" style="width: 30%;">
            <span style="padding:5px;text-align:left;">{{scope.row.name}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="品牌" prop="brandName" align="center"></el-table-column>
      <el-table-column label="是否上架" prop="isPutaway" align="center">
        <template  slot-scope="scope">
          <span>{{scope.row.isPutaway == 1 ?"是":"否"}}</span>
        </template>
      </el-table-column>
      <el-table-column label="商品标签" :formatter="labelFormat" prop="commodityArea" align="center"></el-table-column>
      <el-table-column label="原价" align="center" prop="originalPrice" :formatter="amountFormatter"></el-table-column>
      <el-table-column label="售价" align="center" prop="discountPrice" :formatter="amountFormatter"></el-table-column>
      <el-table-column label="库存" align="center" prop="quantity"></el-table-column>
      <el-table-column label="操作" align="center" width="200px">
        <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="上架/下架" placement="top">
              <el-switch
                :value="changeState(scope.row.isPutaway)"
                @change="isGrounding(scope.row)"
                active-color="#13ce66"
                inactive-color="#ff4949">
              </el-switch>
            </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 脚部 -->
    <div class="bm_foot">
      <el-pagination
        class="Pagination"
        :current-page="currentPage"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="currentRow"
        :total="count" @size-change = "sizeChange" @current-change = "currentChange" @prev-click = "prevClick" @next-click = "nextClick"
        layout="total, sizes, prev, pager, next, jumper"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import {amountFormat} from "../../utils/amountFormat";
export default {
  data(){
    return{
      dialogFormVisible: false,//弹窗-编辑
      currentPage:1,
      currentRow: 10,
      count: 0,
      value1: true,
      value2: true,
      value:true,
      goodsTableData: [],
      goodsName:"",
      brandName:"",
      // labelName:"",
      // labelCode:"",
      // labelObj:{
      //   "普通商品":0,
      //   "生态商品":1,
      //   "一村一品":2,
      //   "会员商品":3,
      //   "积分商品":4,
      // }
    }
  },
  created() {
    this.getGoodsList();
  },
  methods: {
    changeState(state) {
      //g更改状态
      if(state == 1) {
        return true
      }else if(state == 2){
        return false
      }
    },
    getGoodsList(){
      //获取商品列表
      // this.labelCode = this.labelObj[this.labelName];
      let obj = {
        params:{
          "shopId":this.$route.query.shopId,
          "name":this.goodsName,
          "brandName":this.brandName,
          "commodityArea":"",//this.labelCode,
          "reviewStatus":1,
          "page":this.currentPage,
          "rows":this.currentRow,
        }
      }
      this.axiosReq(this.apis.getGoodsList, "get",obj).then(res => {
        this.goodsTableData = res.data.items;
        this.count = res.data.total;
      });
    },    
    amountFormatter(row,column){
      //金额格式化
      let amount = row[column.property];
      return amountFormat(amount);
    },
    labelFormat(row,column){
      //商品标签格式化
      let label = row[column.property];
      let labels = {
        0:"普通商品", 1:"生态商品",2:"一村一品",3:"会员商品",4:"积分商品"
      }
      return labels[label];
    },
    isGrounding(row,column){
      //改变商品状态
      row.isPutaway = (row.isPutaway == 1? 0:1);
      let obj={
        params:{
          "idArray":row.commodityId,
          "status":row.isPutaway,
        },
        headers:{}
      }
      this.axiosReq(this.apis.updateCommodityStatus, "get", obj).then(res => {
        if(res.status === 200){
              if(res.data.status!=200){
                this.$message.error(res.data.msg);
                row.isPutaway = (row.isPutaway == 1? 0:1);
              }else{
                this.$message.success("修改商品状态成功！");
              }
            }else{
                this.$message.error(res.message);
            }
      });
    },
    searchGoodes(){
      //商品搜索
      this.getGoodsList();
    },  
    sizeChange(currentRow){
      //currentRow 改变时会触发
      this.currentRow = currentRow;
      this.getGoodsList();
    }, 
    currentChange(currentPage){
      //currentPage 改变时会触发
      this.currentPage = currentPage;
      this.getGoodsList();
    },	
    prevClick(currentPage){
      //用户点击上一页按钮改变当前页后触发
      this.currentPage = currentPage;
      this.getGoodsList();
    },	
    nextClick(currentPage){
      //用户点击下一页按钮改变当前页后触发
      this.currentPage = currentPage;
      this.getGoodsList();
    }
  }
};
</script>

<style lang="less">
.goodsList {
  width: 100%;
  min-height: 100%;
  .b_t_header {
    height: 100%;
    padding: 10px 20px;
    font-size: 16px;
    background-color: #fff;
    .el-input__inner {
      max-height: 30px;
      line-height: 30px;
      border: none ;
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
}
</style>
