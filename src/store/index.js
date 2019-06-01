//可优化把状态分开处理 June
import Vue from 'vue'
import Vuex from 'vuex'

// import { setStore,getStore,removeStore } from '../config/mUtils'
import { Loading } from 'element-ui';
import { menuData } from '../utils/util';
import { cpus } from 'os';

Vue.use(Vuex)

const state = {
	token:'',
	userInfo: sessionStorage.getItem('userInfo') || null,
	userType:0,
}

const mutations = {
	SAVE_USERINFO(state, userInfo){
		sessionStorage.setItem('userInfo',userInfo);
		state.userInfo = userInfo;
	},
	SET_TOKEN: (state, token) => {
		sessionStorage.setItem('token',token)
		state.token = token
	},
	REMOVE_TOKEN (state, token) {
		sessionStorage.removeItem("token");
		state.token = token;
	},
	REMOVE_USERINFO(state,userInfo){
		sessionStorage.removeItem("userInfo");
		state.userInfo = userInfo;
	},
	GET_USERTYPE(state,userType){
		state.userType = userType;
	}
}

const actions = {
	async setToken({commit},token){
		commit('SET_TOKEN',token)
	},
	async getUserInfo({commit},userInfo){
		commit('SAVE_USERINFO',userInfo)
	},
	async removeToken({commit}){
		commit('REMOVE_TOKEN')
	},
	async removeUserInfo({commit}){
		commit('REMOVE_USERINFO')
	}
	
	
}

export default new Vuex.Store({
	state,
	actions,
	mutations,
})
