<template>
  <el-dialog :visible.sync="addReviewDialog" width="800px" :before-close="handleClose" center custom-class="add-review"
    title="驳回">
    <el-form label-position="left" label-width="80px" :model="form" :rules="rules">
      <el-form-item label="驳回原因" prop="reason">
        <el-select v-model="form.reason" placeholder="请选择驳回原因" size="medium">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="原因描述">
        <el-input v-model="form.txt" placeholder="请输入驳回原因描述" type="textarea" :rows="5" class="edit-input"
          resize="none"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="submit"> 确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import {
  rollback
} from "@/api/aiApproval";
export default {
  name: 'rejectDialog',
  props: {
    formBase: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      addReviewDialog: false,
      form: {
        reason: '',
        txt: ''
      },
      options: [
        {
          value: '文件预览失败（文件损坏/清晰度过低）',
          label: '文件预览失败（文件损坏/清晰度过低）'
        },
        {
          value: '附件材料与审批项目不匹配',
          label: '附件材料与审批项目不匹配'
        },
        {
          value: '其他',
          label: '其他'
        }
      ],
      rules: {
        reason: [
          { required: true, message: '请选择驳回原因', trigger: 'change' }
        ],
      }
    }
  },
  mounted() {

  },
  methods: {
    init() {
      this.form.reason = this.options[0].value;
      this.form.txt = '';
      this.addReviewDialog = true;
    },
    handleClose() {
      this.addReviewDialog = false;
    },
    submit() {
      const user = JSON.parse(window.localStorage.getItem('user_name'))
      const data = {
        comments: `${this.form.reason}${this.form.txt.trim() ? '-' + this.form.txt : ''}`,
        currentUserInfo: {
          id: user.id,
          name: user.fullname
        },
        processInstanceId: this.formBase.processInstanceId,
        rollbackId: this.formBase.rollbackId,
        signInfo: this.formBase.signInfo,
        nodeId: this.formBase.nodeId,
        taskId: this.formBase.taskId,
        templateId: this.formBase.templateId
      }
      rollback(data).then((res) => {
        const { status, msg } = res.data;
        if (status === 200) {
          this.$message.success('操作成功！');
          this.$router.go(-1)
        } else {
          this.$message.error({ offset: 40, message: msg });
        }
      })
    },
  }
}
</script>
<style lang="less" scoped>
/deep/.add-review {
  border-radius: 10px;
  background: #FFF;
  padding: 40px 60px;

  .el-dialog__header {
    padding: 0;
    margin-bottom: 24px;
  }

  .el-dialog__body {
    padding: 0;
  }

  .el-form-item__label {
    font-size: 14px;
    font-weight: 400;
  }

  .el-form-item__label {
    position: relative;
  }

  .el-form-item.is-required .el-form-item__label::before {
    position: absolute;
    right: 12px;
    color: #EB5757;
  }

  .el-select {
    width: 300px;

    .el-input__icon {
      line-height: 36px;
      height: 36px;
    }

    .el-input__inner {
      background: #f7f8fa;
      border: none;
      padding-right: 30px;
      height: 38px;
      line-height: 38px;
    }
  }

  .el-icon-arrow-up::before {
    font-family: element-icons !important;
    content: '\e78f';
  }

  .el-icon-arrow-down::before {
    font-family: element-icons !important;
    content: '\e790';
  }

  .el-textarea {
    .el-textarea__inner {
      padding: 12px;
    }
  }

  .el-dialog__footer {
    margin-top: 36px;
    padding-bottom: 0;
  }

  input,
  select,
  option,
  .el-textarea__inner {
    outline: none !important;
  }

  .dialog-footer {
    .el-button {
      padding: 8px 40px;
      border-radius: 4px;
      font-size: 14px;
      font-weight: 400;
      line-height: 22px;
    }

    .el-button--default {
      color: #1D2128;
      border-radius: 4px;
      border: 1px solid #CACDD3;
    }

    .el-button--primary {
      border-radius: 4px;
      background: #2D5CF6;
      color: #FFF;
      margin-left: 10px;

    }
  }
}

.el-dialog {}
</style>