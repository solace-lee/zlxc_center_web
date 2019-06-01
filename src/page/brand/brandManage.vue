<template>
  <div class="brandManage">
    <!-- 头部 -->
    <el-row class="b_t_header" type="flex" justify="end">
      <el-col :span="13" class="asd">
        <div>
          <span class="green"></span>
          <strong>品牌列表</strong>
        </div>
      </el-col>

      <el-col :span="11">
        <el-row :gutter="20">
          <el-col :span="12">
            <div class="bor">
              <span>品牌名称:</span>
              <el-input
                v-model="brandName"
                placeholder="请输入内容"
                style="width:50%;"
                @keyup.enter.native="getSearch"
              ></el-input>
            </div>
          </el-col>
          <el-col :span="11">
            <div class="bor">
              <span>第三级分类:</span>
              <el-input
                v-model="thirdClassifyName"
                placeholder="请输入内容"
                style="width:50%;"
                @keyup.enter.native="getSearch"
              ></el-input>
            </div>
          </el-col>

          <el-col :span="1">
            <div class="bor2" @click="getSearch">
              <span class="el-icon-search"></span>
            </div>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <!-- 列表项目 -->
    <el-table
      :data="BM_tableData"
      :header-cell-style="{background:'#f0f4f5'}"
      stripe
      style="width: 100%; background-color:#f0f4f5;margin-bottom:30px;"
    >
      <el-table-column label="排序" prop="orderby" align="center" width="80px"></el-table-column>
      <el-table-column label="商品图片" align="center">
        <template slot-scope="scope">
          <img :src="scope.row.imgUrl" alt class="img">
        </template>
      </el-table-column>
      <el-table-column label="品牌名称" prop="brandName" align="center"></el-table-column>
      <el-table-column label="分类" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.firstClassifyName}}</span>/
          <span>{{scope.row.secondClassifyName}}</span>/
          <span>{{scope.row.thirdClassifyName}}</span>
        </template>
      </el-table-column>

      <el-table-column label="是否启用" align="center">
        <template slot-scope="scope">
          <el-switch
            :value="change(scope.row.isRecommend)"
            active-color="#00ae87"
            inactive-color="#999"
            @change="ifRecommendchange1(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-tooltip effect="dark" content="编辑" placement="top">
            <el-button size="mini" type="primary" plain @click="dialogFormVisibleChange(scope.row)">
              <span class="iconfont icon-bianjishuru"></span>
            </el-button>
          </el-tooltip>
          <el-tooltip effect="dark" content="删除" placement="top">
            <el-button size="mini" type="danger" plain @click="open2(scope.row.brandId)" >
              <span class="iconfont icon-lajitongshanchu"></span>
            </el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 脚部 -->
    <div class="bm_foot">
      <el-button type="success" class="btn" @click="dialogFormVisibleChange()">添加品牌</el-button>
      <!-- <el-button type="success" class="btn" @click="sort()">刷新顺序</el-button> -->
      <el-pagination
        class="Pagination"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="rows"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>

    <!-- 弹窗-编辑 -->
    <el-dialog :title="addTitle" :visible.sync="dialogFormVisible" center width="500px">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
        <el-form-item label="名牌名称" prop="brandName">
          <el-input v-model="ruleForm.brandName"></el-input>
        </el-form-item>
        <el-form-item label="是否启用" prop="ifRecommend">
          <el-switch
            v-model="ruleForm.dos"
            active-color="#00ae87"
            inactive-color="#999"
            @change="ifRecommendchange2 (ruleForm)"
          ></el-switch>
        </el-form-item>
        <el-form-item label="上传logo" prop="imgUrl">
          <el-upload
            :action="actionurl"
            name="reportFile"
            class="avatar-uploader"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="ruleForm.imgUrl" :src="ruleForm.imgUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>

        <el-form-item label="选择分类1" prop="firstClassifyId" style="margin-right:10px">
          <el-select
            v-model="ruleForm.firstClassifyId"
            placeholder="请选择一级分类"
            @change="goTwo(ruleForm.firstClassifyId)"
          >
            <el-option
              v-for="(item, index) in one"
              :key="index"
              :label="item.classifyName"
              :value="item.classifyId"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="选择分类2" prop="secondClassifyId" style="margin-right:10px">
          <el-select
            v-model="ruleForm.secondClassifyId"
            placeholder="请选择二级分类"
            @change="goThree(ruleForm.secondClassifyId)"
          >
            <el-option
              v-for="(item, index) in two"
              :key="index"
              :label="item.classifyName"
              :value="item.classifyId"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="选择分类3" prop="thirdClassifyId">
          <el-select
            v-model="ruleForm.thirdClassifyId"
            placeholder="请选择三级分类"
            @change="getName3(ruleForm.thirdClassifyId)"
          >
            <el-option
              v-for="(item, index) in three"
              :key="index"
              :label="item.classifyName"
              :value="item.classifyId"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="排序" prop="orderby">
          <el-input v-model="ruleForm.orderby" ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" plain @click="submitForm('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 弹窗-删除 -->
    <el-dialog
      title="提醒"
      :visible.sync="centerDialogVisible"
      width="28%"
      center>
      <div class="delIcon"><span class="iconfont icon-gantanhao-yuankuang"></span></div>
      <div class="deltext"><span >你确定要删除此品牌吗?</span></div>
      <div slot="footer" class="dialog-footer">
        <el-button class="btn" @click="goDel()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { indexNum } from "@/config/formChange";// 价格校验法制
export default {
  data() {
    return {
      addTitle: '添加品牌',
      actionurl: this.apis.uploadImg, //图片路径
      dialogFormVisible: false, //弹窗-编辑
      dos: false,
      currentPage: 1,
      BM_tableData: [],
      total: 0, //总页数
      page: 1, //页数
      rows: 10, //条数
      brandName: "", //搜索品牌名
      thirdClassifyName: "", //搜索分类名
      centerDialogVisible:false,//删除弹窗
      delId: 0, //需要删除的id
      one: [],
      two: [],
      three: [],
      ruleForm: {
        dos: false,
        brandId: 0,
        brandName: "",
        imgUrl: "",
        firstClassifyId: "",
        secondClassifyId: "",
        thirdClassifyId: "",
        isRecommend: 0,
        firstClassifyName: "",
        secondClassifyName: "",
        thirdClassifyName: "",
        orderby: ""
      },
      rules: {
        brandName: [
          { required: true, message: "请输入活动名称", trigger: "blur" }
        ],
        firstClassifyId: [
          { required: true, message: "请选择分类1", trigger: "blur" }
        ],

        secondClassifyId: [
          { required: true, message: "请选择分类2", trigger: "blur" }
        ],
        thirdClassifyId: [
          { required: true, message: "请选择分类3", trigger: "blur" }
        ],
        imgUrl: [{ required: true, message: "请输上传图片", trigger: "blur" }],
        orderby: [{ required: true, validator: indexNum, trigger: "blur" }]
      }
    };
  },
  created() {
    this.getData();
    this.getResOne();
  },
  beforeRouteEnter (to, from, next) {
    if(from.path != "/orderDetails"){
      window.localStorage.setItem("orderList","{}");
    }
    next();
  },
  methods: {
    // 接口
    //获取数据列表
    getData() {
      let obj = {
        params: {
          brandName: this.brandName,
          thirdClassifyName: this.thirdClassifyName,
          page: this.page,
          rows: this.rows
        }
      };
      this.axiosReq(this.apis.brandList, "get", obj).then(res => {
        if (res.data.status == 200) {
          this.BM_tableData = res.data.data.items;
          this.total = res.data.data.total;
        } else {
          this.$message({
            message: res.data.msg,
            typr: "warning"
          });
        }
      });
    },
    // 获取分类1
    getResOne() {
      this.axiosReq(this.LOCAL+this.apis.OneLeve, "get").then(res => {
        if (res.status == 200) {
          this.one = res.data;
        }
      });
    },
    // 获取分类2
    goTwo(id) {
      this.two = [];
      this.ruleForm.secondClassifyId = "";
      this.three = [];
      this.ruleForm.thirdClassifyId = "";
      this.one.forEach(item => {
        if (item.classifyId == id) {
          this.ruleForm.firstClassifyName = item.classifyName;
        }
      });
      this.axiosReq(this.LOCAL+this.apis.TwoLeve + id, "get").then(res => {
        if (res.status == 200) {
          this.two = res.data;
        }
      });
    },
    // 获取分类3
    goThree(id) {
      (this.three = []),
        (this.ruleForm.thirdClassifyId = ""),
        this.two.forEach(item => {
          if (item.classifyId == id) {
            this.ruleForm.secondClassifyName = item.classifyName;
          }
        });
      this.axiosReq(this.LOCAL+this.apis.TwoLeve + id, "get").then(res => {
        if (res.status == 200) {
          this.three = res.data;
        }
      });
    },
    getName3(id) {
      this.three.forEach(item => {
        if (item.classifyId == id) {
          this.ruleForm.thirdClassifyName = item.classifyName;
        }
      });
    },
    // 添加
    toAddRrand(obj) {
      this.axiosReq(this.apis.postBrand, "post", obj).then(res => {
        if (res.status == 200) {
          this.$message({
            message: "添加成功",
            type: "success"
          });
        } else {
          this.$message.error("更新失败");
        }
        this.getData();
      });
    },
    // 更改
    upData(obj) {
      this.axiosReq(this.apis.updateBrand, "post", obj).then(res => {
        if (res.status == 200) {
          this.$message({
            message: "更新成功",
            type: "success"
          });
        } else {
          this.$message.error("更新失败");
        }
        this.getData();
      });
    },
    // 删除
    delData(id) {
      this.axiosReq(this.apis.delBrend + id, "get").then(res => {
        if (res.status == 200) {
          this.$message({
            message: "删除成功",
            type: "success"
          });
          this.centerDialogVisible =! this.centerDialogVisible
          this.getData();
        } else {
          this.$message.error("更新失败");
        }
        
      });
    },
    //
    change(val) {
      if (val == 1) {
        return true;
      } else {
        return false;
      }
    },
    //分页
    handleSizeChange(val) {
      this.rows = val;
      this.getData();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getData();
    },
    // 搜索
    getSearch() {
      this.getData();
    },
    dialogFormVisibleChange(val) {
      this.dos = false;
      if (val) {
        this.ruleForm.brandId = val.brandId;
        this.ruleForm.brandName = val.brandName;
        (this.ruleForm.imgUrl = val.imgUrl),
          this.one.push({
            classifyId: val.firstClassifyId,
            classifyName: val.firstClassifyName
          });
        this.two = [];
        this.goTwo(val.firstClassifyId)
        this.two.push({
          classifyId: val.secondClassifyId,
          classifyName: val.secondClassifyName
        });
        this.three = [];
        this.goThree(val.secondClassifyId)
        this.three.push({
          classifyId: val.thirdClassifyId,
          classifyName: val.thirdClassifyName
        }),
        this.addTitle = '修改品牌'
        this.ruleForm.isRecommend = val.isRecommend
        this.ruleForm.dos = val.isRecommend == 0 ? false : true
        this.ruleForm.firstClassifyId = val.firstClassifyId
        this.ruleForm.secondClassifyId = val.secondClassifyId
        this.ruleForm.thirdClassifyId = val.thirdClassifyId
        this.ruleForm.firstClassifyName = val.firstClassifyName
        this.ruleForm.secondClassifyName = val.secondClassifyName
        this.ruleForm.thirdClassifyName = val.thirdClassifyName
        this.ruleForm.orderby = val.orderby
      } else {
        this.getResOne()
        this.two = []
        this.three = []
        this.dos = true
        this.addTitle = '添加品牌'
        this.ruleForm.brandId = ""
        this.ruleForm.brandName = ""
        this.ruleForm.imgUrl = ""
        this.ruleForm.isRecommend = 0
        this.ruleForm.dos = false
        this.ruleForm.firstClassifyId = ""
        this.ruleForm.secondClassifyId = ""
        this.ruleForm.thirdClassifyId = ""
        this.ruleForm.firstClassifyName = ""
        this.ruleForm.secondClassifyName = ""
        this.ruleForm.thirdClassifyName = ""
        this.ruleForm.orderby = ""
      }
      this.dialogFormVisible = !this.dialogFormVisible;
    },

    ifRecommendchange1(val) {
      if (val.isRecommend == 1) {
        val.isRecommend = 0;
      } else {
        val.isRecommend = 1;
      }
      let obj = {
        data: val
      };
      this.upData(obj);
    },
    ifRecommendchange2() {
      if (this.ruleForm.dos) {
        this.ruleForm.isRecommend = 1;
      } else {
        this.ruleForm.isRecommend = 0;
      }
    },
    // 添加
    addBrand() {
      this.dos = true;
      this.dialogFormVisible = !this.dialogFormVisible;
    },
    // 排序
    sort() {
      function sortOrderby(a, b) {
        return a.orderby - b.orderby;
      }
      this.BM_tableData.sort(sortOrderby);
    },
    // 弹窗-编辑
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let obj = {
            data: this.ruleForm
          };
          if (!this.dos) {
            this.upData(obj);
            this.dialogFormVisible = false;
          } else {
            this.toAddRrand(obj);
            this.dialogFormVisible = false;
          }
        } else {
          // console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    handleAvatarSuccess(res, file) {
      this.ruleForm.imgUrl = res.path;
    },
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 10;

      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 2MB!");
      }
      return isLt2M;
    },
    getSearch() {
      this.getData();
    },
    // 弹窗-删除
    open2(id) {
      this.centerDialogVisible =! this.centerDialogVisible
      this.delId = id
    },
    //确认删除
    goDel() {
      this.delData(this.delId);
    }
  },
  
};
</script>

<style lang="less">
.brandManage {
  
  width: 100%;
  min-height: 100%;
  .img {
    width: 80px;
    height: 80px;
    display: inline-block;
    vertical-align: middle;
  }
  .bor2 {
    width: 100%;
    height: 100%;
    display: flex;
    align-items:center;
    font-size: 20px;
  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409eff;
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
  .b_t_header {
    height: 100%;
    padding: 10px 20px;
    font-size: 16px;
    background-color: #fff;
    .el-input__inner {
      max-height: 30px;
      line-height: 30px;
      border: none;
    }
    .asd {
      max-height: 32px;
      line-height: 32px;
      .green {
        display: inline-block;
        vertical-align: middle;
        width: 4px;
        height: 22px;
        background-color: #00ae87;
      }
    }
    .bor {
      color: #999;
      width: 100%;
      padding: 1px 2px;
      border: 1px solid #999999;
      border-radius: 4px;
    }
  }
  .bm_foot {
    width: 100%;
    display: flex;
    justify-content: flex-start;
    
    .Pagination {
      flex: 1;
      text-align: right;
    }
  }
  .el-dialog__header {
    background-color: #f0f4f5;
  }
  .delIcon{
    span{
      font-size:48px;
      color: #ff7001;
    }
    width: 100%;
    text-align:center;
    margin:40px 0px 30px 0px;
  }
  .deltext{
    span{
      font-size:16px;
    }
    width: 100%;
    text-align:center;
    margin:0px 0px 50px 0px;
  }
  .btn {
      width: 100px;
      background-color: #00ae87;
      color:#fff;
    }
  .el-button--danger{
    background:#fff;
  }
  .el-button--primary{
    background:#fff;
  }
}
</style>
