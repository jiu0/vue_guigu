<template>
  <div>
    <el-card class="box-card" style="margin:10px 0;">
        <div slot="header" class="clearfix">
            <el-tabs class="tab" v-model="activeName">
                <el-tab-pane label="销售额" name="sale"></el-tab-pane>
                <el-tab-pane label="访问量" name="visite"></el-tab-pane>
            </el-tabs>
            <!-- 头部右侧内容 -->
            <div class="right">
               <span @click="setDay">今日</span>
               <span @click="setWeek">本周</span>
               <span @click="setMonth">本月</span>
               <span @click="setYear">本年</span>
               <el-date-picker
                class="date"
                v-model="date"
                type="daterange"
                size="mini"      
                value-format="yyyy-MM-dd"          
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
                </el-date-picker>
            </div>
        </div>
        <div>
           <el-row :gutter="10">
              <el-col :span="17">
                  <div class="charts" ref="charts"></div>
              </el-col>
              <el-col :span="7">
                  <div class="right2">
                      <h3>门店{{title }}排名</h3>
                      <ul>
                            <li>
                                <span class="rindex">0</span>
                                <span>肯德基</span>
                                <span class="rvalue">123456</span>
                            </li>
                            <li>
                                <span class="rindex">1</span>
                                <span>肯德基</span>
                                <span class="rvalue">123456</span>
                            </li>
                            <li>
                                <span class="rindex">3</span>
                                <span>肯德基</span>
                                <span class="rvalue">123456</span>
                            </li>
                            <li>
                                <span>4</span>
                                <span>肯德基</span>
                                <span class="rvalue">123456</span>
                            </li>
                            <li>
                                <span>5</span>
                                <span>肯德基</span>
                                <span class="rvalue">123456</span>
                            </li>
                            <li>
                                <span>6</span>
                                <span>肯德基</span>
                                <span class="rvalue">123456</span>
                            </li>
                            <li>
                                <span>7</span>
                                <span>肯德基</span>
                                <span class="rvalue">123456</span>
                           </li>
                      </ul>
                  </div>
              </el-col>
           </el-row>
        </div>
   </el-card>
  </div>
</template>

<script>
import * as echarts from 'echarts';
import dayjs from 'dayjs';
import {mapState} from 'vuex'
export default {
  name: 'index',
  data(){
      return{
          activeName:'sale',
          mycharts:null,
          date:[],
      }
   },
   computed:{
      // 标题
      title(){
          return this.activeName === 'sale'? '销售额':'访问量'
      },
      ...mapState({
          listState:state=>state.home.list
      })
   },
   methods:{
      setDay(){
         const day = dayjs().format('YYYY-MM-DD')
         this.date = [day,day]
      },
      setWeek(){
          const start = dayjs().day(1).format('YYYY-MM-DD')
          const end = dayjs().day(7).format('YYYY-MM-DD')
          this.date = [start,end]
      },
      setMonth(){
          const start = dayjs().startOf('month').format('YYYY-MM-DD')
          const end = dayjs().endOf('month').format('YYYY-MM-DD')
          this.date = [start,end]
      },
      setYear(){
          const start = dayjs().startOf('year').format('YYYY-MM-DD')
          const end = dayjs().endOf('year').format('YYYY-MM-DD')
          this.date = [start,end]
      }
   },
   watch:{
     // 监听属性 重新赋值标题的值
     title(){
       this.mycharts.setOption({
            title: {
                text: this.title 
            },
            xAxis: [
              {
                data:this.title==='销售额'?this.listState.orderFullYearAxis:this.listState.userFullYearAxis,
              },
            ],
            series: [
              {
                name: "Direct",
                type: "bar",
                barWidth: "60%",
                data:this.title==='销售额'?this.listState.orderFullYear:this.listState.userFullYear,
                color: "yellowgreen",
              },
            ],
       })
     },
     listState(){
          this.mycharts.setOption({
            title: {
                text: this.title,
            },
            tooltip: {
                trigger: "axis",
                axisPointer: {
                type: "shadow",
                },
            },
            grid: {
                left: "3%",
                right: "4%",
                bottom: "3%",
                containLabel: true,
            },
            xAxis: [
                {
                type: "category",
                data:this.listState.orderFullYearAxis,
                axisTick: {
                    alignWithLabel: true,
                },
                },
            ],
            yAxis: [
               {
                axisLine:{
                     show:true
                },
              }  
            ],
            series: [
                {
                name: "Direct",
                type: "bar",
                barWidth: "60%",
                data: this.listState.orderFullYear,
                color: "yellowgreen",
                },
            ],
        })
     }
   },
   mounted(){
       //顶部是mounted：为什么第一次没有数据，没有数据因此不显示
       this.mycharts = echarts.init(this.$refs.charts);
       this.mycharts.setOption({
        title: {
            text: this.title,
        },
        tooltip: {
            trigger: "axis",
            axisPointer: {
            type: "shadow",
            },
        },
        grid: {
            left: "3%",
            right: "4%",
            bottom: "3%",
            containLabel: true,
        },
        xAxis: [
            {
            type: "category",
            data: [],
            axisTick: {
                alignWithLabel: true,
            },
            },
        ],
        yAxis: [
            // {
            //   type: "value",
            // },
            {
                axisLine:{
                     show:true
                 },
            }
        ],
        series: [
            {
            name: "Direct",
            type: "bar",
            barWidth: "60%",
            data: [],
            color: "yellowgreen",
            },
         ],
      })
   },
}
</script>

<style scoped>
.clearfix {
  position: relative;
  display: flex;
  justify-content: space-between;
}
.tab {
  width: 100%;
}
.right {
  position: absolute;
  right: 0px;
}
.date {
  width: 250px;
  margin: 0px 20px;
}
.right span {
  margin: 0px 10px;
}
.charts {
  width: 100%;
  height: 300px;
}
ul {
  list-style: none;
  width: 100%;
  height: 300px;
  padding: 0px;
}
ul li {
  height: 8%;
  margin: 10px 0px;
}
.rindex {
  float: left;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: black;
  color: white;
  text-align: center;
}
.rvalue {
  float: right;
}
</style>
