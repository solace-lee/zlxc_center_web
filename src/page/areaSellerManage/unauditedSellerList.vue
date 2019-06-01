<template>
  <div class="fillcontain">
    <el-row class="search-column">
      <el-col :span="4">
        <div class="shop-list">&nbsp;待审核商家列表</div>
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
      <div class="Pagination" style="text-align: right;margin-top: 10px;">
        <el-pagination
          :current-page="currentPage"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="currentRow"
          :total="count" @size-change = "sizeChange" @current-change = "currentChange" @prev-click = "prevClick" @next-click = "nextClick"
          layout="total, sizes, prev, pager, next, jumper"
        ></el-pagination>
      </div>
      <el-dialog
        title="提示" center
        :visible.sync="dialogVisible"
        width="20%">
        <div style="display:flex;justify-content:center;width:100%;padding:7px 0;">
            <el-radio v-model="isPass" label="2">通过</el-radio>
            <el-radio v-model="isPass" label="3">未通过</el-radio>
        </div>
        <el-input type="textarea" :autosize="{minRows: 4 , maxRows: 10}" size="large" v-model="auditRemark" placeholder="备注" autocomplete="off" style="width:100%;font-size:14px"></el-input>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="shopAuditing()">确 定</el-button>
        </span>
    </el-dialog>
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
        dialogVisible: false,
        isPass: '2',
        auditRemark:"",
        shopId:"",
        shopName:"",
        contactPhone:"",
        contactName:"",
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
    if(from.path != "/checkSellerData" && from.path != "/editSellerData"){
      window.localStorage.setItem("sellerList","{}");
    }
    next();
  },
  mounted() {},
  methods: {
    getshopList(){
      //查询待审核的店铺
      let obj={
        params:{
            "applyStatus":"1",
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
      if(row.shopNature==1){
        return "个人";
      } else if(row.shopNature==2){
        return "企业"
      }else{
        return "未知"
      }
    },
    popDialog(row){
      //弹出审核窗口并准备数据
      this.isPass='2';
      this.auditRemark = "";
      this.dialogVisible = true;
      this.shopId = row.shopId;
    },
    searchShop(){
      //筛选店铺
      this.getshopList();
    },
    shopAuditing(){
      //审核商家
      let obj={
        data:{
          "applyStatus":this.isPass,
          "shopId":this.shopId,
          "refusalReason":this.auditRemark,
        },
        headers:{}
      }
      this.axiosReq(this.apis.shopAuditing,"post",obj).then(res =>{
        if(res.status === 200){
          if(this.isPass==2)
            this.$message.success("审核通过！");
          else
            this.$message.success("审核拒绝！");
          this.getshopList();
        }else{
          this.$message.error(res.message);
        }
        this.dialogVisible = false;
      })
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
    goToShopEdit(row){
      //跳转到编辑店铺
      this.saveLocalStorage();
      this.$router.push({
        path:"/editSellerData",
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
