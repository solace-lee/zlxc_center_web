//消息通知  June
<template>
        <div>
            <head-top></head-top>
            <div class="news-page">
                <div class="news-col title">消息通知</div>
                <el-row class="el-row" :gutter="20" v-for='(item,index) in tableData.items' :key="index">
                    <el-col class="news-col col-left" :span="3"><div style="padding-left: 20px;">图片预留</div></el-col>
                    <el-col class="news-col col-info" :span="9"><div>{{item.messageContent}}</div></el-col>
                    <el-col class="news-col col-right" :span="9"><div>{{item.userMsgId}}</div></el-col>
                    <el-col class="news-col col-right" :span="3">
                        <div>
                            <el-button style="padding: 0;color: #333;" type="text" @click="del">{{item.delString}}</el-button>
                        </div>
                    </el-col>
                </el-row>
                <div class="block">
                    <el-pagination
                        layout="prev, pager, next"
                        :total="tableData.total">
                    </el-pagination>
                </div>
            </div>
        </div>
</template>

<script>
import headTop from '../components/headTop'
export default {
    data() {
        return {
            tableData: null   
            }
        },
        components:{
            headTop
        },
        async created(){
            await this.init();
        },
        methods:{
            //初始化
            init(){
                this.getNews();
            },
            async getNews(){
				await this.axiosReq(this.apis.news,'get',{pageNum: 1,pageSize:10}).then(res=>{
                    const resData = res
                    if(resData.status == this.responseOk){
                        console.log('test')
                        this.tableData = resData.data
                        //给数据添加个删除方便渲染
                        // this.tableData.items.map(item=>{
                        //     item.delString = '删除'
                        // })
                        console.log(resData)
                    }else{
                        console.log(resData)
                    }
					
				})
			 },
            del() {
                this.$confirm('您确定要删除吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                    }).then(() => {
                    console.log('我点击了确认')
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                    }).catch(() => {
                    console.log('我点击了取消')
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });          
                });
            }
        }
      
    }
</script>

<style lang='less'>
    .news-col{
        border-bottom: 1px solid #ccc;
        padding: 8px 0;
    }
    .title{
        padding: 10px;
        font-weight: bold;
    }
    .el-row{
        box-sizing: border-box;
        text-align: left;
        .col-left{
            padding-left: 20px;
        }
        .col-info{
            text-align: left;
        }
        .col-right{
            padding-right: 20px;
        }
    }
    .el-row:last-child{
        border-bottom: none;
    }

</style>
