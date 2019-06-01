<template>
  <div class="home">
    <section class="data_section">
      <el-row :gutter="20" style="margin-bottom: 10px;">
        <el-col :span="asd==1? 6 :8" >
          <div class="data_list today_head">
            <div class="top">
              <img src="../../img/首页/icon_待支付.png" alt="">
             <span>{{userCount}}</span>
            </div>
            <div class="bottom">待付款</div>
          </div>
        </el-col>
        <el-col :span="asd==1? 6 :8">
          <div class="data_list today_head">
            <div class="top">
              <img src="../../img/首页/icon_待发货.png" alt="">
             <span> {{userCount}}</span>
            </div>
            <div class="bottom">待发货</div>
          </div>
        </el-col>
        <el-col :span="asd==1? 6 :8">
          <div class="data_list today_head">
            <div class="top">
              <img src="../../img/首页/icon_待收货.png" alt="">
             <span> {{orderCount}}</span>
            </div>
            <div class="bottom">待收货</div>
          </div>
        </el-col>
        <el-col :span="6" v-if="asd == 1">
          <div class="data_list today_head">
            <div class="top">
              <img src="../../img/首页/icon_待收货.png" alt="">
             <span> {{orderCount}}</span>
            </div>
            <div class="bottom">待收货</div>
          </div>
        </el-col>
      </el-row>
      <!-- <el-row :gutter="20" style="margin-left: 11%;margin-right: -10px;width: 100%;">
                <el-col :span="4"><div class="data_list all_head"><span class="data_num head">待发货订单:0</span></div></el-col>
                <el-col :span="4"><div class="data_list all_head"><span class="data_num head">退款善后订单:0</span> </div></el-col>
                <el-col :span="4"><div class="data_list all_head"><span class="data_num head">待查看消息:0</span> </div></el-col>
                <el-col :span="4"><div class="data_list all_head"><span class="data_num head">待提现金额:0</span> </div></el-col>
      </el-row>-->
    </section>

    <!-- 列表 -->
      <div class="b_t_header">
        <span></span>
        未完成订单
      </div>
      <el-table
        :data="tableData.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))"
        :header-cell-style="{background:'#f0f4f5'}"
        stripe
        style="width: 100%; background-color:#f0f4f5;margin-bottom:30px;"
      >
        <el-table-column label="订单号" prop="one" align="center"></el-table-column>
        <el-table-column label="下单时间" prop="date" align="center"></el-table-column>
        <el-table-column label="收货人" prop="name" align="center"></el-table-column>
        <el-table-column label="订单状态" prop="two" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.two=='代付款'" style="color:#00ae87">{{ scope.row.two }}</span>
            <span v-if="scope.row.two=='代发货'" style="color:#fecb4f">{{ scope.row.two }}</span>
            <span v-if="scope.row.two=='代收货'" style="color:#6ebcef">{{ scope.row.two }}</span>
          </template>
        </el-table-column>
        <el-table-column label="交易金额" prop="momey" align="center"></el-table-column>
        <el-table-column label="快递费" prop="kuaidi" align="center"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">查看详情</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="h_tendency_header">
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
    <tendency :sevenDate="sevenDate" :sevenDay="sevenDay"></tendency>
  </div>
</template>

<script>
import headTop from "../components/headTop";
import tendency from "../components/tendency";
import dtime from "moment";
import {
  userCount,
  orderCount,
  getUserCount,
  getOrderCount,
  adminDayCount,
  adminCount
} from "@/api/getData";
export default {
  data() {
    return {
      asd:2,
      userCount: null,
      orderCount: null,
      adminCount: null,
      allUserCount: null,
      allOrderCount: null,
      allAdminCount: null,
      sevenDay: [],
      sevenDate: [[], [], []],

      tableData: [
        {
          date: "2016-05-02",
          name: "王小虎",
          one: "asdasda12533",
          two:'代付款',
          momey:'￥536.64',
          kuaidi:'￥15'
        },
         {
          date: "2016-05-02",
          name: "王小虎",
          one: "asdasda12533",
          two:'代发货',
          momey:'￥536.64',
          kuaidi:'￥15'
        }, {
          date: "2016-05-02",
          name: "王小虎",
          one: "asdasda12533",
          two:'代收货',
          momey:'￥536.64',
          kuaidi:'￥15'
        }, {
          date: "2016-05-02",
          name: "王小虎",
          one: "asdasda12533",
          two:'代付款',
          momey:'￥536.64',
          kuaidi:'￥15'
        }, {
          date: "2016-05-02",
          name: "王小虎",
          one: "asdasda12533",
          two:'代付款',
          momey:'￥536.64',
          kuaidi:'￥15'
        },
      ],
      search: ""
    };
  },
  components: {
    headTop,
    tendency
  },
  mounted() {
    console.log("id");
    // 控制线型图x轴的日期显示
    this.initData();
    for (let i = 6; i > -1; i--) {
      const date = dtime(new Date().getTime() - 86400000 * i).format(
        "YYYY-MM-DD"
      );
      this.sevenDay.push(date);
    }
    this.getSevenData();
  },
  computed: {},
  methods: {
    handleEdit(index, row) {
      console.log(index, row);
    },
    handleDelete(index, row) {
      console.log(index, row);
    },
    async initData() {
      const today = dtime().format("YYYY-MM-DD");
      this.userCount = 1354268;
      this.orderCount = 44;
      this.adminCount = 555;
      this.allUserCount = 55;
      this.allOrderCount = 55;
      this.allAdminCount = 55;
      // Promise.all([userCount(today), orderCount(today), adminDayCount(today), getUserCount(today), getOrderCount(today), adminCount(today)])
      // .then(res => {
      // 	console.log(res)
      // 	this.userCount = res[0].count;
      // 	this.orderCount = res[1].count;
      //     this.adminCount = res[2].count;
      //     this.allUserCount = res[3].count;
      //     this.allOrderCount = res[4].count;
      // 	this.allAdminCount = res[5].count;
      // }).catch(err => {
      // 	console.log(err)
      // })
    },
    async getSevenData() {
      const apiArr = [[], [], []];
      this.sevenDay.forEach(item => {
        apiArr[0].push(userCount(item));
        apiArr[1].push(orderCount(item));
        apiArr[2].push(adminDayCount(item));
      });
      const promiseArr = [...apiArr[0], ...apiArr[1], ...apiArr[2]];
      Promise.all(promiseArr)
        .then(res => {
          const resArr = [[], [], []];
          // console.log('qingqiu')
          // console.log(res)
          res.forEach((item, index) => {
            if (item.status == 1) {
              resArr[Math.floor(index / 7)].push(item.count);
            }
          });
          this.sevenDate = resArr;
          // console.log(this.sevenDay)
        })
        .catch(err => {
          console.log(err);
        });
    },
    async getNews() {}
  }
};
</script>

<style lang="less">
@import "../style/mixin";
.home{
  .data_section {
  margin-bottom: 40px;
  .data_list {
    font-size: 16px;
    color: #333;
    border-radius: 6px;
    background: #e5e9f2;
    text-align: center;
    padding:38px 0;
    .top{
      margin-bottom:12px;
      span{
        margin-left:14px;
        font-size:40px;
      }
    }
    .bottom{
      color:#999
    }
  }
  .today_head {
    background: #fff;
  }
  .all_head {
    background: #20a0ff;
  }
}
.b_t_header{
    width: 100%;
    padding: 20px;
    font-size:16px;
    background-color: #fff;
    span{
      display:inline-block;
      vertical-align:middle;
      width: 4px;
      height: 16px;
      background-color: #00ae87;
    }
  }
  .el-table tbody tr:hover>td {
    color: #00ae87;
  }
  .h_tendency_header{
    display:flex;
    justify-content: flex-start;
    align-items:center;
    .h_t_h_left{
      flex:1;
      width: 100%;
      padding: 20px;
      font-size:16px;
      background-color: #fff;
      span{
        display:inline-block;
        vertical-align:middle;
        width: 4px;
        height: 16px;
        background-color: #00ae87;
      }
    }
    .h_t_h_right{
      flex:1;
      width: 100%;
      padding: 4px;
      font-size:16px;
      display:flex;
      justify-content: flex-end;
      align-items:center;
      background-color: #fff;
      padding-right:20px;
      .yellow{
        display: inline-block;
        vertical-align:middle;
        width: 20px;
        height: 4px;
        background-color: #fecb4f;
        margin-right:10px;
      }
      .blue{
        display: inline-block;
        vertical-align:middle;
        width: 20px;
        height: 4px;
        background-color: #5bb3ed;
        margin-right:10px;
      }
    } 
  }
}

.wan {
  .sc(16px, #333);
}
</style>
