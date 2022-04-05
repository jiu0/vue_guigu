<template>
  <div>
     <el-table style="width:100%" border :data="records">
                <el-table-column type="index" label="序号" width="80px" align="center">
                </el-table-column>
                <el-table-column label="名称" prop="skuName"></el-table-column>
                <el-table-column label="描述" prop="skuDesc"></el-table-column>
                <el-table-column label="默认图片"  width="110px">
                    <template slot-scope="{row,$index}">
                        <img :src="row.skuDefaultImg"  style="width:80px;height:80px;" />
                    </template>
                </el-table-column>
                <el-table-column label="重量" prop="weight" width="90px"></el-table-column>
                <el-table-column label="价格" prop="price" width="80px"></el-table-column>
                <el-table-column prop="tmName" label="操作" width="300px">
                    <template slot-scope="{row,$index}">
                       <el-button type="success" v-if="row.isSale===0" size="mini" icon="el-icon-sort-down" @click="sale(row)"></el-button>
                       <el-button type="success" v-else  size="mini" icon="el-icon-sort-up" @click="cancel(row)"></el-button>
                       <el-button type="primary" size="mini" icon="el-icon-edit" @click="edit"></el-button>
                       <el-button type="info" size="mini" icon="el-icon-info" @click="getSkuInfo(row)"></el-button>
                       <el-button type="danger" size="mini" icon="el-icon-delete"></el-button>
                    </template>
                </el-table-column>
      </el-table> 
      <el-pagination
        style="margin-top: 20px; text-align: center"
        :current-page="page"
        :total="total"
        :page-size="limit"
        :pager-count="7"
        :page-sizes="[3, 5, 10]"
        @current-change="getSkuList"
        @size-change="handleSizeChange"
        layout="prev, pager, next, jumper,->,sizes,total">
        </el-pagination>
        <!-- 抽屉  show-close 是否需要右上角的 x-->
        <el-drawer :visible.sync="show" :show-close="false" size="50%">
           <el-row>
              <el-col :span="5">名称</el-col>
              <el-col :span="16">{{skuInfo.skuName}}</el-col>
           </el-row>
           <el-row>
              <el-col :span="5">描述</el-col>
              <el-col :span="16">{{skuInfo.skuDesc}}</el-col>
           </el-row>
           <el-row>
              <el-col :span="5">价格</el-col>
              <el-col :span="16">{{skuInfo.price}}元</el-col>
           </el-row>
           <el-row>
              <el-col :span="5">平台属性</el-col>
              <el-col :span="16">
                   <template>
                       <el-tag type="success" style="margin-right:10px;" v-for="attr in skuInfo.skuAttrValueList" :key="attr.id">
                         {{attr.attrId}}-- {{attr.valueId}}</el-tag>
                    </template>
              </el-col>
           </el-row>
           <el-row>
              <el-col :span="5">商品图片</el-col>
              <el-col :span="16">
                 <el-carousel indicator-position="outside">
                    <el-carousel-item v-for="item in skuInfo.skuImageList" :key="item.id">
                       <img :src="item.imgUrl" />
                     </el-carousel-item>
                 </el-carousel>
              </el-col>
           </el-row>
        </el-drawer>
  </div>
</template>

<script>

export default {
  name: 'index',
  data(){
     return {
        page:1,   //  第几页
        limit:4,  // 一页显示几条数据  
        records:[],  // sku 列表数据
        total:0,
        skuInfo:{},   // sku 数据 
        show:false,
     }
  },
  mounted(){
    this.getSkuList()
  },
  methods:{
    async getSkuList(pages=1){
      this.page = pages;
      const { page,limit } = this;
      let result = await this.$API.sku.reqSkuList(page,limit);
      if(result.code === 200){
          this.records= result.data.records
          this.total= result.data.total
       }
    },
    handleSizeChange(limit){
      this.limit = limit;
      this.getSkuList()
    },
    // 上架
    async sale(row){
       let result = await this.$API.sku.reqSale(row.id);
       if(result.code === 200){
          row.isSale = 1;
          this.$message({type:'success',message:'上架成功'})
       }
    },
    // 下架
    async cancel(row){
       let result = await this.$API.sku.reqCancel(row.id);
       if(result.code === 200){
          row.isSale = 0;
          this.$message({type:'success',message:'下架成功'})
       }
    },
    edit(){ // 
      this.$message({type:'info',message:'开发中...'})
    },
    // 获取 sku 详情数据
    async getSkuInfo(row){
        //展示抽屉
        this.show = true;
        let result = await this.$API.sku.reqSkuById(row.id);
        console.log('4444',result)
        if(result.code === 200){
           this.skuInfo = result.data;
        }
     },
  }
}
</script>

<style>
/* 轮播图样式 */
  .el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 150px;
    margin: 0;
  }

  .el-carousel__item:nth-child(2n) {
     background-color: #99a9bf;
  }
  
  .el-carousel__item:nth-child(2n+1) {
     background-color: #d3dce6;
  }
  /* .el-carousel__button{
    width:10px;
    height:10px;
    background:red;
    border-radius:50%;
  } */
</style>



<style scoped>
   .el-row .el-col-5{
      font-size:18px;
      text-align:right;
   }
   .el-col{
     margin:10px 10px;
   }

   >>>.el-carousel__button{
    width:10px;
    height:10px;
    background:red;
    border-radius:50%;
  }
</style>