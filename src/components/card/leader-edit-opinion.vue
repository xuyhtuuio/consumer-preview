<template>
  <div class="leader-edit-opinion">
    <el-form :model="form" :rules="rules" label-position="left" ref="form">
      <el-form-item label="请选择" prop="isAccept">
        <el-radio-group v-model="form.isAccept">
          <el-radio :label="1">通过</el-radio>
          <el-radio :label="0">驳回</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="请选择审批人" prop="leader">
        <el-select
          v-model="form.leader"
          placeholder="需【下一节点名称】审批，请选择审批人"
        >
          <el-option
            v-for="item in peoples"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
            <span
              style="
                float: left;
                font-weight: 700;
                color: #1d2128;
                font-size: 14px;
                line-height: 34px;
              "
              >{{ item.label }}</span
            >
            <span
              style="
                float: right;
                color: #505968;
                font-size: 14px;
                line-height: 34px;
                font-weight: 400;
              "
              >{{ item.dep1 }} | {{ item.dep2 }} | {{ item.dep3 }}</span
            >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="审查意见" class="opinion">
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
      peoples: [
        {
          value: "Beijing",
          dep1: "总行",
          dep2: "财富平台部",
          dep3: "财富客群团队",
          label: "谭新宇",
        },
        {
          value: "Shanghai",
          dep1: "总行",
          dep2: "财富平台部",
          dep3: "财富客群团队",
          label: "谭新宇",
        },
        {
          value: "Nanjing",
          dep1: "总行",
          dep2: "财富平台部",
          dep3: "财富客群团队",
          label: "谭新宇",
        },
      ],
      rules: {
        isAccept: [{ required: true, message: "请选择", trigger: ["blur"] }],
        leader: [
          { required: true, message: "请选择审批人", trigger: ["blur"] },
        ],
      },
      form: {
        isAccept: "",
        leader: "",
        content: "",
      },
    };
  },
  methods: {
    opinionSubmit() {
      console.log("ff");
      this.$refs["form"].validate((valid) => {
        if (valid) {
        }
      });
    },
  },
};
</script>
<style lang="less" scoped>
.leader-edit-opinion {
  /deep/ .el-form {
    .el-form-item {
      display: flex;
      flex-direction: column;
    }
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
      border-radius: 4px;
      padding: 0 16px;
      .el-select {
        width: 100%;
      }
      .el-select .el-input__inner {
        background: #f7f8fa;
        border: none;
        padding: 0;
        // color: #ACB1B9;
      }
      .el-select .el-input .el-icon-arrow-up::before {
        font-family: element-icons !important;
        content: "\e78f";
      }
    }
    .el-form-item__error::before {
              font-family: element-icons !important;
              content: "\e7a3";
              font-size: 20px;
              margin-right: 8px;
            }
            .el-form-item__error {
              display: flex;
              align-items: center;
              margin-top: 6px;
              color: #eb5757;
            }
    .opinion {
      .el-form-item__content {
        padding: 0;
        .el-textarea {
          height: 96px;
          .el-textarea__inner {
            height: 100%;
          }
        }
      }
    }
  }
}
</style>

