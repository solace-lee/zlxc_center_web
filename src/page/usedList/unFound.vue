<template>
    <div class="fillcontain">
        
        <head-top></head-top>
        <div class="tilte">404没有找到页面</div>
    </div>
</template>

<script>
    import headTop from '../components/headTop'
    export default {
    	components: {
            headTop
    	},
    }
</script>

<style lang="less">
	@import '../style/mixin';
	.explain_text{
		margin-top: 20px;
		text-align: center;
		font-size: 20px;
		color: #333;
    }
    .tilte{
        font-size: 24px;
        font-weight: bold;
        text-align: center;
    }
</style>
