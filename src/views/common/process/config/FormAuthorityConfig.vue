<template>
  <div>
    <!-- <div style="margin-bottom: 20px">
      <el-radio-group v-model="formId" :disabled="disabledForm" @input="changeFormId" size="small">
        <el-radio-button :label="item.id" v-for="item in formGroup" :key="item.id">{{ item.name }}</el-radio-button>
      </el-radio-group>
    </div> -->
    <el-table :header-cell-style="{background:'#f5f6f6'}" :data="formPerms" border style="width: 100%">
      <el-table-column prop="title" show-overflow-tooltip label="表单字段">
        <template slot-scope="scope">
          <span v-if="scope.row.required" style="color: #c75450"> * </span>
          <span>{{scope.row.title}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="readOnly" label="只读" width="80">
        <template slot="header">
          <el-radio label="R" :disabled="disabledForm" v-model="permSelect" @change="allSelect('R')">只读</el-radio>
        </template>
        <template slot-scope="scope">
          <el-radio :disabled="disabledForm || fieldCheck(scope.row)" v-model="scope.row.perm" label="R" :name="scope.row.id"></el-radio>
        </template>
      </el-table-column>
      <el-table-column prop="editable" label="可编辑" width="90">
        <template slot="header">
          <el-radio label="E" :disabled="disabledForm" v-model="permSelect" @change="allSelect('E')">可编辑</el-radio>
        </template>
        <template slot-scope="scope">
          <el-radio v-model="scope.row.perm" :disabled="disabledForm || fieldCheck(scope.row)" label="E" :name="scope.row.id"></el-radio>
        </template>
      </el-table-column>
      <el-table-column prop="hide" label="隐藏" width="80">
        <template slot="header">
          <el-radio label="H" :disabled="disabledForm" v-model="permSelect" @change="allSelect('H')">隐藏</el-radio>
        </template>
        <template slot-scope="scope">
          <el-radio v-model="scope.row.perm" :disabled="disabledForm || fieldCheck(scope.row)" label="H"  :name="scope.row.id"></el-radio>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'FormAuthorityConfig',
  props: {
    nodeName: String,
  },
  data() {
    return {
      tableData: [],
      isIndeterminate: false,
      permSelect: '',
      checkStatus: {
        readOnly: true,
        editable: false,
        hide: false
      },
      formGroup: [],
      formId: ''
    }
  },
  created() {
    this.formGroup = JSON.parse(window.sessionStorage.getItem('formGroup')) || []
    this.formId = this.formGroup[0]?.id
    this.formPermsLoad()
  },
  computed: {
    selectNode() {
      return this.$store.state.selectedNode
    },
    disabledForm() {
      return this.$route.name === 'FlowManage' || this.$route.meta.pTitle === '申请中心'
    },
    fieldCheck() {
      return (row) => {
        const jude1 = this.nodeName === '申请人' && (row.module === '审批人填写' || row.title === '有无实质意见' || row.title === '意见采纳结果')
        const jude2 = this.nodeName !== '申请人' && this.selectNode.props.targetPage === 'LEADER' && (['基本信息', '核对要点'].includes(row.module) || (row.title === '有无实质意见' || row.title === '意见采纳结果'))
        const jude3 = this.nodeName !== '申请人' && this.selectNode.props.targetPage === 'XIAOBAO' && (['基本信息'].includes(row.module) || (row.title === '有无实质意见' || row.title === '意见采纳结果'))
        const jude4 = this.nodeName !== '申请人' && ['CONFIRM', 'CONTRAST'].includes(this.selectNode.props.targetPage)
        return jude1 || jude2 || jude3 || jude4
      }
    },
    formData() {
      return this.$store.state.design.formItems
    },
    formPerms() {
      return this.$store.state.selectedNode.props.formPerms
    }
  },
  methods: {
    allSelect(type) {
      this.formPerms.forEach(f => {
        if (!this.fieldCheck(f)) {
          f.perm = type
        }
      })
      this.$nextTick(() => {
        this.permSelect = type
      })
    },
    formPermsLoad() {
      const perms = this.$store.state.selectedNode.props.formPerms
      const { id, name } = this.formGroup.find(item => item.id === this.formId) || {}
      this.formData.forEach(form => {
        let isLoad = false
        const isH = (form.module === '审批人填写' && !(this.nodeName !== '申请人' && ['LEADER', 'XIAOBAO'].includes(this.selectNode.props.targetPage))) || ['有无实质意见', '意见采纳结果'].includes(form.title)
        const isR = this.nodeName !== '申请人' && ['基本信息', '核对要点'].includes(form.module) && !(this.selectNode.props.targetPage === 'XIAOBAO' && form.module === '核对要点')
        let perm = 'E'
        if (isH) {
          perm = 'H'
        } else if (isR) {
          perm = 'R'
        }
        for (const i in perms) {
          if (perms[i].id === form.id) {
            perms[i].title = form.title
            perms[i].module = form.module
            perms[i].formCategoryId = id
            perms[i].formCategoryName = name
            perms[i].perm = perm
            isLoad = true
            break;
          }
        }
        if (!isLoad) {
          // const isRoot = this.$store.state.selectedNode.type === 'ROOT'
          // const secondCheck = this.$store.state.selectedNode.type === 'APPROVAL-TWO'
          perms.push({
            id: form.id,
            title: form.title,
            module: form.module,
            formCategoryId: id,
            formCategoryName: name,
            perm
          })
        }
      })
    },
    handleCheckAllChange() {

    },
    changeFormId() {
    }
  },
  watch: {
    formPerms: {
      deep: true,
      handler() {
        const set = new Set(this.formPerms.map(f => f.perm))
        this.permSelect = set.size === 1 ? this.formPerms[0].perm : ''
      }
    }
  }
}
</script>

<style lang="less" scoped>

/deep/ .el-table__row{
  &>td:first-child{
    .cell{
      text-align: left;
    }
  }
  .cell{
    text-align: center;
  }
  .el-radio__label{
    display: none;
  }
}
/deep/ .el-radio-group {
  .el-radio-button.is-active {
    .el-radio-button__inner {
      background-color: #2D5CF6;
      border-color: #2D5CF6;
    }
  }
  .el-radio-button:not(.is-active) .el-radio-button__inner:hover {
      color: #2D5CF6;
    }
  .el-radio-button__orig-radio:checked+.el-radio-button__inner {
    box-shadow: -1px 0 0 0 #2D5CF6;
  }
}
</style>
