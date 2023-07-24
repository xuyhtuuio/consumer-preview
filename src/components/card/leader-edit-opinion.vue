<template>
  <div class="leader-edit-opinion">
    <el-form
      :model="form"
      :rules="rules"
      label-width="86px"
      label-position="left"
    >
      <el-form-item label="请选择" prop="isAccept">
        <el-radio-group v-model="form.isAccept">
          <el-radio :label="1">通过</el-radio>
          <el-radio :label="0">驳回</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="请选择审批人" prop="leader">
        <el-cascader
          :options="options"
          :props="{ checkStrictly: true }"
          clearable
          v-model="form.leader"
        ></el-cascader>
      </el-form-item>
      <el-form-item label="审查意见">
        <el-input
          type="textarea"
          placeholder="请输入审查话术内容"
          v-model="form.content"
          resize="none"
        ></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  name: "leader-edit-opinion",
  data() {
    return {
      options: [
        {
          value: "zhinan",
          label: "指南",
          children: [
            {
              value: "shejiyuanze",
              label: "设计原则",
              children: [
                {
                  value: "yizhi",
                  label: "一致",
                },
                {
                  value: "fankui",
                  label: "反馈",
                },
                {
                  value: "xiaolv",
                  label: "效率",
                },
                {
                  value: "kekong",
                  label: "可控",
                },
              ],
            },
            {
              value: "daohang",
              label: "导航",
              children: [
                {
                  value: "cexiangdaohang",
                  label: "侧向导航",
                },
                {
                  value: "dingbudaohang",
                  label: "顶部导航",
                },
              ],
            },
          ],
        },
      ],
      form: {
        isAccept: "",
        leader: "",
        content: "",
      },
    };
  },
};
</script>
<style lang="less" scoped>
.leader-edit-opinion {
  .el-form {
    .el-form-item__label {
      color: #1d2128;
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      // line-height: 22px;
    }

    .el-form-item__label::before {
      display: none;
    }

    .is-required .el-form-item__label::after {
      content: "*";
      color: #f76560;
      margin-left: 5px;
      font-size: 16px; //改变星号的大小
    }

    .el-form-item__content {
      border-radius: 4px;
      background: #f7f8fa;
      padding: 0 16px;
    }

  }
}
</style>

