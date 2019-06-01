//消息通知  June
<template>
        <div>
            <head-top></head-top>
            <div class="news-page">
                <div class="news-col title">交易通知</div>
                <div class="new-wrap">
                    <div>平台消息</div>
                    <div>交易消息</div>
                </div>
                <el-row class="el-row" :gutter="20" v-for='(item,index) in tableData' :key="index">
                    <el-col class="news-col col-left" :span="3"><div style="padding-left: 20px;">图片预留</div></el-col>
                    <el-col class="news-col col-info" :span="9"><div>{{item.info}}</div></el-col>
                    <el-col class="news-col col-right" :span="9"><div>{{item.date}}</div></el-col>
                    <el-col class="news-col col-right" :span="3">
                        <div>
                            <el-button style="padding: 0;color: #333;" type="text" @click="del">{{item.delString}}</el-button>
                        </div>
                    </el-col>
                </el-row>
            </div>
        </div>
</template>

<script>
import headTop from '../components/headTop'
export default {
    data() {
        return {
            tableData: [{
                date: '2016-05-02',
                img: '图片预留',
                info: '买家购买信息'
                }, {
                    date: '2016-05-04',
                    img: '图片预留',
                    info: '买家购买信息'
                }, {
                    date: '2016-05-01',
                    img: '图片预留',
                    info: '买家购买信息'
                }, {
                    date: '2016-05-03',
                    img: '图片预留',
                    info: '买家购买信息'
                }]
            }
        },
        components:{
            headTop
        },
        created(){
            //给数据添加个删除方便渲染
            this.tableData.map(item=>{
                item.delString = '删除'
            })
        },
        methods:{
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
        .el-row{
            box-sizing: border-box;
            overflow: hidden;
            text-align: left;
            padding-left: 20px!important;
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
    }
    .title{
        padding: 10px;
        font-weight: bold;
    }
    

</style>
