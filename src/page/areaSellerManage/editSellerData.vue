<template>
    <div class="fillcontain">
        <div class="titleStyle"><span class="pillarStyle">&nbsp;</span>编辑店铺</div>
        <div class="lineStyle1">
            <el-row style="width:100%">
                <el-col :span="8"><div><div class="attrNameStyle">店铺信息：</div></div></el-col>
            </el-row>
        </div>
        <div class="lineStyle2">
            <el-form :model="shopInfoForm" :rules="rules" ref="shopInfoForm" label-width="100px" class="shopInfoFormStyle">
                <el-form-item label="店铺名称：" prop="shopName">
                    <el-input v-model="shopInfoForm.shopName" placeholder="请输入店铺名称"></el-input>
                </el-form-item>
                <el-form-item label="省市区：" prop="provinceId" required >
                        <el-select v-model="shopInfoForm.provinceId" placeholder="请选择省份" disabled
                            @focus="getProvinceList()">
                            <el-option
                            v-for="(item, index) in shopInfoForm.provinceOptions"
                            :key="index"
                            :label="item.provinceName	"
                            :value="item.provinceId">
                            </el-option>
                        </el-select>
                        <el-select v-model="shopInfoForm.cityId" placeholder="请选择城市" disabled
                            @focus="getCityList(shopInfoForm.provinceId)">
                            <el-option
                            v-for="(item, index) in shopInfoForm.cityOptions"
                            :key="index"
                            :label="item.cityName"
                            :value="item.cityId">
                            </el-option>
                        </el-select>
                        <el-select v-model="shopInfoForm.districtId" placeholder="请选择区域" disabled
                            @focus="getDistrictList(shopInfoForm.cityId)">
                            <el-option
                            v-for="(item, index) in shopInfoForm.districtOptions"
                            :key="index"
                            :label="item.districtName"
                            :value="item.districtId">
                            </el-option>
                        </el-select>
                        <el-select v-model="shopInfoForm.villageId" placeholder="请选择村" disabled
                            @focus="getVillage(shopInfoForm.districtId)">
                            <el-option
                            v-for="(item, index) in shopInfoForm.villageOptions"
                            :key="index"
                            :label="item.villageName"
                            :value="item.villageId">
                            </el-option>
                        </el-select>
                </el-form-item>
                <el-form-item label="详细地址：" prop="addressDetail">
                    <el-input v-model="shopInfoForm.addressDetail" placeholder="请输入详细地址"></el-input>
                </el-form-item>
                <el-form-item label="店铺性质：" prop="shopNature">
                    <div style="display:flex;align-items:center;justify-content:space-between;width:40%;">
                        <el-radio-group v-model="shopInfoForm.shopNature">
                            <el-radio :label="1">个人</el-radio>
                            <el-radio :label="2">企业</el-radio>
                        </el-radio-group>
                        <div class="infoStyle">(企业必须输入公司名)</div>
                    </div>
                </el-form-item>
                <el-form-item label="分类：" prop="thirdClassifyId" required>
                    <el-select v-model="shopInfoForm.firstClassifyId" placeholder="请选择一级分类"
                    @focus="getOneLevel(true)"
                    >
                        <el-option
                        v-for="(item, index) in shopInfoForm.oneLevelOptions"
                        :key="index"
                        :label="item.classifyName"
                        :value="item.classifyId">
                        </el-option>
                    </el-select>
                    <el-select v-model="shopInfoForm.secondClassifyId" placeholder="请选择二级分类"
                    @focus="getTwoLevel(true)"
                    >
                        <el-option
                        v-for="(item, index) in shopInfoForm.twoLevelOptions"
                        :key="index"
                        :label="item.classifyName"
                        :value="item.classifyId">
                        </el-option>
                    </el-select>
                    <el-select v-model="shopInfoForm.thirdClassifyId" placeholder="请选择三级分类"
                    @focus="getThreeLevel(true)">
                        <el-option
                        v-for="(item, index) in shopInfoForm.threeLevelOptions"
                        :key="index"
                        :label="item.classifyName"
                        :value="item.classifyId">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="公司名称：" prop="companyName"  v-show="isShow()" >
                    <el-input v-model="shopInfoForm.companyName" placeholder="请输入内容"></el-input>
                </el-form-item>
                <el-form-item label="联系人：" prop="contactName">
                    <el-input v-model="shopInfoForm.contactName" placeholder="请输入内容"></el-input>
                </el-form-item>
                <el-form-item label="联系电话：" prop="contactPhone">
                    <el-input v-model ="shopInfoForm.contactPhone" placeholder="请输入内容"></el-input>
                </el-form-item>
                <el-form-item label="图片信息：" required>
                    <el-col :span="8">
                        <div>
                            <div class="attrNameStyle" style="width:100%;padding:5px 0;margin-left: 11px;">1.店铺图片:</div>
                            <!-- <div  style="width:100%">
                                    <img :src="shopInfoForm.shopImgUrl" alt="暂无" class="imgStyle">
                            </div> -->
                            <el-upload
                                class="avatar-uploader"
                                name="reportFile"
                                :action="actionurl"
                                :show-file-list="false"
                                :on-success="handleAvatarSuccess"
                                :before-upload="beforeAvatarUpload">
                                <img v-if="shopInfoForm.shopImgUrl" :src="shopInfoForm.shopImgUrl" class="avatar">
                                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                            </el-upload>
                        </div>
                    </el-col>
                    <el-col :span="10" style="display:flex;justify-contetn:left;">
                        <div>
                            <div class="attrNameStyle" style="width:100%;padding:5px 0;">2.营业执照:</div>
                            <!-- <div style="width:100%">
                                    <img :src="shopInfoForm.bussinessLicenseUrl" alt="暂无" class="imgStyle">
                            </div> -->
                            <el-upload
                                class="avatar-uploader"
                                name="reportFile"
                                :action="actionurl"
                                :show-file-list="false"
                                :on-success="handleAvatarSuccess1"
                                :before-upload="beforeAvatarUpload">
                                <img v-if="shopInfoForm.bussinessLicenseUrl" :src="shopInfoForm.bussinessLicenseUrl" class="avatar">
                                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                            </el-upload>
                        </div>
                    </el-col>
                </el-form-item>
            </el-form>
            <el-row>
                <el-col :span="24" style="text-align:center;margin:10px 0;">
                    <el-button type="success" @click="submitEditInfo('shopInfoForm')" style="margin-right:100px;">保 存</el-button>
                    <el-button plain @click="returnShopList()">返 回</el-button>
                </el-col>
            </el-row>
        </div>
        <!-- <div class="lineStyle1">
            <el-row style="width:100%">
                <el-col :span="12"><div><div class="attrNameStyle">审核信息:</div></div></el-col>
            </el-row></div>
        <div class="lineStyle2">
            <el-row>
                <el-col :span="12" style="display:flex;">
                    <div class="infoStyle">审核通过:</div>
                    <div style="display:flex;justify-content:center;padding:7px 0;">
                        <el-radio-group v-model="applyStatus">
                            <el-radio :label="2">通过</el-radio>
                            <el-radio :label="3">未通过</el-radio>
                        </el-radio-group>
                    </div>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12" style="display:flex;">
                    <div class="infoStyle">审核备注:</div>
                    <el-input type="textarea" v-model="refusalReason" :autosize="{minRows: 4 , maxRows: 10}" size="large" placeholder="备注" autocomplete="off" style="width:70%;font-size:14px"></el-input>
                </el-col>
            </el-row>
        </div> -->
    </div>
</template>
<script>
export default {
    data(){
        var checkPhone = (rule, value, callback) => {
            if (value) {
                if(!this.phoneTem.test(value)){
                    callback(new Error('输入联系电话有误！'));
                }else{
                    callback();
                }
            }
        };
        return {
     				actionurl: this.apis.uploadImg, //图片路径
            applyStatus: 2,
            refusalReason:"",
            phoneTem:/^(13[0-9]|14[0-9]|15[0-9]|166|17[0-9]|18[0-9]|19[8|9])\d{8}$/,
            shopInfoForm: {
                shopName:"",//店铺名称
                shopGenre:"",//店铺分类
                addressDetail:"",//店铺地址
                shopNature:"1",//店铺性质
                contactName:"",//联系人
                contactPhone:0,//联系电话
                applyTime:"",//申请时间
                auditTime:"",//审核时间
                shopImgUrl:"",//店铺照片
                bussinessLicenseUrl:"",//营业执照
                companyName:"",//公司名称
                oneLevelOptions:[],//一级分类列表
                twoLevelOptions:[],//二级分类列表
                threeLevelOptions:[],//三级分类列表
                firstClassifyName:"",//一级类名
                secondClassifyName:"",//二级类名
                thirdClassifyName:"",//三级类名
                firstClassifyId:"",//一级类id 
                secondClassifyId:"",//二级类名id
                thirdClassifyId:"",//三级类名id
                provinceId:"",//省份ID
                provinceName:"",//省份名称
                provinceOptions:[],
                cityId:"",//城市ID
                cityName:"",//城市名称
                cityOptions:[],
                districtId:"",//区ID
                districtName:"",//区名称
                districtOptions:[],
                villageId:"",//城市ID
                villageName:"",//城市名称
                villageOptions:[],
            },
            rules: { 
                shopName: [
                    { required: true, message: '请输入店铺名称', trigger: 'blur' },
                ],
                addressDetail: [
                    { required: true, message: '请输入详细地址', trigger: 'blur' },
                ],
                thirdClassifyId: [
                    { required: true, message: '请选择分类信息', trigger: 'change' },
                ],
                companyName: [
                    { required: true, message: '请输入公司名称', trigger: 'blur' },
                ],
                contactName: [
                    { required: true, message: '请输入联系人', trigger: 'blur' },
                ],
                contactPhone: [
                    { required: true, message: '请输入联系电话', trigger: 'blur' },
                    // { type: 'number', message: '联系电话必须为数字'},
                    { validator: checkPhone,trigger: 'blur'},   
                ],
            },
        }   
    },
    mounted(){
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
                    let{shopName,provinceId,cityId,districtId,villageId,addressDetail,companyName,
                        shopNature,firstClassifyName,secondClassifyName,thirdClassifyName,
                        firstClassifyId,secondClassifyId,thirdClassifyId,
                        provinceName,cityName,districtName,villageName,
                        contactName,contactPhone,shopImgUrl,bussinessLicenseUrl,applyDate,createdDate
                    } = res.data.data;
                    this.shopInfoForm.shopName = shopName;//店铺名称
                    this.shopInfoForm.addressDetail = addressDetail;//店铺地址
                    this.shopInfoForm.shopNature = shopNature;//店铺性质
                    this.shopInfoForm.companyName = companyName;//公司名称
                    this.shopInfoForm.contactName = contactName;//联系人
                    this.shopInfoForm.contactPhone = contactPhone;//联系电话
                    this.shopInfoForm.applyTime = applyDate;//申请时间
                    this.shopInfoForm.auditTime = createdDate;//审核时间
                    this.shopInfoForm.shopImgUrl = shopImgUrl;//店铺照片
                    this.shopInfoForm.bussinessLicenseUrl = bussinessLicenseUrl;//营业执照
                    this.shopInfoForm.firstClassifyName = firstClassifyName;//一级
                    this.shopInfoForm.secondClassifyName = secondClassifyName;//二级
                    this.shopInfoForm.thirdClassifyName = thirdClassifyName;//三级
                    this.shopInfoForm.firstClassifyId = firstClassifyId;//一级
                    this.shopInfoForm.secondClassifyId = secondClassifyId;//二级
                    this.shopInfoForm.thirdClassifyId = thirdClassifyId;//三级
                    this.shopInfoForm.provinceId = provinceId;
                    this.shopInfoForm.cityId = cityId;
                    this.shopInfoForm.districtId = districtId;
                    this.shopInfoForm.villageId = villageId;
                    this.provinceId = provinceId;
                    this.cityId = cityId;
                    this.districtId = districtId;
                    this.villageId = villageId;
                    this.getProvinceList();
                    this.getCityList(this.shopInfoForm.provinceId);
                    this.getDistrictList(this.shopInfoForm.cityId);
                    this.getVillage(this.shopInfoForm.districtId);
                    this.getOneLevel(false);
                    this.getTwoLevel(false);
                    this.getThreeLevel(false);
                }else{
                    this.$message.error(res.message);
                }
            });
        },
        isShow(){
            //企业名称是否显示
            if(this.shopInfoForm.shopNature == 1){
                this.rules.companyName[0].required = false;
                return false
            }else if(this.shopInfoForm.shopNature == 2){
                this.rules.companyName[0].required = true;
                return true
            }else{
                this.rules.companyName[0].required = false;
                return false
            }
        },
        getOneLevel(isTrue){
            //获取一级分类
            this.shopInfoForm.twoLevelOptions = [];
            this.shopInfoForm.threeLevelOptions = [];
            this.axiosReq(this.LOCAL+this.apis.getOneLevelCClassify,"get").then(res =>{
                if(res.status === 200){
                    this.shopInfoForm.oneLevelOptions = res.data;
                    if(isTrue)
                        {
                            this.shopInfoForm.secondClassifyId = "";
                            this.shopInfoForm.thirdClassifyId = "";
                            this.shopInfoForm.twoLevelOptions = [];
                            this.shopInfoForm.threeLevelOptions = [];
                        }
                }else{
                    this.$message.error(res.message);
                }
            });
        },
        getTwoLevel(isTrue){
            //获取二级分类
            this.shopInfoForm.threeLevelOptions = [];
            this.axiosReq(`${this.LOCAL+this.apis.getNextLevelCClassify}/${this.shopInfoForm.firstClassifyId}`,"get").then(res =>{
                if(res.status === 200){
                    this.shopInfoForm.twoLevelOptions = res.data;
                    if(isTrue){
                        this.shopInfoForm.thirdClassifyId = "";
                        this.shopInfoForm.threeLevelOptions = [];
                    }
                }else{
                    this.$message.error(res.message);
                }
            });
        },
        getThreeLevel(){
             //获取三级分类
            this.axiosReq(`${this.LOCAL+this.apis.getNextLevelCClassify}/${this.shopInfoForm.secondClassifyId}`,"get").then(res =>{
                if(res.status === 200){
                    this.shopInfoForm.threeLevelOptions = res.data;
                }else{
                    this.$message.error(res.message);
                }
            });
        },
        getProvinceList(){
            //获取省列表
            this.shopInfoForm.cityOptions = [];
            this.shopInfoForm.districtOptions = [];
            this.shopInfoForm.villageOptions = [];
            this.axiosReq(this.LOCAL+this.apis.getProvinceList,"get").then(res =>{
                if(res.status === 200){
                    this.shopInfoForm.provinceOptions = res.data;
                    this.provinceList = res.data;
                }else{
                    this.$message.error(res.message);
                }
            });
        },
        getCityList(provinceId){
            //获取市列表
            this.shopInfoForm.districtOptions = [];
            this.shopInfoForm.villageOptions = [];
            this.axiosReq(`${this.LOCAL+this.apis.getCityList}/${provinceId}`,"get").then(res =>{
                if(res.status === 200){
                    this.shopInfoForm.cityOptions = res.data;
                    this.cityList = res.data;
                }else{
                    this.$message.error(res.message);
                }
            });
        },
        getDistrictList(cityId){
            //获取区县列表
            this.shopInfoForm.villageOptions = [];
            this.axiosReq(`${this.LOCAL+this.apis.getDistrictList}/${cityId}`,"get").then(res =>{
                if(res.status === 200){
                    this.shopInfoForm.districtOptions = res.data;
                    this.districtList = res.data;
                }else{
                    this.$message.error(res.message);
                }
            });
        },
        getVillage(districtId){
            //获取村列表
            this.axiosReq(`${this.LOCAL+this.apis.getVillage}/${districtId}`,"get").then(res =>{
                if(res.status === 200){
                    this.shopInfoForm.villageOptions = res.data;
                    this.villageList = res.data;
                    if(this.villageList.length == 0)
                        this.shopInfoForm.villageId = "";
                }else{
                    this.$message.error(res.message);
                }
            });
				},
			handleAvatarSuccess(res, file) {
				this.shopInfoForm.shopImgUrl = res.path;
      },
			handleAvatarSuccess1(res, file) {
				this.shopInfoForm.bussinessLicenseUrl = res.path;
      },
      beforeAvatarUpload(file) {
        const isLt2M = file.size / 1024 / 1024 < 10;
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isLt2M;
      },
        submitEditInfo(formName){
            //提交商家修改信息
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.postEditInfo();
                } else {
                    return false;
                }
            });
        },
        postEditInfo(){
        let firstOption = {};
        let seconOption = {};
        let thirdOption = {};
        firstOption = this.shopInfoForm.oneLevelOptions.find(item=>{
            return item.classifyId == this.shopInfoForm.firstClassifyId;
        })
        if(firstOption) this.shopInfoForm.firstClassifyName = firstOption.classifyName;
        seconOption = this.shopInfoForm.twoLevelOptions.find(item=>{
            return item.classifyId == this.shopInfoForm.secondClassifyId;
        })
        if(seconOption) this.shopInfoForm.secondClassifyName = seconOption.classifyName;
        thirdOption = this.shopInfoForm.threeLevelOptions.find(item=>{
            return item.classifyId == this.shopInfoForm.thirdClassifyId;
        })
        if(thirdOption) this.shopInfoForm.thirdClassifyName = thirdOption.classifyName;
        let obj = {
            data:{
                "shopId":this.$route.query.shopId,
                "shopName": this.shopInfoForm.shopName,
                "companyName":this.shopInfoForm.companyName,
                "firstClassifyId":this.shopInfoForm.firstClassifyId,	
                "secondClassifyId":this.shopInfoForm.secondClassifyId,
                "thirdClassifyId":this.shopInfoForm.thirdClassifyId,
                "firstClassifyName":this.shopInfoForm.firstClassifyName,
                "secondClassifyName":this.shopInfoForm.secondClassifyName,
                "thirdClassifyName" :this.shopInfoForm.thirdClassifyName,
                "shopNature":this.shopInfoForm.shopNature,		
                "contactName":this.shopInfoForm.contactName,	
                "contactPhone":this.shopInfoForm.contactPhone,	
                "provinceId":this.shopInfoForm.provinceId,	
                "cityId":this.shopInfoForm.cityId,	
                "districtId":this.shopInfoForm.districtId,	
                "addressDetail"	:this.shopInfoForm.addressDetail,
                // "applyStatus":this.applyStatus,	
                // "refusalReason":this.refusalReason,
                "bussinessLicenseUrl":this.shopInfoForm.bussinessLicenseUrl,
                "shopImgUrl":this.shopInfoForm.shopImgUrl,
                }
            }
            this.axiosReq(this.apis.updateShop,"post",obj).then(res =>{
                if(res.status === 200){
                    this.$message.success("修改商家信息成功！");
                    this.$router.push({
                        path:"/unauditedSellerList",
                    })
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
    font-size: 15px;
}
.lineStyle2{
    background-color: #ffffff;
    font-size: 15px;
    width:100%;
}
.attrNameStyle{
    margin-left: 18px;
    width: 80px;
    display: inline-block;
}
.infoStyle{
    color: #999999;
    font-size: 14px;
    padding: 0 20px;
    margin: 0 10px;
}
.infoStyle::before{
    content: "*";
    color: #ff0000;
}
.infoLineStyle{
    display:flex;
    align-items:center;
    padding: 5px 0;
}
.imgStyle{
    width: 180px;
    height: 180px;
    margin-left: 11px;
}
.el-input__inner {
    //input框高度调整
    -webkit-appearance: none;
    background-color: #FFF;
    border-radius: 4px;
    border: 1px solid #DCDFE6;
    box-sizing: border-box;
    color: #606266;
    display: inline-block;
    font-size: inherit;
    height: 35px;
    line-height: 40px;
    outline: 0;
    padding: 0 15px;
    -webkit-transition: border-color .2s cubic-bezier(.645,.045,.355,1);
    transition: border-color .2s cubic-bezier(.645,.045,.355,1);
    width: 100%;
}
.el-input {
    position: relative;
    font-size: 14px;
    display: inline-block;
    width: 55%;
}
.shopInfoFormStyle{
    padding:10px 0;
}
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
