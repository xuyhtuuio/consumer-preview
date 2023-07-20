import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
export default new Vuex.Store({
  state: {
    nodeMap: new Map(),
    isEdit: null,
    breadcrumbList: [],
    selectedNode: {},
    design: {}
  },
  mutations: {
    selectedNode(state, val) {
      state.selectedNode = val
    },
    loadForm(state, val){
      state.design = val
    },
    setIsEdit(state, val){
      state.isEdit = val
    },
    setBreadcrumbList(state,val) {
      state.breadcrumbList= val
    }
  },
  getters: {
  },
  actions: {},
  modules: {}
})
