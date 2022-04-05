<template>
  <div>
      <el-form ref="form">
         <el-form-item label="SPU名称" label-width="100px">
              {{spu.spuName}}
        </el-form-item>
        <el-form-item label="SKU名称" label-width="100px">
              <el-input placeholder="SKU名称" v-model="skuInfo.skuName"></el-input>
        </el-form-item>
        <el-form-item label="价格(元)" label-width="100px">
              <el-input placeholder="价格(元)" type="number" v-model="skuInfo.price"></el-input>
        </el-form-item>
        <el-form-item label="重量(千克)" label-width="100px">
              <el-input placeholder="重量(千克)" v-model="skuInfo.weight"></el-input>
        </el-form-item>
        <el-form-item label="规格描述" label-width="100px">
              <el-input type="textarea" rows="4" v-model="skuInfo.skuDesc"></el-input>
        </el-form-item>
        <el-form-item label="平台属性" label-width="100px">
              <el-form  :inline="true" label-width="80px">
                  <el-form-item :label="attr.attrName" v-for="attr in attrInfoList" :key="attr.id">
                      <el-select placeholder="请选择" v-model="attr.attrIdAndValueId" >
                          <el-option :label="attrValue.valueName" :value="`${attr.id}:${attrValue.id}`" v-for="attrValue in attr.attrValueList" :key="attrValue.id"></el-option>
                      </el-select>
                  </el-form-item>
              </el-form> 
        </el-form-item>
        <el-form-item label="销售属性" label-width="100px">
              <el-form :inline="true" label-width="80px">
                  <el-form-item :label="saleAttr.saleAttrName" v-for="saleAttr in spuSaleAttrList" :key="saleAttr.id">
                      <el-select placeholder="请选择" v-model="saleAttr.attrIdAndValueId" >
                          <el-option :label="saleAttrValue.saleAttrValueName" :value="`${saleAttr.id}:${saleAttrValue.id}`" 
                          v-for="saleAttrValue in saleAttr.spuSaleAttrValueLsit" :key="saleAttrValue.id"></el-option>
                      </el-select>
                  </el-form-item>
              </el-form> 
        </el-form-item>
        <el-form-item label="图片列表" label-width="100px">
              <el-table style="width:100%" border :data="spuImageList" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="80px" align="center">
                </el-table-column>
                <el-table-column label="图片" width="200px" >
                     <template slot-scope="{row,$index}">
                        <img :src="row.imgUrl" style="width:100px;height:100px"/>
                    </template>
                </el-table-column>
                <el-table-column prop="imgName" label="名称" >
                </el-table-column>
                <el-table-column prop="tmName" label="操作" width="200px">
                    <template slot-scope="{row,$index}">
                       <el-button type="primary" size="mini" v-if="row.isDefault ===0" @click="changeDefault(row)">设置默认</el-button>
                       <el-button size="mini" v-else>默认</el-button>
                    </template>
                </el-table-column>
            </el-table> 
        </el-form-item>
         <el-form-item>
                    <el-button type="primary" @click="save">保存</el-button>
                    <el-button @click="cancel">取消</el-button>
        </el-form-item>
      </el-form> 
  </div>
</template>

<script>
export default {
  name: 'index',
  data(){
    return{
        spuImageList:[],  // 储存图片的数据
        spuSaleAttrList:[],  // 获取销售属性的数据
        attrInfoList:[],   // 平台属性的数据
        //收集sku数据的字段
        skuInfo: {
            //第一类收集的数据：父组件给的数据
            category3Id: 0,
            spuId: 0,
            tmId: 0,
            //第二类：需要通过数据双向绑定v-model收集
            skuName: "",
            price: 0,
            weight: "",
            skuDesc: "",
            //第三类：需要自己书写代码
            //默认图片
            skuDefaultImg: "",
            //收集图片的字段
            skuImageList: [
            // {
            //   id: 0,
            //   imgName: "string",
            //   imgUrl: "string",
            //   isDefault: "string",
            //   skuId: 0,
            //   spuImgId: 0,
            // },
            ],
            //平台属性
            skuAttrValueList: [
            // {
            //   attrId: 0,
            //   valueId: 0,
            // },
            ],
            //销售属性
            skuSaleAttrValueList: [
            // {
            //   id: 0,
            //   saleAttrId: 0,
            //   saleAttrName: "string",
            //   saleAttrValueId: 0,
            //   saleAttrValueName: "string",
            //   skuId: 0,
            //   spuId: 0,
            // },
            ],
       },
       spu:{},
       imageList:[], // 收集图片的字段 //收集图片的数据字段:但是需要注意，收集的数据目前缺少isDefault字段，
                      //将来提交给服务器数据的时候，需要整理参数
    }
  },
  methods:{
    async getSkuData(category1Id,category2Id,row){
        //收集父组件给予的数据
        this.skuInfo.category3Id = row.category3Id;
        this.skuInfo.spuId = row.id;
        this.skuInfo.tmId = row.tmId;
        this.spu = row;
        // 获取图片的数据
        let imgResult = await this.$API.spu.reqSpuImageList2(row.id)
        console.log('imgResult',imgResult)
        if(imgResult.code===200){
            let list = imgResult.data;
            list.forEach(item=>{
                item.isDefault = 0;
            })
            this.spuImageList = list;
        }
        // 获取销售属性的数据
        let saleResult = await this.$API.spu.reqSpuSaleAttrList(row.id)
        if(saleResult.code===200){
            this.spuSaleAttrList = saleResult.data;
        }
        let attrResult = await this.$API.spu.reqAttrInfoList(category1Id,category2Id,row.category3Id)
        if(attrResult.code===200){
            this.attrInfoList = attrResult.data;
        }
     },
     // table 表格数据勾选触发
     handleSelectionChange(params){
         //获取到用户选中图片的信息数据，但是需要注意，当前收集的数据当中，缺少isDefault字段
         this.imageList = params
     },
     // 点击设置默认
     changeDefault(row){
        //图片列表的数据的isDefault字段变为 0
        this.spuImageList.forEach(item=>{
            item.isDefault = 0;
        })
        //点击的那个图片的数据变为1
        row.isDefault = 1;
        //收集默认图片的地址
        this.skuInfo.skuDefaultImg = row.imgUrl;
     },
     //点击取消
     cancel(){
        // 自定义事件 通知父组件切换场景
        this.$emit('changeSences',0)
        Object.assign(this._data,this.$options.data())
     },
     //保存
     async save(){
       // 整理参数 整理平台属性
       const { attrInfoList,skuInfo,spuSaleAttrList,imageList,} = this;
          // 整理数据方法1
    //    let arr = []
    //    attrInfoList.forEach(item=>{
    //       // attrIdAndValueId 表示 当前平台进行选择了
    //       if(item.attrIdAndValueId){
    //         const [attrId,valueId]  =  item.attrIdAndValueId.split(":")
    //         // 携带给服务器参数是个对象
    //         let obj = { attrId,valueId}
    //         arr.push(obj)
    //       }
    //    })
    //    skuInfo.skuSaleAttrValueList = arr;
          // 整理数据方法2
          skuInfo.skuSaleAttrValueList = attrInfoList.reduce((prev,item)=>{
             if(item.attrIdAndValueId){
                const [attrId,valueId]  =  item.attrIdAndValueId.split(":") 
                prev.push({attrId,valueId})
             }
             return prev;
         },[])
         skuInfo.skuSaleAttrValueList = spuSaleAttrList.reduce((prev,item)=>{
             if(item.attrIdAndValueId){
                const [saleAttrId,saleAttrValueId]  =  item.attrIdAndValueId.split(":") 
                prev.push({saleAttrId,saleAttrValueId})
             }
             return prev;
         },[])
         // 整理图片数据
         skuInfo.skuImageList = imageList.map(item=>{
             return{
                 imgName:item.imgName,
                 imgUrl:item.imgUrl,
                 isDefault:item.isDefault,
                 spuImgId:item.id,
             }
         })
         let result = await this.$API.spu.reqAddSku(skuInfo)
         console.log('result',result)
         if(result.code===200){
             this.$message({type:'success',message:'添加sku成功'})
             this.$emit('changeSences',0)
         }
     },
  }
}
</script>
