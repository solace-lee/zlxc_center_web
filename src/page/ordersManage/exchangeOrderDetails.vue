<template>
    <div class="fillcontain">
        <!-- 订单详情 -->
        <div class="blockArea">
            <div class="titleStyle"><span class="pillarStyle">&nbsp;</span>订单详情</div>
            <div class="orderDetails">
                <div>订单号：<span style="font-size:24px;margin-right:60px;margin-left:20px;">{{orderNum}}</span>换货单状态:<span style="font-size:24px;margin-left:20px;">{{orderStatusFormatter(refundStatus)}}</span></div> 
                <div  v-if="refundStatus===0">
                    <el-button type="success" @click="passAudit()" style="margin:0 5px 0 50px;">审核通过</el-button>
                    <el-button type="danger" plain  @click="dialogFormVisible = true" style="margin:0 20px 0 30px;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;拒绝&nbsp;&nbsp;&nbsp;&nbsp;</el-button>
                </div>
                <div  v-if="refundStatus===2">
                    <el-button type="success" @click="confirmReceive()" style="margin:0 50px 0 50px;">确认收货</el-button>
                </div>
                <div  v-if="refundStatus===9">
                    <el-button type="success" @click="dialogExpressVisible = true" style="margin:0 50px 0 50px;">发货</el-button>
                </div>
                <!-- 拒绝换货弹框 -->
                <el-dialog title="拒绝换货原因" :visible.sync="dialogFormVisible" center width="20%">
                    <el-form :model="form" ref="form" :rules="reasonRules" center>
                        <el-form-item label="拒绝原因：" :label-width="formLabelWidth" prop="refuseReason">
                            <el-input type="textarea" autosize size="large" placeholder="拒绝原因" v-model="form.refuseReason" autocomplete="off" style="width:200px;font-size:14px" clearable></el-input>
                        </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="dialogFormVisible = false">取 消</el-button>
                        <el-button type="primary" @click="refusePass" :disabled="confirmDisabled">确 定</el-button>
                    </div>
                </el-dialog>                
                <!-- 卖家重新发货 -->
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
            <div style="width:100%;" >
                <!-- 订单信息 -->
                <div class="titleStyle"><span class="pillarStyle">&nbsp;</span>订单信息</div>
                <div class="dataAreaBgColor">
                    <div class="lineOne">
                        <div style="width:20%">退款编号：<span style="margin-left:20px;">{{orderRefundNo||"暂无"}}</span></div> 
                        <div style="width:20%">申请时间：<span style="margin-left:20px;">{{createTime||"暂无"}}</span></div>
                        <div style="width:25%">合计金额：<span style="color:#ff5959;font-size:14px;margin-left:20px;">{{sumAmount}}</span> </div> 
                    </div>
                    <div class="lineTwo">
                        <div style="width:20%">收货人：<span style="font-size:14px;margin-left:20px;">{{contact}}</span> </div> 
                        <div style="width:20%">联系电话：<span style="font-size:14px;margin-left:20px;">{{phone}}</span> </div> 
                        <div style="width:60%">买家地址：<span style="font-size:14px;margin-left:20px;">{{addressDetails}}</span> </div> 
                    </div>
                    <div class="lineOne">
                        <div style="width:6%;">换货原因：</div> 
                        <p>{{refundDesc}}</p>
                    </div>
                </div>
            </div>
        </div>
        <!-- 物流信息 -->
        <div class="blockArea"  v-if="[2,5,6,9].includes(refundStatus)" style="display:flex;">
            <div style="width:100%">
                <div class="titleStyle"><span class="pillarStyle">&nbsp;</span>物流信息</div>
                <div class="titleStyle mailData">
                    <span>物流公司：</span><span>{{courierName||"暂无"}}</span><span style="margin-left:60px;">运单号码：</span><span>{{trackingNum||"暂无"}}</span>
                </div>
                <div class="dataAreaBgColor" style="padding:20px 18px;">
                    <div style="font-size:14px;">物流跟踪：</div>
                    <div class="mailStep">
                        <el-steps direction="vertical" :active="nowStep">
                            <el-step v-for="(item, index) in mailSteps" :key="index">
                                <i :class="stepStyle(index)" slot="icon"></i>
                                <span slot="title">{{item.time}}</span>
                                <span slot="description">{{item.status}}</span>
                            </el-step>
                        </el-steps>
                    </div>
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
                                 <div style="display:flex;display:-webkit-flex;align-items: center;justify-content:  flex-start;">
                                     <img :src= scope.row.imgUrl alt="" style="width: 30%;">
                                     <span style="padding:5px;text-align:left;">{{scope.row.name}}</span>
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
                        </el-table-column>
                        <el-table-column align="center"
                            prop="quantity"
                            label="数量">
                        </el-table-column>
                        <el-table-column align="center"
                            label="小计">
                             <template slot-scope="scope">
                                 <div style="display:flex;display:-webkit-flex;align-items: center;justify-content: center;">
                                     <span>{{getAmountFormat(scope.row.quantity*scope.row.unitPrice)}}</span>
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
        var checkReason = (rule, value, callback) => {
            if (!value ) {
                callback(new Error('请输入拒绝原因！'));
                this.confirmDisabled = true;
            }
            else this.confirmDisabled = false;
        };
        return {
            mailRules: { 
                expressNum: [
                    { required: true, message: '请输入快递单号', trigger: 'blur' },
                ],
            },
            mailForm: {
                expressNum:"",// 快递单号(输入)
            },
            tableData: [],   
            nowStep:1,
            orderDetails:"",//订单详情
            orderRefundNo:"",//退换单号
            orderNum:"",// 订单号
            createTime:"",//下单时间
            refundStatus:"",//订单状态
            sumAmount:"",//支付总额（包括快递费）
            cause:"",//退货原因
            refundDesc:"",//退换货描述
            refundPrice:"",//退款金额
            commodityVos:"",//商品列表
            cashAmount:"",//消耗的现金总额
            ventureAmount:"",//消耗的基金总额
            hongbaoAmount:"",//消耗的红包总额
            cashBalance:"",//消耗的余额
            userId:"",//用户ID
            id:"",//退换单id
            refundType:"",//退换类型 1退2换
            confirmDisabled:true, //拒绝原因确定按钮是否可用
            dialogFormVisible: false,//审核弹框是否显示
            dialogExpressVisible: false,//发货快递弹框
            sellerCourierId:"",//卖家发货快递ID
            sellerCourierName:"",//卖家发货快递名称
            mailList:[], //快递列表
            formLabelWidth: '120px',
            form: {
                refuseReason: '',//拒绝原因
            },
            reasonRules: {
                refuseReason: [
                    { validator: checkReason, trigger: 'blur' }
                ],
            },
            courierName:"",//快递公司
            trackingNum:"",//快递单号(查询)
            mailSteps:[],
            contact:"",//联系人
            phone:"",//联系电话
            addressDetails:"",//全部地址
        }
    },
    created() {
        this.initData();
    },
    methods: {
       initData(){
        this.getOrderDetails();//获取订单详情
        this.getAddress();//查询用户收货信息
        if(this.$route.query.refundStatus==9){
            this.getMailList();//获取快递列表
        }
        if(this.$route.query.trackingNum){
            this.trackingNum = this.$route.query.trackingNum;
            this.courierName = this.$route.query.sKuaidiName;
        }else{
            this.trackingNum = this.$route.query.sendTrackingNum;
            this.courierName = this.$route.query.uKuaidiName;
        }
        if(![0,4,3,7,8].includes(this.$route.query.refundStatus))
            this.getLogistics(this.trackingNum,this.courierName);
      },
      getOrderDetails(){
        this.axiosReq(`${this.apis.queryOrderRefundDetails}/${this.$route.query.id}`,"get").then(res =>{
            //请求订单详情
            if(res.status === 200){
                this.orderDetails = res.data.data[0];
                let{orderRefundNo,orderNum,createTime,refundStatus,sumAmount,cause,refundDesc,refundPrice,commodityVos,
                    cashAmount,ventureAmount,hongbaoAmount,cashBalance,userId,id,refundType
                } = this.orderDetails;
                this.orderRefundNo = orderRefundNo;
                this.userId = userId;
                this.id = id;
                this.orderNum = orderNum;
                this.createTime = createTime;
                this.refundStatus = refundStatus;
                this.sumAmount = amountFormat(sumAmount);
                this.cause = cause;
                this.refundDesc = refundDesc;
                this.refundPrice = refundPrice;
                this.commodityVos = commodityVos;
                this.tableData = this.commodityVos;
                this.refundType = refundType;
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
      orderStatusFormatter(orderStatus){
      // 订单状态
      let state = orderStatus;
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
      return code[state] || "未知";
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
    stepStyle(index){
        if(index != 0)
            return "iconfont icon-icon_shijianzhou1";
        else 
            return "iconfont icon-icon_shijianzhou";
    },
      passAudit(){
          this.submitAudit(4);
      },
      refusePass(){
        this.dialogFormVisible = false;
          this.submitAudit(3);
      },
      submitAudit(refundStatus){
          //提交审核
        let obj={
            // 3=已拒绝，4=审核通过
            data:{
                "id":this.$route.query.id,
                "refundStatus":refundStatus,
                "refuseDesc":this.form.refuseReason
            },
            headers:{}
        }
        this.axiosReq(this.apis.updateShopRefund,"post",obj).then(res =>{
            //请求订单详情
            if(res.status === 200){
                this.$message.success('审核成功！');
                this.initData();
            }else{
                this.$message.error(res.message);
            }
        });
      },
        confirmReceive(){
            //确认收货
            let obj={
                data:{
                    "userId":this.userId,
                    "walletType":4,
                    "id":this.id,
                    "orderNum":this.orderNum,
                    "refundType":this.refundType,
                    "moneyAmounts":[{
                        "hongbaoAmount":this.hongbaoAmount,
                        "cashBalance":this.cashBalance,
                        "cashAmount":this.cashAmount,
                        "ventureAmount":this.ventureAmount,
                    }],
                },
                headers:{}
            }
            this.axiosReq(this.apis.confirmReceive,"post",obj).then(res =>{
                //请求订单详情
                if(res.status === 200){
                    this.$message.success('确认收货成功！');
                    this.initData();
                }else{
                    this.$message.error(res.message);
                }
            });
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
                    "sKuaidiId":this.sellerCourierId,
                    "trackingNum":this.mailForm.expressNum,
                    "sKuaidiName":this.sellerCourierName,
                    "id":this.id
                },
            }
            this.axiosReq(this.apis.shopRefundLogistics,"post",obj).then(res =>{
                if(res.status === 200){
                   this.$message.success('发货成功！');
                   this.getOrderDetails();
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
    },
    watch:{
        refundStatus(val){
            if(val == 9){
                this.getMailList();//获取快递列表
            }
        }
    }
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
.mailData{
    //物流信息
    background-color:#f0f4f5;
    font-size:14px;
    margin-left:19px;
}
.mailStep{
    //物流跟踪
    display:flex;
    display: -webkit-flex;
    justify-content:center;
    width:100%;
}
</style>
