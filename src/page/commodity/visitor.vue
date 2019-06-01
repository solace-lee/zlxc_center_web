<template>
  <div class="visitor">
    <div class="v_header">
      <span></span>
      <strong>商品发布</strong>
    </div>
    <div class="v_body">
      <div class="v_b_first">
        <span>商品基本信息</span>
      </div>
      <el-form
        :model="ruleForm"
        ref="ruleForm"
        :rules="rules"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="商品名称" prop="name">
          <el-input v-model="ruleForm.name" style="width:780px"></el-input>
        </el-form-item>
        <el-row type="flex" justify="start" >
          <el-col :span="4.5" >
            <el-form-item prop="firstClassifyId" label="分类">
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
          </el-col>
          <el-col :span="4.5" >
            <el-form-item prop="secondClassifyId" class="twoClass">
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
          </el-col>
          <el-col :span="4.5">
            <el-form-item prop="thirdClassifyId">
              <el-select
                v-model="ruleForm.thirdClassifyId"
                placeholder="请选择三级分类"
                @change="getSpecOrBrand(ruleForm.thirdClassifyId)"
              >
                <el-option
                  v-for="(item, index) in three"
                  :key="index"
                  :label="item.classifyName"
                  :value="item.classifyId"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row >
          <el-col :span="8">
            <el-form-item label="品牌">
              <el-select v-model="ruleForm.brandId" placeholder="请选择品牌" @change="getBrandName">
                <el-option
                  v-for="(item, index) in brandList"
                  :key="index"
                  :label="item.brandName"
                  :value="item.brandId"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item prop="commodityArea" label="商品标签">
              <el-select
                v-model="ruleForm.commodityArea"
                placeholder="请选择标签"
                style="margin-right:30px"
              >
                <div v-for="(item,index) in label" :key="index">
                  <el-option :label="item.name" :value="item.id"></el-option>
                </div>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="商品服务" prop="linkCommodityServers">
          <el-checkbox-group v-model="ruleForm.linkCommodityServers" @change="ifFreePostage()">
            <el-checkbox
              v-for="(item,index) in checkboxList"
              :key="index"
              :label="item.serverId"
              @change="editServer(item)"
            >{{item.serverCode}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <div v-for="(item, index) in ruleForm.tbLinkCommoditySpecifications" :key="index">
          <el-form-item
            label="商品规格"
            :prop="'tbLinkCommoditySpecifications.' + index + '.specificationId'"
            :rules="{required: true, message: '请填写商品规格', trigger: 'change' }"
            v-if="item.doc"
          >
            <el-select
              v-model="item.specificationId"
              placeholder="请选择商品规格"
              @change="getName(item.specificationId,item)"
              style="margin-right:30px"
            >
              <el-option
                v-for="(item3, index3) in spec"
                :key="index3"
                :label="item3.specName"
                :value="item3.specId"
              ></el-option>
            </el-select>
            <!-- <el-button type="success" plain @click="addAll()">添加</el-button>
            <el-button @click="subAll(index)">删除</el-button>-->
          </el-form-item>

          <div>
            <el-form-item class="addSss">
              <el-col :span="5">
                <el-form-item
                  :label="specName2"
                  :prop="'tbLinkCommoditySpecifications.' + index + '.linkValue'"
                  :rules="{required: true, message: '请填写尺寸', trigger: 'change' }"
                >
                  <el-input v-model="item.linkValue" style="width:50%"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item
                  label="市场价"
                  :prop="'tbLinkCommoditySpecifications.' + index + '.price'"
                  :rules="money.Commodity.price"
                  v-if="ruleForm.commodityArea == 0 || ruleForm.commodityArea == 1"
                >
                  <el-input v-model="item.price" style="width:50% " type="number"></el-input>
                </el-form-item>
                <el-form-item
                  label="市场价"
                  :prop="'tbLinkCommoditySpecifications.' + index + '.price'"
                  :rules="money.Commodity.price"
                  v-if="ruleForm.commodityArea == 3"
                >
                  <el-input v-model="item.price" style="width:50% " type="number"></el-input>
                </el-form-item>
                <!-- <el-form-item
                  label="平台价"
                  :prop="'tbLinkCommoditySpecifications.' + index + '.price'"
                  :rules="money.Commodity.price"
                  v-if="ruleForm.commodityArea == 4"
                >
                  <el-input v-model="item.price" style="width:50% " type="number"></el-input>
                </el-form-item> -->
              </el-col>
              <el-col :span="5" v-if="ruleForm.commodityArea == 2">
                <el-form-item
                  label="折扣价"
                  :prop="'tbLinkCommoditySpecifications.' + index + '.discountPrice'"
                  :rules="money.Commodity.discountPrice"
                >
                  <el-input v-model="item.discountPrice" style="width:50%" type="number"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="5" v-if="ruleForm.commodityArea == 0 ">
                <el-form-item
                  label="平台价"
                  :prop="'tbLinkCommoditySpecifications.' + index + '.discountPrice'"
                  :rules="money.Commodity.discountPrice"
                >
                  <el-input v-model="item.discountPrice" style="width:50%" type="number"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="5" v-if="ruleForm.commodityArea == 1">
                <el-form-item
                  label="专享价"
                  :prop="'tbLinkCommoditySpecifications.' + index + '.discountPrice'"

                >
                <!-- :rules="money.Commodity.discountPriceJj" -->
                  <el-input v-model="item.discountPrice" disabled style="width:50%" type="number"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="5" v-if="ruleForm.commodityArea == 4">
                <el-form-item
                  label="积分"
                  :prop="'tbLinkCommoditySpecifications.' + index + '.discountPrice'"
                  :rules="money.Commodity.discountPriceJf"
                >
                  <el-input v-model="item.discountPrice" style="width:50%" type="number"></el-input>
                </el-form-item>
              </el-col>
              <!-- <el-col :span="5" v-if="ruleForm.commodityArea == 3">
                <el-form-item
                  label="会员价"
                  :prop="'tbLinkCommoditySpecifications.' + index + '.discountPrice'"
                  :rules="money.Commodity.discountPriceHy"
                >
                  <el-input v-model="item.discountPrice" style="width:50%" type="number"></el-input>
                </el-form-item>
              </el-col> -->
              <el-col :span="5">
                <el-form-item
                  label="库存"
                  :prop="'tbLinkCommoditySpecifications.' + index + '.num'"
                  :rules="money.Commodity.num"
                >
                  <el-input v-model="item.num" style="width:50%" type="number"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item>
                  <el-button type="success" plain @click="addAll(item, index)">添加</el-button>
                  <el-button @click="subAll(item,index)">删除</el-button>
                </el-form-item>
              </el-col>
            </el-form-item>
          </div>
        </div>
        <el-form-item label="是否上架">
          <el-switch
            :value="isPutawayChange()"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="putaway()"
          ></el-switch>
        </el-form-item>

        <div class="v_b_first" style="margin-bottom:30px;">
          <span>商品基本信息</span>
        </div>
        <el-form-item label="商品图片" prop="imgUrlList">
          <el-upload
            :action="actionurl"
            name="reportFile"
            accept=".jpg, .jpeg, .png, .gif, .pdf, .doc, .docx, .xls, .xlsx, .JPG, .JPEG, .PBG, .GIF, .PDF, .DOC, .DOCX, .XLS, .XLSX"
            list-type="picture-card"
            :file-list="ruleForm.imgUrlList"
            :show-file-list="true"
            :limit="5"
            :on-success="handleAvatarSuccess"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :before-upload="beforeAvatarUpload"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <el-upload
              width="100%"
              :action="actionurl"
              class="upBtn2"
              name="reportFile"
              accept=".jpg, .jpeg, .png, .gif, .pdf, .doc, .docx, .xls, .xlsx, .JPG, .JPEG, .PBG, .GIF, .PDF, .DOC, .DOCX, .XLS, .XLSX"
              :on-success="handlePreviewEdit"
              multiple
              :limit="1"
              :show-file-list="false"
            >
              <el-button type="success" class="upBtn">重新上传</el-button>
            </el-upload>
            <img width="100%" :src="dialogImageUrl" alt>
          </el-dialog>
        </el-form-item>

        <el-form-item label="商品描述" prop="commodityDescribe">
          <el-input v-model="ruleForm.commodityDescribe" style="width:780px"></el-input>
        </el-form-item>

        <el-form-item label="商品详情" prop="commodityDetails" label-height="100px">
          <div class="edit_container">
            <!-- 富文本 -->
            <quill-editor
              v-model="ruleForm.commodityDetails"
              ref="myQuillEditor"
              class="editer"
              :options="editorOption"
              @ready="onEditorReady($event)"
            ></quill-editor>
            <!-- 富文本-上传图片 -->
            <el-upload
            v-show="false"
              id=quill_editor_img
              :action="actionurl"
              name="reportFile"
              :show-file-list="false"
              :on-success="quill_editor_handleAvatarSuccess"
              accept=".jpg, .jpeg, .png, .gif, .pdf, .doc, .docx, .xls, .xlsx, .JPG, .JPEG, .PBG, .GIF, .PDF, .DOC, .DOCX, .XLS, .XLSX"
              >
              <i class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </div>
          <!-- <el-input type="textarea" v-model="" :rows="15" style="width:780px"></el-input> -->
        </el-form-item>

        <el-form-item style="margin-top:20px">
          <div class="center">
            <el-button type="success" @click="submitForm('ruleForm')">提交</el-button>
            <el-button @click="resetForm('ruleForm')">返回</el-button>
          </div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { quillEditor } from "vue-quill-editor"; // 调用富文本编辑器
import { addQuillTitle } from '@/config/quill-title.js'; // 调用富文本编辑器提示
import {
  priceCheck,
  discountCheck,
  discountJJCheck,
  discountJFCheck,
  quantityCheck,
  discountHYCheck
} from "@/config/formChange";// 规格的价格校验法制
import { log } from 'util';
export default {
  components: {
    //使用编辑器
    quillEditor
  },
  data() {
    return {
      // 富文本
      editorOption: {
        placeholder: '请输入内容...',
        modules: {
          // 头部菜单
          toolbar: {
            container:[
              [
                { header: 1 },
                "bold",
                "italic",
                "underline",
                "strike",
                "blockquote",
                "image",
                "align",
                "link",
              ],
              [{ color: [] }, { background: [] }],
            ],
            handlers: {
              'image': function (value) {
                if (value) {
                  // 触发input框选择图片文件
                  document.querySelector('#quill_editor_img input').click()
                } else {
                  this.quill.format('image', false);
                }
              }
            }
          }
        }
      },
      actionurl: this.apis.uploadImg, //图片路径
      // 服务列表
      checkboxList: [
        { serverId: 1, serverCode: "七天无理由退货" },
        { serverId: 2, serverCode: "品质保证" },
        { serverId: 3, serverCode: "假一罚十" },
        { serverId: 4, serverCode: "包邮" }
      ],
      // 以及分类列表
      one: [], //1级
      two: [], //2级
      three: [], //3级
      spec: [], //规格列表
      specName2: '尺寸',
      brandList: [], //品牌列表
      label: [],
      pieData: {},
      dialogImageUrl: "",
      dialogVisible: false,
      commodityId: "",
      shopId: "",
      imgIds: [], //需要修改的图片id
      linkValueIds: [],
      ruleForm: {
        isFreePostage: 0,
        quantity: Number, //总数量
        brandId: "", //品牌id
        brandName: "",
        name: "", //商品名称
        commodityDescribe: "", //商品描述
        integral: "", //积分*
        isPutaway: 1, //是否上架
        salesVolume: 0, //销量*
        isFreePostage: 0, //是否包邮
        firstClassifyId: "", //分类1
        secondClassifyId: "", //分类2
        thirdClassifyId: "", //分类3
        commodityArea: "", //商品标签
        linkCommodityServers: [], //服务
        linkCommodityServers2: [], //服务
        resource: "",
        commodityDetails: "", //详情
        imgUrlList: [],
        imgUrl: "", // 图片 tbCommodityImgs
        imgType: "", // 图片类型 tbCommodityImgs
        value2: "",
        tbLinkCommoditySpecifications: [
          {
            doc: true,
            specificationId: "",
            specificationName: "",
            linkValue: "",
            price: "",
            discountPrice: "",
            num: ""
          }
        ]
      },
      rules: {
        name: [{ required: true, message: "请输入商品名称", trigger: "blur" }],
        name2: [{ required: true}],
        // 分类
        firstClassifyId: [
          { required: true, message: "请选择分类1", trigger: "change" }
        ],
        secondClassifyId: [
          { required: true, message: "请选择分类2", trigger: "change" }
        ],
        thirdClassifyId: [
          { required: true, message: "请选择分类3", trigger: "change" }
        ],
        // brandId: [{ required: true, message: "请输入品牌", trigger: "change" }],
        commodityArea: [
          {
            type: "date",
            required: true,
            message: "请选择标签",
            trigger: "blur"
          }
        ],
        linkCommodityServers: [
          {
            type: "array",
            required: true,
            message: "请至少选择一个商品服务",
            trigger: "blur"
          }
        ],
        resource: [
          { required: true, message: "请选择活动资源", trigger: "blur" }
        ],
        commodityDetails: [
          { required: true, message: "请填写商品详情", trigger: "blur" }
        ],
        imgUrlList: [
          { required: true, message: "请输上传图片", trigger: "blur" }
        ],
        commodityDescribe: [
          { required: true, message: "请填写商品描述", trigger: "blur" }
        ]
      },
      money: {
        Commodity: {
          price: [{ required: true, validator: priceCheck, trigger: "blur" }],
          discountPrice: [
            { required: true, validator: discountCheck, trigger: "blur" }
          ],
          discountPriceJj: [
            { required: true, validator: discountJJCheck, trigger: "blur" }
          ],
          discountPriceJf: [
            { required: true, validator: discountJFCheck, trigger: "blur" }
          ],
          discountPriceHy: [
            { required: true, validator: discountHYCheck, trigger: "blur" }
          ],
          num: [
            {
              required: true,
              validator: quantityCheck,
              trigger: "blur"
            }
          ]
        }
      }
    };
  },

  watch: {
    ruleForm: {
      handler: (val, oldval) => {
        const price = val.tbLinkCommoditySpecifications
        if (val.commodityArea == 1) {
          price.forEach((element, index) => {
            element.discountPrice = element.price
          })
        }
      },
      deep: true
    }
  },

  created() {
    this.getResOne();
    this.getLabel();
    this.editGood();
    this.getSpec();
  },
  mounted () {
    addQuillTitle();
  },
  computed: {
    editor() {
      return this.$refs.myQuillEditor.quill;
    }
  },
  methods: {
    // 接口
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
      this.brandList = [];
      this.ruleForm.brandId = "";
      // this.spec = [];
      this.ruleForm.tbLinkCommoditySpecifications.forEach(item => {
        item.specificationId = "";
      });
      this.axiosReq(this.LOCAL+this.apis.TwoLeve + id, "get").then(res => {
        if (res.status == 200) {
          this.two = res.data;
        }
      });
    },
    // 获取分类3
    goThree(id) {
      this.three = [];
      this.ruleForm.thirdClassifyId = "";
      this.brandList = [];
      // this.spec = [];
      this.ruleForm.brandId = "";
      // this.ruleForm.tbLinkCommoditySpecifications.forEach(item => {
      //   item.specificationId = "";
      // });
      this.axiosReq(this.LOCAL+this.apis.TwoLeve + id, "get").then(res => {
        if (res.status == 200) {
          this.three = res.data;
        }
      });
    },
    //获取规格 品牌
    getSpecOrBrand(id) {
      this.brandList = [];
      this.ruleForm.brandId = "";
      // this.spec = [];
      this.ruleForm.tbLinkCommoditySpecifications = [
        {
          doc: true,
          specificationId: "",
          specificationName: "",
          linkValue: "",
          price: "",
          discountPrice: "",
          num: ""
        }
      ];
      // this.ruleForm.tbLinkCommoditySpecifications.forEach(item => {
      //   item.specificationId = "";
      // });
      this.getBrand(id);
    },
    //获取规格
    getSpec(id) {
      this.axiosReq(this.LOCAL+this.apis.getCommoditySpec , "get").then(res => {
        if (res.data.status == 200) {
          this.spec = res.data.data;
        } else {
          this.$message({
            type: "warning",
            message: res.data.msg
          });
        }
      });
    },
    //获取品牌
    getBrand(id) {
      const obj = {
        params: {
          thirdClassifyId: id
        }
      };
      this.axiosReq(this.apis.getBrandManage, "get", obj).then(res => {
        if (res.data.status == 200) {
          if (res.data.data) {
            this.brandList = res.data.data;
          } else {
            return;
          }
        }
      });
    },
    // 获取标签
    getLabel() {
      this.axiosReq(this.apis.labelList, "get").then(res => {
        if (res.status == 200) {
          this.label = res.data.data;
        }
      });
    },
    //删除规格
    deleteSpeci(id) {
      let obj = {
        params: {
          csLinkId: id
        }
      };
      this.axiosReq(this.apis.deleteSpecification, "get", obj).then(res => {
        if (res.data.status == 200) {
          this.$message({
            type: "success",
            message: "删除成功"
          });
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    //删除服务
    deleteServer(id) {
      let obj = {
        params: {
          cserverLinkId: id
        }
      };
      this.axiosReq(this.apis.deleteCommodityServer, "get", obj).then(res => {
        if (res.data.status == 200) {
          this.$message({
            type: "success",
            message: "删除成功"
          });
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    //删除图片
    deleteImage(id) {
      let obj = {
        params: {
          imgId: id
        }
      };
      this.axiosReq(this.apis.deleteCommodityImg, "get", obj).then(res => {
        if (res.data.status == 200) {
          this.$message({
            type: "success",
            message: "删除成功"
          });
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    //更新
    upData(obj) {
      this.axiosReq(this.apis.upGood, "post", obj).then(res => {
        if (res.data.status == 200) {
          this.$message({
            type: "success",
            message: "恭喜你，更新成功"
          });
          this.$router.push({
            path: "/manageGoods"
          });
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    // 提交
    addGoods(obj) {
      this.axiosReq(this.apis.addGoods, "post", obj).then(res => {
        if (res.data.status == 200) {
          this.$message({
            type: "success",
            message: "恭喜你，发布成功"
          });
          this.$router.push({
            path: "/manageGoods"
          });
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    // 是否包邮 ,储存服务项
    ifFreePostage() {
      let boot = this.ruleForm.linkCommodityServers.some(item => item == 4);
      if (boot) {
        this.ruleForm.isFreePostage = 1;
      } else {
        this.ruleForm.isFreePostage = 0;
      }

      this.ruleForm.linkCommodityServers2 = [];
      this.ruleForm.linkCommodityServers.forEach(item => {
        this.checkboxList.forEach(item2 => {
          if (item2.serverId == item) {
            this.ruleForm.linkCommodityServers2.push(item2);
          }
        });
      });
    },
    //获取品牌名称
    getBrandName() {
      this.brandList.forEach(item => {
        if (this.ruleForm.brandId == item.brandId) {
          this.ruleForm.brandName = item.brandName;
        }
      });
    },
    // 上传图片
    handleAvatarSuccess(file, fileList) {
      fileList.name = fileList.name.split(".")[1];
      this.ruleForm.imgUrlList.push(fileList);
    },
    beforeAvatarUpload(file) {
      // const isJPG = file.type === 'image/jpeg';
      // const isGIF = file.type === 'image/gif';
      // const isPNG = file.type === 'image/png';
      // const isBMP = file.type === 'image/bmp';
      // if (!isJPG && !isGIF && !isPNG && !isBMP) {
      //   this.$message.error('上传图片必须是JPG/GIF/PNG/BMP 格式!');
      // }
      const isLt2M = file.size / 1024 / 1024 < 10;
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isLt2M;
    },
    // 上传图片-富文本
    quill_editor_handleAvatarSuccess (file, fileList) {
      
      let quill = this.$refs.myQuillEditor.quill
      console.log(file, fileList, quill)
      if (file) {
        let length = quill.getSelection().index;
        quill.insertEmbed(length, 'image', file.path)
        quill.setSelection(length + 1)
      }
    },
    // 删除图片
    handleRemove(file, fileList) {
      if (file.imgIds) {
        this.deleteImage(file.imgIds);
      }
      this.ruleForm.imgUrlList = fileList;
    },
    // 放大图片
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    // 从新上传
    handlePreviewEdit(file, fileList) {
      this.ruleForm.imgUrlList.forEach(item => {
        if (item.url == this.dialogImageUrl) {
          item.url = file.path;
          item.response.path = file.path;
          this.dialogImageUrl = file.path;
        }
      });
    },
    // 规格添加
    addAll(item, index) {
      if (item) {
        this.ruleForm.tbLinkCommoditySpecifications.splice(index + 1, 0, {
          doc: false,
          specificationId: item.specificationId,
          specificationName: item.specificationName,
          linkValue: "",
          originalPrice: "",
          discountPrice: "",
          num: ""
        });
      } else {
        this.ruleForm.tbLinkCommoditySpecifications.push({
          doc: true,
          specificationId: "",
          specificationName: "",
          linkValue: "",
          originalPrice: "",
          discountPrice: "",
          num: ""
        });
      }
    },
    // 规格删除
    subAll(val, i) {
      if (this.ruleForm.tbLinkCommoditySpecifications.length == 1) {
        this.$message({
            type: "warning",
            message: '至少保留一种规格'
          });
        return;
      } else {
        if(val.csLinkId) {
          this.deleteSpeci(val.csLinkId);
        }
        this.ruleForm.tbLinkCommoditySpecifications.splice(i, 1);
      }
    },
    //更改服务（删除服务id）
    editServer(val) {
      if (val.cserverLinkId) {
        this.deleteServer(val.cserverLinkId);
        this.checkboxList.forEach(item => {
          if (item.cserverLinkId == val.cserverLinkId) {
            this.$delete(item, "cserverLinkId");
          }
        });
      }
    },
    // 控制状态
    isPutawayChange() {
      if (this.ruleForm.isPutaway == 1) {
        return true;
      } else {
        return false;
      }
    },
    //控制状态2
    putaway() {
      if (this.ruleForm.isPutaway == 0) {
        this.ruleForm.isPutaway = 1;
      } else {
        this.ruleForm.isPutaway = 0;
      }
    },
    getName(id, val) {
      this.spec.forEach(item => {
        if (item.specId == id) {
          val.specificationName = item.specName;
        }
      });
      this.specName2 = val.specificationName
      this.ruleForm.tbLinkCommoditySpecifications = [
        {
          doc: true,
          specificationId: id,
          specificationName: val.specificationName,
          linkValue: "",
          price: "",
          discountPrice: "",
          num: ""
        }
      ];
    },
    // 提交
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const tbCommodityImgs = [];
          const tbLinkCommoditySpecifications = [];
          this.ruleForm.imgUrlList.forEach((item, index) => {
            tbCommodityImgs.push({
              imgUrl: item.response.path,
              imgType: 1,
              imgId: item.imgIds || ""
            });
          });
          this.ruleForm.tbLinkCommoditySpecifications.forEach((item, index) => {
            tbLinkCommoditySpecifications.push({
              specificationId: item.specificationId,
              specificationName: item.specificationName,
              linkValue: item.linkValue,
              price: item.price - 0,
              discountPrice: item.discountPrice - 0,
              num: item.num - 0,
              csLinkId: item.csLinkId || ""
            });
          });

          const obj = {
            data: {
              commodity: {
                commodityId: this.commodityId,
                shopId: this.shopId,
                firstClassifyId: this.ruleForm.firstClassifyId, //一级分类
                secondClassifyId: this.ruleForm.secondClassifyId, //二级分类
                thirdClassifyId: this.ruleForm.thirdClassifyId, //三级分类
                brandId: this.ruleForm.brandId, //品牌id
                brandName: this.ruleForm.brandName, //品牌名称
                name: this.ruleForm.name, //商品名称
                commodityDescribe: this.ruleForm.commodityDescribe, //商品描述
                isPutaway: this.ruleForm.isPutaway, //是否上下架
                commodityDetails: this.ruleForm.commodityDetails, //商品详情
                commodityArea: this.ruleForm.commodityArea, //商品标签
                imgUrl: this.ruleForm.imgUrlList[0].response.path, //图片路径
                isFreePostage: this.ruleForm.isFreePostage //是否包邮
              },
              linkCommodityServers: this.ruleForm.linkCommodityServers2,
              tbLinkCommoditySpecifications: tbLinkCommoditySpecifications,
              tbCommodityImgs: tbCommodityImgs
            }
          };
          const isId = this.$route.query.id || "";
          if (isId !== "") {
            this.upData(obj);
          } else {
            this.addGoods(obj);
          }
        } else {
          // console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      // this.$refs[formName].resetFields();
      this.$router.go(-1);
    },
    //富文本
    onEditorReady(editor) {
      // console.log("editor ready!", editor);
    },
    //服务默认
    linkChecked(val) {},
    //编辑初始化
    editGood() {
      const isId = this.$route.query.id || "";
      if (isId !== "") {
        let obj = {
          params: {
            commodityId: isId
          }
        };
        this.axiosReq(this.apis.queryCommodityList, "get", obj).then(res => {
          if (res.data.status == 200) {
            this.commodityId = res.data.data.commodity.commodityId;
            this.shopId = res.data.data.commodity.shopId;
            this.ruleForm.quantity = res.data.data.commodity.quantity;
            this.ruleForm.brandId = res.data.data.commodity.brandId;
            this.ruleForm.brandName = res.data.data.commodity.brandName;
            this.ruleForm.name = res.data.data.commodity.name;
            this.ruleForm.commodityDescribe =
              res.data.data.commodity.commodityDescribe;
            this.ruleForm.isPutaway = res.data.data.commodity.isPutaway;
            this.ruleForm.isFreePostage = res.data.data.commodity.isFreePostage;
            this.ruleForm.commodityDetails =
              res.data.data.commodity.commodityDetails;
            this.ruleForm.commodityArea = res.data.data.commodity.commodityArea;
            this.ruleForm.imgUrl = res.data.data.commodity.imgUrl;

            this.getResOne();
            this.goTwo(res.data.data.commodity.firstClassifyId);
            this.goThree(res.data.data.commodity.secondClassifyId);
            this.getSpecOrBrand(res.data.data.commodity.thirdClassifyId);

            this.ruleForm.firstClassifyId =
              res.data.data.commodity.firstClassifyId;
            this.ruleForm.secondClassifyId =
              res.data.data.commodity.secondClassifyId;
            this.ruleForm.thirdClassifyId =
              res.data.data.commodity.thirdClassifyId;
            this.ruleForm.brandId = res.data.data.commodity.brandId;
            //linkCommodityServers
            let list = [];
            res.data.data.linkCommodityServers.forEach(item => {
              this.ruleForm.linkCommodityServers.push(item.serverId);
              list.push({
                serverCode: item.serverCode,
                serverId: item.serverId,
                cserverLinkId: item.cserverLinkId
              });
              this.checkboxList.forEach(item4 => {
                if (item4.serverId == item.serverId) {
                  item4.cserverLinkId = item.cserverLinkId;
                }
              });
            });

            this.ruleForm.linkCommodityServers2 = list;
            this.ruleForm.tbLinkCommoditySpecifications = [];
            res.data.data.tbLinkCommoditySpecifications.forEach(item2 => {
              this.ruleForm.tbLinkCommoditySpecifications.push({
                doc: false,
                specificationId: item2.specificationId,
                specificationName: item2.specificationName,
                linkValue: item2.linkValue,
                price: item2.price,
                discountPrice: item2.discountPrice,
                num: item2.num,
                csLinkId: item2.csLinkId
              });
              this.linkValueIds.push(item2.csLinkId);
            });
            this.ruleForm.tbLinkCommoditySpecifications[0].doc = true;
            // imgUrlList
            this.ruleForm.imgUrlList = [];
            // this.ruleForm.imgUrlList.push({
            //   name: 1,
            //   url: res.data.data.commodity.imgUrl,
            //   response: {
            //     path: res.data.data.commodity.imgUrl
            //   }
            // });
            // let arr = res.data.data.tbCommodityImgs.splice(1, 1);
            res.data.data.tbCommodityImgs.forEach(item3 => {
              this.ruleForm.imgUrlList.push({
                name: item3.imgType,
                url: item3.imgUrl,
                response: {
                  path: item3.imgUrl
                },
                imgIds: item3.imgId || ""
              });
              this.imgIds.push(item3.imgId);
            });
          }
        });
      }
    }
  }
};
</script>

<style lang="less" scope>
// @import '../style/mixin';
@import "../../../node_modules/quill/dist/quill.core.css";
@import "../../../node_modules/quill/dist/quill.snow.css";
@import "../../../node_modules/quill/dist/quill.bubble.css";

.visitor {
  .v_header {
    width: 97.5%;
    padding: 20px;
    font-size: 16px;
    background-color: #fff;
    border-radius: 4px;
    span {
      display: inline-block;
      vertical-align: middle;
      width: 4px;
      height: 16px;
      margin-right: 5px;
      background-color: #00ae87;
    }
  }
  //文本编辑器
  .edit_container {
    padding-bottom: 20px;
    margin-bottom: 40px;
  }
  .editer {
    width: 80%;
    height: 350px;
  }
  //居中
  .center {
    width: 80%;
    text-align: center;
  }
  .v_body {
    .v_b_first {
      width: 97.5%;
      padding: 20px;
      font-size: 16px;
      background-color: #f0f4f5;
    }
    .demo-ruleForm {
      padding: 20px 0px;
      background-color: #fff;
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
    .addSss {
      .el-form-item__content {
        margin-left: 0px !important;
        text-align: left !important;
      }
      .el-form-item__error {
        margin-left: 100px;
      }
    }
    .imgList {
      display: flex;
      justify-content: flex-start;
      div {
        margin-right: 20px;
      }
    }
  }
  .upBtn2 {
    width: 100%;
  }
  .upBtn {
    width: 100%;
    button {
      width: 100%;
    }
  }
}
</style>
