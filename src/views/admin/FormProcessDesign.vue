<template>
  <el-container>
    <el-header>
      <layout-header
        ref="layoutHeader"
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
    <secondary-confirmation
      :option="confirmOption"
      ref="confirmation"
      @handleConfirm="handleSubmitLimitTime(confirmOption)"
    ></secondary-confirmation>
  </el-container>
</template>

<script>
import { saveProcess, publishProcess, getProcessDetail } from '@/api/design'
import FormBaseSetting from '@/views/admin/layout/FormBaseSetting'
import ProcessDesign from '@/views/admin/layout/ProcessDesign'
import FormProSetting from '@/views/admin/layout/FormProSetting'
import secondaryConfirmation from '@/components/common/secondaryConfirmation';
import LayoutHeader from './LayoutHeader'
export default {
  name: 'FormProcessDesign',
  components: { LayoutHeader, FormBaseSetting, ProcessDesign, FormProSetting, secondaryConfirmation },
  data() {
    return {
      confirmOption: {
        message: '您确定审批流程已配置完毕,并需要将其发布，发布后立即生效，是否继续?',
        cancelBtn: '取消',
        confirmBtn: '发布',
        noClose: true
      },
      isNew: true,
      validStep: 0,
      timer: null,
      activeSelect: this.$route.name || 'baseSetting',
      validVisible: false,
      validResult: {},
      validOptions: [
        { title: '基础信息', description: '', icon: '', status: '' },
        // {title: '审批表单', description: '', icon: '', status: ''},
        { title: '审批流程', description: '', icon: '', status: '' },
        { title: '扩展设置', description: '', icon: '', status: '' }
      ],
      validComponents: ['baseSetting', 'processDesign', 'proSetting'],
    }
  },
  computed: {
    setup() {
      return this.$store.state.design
    },
    errTitle() {
      if (this.validResult.finished && !this.validResult.success) {
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
    const formId = this.$route.query.code
    // 判断传参，决定是新建还是加载原始数据

    if (!this.$isEmpty(formId)) {
      this.isNew = false
      this.loadFormInfo(formId)
    } else {
      this.loadInitFrom()
    }
    // let group = this.$route.query.group
    // this.setup.groupId = this.$isEmpty(group) ? null : parseInt(group)
  },
  beforeDestroy() {
    this.stopTimer()
  },
  methods: {
    async loadFormInfo(formId) {
      const res = await getProcessDetail(formId)
      const design = res.data.data
      design.formId = +design.formId || ''
      design.settings = JSON.parse(design.settings)
      design.formItems = JSON.parse(design.formItems)
      design.process = JSON.parse(design.process)
      this.$store.commit('loadForm', design)
      this.$store.state.designSave = JSON.stringify(design)
    },
    loadInitFrom() {
      this.$store.commit('loadForm', {
        ...this.$store.state.tempDesign
      })
      this.$store.state.designSave = JSON.stringify(this.$store.state.tempDesign)
    },
    validateDesign() {
      this.validVisible = true
      this.validStep = 0
      this.showValiding()
      this.stopTimer()
      this.timer = setInterval(() => {
        this.validResult.errs = this.$refs[this.validComponents[this.validStep]].validate() || []
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
    async saveProcess(callback) {
      if ((!this.$refs['baseSetting'].setup.templateName) || (this.$refs['baseSetting'].setup.templateName?.length < 2) || (this.$refs['baseSetting'].setup.templateName?.length > 10)) {
        this.$message.warning('流程名称未设置或长度不对')
        return false;
      }

      const user = JSON.parse(window.localStorage.getItem('user_name'))
      // console.log('this.setup.process', this.setup.process)
      const template = {
        formId: this.setup.formId,
        formName: this.setup.formName,
        templateName: this.setup.templateName,
        templateId: this.setup.templateId,
        // logo: JSON.stringify(this.setup.logo),
        settings: JSON.stringify(this.setup.settings),
        // groupId: this.setup.groupId,
        formItems: JSON.stringify(this.setup.formItems),
        process: JSON.stringify(this.setup.process),
        remark: this.setup.remark,
        status: '',
        isRevoke: this.setup.settings.undo,
        node: this.setup.settings.target,
        createUserName: user.fullname,
        createUserId: user.id
      }
      // 调取暂存接口
      const res = await saveProcess(template)
      if (res.data.data) {
        this.$message.success('已保存当前内容至草稿箱')
        this.$store.state.designSave = JSON.stringify(this.$store.state.design)
        callback && callback();
      }
    },
    publishProcess() {
      this.validateDesign()
    },
    handleSubmitLimitTime() {
      this.$message.info('发布中，请稍等...');
      this.$refs.confirmation.isDisabled = true;
      const user = JSON.parse(window.localStorage.getItem('user_name'))
      const template = {
        formId: this.setup.formId,
        formName: this.setup.formName,
        templateName: this.setup.templateName,
        templateId: this.setup.templateId,
        // logo: JSON.stringify(this.setup.logo),
        settings: JSON.stringify(this.setup.settings),
        // groupId: this.setup.groupId,
        formItems: JSON.stringify(this.setup.formItems),
        process: JSON.stringify(this.setup.process),
        remark: this.setup.remark,
        status: '',
        isRevoke: this.setup.settings.undo,
        node: this.setup.settings.target,
        createUserName: user.fullname,
        createUserId: user.id
      }
      // if (this.isNew || this.$isEmpty(this.setup.formId)){
      publishProcess(template).then(() => {
        this.$refs.confirmation.isDisabled = false;
        this.$refs.confirmation.dialogVisible = false;
        this.$message.success('发布成功！可在流程管理列表页查看')
        // this.setup.processDefinitionI
        this.validVisible = false
        this.$router.push({
          name: 'FlowManage'
        })
      }).catch(() => {
        this.$refs.confirmation.isDisabled = false;
        this.$message.error('发布失败')
      })
    },
    doPublish() {
      this.$refs.confirmation.dialogVisible = true;
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
    width: 250px;
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
