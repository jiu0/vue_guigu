<template>
  <div>
     <el-form :inline="true"  class="demo-form-inline" :model="cForm">
        <el-form-item label="一级分类">
            <el-select placeholder="请选择" v-model="cForm.category1Id" @change="handler1" :disabled="show">
                <el-option v-for="cate1 in list1" :key="cate1.id" :label="cate1.name"  :value="cate1.id"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="二级分类">
            <el-select placeholder="请选择" v-model="cForm.category2Id" @change="handler2" :disabled="show">
                <el-option v-for="cate2 in list2" :key="cate2.id" :label="cate2.name" :value="cate2.id"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="三级分类">
            <el-select placeholder="请选择" v-model="cForm.category3Id" @change="handler3" :disabled="show">
                <el-option  v-for="cate3 in list3" :key="cate3.id" :label="cate3.name" :value="cate3.id"></el-option>
            </el-select>
        </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'index',
  props:['show'],
  data(){
      return{
        list1:[],
        list2:[],   // 二级分类的数据
        list3:[],
        cForm:{   // 收集相应的一级二级 三级分类的ID
          category1Id:'',
          category2Id:'',
          category3Id:'',
        },
      }
  },
  mounted(){
      this.getcategory1List();
  },
  methods:{
      async getcategory1List(){
         let result = await this.$API.attr.reqCategory1Lsit();
         if(result.code===200){
            this.list1 = result.data;
         }
      },
      // 一级分类的 id 发生变化时 获取相应的二级分类数据
     async handler1(){
        this.list2 = [];
        this.list3 = [];
        this.cForm.category2Id = '';
        this.cForm.category3Id = '';
        const { category1Id } = this.cForm;
        this.$emit('getCategoryId',{categoryId:category1Id,level:1})
         let result = await this.$API.attr.reqCategory2Lsit(category1Id);
          if(result.code===200){
            this.list2 = result.data;
         }
      },
     async handler2(){
        this.list3 = [];
        this.cForm.category3Id = '';
        const { category2Id } = this.cForm;
        this.$emit('getCategoryId',{categoryId:category2Id,level:2})
         let result = await this.$API.attr.reqCategory3Lsit(category2Id);
          if(result.code===200){
            this.list3 = result.data;
         }
      },
      handler3(){
         const { category3Id } = this.cForm;  
         this.$emit('getCategoryId',{categoryId:category3Id,level:3})

      }
  },
}
</script>

<style scoped>

</style>

<style lang="scss">

</style>
