<template>
  <div class="adsense">
    <!-- 头部 -->
    <div class="block">
      <el-cascader 
        :options="one"
        v-model="selectedOptions"
        @change="handleChange"
        change-on-select
        clearable
        class="cascader"
        >
      </el-cascader>
      <el-button type="success" class="btn" @click="dialogFormVisibleChange()">添加广告</el-button>
    </div>

    <!-- 头部 -->
    <el-row class="b_t_header">
      <el-col :span="12" class="asd">
        <div>
          <span class="green"></span>
          <strong>广告位管理</strong>
        </div>
      </el-col>

      <el-col :span="12">
        <el-row :gutter="20" type="flex" justify="end">
          <el-col :span="11">
            <div class="bor">
              <span>名称:</span>
              <el-input
                v-model="title"
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
      :data="AD_tableData"
      :header-cell-style="{background:'#f0f4f5'}"
      stripe
      style="width: 100%; background-color:#f0f4f5;margin-bottom:30px;"
    >
      <el-table-column label="排序" prop="orderby" align="center" width="50px"></el-table-column>
      <el-table-column label="商品图片" align="center">
        <template slot-scope="scope">
          <img :src="scope.row.titleImg" alt class="img">
        </template>
      </el-table-column>
      <el-table-column label="名称" prop="title" align="center"></el-table-column>
      <el-table-column label="链接" align="center" prop="url"></el-table-column>

      <el-table-column label="是否展示" align="center">
        <template slot-scope="scope">
          <el-switch
            :value="change(scope.row.status)"
            active-color="#00ae87"
            inactive-color="#999"
            @change="ifRecommendchange1(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="广告编码" prop="typeCode" align="center"></el-table-column>
      <el-table-column label="商品ID" align="center">
        <template slot-scope="scope">
          <div>{{scope.row.commodityId | un}}</div>
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
            <el-button size="mini" type="danger" plain @click="open2(scope.row.flashId)">
              <span class="iconfont icon-lajitongshanchu"></span>
            </el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 脚部 -->
    <div class="bm_foot">
      <!-- <el-button type="success" class="btn" @click="dialogFormVisibleChange()">添加广告</el-button> -->
      <el-pagination
        class="Pagination"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage4"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="10"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>

    <!-- 弹窗-编辑 -->
    <el-dialog :title="addTitle" :visible.sync="dialogFormVisible" center width="700px">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
        <el-form-item label="请选择位置" prop="typeCode" style="margin-right:10px">
          <div class="block">
            <el-cascader
              :options="tow"
              v-model="selectedOptions2"
              @change="handleChange2"
              class="cascader"
              >
            </el-cascader>
          </div>
        </el-form-item>

        <el-form-item label="名称" prop="title">
          <el-input v-model="ruleForm.title"></el-input>
        </el-form-item>
        <el-form-item label="是否启用" prop="ifRecommend">
          <span>否</span>
          <el-switch
            v-model="ruleForm.dos"
            active-color="#00ae87"
            inactive-color="#999"
            @change="ifRecommendchange2 (ruleForm)"
          ></el-switch>
          <span>是</span>
        </el-form-item>
        <el-form-item label="广告图片" prop="titleImg">
          <el-upload
            :action="actionurl"
            name="reportFile"
            class="avatar-uploader"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="ruleForm.titleImg" :src="ruleForm.titleImg" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>

        <el-form-item label="链接" prop="url">
          <el-row >
            <el-col :span="14" >
              <el-input v-model="mainPath" :disabled="true" style="font-size: 13px"></el-input>
            </el-col>
            <el-col :span="10" style="padding-left: 17px">
              <el-button type="primary" plain @click="addId(1)">店铺广告</el-button>
              <el-button type="success" plain @click="addId(2)">商品广告</el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <!-- <el-form-item label="商品Id">
          <el-input v-model="ruleForm.commodityId" @blur="checkId()"></el-input>
        </el-form-item> -->
        <el-form-item label="排序" prop="orderby">
          <el-input v-model="ruleForm.orderby"  type="integer"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="content">
          <el-input v-model="ruleForm.content"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" plain @click="submitForm('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 弹窗-选择店铺 -->
    <el-dialog title="选择店铺" :visible.sync="dialogFormVisible2" center width="1200px">
      <!-- 头部 -->
      <el-row class="b_t_header">
        <el-col :span="12" class="asd">
          <div>
            <span class="green"></span>
            <strong></strong>
          </div>
        </el-col>
        <el-col :span="12">
          <el-row :gutter="20" type="flex" justify="end">
            <el-col :span="15">
              <div class="bor">
                <span>名称:</span>
                <el-input
                  v-model="shopTitle"
                  placeholder="请输入内容"
                  style="width:70%;"
                  @keyup.enter.native="getShopData"
                ></el-input>
              </div>
            </el-col>
            <el-col :span="1">
              <div class="bor2" @click="getShopData">
                <span class="el-icon-search"></span>
              </div>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
      <!-- 身体-列表 -->
      <el-table
        :data="shopList"
        :header-cell-style="{background:'#f0f4f5'}"
        style="width: 100%; background-color:#f0f4f5;margin-bottom:30px;"
      >
        <el-table-column label="商家头像" align="center">
          <template slot-scope="scope">
            <img :src="scope.row.shopImgUrl" alt class="img">
          </template>
        </el-table-column>
        <el-table-column label="商家名称" prop="shopName" align="center"></el-table-column>
        <el-table-column label="分类" prop="title" align="center">
          <template slot-scope="scope">
            <div>{{scope.row.firstClassifyName}}/{{scope.row.secondClassifyName}}/{{scope.row.thirdClassifyName}}</div>
          </template>
        </el-table-column>
        <el-table-column label="性质" align="center">
          <template slot-scope="scope">
            <div>{{scope.row.shopNature | getShopNature}}</div>
          </template>
        </el-table-column>
        <el-table-column label="联系人" prop="contactName" align="center"></el-table-column>
        <el-table-column label="联系电话" prop="contactPhone" align="center"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-tooltip effect="dark" content="确认" placement="top" v-if="!showCommodity">
              <el-button size="mini" type="primary" plain @click="comfirmShop(scope.row.shopId)">
                <span class="iconfont icon-zhengquewancheng"></span>
              </el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="去往选择商品" placement="top" v-if="showCommodity">
              <el-button size="mini" type="success" plain @click="goCommodity(scope.row.shopId)">
                <span class="iconfont icon-renwu"></span>
              </el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 脚部 -->
      <div class="bm_foot">
        <el-pagination
          class="Pagination"
          @size-change="shopHandleSizeChange"
          @current-change="shopHandleCurrentChange"
          :current-page="currentPage4"
          :page-sizes="[5, 10, 15, 30]"
          :page-size="5"
          layout="total, sizes, prev, pager, next, jumper"
          :total="shopTotal"
        ></el-pagination>
      </div>
    </el-dialog>

    <!-- 弹窗-选择商品 -->
    <el-dialog title="选择商品" :visible.sync="dialogFormVisible3" center width="1200px">
      <!-- 头部 -->
      <el-row class="b_t_header">
        <el-col :span="12" class="asd">
          <div>
            <span class="green"></span>
            <strong></strong>
          </div>
        </el-col>
        <el-col :span="12">
          <el-row :gutter="20" type="flex" justify="end">
            <el-col :span="15">
              <div class="bor">
                <span>名称:</span>
                <el-input
                  v-model="commodityTitle"
                  placeholder="请输入内容"
                  style="width:70%;"
                  @keyup.enter.native="getCommodityData"
                ></el-input>
              </div>
            </el-col>
            <el-col :span="1">
              <div class="bor2" @click="getCommodityData">
                <span class="el-icon-search"></span>
              </div>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
      <!-- 身体-列表 -->
      <el-table
        :data="commodityList"
        :header-cell-style="{background:'#f0f4f5'}"
        style="width: 100%; background-color:#f0f4f5;margin-bottom:30px;"
      >
        <el-table-column label="商品" align="center" min-width="100px" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-row type="flex" align="middle">
            <el-col :span="8">
              <img :src="scope.row.imgUrl" alt class="img">
            </el-col>
            <el-col :span="16">
              <div class="text">{{scope.row.name}}</div>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column label="品牌" prop="brandName" align="center"></el-table-column>
      <el-table-column label="商品标签" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.commodityArea | names}}</span>
        </template>
      </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-tooltip effect="dark" content="确认" placement="top">
              <el-button size="mini" type="primary" plain @click="comfirmCommodity(scope.row.commodityId)">
                <span class="iconfont icon-zhengquewancheng"></span>
              </el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 脚部 -->
      <div class="bm_foot">
        <el-pagination
          class="Pagination"
          @size-change="commodityHandleSizeChange"
          @current-change="commodityHandleCurrentChange"
          :current-page="currentPage4"
          :page-sizes="[5, 10, 15, 30]"
          :page-size="5"
          layout="total, sizes, prev, pager, next, jumper"
          :total="commodityTotal"
        ></el-pagination>
      </div>
    </el-dialog>

    <!-- 弹窗-删除 -->
    <el-dialog
      title="提醒"
      :visible.sync="centerDialogVisible"
      width="28%"
      center>
      <div class="delIcon"><span class="iconfont icon-gantanhao-yuankuang"></span></div>
      <div class="deltext"><span >你确定要删除此广告吗?</span></div>
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
      addTitle:'添加广告',

      dialogFormVisible2: false, // 商家弹窗
      shopTitle:'', // 商家搜索
      showCommodity: false, // 商家或商品确认按钮是否展示
      shopPage: 1, //业数
      shopRows: 5, //条数
      shopTotal:0, // 店铺总页数
      shopList: [], // 店铺列表

      dialogFormVisible3: false, // 商品弹窗
      commodityTitle:'', // 商家搜索
      commodityPage: 1, //页数
      commodityRows: 5, //条数
      commodityTotal:0, // 店铺总页数
      commodityList: [], // 店铺列表
      shopId:'',

      one: [], // 级联选择器
      selectedOptions: [],
      selectedOptions2: [], // 级联选择器
      selectedOptions3: [], // 级联选择器
      tow: [], // 弹窗级联选择器
      actionurl: this.apis.uploadImg, //图片路径
      dialogFormVisible: false, //弹窗-编辑
      dos: false,
      currentPage4: 1,
      AD_tableData: [],
      total: 0, //总页数
      page: 1, //业数
      rows: 10, //条数
      title: "", //搜索
      centerDialogVisible:false,//删除弹窗
      delId: Number, //需要删除的id
      valNum: "",
      mainPath: "https://new.zhulixc.com/#/",
      ruleForm: {
        dos: false,
        flashId: "",
        title: "",
        titleImg: "",
        typeCode: "",
        url: "",
        orderby: "",
        commodityId: "",
        status: 0,
        content: ""
      },
      rules: {
        title: [{ required: true, message: "请输入名称", trigger: "blur" }],
        typeCode: [
          { required: true, message: "请选择位置", trigger: "blur" }
        ],

        url: [{ required: true, message: "请填写链接", trigger: "blur" }],
        // commodityId: [
        //   { required: true, message: "请填写商品id", trigger: "change" }
        // ],
        titleImg: [
          { required: true, message: "请输上传图片", trigger: "blur" }
        ],
        orderby: [{ required: true, validator: indexNum, trigger: "blur" }],
        content: [{ required: true, message: "请填写描述", trigger: "blur" }]
      }
    };
  },
  created() {
    this.getData();
    this.getRes();
  },
  methods: {
    handleChange(value) {
      let valNum = value[value.length - 1];
      this.getData(valNum);
    },
    handleChange2(value) {
      this.ruleForm.typeCode = value[value.length - 1];
    },
    // 接口
    //获取数据列表
    getData(val) {
      let obj = {
        params: {
          typeCode: val,
          title: this.title,
          page: this.page,
          rows: this.rows
        }
      };
      this.axiosReq(this.apis.queryAds, "get", obj).then(res => {
        if (res.data.status == 200) {
          this.AD_tableData = res.data.data.items;
          this.total = res.data.data.total;
        } else {
          this.$message({
            message: res.data.msg,
            typr: "warning"
          });
        }
      });
    },
    // 获取位置信息
    getRes() {
      this.axiosReq(this.LOCAL+this.apis.AdsPositionList, "get").then(res => {
        if (res.status == 200) {
          this.one = [];
          // 一级
          res.data.data.forEach(item => {
            if (item.parentId == 0) {
              this.one.push({
                id: item.id,
                value: item.code,
                label: item.name,
                parentId: item.parentId,
                children: []
              });
            }
          });
          //二级
          res.data.data.forEach(item => {
            this.one.forEach(item2 => {
              if (item.parentId == item2.id) {
                item2.children.push({
                  id: item.id,
                  value: item.code,
                  label: item.name,
                  parentId: item.parentId,
                  children: []
                });
              }
            });
          });
          //三级
          res.data.data.forEach(item => {
            this.one.forEach(item2 => {
              item2.children.forEach(item3 => {
                if (item.parentId == item3.id) {
                  item3.children.push({
                    id: item.id,
                    value: item.code,
                    label: item.name,
                    parentId: item.parentId
                  });
                }
              });
            });
          });
          res.data.data.forEach(item => {
            this.one.forEach(item2 => {
              item2.children.forEach(item3 => {
                if (item3.children) {
                  if (item3.children.length == false) {
                    this.$delete(item3, "children");
                  }
                } else {
                  return;
                }
              });
            });
          });

          this.tow = this.one;
        }
      });
    },
    // 添加
    AddData(obj) {
      this.axiosReq(this.apis.saveAds, "post", obj).then(res => {
        if (res.data.status == 200) {
          this.$message({
            message: "添加成功",
            type: "success"
          });
        } else {
          this.$message.error("添加失败");
        }
        this.getData();
      });
    },
    // 更改
    upData(obj) {
      this.axiosReq(this.apis.updateAds, "post", obj).then(res => {
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
      this.axiosReq(this.apis.deldateAds + id, "get").then(res => {
        if (res.status == 200) {
          this.$message({
            message: "删除成功",
            type: "success"
          });
          this.centerDialogVisible =! this.centerDialogVisible
          this.getData();
        } else {
          this.$message.error("删除失败");
        }
        
      });
    },
    // 查询商品id是否存在
    // checkId () {
    //   if( this.ruleForm.commodityId ) {
    //      let obj ={
    //     params: {
    //       commodityId:this.ruleForm.commodityId
    //     }
    //   }
    //   this.axiosReq(this.apis.checkByCommodityId, "get", obj).then(res => {
    //     if(res.data.status == 200) {
    //       this.$message({
    //         message: res.data.data,
    //         type: "success"
    //       });
    //     } else {
    //       this.ruleForm.commodityId = ""
    //       this.$message.error(res.data.msg);
    //     }
    //   })
    //   .catch(err => {
    //     this.ruleForm.commodityId = ""
    //   });
    //   } else {
    //     return 
    //   }
    // },
    //是否展示
    change(val) {
      if (val == 1) {
        return true;
      } else {
        return false;
      }
    },
    // 首页
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
      this.getRes();
      this.getData();
    },
    dialogFormVisibleChange(val) {
      let selectedOptions2 = [];
      if (val) {
        this.dos = false;
        // 格式化-获取广告编码
        this.tow.forEach(item => {
          if (val.typeCode == item.value) {
            selectedOptions2[0] = item.value;
          } else {
            this.tow.forEach(item => {
              item.children.forEach(item2 => {
                if (val.typeCode == item2.value) {
                  selectedOptions2[0] = item.value;
                  selectedOptions2[1] = item2.value;
                } else {
                  this.tow.forEach(item => {
                    item.children.forEach(item2 => {
                      if( item2.children){
                       item2.children.forEach(item3 => {
                          if(val.typeCode == item3.value) {
                            selectedOptions2[0] = item.value;
                            selectedOptions2[1] = item2.value;
                            selectedOptions2[2] = item3.value;
                          }
                        });
                      }
                    })
                  })
                }
              })
            });
          }
        });
        this.addTitle = '修改广告'
        this.mainPath = "https://new.zhulixc.com/#/"+val.url
        this.selectedOptions2 = selectedOptions2;
        this.ruleForm.typeCode = selectedOptions2[selectedOptions2.length - 1];
        this.ruleForm.flashId = val.flashId;
        this.ruleForm.title = val.title;
        (this.ruleForm.titleImg = val.titleImg),
          (this.ruleForm.status = val.status);
        (this.ruleForm.dos = val.status == 0 ? false : true),
          (this.ruleForm.url = val.url),
          (this.ruleForm.commodityId = val.commodityId || ''),
          (this.ruleForm.orderby = val.orderby),
          (this.ruleForm.content = val.content);
      } else {
        this.dos = true;
        this.addTitle = '添加广告'
        this.selectedOptions2 = [];
        this.ruleForm.typeCode = "";
        this.ruleForm.flashId = "";
        this.ruleForm.title = "";
        this.ruleForm.titleImg = "";
        this.ruleForm.status = 1;
        (this.ruleForm.dos = true),
          (this.ruleForm.url = ""),
          (this.ruleForm.commodityId = ""),
          (this.ruleForm.orderby = ""),
          (this.ruleForm.content = "");
      }
      this.dialogFormVisible = !this.dialogFormVisible;
    },

    ifRecommendchange1(val) {
      if (val.status == 1) {
        val.status = 0;
      } else {
        val.status = 1;
      }
      let obj = {
        data: val
      };
      this.upData(obj);
    },
    ifRecommendchange2() {
      if (this.ruleForm.dos) {
        this.ruleForm.status = 1;
      } else {
        this.ruleForm.status = 0;
      }
    },
    // 添加
    addBrand() {
      this.dos = true;
      this.dialogFormVisible = !this.dialogFormVisible;
    },
    // 弹窗-提交
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let obj = {
            data: {
              flashId:this.ruleForm.flashId,
              title: this.ruleForm.title,
              titleImg: this.ruleForm.titleImg,
              typeCode: this.ruleForm.typeCode,
              url: this.ruleForm.url,
              orderby: this.ruleForm.orderby,
              commodityId: this.ruleForm.commodityId,
              status: this.ruleForm.status,
              content: this.ruleForm.content
            }
          };
          if (!this.dos) {
            this.upData(obj);
            this.dialogFormVisible = false;
          } else {
            this.AddData(obj);
            this.dialogFormVisible = false;
          }
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    // 上传图片
    handleAvatarSuccess(res, file) {
      this.ruleForm.titleImg = res.path;
    },
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 10;

      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isLt2M;
    },
    getSearch() {
      this.getData();
    },


    // 选择店铺或商品
    addId (val) {
      this.dialogFormVisible2 = !this.dialogFormVisible2
      if (val == 2) {
        this.showCommodity = true
      } else {
        this.showCommodity = false
      }
      this.getShopData()
    },
    // 店铺
    getShopData () {
      let obj = {
        params: {
          shopName: this.shopTitle,
          page: this.shopPage,
          rows: this.shopRows
        }
      };
      this.axiosReq(this.apis.queryShopList, "get", obj).then(res => {
        if (res.data.status == 200) {
          this.shopList = res.data.data.items;
          this.shopTotal = res.data.data.total;
        } else {
          this.$message({
            message: res.data.msg,
            typr: "warning"
          });
        }
      })
    },
    // 店铺分页
    shopHandleSizeChange(val) {
      this.shopRows = val;
      this.getShopData();
    },
    shopHandleCurrentChange(val) {
      this.shopPage = val;
      this.getShopData();
    },
    // 确认店铺
    comfirmShop (id) {
      this.ruleForm.url = 'indexS?shopId='+id
      this.mainPath = "https://new.zhulixc.com/#/" + this.ruleForm.url
      this.dialogFormVisible2 = !this.dialogFormVisible2
    },
    // 商品
    goCommodity (id) {
      this.dialogFormVisible3 = !this.dialogFormVisible3
      this.shopId = id
      this.getCommodityData ()
    },
    getCommodityData () {
      let obj = {
        params: {
          shopId: this.shopId,
          name: this.commodityTitle,
          page: this.commodityPage,
          rows: this.commodityRows
        }
      };
      this.axiosReq(this.apis.goodsList, "get", obj).then(res => {
        if (res.status == 200) {
          this.commodityList = res.data.items;
          this.commodityTotal = res.data.total;
        } else {
          this.$message({
            message: res.data.msg,
            typr: "warning"
          });
        }
      })
    },
    // 店铺分页
    commodityHandleSizeChange(val) {
      this.commodityRows = val;
      this.getCommodityData();
    },
    commodityHandleCurrentChange(val) {
      this.commodityPage=val;
      this.getCommodityData();
    },
    comfirmCommodity (id) {
      console.log(id)
      this.ruleForm.url = 'detail?id='+ id
      this.mainPath = "https://new.zhulixc.com/#/" + this.ruleForm.url
      this.ruleForm.commodityId = id
      this.dialogFormVisible2 = !this.dialogFormVisible2
      this.dialogFormVisible3 = !this.dialogFormVisible3
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
  filters: {
    un(data) {
      if (data == 0) {
        return "无";
      } else {
        return data;
      }
    },
    getShopNature(data){
      //格式化店铺类型
      if(data == 1){
        return "个人";
      } else if(data == 2){
        return "企业"
      }else{
        return "未知"
      }
    },
    names(data) {
      if (data == 0) {
        return "普通商品";
      } else if (data == 1) {
        return "生态商品";
      } else if (data == 2) {
        return "一村一品";
      } else if (data == 3) {
        return "会员商品";
      } else if (data == 4) {
        return "积分商品";
      }
    },
  }
};
</script>

<style lang="less">
.adsense {
  width: 100%;
  min-height: 100%;
  .cascader{
    width: 240px;
  }
  .block {
    margin-bottom: 20px;
    display: flex;
    justify-content: space-between;
    .btn {
      width: 100px;
      background-color: #00ae87;
      margin-right: 10px;
    }
  }
  .el-icon-delete {
    font-size: 16px;
  }
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
    .btn {
      width: 100px;
      background-color: #00ae87;
    }
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
