import { constantRoutes } from '@/router'
import request from '@/utils/request'

// GET /admin/product/baseTrademark/{page}/{limit}
export const reqTradeMarkList =(page,limit)=>{
    return request({
         url:`/admin/product/baseTrademark/${page}/${limit}`,
         method:'get',
    })
}


//处理添加品牌
//新增品牌: /admin/product/baseTrademark/save   post  携带两个参数：品牌名称、品牌logo
//切记：对于新增的品牌，给服务器传递数据，不需要传递ID，ID是由服务器生成

//修改品牌的
//修改品牌 /admin/product/baseTrademark/update   put   携带三个参数：id、品牌名称、品牌logo
//切记：对于修改某一个品牌的操作，前端携带的参数需要带上id，你需要告诉服务器修改的是哪一个品牌

// POST /admin/product/baseTrademark/save  put  /admin/product/baseTrademark/update  
export const reqAddOrUpdateTradeMark = (tradeMark)=>{
    // 修改
   if(tradeMark.id){
        return request({
            url:`/admin/product/baseTrademark/update`,
            method:'put',
            data:tradeMark,
        })
   }else{
        return request({
            url:`/admin/product/baseTrademark/save`,
            method:'post',
            data:tradeMark,
        })
   }
}

//DELETE /admin/product/baseTrademark/remove/{id}
//删除品牌的接口
export const reqDeleteTradeMark = (id)=>{
    return request({
        url:`/admin/product/baseTrademark/remove/${id}`,
        method:'delete',
    })
}