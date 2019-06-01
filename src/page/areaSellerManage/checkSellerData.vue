<template>
    <div class="fillcontain">
        <div class="titleStyle"><span class="pillarStyle">&nbsp;</span>订单详情</div>
        <div class="lineStyle1">
            <el-row style="width:100%">
                <el-col :span="8"><div><div class="attrNameStyle">店铺名称：</div><div class="attrValStyle">{{shopName}}</div></div></el-col>
                <el-col :span="8"><div><div class="attrNameStyle">店铺分类：</div><div class="attrValStyle">{{shopGenre||"未知"}}</div></div></el-col>
            </el-row>
        </div>
        <div class="lineStyle2">
            <el-row style="width:100%">
                <el-col :span="16"><div><div class="attrNameStyle">店铺地址：</div><div class="attrValStyle">{{allAddress+addressDetail}}</div></div></el-col>
            </el-row>
        </div>
        <div class="lineStyle1">
            <el-row style="width:100%">
                <el-col :span="8"><div><div class="attrNameStyle">店铺性质:</div><div class="attrValStyle">{{shopNature == 1 ?"个人":"企业"}}</div></div></el-col>
                <el-col :span="8" v-if="this.shopNature === 2"><div><div class="attrNameStyle">公司名:</div><div class="attrValStyle">{{companyName}}</div></div></el-col>
            </el-row></div>
        <div class="lineStyle2">
            <el-row style="width:100%">
                <el-col :span="8"><div><div class="attrNameStyle">联系人:</div><div class="attrValStyle">{{contactName}}</div></div></el-col>
                <el-col :span="8"><div><div class="attrNameStyle">联系电话:</div><div class="attrValStyle">{{contactPhone}}</div></div></el-col>
            </el-row></div>
        <div class="lineStyle1">
            <el-row style="width:100%">
                <el-col :span="8"><div><div class="attrNameStyle">申请时间:</div><div class="attrValStyle">{{applyTime}}</div></div></el-col>
                <el-col :span="8"><div><div class="attrNameStyle">审核时间:</div><div class="attrValStyle">{{auditTime}}</div></div></el-col>
            </el-row></div>
        <div class="imgArea">
            <el-row style="width:100%">
                <el-col :span="2"><div><div class="attrNameStyle">图片信息:</div></div></el-col>
                <el-col :span="6">
                    <div>
                      <div class="attrNameStyle" style="width:100%;padding:5px 0;margin-left: 11px;">1.店铺图片:</div>
                      <div  style="width:100%">
                            <img :src="shopImgUrl" alt="暂无" class="imgStyle">
                      </div>
                    </div>
                </el-col>
                <el-col :span="10" style="display:flex;justify-contetn:left;">
                    <div>
                       <div class="attrNameStyle" style="width:100%;padding:5px 0;">2.营业执照:</div>
                       <div style="width:100%">
                           <img :src="bussinessLicenseUrl" alt="暂无" class="imgStyle">
                       </div>
                    </div>
                </el-col>
            </el-row>
            <div style="width:100%;text-align:center;padding:30px 0;">
                <el-button plain @click="returnShopList">返回</el-button>
            </div>
            
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return {
            shopName:"",//店铺名称
            shopGenre:"",//店铺分类
            shopNature:"",//店铺性质
            contactName:"",//联系人
            contactPhone:"",//联系电话
            applyTime:"",//申请时间
            auditTime:"",//审核时间
            shopImgUrl:"",//店铺照片
            bussinessLicenseUrl:"",//营业执照
            companyName:"",//公司名称
            provinceId:"",//省份ID
            cityId:"",//城市ID
            districtId:"",//区ID
            villageId:"",//村ID
            addressDetail:"",//详细地址
            allAddress:"",//店铺地址
        }
    },
    created(){
        this.getSellerDetails();
    },
    methods:{
        getSellerDetails(){
            //获取店铺信息
            let obj= {
                params:{
                    "shopId": this.$route.query.shopId
                }
            }
            this.axiosReq(this.apis.getSellerDetails,"get",obj).then(res =>{
                if(res.status === 200){
                    let{shopName,provinceId,cityId,districtId,villageId,addressDetail,
                        shopNature,firstClassifyName,secondClassifyName,thirdClassifyName,
                        contactName,contactPhone,shopImgUrl,bussinessLicenseUrl,applyDate,createdDate,companyName
                    } = res.data.data;
                    this.shopName = shopName;//店铺名称
                    this.shopGenre = `${firstClassifyName}/${secondClassifyName}/${thirdClassifyName}`;//店铺分类
                    this.provinceId = provinceId;//省份ID
                    this.cityId = cityId;//城市ID
                    this.districtId = districtId;//区ID
                    this.villageId = villageId;//村ID
                    this.shopNature = shopNature;//店铺性质
                    this.addressDetail = addressDetail,//详细地址
                    this.contactName = contactName;//联系人
                    this.contactPhone = contactPhone;//联系电话
                    this.applyTime = applyDate;//申请时间
                    this.auditTime = createdDate;//审核时间
                    this.shopImgUrl = shopImgUrl;//店铺照片
                    this.companyName = companyName;//公司名称
                    this.bussinessLicenseUrl = bussinessLicenseUrl;//营业执照
                    this.getAddressDetail();
                }else{
                    this.$message.error(res.message);
                }
            });
        },
        getAddressDetail(){
            let obj = {
                params:{
                    "ids":`${this.provinceId},${this.cityId},${this.districtId},${this.villageId}`
                }
            }
            this.axiosReq(this.LOCAL+this.apis.getAddressDetail,"get",obj).then(res =>{
                if(res.status === 200){
                    if(res.data.data.district.districtName)
                        this.allAddress = res.data.data.city.provinceName+res.data.data.city.cityName+res.data.data.district.districtName;
                    else
                        this.allAddress = res.data.data.city.provinceName+res.data.data.city.cityName;
                }else{
                    this.$message.error(res.message);
                }
            })
        },
        returnShopList(){
            //返回列表页
            this.$router.go(-1);
        },
    },
}
</script>
<style lang="less" scoped>
.fillcontain{
  background: #f0f4f5
}
.pillarStyle{
    // 绿条
    border-left: solid #00ae87 4px;
    margin-left: 18px;
    height: 20px;
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
.lineStyle1{
    display:flex;
    display: -webkit-flex;
    align-items: center;
    height: 50px;
    background-color: #f0f4f5;
    font-size: 14px;
}
.lineStyle2{
    display:flex;
    display: -webkit-flex;
    align-items: center;
    height: 50px;
    background-color: #ffffff;
    font-size: 14px;
}
.imgArea{
    background-color: #ffffff;
    font-size: 14px;
    padding: 20px 0;
}
.attrNameStyle{
    margin-left: 18px;
    width: 80px;
    display: inline-block;
    color: #999999;
}
.attrValStyle{
    margin-left: 50px;
    display: inline-block;
    font-size: 15px;
}
.imgStyle{
    width: 180px;
    height: 180px;
    margin-left: 11px;
}
</style>
