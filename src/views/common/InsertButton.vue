<template>
  <el-popover placement="bottom-start" :disabled="disabledForm" title="添加流程节点" width="350" trigger="click">
    <div class="node-select">
      <div @click="addApprovalNode">
        <i class="el-icon-s-check" style="color:rgb(255, 148, 62);"></i>
        <span>审批人</span>
      </div>
      <div @click="addCcNode">
        <i class="el-icon-s-promotion" style="color:#2D5CF6;"></i>
        <span>抄送人</span>
      </div>
      <div @click="addConditionsNode">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-tiaojian-fenzhi"></use>
        </svg>
        <!-- <i class="el-icon-share" style="color:rgb(21, 188, 131);"></i> -->
        <span>条件分支</span>
      </div>
      <div @click="addApprovalTwoNode" class="has-svg">
        <i class="el-icon-s-check" style="color:#505968;"></i>
        <span>二次会签</span>
      </div>
      <!-- <div @click="addConcurrentsNode">
        <i class="el-icon-s-operation" style="color:#718dff;"></i>
        <span>并行分支</span>
      </div> -->
      <!-- <div @click="addDelayNode">
        <i class="el-icon-time" style="color:#f25643;"></i>
        <span>延迟等待</span>
      </div> -->
      <!-- <div @click="addTriggerNode">
        <i class="el-icon-set-up" style="color:#15BC83;"></i>
        <span>触发器</span>
      </div> -->
    </div>
    <el-button v-if="!$store.state.isPreview" icon="el-icon-plus" slot="reference" type="primary" size="small" circle></el-button>
  </el-popover>
</template>

<script>
export default {
  name: 'InsertButton',
  components: {},
  data() {
    return {}
  },
  computed: {
    selectedNode() {
      return this.$store.state.selectedNode
    },
    disabledForm() {
      return this.$route.name === 'FlowManage' || this.$route.meta.pTitle === '申请中心'
    }
  },
  methods: {
    addApprovalNode() {
      this.$emit('insertNode', 'APPROVAL')
    },
    addApprovalTwoNode() {
      this.$emit('insertNode', 'APPROVAL-TWO')
    },
    addCcNode() {
      this.$emit('insertNode', 'CC')
    },
    addDelayNode() {
      this.$emit('insertNode', 'DELAY')
    },
    addConditionsNode() {
      this.$emit('insertNode', 'CONDITIONS')
    },
    addConcurrentsNode() {
      this.$emit('insertNode', 'CONCURRENTS')
    },
    addTriggerNode() {
      this.$emit('insertNode', 'TRIGGER')
    }
  }
}
</script>

<style lang="less" scoped>
.node-select{
  div{
    display: inline-block;
    margin: 5px 5px;
    cursor: pointer;
    padding: 10px 15px;
    border: 1px solid #F8F9F9;
    background-color: #F8F9F9;
    border-radius: 10px;
    width: 145px;
    position: relative;
    span{
      position: absolute;
      left: 65px;
      top: 18px;
    }
    &:hover{
      background-color: #fff;
      box-shadow: 0 0 8px 2px #d6d6d6;
    }
    i{
      font-size: 25px;
      padding: 5px;
      border: 1px solid #dedfdf;
      border-radius: 14px;
    }
    svg {
      display: inline-block;
      width: 37px;
      height: 37px;
      padding: 5px;
      border: 1px solid #dedfdf;
      border-radius: 14px;
    }
  }
  .has-svg {
    position: relative;
    bottom: 6px;
  }
}
</style>
