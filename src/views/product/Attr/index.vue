<template>
  <div>
    <el-card>
        <CategorySelect @getCategoryId="getCategoryId" :show="!isShowTable" />
    </el-card>
    <el-card>
        <div v-show="isShowTable">
            <el-button type="primary" icon="el-icon-plus" :disabled="!category3Id" @click="addAttr">添加属性</el-button>
            <el-table style="width: 100%" border :data="attrList">
                <el-table-column type="index" label="序号" width="80px" align="center">
                </el-table-column>
                <el-table-column prop="attrName" label="属性名称" width="160px">
                </el-table-column>
                <el-table-column prop="attrValueList" label="属性值列表" width="650px">
                    <template slot-scope="{ row}">
                    <el-tag type="success" style="margin:0 10px;" v-for="attrValue in row.attrValueList" :key="attrValue.id">{{attrValue.valueName}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="prop" label="操作">
                    <template slot-scope="{ row, $index }">
                        <el-button  type="warning" icon="el-icon-edit" size="mini"
                            @click="updateAttr(row)"></el-button>
                        <el-button type="danger"  icon="el-icon-delete" size="mini"></el-button>
                    </template>
                </el-table-column>
            </el-table> 
        </div>
        <!-- 添加属性 修改属性结构 -->
        <div v-show="!isShowTable">
            <el-form :inine="true"  ref="ruleForm" :model="attrInfo">
                <el-form-item label="属性名" label-width="100px">
                   <el-input style="width:200px" placeholder="请输入属性名" v-model="attrInfo.attrName"></el-input>
                </el-form-item>
            </el-form>
            <el-button type="primary" icon="el-icon-plus" @click="addAttrValue" :disabled="!attrInfo.attrName">添加属性值</el-button>
            <el-button @click="isShowTable=true">取消</el-button>

             <el-table style="width:100%;margin:20px 0;" border :data="attrInfo.attrValueList">
                <el-table-column type="index" label="序号" width="80px" align="center">
                </el-table-column>
                <el-table-column prop="attrName" label="属性值名称" width="width">
                    <template slot-scope="{row,$index}">
                         <el-input v-model="row.valueName" :ref="$index" placeholder="请输入属性值名称" v-if="row.flag" @blur="toLook(row)" @keyup.native.enter="toLook(row)" size="mini"></el-input>
                         <span v-else @click="toEdit(row,$index)" style="display:block;">{{ row.valueName }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="attrName" label="操作" width="width">
                    <template slot-scope="{row,$index}">
                             <el-popconfirm  :title="`确定删除吗${row.valueName}？`" @onConfirm="deleteAttrValue($index)">
                                 <el-button type="danger" size="mini"  slot="reference" icon="el-icon-delete"></el-button>
                             </el-popconfirm>   
                    </template>
                </el-table-column>
            </el-table> 
            <el-button type="primary" @click="addOrUpdateAttr" :disabled="attrInfo.attrValueList.length<1">保存</el-button>
            <el-button @click="isShowTable=true">取消</el-button>
        </div>
    </el-card>
  </div>
</template>

<script>
// 引入 lodash 当中的深拷贝
import cloneDeep from 'lodash/cloneDeep'
export default {
  name: 'index',
  data(){
    return{
        category1Id:'',
        category2Id:'',
        category3Id:'',
        attrList:[],  // 属性 表格数据列表
        isShowTable:true,
        attrInfo:{
            attrName: "", //属性名
            attrValueList: [
            //属性值，因为属性值可以有多个因此用数组，每一个属性值都是一个对象需要attrId，valueName
            ],
            categoryId: 0, //三级分类的id
            categoryLevel: 3, //因为服务器也需要区分几级id
        },
     }
  },
  methods:{
     getCategoryId({categoryId,level}){
        if(level===1){
           this.category1Id = categoryId
           this.category2Id = ''
           this.category3Id = ''
        }else if(level===2){
           this.category2Id = categoryId
           this.category3Id = ''
        }else{
           // 表示三级的id 都有了
           this.category3Id = categoryId
           this.getAttrList()
        }
     },
     //获取平台的列表数据
     async getAttrList(){
         const {category1Id,category2Id,category3Id }  = this;
         let result = await this.$API.attr.reqAttrList(category1Id,category2Id,category3Id);
         if(result.code===200){
             this.attrList = result.data;
         }
     },
     // 添加属性值的回调
     addAttrValue(){
        // 向属性数组里添加元素  attrId 是相应的属性id 目前而言 我们是添加属性的操作 没有相应的属性id 带给服务器的id 为undefined
        // valueName 是相应的属性值的名称
        this.attrInfo.attrValueList.push({
            attrId:this.attrInfo.id,  // 对于修改某一个属性的时候,可以在已有的属性基础上新增新的属性值,(新增属性的时候,需要把已有的属性id带上)
            valueName:'',
            flag:true,  //flag 属性 给每个属性值添加一个flag,用户切换查看和编辑模式 这样每个属性值可以控制自己的模式切换 
        })  // flag 是响应式数据
        this.$nextTick(()=>{
            this.$refs[this.attrInfo.attrValueList.length-1].focus()
        })
     },
     // 添加属性
     addAttr(){
        this.isShowTable = false;
        this.attrInfo = {
            attrName: "", //属性名
            attrValueList: [
            //属性值，因为属性值可以有多个因此用数组，每一个属性值都是一个对象需要attrId，valueName
            ],
            categoryId:this.category3Id, //三级分类的id
            categoryLevel: 3, //因为服务器也需要区分几级id
        }
     },
     // 更新属性
     updateAttr(row){
         this.isShowTable = false;
         // 把数据进行深拷贝
         this.attrInfo = cloneDeep(row)
         // 在修改属性的时候 给相应的属性添加flag 标志  直接添加不会生效 因为flag 不是响应式数据
         //因为vue 无法探测普通的新增 propery
         this.attrInfo.attrValueList.forEach(item=>{
             this.$set(item,'flag',false)  // 对象  属性名  属性值
         })
     },
     // 失去焦点事件  查看模式
     toLook(row){
        if(row.valueName.trim()===''){
            this.$message('请输入一个正确的属性值')
            return;
        }
        // 如果属性值重名了 也要排除  row 是 attrValueList 数组里最后一项
        let isReat = this.attrInfo.attrValueList.some(item=>{
           if(item !== row){
             return row.valueName === item.valueName
           }
        })
        if(isReat) return;
        row.flag = false;
     },
     toEdit(row,index){
         row.flag=true
         // 页面重绘  重排 需要时间
         this.$nextTick(()=>{
               console.log('index',index)
               this.$refs[index].focus()
         })
     },
     deleteAttrValue(index){
         this.attrInfo.attrValueList.splice(index,1)
     },
     // 保存按钮 进行属性的添加和修改  
     async addOrUpdateAttr(){
       // 整理参数 去掉 为空的情况 和 去掉 flag 标识  传给服务器
       this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter(item=>{
          if(item.valueName !== ''){
              delete item.flag;
              return true;
           }
       })
       try{
            console.log('attrInfo',this.attrInfo)
            await this.$API.attr.reqAddOrUpdateAttr(this.attrInfo)
            this.isShowTable = true;
            this.$message({type:'success',message:'保存成功'})
            this.getAttrList()
       }catch(error){
            //this.$message({type:'danger',message:'保存失败'})
       }
       
     }
  }
}
</script>

<style lang="scss" scoped>

</style>
