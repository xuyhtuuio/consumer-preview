<template>
  <div>
    <el-form label-width="100px" :disabled="disabledForm">
      <el-form-item label="调整优先级" prop="level">
        <el-popover placement="right" title="拖拽条件调整优先级顺序" width="250" trigger="click">
          <draggable style="width: 100%; min-height:25px" :list="prioritySortList" group="from" :options="sortOption">
            <div :class="{'drag-no-choose': true, 'drag-hover': cd.id === selectedNode.id}"
                 v-for="(cd, index) in prioritySortList" :key="cd.id">
              <div>{{ cd.name }}</div>
              <div>优先级 {{ index + 1 }}</div>
            </div>
          </draggable>
          <el-button icon="el-icon-sort" size="small" slot="reference">第{{ nowNodeLeave + 1 }}级</el-button>
        </el-popover>
      </el-form-item>
      <div class="iknow" v-show="iknow">
        <i class="iconfont icon-guanzhu1"></i>
        <span>当审批单满足以下条件时进入此流程</span>
        <span @click="iknow=false">我知道了</span>
      </div>
      <div style="margin: 24px 0;" :style="{display: conditionGroupsType === 'expression' ? 'flex' : 'block'}">
        <el-select size="small" placeholder="判断符" style="width: 140px; margin-right: 20px;" v-model="conditionGroupsType" @change="changeConditionGroupsType">
          <el-option label="组间条件关系" value="groupsType"></el-option>
          <el-option label="条件组表达式" value="expression"></el-option>
        </el-select>
        <el-switch v-show="conditionGroupsType === 'groupsType'" v-model="config.groupsType" active-color="#409EFF"
            inactive-color="#c1c1c1" active-value="AND" inactive-value="OR"
            active-text="且" inactive-text="或">
        </el-switch>
        <div style="display: inline-block;" v-show="conditionGroupsType === 'expression'">
          <el-input size="mini" class="is-dark input" v-model="config.expression" placeholder="输入条件组关系表达式  &为与，|为或"/>
          <span class="item-desc">使用表达式构建复杂逻辑，例如: (A & B) | C</span>
        </div>
      </div>
    </el-form>
    <div>
      <el-button type="primary" :disabled="disabledForm" size="mini" icon="el-icon-plus" style="margin: 0 15px 15px 0" round @click="addConditionGroup">
        添加条件组
      </el-button>
      <span class="item-desc">只有必填选项才能作为审批条件</span>
    </div>
    <group-item/>
  </div>
</template>

<script>
import draggable from 'vuedraggable';
import GroupItem from './ConditionGroupItemConfig'

export default {
  name: 'ConditionNodeConfig',
  components: { draggable, GroupItem },
  props: {
    config: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  computed: {
    disabledForm() {
      return this.$route.name === 'FlowManage' || this.$route.meta.pTitle === '申请中心'
    },
    selectedNode() {
      return this.$store.state.selectedNode
    },
    select() {
      return this.config.assignedUser || []
    },
    nowNodeLeave() {
      return this.prioritySortList.indexOf(this.selectedNode)
    },
    // 条件节点
    prioritySortList() {
      const node = this.$store.state.nodeMap.get(this.selectedNode.parentId)
      if (node) {
        return node.branchs || []
      }
      return []
    }
  },
  data() {
    return {
      conditionGroupsType: 'groupsType',
      iknow: true,
      sortOption: {
        animation: 300,
        chosenClass: 'choose',
        scroll: true,
        sort: true
      }
    }
  },
  methods: {
    changeConditionGroupsType(val) {
      if (val === 'groupsType') {
        this.config.expression = ''
      } else {
        this.config.groupsType = 'OR'
      }
    },
    addConditionGroup() {
      this.config.groups.push({
        cids: [],
        groupType: 'OR',
        conditions: []
      })
    },
    closeSelect() {

    },
    selectUser() {
      this.showOrgSelect = true
    },
    selected(select) {
      this.showOrgSelect = false
      this.users.length = 0
      for (const key in select) {
        select[key].forEach(val => this.users.push({
          ...val,
          label: val.label
        }))
      }
    },
    removeOrgItem(index) {
      this.select.splice(index, 1)
    }
  }
}
</script>

<style lang="less" scoped>
.choose {
  border-radius: 5px;
  margin-top: 2px;
  background: #f4f4f4;
  border: 1px dashed #2D5CF6 !important;
}

.drag-hover {
  background: #79bbff;
  color: #2D5CF6
}
/deep/.el-switch {
  .is-active {
    span {
      color: #2D5CF6;
    }
  }
}
/deep/.el-switch.is-checked {
  .el-switch__core {
    border-color: #2D5CF6 !important;
    background-color: #2D5CF6 !important;
  }
}
.drag-no-choose {
  cursor: move;
  background: #f4f4f4;
  border-radius: 5px;
  position: relative;
  margin-top: 2px;
  padding: 5px 10px;
  // border: 1px solid #bcbcbc;
  height: 28px;

  div:nth-child(1) {
    font-size: x-small;
    position: absolute;
    width: 160px;
    left: 10px;
    height: 20px;
    overflow: hidden;
  }

  div:nth-child(2) {
    position: absolute;
    right: 10px;
  }
}
.item-desc {
  color: #505968;
  font-size: 12px;
  line-height: 20px;
  opacity: 0.8;
}
.iknow {
  width: 340px;
  padding: 4px 12px;
  border-radius: 15px;
  color: #2D5CF6;
  font-size: 12px;
  background: #F0F6FF;
  span:last-child {
    margin-left: 60px;
    cursor: pointer;
  }
  i {
    position: relative;
    top: 1px;
  }
}
</style>
