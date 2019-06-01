//菜单数据处理
function menuData(data){
    if(data.menus){
        data.menus.shift()  //首页不需要直接删除
        data.menus.map((item,index)=>{
            item.secondMenu = []
            if(!item.menuUrl){item.menuUrl ='unFound'}  //暂时处理
            item.roleMenuId = String(item.roleMenuId) //elementUI需要字符串
            for(let i = 0;i< data.menus.length;i++){
                if(item.roleMenuId == data.menus[i].preMenuId){
                    item.secondMenu.push(data.menus[i])
                }
            }
        })
    }
    return data
}

export {
    menuData
}