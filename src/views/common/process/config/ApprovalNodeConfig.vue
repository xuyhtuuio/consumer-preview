<template>
  <div>
    <el-form label-position="top" label-width="90px">
      <el-form-item label="选择审批对象" prop="text" class="user-type">
        <template slot="label">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-setting-user"></use>
          </svg>
          选择审批对象
        </template>
        <el-radio-group class="radio-group" v-model="nodeProps.assignedType" @input="changeAssignedType">
          <el-radio v-for="t in approvalTypes" :label="t.type" :key="t.type">{{ t.name }}</el-radio>
        </el-radio-group>
        <el-popover
          placement="bottom"
          title=""
          width="300"
          trigger="hover">
          <b>什么是节点审批人？</b>
          <p>1.通过选择前面已经配置的节点进行关联，流程执行时自动获取所有关联审批节点中的实际审批人作为当前节点的审批人</p>
          <p>2.当前节点为节点审批人时，同一审批人重复审批将不会触发自动通过</p>
          <b>如何关联节点？ </b>
          <p>可以选择前序节点的名称进行关联 </p>
          <svg slot="reference" class="icon" aria-hidden="true">
            <use xlink:href="#icon-wenhao"></use>
          </svg>
        </el-popover>
        <div v-if="nodeProps.assignedType === 'ASSIGN_USER'">
          <el-button size="mini" icon="el-icon-plus" type="primary" @click="selectUser" round>选择人员</el-button>
        </div>
        <div v-else-if="nodeProps.assignedType === 'DEPT_USER_ROLE'">
          <!-- <div class="select-user">
            <el-button size="mini" @click="selectUser" icon="el-icon-plus" type="primary">选择部门/人员/角色</el-button>
            <div class="tag-action" >
              <div class="tag-box" v-for="(item, index) in select" :key="index">
                <TrsTag :tag="item" @handleClose="removeOrgItem(index)" />
              </div>
            </div>
          </div> -->
        </div>
        <div v-else-if="nodeProps.assignedType === 'SELECT_NODE'">
          选择节点
          <el-select v-model="nodeProps.nodeId" placeholder="请选择指定节点" size="medium" class="is-dark input" style="width: 250px;">
            <el-option v-for="(op, index) in nodes" :key="index" :label="op.name" :value="op.id"></el-option>
          </el-select>
          <p style="color:#86909C;font-size: 12px;line-height:24px;">可以选择前序节点名称，如名称重复建议先修改节点名称<br/>如果是多人，最后一个提交审批的人</p>
        </div>
        <div v-else-if="nodeProps.assignedType === 'SELF_SELECT'">
          <el-radio-group class="radio-group" size="mini" v-model="nodeProps.selfSelect.multiple">
            <el-radio-button :label="false">自选一个人</el-radio-button>
            <el-radio-button :label="true">自选多个人</el-radio-button>
          </el-radio-group>
        </div>
        <div v-else-if="nodeProps.assignedType === 'LEADER_TOP'">
          <el-divider/>
          <el-form-item label="审批终点" prop="text" class="approve-end">
            <el-radio-group v-model="nodeProps.leaderTop.endCondition">
              <el-radio label="TOP">直到最上层主管</el-radio>
              <el-radio label="LEAVE">不超过发起人的</el-radio>
            </el-radio-group>
            <div class="approve-end-leave" v-if="nodeProps.leaderTop.endCondition === 'LEAVE'">
              <span>第 </span>
              <el-input-number :min="1" :max="20" :step="1" size="mini" v-model="nodeProps.leaderTop.level"/>
              <span> 级主管</span>
            </div>
          </el-form-item>
        </div>
        <div v-else-if="nodeProps.assignedType === 'LEADER'">
          <el-divider/>
          <el-form-item label="指定主管" prop="text">
            <span>发起人的第 </span>
            <el-input-number :min="1" :max="20" :step="1" size="mini"
                             v-model="nodeProps.leader.level"></el-input-number>
            <span> 级主管</span>
            <div style="color: #409EFF; font-size: small;">👉 直接主管为 第 1 级主管</div>
          </el-form-item>
        </div>
        <div v-else-if="nodeProps.assignedType === 'ROLE'">
          <el-button size="mini" icon="el-icon-plus" type="primary" @click="selectUser" round>选择系统角色</el-button>

        </div>
        <div v-else-if="nodeProps.assignedType === 'FORM_USER'">
          <el-form-item label="选择表单联系人项" prop="text" class="approve-end">
            <el-select style="width: 80%;" size="small" v-model="nodeProps.formUser" placeholder="请选择包含联系人的表单项">
              <el-option v-for="op in forms" :label="op.title" :key="op.id" :value="op.id"></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div v-else>
          <span class="item-desc">上一审批人选择作为审批人进行审批</span>
        </div>
        <!-- 人员选择框 -->
        <div class="select-user grag" v-if="nodeProps.assignedType === 'SELF_SELECT' || nodeProps.assignedType === 'DEPT_USER_ROLE'">
          <p v-if="nodeProps.assignedType === 'SELF_SELECT'">自选范围（上一审批人选择时的用户可选范围）</p>
          <el-button size="mini" @click="selectUser" icon="el-icon-plus" type="primary">选择部门/人员/角色</el-button>
          <org-picker :show="showOrgSelect" @close="closeSelect" :selected="select" @selectOver="selected"></org-picker>
          <div class="tag-action" >
            <div class="tag-box" v-for="(item, index) in select" :key="index">
              <TrsTag :tag="item" @handleClose="removeOrgItem(index)" />
            </div>
          </div>
        </div>
      </el-form-item>

      <!-- <el-divider></el-divider> -->
      <!-- <el-form-item v-if="!['SELF_SELECT'].includes(nodeProps.assignedType)" label="审批人为空时" prop="text" class="line-mode">
        <el-radio-group v-model="nodeProps.nobody.handler">
          <el-radio label="TO_PASS">自动通过</el-radio>
          <el-radio label="TO_REFUSE">自动驳回</el-radio>
          <el-radio label="TO_ADMIN">转交审批管理员</el-radio>
          <el-radio label="TO_USER">转交到指定人员</el-radio>
        </el-radio-group>
        <div style="margin-top: 10px" v-if="nodeProps.nobody.handler === 'TO_USER'">
          <el-button size="mini" icon="el-icon-plus" type="primary" @click="selectUser" round>选择人员</el-button>
        </div>
      </el-form-item> -->

      <div v-if="showMode">
        <!-- <el-divider/> -->
        <el-form-item prop="text" class="approve-mode">
          <template slot="label">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-multiple-user"></use>
            </svg>
            多人审批时审批方式
          </template>
          <el-radio-group class="radio-group" v-model="nodeProps.mode">
            <el-radio label="NEXT">顺序审批（按选择顺序审批，每个人必须同意）</el-radio>
            <el-radio label="AND">会签（可同时审批，每个人必须同意）</el-radio>
            <el-radio label="OR">或签（有一人同意即可）</el-radio>
          </el-radio-group>
        </el-form-item>
      </div>

      <el-divider>高级设置</el-divider>
      <el-form-item label="目标页面配置" prop="target" v-if="nodeProps.assignedType === 'DEPT_USER_ROLE'">
        <el-radio-group class="radio-group" v-model="nodeProps.target">
          <el-radio label="PASS">领导审批</el-radio>
          <el-radio label="REFUSE">消保审批</el-radio>
          <el-radio label="NOTIFY">确认意见</el-radio>
        </el-radio-group>
      </el-form-item>
      <div class="zhuanban" v-if="!['SELECT_NODE'].includes(nodeProps.assignedType)">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-zhuanban"></use>
        </svg>
        是否启用转办，启用后审批人有权选择转办给指定人员再次审批。
      </div>
      <el-form-item label="" prop="text1" v-if="!['SELECT_NODE'].includes(nodeProps.assignedType)">
        <el-switch active-text="启用转办" v-model="nodeProps.zhuanban"></el-switch>
        <div class="select-user" style="margin-top: 10px;">
          <p>请选择【被转办人】可选用户范围</p>
          <el-button size="mini" @click="selectUser1" icon="el-icon-plus" type="primary">选择部门/人员/角色</el-button>
          <org-picker :show="showOrgSelect1" @close="closeSelect1" :selected="select1" @selectOver="selected1"></org-picker>
          <div class="tag-action" >
            <div class="tag-box" v-for="(item, index) in select1" :key="index">
              <TrsTag :tag="item" @handleClose="removeOrgItem(index)" />
            </div>
          </div>
        </div>
      </el-form-item>
      <el-form-item prop="text" class="line-mode">
        <template slot="label">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-reject"></use>
          </svg>
          如果申请被驳回
        </template>
        <el-radio-group class="radio-group" v-model="nodeProps.nobody.handler">
          <el-radio label="TO_PASS">驳回到指定节点</el-radio>
          <el-radio label="TO_REFUSE">审批人自选（前序节点）</el-radio>
        </el-radio-group>
        <div style="margin-top: 10px" v-if="nodeProps.nobody.handler === 'TO_PASS'">
          <el-select v-model="nodeProps.nodeId" placeholder="请选择指定节点" size="medium" class="is-dark input" style="width: 250px;">
            <el-option v-for="(op, index) in nodes" :key="index" :label="op.name" :value="op.id"></el-option>
          </el-select>
        </div>
      </el-form-item>
      <el-form-item v-if="!['SELF_SELECT', 'DEPT_USER_ROLE', 'SELECT_NODE'].includes(nodeProps.assignedType)" label="审批同意时是否需要签字" prop="text">
        <el-switch inactive-text="不用" active-text="需要" v-model="nodeProps.sign"></el-switch>
        <el-tooltip class="item" effect="dark" content="如果全局设置了需要签字，则此处不生效" placement="top-start">
          <i class="el-icon-question" style="margin-left: 10px; font-size: medium; color: #b0b0b1"></i>
        </el-tooltip>
      </el-form-item>
      <el-form-item v-if="!['SELF_SELECT', 'DEPT_USER_ROLE', 'SELECT_NODE'].includes(nodeProps.assignedType)" label="审批期限（为 0 则不生效）" prop="timeLimit">
        <el-input style="width: 180px;" placeholder="时长" size="small" type="number" v-model="nodeProps.timeLimit.timeout.value">
          <el-select style="width: 75px;" v-model="nodeProps.timeLimit.timeout.unit" slot="append" placeholder="请选择">
            <el-option label="天" value="D"></el-option>
            <el-option label="小时" value="H"></el-option>
          </el-select>
        </el-input>
      </el-form-item>
      <el-form-item label="审批期限超时后执行" prop="level" v-if="nodeProps.timeLimit.timeout.value > 0">
        <el-radio-group v-model="nodeProps.timeLimit.handler.type">
          <el-radio label="PASS">自动通过</el-radio>
          <el-radio label="REFUSE">自动驳回</el-radio>
          <el-radio label="NOTIFY">发送提醒</el-radio>
        </el-radio-group>
        <div v-if="nodeProps.timeLimit.handler.type === 'NOTIFY'">
          <div style="color:#409EEF; font-size: small">默认提醒当前审批人</div>
          <el-switch inactive-text="循环" active-text="一次" v-model="nodeProps.timeLimit.handler.notify.once"></el-switch>
          <span style="margin-left: 20px" v-if="!nodeProps.timeLimit.handler.notify.once">
							每隔
							<el-input-number :min="0" :max="10000" :step="1" size="mini" v-model="nodeProps.timeLimit.handler.notify.hour"/>
							小时提醒一次
						</span>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import orgPicker from '@/components/common/organizationPicker'

export default {
  name: "ApprovalNodeConfig",
  components: {orgPicker},
  props: {
    config: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      showOrgSelect: false,
      showOrgSelect1: false,
      // select: [],
      select1: [],
      approvalTypes: [
        // {name: '指定人员', type: 'ASSIGN_USER'},
        {name: '上一审批人选择', type: 'SELF_SELECT'},
        {name: '指定部门/人员/角色', type: 'DEPT_USER_ROLE'},
        {name: '节点审批人', type: 'SELECT_NODE'},
        // {name: '连续多级主管', type: 'LEADER_TOP'},
        // {name: '主管', type: 'LEADER'},
        // {name: '角色', type: 'ROLE'},
        // {name: '发起人自己', type: 'SELF'},
        // {name: '表单内联系人', type: 'FORM_USER'}
      ],
      tagConfig: {
        background: '#f0f6ff',
        color: '#2d5cf6',
        borderColor: '#5784FF',
        borderRadius: '4px',
        closable: true,
        size: 'medium'
      }
    }
  },
  computed: {
    nodeProps() {
      return this.$store.state.selectedNode.props
    },
    select: {
      get() {
        return this.config.assignedUser || []
      },
      set() {

      }
    },
    nodeMap() {
      return this.$store.state.nodeMap
    },
    nodes() {
      const tempNodes = []
      this.nodeMap.forEach(value => {
        if (['ROOT', 'CC', 'APPROVAL', 'APPROVAL-TWO', 'APPROVAL-CONFIRM'].includes(value?.type)) {
          tempNodes.push({
            name: value.name,
            id: value.id
          })
        }
      })
      return tempNodes
    },
    forms(){
      return this.$store.state.design.formItems.map(f => {
        if (f.type === 'USER'){
          return f;
        }
      })
    },
    showMode() {
      switch (this.nodeProps.assignedType) {
        case "ASSIGN_USER":
          return this.nodeProps.assignedUser.length > 0;
        case "SELF_SELECT":
          return this.nodeProps.selfSelect.multiple;
        case "LEADER_TOP":
          return this.nodeProps.formUser !== '';
        case "FORM_USER":
          return true;
        case "DEPT_USER_ROLE":
          return true;
        case "ROLE":
          return true;
        default:
          return false;
      }
    }
  },
  methods: {
    changeAssignedType() {
      this.showOrgSelect = false
      this.select = []
      this.$store.state.selectedNode.props.assignedUser = []
    },
    closeSelect() {
      this.showOrgSelect = false
    },
    closeSelect1() {
      this.showOrgSelect1 = false
    },
    selectUser() {
      this.showOrgSelect = true
    },
    selectUser1() {
      this.showOrgSelect1 = true
    },
    selected(select) {
      this.showOrgSelect = false
      this.select = []
      for (let key in select) {
        select[key].forEach(val => this.select.push({
          ...val,
          label: val.label,
          ...this.tagConfig
        }))
      }
      this.$store.state.selectedNode.props.assignedUser = this.select
    },
    selected1(select) {
      this.showOrgSelect1 = false
      this.select1 = []
      for (let key in select) {
        select[key].forEach(val => this.select1.push({
          ...val,
          label: val.label,
          ...this.tagConfig
        }))
      }
    },
    removeOrgItem(index) {
      this.select.splice(index, 1)
    },
    removeOrgItem1(index) {
      this.select1.splice(index, 1)
    }
  }
}
</script>

<style lang="less" scoped>
.user-type .radio-group {
  /deep/ .el-radio {
    min-width: 110px;
    margin-top: 10px;
    margin-bottom: 20px;
  }
}

/deep/ .line-mode{
  .el-radio{
    width: 150px;
    margin: 5px;
  }
}

/deep/ .el-form-item__label{
  display: flex;
  align-items: center;
  line-height: 25px;
}
svg {
  width: 24px;
  height: 24px;
}
/deep/.el-radio .el-radio__label {
  font-weight: normal;
}

/deep/ .approve-mode {
  .el-radio {
    float: left;
    width: 100%;
    display: block;
    margin-top: 15px;
  }
}

/deep/ .approve-end {
  position: relative;

  .el-radio-group {
    width: 160px;
  }

  .el-radio {
    margin-bottom: 5px;
    width: 100%;
  }

  .approve-end-leave {
    position: absolute;
    bottom: -5px;
    left: 150px;
  }
}

/deep/ .el-divider--horizontal {
  margin: 10px 0;
}
/deep/.el-radio-group {
  .is-active .el-radio-button__inner {
    color: #FFFFFF;
    background: #2D5CF6;
    border-color: #2D5CF6;
  }
  .el-radio-button:not(.is-active) .el-radio-button__inner:hover {
    color: #2D5CF6;
  }
}
.select-user {
  padding: 0 12px;
}
.select-user.grag {
  margin-top: 20px;
  border-radius: 4px;
  background: #F7F8FA;
}
.el-button--mini {
  border-radius: 17px;
  margin-bottom: 16px;
}
.tag-action {
  text-align: left;
}
.tag-box {
  display: inline-block;
  margin-bottom: 8px;
}
.zhuanban {
  display: flex;
  align-items: center;
  font-size: 14px;
  margin-top: 24px;
}
/deep/.el-switch {
  .is-active {
    span {
      color: #2D5CF6;
    }
  }
}
</style>
