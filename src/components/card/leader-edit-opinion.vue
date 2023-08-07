<template>
  <div class="leader-edit-opinion">
    <el-form :model="form" :rules="rules" label-position="left" ref="form">
      <el-form-item label="请选择" prop="isAccept">
        <el-radio-group v-model="form.isAccept" @change="updateForm">
          <el-radio :label="1">通过</el-radio>
          <el-radio :label="0">驳回</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="请选择驳回人" prop="disavower" v-if="form.isAccept == '0'">
        <el-select v-model="form.disavower" placeholder="请选择驳回节点/驳回人" @change="updateForm">
          <el-option v-for="item in peoples" :key="item.value" :label="item.label" :value="item.value">
            <span style="
                float: left;
                font-weight: 700;
                color: #1d2128;
                font-size: 14px;
                line-height: 34px;
              ">{{ item.label }}</span>
            <span style="
                float: right;
                color: #505968;
                font-size: 14px;
                line-height: 34px;
                font-weight: 400;
              ">{{ item.dep1 }} | {{ item.dep2 }} | {{ item.dep3 }}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="请选择驳回原因" prop="reason" v-if="form.isAccept == '0'">
        <el-select v-model="form.reason" placeholder="请选择驳回原因" @change="updateForm">
          <el-option v-for="item in reasons" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="请选择审批人" prop="approver">
        <el-select v-model="form.approver" placeholder="需【下一节点名称】审批，请选择审批人" @change="updateForm">
          <el-option v-for="item in peoples" :key="item.value" :label="item.label" :value="item.value">
            <span style="
                float: left;
                font-weight: 700;
                color: #1d2128;
                font-size: 14px;
                line-height: 34px;
              ">{{ item.label }}</span>
            <span style="
                float: right;
                color: #505968;
                font-size: 14px;
                line-height: 34px;
                font-weight: 400;
              ">{{ item.dep1 }} | {{ item.dep2 }} | {{ item.dep3 }}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="审查意见" class="opinion">
        <el-input type="textarea" placeholder="请输入审查话术内容" v-model="form.content" resize="none"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { workSpaceAgree } from '@/api/approvalCenter'
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
        approver: [
          { required: true, message: "请选择审批人", trigger: ["blur"] },
        ],
        disavower: [
          { required: true, message: "请选择驳回节点/驳回人", trigger: ["blur"] },
        ],
        reason: [
          { required: true, message: "请选择驳回原因", trigger: ["blur"] },
        ],
      },
      reasons: ['文件预览失败（文件损坏/清晰度过低）', '附件材料与审批项目不匹配', '其他'],
      form: {
        isAccept: "",
        approver: "",
        content: "",
        reason: '',
        disavower: '',
      },
    };
  },
  methods: {
    updateForm() {
      this.$refs["form"].validate((valid) => {
        this.$store.commit('setEditOpinionRequired', valid)
        this.$store.commit('setEditOpinionForm', this.form)
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

