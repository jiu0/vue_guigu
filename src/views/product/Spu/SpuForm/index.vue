<template>
  <div id="app">
      <el-form ref="form" :model="spu">
         <el-form-item label="SPU名称" label-width="100px">
             <el-input placeholder="SPU名称" v-model="spu.spuName"></el-input>
        </el-form-item>
         <el-form-item label="品牌" label-width="100px">
            <el-select placeholder="请选择品牌"  v-model="spu.tmId">
                <el-option  :label="tm.tmName" v-for="tm in tradeMarkList" :key="tm.id" :value="tm.id"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="SPU描述" label-width="100px">
             <el-input type="textarea" placeholder="SPU描述" rows="4" v-model="spu.description"></el-input>
        </el-form-item>
        <el-form-item label="SPU图片" label-width="100px">
                  <!-- 上传图片：action图片上传的地址  list-type: 文件列表的类型 on-preview:图片预览的时候会出发  on-remove:当删除图片的时候会出发 
                        file-list：照片墙需要展示的数据【数组：数组里面的元素务必要有name、url属性】
                        on-preview：图片预览功能
                        on-remove:删除图片的时候会触发
                  -->
                 <el-upload
                    action="/dev-api/admin/product/fileUpload"
                    list-type="picture-card"
                    :file-list="spuImageList"
                    :on-preview="handlePictureCardPreview"
                    :on-success="handlerSuccess"
                    :on-remove="handleRemove">
                    <i class="el-icon-plus"></i>
                </el-upload>
                <el-dialog :visible.sync="dialogVisible">
                   <img width="100%" :src="dialogImageUrl" alt="">
                </el-dialog>
        </el-form-item>
         <el-form-item label="销售属性" label-width="100px">
            <el-select :placeholder="`还有${unSelectSaleAttr.length}未选择`" v-model="attrIdAndAttrName" >
                <el-option  :label="unselect.name" v-for="unselect in unSelectSaleAttr" :key="unselect.id" :value="`${unselect.id}:${unselect.name}`"></el-option>
            </el-select>
             <el-button type="primary"  icon="el-icon-plus" :disabled="!attrIdAndAttrName" @click="addSaleAttr">添加销售属性</el-button>
             <el-table style="width:100%" border :data="spu.spuSaleAttrList">
                <el-table-column type="index" label="序号" width="80px" align="center">
                </el-table-column>
                <el-table-column prop="saleAttrName" label="属性名" width="140px" >
                </el-table-column>
                 <el-table-column prop="tmName" label="属性值名称列表" >
                    <template slot-scope="{row,$index}">
                       <el-tag :key="tag.id" v-for="(tag,index) in row.spuSaleAttrValueList" closable :disable-transitions="false" @close="row.spuSaleAttrValueList.splice(index,1)">
                        {{tag.saleAttrValueName}}
                      </el-tag>
                      <el-input
                        class="input-new-tag"
                        v-if="row.inputVisible"
                        v-model="row.inputValue"
                        :ref="$index"
                        size="small"
                        @blur="handleInputConfirm(row)"
                        @keyup.enter.native="handleInputConfirm(row)"
                       >
                      </el-input>
                      <!-- @click="showInput" -->
                      <el-button v-else class="button-new-tag" size="small" @click="addSaleAttrValue(row,$index)">添加</el-button>
                    </template>
                </el-table-column>
                 <el-table-column prop="tmName" label="操作" width="100px">
                    <template slot-scope="{row,$index}">
                      <!-- @click="showInput" -->
                       <el-button type="danger" icon="el-icon-delete" size="mini" @click="spu.spuSaleAttrList.splice($index,1)"></el-button>
                    </template>
                </el-table-column>
            </el-table> 
        </el-form-item>
        <el-form-item>
             <el-button type="primary" @click="addOrUpdateSpu">保存</el-button>
             <el-button @click="cancelSpu">取消</el-button>
         </el-form-item>
      </el-form>  
  </div>
</template>

<script>
export default {
  name: 'index',
  data() {
      return {
        dialogImageUrl: '',
        dialogVisible: false,
        // 点击修改展示数据 里面的属性 和新增数据 点击保存 提交给服务器的参数 属性保持一样
        spu: {
            //三级分类的id
            category3Id: 0,
            //描述
            description: "",
            //spu名称
            spuName: "",
            //品牌的id
            tmId:"",
            //收集SPU图片的信息
            spuImageList: [
              // {
              //   id: 0,
              //   imgName: "string",
              //   imgUrl: "string",
              //   spuId: 0,
              // },
            ],
            //平台属性与属性值收集
            spuSaleAttrList: [
              // {
              //   baseSaleAttrId: 0,
              //   id: 0,
              //   saleAttrName: "string",
              //   spuId: 0,
              //   spuSaleAttrValueList: [
              //     {
              //       baseSaleAttrId: 0,
              //       id: 0,
              //       isChecked: "string",
              //       saleAttrName: "string",
              //       saleAttrValueName: "string",
              //       spuId: 0,
              //     },
              //   ],
              // },
              ],
        },  // 存放 spu 数据
        tradeMarkList:[],  // 品牌数据
        spuImageList:[],  //  图片的数据
        saleAttrList:[],  //  销售属性
        attrIdAndAttrName:'',        // 收集未选择的销售属性Id
      };
    },
  computed:{
     // 计算未选择的销售属性 
     unSelectSaleAttr(){
        // 当前平台 销售属性 一共就三个 颜色 尺寸 版本  -- saleAttrList
        // 当前spu 拥有的属于自己的销售属性 spu.spuSaleAttrList
        // filter 数组过滤 过滤出符合条件的 返回一个新数组
        let saleArr = this.saleAttrList.filter(item=>{
           // every 会返回一个布尔值  
           return this.spu.spuSaleAttrList.every(item1=>{
               return item.name !== item1.saleAttrName
           })
        })
        return saleArr;  
     }
  },
  methods:{
       // 保存 添加或者 修改  添加的保存 返回列表 显示在第一页  修改的保存 停在当前页
       async addOrUpdateSpu(){
         //整理参数：需要整理照片墙的数据
         //携带参数：对于图片，需要携带imageName与imageUrl字段
         this.spu.spuImageList = this.spuImageList.map(item=>{
            return{
               imageName:item.name,
               imageUrl:(item.response&&item.response.data)|| item.url
            }
          })
          let result = await this.$API.spu.reqAddOrUpdateSpu(this.spu)
            if(result.code===200){
              this.$message({type:'success',message:'保存spu成功'})
              // 通知父组件
              this.$emit('changeScene',{scene:0,flag:this.spu.id?'修改':'添加'})
          }
          //清理数据  Object.assign 方法可以合并对象  把后面的对象合并到前面的对象中
          // this._data 可以操作 data 中响应数据  this.$options 可以获取配置对象中的 data() 方法
          Object.assign(this._data,this.$options.data())
       },
      // input 失去焦点
      handleInputConfirm(row){
         const { baseSaleAttrId,inputValue} = row;
         if(inputValue.trim() ===''){
           this.$message('属性值不能为空')
           return;
         }
         // 属性值不能重复  这里也可以用some 
         let result = row.spuSaleAttrValueList.every(item=>item.saleAttrValueName !== inputValue)
         if(!result) return;
         let newSaleAttrValue = {baseSaleAttrId,saleAttrValueName:inputValue}
         row.spuSaleAttrValueList.push(newSaleAttrValue)
         row.inputVisible = false;
      },
      //点击添加
      addSaleAttrValue(row,index){
        //点击销售属性值当中添加按钮的时候，需要有button变为input,通过当前销售属性的inputVisible控制
        //挂载在销售属性身上的响应式数据inputVisible，控制button与input切换
        this.$set(row,'inputVisible',true)
        //通过响应式数据inputValue字段收集新增的销售属性值
        this.$set(row,'inputValue','')
        this.$nextTick(()=>{
               console.log('index',index)
               this.$refs[index].focus()
         })
      },
      //添加新销售属性
      addSaleAttr(){
        // 把收集到的数据进行处理
        const [baseSaleAttrId,saleAttrName] = this.attrIdAndAttrName.split(':');
        // 想 spu.spuSaleAttrList 里面添加新的属性
        let newSaleAttr = {baseSaleAttrId,saleAttrName,spuSaleAttrValueList:[] }
        this.spu.spuSaleAttrList.push(newSaleAttr)
        // 清空数据
        this.attrIdAndAttrName = ''
      },
      handleRemove(file, fileList) {
        // file 删除的当期图片   fileList 删除图片后剩下的图片列表
        console.log(file, fileList);
        //收集照片墙图片的数据
        //对于已有的图片【照片钱中显示的图片：有name、url字段的】，因为照片墙显示数据务必要有这两个属性
        //对于服务器而言，不需要name、url字段，将来对于有的图片的数据在提交给服务器的时候，需要处理的
        this.spuImageList = fileList;
      },
      handlePictureCardPreview(file) {
        //把图片的地址给 dialogImageUrl  
        this.dialogImageUrl = file.url;
        // 显示对话框
        this.dialogVisible = true;
      },
      // 图片上传成功回调
      handlerSuccess(res,file,fileList){
         this.spuImageList = fileList;
      },
      async initSpuData(row){
          // 获取 spu 信息
          let spuResult = await this.$API.spu.reqSpu(row.id)
          if(spuResult.code===200){
              this.spu = spuResult.data;
          }
          // 获取品牌的信息
          let tradeMarkResult = await this.$API.spu.reqTrademarkList()
          if(tradeMarkResult.code===200){
              this.tradeMarkList = tradeMarkResult.data;
          }
           // 获取spu 图片的信息
           let spuImageResult = await this.$API.spu.reqSpuImageList(row.id)
           if(spuImageResult.code===200){
              let imgArr = spuImageResult.data
              imgArr.forEach(item=>{
                  item.name = item.imgName;
                  item.url = item.imgUrl;
              })
              this.spuImageList = imgArr;
           }
           // 获取销售属性
           let saleAttrResult = await this.$API.spu.reqSaleAttrList()
           if(saleAttrResult.code===200){
              this.saleAttrList = saleAttrResult.data;
           }
       },
       // 点击父组件 添加spu 按钮 通知子组件发请求
       async addSpuData(category3Id){
          // 添加spu 收集 三级分类的ID
          this.spu.category3Id = category3Id
          // 获取品牌的信息
          let tradeMarkResult = await this.$API.spu.reqTrademarkList()
          if(tradeMarkResult.code===200){
              this.tradeMarkList = tradeMarkResult.data;
          }
          // 获取销售属性
          let saleAttrResult = await this.$API.spu.reqSaleAttrList()
           if(saleAttrResult.code===200){
              this.saleAttrList = saleAttrResult.data;
          }
       },
       // 点击取消
       cancelSpu(){
          this.$emit('changeScene',{scene:0,flag:'' })
          //清理数据  Object.assign 方法可以合并对象  把后面的对象合并到前面的对象中
          // this._data 可以操作 data 中响应数据  this.$options 可以获取配置对象中的 data() 方法
          Object.assign(this._data,this.$options.data())
          console.log('_data',this._data)
          console.log('methods',this.$options.methods.addSaleAttr())  
       },
    },
}
</script>


<style>
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>
