<template>
  <div class="base-setup">
    <el-form label-position="top" label-width="80px">
      <el-form-item>
        <template slot="label">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-form-name"></use>
          </svg>
          表单名称<span style="color: red">*</span>
        </template>
        <el-input v-model="setup.formName" placeholder="请输入表单名称" class="is-dark input" size="medium"></el-input>
      </el-form-item>
      <el-form-item class="group">
        <template slot="label">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-form-desc"></use>
          </svg>
          关联表单<span style="color: red">*</span>
        </template>
        <el-select v-model="setup.formId" multiple placeholder="请选择关联表单(多选)" size="medium" class="is-dark input" style="width: 100%">
          <el-option v-for="(op, index) in fromGroup" :key="index"
                     :label="op.name" :value="op.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
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
import {getFormGroups, updateGroup} from '@/api/design'

export default {
  name: "FormBaseSetting",
  components: {orgPicker},
  data() {
    return {
      nowUserSelect: null,
      showUserSelect: false,
      select: [],
      fromGroup: [{
        name: '表单1',
        id: 'form-1111'
      }, {
        name: '表单2',
        id: 'form-2222'
      }],
    }
  },
  computed: {
    setup() {
      return this.$store.state.design;
    }
  },
  mounted(){
  },
  methods: {
    closeSelect() {
      this.showUserSelect = false
      //this.nowUserSelect = null
    },
    selected(select) {
      console.log(select)
      this.showUserSelect = false
      // this.$set(this.setup.settings, this.nowUserSelect, select)
      //this.setup[this.nowUserSelect] = select
    },
    selectUser(key) {
      // this.select = this.setup.settings[key]
      this.nowUserSelect = key
      this.showUserSelect = true
    },
  }
}
</script>

<style lang="less" scoped>
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

.base-setup {
  overflow: auto;
  margin: 0 auto;
  width: 600px;
  height: calc(100vh - 105px);
  background: #ffffff;
  margin-top: 10px;
  padding: 15px 20px;

  i:first-child {
    position: relative;
    cursor: pointer;
    font-size: xx-large;
    color: #ffffff;
    border-radius: 10px;
    padding: 10px;
  }

  .change-icon {
    margin-left: 20px;

    span {
      font-size: small;
      color: #7a7a7a;
      margin-right: 15px;
    }

    i {
      cursor: pointer;
      color: #7a7a7a;
      font-size: x-large;
    }
  }

  /deep/ .el-form-item__label {
    padding: 0;
    font-weight: normal;
  }

  /deep/ .el-form-item {
    margin-bottom: 5px;
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
