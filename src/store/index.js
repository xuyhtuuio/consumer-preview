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
      formId: "",
      formName: "",
      // logo:{
      //   icon:"el-icon-eleme",
      //   background:"#1e90ff"
      // },
      settings: {
        undo: false,
        target: [],
        // commiter: [],
        // admin:[],
        // sign: false,
        notify: {
          types: ["APP"],
          title: "消息通知标题"
        }
      },
      formItems: [],
      // groupId: undefined,
      // TODO 暂时处理
      //   formItems: [{
      //   "id": "field1843713764987",
      //   "title": "TextInput",
      //   "name": "TextInput",
      //   "module": "基本信息",
      //   "value": "",
      //   "valueType": "String",
      //   "props": {
      //    "required": true,
      //    "placeholder": "提示文字",
      //    "numberOfWords": "50",
      //    "exclusiveRowOrNot": true
      //   }
      //  }, {
      //   "id": "field1042117480967",
      //   "title": "TextareaInput",
      //   "name": "TextareaInput",
      //   "module": "基本信息",
      //   "value": "",
      //   "valueType": "String",
      //   "props": {
      //    "required": true,
      //    "placeholder": "233",
      //    "numberOfWords": "450"
      //   }
      //  }, {
      //   "id": "field5779617935241",
      //   "title": "SelectInput",
      //   "name": "SelectInput",
      //   "module": "宣传渠道",
      //   "value": "",
      //   "valueType": "String",
      //   "props": {
      //    "required": true,
      //    "placeholder": "2fwewe",
      //    "expanding": true,
      //    "options": [{
      //     "id": 0,
      //     "value": "111"
      //    }, {
      //     "id": 1,
      //     "value": "222"
      //    }]
      //   }
      //  }, {
      //   "id": "field2570217989262",
      //   "title": "MultipleGroupsSelect",
      //   "name": "MultipleGroupsSelect",
      //   "module": "宣传渠道",
      //   "value": [],
      //   "valueType": "Array",
      //   "props": {
      //    "required": true,
      //    "placeholder": "2fwewe23",
      //    "expanding": false,
      //    "options": [{
      //     label: '上传渠道',
      //     children: [{
      //       "id": 0,
      //       "value": "111"
      //      }, {
      //       "id": 1,
      //       "value": "222"
      //      }]
      //    }, {
      //     label: '下传渠道',
      //     children: [{
      //       "id": 3,
      //       "value": "333"
      //      }, {
      //       "id": 4,
      //       "value": "444"
      //      }]
      //    }]
      //   }
      //  }, {
      //   "id": "field6702718067956",
      //   "title": "Cascader",
      //   "name": "Cascader",
      //   "module": "核对要点",
      //   "value": [],
      //   "valueType": "Tree",
      //   "props": {
      //    "required": true,
      //    "placeholder": "是大法师的",
      //    "multiple": false,
      //    "options": [{
      //     "id": "0",
      //     "value": "1111",
      //     "children": [{
      //      "id": "0-0",
      //      "value": "1-111",
      //      "children": []
      //     }, {
      //      "id": "0-1",
      //      "value": "1-222",
      //      "children": []
      //     }]
      //    }, {
      //     "id": "1",
      //     "value": "222",
      //     "children": [{
      //      "id": "1-0",
      //      "value": "2-111",
      //      "children": []
      //     }]
      //    }]
      //   }
      //  }, {
      //   "id": "field6408618130817",
      //   "title": "TimePicker",
      //   "name": "TimePicker",
      //   "module": "核对要点",
      //   "value": "",
      //   "valueType": "Date",
      //   "props": {
      //    "required": true,
      //    "placeholder": "是啊都是啥地方",
      //    "format": "yyyy-MM-dd hh:mm:ss"
      //   }
      //  }],
      process: {
        id: "root",
        parentId: null,
        type: "ROOT",
        name: "申请人",
        desc: "任何人",
        props: {
          assignedUser: [],
          formPerms: []
        },
        children: {}
      },
      remark: "",

    },
    designSave: {},
    checkApprovedForm: {
      approvedOpinionRequired: true,  //默认给了采纳所以为true
      uploadFileRequired: false, //
      uploadFileRadio: 1, //默认需要上传
      approvedOpinionForm: [],
      fileUploadForm: [],
      opinionStorage: false,

      editOpinionStorage: false,
      editOpinionForm: {},
      editOpinionRequired: false
    },
    authObject: {
      funPerm: [
        {
          code: '1',
          name: '首页',
          pathName: 'home',
          type: 'view'
        },
        {
          code: '1',
          name: '申请中心',
          pathName: 'apply-list',
          type: 'view'
        },
        {
          code: '1',
          name: '审批中心',
          pathName: 'approval-list',
          path: '/manage/labelManage',
          type: 'view',
          "child": [
            {
              "code": "",
              "name": "全部任务",
              "type": "export"
            }
          ]
        },
        {
          "code": "",
          "name": '用户管理',
          "pathName": 'UserManage',
          "path": 'userManage',
          "type": 'edit',
        },
        {
          "code": "",
          "name": '表单管理',
          "pathName": 'FormManage',
          "path": 'formManage',
          "type": 'edit',
        },
        {
          "code": "",
          "name": '流程管理',
          "pathName": 'FlowManage',
          "path": 'flowManage',
          "type": 'edit',
        },
        {
          "code": "",
          "name": '角色/权限管理',
          "pathName": 'RolePermission',
          "path": 'rolePermission',
          "type": 'view',
        },
        {
          "code": "",
          "name": '标签管理',
          "pathName": 'LabelManage',
          "path": 'labelManage',
          "type": 'view',
        },
        {
          "code": "",
          "name": '意见管理',
          "pathName": 'OpinionManage',
          "path": 'opinionManage',
          "type": 'view',
        },
        {
          code: "3",
          name: '后台管理',
          pathName: '',
          path: '',
          type: 'view',
        },
        
        {
          "code": "",
          "name": '产品图谱',
          "pathName": 'productmap',
          "path": '',
          "type": 'view',
        },
        {
          "code": "",
          "name": '统计中心',
          "pathName": '',
          "path": '',
          "type": '',
        },
      ],
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
      state.checkApprovedForm.approvedOpinionRequired = true //默认给了采纳所以为true
      state.checkApprovedForm.uploadFileRequired = false
      state.checkApprovedForm.approvedOpinionForm = []
      state.checkApprovedForm.fileUploadForm = []
      state.checkApprovedForm.opinionStorage = false
      state.checkApprovedForm.editOpinionStorage = false
      state.checkApprovedForm.editOpinionForm = {}
      state.checkApprovedForm.editOpinionRequired = false
      state.checkApprovedForm.uploadFileRadio = false
    }
  },
  getters: {
  },
  actions: {},
  modules: {}
})
