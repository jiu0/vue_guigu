<template>
  <div>
     <el-card style="margin:20px 0;">
         <CategorySelect @getCategoryId="getCategoryId" :show="scene !== 0" />
     </el-card>
     <el-card>
        <div v-show="scene === 0">
          <el-button type="primary" icon="el-icon-plus" :disabled="!category3Id" @click="addSpu">添加SPU</el-button>
          <el-table style="width: 100%" border :data="records">
                  <el-table-column type="index" label="序号" width="80px" align="center">
                  </el-table-column>
                  <el-table-column prop="spuName" label="SPU名称" width="160px">
                  </el-table-column>
                  <el-table-column prop="description" label="SPU描述" width="500px">
                  </el-table-column>
                  <el-table-column prop="prop" label="操作">
                      <template slot-scope="{ row, $index }">
                          <HintButton  type="success" icon="el-icon-plus" size="mini" title="添加sku"
                              @click="addSku(row)"></HintButton>
                          <HintButton type="warning"  icon="el-icon-edit" size="mini" @click="updateSpu(row)" title="修改spu"></HintButton>
                          <HintButton type="info"  icon="el-icon-info" size="mini" title="查看当前spu全部sku列表" @click="handler(row)"></HintButton>
                          <el-popconfirm title="这是一段内容确定删除吗？" @onConfirm="deleteSpu(row)">
                              <HintButton type="danger" slot="reference" icon="el-icon-delete" size="mini" title="删除spu"></HintButton>
                          </el-popconfirm>
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
                @current-change="getSpuList"
                @size-change="handleSizeChange"
                layout="prev, pager, next, jumper,->,sizes,total">
              </el-pagination>
          </div> 
          <SpuForm v-show="scene === 1" @changeScene="changeScene" ref="spu" />
          <SkuForm v-show="scene === 2" @changeSences="changeSences" ref="sku"  />
     </el-card>
      <el-dialog :title="`${spu.spuName}的sku列表`" :visible.sync="dialogTableVisible"
       :before-close="close">
         <el-table :data="skuList" border style="width:100%;" v-loading="loading">
            <el-table-column prop="skuName" label="名称" width="150"></el-table-column>
            <el-table-column prop="price" label="价格" width="200"></el-table-column>
            <el-table-column prop="weight" label="重量"></el-table-column>
            <el-table-column label="默认图片">
                <template slot-scope="{ row, $index }">
                      <img :src="row.skuDefaultImg" style="width:100px;height:100px;" />
                </template>
            </el-table-column>
         </el-table>
      </el-dialog>
  </div>
</template>

<script>
import SpuForm from './SpuForm'
import SkuForm from './SkuForm'
export default {
  name: 'index',
  components:{
    SpuForm,
    SkuForm,
  },
  data(){
     return{
        category1Id:'',
        category2Id:'',
        category3Id:'',
        //show:true,    // 控制三级联动的操作性
        page:1,       // 当前第几页
        limit:3,      // 一页显示几条数据
        records:[],   // spu 列表数据
        total:0, 
        scene:0,     // 0表示显示spu数据    1 添加spu 修改spu  2  添加sku 
        dialogTableVisible:false,     //对话框显隐
        spu:{},
        skuList:[],  // sku列表数据
        loading:true,
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
           this.category3Id = categoryId
           this.getSpuList()
       }
    },
    async getSpuList(pager = 1){
       this.page = pager;
       const { page,limit,category3Id} = this;
       let result = await this.$API.spu.reqSpuLsit(page,limit,category3Id)
       if(result.code ===200){
          this.records = result.data.records
          this.total = result.data.total
       }
    },
    // 点击第几页
    // handleSizeChange(page){
    //    this.page = page;
    //    this.getSpuList()
    // }
    // 修改一页显示几条数据
    handleSizeChange(limit){
       this.limit = limit;
       this.getSpuList()
    },
    addSpu(){
      this.scene = 1
      // 通知子组件发请求  2个 一个品牌 和销售属性
      this.$refs.spu.addSpuData(this.category3Id)
    },
    // 修改spu
    updateSpu(row){
       this.scene = 1
       this.$refs.spu.initSpuData(row)  // 通过ref 获取子组件里面定义的方法
    },
    // 自定义事件回调 spu
    changeScene({scene,flag}){
       // flag 区分 保存 是修改 还是添加 
       if(flag === '修改'){
            this.getSpuList(this.page)
       }else{
            this.getSpuList()
       }
       this.scene = scene
       //子组件通知父组件切换场景  需要再次获取spu 列表数据展示  停留在当前页
    },
    changeSences(scene){
        this.scene = scene
    },
    // 删除spu 
    async deleteSpu(row){
      let result =  await this.$API.spu.reqDeleteSpu(row.id)
      console.log('result',result)
      if(result.code===200){
         this.$message({type:'success',message:'删除spu成功'})
         // spu的个数 > 1 的时候删除的时候停留在当前页 小于 1 停留在上一页
         this.getSpuList(this.records.length>1?this.page:this.page-1);
      }
    },
    // 添加sku
    addSku(row){
        // 场景为2
        this.scene = 2 
        // 父组件调用子组件的方法 让子组件发请求 3个
        this.$refs.sku.getSkuData(this.category1Id,this.category2Id,row)
    },
    // 查看当前spu全部sku列表
    async handler(row){
       this.dialogTableVisible = true;
       this.spu = row;
       let result = await this.$API.spu.reqSkuList(row.id)
       console.log('result222',result)
       if(result.code===200){
           this.skuList = result.data;
           this.loading = false;
       }
    },
    // 关闭对话框之前回调
    close(done){
       // 切换sku 列表按钮时 保证每次点击 都会有loading 效果
       this.loading = true;
       // 请除数据 保证每次点击 不会有上一次数据的痕迹
       this.skuList = []
       done();
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
