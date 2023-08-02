<template>
  <div>
    <div style="margin-bottom: 20px">
      <el-radio-group v-model="formId" @input="changeFormId" size="small">
        <el-radio-button label="111">表单1</el-radio-button>
        <el-radio-button label="222">表单2</el-radio-button>
        <el-radio-button label="333">表单3</el-radio-button>
        <el-radio-button label="444">表单4</el-radio-button>
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
          <el-radio label="R" v-model="permSelect" @change="allSelect('R')">只读</el-radio>
        </template>
        <template slot-scope="scope">
          <el-radio v-model="scope.row.perm" label="R" :name="scope.row.id"></el-radio>
        </template>
      </el-table-column>
      <el-table-column prop="editable" label="可编辑" width="90">
        <template slot="header" slot-scope="scope">
          <el-radio label="E" v-model="permSelect" @change="allSelect('E')">可编辑</el-radio>
        </template>
        <template slot-scope="scope">
          <el-radio v-model="scope.row.perm" label="E" :name="scope.row.id"></el-radio>
        </template>
      </el-table-column>
      <el-table-column prop="hide" label="隐藏" width="80">
        <template slot="header" slot-scope="scope">
          <el-radio label="H" v-model="permSelect" @change="allSelect('H')">隐藏</el-radio>
        </template>
        <template slot-scope="scope">
          <el-radio v-model="scope.row.perm" label="H"  :name="scope.row.id"></el-radio>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
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
      formId: '111'
    }
  },
  created() {
    this.formPermsLoad()
  },
  computed:{
    formData(){
      return this.$store.state.design.formItems
    },
    formPerms(){
      return this.$store.state.selectedNode.props.formPerms
    }
  },
  methods: {
    allSelect(type){
      this.permSelect = type
      this.formPerms.forEach(f => f.perm = type)
    },
    formPermsLoad(){
      let perms = this.$store.state.selectedNode.props.formPerms
      this.formData.forEach(form => {
        let isLoad = false
        for (let i in perms) {
          if (perms[i].id === form.id){
            perms[i].title = form.title
            isLoad = true
            break;
          }
        }
        if (!isLoad){
          perms.push({
            id: form.id,
            title: form.title,
            perm: this.$store.state.selectedNode.type === 'ROOT' ? 'E':'R'
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
        this.permSelect = set.size === 1 ? set.values()[0] : ''
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
