<template>
  <div>
    <div style="margin-bottom: 20px">
      <el-radio-group v-model="formId" :disabled="disabledForm" @input="changeFormId" size="small">
        <el-radio-button :label="item.id" v-for="item in formGroup" :key="item.id">{{ item.name }}</el-radio-button>
      </el-radio-group>
    </div>
    <el-table :header-cell-style="{background:'#f5f6f6'}" :data="formPerms" border style="width: 100%">
      <el-table-column prop="title" show-overflow-tooltip label="表单字段">
        <template slot-scope="scope">
          <span v-if="scope.row.required" style="color: #c75450"> * </span>
          <span>{{scope.row.title}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="readOnly" label="只读" width="80">
        <template slot="header" slot-scope="scope">
          <el-radio label="R" :disabled="disabledForm" v-model="permSelect" @change="allSelect('R')">只读</el-radio>
        </template>
        <template slot-scope="scope">
          <el-radio :disabled="disabledForm" v-model="scope.row.perm" label="R" :name="scope.row.id"></el-radio>
        </template>
      </el-table-column>
      <el-table-column prop="editable" label="可编辑" width="90">
        <template slot="header" slot-scope="scope">
          <el-radio label="E" :disabled="disabledForm" v-model="permSelect" @change="allSelect('E')">可编辑</el-radio>
        </template>
        <template slot-scope="scope">
          <el-radio v-model="scope.row.perm" :disabled="disabledForm" label="E" :name="scope.row.id"></el-radio>
        </template>
      </el-table-column>
      <el-table-column prop="hide" label="隐藏" width="80">
        <template slot="header" slot-scope="scope">
          <el-radio label="H" :disabled="disabledForm" v-model="permSelect" @change="allSelect('H')">隐藏</el-radio>
        </template>
        <template slot-scope="scope">
          <el-radio v-model="scope.row.perm" :disabled="disabledForm" label="H"  :name="scope.row.id"></el-radio>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getFormTemplateById } from '@/api/design'
export default {
  name: "FormAuthorityConfig",
  components: {},
  data() {
    return {
      tableData:[],
      isIndeterminate:false,
      permSelect: '',
      checkStatus:{
        readOnly: true,
        editable: false,
        hide: false
      },
      formGroup: [],
      formId: ''
    }
  },
  created() {
    this.formPermsLoad()
    this.formGroup = JSON.parse(window.sessionStorage.getItem('formGroup')) || []
    this.formId = this.formGroup[0]?.id
    // this.formId && this.getFormItemeById(this.formId)
  },
  computed:{
    disabledForm() {
      return this.$route.name === 'FlowManage' || this.$route.meta.pTitle === '申请中心'
    },
    formData(){
      return this.$store.state.design.formItems
    },
    formPerms(){
      return this.$store.state.selectedNode.props.formPerms
    }
  },
  methods: {
    async getFormItemeById(formId) {
      const res = await getFormTemplateById(formId)
      const formDetail = res.data
      if (formDetail) {
        
      }
    },
    allSelect(type){
      this.formPerms.forEach(f => f.perm = type)
      this.$nextTick(() => {
        this.permSelect = type
      })
    },
    formPermsLoad(){
      let perms = this.$store.state.selectedNode.props.formPerms
      this.formData.forEach(form => {
        let isLoad = false
        for (let i in perms) {
          if (perms[i].id === form.id){
            perms[i].title = form.title
            perms[i].module = form.module
            isLoad = true
            break;
          }
        }
        if (!isLoad){
          const isRoot = this.$store.state.selectedNode.type === 'ROOT'
          const secondCheck = this.$store.state.selectedNode.type === 'APPROVAL-TWO'
          let perm = (isRoot || secondCheck) ? 'E':'R'
          if (form.module === '审批人填写') {
            perm = 'H'
          }
          perms.push({
            id: form.id,
            title: form.title,
            module: form.module,
            perm
          })
        }
      })
    },
    handleCheckAllChange(){

    },
    changeFormId() {
    }
  },
  watch:{
    formPerms:{
      deep: true,
      handler(){
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
