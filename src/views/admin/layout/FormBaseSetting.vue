<template>
  <div class="base-setup">
    <el-form ref="baseSetting" :model="setup" :rules="rules" label-position="top" :hide-required-aterisk="false" label-width="80px">
      <el-form-item prop="templateName">
        <template slot="label">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-form-name"></use>
          </svg>
          流程名称<span style="color: red">*</span>
        </template>
        <el-input v-model.trim="setup.templateName" placeholder="请输入流程名称" class="is-dark input" size="medium"></el-input>
        <template slot="error">
          <span class="custom-error">
            <i class="iconfont icon-a-tubiao1"></i>
            <span class="error1" v-if="!setup.templateName">请输入流程名称</span>
            <span class="error1" v-else>长度在 2 到 10 个字符</span>
          </span>
        </template>
      </el-form-item>
      <el-form-item class="group" prop="formId">
        <template slot="label">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-form-desc"></use>
          </svg>
          关联表单<span style="color: red">*</span>
        </template>
        <el-select v-model="setup.formId" @change="changeSelectFormId" placeholder="请选择关联表单(单选)" size="medium" class="is-dark input" style="width: 100%">
          <el-option
            v-for="(op, index) in fromGroup"
            :key="index"
            :label="op.name"
            :value="op.id"
            style="max-width: 550px;">
          </el-option>
        </el-select>
        <template slot="error">
          <span class="custom-error">
            <i class="iconfont icon-a-tubiao1"></i>
            <span class="error1">请选择关联表单</span>
          </span>
        </template>
      </el-form-item>
      <el-form-item prop="remark">
        <template slot="label">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-form-desc"></use>
          </svg>
          表单说明
        </template>
        <el-input placeholder="请输入表单说明" v-model="setup.remark" type="textarea" class="is-dark input" show-word-limit
                  :autosize="{ minRows: 3, maxRows: 8}"></el-input>
      </el-form-item>
    </el-form>
    <org-picker :show="showUserSelect" @close="closeSelect" :selected="select" @selectOver="selected"></org-picker>
  </div>
</template>

<script>
import orgPicker from '@/components/common/organizationPicker'
import { itemPagingList } from '@/api/manage'
import { getFormCategoryNotAssociated } from '@/api/design'
export default {
  name: "FormBaseSetting",
  components: {orgPicker},
  data() {
    return {
      nowUserSelect: null,
      showUserSelect: false,
      select: [],
      fromGroup: [],
      rules: {
        templateName: [
          { required: true, message: '请输入流程名称', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ],
        formId: [
          { required: true, message: '请选择关联表单', trigger: 'change' }
        ],
      }
    }
  },
  computed: {
    setup() {
      return this.$store.state.design;
    }
  },
  mounted(){
    this.getObtainExamineTypeList()
  },
  methods: {
    async getFormItems() {
      const res = await itemPagingList({
        formCategoryId: this.setup.formId,
        pageNow: 1,
        pageSize: 1000
      })
      const resData = res.data.data
      if (resData) {
        const formItems = resData.list.map(item => {
          return {
            run: item.run,
            ...item.special
          }
        });
        this.$store.state.design.formItems = formItems
      }
    },
    async getObtainExamineTypeList() {
      const res = await getFormCategoryNotAssociated();
      const resData = res.data.data
      if (resData) {
        this.fromGroup = resData.map(item => {
          return {
            name: item.examineTypesName,
            id: item.recordId
          }
        });
      }
    },
    changeSelectFormId(val) {
      const value = [val]
      const group = this.fromGroup.filter(item => value.includes(item.id))
      this.setup.formName = group[0].name
      window.sessionStorage.setItem('formGroup', JSON.stringify(group))
      this.getFormItems()
    },
    closeSelect() {
      this.showUserSelect = false
      //this.nowUserSelect = null
    },
    selected(select) {
      this.showUserSelect = false
      // this.$set(this.setup.settings, this.nowUserSelect, select)
      //this.setup[this.nowUserSelect] = select
    },
    selectUser(key) {
      // this.select = this.setup.settings[key]
      this.nowUserSelect = key
      this.showUserSelect = true
    },
    validate(){
      this.$refs.baseSetting.validate()
      let err = []
      if ((!this.setup.templateName) || (this.setup.templateName?.length < 2) || (this.setup.templateName?.length > 10)){
        err.push('流程名称未设置或长度不对')
      }
      if (!this.$isNotEmpty(this.setup.formId) || !this.setup.formId){
        err.push('关联表单未设置')
      }
      console.log(this.setup)
      return err
    }
  }
}
</script>

<style lang="less" scoped>
.el-select:last-of-type {
  margin-right: 0;
}

/deep/ .el-select .el-input .el-icon-arrow-up::before {
  font-family: element-icons !important;
  content: "\e78f";
}
/deep/ .el-select-dropdown {
  display: none;
}
/deep/.is-dark.el-textarea .el-textarea__inner{
  background: #F3F3F5;
  border: none;
}

.icon-select {
  i {
    cursor: pointer;
    font-size: large;
    padding: 10px;

    &:hover {
      box-shadow: 0 0 10px 2px #C2C2C2;
    }
  }
}

/deep/ .select-u {
  width: 100%;
}

.icon {
  width: 1.3em;
  height: 1.3em;
}



.base-setup {
  overflow: auto;
  margin: 0 auto;
  width: 600px;
  height: calc(100vh - 105px);
  background: #ffffff;
  margin-top: 10px;
  padding: 15px 20px;

  /deep/ .el-form-item__label {
    padding: 0;
    font-weight: normal;
  }

  /deep/ .el-form-item {
    margin-bottom: 15px;
    .custom-error {
      position: absolute;
      bottom: -28px;
      i {
        font-size: 18px;
      }
      display: flex;
      align-items: center;
      font-size: 12px;
      color: #F56C6C;
      .right-icon {
        height: 20px;
      }
      .error1 {
        // position: relative;
        // bottom: 2px;
      }
    }
  }
  /deep/ .el-form-item.is-required:not(.is-no-asterisk)>.el-form-item__label:before {
    content: '';
  }
}

/deep/ .group {
  .el-select {
    width: calc(100% - 130px);
  }

  .el-button {
    margin-left: 10px;
    width: 120px;
  }
}

::-webkit-scrollbar {
  width: 4px;
  height: 4px;
  background-color: #f8f8f8;
}

::-webkit-scrollbar-thumb {
  border-radius: 16px;
  background-color: #e8e8e8;
}
</style>
