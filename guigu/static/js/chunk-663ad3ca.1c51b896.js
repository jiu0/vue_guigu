(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-663ad3ca"],{"01d8":function(e,t,n){},"84d4":function(e,t,n){"use strict";n("01d8")},9133:function(e,t,n){"use strict";n.r(t);var s=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",[n("el-table",{staticStyle:{width:"100%"},attrs:{border:"",data:e.records}},[n("el-table-column",{attrs:{type:"index",label:"序号",width:"80px",align:"center"}}),n("el-table-column",{attrs:{label:"名称",prop:"skuName"}}),n("el-table-column",{attrs:{label:"描述",prop:"skuDesc"}}),n("el-table-column",{attrs:{label:"默认图片",width:"110px"},scopedSlots:e._u([{key:"default",fn:function(e){var t=e.row;e.$index;return[n("img",{staticStyle:{width:"80px",height:"80px"},attrs:{src:t.skuDefaultImg}})]}}])}),n("el-table-column",{attrs:{label:"重量",prop:"weight",width:"90px"}}),n("el-table-column",{attrs:{label:"价格",prop:"price",width:"80px"}}),n("el-table-column",{attrs:{prop:"tmName",label:"操作",width:"300px"},scopedSlots:e._u([{key:"default",fn:function(t){var s=t.row;t.$index;return[0===s.isSale?n("el-button",{attrs:{type:"success",size:"mini",icon:"el-icon-sort-down"},on:{click:function(t){return e.sale(s)}}}):n("el-button",{attrs:{type:"success",size:"mini",icon:"el-icon-sort-up"},on:{click:function(t){return e.cancel(s)}}}),n("el-button",{attrs:{type:"primary",size:"mini",icon:"el-icon-edit"},on:{click:e.edit}}),n("el-button",{attrs:{type:"info",size:"mini",icon:"el-icon-info"},on:{click:function(t){return e.getSkuInfo(s)}}}),n("el-button",{attrs:{type:"danger",size:"mini",icon:"el-icon-delete"}})]}}])})],1),n("el-pagination",{staticStyle:{"margin-top":"20px","text-align":"center"},attrs:{"current-page":e.page,total:e.total,"page-size":e.limit,"pager-count":7,"page-sizes":[3,5,10],layout:"prev, pager, next, jumper,->,sizes,total"},on:{"current-change":e.getSkuList,"size-change":e.handleSizeChange}}),n("el-drawer",{attrs:{visible:e.show,"show-close":!1,size:"50%"},on:{"update:visible":function(t){e.show=t}}},[n("el-row",[n("el-col",{attrs:{span:5}},[e._v("名称")]),n("el-col",{attrs:{span:16}},[e._v(e._s(e.skuInfo.skuName))])],1),n("el-row",[n("el-col",{attrs:{span:5}},[e._v("描述")]),n("el-col",{attrs:{span:16}},[e._v(e._s(e.skuInfo.skuDesc))])],1),n("el-row",[n("el-col",{attrs:{span:5}},[e._v("价格")]),n("el-col",{attrs:{span:16}},[e._v(e._s(e.skuInfo.price)+"元")])],1),n("el-row",[n("el-col",{attrs:{span:5}},[e._v("平台属性")]),n("el-col",{attrs:{span:16}},[e._l(e.skuInfo.skuAttrValueList,(function(t){return n("el-tag",{key:t.id,staticStyle:{"margin-right":"10px"},attrs:{type:"success"}},[e._v(" "+e._s(t.attrId)+"-- "+e._s(t.valueId))])}))],2)],1),n("el-row",[n("el-col",{attrs:{span:5}},[e._v("商品图片")]),n("el-col",{attrs:{span:16}},[n("el-carousel",{attrs:{"indicator-position":"outside"}},e._l(e.skuInfo.skuImageList,(function(e){return n("el-carousel-item",{key:e.id},[n("img",{attrs:{src:e.imgUrl}})])})),1)],1)],1)],1)],1)},r=[],a=n("1da1"),i=(n("96cf"),{name:"index",data:function(){return{page:1,limit:4,records:[],total:0,skuInfo:{},show:!1}},mounted:function(){this.getSkuList()},methods:{getSkuList:function(){var e=arguments,t=this;return Object(a["a"])(regeneratorRuntime.mark((function n(){var s,r,a,i;return regeneratorRuntime.wrap((function(n){while(1)switch(n.prev=n.next){case 0:return s=e.length>0&&void 0!==e[0]?e[0]:1,t.page=s,r=t.page,a=t.limit,n.next=5,t.$API.sku.reqSkuList(r,a);case 5:i=n.sent,200===i.code&&(t.records=i.data.records,t.total=i.data.total);case 7:case"end":return n.stop()}}),n)})))()},handleSizeChange:function(e){this.limit=e,this.getSkuList()},sale:function(e){var t=this;return Object(a["a"])(regeneratorRuntime.mark((function n(){var s;return regeneratorRuntime.wrap((function(n){while(1)switch(n.prev=n.next){case 0:return n.next=2,t.$API.sku.reqSale(e.id);case 2:s=n.sent,200===s.code&&(e.isSale=1,t.$message({type:"success",message:"上架成功"}));case 4:case"end":return n.stop()}}),n)})))()},cancel:function(e){var t=this;return Object(a["a"])(regeneratorRuntime.mark((function n(){var s;return regeneratorRuntime.wrap((function(n){while(1)switch(n.prev=n.next){case 0:return n.next=2,t.$API.sku.reqCancel(e.id);case 2:s=n.sent,200===s.code&&(e.isSale=0,t.$message({type:"success",message:"下架成功"}));case 4:case"end":return n.stop()}}),n)})))()},edit:function(){this.$message({type:"info",message:"开发中..."})},getSkuInfo:function(e){var t=this;return Object(a["a"])(regeneratorRuntime.mark((function n(){var s;return regeneratorRuntime.wrap((function(n){while(1)switch(n.prev=n.next){case 0:return t.show=!0,n.next=3,t.$API.sku.reqSkuById(e.id);case 3:s=n.sent,console.log("4444",s),200===s.code&&(t.skuInfo=s.data);case 6:case"end":return n.stop()}}),n)})))()}}}),o=i,c=(n("b0fd"),n("84d4"),n("2877")),l=Object(c["a"])(o,s,r,!1,null,"4c028bcd",null);t["default"]=l.exports},a6bf:function(e,t,n){},b0fd:function(e,t,n){"use strict";n("a6bf")}}]);