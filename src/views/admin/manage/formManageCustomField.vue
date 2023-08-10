<template>
  <div>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="字段名称" prop="title">
        <el-input v-model="ruleForm.title" :disabled="titleDisable" placeholder="请输入字段名称" class="is-dark input"></el-input>
      </el-form-item>
      <el-form-item label="所属模块" prop="module">
        <el-select v-model="ruleForm.module" :disabled="moudleDisable" @change="changeModule" placeholder="请选择所属模块" class="is-dark input" style="width: 100%">
          <el-option v-for="item in belongModules" :label="item.label" :value="item.value" :key="item.value" :disabled="item.disable"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="字段类型" prop="name">
        <el-select v-model="ruleForm.name" @change="changeFiledType" :disabled="nameDisable" placeholder="请选择字段类型" class="is-dark input" style="width: 100%">
          <el-option v-for="item in feildTypes" :label="item.chineseCharacter" :value="item.name" :key="item.name" :disabled="item.disable || item.name === 'MultipleGroupsSelect'"></el-option>
        </el-select>
      </el-form-item>
      <!-- <el-form-item v-if="ruleForm.name === 'TimePicker'" label="时间格式" prop="dateFormat" class="is-dark input">
        <el-select v-model="ruleForm.dateFormat" placeholder="请选择字段类型" class="is-dark input" style="width: 100%">
          <el-option label="yyyy-MM-dd hh:mm:ss" value="yyyy-MM-dd hh:mm:ss"></el-option>
          <el-option label="yyyy-MM-dd" value="yyyy-MM-dd"></el-option>
          <el-option label="yyyy/MM/dd hh:mm:ss" value="yyyy/MM/dd hh:mm:ss"></el-option>
          <el-option label="yyyy/MM/dd" value="yyyy/MM/dd"></el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item label="提示文字" prop="placeholder" class="is-dark input">
        <el-input v-model="ruleForm.placeholder" placeholder="请输入提示文字"></el-input>
      </el-form-item>
      <el-form-item v-if="ruleForm.name === 'Cascader'" label="选项设置" prop="cascaderItem" class="is-dark input">
        <!-- <el-button icon="el-icon-plus" type="text" size="mini" style="position: relative;left:260px;" @click="addCascaderOptions">新增选项</el-button> -->
        <CascaderField :leval="1" :data="cascaderOptions" class="cascader-content" style="position: relative;top: 35px;margin-bottom: 30px"/>
      </el-form-item>
      <el-form-item v-if="ruleForm.name === 'SelectInput' || ruleForm.name === 'MultipleSelect'" label="选项设置" prop="cascaderItem" class="is-dark input">
        <el-button icon="el-icon-plus" type="text" size="mini" style="position: relative;left:260px;" @click="addSelectOptions">新增选项</el-button>
        <SelectField :data="selectOptions" class="cascader-content"/>
      </el-form-item>
      <el-form-item v-if="ruleForm.name === 'MultipleGroupsSelect'" label="选项设置" prop="cascaderItem" class="is-dark input">
        <el-button icon="el-icon-plus" type="primary" size="mini" style="position: relative;left:333px;padding: 4px 20px;" @click="addSelectGroupOptions">添加选项组</el-button>
        <SelectGroupField :data="selectGroupOptions" class="cascader-content"/>
      </el-form-item>
      <el-form-item v-if="ruleForm.name === 'TextInput' || ruleForm.name === 'TextareaInput'" label="文字个数" prop="numberOfWords" class="is-dark input">
        <el-input v-model="ruleForm.numberOfWords" maxlength="7" placeholder="请输入文字个数" oninput="value=value.replace(/^0|[^0-9]/g, '')" class="is-dark input"></el-input>
      </el-form-item>
      <el-form-item v-if="ruleForm.name === 'TextInput'" label="独占一行" prop="exclusiveRowOrNot" class="is-dark input">
        <el-switch v-model="ruleForm.exclusiveRowOrNot"></el-switch>
      </el-form-item>
      <el-form-item v-if="showExpanding" label="选项展开" prop="expanding" class="is-dark input">
        <el-switch v-model="ruleForm.expanding" :disabled="expandingDisable"></el-switch>
      </el-form-item>
      <el-form-item label="是否多选" v-if="ruleForm.name === 'Cascader'" prop="isMultiple" class="is-dark input">
        <el-switch v-model="ruleForm.isMultiple"></el-switch>
      </el-form-item>
      <el-form-item label="是否必填" prop="required" class="is-dark input">
        <el-switch v-model="ruleForm.required" :disabled="isRequired"></el-switch>
      </el-form-item>
      <el-form-item style="margin-left: 100px;">
        <el-button type="primary" @click="submitForm('ruleForm')">确认</el-button>
        <el-button @click="resetForm('ruleForm')">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  import { belongModules } from '@/utils/dict'
  import { addFormField, editItem } from '@/api/manage'
  import CascaderField from './cascaderField'
  import SelectField from './selectField'
  import SelectGroupField from './selectGroupField'
  let id = 0
  export default {
    components: {
      CascaderField,
      SelectField,
      SelectGroupField
    },
    props: {
      drawerTitle: String,
      feildTypes: Array
    },
    data() {
      return {
        ruleForm: {
          title: '',
          module: '',
          required: false,
          placeholder: '',
          name: '',
          exclusiveRowOrNot: false,
          numberOfWords: null,
          options: [],
          expanding: false,
          isMultiple: false,
          dateFormat: ''
        },
        rules: {
          title: [
            { required: true, message: '请输入字段名称', trigger: 'blur' },
            { min: 2, max: 6, message: '长度在 2 到 6 个字符', trigger: 'blur' }
          ],
          module: [
            { required: true, message: '请选择所属模块', trigger: 'change' }
          ],
          name: [
            { required: true, message: '请选择字段类型', trigger: 'change' }
          ],
          dateFormat: [
            { required: true, message: '请选择时间格式', trigger: 'change' }
          ]
        },
        belongModules,
        cascaderOptions: [
          {
            id: '0',
            value: '',
            children: []
          }
        ],
        selectOptions: [{
          id: 0,
          value: ''
        }],
        selectGroupOptions: [{
          id: 0,
          value: '组1',
          showInput: false,
          children: [{
            id: '11',
            value: ''
          }]
        }],
        currentRow: {},
        parentForm: {}
      };
    },
    computed: {
      titleDisable() {
        const arr = ['宣传渠道', '项目名称', '上线时间', '下线时间']
        return arr.includes(this.ruleForm.title)
      },
      nameDisable() {
        return this.titleDisable || this.ruleForm.module === '核对要点'
      },
      isMultipleGroupsSelect() {
        return this.ruleForm.name === 'MultipleGroupsSelect'
      },
      moudleDisable() {
        return this.isMultipleGroupsSelect || this.titleDisable
      },
      expandingDisable() {
        return this.isMultipleGroupsSelect || this.ruleForm.module === '核对要点'
      },
      showExpanding() {
        return this.ruleForm.name === 'SelectInput' || this.ruleForm.name === 'MultipleSelect' || this.ruleForm.name === 'MultipleGroupsSelect'
      },
      isRequired() {
        return (this.titleDisable || this.expandingDisable) && this.ruleForm.title !== '下线时间'
      }
    },
    methods: {
      resetOptions() {
        this.selectOptions = this.$options.data().selectOptions
        this.selectGroupOptions = this.$options.data().selectGroupOptions
        this.cascaderOptions = this.$options.data().cascaderOptions
      },
      setOptions(name, options) {
        if (name === 'MultipleGroupsSelect') {
          this.selectGroupOptions = options
        } else if (name === 'Cascader') {
          this.cascaderOptions = options
        } else {
          this.selectOptions = options
        }
      },
      initForm(form, row) {
        this.parentForm = form;
        if (row) {
          this.currentRow = JSON.parse(JSON.stringify(row))
          this.$set(this.ruleForm, 'title', this.currentRow.title)
          this.$set(this.ruleForm, 'module', this.currentRow.module)
          this.$set(this.ruleForm, 'name', this.currentRow.special.name)
          this.$set(this.ruleForm, 'required', Boolean(this.currentRow.required))
          this.$set(this.ruleForm, 'expanding', Boolean(this.currentRow.special.props.expanding))
          this.$set(this.ruleForm, 'placeholder', this.currentRow.special.props.placeholder)
          this.$set(this.ruleForm, 'numberOfWords', this.currentRow.special.props.numberOfWords)
          this.$set(this.ruleForm, 'exclusiveRowOrNot', this.currentRow.special.props.exclusiveRowOrNot)
          if (this.currentRow.special.name && this.currentRow.special.props.Options) {
            this.setOptions(this.currentRow.special.name, this.currentRow.special.props.Options)
          }
        } else {
          this.currentRow = {}
          this.ruleForm = this.$options.data().ruleForm
        }
        this.$nextTick(() => {
          this.$refs['ruleForm'].clearValidate()
        })
      },
      changeModule(val) {
        if (val === '核对要点') {
          this.$set(this.ruleForm, 'name', 'MultipleSelect')
          this.$set(this.ruleForm, 'expanding', true)
          this.$set(this.ruleForm, 'required', true)
        } else {
          this.$set(this.ruleForm, 'name', '')
        }
        this.$refs['ruleForm'].clearValidate() 
      },
      changeFiledType(val) {
        if (val === 'MultipleGroupsSelect') {
          this.$set(this.ruleForm, 'title', '宣传渠道')
          this.$set(this.ruleForm, 'module', '基本信息')
          this.$set(this.ruleForm, 'expanding', true)
        } else {
          // this.$set(this.ruleForm, 'title', '')
          // this.$set(this.ruleForm, 'module', '')
          this.$set(this.ruleForm, 'expanding', false)
        }
        this.$refs['ruleForm'].clearValidate() 
      },
      addSelectOptions() {
        this.selectOptions.push({
          id: ++id,
          value: ''
        })
      },
      addSelectGroupOptions() {
        this.selectGroupOptions.push({
          id: ++id,
          value: '组' + (this.selectGroupOptions.length + 1),
          showInput: false,
          isHover: false,
          children: [{
            id: ++id,
            value: ''
          }]
        })
      },
      async submitForm(formName) {
        this.$refs[formName].validate(async (valid) => {
          if (valid) {
            const data = this.handleForm()
            const form = {
              type: data.name,
              formCategoryId: this.parentForm.recordId,
              formItemId: this.currentRow?.id,
              sort: this.currentRow?.sort,
              data
            }
            if (this.checkOptionValue(data.name)) {
              this.$message.error('请完善选项设置')
              return false;
            }
            // 没有id是新增
            let res;
            if (!this.currentRow?.id) {
              // 新增字段
              res = await addFormField(form)
            } else {
              // 编辑字段
              res = await editItem(form)
            }
            if (res?.data?.success) {
              this.resetOptions()
              this.$emit('refreshItemList')
            } else {
              this.$message.error(res.data?.msg)
            }
          } else {
            // console.log('error submit!!');
            return false;
          }
        });
      },
      checkOptionValue(type) {
        let isNullValue = false;
        switch (type) {
          case 'SelectInput':
          case 'MultipleSelect':
          chenck(this.selectOptions)
            break;
          case 'Cascader':
          chenck(this.cascaderOptions)
            break;
        }
        return isNullValue;
        function chenck(arr) {
          const nullValue = arr.filter(option => option.value.trim() === '');
          if (nullValue.length) {
            isNullValue = true;
          }
          arr?.children?.length && chenck(arr?.children?.length)
        }
      },
      resetForm(formName) {
        this.resetOptions()
        this.$refs[formName].resetFields();
        this.$emit('close')
      },
      handleForm() {
        const {
          title,
          name,
          module,
          required,
          placeholder,
          numberOfWords,
          exclusiveRowOrNot,
          expanding,
          options,
          isMultiple,
          dateFormat
        } = this.ruleForm
        let form = {
          TextInput: {
            id: this.getId(),
            title,
            name,
            module,
            value: '',
            valueType: 'String',
            props: {
              required,
              placeholder,
              numberOfWords,
              exclusiveRowOrNot
            }
          },
          TextareaInput: {
            id: this.getId(),
            title,
            name,
            module,
            value: '',
            valueType: 'String',
            props: {
              required,
              placeholder,
              numberOfWords
            }
          },
          SelectInput: {
            id: this.getId(),
            title,
            name,
            module,
            value: '',
            valueType: 'String',
            props: {
              required,
              placeholder,
              expanding,
              options: this.selectOptions
            }
          },
          MultipleSelect: {
            id: this.getId(),
            title,
            name,
            module,
            value: [],
            valueType: 'Array',
            props: {
              required,
              placeholder,
              expanding,
              options: this.selectOptions
            }
          },
          MultipleGroupsSelect: {
            id: this.getId(),
            title,
            name,
            module,
            value: [],
            valueType: 'Array',
            props: {
              required,
              placeholder,
              expanding,
              options: this.selectGroupOptions
            }
          },
          Cascader: {
            id: this.getId(),
            title,
            name,
            module,
            value: [],
            valueType: 'Tree',
            props: {
              required,
              placeholder,
              multiple: isMultiple,
              options: this.cascaderOptions
            }
          },
          TimePicker: {
            id: this.getId(),
            title,
            name,
            module,
            value: '',
            valueType: 'String',
            props: {
              required,
              placeholder,
              format: dateFormat,
            }
          }
        }
        return form[this.ruleForm.name]
      },
      getId() {
        // return this.currentRow?.id;
      return this.currentRow?.id || 'field' + (Math.floor(Math.random() * (99999 - 10000)) + 10000).toString() + new Date().getTime().toString().substring(5);
      },
    }
  }
</script>
<style lang="less" scoped>
/deep/.el-input__inner {
  height: 36px;
}
</style>
