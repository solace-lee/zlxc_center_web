<template>
  <div class="fillcontain">
    <div style="width: 100%; max-height:50px;">
      <el-menu
        :default-active="activeIndex"
        class="el-menu-demo"
        mode="horizontal"
        @select="handleSelect"
        active-text-color="#00ae87"
      >
        <div style="border-left:solid #00ae87 4px; width:73px;height:20px;margin:15px;">&nbsp;换货订单</div>
        <div style="display: flex; justify-content: space-between;align-items:center;">
          <el-menu-item index="10" > 全部 </el-menu-item><div style="color:#999">/</div> 
          <el-menu-item index="0" > 待审核 </el-menu-item><div style="color:#999">/</div> 
          <el-menu-item index="4" > 审核通过 </el-menu-item> <div style="color:#999">/</div>  
          <el-menu-item index="2" > 待商家收货 </el-menu-item> <div style="color:#999">/</div>  
          <el-menu-item index="9" > 待商家发货 </el-menu-item> <div style="color:#999">/</div>  
          <el-menu-item index="5" > 商家已发货 </el-menu-item> <div style="color:#999">/</div>  
          <el-menu-item index="6" > 买家已收货 </el-menu-item> <div style="color:#999">/</div>  
          <el-menu-item index="3" > 拒绝 </el-menu-item> <div style="color:#999">/</div>  
          <el-menu-item index="7" > 关闭 </el-menu-item>
        </div>
        <div style="display:flex;padding-left:50px;">
          <div style="margin:6px" >
            <span style="width:10px;text-align:center;line-height:20px; font-size:14px;">筛选时间</span>
            <el-date-picker
              v-model="timeFrame"
              type="daterange"
              value-format="yyyy/MM/dd"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </div>
          <div style="margin:0px 20px 0px 20px; display:flex;align-items:center">
            <el-input placeholder="请输入订单号" v-model="orderNum" clearable @keyup.enter.native="filterOrder"></el-input>
            <el-button icon="el-icon-search" @click="filterOrder" type="success" size="small" style="margin-left:10px;"> </el-button>
          </div>
        </div>
      </el-menu>
    </div>
    <div class="table_container">
      <el-table
        :data="tableData"
        style="width: 100%;" 
        :stripe = true
        :header-cell-style="{background:'#f0f4f5'}"
      >
        <el-table-column label="订单号" prop="orderNum" align="center"></el-table-column>
        <el-table-column label="下单时间" prop="createTime" align="center"></el-table-column>
        <el-table-column label="用户" prop="nickName" align="center"></el-table-column>
        <el-table-column label="订单状态" :formatter="orderStatusFormatter" prop="refundStatus" align="center"></el-table-column>
        <el-table-column label="交易金额" :formatter="amountFormatter" prop="discountPrice" align="center"></el-table-column>
        <el-table-column label="快递费" :formatter="amountFormatter" prop="courierFees" align="center"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="查看详情" placement="top">
              <el-button
                size="mini"
                @click="goToDetails(scope.$index, scope.row)"><span class="iconfont icon-xianshikejian"></span></el-button>
            </el-tooltip>
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
  </div>
</template>

<script>
import {amountFormat} from "../../utils/amountFormat";
export default {
  data() {
    return {
      timeFrame: '',   //时间选择默认
      orderNum: '',  //订单号输入默认
      activeIndex: '10',  //菜单默认
      tableData: [],
      currentRow: 10,
      count: 0,
      currentPage: 1,
      expendRow: [],
      courierFees:"",//快递费
      discountPrice:"",//交易金额
      refundStatus:"",
    };
  },
  created() {
    let exchangeOrderList = window.localStorage.getItem("exchangeOrderList");
    let orderObj = JSON.parse(exchangeOrderList)
    if(exchangeOrderList){
      this.orderNum = orderObj.orderNum;
      this.activeIndex = orderObj.refundStatus;
      this.refundStatus = orderObj.refundStatus;
      this.timeFrame = orderObj.timeFrame;
      this.currentPage = orderObj.page;
      this.currentRow = orderObj.rows;
    }
    this.getOrderList();
  },
  beforeRouteEnter (to, from, next) {
    if(from.path != "/exchangeOrderDetails"){
      window.localStorage.setItem("exchangeOrderList","{}");
    }
    next();
  },
  mounted() {},
  methods: {
    async getOrderList() {
      //请求退换订单列表
      let beginTime;
      let endTime;
      if(this.timeFrame && this.timeFrame.length > 1){
        beginTime = this.timeFrame[0];
        endTime = this.timeFrame[1];
      }
      let obj = {
        data:{
          "dateStart":beginTime,
          "dateEnd":endTime,
          "orderNum":this.orderNum,
          "refundType":2,
          "refundStatus":this.refundStatus,
          "page":this.currentPage,
          "rows":this.currentRow||10
        }
      }
      this.axiosReq(this.apis.queryOrderRefundList,"post",obj).then(res =>{
        if(res.status === 200){
          this.orderData = res.data.data;
          this.count = this.orderData.total;
          this.tableData = this.orderData.items;
        }else{
          this.$message.error(res.message);
        }
      })
    },
    amountFormatter(row,column){
      //金额格式化
      let amount = row[column.property];
      return amountFormat(amount);
    },
    orderStatusFormatter(row){
      // 订单状态
      let state = row.refundStatus;
      let code = {
        "0":"待商家处理",
        "1":"已退款",
        "2":"用户已发货",
        "3":"已拒绝",
        "4":"审核通过",
        "5":"商家已发货",
        "6":"买家确认收货",
        "7":"取消售后",
        "8":"申诉",
        "9":"卖家确认收货",
      }
      return code[state];
    },
    filterOrder(){
      // 筛选订单
      this.getOrderList();
    },
    //订单tab切换
    handleSelect(key, keyPath) {
      if(key == 10){
        key = "";
      }
      this.refundStatus = key;
      this.getOrderList();

    },
    goToDetails(index,row){
      //路由跳转到订单详情
      this.saveLocalStorage();
      this.$router.push({
        path:"/exchangeOrderDetails",
        query:{
          id:row.id,
          refundStatus:row.refundStatus,
          sendTrackingNum:row.sendTrackingNum,
          uKuaidiName:row.uKuaidiName,
          trackingNum:row.trackingNum,
          sKuaidiName:row.sKuaidiName,
          addressId:row.addressId
        }
      })
    },
    saveLocalStorage () {
      let exchangeOrderList = {
        "orderNum":this.orderNum,
        "refundType":2,
        "refundStatus":this.refundStatus,
        "page":this.currentPage,
        "rows":this.currentRow,
        "timeFrame":this.timeFrame
      }
      window.localStorage.setItem("exchangeOrderList", JSON.stringify(exchangeOrderList));
    },
    sizeChange(currentRow){
      //pageSize 改变时会触发
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
  },
};
</script>

<style lang="less" scoped>
.search-wrap{
  justify-content: space-between
}
.fillcontain{
  background: #f0f4f5
}

.el-menu-demo {
  display: flex;
  width: 100%;
}
.table_container {
  padding: 0;
  background: #fff;
  //  margin-top: 5%;
}
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
.el-menu--horizontal .el-menu-item {
    height: 51px;
    line-height: 51px;
    margin: 0;
    border-bottom: 2px solid transparent;
        border-bottom-color: transparent;
    color: #909399;
}
.el-menu-item {
    font-size: 14px;
    color: #303133;
    padding: 0 15px;
    cursor: pointer;
    position: relative;
    -webkit-transition: border-color .3s,background-color .3s,color .3s;
    transition: border-color .3s,background-color .3s,color .3s;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    white-space: nowrap;
}
</style>
