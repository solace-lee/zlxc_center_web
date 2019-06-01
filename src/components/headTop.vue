<template>
    <div class="header_container">
		<el-breadcrumb separator="/">
			<el-breadcrumb-item :to="{ path: '/manage' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item v-for="(item, index) in $route.meta" :key="index">{{item}}</el-breadcrumb-item>
		</el-breadcrumb>
		<div class="guanli">助力乡村后台管理</div>
		<el-dropdown @command="handleCommand" placement='start'>
			<img :src="userInfo.imgUrl" class="avator">
			<el-dropdown-menu slot="dropdown">
				<el-dropdown-item command="home">首页</el-dropdown-item>
				<el-dropdown-item command="singout">退出</el-dropdown-item>
			</el-dropdown-menu>
		</el-dropdown>
		<div @click="newsList" v-if='unReadyNews!==0' class="news">您有{{unReadyNews}}条未读消息</div>
    </div>
</template>

<script>
	import {baseImgPath} from '@/config/env'
	import {mapActions, mapState} from 'vuex'

    export default {
    	data(){
    		return {
				unReadyNews: 0
    		}
    	},
    	computed: {
				userInfo(){
					return this.$store.state.userInfo
				}
			},
			created(){
				// this.getunReadyNews()
			},
			methods: {
				newsList(){
					this.$router.push('news')
				},
				async getunReadyNews(){
					await this.axiosReq(this.apis.unReadyNews,'get').then(res=>{
						const resData = res
						if(resData.status == 200){
							if(resData.data.total!==0){
								this.unReadyNews = resData.data.data.row
							}
						}
					})
				},
				async handleCommand(command) { //退出
					if (command == 'home') {
						this.$router.push('/manage');
					}else if(command == 'singout'){
						this.$store.dispatch('removeToken');
						this.$store.dispatch('removeUserInfo');
						this.$router.push('/');
					}
				},

			}
    }
</script>

<style lang="less" scoped>
	@import '../style/mixin';
	.header_container{
		background-color: #EFF2F7;
		height: 60px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-left: 20px;
	}
	.news{
		position:absolute;
		top:0;
		right: 100px;
		height: 60px;
		line-height: 60px;
		color: #fff;
		padding: 0 20px;
		background: rgba(0, 0, 0, .5)
	}
	.avator{
		.wh(36px, 36px);
		border-radius: 50%;
		margin-right: 37px;
	}
	.el-dropdown-menu__item{
        text-align: center;
	}
	.guanli{
	margin-left: -8%;
    font-size: 23px;
    letter-spacing: 2px;
	}
</style>
