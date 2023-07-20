import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
export default new Vuex.Store({
  state: {
    nodeMap: new Map(),
    isEdit: null,
    breadcrumbList: [],
    selectedNode: {},
    design: {},
    nodeArr: [] // 指定节点数组，流程图中所有的节点（包含，申请人，审核人，抄送人，二次会签）
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
