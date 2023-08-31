<template>
  <div class="tools">
    <div ref="tools">
      <div v-for="(item, index) in tools" :key="index" :arrow-offset="-30" :ref="`popover-${item.toolSign}`">
        <span :ref='`sideBar-popover-` + item.toolSign'
          :class="crtTools == item.toolSign ? 'active-tools el-popover__reference' : 'el-popover__reference'"
          @click="changeTools(item)" v-if="item.show !== false">
          <i :class="['iconfont', 'sidebar-icon', item.icon]"></i>
        </span>
      </div>
      <el-popover v-if="showPopper" ref="sidebar-popover" :reference='reference' placement="right" trigger="click"
        popper-class="sidebar-popper" @after-leave="hiddenPopover">
        <component :is="crtToolComponent" :sidebarParam="sidebarParam" @previewFile="previewFile"
          :personInfo="personInfo"></component>
      </el-popover>
    </div>
    <el-dialog :visible.sync="previewDialog" width="800px" custom-class="preview-dialog">
      <applyFormFilePreview :url="previewfileUrl"></applyFormFilePreview>
    </el-dialog>
  </div>
</template>

<script>
import { getEditedCommentsByFormId, } from '@/api/applyCenter'
import applyFormFilePreview from '@/components/filePreview'
import applyForm from './apply-form'
import approvalRecordDetail from './approval-record-detail'
import similarCase from './similar-case'
import approvedOpinion from './approved-opinion'
import aiKnowledgeBase from './ai-knowledge-base'
export default {
  name: 'sidebar',
  components: { applyFormFilePreview, applyForm, similarCase, approvalRecordDetail, approvedOpinion, aiKnowledgeBase },
  data() {
    return {
      previewDialog: false,
      previewfileUrl: '',
      reference: {},
      personInfo: {},
      crtToolComponent: '',
      showPopper: false,
      crtTools: '',//当前侧边工具栏激活项
      sidebarParam: {},
      tools: [
        {
          component: 'applyForm',
          toolSign: 'apply-form',
          icon: 'icon-shenqingdan',
          sidebarParam: {}, //侧边工具栏激活项 props
        },
        {
          component: 'approvalRecordDetail',
          toolSign: 'approval-record',
          icon: 'icon-jilumingxi',
          sidebarParam: {}, //侧边工具栏激活项 props
        },
        {
          component: 'similarCase',
          toolSign: 'similar-case',
          icon: 'icon-xiangsianli',
          sidebarParam: {}, //侧边工具栏激活项 props
        },
        {
          component: 'approvedOpinion',
          toolSign: 'approved-opinion',
          icon: 'icon-yijianshu',
          sidebarParam: {}, //侧边工具栏激活项 props
          // show: false
        },
        {
          component: 'aiKnowledgeBase',
          toolSign: 'ai',
          icon: 'icon-ciku',
          sidebarParam: {}, //侧边工具栏激活项 props
        }
      ],
    }
  },
  mounted() {
    document.addEventListener('mouseup', (e) => {
      const toolsRef = this.$refs['tools']
      if (toolsRef) {
        if (!toolsRef.contains(e.target)) {
          this.showPopper = false;
        }
      }
    });
    // 判断是否有审查意见
    // getEditedCommentsByFormId({ formId: this.$route.params.item.taskNumber })
  },
  methods: {
    previewFile(url) {
      this.previewDialog = true
      this.previewfileUrl = url
    },
    doToggle() {
      this.showPopper = !this.showPopper;
    },
    hiddenPopover() {
      this.crtTools = ''
    },
    changeTools(item) {
      if (this.crtTools === item.toolSign && this.showPopper) return
      this.showPopper = false
      this.crtTools = item.toolSign
      this.crtToolComponent = item.component
      let params = {}
      const { item: param_item } = this.$route.params
      switch (item.component) {
        case 'applyForm':
          params = {
            formId: param_item.taskNumber,
            formManagementId: param_item.formManagementId
          }
          break;
        case 'approvalRecordDetail':
          params = {
            formId: param_item.taskNumber,
            processInstanceId: param_item.processInstanceId
          }
          break;
          case 'approvedOpinion':
          params = {
            formId: param_item.taskNumber,
            processInstanceId: param_item.processInstanceId
          }
          break;
      }
      if (Object.keys(item.sidebarParam).length) {
        this.sidebarParam = item.sidebarParam;
      }else if (Object.keys(params).length) {
        this.sidebarParam = params
      }
      this.reference = this.$refs['sideBar-popover-' + item.toolSign][0].$el
      this.personInfo = param_item.initiator
      this.$nextTick(() => {
        this.showPopper = true
        this.$nextTick(() => {
          // 此时才能获取refs引用
          this.$refs['sidebar-popover']?.doShow()
        })
      })
    },
  }
}
</script>

<style lang="less" scoped>
.tools {
  background: #ffffff;
  width: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 60px;

  .iconfont {
    font-size: 22px;
    color: #506197;

  }

  span {
    display: inline-block;
    cursor: pointer;
    margin-bottom: 24px;
    padding: 6px !important;
  }

  span:hover {
    background: #F2F3F5;
    border-radius: 4px;
    padding: 6px;



  }

  .active-tools {
    background: #F2F3F5;
    border-radius: 4px;
    padding: 6px;



  }

}
</style>