<template>
    <div class="fillcontain">
        <!-- 订单详情 -->
        <div class="blockArea">
            <div class="titleStyle"><span class="pillarStyle">&nbsp;</span>订单详情</div>
            <div class="orderDetails">
                <div>订单号：<span style="font-size:24px;margin-right:60px;">{{orderNum}}</span> 订单状态：<span style="font-size:24px">{{orderStatusFormatter(orderStatus)}}</span></div> 
                <div v-if="orderStatus===1&&integralAmount<=0">
                    待支付: <span style="font-size:24px;color:#ff5959">{{sumAmount}}</span>
                    <el-button type="success" @click="dialogFormVisible = true" style="margin:0 29px 0 56px;">修改价格</el-button>
                </div>
                <div v-if="orderStatus===2">
                    <el-button type="success" @click="dialogExpressVisible = true" style="margin:0 29px 0 56px;">发货</el-button>
                </div>
                <div v-if="orderStatus===7">
                    <el-button type="success" style="margin:0 5px 0 56px;" @click="decideCancel(6)">同意取消</el-button>
                    <el-button type="danger" style="margin:0 29px 0 5px;" @click="decideCancel(2)">拒绝取消</el-button>
                </div>


                <el-dialog title="修改价格" :visible.sync="dialogFormVisible" center width="20%">
                    <el-form :model="editPriceform" ref="editPriceform" :rules="priceRules" center>
                        <el-form-item label="当前价格：" :label-width="formLabelWidth">
                            <span style="font-size:24px">{{discountPrice}}</span>
                        </el-form-item>
                        <el-form-item label="折扣价：" :label-width="formLabelWidth" prop="discountPrice">
                            <el-input size="large" v-model="editPriceform.discountPrice" autocomplete="off" style="width:200px;font-size:16px" clearable></el-input>
                        </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="dialogFormVisible = false">取 消</el-button>
                        <el-button type="primary" @click="onSubmit" :disabled="confirmDisabled">确 定</el-button>
                    </div>
                </el-dialog>


                <el-dialog title="发货" :visible.sync="dialogExpressVisible" center width="20%">
                    <el-form :model="mailForm" ref="mailForm" :rules="mailRules" center>
                        <el-form-item label="快递公司：" :label-width="formLabelWidth" required>
                            <el-select v-model="sellerCourierId" placeholder="请选择物流公司">
                                <el-option
                                    v-for="item in mailList"
                                    :key="item.kdCode"
                                    :label="item.kdName"
                                    :value="item.kdCode">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="快递单号：" prop="expressNum" :label-width="formLabelWidth">
                            <el-input size="large" placeholder="填写快递单号" v-model="mailForm.expressNum" autocomplete="off" style="width:200px;font-size:14px" clearable></el-input>
                        </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="dialogExpressVisible = false">取 消</el-button>
                        <el-button type="primary" @click="confirmSend('mailForm')" >确 定</el-button>
                    </div>
                </el-dialog>
            </div>
        </div>
        <div class="blockArea orderData">
            <div style="width:49%;" >
                <!-- 订单信息 -->
                <div class="titleStyle"><span class="pillarStyle">&nbsp;</span>订单信息</div>
                <div class="dataAreaBgColor">
                    <div class="lineOne">
                        <div style="width:50%"><div class="orderDataLine">订单号：</div>{{orderNum}}</div> 
                        <div style="width:50%"><div class="orderDataLine">下单时间：</div>{{createdDate}}</div>
                    </div>
                    <div class="lineTwo">
                        <div style="width:50%"><div class="orderDataLine">买家：</div>{{nickName}}</div> 
                        <div style="width:50%"><div class="orderDataLine">消耗积分：</div>{{integralAmount}}</div> 
                    </div>
                    <div class="lineOne">
                        <div style="width:50%"><div class="orderDataLine">订单金额：</div>{{discountPrice}}</div> 
                        <div style="width:50%"><div class="orderDataLine">快递费：</div>{{courierFees}}</div> 
                    </div>
                    <div class="lineTwo">
                        <div style="width:50%"><div class="orderDataLine">支付方式：</div>{{paymentChannel||"其他"}}</div> 
                        <div style="width:50%"><div class="orderDataLine">快递方式：</div>{{courierName||"暂无"}}</div> 
                    </div>
                </div>
            </div>
            <div style="width:49%;">
                 <!-- 发货信息 -->
                <div class="titleStyle"><span class="pillarStyle">&nbsp;</span>发货信息</div>
                <div class="dataAreaBgColor">
                    <div class="lineOne" >
                        <div class="mailDataLine">收货人：</div>{{contact}}
                    </div>
                    <div class="lineTwo">
                        <div class="mailDataLine">电话：</div>{{phone}}
                    </div>
                    <div class="lineOne">
                        <div class="mailDataLine">地址：</div>{{addressDetails}}
                    </div>
                    <div class="lineTwo">
                        <div class="mailDataLine">邮编：</div>暂无
                    </div>
                </div>
            </div>
        </div>
        <!-- 物流信息 -->
        <div class="blockArea" v-if="orderStatus > 2">
            <div class="titleStyle"><span class="pillarStyle">&nbsp;</span>物流信息</div>
            <div class="titleStyle mailData">
                <span>物流公司：</span><span>{{sellerCourierName||"暂无"}}</span><span style="margin-left:60px;">运单号码：</span><span>{{trackingNum||"暂无"}}</span>
            </div>
            <div class="dataAreaBgColor" style="padding:20px 18px;">
                <div style="font-size:14px;">物流跟踪：</div>
                <div class="mailStep">
                    <el-steps direction="vertical" :active="nowStep">
                        <el-step v-for="(item, index) in mailSteps" :key="index">
                            <i :class="stepStyle(index)" slot="icon"></i>
                            <span slot="title" >{{item.time}}</span>
                            <span slot="description">{{item.status}}</span>
                        </el-step>
                    </el-steps>
                </div>
            </div>
        </div>
        <!-- 商品信息 -->
        <div class="blockArea">
            <div class="titleStyle"><span class="pillarStyle">&nbsp;</span>商品信息</div>
            <div class="dataAreaBgColor">
                <template>
                    <el-table
                    :data="tableData"
                    :header-cell-style="{background:'#f0f4f5'}"
                    style="width: 100%">
                        <el-table-column align="center"
                            label="商品">
                             <template slot-scope="scope">
                                 <div style="display:flex;display:-webkit-flex;align-items: center;justify-content: flex-start;">
                                     <img :src= scope.row.imgUrl alt="获取失败" style="width: 30%;">
                                     <span style="padding:5px;text-align:left;">{{scope.row.name}}</span>
                                 </div>
                            </template>
                        </el-table-column>
                        <el-table-column align="center"
                            label="商品标签">
                             <template slot-scope="scope">
                                 <div style="display:flex;display:-webkit-flex;align-items: center;justify-content: center;">
                                     <span style="padding:5px;text-align:left;" v-if="scope.row.commodityArea == 0">普通商品</span>
                                     <span style="padding:5px;text-align:left;" v-if="scope.row.commodityArea == 1">生态商品</span>
                                     <span style="padding:5px;text-align:left;" v-if="scope.row.commodityArea == 2">一村一品</span>
                                     <span style="padding:5px;text-align:left;" v-if="scope.row.commodityArea == 3">会员商品</span>
                                     <span style="padding:5px;text-align:left;" v-if="scope.row.commodityArea == 4">积分商品</span>
                                 </div>
                            </template>
                        </el-table-column>
                        <el-table-column align="center"
                            prop="specificationName"
                            label="规格">
                        </el-table-column>
                        <el-table-column align="center"
                            prop="unitPrice" :formatter="amountFormatter"
                            label="单价">
                            <template slot-scope="scope">
                                 <div style="display:flex;display:-webkit-flex;align-items: center;justify-content: center;">
                                     <span style="padding:5px;text-align:left;" v-if="scope.row.commodityArea == 4">{{scope.row.unitPrice+" 积分"}}</span>
                                     <span style="padding:5px;text-align:left;" v-else>{{getAmountFormat(scope.row.unitPrice)}}</span>
                                 </div>
                            </template>
                        </el-table-column>
                        <el-table-column align="center"
                            prop="quantity"
                            label="数量">
                        </el-table-column>
                        <el-table-column align="center"
                            label="小计">
                             <template slot-scope="scope">
                                 <div style="display:flex;display:-webkit-flex;align-items: center;justify-content: center;">
                                     <span v-if="scope.row.commodityArea == 4">{{scope.row.quantity*scope.row.unitPrice+" 积分"}}</span>
                                     <span v-else>{{getAmountFormat(scope.row.quantity*scope.row.unitPrice)}}</span>
                                 </div>
                            </template>
                        </el-table-column>
                    </el-table>
                </template>
            </div>

        </div>
    </div>
</template>
<script>
import {amountFormat} from "../../utils/amountFormat";

export default {
    data() {
        var checkPrice = (rule, value, callback) => {
            if (value) {
                if(!this.amountTem.test(value)||value<=0)
                    {
                        callback(new Error('输入价格有误！'));
                        this.confirmDisabled = true;
                    }
                else this.confirmDisabled = false;
            }
        };

        return {
            tableData: [],
            dialogFormVisible: false,
            dialogExpressVisible: false,
            value:"",
            nowStep:1,
            editPriceform: {
                discountPrice: '',
            },
            priceRules: {
                discountPrice: [
                    { validator: checkPrice, trigger: 'change' }
                ],
            },
            mailRules: { 
                expressNum: [
                    { required: true, message: '请输入快递单号', trigger: 'blur' },
                ],
            },
            mailForm: {
                expressNum:"",// 快递单号(输入)
            },
            formLabelWidth: '120px',
            orderNum:"",//订单号
            createdDate:"",//下单时间
            orderStatus:"",//订单状态
            nickName:"",//买家昵称
            name:"",//商品名称
            quantity:"",//数量
            unitPrice:"",//单价
            imgUrl:"",//图片路径
            discountPrice:"",//订单总额
            courierFees:"",//邮费,
            orderDetails:""	,
            amountTem: /^(([1-9]\d*)|\d)(\.\d{1,2})?$/,//价格正则表达式
            confirmDisabled:true, //修改价格确定按钮是否可用
            mailList:[], //快递列表
            paymentChannel: "",//交易渠道(0:支付宝；1：微信)
            courierName:"",//快递公司
            courierId:"",//快递公司id 
            trackingNum:"",//快递单号(查询)
            commodityVos:"",//商品列表
            addressInfo:"",//收货地址
            contact:"",//联系人
            phone:"",//联系电话
            mailStatus:"",
            addressDetails:"",//全部地址
            sellerCourierId:"",//卖家发货快递ID
            sellerCourierName:"",//卖家发货快递名称
            cashAmount:"",//消耗的现金总额
            ventureAmount:"",//消耗的基金总额
            hongbaoAmount:"",//消耗的红包总额
            cashBalance:"",//消耗的余额
            integralAmount:"",//消耗的积分
            userId:"",//用户ID
            id:"",//用户ID
            mailSteps:[]
        }
    },
created() {
    this.initData();
  },
    methods: {
      initData(){
        this.getOrderDetails();//获取订单详情
        if( this.$route.query.orderStatus===2){
            this.sellerCourierId = this.courierId;
            this.getMailList();//获取快递列表
        }else if(this.$route.query.orderStatus>2 && this.$route.query.trackingNum){
            this.getLogistics(this.$route.query.trackingNum,this.$route.query.sellerCourierName);//查询快递物流信息
        }
        this.getAddress();//获取收货地址
      },


      getOrderDetails(discountPrice){
        //请求订单详情(更改价格)
          let obj = {
              data:{
                  "orderId":this.$route.query.orderId,
                  "discountPrice":discountPrice,
                }
          }
        this.axiosReq(this.apis.getOrderDetails,"post",obj).then(res =>{
            //请求订单详情
            if(res.status === 200){
                this.orderDetails = res.data.data[0];
                let {orderNum,
                    createdDate,
                    orderStatus,
                    nickName,
                    name,
                    quantity,
                    unitPrice,
                    imgUrl,
                    discountPrice,
                    courierFees,
                    paymentChannel,
                    trackingNum,
                    sumAmount,
                    courierName,
                    sellerCourierName,
                    commodityVos,
                    cashAmount,ventureAmount,hongbaoAmount,cashBalance,integralAmount,userId,id} = this.orderDetails;
                this.orderNum=orderNum;//订单号
                this.createdDate=createdDate;//下单时间
                this.orderStatus=orderStatus;//订单状态
                this.nickName=nickName;//买家昵称
                this.name=name;//商品名称
                this.quantity=quantity;//数量
                this.unitPrice=unitPrice;//单价
                this.imgUrl=imgUrl;//图片路径
                this.discountPrice=amountFormat(discountPrice);//订单总额
                this.courierFees=amountFormat(courierFees);//邮费
                this.paymentChannel = this.paymentChannelFormat(paymentChannel);
                this.courierName = courierName	;//快递公司
                this.sellerCourierName = sellerCourierName;//卖家发货快递公司
                this.trackingNum = trackingNum;//快递单号
                this.commodityVos = commodityVos;//商品列表
                this.sumAmount = amountFormat(sumAmount);//支付总额
                this.cashAmount = cashAmount;
                this.ventureAmount = ventureAmount;
                this.hongbaoAmount = hongbaoAmount;
                this.cashBalance = cashBalance;
                this.integralAmount =integralAmount;
                this.userId = userId;
                this.id = id;   
                this.tableData = this.commodityVos;
            }else{
                this.$message.error(res.message);
            }
        });
      },
      getAddress(){
        //获取发货信息
        let obj = {
            params:{
                addressId:this.$route.query.addressId
            }
        }
        this.axiosReq(this.apis.getAddress,"get",obj).then(res =>{
            if(res.status === 200){
                this.addressInfo = res.data.data;
               let {
                   contact,phone,provinceName,cityName,districtName,detailAddress
               } = this.addressInfo;
               this.addressDetails = provinceName+cityName+districtName+detailAddress;
               this.contact = contact;
               this.phone = phone;
            }else{
                this.$message.error(res.message);
            }
        });
      },
    getLogistics(trackingNum,expressName){
        //获取物流信息
        let obj = {
            params:{
                "no":trackingNum,
                "expressName":expressName
            }
        }
        this.axiosReq(this.apis.getLogistics,"get",obj).then(res=>{
            if(res.status === 200){
                this.mailSteps = res.data.data.result.list;
            }else{
                this.$message.error(res.message);
            }
        })
    },
    orderStatusFormatter(orderStatus){
      // 订单状态
      let state = orderStatus;
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
        "10":"下单失败"
      }
      return code[state];
    },
    mailStatusFormat(mailStatus){
        let mailCode = {"0":"在途中","1":"已揽收","2":"疑难","3":"已签收","4":"退签","5":"同城派送中","6":"退回","7":"转单"}
        return mailCode[mailStatus];
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
    paymentChannelFormat(payment){
        let paymentCode = {"0":"支付宝","1":"微信"}
        return paymentCode[payment];
    },
    stepStyle(index){
        if(index != 0)
            return "iconfont icon-icon_shijianzhou1";
        else 
            return "iconfont icon-icon_shijianzhou";
    },
    getMailList(){
        //获取快递列表
        this.axiosReq(this.LOCAL+this.apis.getMailList,"get").then(res =>{
            //请求快递信息列表
            if(res.status === 200){
                this.mailList = res.data.data;
            }else{
                this.$message.error(res.message);
            }
        });
    },

    // 修改价格
    onSubmit(){
        this.dialogFormVisible = false;
        this.getOrderDetails(this.editPriceform.discountPrice);
    },

    confirmSend(formName){
        //确认发货
            this.$refs[formName].validate((valid) => {
            if (valid) {
                this.submitSend();
            } else {
                return false;
            }
        });
        
    },
    decideCancel(isCancel){
        let obj = {
            data:{
                "userId":this.userId,
                "walletType":4,
                "orderId":this.$route.query.orderId,
                "orderNum":this.orderNum,
                "orderStatus":isCancel,
                "moneyAmounts":[{
                    "hongbaoAmount":this.hongbaoAmount,
                    "cashBalance":this.cashBalance,
                    "cashAmount":this.cashAmount,
                    "ventureAmount":this.ventureAmount,
                }],
            }
        }
        this.axiosReq(this.apis.shopAudit,"post",obj).then(res =>{
            //请求订单详情
            if(res.status === 200){
                this.$message.success('审核成功！');
                this.initData();
            }else{
                this.$message.error(res.message);
            }
        });
    },
    submitSend(){
        //确认发货
        this.dialogExpressVisible = false;
        let mailObj = {};
        if(this.mailList.length){
            mailObj = this.mailList.find((item)=>{
                return item.kdCode == this.sellerCourierId;
            });
            this.sellerCourierName = mailObj.kdName;
        }
        let obj={
            data:{
                "orderId":this.$route.query.orderId,
                "sellerCourierId":this.sellerCourierId,
                "sellerCourierName":this.sellerCourierName,
                "trackingNum":this.mailForm.expressNum
            },
        }
        this.axiosReq(this.apis.updateKuaiDi,"post",obj).then(res =>{
            if(res.status === 200){
                this.$message.success('发货成功！');
                this.getOrderDetails();
            }else{
                this.$message.error(res.message);
            }
        });
    }
  },
}
</script>

<style lang="less" scoped>
.pillarStyle{
    // 绿条
    border-left: solid #00ae87 4px;
    font-size: 16px;
    margin-left: 18px;
    height: 20px;
}
.dataAreaBgColor{
    background-color: #ffffff;
}
.blockArea{
    // 模块
    width:100%;
    margin:10px 0;
}
.titleStyle{
    // 区域标题
    display:flex;
    display: -webkit-flex;
    align-items: center;
    height: 40px;
    background-color: #ffffff;
    font-size: 15px;
}
.el-step__title {
    font-size: 13px;
    line-height: 30px;
}
  .el-row {
    margin-bottom: 1px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .el-col {
    border-radius: 4px;
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-purple {
    background: #ffffff;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 30px;
    font-size: 14px;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
.el-steps--vertical {
    height: 100%;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -ms-flex-flow: column;
    flex-flow: column;
    width: 60%;
}
.el-dialog__header {
    padding: 20px 20px 10px;
    background-color:#f0f4f5;
}
.lineOne{
    //横条1
    display: flex;
    display: -webkit-flex;
    align-items: center;
    background-color:#f0f4f5;
    padding:13px 0px 13px 18px;
    font-size: 14px;
}
.lineTwo{
    //横条2
    display: flex;
    display: -webkit-flex;
    align-items: center;
    background-color:#ffffff;
    padding:13px 0px 13px 18px;
    font-size: 14px;
}
.orderDetails{
    //订单详情区域
    background:rgba(255,199,89,0.2);
    padding:50px 0px 50px 18px;
    display:flex;
    display: -webkit-flex;
    align-items:center;
    justify-content:space-between;
}
.orderData{
    //订单信息和发货信息区域
    width:100%;
    display:flex;
    display: -webkit-flex;
    justify-content:space-between;
}
.orderDataLine{
    //订单信息和发货信息行
    width:20%;
    display:inline-block;
}
.mailData{
    //物流信息
    background-color:#f0f4f5;
    font-size:14px;
    margin-left:19px;
}
.mailDataLine{
    //订单信息和发货信息行
    width:10%;
    display:inline-block;
}
.mailStep{
    //物流跟踪
    display:flex;
    display: -webkit-flex;
    justify-content:center;
    width:100%;
}
.iconfont {
    font-family: "iconfont" !important;
    font-size: 12px;
    font-style: normal;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}
</style>
