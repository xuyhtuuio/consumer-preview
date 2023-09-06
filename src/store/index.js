import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
export default new Vuex.Store({
  state: {
    nodeMap: new Map(),
    isEdit: null,
    isPreview: false,
    breadcrumbList: [],
    selectedNode: {},
    design: {},
    tempDesign: {
      formId: '',
      formName: '',
      settings: {
        undo: false,
        target: [],
        // commiter: [],
        // admin:[],
        // sign: false,
        notify: {
          types: ['APP'],
          title: '消息通知标题'
        }
      },
      formItems: [],
      process: {
        id: 'root',
        parentId: null,
        type: 'ROOT',
        name: '申请人',
        desc: '任何人',
        props: {
          assignedUser: [],
          formPerms: []
        },
        children: {}
      },
      remark: '',

    },
    designSave: {},
    checkApprovedForm: {
      approvedOpinionRequired: true, // 默认给了采纳所以为true
      uploadFileRequired: false, //
      uploadFileRadio: 1, // 默认需要上传
      approvedOpinionForm: [],
      fileUploadForm: [],
      opinionStorage: false,
      editOpinionStorage: false,
      editOpinionForm: {},
      editOpinionRequired: false
    },
    permissionsPage: { // 页面权限存储
      defaultPerm: [],
      funPerms: [],
      dataPerm: [],
    }
  },
  mutations: {
    selectedNode(state, val) {
      state.selectedNode = val
    },
    loadForm(state, val) {
      state.design = val
    },
    setIsEdit(state, val) {
      state.isEdit = val
    },
    setIsPreview(state, val) {
      state.isPreview = val
    },
    setBreadcrumbList(state, val) {
      state.breadcrumbList = val
    },
    setApprovedOpinionRequired(state, val) {
      state.checkApprovedForm.approvedOpinionRequired = val
    },
    setApprovedOpinionForm(state, val) {
      state.checkApprovedForm.approvedOpinionForm = val
    },
    setOpinionStorage(state, val) {
      state.checkApprovedForm.opinionStorage = val
    },
    setUploadFileForm(state, val) {
      state.checkApprovedForm.fileUploadForm = val
    },
    setUploadFileRequired(state, val) {
      state.checkApprovedForm.uploadFileRequired = val
    },
    setUploadFileRadio(state, val) {
      state.checkApprovedForm.uploadFileRadio = val
    },
    setEditOpinionStorage(state, val) {
      state.checkApprovedForm.editOpinionStorage = val
    },
    setEditOpinionForm(state, val) {
      state.checkApprovedForm.editOpinionForm = val
    },
    setEditOpinionRequired(state, val) {
      state.checkApprovedForm.editOpinionRequired = val
    },
    setCheckApprovedFormFalse(state) {
      state.checkApprovedForm.approvedOpinionRequired = true // 默认给了采纳所以为true
      state.checkApprovedForm.uploadFileRequired = false
      state.checkApprovedForm.approvedOpinionForm = []
      state.checkApprovedForm.fileUploadForm = []
      state.checkApprovedForm.opinionStorage = false
      state.checkApprovedForm.editOpinionStorage = false
      state.checkApprovedForm.editOpinionForm = {}
      state.checkApprovedForm.editOpinionRequired = false
      state.checkApprovedForm.uploadFileRadio = 1
    }
  },
  getters: {
  },
  actions: {},
  modules: {}
})
