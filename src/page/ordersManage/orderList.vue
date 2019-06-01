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
        
        <div style="border-left:solid #00ae87 4px; width:82px;height:20px;margin:15px;">&nbsp;全部订单</div>
        <div style="display: flex; justify-content: space-between;margin-left: 20px; align-items:center;">
          <el-menu-item index="0" > 全部 </el-menu-item><div style="color:#999">/</div>           
          <el-menu-item index="1" > 待付款 </el-menu-item><div style="color:#999">/</div> 
          <el-menu-item index="2" > 待发货 </el-menu-item><div style="color:#999">/</div>  
          <el-menu-item index="3" > 待收货 </el-menu-item><div style="color:#999">/</div>    
          <el-menu-item index="4" > 待评价 </el-menu-item><div style="color:#999">/</div>  
          <el-menu-item index="9" > 已评价 </el-menu-item><div style="color:#999">/</div>  
          <el-menu-item index="7" > 取消中 </el-menu-item><div style="color:#999">/</div>  
          <el-menu-item index="6" > 关闭 </el-menu-item> 
        </div>
        <div style="margin:6px 0px 0px 9%;" >
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
        <el-table-column label="下单时间" prop="createdDate" align="center"></el-table-column>
        <el-table-column label="用户" prop="nickName" align="center"></el-table-column>
        <el-table-column label="订单状态" :formatter="orderStatusFormatter" prop="orderStatus" align="center"></el-table-column>
        <el-table-column label="商品总额" prop="discountPrice" align="center">
          <template slot-scope="scope">
            <div>
              <span v-if="scope.row.integralAmount">{{scope.row.integralAmount+" 积分"}}</span>
              <span v-else>{{getAmountFormat(scope.row.discountPrice)}}</span>
            </div>
          </template>
        </el-table-column>
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
      activeIndex: '0',  //菜单默认
      tableData: [],
      count: 0,
      currentRow: 10,
      currentPage: 1,
      orderData:{},
      orderNum:'',
      orderStatus:"",
    };
  },
  created() {
    this.activeIndex = this.$route.query.orderStatus||'0';
    this.orderStatus = this.$route.query.orderStatus||"";
    let orderList = window.localStorage.getItem("orderList");
    let orderObj = JSON.parse(orderList)
    if(orderList){
      this.orderNum = orderObj.orderNum;
      this.activeIndex = orderObj.orderStatus;
      this.orderStatus = orderObj.orderStatus;
      this.timeFrame = orderObj.timeFrame;
      this.currentPage = orderObj.page;
      this.currentRow = orderObj.rows;
    }
    this.getOrderList();
  },
  beforeRouteEnter (to, from, next) {
    if(from.path != "/orderDetails"){
      window.localStorage.setItem("orderList","{}");
    }
    next();
  },
  mounted() {},
  methods: {
    getOrderList() {
      //请求订单列表
      let beginTime;
      let endTime;
      if(this.timeFrame && this.timeFrame.length > 1){
        beginTime = this.timeFrame[0];
        endTime = this.timeFrame[1];
      }
      let obj = {
        data:{
          "page":this.currentPage,
          "rows":this.currentRow||10,
          "orderStatus":this.orderStatus,
          "orderNum":this.orderNum,
          "dateStart":beginTime,
          "dateEnd":endTime
        }
      }
      this.axiosReq(this.apis.getShopOrder,"post",obj).then(res =>{
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
    getAmountFormat(amount){
      //金额格式化
      return amountFormat(amount);
    },
    orderStatusFormatter(row){
      // 订单状态
      let state = row.orderStatus;
      let code = {
        "1":"待支付",
        "2":"待发货",
        "3":"待确认",
        "4":"待评价",
        "5":"待退货",
        "6":"已取消",
        "7":"取消中",
        "8":"保留",
        "9":"已评价",
      }
      return code[state];
    },
    filterOrder(){
      // 筛选订单
      this.getOrderList();
    },
    //订单tab切换
    handleSelect(key, keyPath) {
      if(key == 0){
        key = "";
      }
      this.orderStatus = key;
      this.getOrderList();
    },
    goToDetails(index,row){
      //路由跳转到订单详情
      this.saveLocalStorage();
      this.$router.push({
        path:"/orderDetails",
        query:{
          orderId:row.orderId,
          addressId:row.addressId,
          orderStatus:row.orderStatus,
          trackingNum:row.trackingNum,
          sellerCourierName:row.sellerCourierName
        }
      })
    },
    saveLocalStorage () {
      let orderList = {
        "page":this.currentPage,
        "rows":this.currentRow,
        "orderStatus":this.orderStatus,
        "orderNum":this.orderNum,
        "timeFrame":this.timeFrame
      }
      window.localStorage.setItem("orderList", JSON.stringify(orderList));
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
</style>
