<template>
  <div class="home">
    <div class="asd">
      <section class="data_section">
        <el-row :gutter="20" style="margin-bottom: 10px;">
          <el-col :span="this.userType == 2||this.userType == 6? 8:6" :class="this.userType == 3?'overlay':''">
            <div class="data_list today_head" @click="goToOrdersListByStatus('1')">
              <div class="top">
                <img src="../../img/首页/icon_paid.png" alt>
                <span>{{waitPay}}</span>
              </div>
              <div class="bottom">待付款</div>
            </div>
          </el-col>
          <el-col :span="this.userType == 2||this.userType == 6? 8 :6" :class="this.userType == 3?'overlay':''">
            <div class="data_list today_head" @click="goToOrdersListByStatus('2')">
              <div class="top">
                <img src="../../img/首页/icon_shipped.png" alt>
                <span>{{waitShipments}}</span>
              </div>
              <div class="bottom">待发货</div>
            </div>
          </el-col>
          <el-col :span="this.userType == 2||this.userType == 6? 8 :6" :class="this.userType == 3?'overlay':''">
            <div class="data_list today_head" @click="goToOrdersListByStatus('3')">
              <div class="top">
                <img src="../../img/首页/icon_receiving.png" alt>
                <span>{{waitReceiving}}</span>
              </div>
              <div class="bottom">待收货</div>
            </div>
          </el-col>
          <el-col :span="6" v-if="this.userType !=2 && this.userType !=6">
            <div class="data_list today_head" @click="goToUnauditedSellerList()">
              <div class="top">
                <img src="../../img/首页/icon_examine.png" alt>
                <span>{{notAuditedCount}}</span>
              </div>
              <div class="bottom">待审核商家</div>
            </div>
          </el-col>
        </el-row>
      </section>
      <span v-if="this.userType != 2&&this.userType != 6">
        <div class="b_t_header" style="display:flex;justify-content:space-between;">
          <div>
            <span></span>
            待审核商家列表
          </div>
          <div class="iconfont icon-gengduo-hengxiang" @click="goToUnauditedSellerList()"></div>
        </div>
        <el-table
          :data="shopTableData"
          :header-cell-style="{background:'#f0f4f5'}"
          stripe
          style="width: 100%; background-color:#f0f4f5;margin-bottom:30px;"
        >
          <el-table-column label="商铺名称" prop="shopName" align="center"></el-table-column>
          <el-table-column label="分类" align="center">
            <template slot-scope="scope">
              <span>{{(scope.row.firstClassifyName+scope.row.secondClassifyName+scope.row.thirdClassifyName)||"暂无"}}</span>
            </template>
          </el-table-column>
          <el-table-column label="性质" :formatter="getShopNature" prop="shopNature" align="center"></el-table-column>
          <el-table-column label="联系人" prop="contactName" align="center"></el-table-column>
          <el-table-column label="联系电话" prop="contactPhone" align="center"></el-table-column>
          <el-table-column label="创建时间" prop="createdDate" align="center"></el-table-column>
          <el-table-column label="操作" align="center" width="300px">
            <template slot-scope="scope">
              <el-tooltip effect="dark" content="编辑信息" placement="top">
                <el-button size="mini" type="primary" plain @click="goToShopEdit(scope.row)">
                  <span class="iconfont icon-bianjishuru"></span>
                </el-button>
              </el-tooltip>
              <el-tooltip effect="dark" content="查看详情" placement="top">
                <el-button size="mini" type="success" plain @click="goToShopDetails(scope.row)">
                  <span class="iconfont icon-xianshikejian"></span>
                </el-button>
              </el-tooltip>
              <el-tooltip effect="dark" content="审核商家" placement="top">
                <el-button size="mini" type="primary" plain @click="popDialog(scope.row)">
                  <span class="iconfont icon-zhengquewancheng"></span>
                </el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <!-- 审核弹框 -->
        <el-dialog title="提示" center :visible.sync="dialogVisible" width="20%">
          <div style="display:flex;justify-content:center;width:100%;padding:7px 0;">
            <el-radio-group v-model="isPass">
              <el-radio label="2">通过</el-radio>
              <el-radio label="3">未通过</el-radio>
            </el-radio-group>
          </div>
          <el-input
            type="textarea"
            :autosize="{minRows: 4 , maxRows: 10}"
            size="large"
            v-model="auditRemark"
            placeholder="备注"
            autocomplete="off"
            style="width:100%;font-size:14px"
          ></el-input>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="shopAuditing()">确 定</el-button>
          </span>
        </el-dialog>
      </span>
      <!-- 列表-未完成订单 -->
      <div class="b_t_header" :class="{'overlay':this.userType == 3}" style="display:flex;justify-content:space-between;">
        <div>
          <span></span>
          未完成订单
        </div>
        <div class="iconfont icon-gengduo-hengxiang" @click="goToOrdersList()"></div>
      </div>
      <el-table
        :data="unDoneOrdersTableData"
        :header-cell-style="{background:'#f0f4f5'}"
        stripe  
        :class="this.userType == 3?'overlay':''"
        style="width: 100%; background-color:#f0f4f5;margin-bottom:30px;"
      >
        <el-table-column label="订单号" prop="orderNum" align="center"></el-table-column>
        <el-table-column label="下单时间" prop="createdDate" align="center"></el-table-column>
        <el-table-column label="收货人" prop="consignee" align="center"></el-table-column>
        <el-table-column label="订单状态" prop="orderStatus" align="center">
          <template slot-scope="scope">
            <div
              v-if="scope.row.orderStatus==1"
              style="color:#00ae87"
            >{{ scope.row.orderStatus | names}}</div>
            <div
              v-else-if="scope.row.orderStatus==2"
              style="color:#fecb4f"
            >{{ scope.row.orderStatus | names}}</div>
            <div
              v-else-if="scope.row.orderStatus==3"
              style="color:#6ebcef"
            >{{ scope.row.orderStatus | names}}</div>
            <div v-else>{{ scope.row.orderStatus | names}}</div>
          </template>
        </el-table-column>
        <el-table-column
          label="交易金额"
          :formatter="amountFormatter"
          prop="discountPrice"
          align="center"
        ></el-table-column>
        <el-table-column label="快递费" :formatter="amountFormatter" prop="courierFees" align="center"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button @click="checkOrderDetails(scope.$index, scope.row)">查看详情</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="h_tendency_header" :class="{'overlay':this.userType == 3}">
        <div class="h_t_h_left">
          <span></span>
          一周订单销量
        </div>
        <div class="h_t_h_right">
          <dir>
            <span class="yellow"></span>
            订单金额
          </dir>
          <dir>
            <span class="blue"></span>
            订单销量
          </dir>
        </div>
      </div>
      <tendency :sevenDate="sevenDate" :sevenDay="sevenDay" :class="{'overlay':this.userType == 3}"></tendency>
    </div>
  </div>
</template>

<script>
import tendency from "../components/tendency";
import { amountFormat } from "../utils/amountFormat";
import dtime from "moment";
export default {
  data() {
    return {
      userType: "",
      sevenDay: [],
      sevenDate: [],
      unDoneOrdersTableData: [], //未完成订单列表
      shopTableData: [], //待审核商家列表
      search: "",
      notAuditedCount: "", //未审核商家数
      waitPay: "", //待支付订单数
      waitShipments: "", //待发货订单数
      waitReceiving: "", //待收货订单数
      isPass: "2", //是否通过
      auditRemark: "", //审核备注
      shopId: "", //审核店铺ID
      dialogVisible: false //弹框
    };
  },
  components: {
    tendency
  },
  created() {
    this.getUserInfo();
  },
  mounted() {
    for (let i = 6; i > -1; i--) {
      const date = dtime(new Date().getTime() - 86400000 * i).format(
        "YYYY-MM-DD"
      );
      this.sevenDay.push(date);
    }
  },
  computed: {},
  methods: {
    // 获取用户信息
    getUserInfo() {
      this.axiosReq(this.apis.userInfo, "get").then(res => {
        if (res.status === 200) {
          let userInfo = res.data;
          this.userType = userInfo.userType;
          if (this.userType != 2 && this.userType != 6) {
            this.getshopList(); //待审核商家列表
          }
          if(this.userType != 3)
            this.getSellerNotDoneData(); //未完成订单
        } else {
          this.$message.error(res.message);
        }
      });
    },
    // 获取首页信息
    goHmoe() {
      this.axiosReq(this.apis.home, "get").then(res => {
        if (res.data.status == 200) {
          console.log(res);
        }
      });
    },
    getshopList() {
      //查询待审核的店铺
      let obj = {
        params: {
          applyStatus: 1,
          rows:5,
          page:1
        },
        headers: {}
      };
      this.axiosReq(this.apis.queryShopList, "get", obj).then(res => {
        if (res.status === 200) {
          this.shopTableData = res.data.data.items;
          this.notAuditedCount = res.data.data.total;
        } else {
          this.$message.error(res.message);
        }
      });
    },
    getShopNature(row, column) {
      if (row.shopNature == 1) {
        return "个人";
      } else if (row.shopNature == 2) {
        return "企业";
      } else {
        return "未知";
      }
    },
    getSellerNotDoneData() {
      //查询未完成销售信息
      let url = "";
      if (this.userType == 3) {
        url = this.apis.getCarrieroperatorNotDoneOrders;
      } else {
        url = this.apis.home;
      }
      this.axiosReq(url, "get").then(res => {
        if (res.status === 200) {
          let {
            waitPay,
            waitShipments,
            waitReceiving,
            orderVos,
            unFinishOrderVos
          } = res.data.data.salesStatistics;
          this.waitPay = waitPay; //待支付订单数
          this.waitShipments = waitShipments; //待发货订单数
          this.waitReceiving = waitReceiving; //待收货订单数
          this.unDoneOrdersTableData = unFinishOrderVos;
          let salesVolumeList = []; //销量
          let totalSalesList = []; //销售总额
          orderVos.forEach((currentValue, index, arr) => {
            salesVolumeList.push(orderVos[index].salesVolume);
            totalSalesList.push(orderVos[index].totalSales);
          });
          this.sevenDate.push(totalSalesList, salesVolumeList);
        } else {
          this.$message.error(res.message);
        }
      });
    },
    popDialog(row) {
      //弹出审核窗口并准备数据
      this.isPass='2';
      this.auditRemark = "";
      this.dialogVisible = true;
      this.shopId = row.shopId;
    },
    shopAuditing() {
      //审核商家
      let obj = {
        data: {
          applyStatus: this.isPass,
          shopId: this.shopId,
          refusalReason: this.auditRemark
        },
        headers: {}
      };
      this.axiosReq(this.apis.shopAuditing, "post", obj).then(res => {
        if (res.status === 200) {
          this.$message.success("审核商家成功！");
          this.getshopList();
        } else {
          this.$message.error(res.message);
        }
        this.dialogVisible = false;
      });
    },
    orderStatusFormatter(row) {
      // 订单状态
      let state = row.orderStatus;
      let code = {
        "1": "待支付",
        "2": "待发货",
        "3": "待确认",
        "4": "待评价",
        "5": "待退货",
        "6": "已取消",
        "7": "取消中",
        "8": "保留",
        "9": "已评价",
        "10": "下单失败"
      };
      return code[state];
    },
    amountFormatter(row, column) {
      //金额格式化
      let amount = row[column.property];
      return amountFormat(amount);
    },
    goToShopDetails(row) {
      //跳转到店铺详情
      this.$router.push({
        path: "/checkSellerData",
        query: {
          shopId: row.shopId
        }
      });
    },
    goToShopEdit(row) {
      //跳转到编辑店铺
      this.$router.push({
        path: "/editSellerData",
        query: {
          shopId: row.shopId
        }
      });
    },
    goToOrdersList() {
      //跳转到订单列表
      this.$router.push({
        path: "/orderList"
      });
    },
    goToUnauditedSellerList() {
      //跳转到未审核商家列表
      this.$router.push({
        path: "/unauditedSellerList"
      });
    },
    goToOrdersListByStatus(orderStatus){
      //跳转到订单列表-待支付
      this.$router.push({
        path: "/orderList",
        query: {
          orderStatus: orderStatus
        }
      });
    },
    checkOrderDetails(index, row) {
      //跳转到订单详情
      this.$router.push({
        path: "/orderDetails",
        query: {
          orderId: row.orderId,
          addressId:row.addressId,
          orderStatus: row.orderStatus,
          trackingNum:row.trackingNum
        }
      });
    },
  },
  filters: {
    names(data) {
      if (data == 1) {
        return "待支付";
      } else if (data == 2) {
        return "待发货";
      } else if (data == 3) {
        return "待确认";
      } else if (data == 4) {
        return "待评价";
      } else if (data == 5) {
        return "待退货";
      } else if (data == 6) {
        return "已取消";
      } else if (data == 7) {
        return "取消中";
      } else if (data == 8) {
        return "保留";
      } else if (data == 9) {
        return "已评价";
      }
    }
  }
};
</script>

<style lang="less" scoped>
@import "../style/mixin";
@import "../style/button.css";
.home {
  width: 100%;
  min-height: 100%;
  .asd {
    min-height: 100%;
  }
  .data_section {
    margin-bottom: 40px;
    min-height: 10%;

    .data_list {
      font-size: 16px;
      color: #333;
      border-radius: 6px;
      background: #e5e9f2;
      text-align: center;
      padding: 38px 0;
      .top {
        margin-bottom: 12px;
        span {
          margin-left: 14px;
          font-size: 40px;
        }
      }
      .bottom {
        color: #999;
      }
    }
    .today_head {
      background: #fff;
    }
    .all_head {
      background: #20a0ff;
    }
  }
  .b_t_header {
    padding: 20px;
    font-size: 16px;
    background-color: #fff;
    span {
      display: inline-block;
      vertical-align: middle;
      width: 4px;
      height: 18px;
      background-color: #00ae87;
    }
  }
  .el-table tbody tr:hover > td {
    color: #00ae87;
  }
  .h_tendency_header {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    .h_t_h_left {
      flex: 1;
      width: 100%;
      padding: 20px;
      font-size: 16px;
      background-color: #fff;
      span {
        display: inline-block;
        vertical-align: middle;
        width: 4px;
        height: 16px;
        background-color: #00ae87;
      }
    }
    .h_t_h_right {
      flex: 1;
      width: 100%;
      padding: 4px;
      font-size: 16px;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      background-color: #fff;
      padding-right: 20px;
      .yellow {
        display: inline-block;
        vertical-align: middle;
        width: 20px;
        height: 4px;
        background-color: #fecb4f;
        margin-right: 10px;
      }
      .blue {
        display: inline-block;
        vertical-align: middle;
        width: 20px;
        height: 4px;
        background-color: #5bb3ed;
        margin-right: 10px;
      }
    }
  }
}
.el-button--mini {
  padding: 10px 10px;
}

.wan {
  .sc(16px, #333);
}
.overlay {
    opacity: 0.4;//设置透明度
    pointer-events: none;//禁用点击
}
</style>
