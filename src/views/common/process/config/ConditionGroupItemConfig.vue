<template>
  <div>
    <div v-for="(group, index) in selectedNode.props.groups" :key="index + '_g'" class="group">
      <div class="group-header">
        <span class="group-name">条件组 {{ groupNames[index] }}</span>
        <div class="group-cp">
          <span>组内条件关系：</span>
          <el-switch v-model="group.groupType" :disabled="disabledForm"  active-color="#409EFF"
                     inactive-color="#c1c1c1" active-value="AND" inactive-value="OR"
                     active-text="且" inactive-text="或"/>
        </div>
        <div class="group-operation">
          <el-popover placement="bottom" title="选择审批条件" width="300" trigger="click">
            <!-- <div>以下条件将决定具体的审批流程</div>-->
            <el-checkbox-group v-model="group.cids" value-key="id" :disabled="disabledForm" >
              <el-checkbox :label="condition.id" v-for="(condition, cindex) in conditionList" :key="condition.id" @change="conditionChange(cindex, group)" style="width: 100px;">
                {{ condition.title }}
              </el-checkbox>
            </el-checkbox-group>
            <i class="el-icon-plus" style="font-size: 18px;" slot="reference"></i>
          </el-popover>
          <i class="el-icon-delete" style="font-size: 18px;" @click="delGroup(index)"></i>
        </div>
      </div>
      <div class="group-content">
        <p v-if="group.conditions.length === 0">点击右上角 + 为本条件组添加条件 ☝</p>
        <div v-else>
          <el-form :disabled="disabledForm" ref="condition-form" label-width="100px">
            <!--构建表达式-->
            <el-form-item :label="condition.title" v-for="(condition, cindex) in group.conditions" :key="condition.id + '_' + cindex" >
              <span v-if="(condition.valueType === ValueType.string)">
                <el-select size="small" placeholder="判断符" style="width: 120px;" v-model="condition.compare">
                  <el-option label="等于" value="="></el-option>
                  <el-option label="包含在" value="IN"></el-option>
                </el-select>
                 <span style="margin-left: 10px">
                   <span v-if="condition.compare === '='">
                    <el-select v-if="condition.name === 'SelectInput'" style="width: 260px;" filterable allow-create size="small" v-model="condition.value" placeholder="输入可能包含的值">
                      <el-option v-for="item in selectOptions(condition.id)" :label="item.value" :value="item.value" :key="item.id"></el-option>
                    </el-select>
                     <el-input v-else style="width: 260px;" placeholder="输入比较值" size="small" v-model="condition.value[0]"/>
                   </span>
                   <span v-else>
                    <el-select style="width: 260px;" multiple filterable allow-create size="small" v-model="condition.value" placeholder="输入可能包含的值"></el-select>
                   </span>
                 </span>
                 <i class="el-icon-close" @click="deleteSingleCondition(group.conditions, cindex, group.cids)" style="position: absolute;right:0; top: 12px;font-size: 20px;"></i>
              </span>
              <span v-if="condition.valueType === ValueType.array">
                <el-select size="small" placeholder="判断符" style="width: 120px;" v-model="condition.compare">
                  <el-option label="完全等于" value="="></el-option>
                  <el-option label="包含任意" value="IN"></el-option>
                </el-select>
                 <span style="margin-left: 10px">
                   <span v-if="condition.compare === '='">
                    <el-select style="width: 260px;" filterable allow-create size="small" v-model="condition.value[0]" placeholder="输入可能包含的值">
                      <el-option v-for="item in selectOptions(condition.id)" :label="item.value" :value="item.value" :key="item.id"></el-option>
                    </el-select>
                     <!-- <el-input style="width: 260px;" placeholder="输入比较值" size="small" v-model="condition.value[0]"/> -->
                   </span>
                   <span v-else>
                    <el-select style="width: 260px;" multiple collapse-tags filterable allow-create size="small" v-model="condition.value" placeholder="输入可能包含的值">
                      <el-option v-for="item in selectOptions(condition.id)" :label="item.value" :value="item.value" :key="item.id"></el-option>
                    </el-select>
                   </span>
                 </span>
                 <i class="el-icon-close" @click="deleteSingleCondition(group.conditions, cindex, group.cids)" style="position: absolute;right:0; top: 12px;font-size: 20px;"></i>
              </span>
              <span v-else-if="condition.valueType === ValueType.number">
                <el-select size="small" placeholder="判断符" style="width: 120px;" v-model="condition.compare">
                  <el-option :label="exp.label" :value="exp.value" :key="exp.value" v-for="exp in explains"></el-option>
                </el-select>
                <span style="margin-left: 10px">
                  <el-input style="width: 260px;" v-if="conditionValType(condition.compare) === 0" size="small" placeholder="输入比较值" type="number" v-model="condition.value[0]"/>
                  <el-select style="width: 260px;" multiple filterable allow-create v-else-if="conditionValType(condition.compare) === 1" size="small" v-model="condition.value" placeholder="输入可能包含的值"></el-select>
                  <span v-else>
                    <el-input style="width: 130px;" size="small" type="number" placeholder="输入比较值" v-model="condition.value[0]"/>
                    <span> ~
                      <el-input size="small" style="width: 130px;" type="number" placeholder="输入比较值" v-model="condition.value[1]"/>
                    </span>
                  </span>
                </span>
                <i class="el-icon-close" @click="deleteSingleCondition(group.conditions, cindex, group.cids)" style="position: absolute;right:0; top: 12px;font-size: 20px;"></i>
              </span>
              <span v-else-if="condition.valueType === ValueType.user">
                <span class="item-desc" style="margin-right: 20px">属于某部门 / 为某些人其中之一</span>
                <el-button size="mini" icon="el-icon-plus" @click="selectUser(condition.value, 'user')" round>选择人员/部门</el-button>
                <i class="el-icon-close" @click="deleteSingleCondition(group.conditions, cindex, group.cids)" style="position: absolute;right:0; top: 12px;font-size: 20px;"></i>
                <div style="margin: 10px">
                  <el-tag class="org-item" style="margin: 5px" :type="org.type === 'dept'?'':'info'"
                          v-for="(org, index) in condition.value" :key="index + '_org'"
                          closable size="mini" @close="removeOrgItem(condition.value, index)">
                    {{org.label}}
                  </el-tag>
                </div>
              </span>
              <span v-else-if="condition.valueType === ValueType.dept">
                <span class="item-desc" style="margin-right: 20px">为某部门 / 某部门下的部门</span>
                <el-button size="mini" icon="el-icon-plus" @click="selectUser(condition.value, 'dept')" round>选择部门</el-button>
                <i class="el-icon-close" @click="deleteSingleCondition(group.conditions, cindex, group.cids)" style="position: absolute;right:0; font-size: 20px;"></i>
                <div style="margin: 10px">
                  <el-tag class="org-item" style="margin: 5px" :type="org.type === 'dept'?'':'info'"
                          v-for="(org, index) in condition.value" :key="index + '_org'"
                          closable size="mini" @close="removeOrgItem(condition.value, index)">
                    {{org.label}}
                  </el-tag>
                </div>
              </span>
              <span v-else-if="condition.valueType === ValueType.date">
                <el-select size="small" placeholder="判断符" style="width: 120px;" v-model="condition.compare">
                  <el-option label="等于" value="="></el-option>
                </el-select>
                <el-date-picker
                   style="margin-left: 10px"
                  size="small"
                  v-model="condition.value[0]"
                  type="date"
                  placeholder="选择日期"
                  value-format="timestamp">
                </el-date-picker>
              </span>
              <span v-else-if="condition.valueType === ValueType.cascader">
                <el-select size="small" placeholder="判断符" style="width: 120px;" v-model="condition.compare">
                  <el-option label="包含在" value="IN"></el-option>
                </el-select>
                <span style="margin-left: 10px">
                  <span v-if="condition.compare === '='">
                    <el-input style="width: 260px;" placeholder="输入比较值" size="small" v-model="condition.value[0]"/>
                  </span>
                  <span v-else>
                    <el-select style="width: 260px;" multiple filterable allow-create size="small" v-model="condition.value" placeholder="输入可能包含的值"></el-select>
                  </span>
                </span>
                <i class="el-icon-close" @click="deleteSingleCondition(group.conditions, cindex, group.cids)" style="position: absolute;right:0; top: 12px;font-size: 20px;"></i>
              </span>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
    <org-picker :type="orgType" :hidden="['系统角色']" :show="showOrgSelect" @close="closeSelect" :selected="users" @selectOver="selected"></org-picker>
  </div>
</template>

<script>
import orgPicker from '@/components/common/organizationPicker'
import {ValueType} from '@/views/common/form/ComponentsConfigExport'

export default {
  name: "ConditionGroupItemConfig",
  components: {orgPicker},
  data() {
    return {
      ValueType,
      users: [],
      orgType: 'user',
      showOrgSelect: false,
      //groupConditions: [],
      groupNames: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
      supportTypes:[ValueType.number, ValueType.string, ValueType.array, ValueType.cascader,, ValueType.dept, ValueType.user], // ValueType.date
      explains:[
        {label: '等于', value:'='},
        {label: '大于', value:'>'},
        {label: '大于等于', value:'>='},
        {label: '小于', value:'<'},
        {label: '小于等于', value:'<='},
        {label: '包含在', value:'IN'},
        {label: 'x < 值 < x', value:'B'},
        {label: 'x ≤ 值 < x', value:'AB'},
        {label: 'x < 值 ≤ x', value:'BA'},
        {label: 'x ≤ 值 ≤ x', value:'ABA'},
      ]
    }
  },
  computed: {
    disabledForm() {
      return this.$route.name === 'FlowManage' || this.$route.meta.pTitle === '申请中心'
    },
    selectOptions() {
      return (id) => {
        const { formItems } = this.$store.state.design
        return formItems.find(item => item.id === id).props.options
      }
    },
    selectedNode() {
      return this.$store.state.selectedNode
    },
    select() {
      return this.selectedNode.props.assignedUser || []
    },
    conditionList() {
      const conditionItems = this.$store.state.design.formItems.filter(f => {
        if (f.props.required && this.supportTypes.indexOf(f.valueType) !== -1){
          return {title: f.title, id: f.id, valueType: f.valueType}
        }
      })
      if (conditionItems.length === 0 || conditionItems[0].id !== 'root'){
        // this.nodes.forEach((n) => {
        //   conditionItems.unshift({id: n.id, title: n.name, valueType: 'User'})
        // })
        conditionItems.unshift({id: this.nodes[0].id, title: this.nodes[0].name, valueType: 'User'})
      }
      return conditionItems
    },
    nodeMap() {
      return this.$store.state.nodeMap
    },
    nodes() {
      const tempNodes = []
      this.nodeMap.forEach(value => {
        if (['ROOT', 'CC', 'APPROVAL', 'APPROVAL-TWO'].includes(value?.type)) {
          tempNodes.push({
            name: value.name,
            id: value.id
          })
        }
      })
      return tempNodes
    }
  },
  methods: {
    conditionValType(type){
      switch (type){
        case '=':
        case '>':
        case '>=':
        case '<':
        case '<=': return 0;
        case 'IN': return 1;
        default: return 2;
      }
    },
    closeSelect() {
      this.showOrgSelect = false
    },
    selectUser(value, orgType) {
      this.orgType = orgType
      this.users = value
      this.showOrgSelect = true
    },
    selected(select) {
      this.showOrgSelect = false
      this.users.length = 0
      for (let key in select) {
        select[key].forEach(val => this.users.push({
          ...val,
          label: val.label
        }))
      }
    },
    removeOrgItem(values, index) {
      values.splice(index, 1)
    },
    delGroup(index) {
      if (this.disabledForm) {
        return;
      }
      this.selectedNode.props.groups.splice(index, 1)
    },
    deleteSingleCondition(cArr, index, cids) {
      cArr.splice(index, 1)
      cids.splice(index, 1)
    },
    conditionChange(index, group) {
      //判断新增的
      group.cids.forEach(cid => {
        if (0 > group.conditions.findIndex(cd => cd.id === cid)){
          //新增条件
          let condition = {...this.conditionList[index]}
          condition.compare = '';
          condition.value = []
          group.conditions.push(condition)
        }
      })
      for (const i in group.conditions) {
        //去除没有选中的
        if (group.cids.indexOf(group.conditions[i].id) < 0){
          group.conditions.splice(i, 1)
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.group {
  margin-bottom: 20px;
  color: #5e5e5e;
  overflow: hidden;
  border-radius: 6px;
  border: 1px solid #E5E6EB;

  .group-header {
    padding: 8px 10px;
    background: #F2F3F5;
    position: relative;

    div {
      display: inline-block;
    }

    .group-name {
      font-size: small;
    }

    .group-cp {
      font-size: small;
      position: absolute;
      left: 100px;
      display: flex;
      top: 5px;
      justify-content: center;
      align-items: center;
    }

    .group-operation {
      position: absolute;
      right: 10px;

      i {
        padding: 0 10px;

        &:hover {
          cursor: pointer;
        }
      }
    }
  }

  .group-content{
    padding: 10px 10px 0;
    p{
      text-align: center;
      font-size: small;
      margin-bottom: 12px;
    }
    .el-form-item {
      margin-bottom: 12px;
      padding: 8px;
      border-radius: 4px;
      background: #F7F8FA;
    }
  }

  .condition-title{
    display: block;
    width: 100px;
  }
}
.org-item {
  height: 34px;
  padding: 8px 10px;
  margin-left: 4px;
  font-size: 12px;
  background: rgb(240, 246, 255);
  color: rgb(45, 92, 246);
  border: 1px solid rgb(87, 132, 255);
  border-radius: 4px;
}
/deep/.el-tag .el-tag__close {
  color: #9a9eb4;
  height: 16px;
  width: 16px;
}
/deep/.el-tag .el-tag__close:hover {
  color: #FFFFFF;
  background: #9a9eb4;
}
</style>
