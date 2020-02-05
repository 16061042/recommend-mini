import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
       code: '',
       authorization: false,
       register: false,
       token: '',
       unionId: '',
       EXPERIENCE: ['','应届毕业生','1年以下','1-3年','3-5年','5-10年','10年以上'],
       EDUCATION: ['','本科','硕士','博士','大专','高中'],
       infoChange: true
    },
    mutations: {
        setCode(state, code) {
            state.code = code
        },
        setAuthorization(state, status){
            state.authorization = status
        },
        setRegister(state, status){
            state.register = status
        },
        setToken(state, token){
            state.token = token
        },
        setInfoChange(state){
            state.infoChange = !state.infoChange
        },
        setUnionId(state, unionId){
            state.unionId = unionId
        }
    }
})

export default store
