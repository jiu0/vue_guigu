import mockRequest from '@/utils/mockRequest'
const state ={
    list:{}
}

const mutations = {
    GETDATA(state,val){
        state.list = val
    }
}

const actions = {
   // 发请求 获取首页的 mock 数据
   async getData({commit}){
     let result = await mockRequest.get('/home/list')
     console.log('666',result)
     if(result.code === 20000){
        commit('GETDATA',result.data)
     }
   }
}

const getters ={

}

export default {
  state,
  mutations,
  actions,
  getters,
}

