
//平台属性管理模块请求文件
import request from '@/utils/request'
//GET /admin/product/{page}/{limit}
//获取一级分类   GET /admin/product/getCategory1
export const reqSpuLsit = (page,limit,category3Id)=>request({url:`/admin/product/${page}/${limit}`,method:'get',params:{category3Id}}) 

// 获取spu 修改信息的数据   GET /admin/product/getSpuById/{spuId}
export const reqSpu = (spuId)=>request({url:`/admin/product/getSpuById/${spuId}`,method:'get',}) 


// 获取spu 品牌数据  GET /admin/product/baseTrademark/getTrademarkList
export const reqTrademarkList = ()=>request({url:`/admin/product/baseTrademark/getTrademarkList`,method:'get',}) 

// 获取 修改弹框里 图片的数据  GET /admin/product/spuImageList/{spuId}
export const reqSpuImageList = (spuId)=>request({url:`/admin/product/spuImageList/${spuId}`,method:'get',})


// 获取 修改弹框里 销售属性的数据  GET /admin/product/baseSaleAttrList  整个平台 销售属性最多3个 
export const reqSaleAttrList = ()=>request({url:`/admin/product/baseSaleAttrList`,method:'get',})


// 修改 添加 SPU  对于修改 添加 带给服务器的参数大致是一样 的 唯一区别就是 修改有id 添加没有
// POST /admin/product/saveSpuInfo  POST  /admin/product/updateSpuInfo
export const reqAddOrUpdateSpu = (spuInfo)=>{
    if(spuInfo.id){
        return request({
            url:`/admin/product/updateSpuInfo`,
            method:'post',
            data:spuInfo,
        })
    }else{
        return request({
            url:`/admin/product/saveSpuInfo`,
            method:'post',
            data:spuInfo,
        })
    }
}


//删除 spu DELETE /admin/product/deleteSku/{skuId}
export const reqDeleteSpu = (spuId) => request({url:`/admin/product/deleteSku/${spuId}`,method:'delete',})


//获取 图片列表  GET /admin/product/spuImageList/{spuId}
export const reqSpuImageList2 = (spuId)=>request({url:`/admin/product/spuImageList/${spuId}`,method:'get',}) 

//获取 销售属性数据  GET /admin/product/spuSaleAttrList/{spuId}
export const reqSpuSaleAttrList = (spuId)=>request({url:`/admin/product/spuSaleAttrList/${spuId}`,method:'get',})

// 获取平台属性数据 GET /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}
export const reqAttrInfoList =(category1Id,category2Id,category3Id)=>request({url:`/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,method:'get',})


//添加 sku  保存 POST /admin/product/saveSkuInfo
export const reqAddSku = (skuInfo)=>request({url:`/admin/product/saveSkuInfo`,method:'post',data:skuInfo})

// 获取sku 列表的数据的接口  GET /admin/product/findBySpuId/{spuId}
export const reqSkuList = (spuId)=>request({url:`/admin/product/findBySpuId/${spuId}`,method:'get',})

