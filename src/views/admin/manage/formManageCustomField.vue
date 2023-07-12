<template>
  <div>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="字段名称" prop="name">
        <el-input v-model="ruleForm.name" placeholder="请输入字段名称" class="is-dark input"></el-input>
      </el-form-item>
      <el-form-item label="所属模块" prop="belong">
        <el-select v-model="ruleForm.belong" placeholder="请选择所属模块" class="is-dark input" style="width: 100%">
          <el-option label="区域一" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="字段类型" prop="type">
        <el-select v-model="ruleForm.type" placeholder="请选择字段类型" class="is-dark input" style="width: 100%">
          <el-option label="文本输入框" value="input"></el-option>
          <el-option label="级联选择" value="cascader"></el-option>
          <el-option label="时间范围选择" value="dateRange"></el-option>
          <el-option label="时间选择" value="date"></el-option>
          <el-option label="单选框" value="radio"></el-option>
          <el-option label="多选框" value="checkbox"></el-option>
          <el-option label="数字输入框" value="number"></el-option>
          <el-option label="人员选择-多选" value="user"></el-option>
          <el-option label="部门选择-多选" value="dept"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="提示文字" prop="placeholder" class="is-dark input">
        <el-input v-model="ruleForm.placeholder" placeholder="请输入提示文字"></el-input>
      </el-form-item>
      <el-form-item v-if="ruleForm.type === 'cascader'" label="选项设置" prop="cascaderItem" class="is-dark input">
        <el-button icon="el-icon-plus" type="text" size="mini" style="position: relative;left:260px;" @click="cascaderOptions.push('新选项')">新增选项</el-button>
        <div v-for="(op, index) in cascaderOptions" :key="index">
          <i class="el-icon-rank" style="margin-right: 6px;"></i>
          <el-input v-model="cascaderOptions[index]" size="small" style="width: 260px;"
                    placeholder="请设置选项值">
            <i slot="suffix" class="el-input__icon el-icon-delete"></i>
          </el-input>
        </div>
      </el-form-item>
      <el-form-item label="是否必填" prop="isRequire" class="is-dark input">
        <el-switch v-model="ruleForm.isRequire"></el-switch>
      </el-form-item>
      <!-- <el-form-item label="活动时间" required>
        <el-col :span="11">
          <el-form-item prop="date1">
            <el-date-picker type="date" placeholder="选择日期" v-model="ruleForm.date1" style="width: 100%;"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col class="line" :span="2">-</el-col>
        <el-col :span="11">
          <el-form-item prop="date2">
            <el-time-picker placeholder="选择时间" v-model="ruleForm.date2" style="width: 100%;"></el-time-picker>
          </el-form-item>
        </el-col>
      </el-form-item> -->
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        ruleForm: {
          name: '',
          belong: '',
          isRequire: false,
          placeholder: '',
          type: '',
          date1: '',
          date2: ''
        },
        rules: {
          name: [
            { required: true, message: '请输入字段名称', trigger: 'blur' },
            { min: 2, max: 6, message: '长度在 2 到 6 个字符', trigger: 'blur' }
          ],
          belong: [
            { required: true, message: '请选择所属模块', trigger: 'change' }
          ],
          type: [
            { required: true, message: '请选择字段类型', trigger: 'change' }
          ],
          date1: [
            { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
          ],
          date2: [
            { type: 'date', required: true, message: '请选择时间', trigger: 'change' }
          ]
        },
        cascaderOptions: ['']
      };
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            alert('submit!');
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
  }
</script>
