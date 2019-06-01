<template>
  <div class="fillcontain">
    <el-row class="search-column">
      <el-col :span="4">
        <div class="shop-list">&nbsp;商家列表</div>
      </el-col>
      <el-col :span="20" class="search-area">
        <el-col :span="5" class="item-style">
          <el-input placeholder="按照 店铺名称 搜索" style="margin:0px 10px" clearable v-model="shopName" @keyup.enter.native="searchShop()">
              <template slot="prepend">店铺名称:</template>
          </el-input>
        </el-col>
        <el-col :span="5" class="item-style">
          <el-input placeholder="按照 联系电话 搜索" style="margin:0px 10px" clearable v-model="contactPhone" @keyup.enter.native="searchShop()">
              <template slot="prepend">联系电话:</template>
          </el-input>
        </el-col>
        <el-col :span="5" class="item-style">
          <el-input placeholder="按照 联系人 搜索" style="margin:0px 10px" clearable v-model="contactName" @keyup.enter.native="searchShop()">
              <template slot="prepend">联系人:</template>
          </el-input>
        </el-col>
        <el-col :span="1" class="item-style">
          <el-button icon="el-icon-search" type="success" size="small" style="margin-left:10px;" @click="searchShop()"> </el-button>
        </el-col>
      </el-col>
    </el-row>
    <div class="table_container">
      <el-table
        :data="shopTableData"
        :header-cell-style="{background:'#f0f4f5'}"
        stripe
        class="table_style"
      >
        <el-table-column label="商铺名称" prop="shopName" align="center"></el-table-column>
        <el-table-column label="分类" align="center">
          <template slot-scope="scope">
            <span>{{(scope.row.firstClassifyName+"/"+scope.row.secondClassifyName+"/"+scope.row.thirdClassifyName)||"暂无"}}</span>
          </template></el-table-column>
        <el-table-column label="性质" :formatter="getShopNature" prop="shopNature" align="center"></el-table-column>
        <el-table-column label="状态" :formatter="getShopStatus" prop="applyStatus" align="center"></el-table-column>
        <el-table-column label="联系人" prop="contactName" align="center"></el-table-column>
        <el-table-column label="联系电话" prop="contactPhone" align="center"></el-table-column>
        <el-table-column label="创建时间" prop="createdDate" align="center"></el-table-column>
        <el-table-column label="操作" align="center" width="300px">
          <template slot-scope="scope">
            <el-tooltip effect="dark" content="查看详情" placement="top">
              <el-button size="mini" type="success" plain @click="goToShopDetails(scope.row)">
                <span class="iconfont icon-xianshikejian"></span>
              </el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="商品管理" placement="top">
              <el-button size="mini" type="primary" plain @click="goToGoodsList(scope.row)">
                <span class="iconfont icon-renwu"></span>
              </el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="冻结/解冻" placement="top">
              <el-button size="mini" type="danger" plain @click="useDialog(scope.row)">
                <span :class="isFreezeStyle(scope.row)"></span>
              </el-button>
            </el-tooltip>
            <el-dialog
              title="提示！"
              :visible.sync="dialogVisible"
              width="15%" center>
              <span style="display:inline-block;text-align:left;width:100%">是否确认将商家“{{dialogShopName}}”{{dialogStatus==4?dialogTip1:dialogTip2}}</span>
              <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="isfreezeShop()">确 定</el-button>
              </span>
            </el-dialog>
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
export default {
  data() {
    return {
        shopTableData:[],
        currentRow: 10,
        count: 0,
        currentPage: 1,
        shopName:"",
        contactPhone:"",
        contactName:"",
        dialogVisible:false,
        dialogTip1:"解冻？解冻后需重新审核通过该商家，商家才能手动将商品重新上架。",
        dialogTip2:"冻结？冻结商家后商家的商品将被全部下架！",
        dialogStatus:"",
        dialogShopName:"",
        thisRowData:{}
    };
  },
  created() {
    let sellerList = window.localStorage.getItem("sellerList");
    let sellerObj = JSON.parse(sellerList)
    if(sellerList){
      this.shopName = sellerObj.shopName;
      this.contactPhone = sellerObj.contactPhone;
      this.contactName = sellerObj.contactName;
      this.currentPage = sellerObj.page;
      this.currentRow = sellerObj.rows;
    }
    this.getshopList();
  },
  beforeRouteEnter (to, from, next) {
    if(from.path != "/checkSellerData" && from.path != "/goodsList"){
      window.localStorage.setItem("sellerList","{}");
    }
    next();
  },
  mounted() {},
  methods: {
    getshopList(){
      //查询所有的店铺
      let obj={
        params:{
            "shopName":this.shopName,
            "contactPhone":this.contactPhone,
            "contactName":this.contactName,
            "page":this.currentPage,
            "rows":this.currentRow,
        },
        headers:{}
      }
      this.axiosReq(this.apis.queryShopList,"get",obj).then(res =>{
        if(res.status === 200){
          this.shopTableData = res.data.data.items;
          this.count = res.data.data.total;
        }else{
          this.$message.error(res.message);
        }
      })
    },
    getShopNature(row,column){
      //格式化店铺类型
      if(row.shopNature==1){
        return "个人";
      } else if(row.shopNature==2){
        return "企业"
      }else{
        return "未知"
      }
    },
    getShopStatus(row,column){
        let statusOption = {
          1:"审核中",
          2:"审核通过",
          3:"审核拒绝",
          4:"冻结"
        }
        return statusOption[row.applyStatus]
    },
    searchShop(){
      //筛选店铺
      this.getshopList();
    },
    goToShopDetails(row){
      //跳转到店铺详情
      this.saveLocalStorage();
      this.$router.push({
        path:"/checkSellerData",
        query:{
          shopId:row.shopId,
        }
      })
    },
    goToGoodsList(row){
      //跳转到店铺商品列表
      this.saveLocalStorage();
      this.$router.push({
        path:"/goodsList",
        query:{
          shopId:row.shopId,
        }
      })
    },
    saveLocalStorage () {
      let sellerList = {
        "page":this.currentPage,
        "rows":this.currentRow,
        "shopName":this.shopName,
        "contactPhone":this.contactPhone,
        "contactName":this.contactName
      }
      window.localStorage.setItem("sellerList", JSON.stringify(sellerList));
    },
    useDialog(row){
      //冻结/解冻提示弹框的调起
      this.thisRowData = row;
      this.dialogVisible = true;
      this.dialogStatus=row.applyStatus;
      this.dialogShopName=row.shopName;
    },
    isfreezeShop(){
      //冻结/解冻商家
      this.dialogVisible = false;
      let shopId = this.thisRowData.shopId;
      let applyStatus = this.thisRowData.applyStatus;
      if(applyStatus === 4){
        applyStatus = 1;
      }else{
        applyStatus = 4;
      }
      let obj = {
        data:{
          shopId:shopId,
          applyStatus:applyStatus,
        }
      }
      this.axiosReq(this.apis.isFreezeShop,"post",obj).then(res =>{
        if(res.status === 200){
          this.getshopList();
          if(applyStatus == 1)
            this.$message.success("解冻商家成功！");
          else if(applyStatus == 4)
            this.$message.success("冻结商家成功！");
        }else{
          this.$message.error(res.message);
        }
      })
    },
    isFreezeStyle(row){
      if(row.applyStatus === 4){
        return "iconfont icon-ai241"
      }else{
        return "iconfont icon-jiesuo"
      }
    },
    sizeChange(currentRow){
      //currentRow 改变时会触发
      this.currentRow = currentRow;
      this.getshopList();
    }, 
    currentChange(currentPage){
      //currentPage 改变时会触发
      this.currentPage = currentPage;
      this.getshopList();
    },	
    prevClick(currentPage){
      //用户点击上一页按钮改变当前页后触发
      this.currentPage = currentPage;
      this.currentPage = currentPage;
      this.getshopList();
    },	
    nextClick(currentPage){
      //用户点击下一页按钮改变当前页后触发
      this.currentPage = currentPage;
      this.getshopList();
    }
  },
};
</script>

<style lang="less" scoped>
.fillcontain{
  background: #f0f4f5;
  .search-column {
    max-height:50px;
    display:flex;
    background:#fff;
    .shop-list{
      border-left:solid #00ae87 4px;
      height:20px;
      margin:15px;
    }
    .search-area{
      margin:0px 20px 0px 20px;
      display:flex;
      align-items:center;
      justify-content:flex-end;
      .item-style{
        padding: 1px 2px;
      }
    }
  }
}

.el-menu-demo {
  display: flex;
  width: 100%;
}
.table_container {
  padding: 0;
  background: #fff;
  .table_style{
    width: 100%; 
    background-color:#f0f4f5;
    margin-bottom:30px;
  }
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
