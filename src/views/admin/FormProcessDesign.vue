<template>
  <el-container>
    <el-header style="background: white">
      <layout-header
        v-model="activeSelect"
        @changeRoute="(active) => activeSelect = active"
        @save="saveProcess"
        @publish="publishProcess">
      </layout-header>
    </el-header>
    <div class="layout-body">
      <form-base-setting ref="baseSetting" v-show="activeSelect === 'baseSetting'"/>
      <process-design ref="processDesign" v-show="activeSelect === 'processDesign'"/>
      <form-pro-setting ref="proSetting" v-show="activeSelect === 'proSetting'"/>
    </div>
    <w-dialog :showFooter="false" v-model="validVisible" title="设置项检查">
      <el-steps align-center :active="validStep" finish-status="success">
        <el-step v-for="(step, i) in validOptions" :title="step.title" :key="i"
                 :icon="step.icon" :status="step.status" :description="step.description"/>
      </el-steps>
      <el-result :icon="validIcon" :title="errTitle" :subTitle="validResult.desc">
        <i slot="icon" style="font-size: 30px" v-if="!validResult.finished" class="el-icon-loading"></i>
        <div slot="subTitle" class="err-info" v-if="validResult.errs.length > 0">
          <ellipsis hover-tip v-for="(err, i) in validResult.errs" :key="i + '_err'" :content="err">
            <i slot="pre" class="el-icon-warning-outline"></i>
          </ellipsis>
        </div>
        <template slot="extra">
          <el-button type="primary" v-if="validResult.finished" size="medium" @click="doAfter">
            {{ validResult.action }}
          </el-button>
        </template>
      </el-result>
    </w-dialog>
  </el-container>
</template>

<script>
import LayoutHeader from './LayoutHeader'
import {getFormDetail, createForm, updateFormDetail} from '@/api/design'
import FormBaseSetting from '@/views/admin/layout/FormBaseSetting'
import ProcessDesign from '@/views/admin/layout/ProcessDesign'
import FormProSetting from '@/views/admin/layout/FormProSetting'

export default {
  name: "FormProcessDesign",
  components: {LayoutHeader, FormBaseSetting, ProcessDesign, FormProSetting},
  data() {
    return {
      isNew: true,
      validStep: 0,
      timer: null,
      activeSelect: this.$route.name || 'baseSetting',
      validVisible: false,
      validResult: {},
      validOptions: [
        {title: '基础信息', description: '', icon: '', status: ''},
        // {title: '审批表单', description: '', icon: '', status: ''},
        {title: '审批流程', description: '', icon: '', status: ''},
        {title: '扩展设置', description: '', icon: '', status: ''}
      ],
      validComponents: ['baseSetting', 'processDesign', 'proSetting'],
    }
  },
  computed:{
    setup(){
      return this.$store.state.design
    },
    errTitle(){
      if (this.validResult.finished && !this.validResult.success){
        return this.validResult.title + ` (${this.validResult.errs.length}项错误) 😥`
      }
      return this.validResult.title
    },
    validIcon() {
      if (!this.validResult.finished) {
        return 'el-icon-loading'
      } else if (this.validResult.success) {
        return 'success'
      } else {
        return 'warning'
      }
    }
  },
  created() {
    this.showValiding()
    let formId = this.$route.query.code
    //判断传参，决定是新建还是加载原始数据
    this.loadInitFrom()
    if (!this.$isEmpty(formId)){
      this.isNew = false
      this.loadFormInfo(formId)
    }
    // let group = this.$route.query.group
    // this.setup.groupId = this.$isEmpty(group) ? null : parseInt(group)
  },
  beforeDestroy() {
    this.stopTimer()
  },
  methods:{
    loadFormInfo(formId){
      getFormDetail(formId).then(rsp => {
        console.log(rsp.data)
        let form = rsp.data;
        // form.logo = JSON.parse(form.logo)
        form.settings = JSON.parse(form.settings)
        form.formItems = JSON.parse(form.formItems)
        form.process = JSON.parse(form.process)
        this.$store.commit('loadForm', form)
      }).catch(err => {
        this.$message.error(err)
      })
    },
    loadInitFrom(){
      this.$store.commit('loadForm', {
        formId: null,
        formName:"",
        // logo:{
        //   icon:"el-icon-eleme",
        //   background:"#1e90ff"
        // },
        settings:{
          undo: false,
          nodeId: []
          // commiter: [],
          // admin:[],
          // sign: false,
          // notify:{
          //   types: ["APP"],
          //   title: "消息通知标题"
          // }
        },
        // groupId: undefined,
        // TODO 暂时处理
        formItems: [{
        "id": "field1843713764987",
        "title": "TextInput",
        "name": "TextInput",
        "module": "基本信息",
        "value": "",
        "valueType": "String",
        "props": {
         "required": true,
         "placeholder": "提示文字",
         "numberOfWords": "50",
         "exclusiveRowOrNot": true
        }
       }, {
        "id": "field1042117480967",
        "title": "TextareaInput",
        "name": "TextareaInput",
        "module": "基本信息",
        "value": "",
        "valueType": "String",
        "props": {
         "required": true,
         "placeholder": "233",
         "numberOfWords": "450"
        }
       }, {
        "id": "field5779617935241",
        "title": "SelectInput",
        "name": "SelectInput",
        "module": "宣传渠道",
        "value": "",
        "valueType": "String",
        "props": {
         "required": true,
         "placeholder": "2fwewe",
         "expanding": true,
         "options": [{
          "id": 0,
          "value": "111"
         }, {
          "id": 1,
          "value": "222"
         }]
        }
       }, {
        "id": "field2570217989262",
        "title": "MultipleSelect",
        "name": "MultipleSelect",
        "module": "宣传渠道",
        "value": [],
        "valueType": "Array",
        "props": {
         "required": true,
         "placeholder": "2fwewe23",
         "expanding": false,
         "options": [{
          "id": 0,
          "value": "111"
         }, {
          "id": 1,
          "value": "222"
         }]
        }
       }, {
        "id": "field6702718067956",
        "title": "Cascader",
        "name": "Cascader",
        "module": "核对要点",
        "value": [],
        "valueType": "Tree",
        "props": {
         "required": true,
         "placeholder": "是大法师的",
         "multiple": false,
         "options": [{
          "id": "0",
          "value": "1111",
          "children": [{
           "id": "0-0",
           "value": "1-111",
           "children": []
          }, {
           "id": "0-1",
           "value": "1-222",
           "children": []
          }]
         }, {
          "id": "1",
          "value": "222",
          "children": [{
           "id": "1-0",
           "value": "2-111",
           "children": []
          }]
         }]
        }
       }, {
        "id": "field6408618130817",
        "title": "TimePicker",
        "name": "TimePicker",
        "module": "核对要点",
        "value": "",
        "valueType": "Date",
        "props": {
         "required": true,
         "placeholder": "是啊都是啥地方",
         "format": "yyyy-MM-dd hh:mm:ss"
        }
       }],
        process:{
          id: "root",
          parentId: null,
          type: "ROOT",
          name: "申请人",
          desc: "任何人",
          props:{
            assignedUser: [],
            formPerms: []
          },
          children: {}
        },
        remark: ""
      })
    },
    validateDesign() {
      this.validVisible = true
      this.validStep = 0
      this.showValiding()
      this.stopTimer()
      this.timer = setInterval(() => {
        this.validResult.errs = this.$refs[this.validComponents[this.validStep]].validate() || []
        console.log(this.validComponents[this.validStep], this.validResult.errs)
        if (Array.isArray(this.validResult.errs) && this.validResult.errs.length === 0) {
          this.validStep++;
          if (this.validStep >= this.validOptions.length) {
            this.stopTimer()
            this.showValidFinish(true)
          }
        } else {
          this.stopTimer()
          this.validOptions[this.validStep].status = 'error'
          this.showValidFinish(false, this.getDefaultValidErr())
        }
      }, 300)
    },
    getDefaultValidErr() {
      switch (this.validStep) {
        case 0:
          return '请检查基础设置项';
        case 1:
          return '请检查审批流程，查看对应标注节点错误信息'
        case 2:
          return '请检查扩展设置'
        default:
          return '未知错误'
      }
    },
    showValidFinish(success, err) {
      this.validResult.success = success
      this.validResult.finished = true
      this.validResult.title = success ? '校验完成 😀' : '校验失败 '
      this.validResult.desc = success ? '设置项校验成功，是否提交？' : err
      this.validResult.action = success ? '提 交' : '去修改'
    },
    showValiding() {
      this.validResult = {
        errs: [],
        finished: false,
        success: false,
        title: '检查中...',
        action: '处理',
        desc: '正在检查设置项'
      }
      this.validStep = 0
      this.validOptions.forEach(op => {
        op.status = ''
        op.icon = ''
        op.description = ''
      })
    },
    doAfter() {
      if (this.validResult.success) {
        this.doPublish()
      } else {
        this.activeSelect = this.validComponents[this.validStep]
        this.validVisible = false
      }
    },
    stopTimer() {
      if (this.timer) {
        clearInterval(this.timer)
      }
    },
    saveProcess() {
      let template = {
        formId: this.setup.formId,
        formName: this.setup.formName,
        // logo: JSON.stringify(this.setup.logo),
        settings: JSON.stringify(this.setup.settings),
        // groupId: this.setup.groupId,
        formItems: JSON.stringify(this.setup.formItems),
        process: JSON.stringify(this.setup.process),
        remark: this.setup.remark
      }
      // 调取暂存接口
    },
    publishProcess() {
      this.validateDesign()
    },
    doPublish(){
      this.$confirm('<div><div><i class="el-alert__icon el-icon-warning" style="color: #e6a23c;font-size: 26px;"></i></div>您确定审批流程已配置完毕,并需要将其发布，发布后立即生效，是否继续?</div>', '提示', {
        confirmButtonText: '发布',
        cancelButtonText: '取消',
        dangerouslyUseHTMLString: true,
        // type: 'warning'
      }).then(() => {
        console.log(this.setup)
        let template = {
          formId: this.setup.formId,
          formName: this.setup.formName,
          // logo: JSON.stringify(this.setup.logo),
          settings: JSON.stringify(this.setup.settings),
          // groupId: this.setup.groupId,
          formItems: JSON.stringify(this.setup.formItems),
          process: JSON.stringify(this.setup.process),
          remark: this.setup.remark
        }
        if (this.isNew || this.$isEmpty(this.setup.formId)){
          createForm(template).then(rsp => {
            this.$message.success("创建表单成功")
            // this.$router.push("/formsPanel")
          }).catch(err => {
            this.$message.error(err)
          })
        }else {
          updateFormDetail(template).then(rsp => {
            this.$message.success("更新表单成功")
            // this.$router.push("/formsPanel")
          }).catch(err => {
            this.$message.error(err)
          })
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>

.layout-body{
  min-width: 980px;
}
/deep/ .el-step {
  .is-success {
    color: #2a99ff;
    border-color: #2a99ff;
  }
}

.err-info{
  max-height: 180px;
  overflow-y: auto;
  & > div{
    padding: 5px;
    margin: 2px 0;
    width: 220px;
    text-align: left;
    border-radius: 3px;
    background: rgb(242 242 242);
  }
  i{
    margin: 0 5px;
  }
}
::-webkit-scrollbar {
  width: 2px;
  height: 2px;
  background-color: white;
}

::-webkit-scrollbar-thumb {
  border-radius: 16px;
  background-color: #e8e8e8;
}

</style>
