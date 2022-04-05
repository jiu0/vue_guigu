<template>
  <div>
      <!-- 按钮 -->
     <el-button type="primary" icon="el-icon-plus" style="margin: 10px 0px"  @click="showDialog">添加</el-button>
      <!-- 
         表格组件 
         data:表格组件将来需要展示的数据------数组类型
         border：是给表格添加边框
         column属性
         label：显示标题
         width：对应列的宽度
         align：标题的对齐方式
         prop:对应列内容的字段名
         注意1：elmentUI当中的table组件，展示的数据是以一列一列进行展示数据
       -->
        <el-table style="width: 100%" border :data="list">
            <el-table-column type="index" label="序号" width="80px" align="center">
            </el-table-column>
            <el-table-column prop="tmName" label="品牌名称" >
            </el-table-column>
            <el-table-column prop="logoUrl" label="品牌LOGO" >
                <template slot-scope="{ row, $index }">
                   <img :src="row.logoUrl" alt="" style="width:100px;height:100px" />
                </template>
            </el-table-column>
            <el-table-column prop="prop" label="操作" >
                <template slot-scope="{ row, $index }">
                <el-button  type="warning" icon="el-icon-edit" size="mini"
                    @click="updateTradeMark(row)">修改</el-button>
                <el-button type="danger"  icon="el-icon-delete" size="mini"
                    @click="deleteTradeMark(row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>  
        <!-- 
        分页器 
        当前第几页、数据总条数、每一页展示条数、连续页码数
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"

        current-page:代表的是当前第几页
        total：代表分页器一共需要展示数据条数
        page-size：代表的是每一页需要展示多少条数据
        page-sizes：代表可以设置每一页展示多少条数据
        layout：可以实现分页器布局
        pager-count:按钮的数量  如果 9  连续页码是7
        -->
        <el-pagination
        style="margin-top: 20px; text-align: center"
        :current-page="page"
        :total="total"
        :page-size="limit"
        :pager-count="7"
        :page-sizes="[3, 5, 10]"
        @current-change="getPageList"
        @size-change="handleSizeChange"
        layout="prev, pager, next, jumper,->,sizes,total">
        </el-pagination>
        <el-dialog :title="tmForm.id?'修改品牌':'添加品牌'" :visible.sync="dialogFormVisible">
            <!-- form表单 :model属性，这个属性的作用是,把表单的数据收集到那个对象的身上 ，将来表单验证，也需要这个属性-->
            <el-form :model="tmForm" style="width:80%" :rules="rules" ref="ruleForm">
                <el-form-item label="品牌名称" label-width="100px" prop="tmName">
                   <el-input v-model="tmForm.tmName" autocomplete="off"></el-input>
                </el-form-item>
                <!--这里收集数据：不能使用v-model，因为不是表单元素
                    action:设置图片上传的地址
                    :on-success:可以检测到图片上传成功，当图片上传成功，会执行一次
                    :before-upload：可以在上传图片之前，会执行一次 POST /admin/product/fileUpload
                 -->
                <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
                    <el-upload
                        class="avatar-uploader"
                        action="/dev-api/admin/product/fileUpload"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess"
                        :before-upload="beforeAvatarUpload">
                        <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                    </el-upload>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="addOrUpdateTradeMark">确 定</el-button>
            </div>
       </el-dialog>
  </div>
</template>  

<script>

export default {
  name: 'index',
  data(){
      return{
         page:1,  // 第几页
         limit:3, // 每页显示几条数据
         total:0,  // 总共条数
         list:[],  //列表数据
         dialogFormVisible:false,
         tmForm:{
             tmName:'',
             logoUrl:'',
         },
         rules: {
             // required 必须要校验的字段 
            tmName: [
                { required: true, message: '请输入品牌名称', trigger: 'blur' },
                { min: 2, max: 10, message: '长度在 2到 10个字符', trigger: 'blur' }
            ],
            logoUrl: [
                { required: true, message: '请选择品牌的图片', trigger: 'change' }
            ],
        } 
      }
  },
  mounted(){
      this.getPageList();
  },
  methods:{
     async getPageList(pager=1){
         this.page = pager;
         const {page,limit } = this;
         let result = await this.$API.tradeMark.reqTradeMarkList(page,limit)
         console.log('result11',result)
         this.total = result.data.total;
         this.list = result.data.records;
      },
    //   handleCurrentChange(pager){
    //       this.page = pager
    //       this.getPageList();
    //   }
     handleSizeChange(imit){
        this.limit = imit;
        this.getPageList();
     },
     showDialog(){
         this.dialogFormVisible = true;
         this.tmForm = { tmName:'', logoUrl:'' }
     },
     // 修改某个品牌
     updateTradeMark(row){
         this.dialogFormVisible = true;
         // 这样写 就等于把 服务器的数据直接给 tmForm 了
         this.tmForm = {...row}  // 这样进行 浅拷贝 就可以了
     },
     // 图片上传成功
     handleAvatarSuccess(res, file) {
         // res  是图片上传成功 返回给前端图片在服务器的地址
        console.log('res111',res)
        // 收集品牌图片数据,因为将来要带给服务器
        this.tmForm.logoUrl = res.data;
      },
      // 图片上传之前
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      },
      //添加按钮
      addOrUpdateTradeMark(){
         this.$refs.ruleForm.validate(async valid=>{
         if(valid){
                this.dialogFormVisible = false;
                // 发请求 添加品牌 修改品牌
                let result = await this.$API.tradeMark.reqAddOrUpdateTradeMark(this.tmForm);
                if(result.code===200){
                    this.$message({
                        type:'success',
                        message:this.tmForm.id?'修改品牌成功':'添加品牌成功'
                    })
                    //如果是添加品牌 留在第一页  如果是修改 就留在当前页
                    this.getPageList(this.tmForm.id?this.page:1);
                 } 
             }else{
                 return false;
             }
         })
      },
      //删除品牌
      deleteTradeMark(row){
           this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          let result = await this.$API.tradeMark.reqDeleteTradeMark(row.id)
          if(result.code===200){
                this.$message({
                type: 'success',
                message: '删除成功!'
             });
             this.getPageList(this.list.length>1?this.page:this.page-1);
          }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
       }
    },
}
</script>

<style lang="scss">

.avatar-uploader .el-upload {
    border: 1px solid #ccc;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
     border: 1px solid #ccc;
  }


</style>
