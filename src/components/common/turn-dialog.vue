<template>
  <el-dialog
    :visible.sync="turnDialog"
    width="800px"
    :before-close="handleClose"
    center
    custom-class="add-review"
    title="转办"
  >
    <el-form
      label-position="left"
      label-width="80px"
      ref="turnForm"
      :model="form"
      :rules="rules"
    >
      <el-form-item label="转办人" prop="turnTo">
        <el-select
          v-model="form.turnTo"
          placeholder="请选择转办人"
          popper-class="approver-select"
          :popper-append-to-body="false"
        >
          <el-option
            v-for="(item, index) in nextStepObj.changeHandleUserRangeList"
            :key="index"
            :label="item.name + '/' + item.org"
            :value="item.id"
          >
            <div class="flex">
              <div class="item ellipsis ellipsis_1">{{ item.name }}</div>
              <div class="item ellipsis ellipsis_1">{{ item.org }}</div>
              <!-- <div class="item ellipsis ellipsis_1">{{ item.nodeName }}</div> -->
            </div>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="原因描述">
        <el-input
          v-model="form.txt"
          placeholder="请输入转办原因描述"
          type="textarea"
          :rows="5"
          class="edit-input"
          resize="none"
        ></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" :disabled="refuseDisabled" @click="submit">
        确 定</el-button
      >
    </span>
  </el-dialog>
</template>
<script>
import { setAssignee } from '@/api/aiApproval'
export default {
  name: 'rejectDialog',
  props: {
    formBase: {
      type: Object,
      default: () => ({})
    },
    nextStepObj: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      turnDialog: false,
      form: {
        txt: '',
        turnTo: ''
      },
      refuseDisabled: false,
      rules: {
        turnTo: [{ required: true, message: '请选择转办人', trigger: 'change' }]
      }
    }
  },
  mounted() {},
  methods: {
    init() {
      this.form.turnTo = ''
      this.form.txt = ''
      this.turnDialog = true
    },
    handleClose() {
      this.turnDialog = false
    },
    submit() {
      this.$refs['turnForm'].validate((valid) => {
        if (valid) {
          this.$message.info('转办中，请稍等！')
          const user = JSON.parse(window.localStorage.getItem('user_name'))
          this.refuseDisabled = true
          const data = {
            taskId: this.formBase.taskId,
            templateId: this.formBase.processTemplateId,
            processInstanceId: this.formBase.processInstanceId,
            nodeId: this.formBase.nodeId,
            currentUserInfo: {
              id: user.id,
              name: user.fullname
            },
            comments: this.form.txt,
            transferUserInfo: {
              id: this.form.turnTo
            }
          }
          setAssignee(data)
            .then((res) => {
              this.refuseDisabled = false
              const { status, msg } = res.data
              if (status === 200) {
                this.$message.success({
                  offset: 40,
                  message: '转办成功！'
                })
                this.submitReviewDialog = false
                this.$router.go(-1)
              } else {
                this.$message.error({ offset: 40, message: msg })
              }
            })
            .catch(() => {
              this.refuseDisabled = false
            })
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
/deep/.add-review {
  border-radius: 10px;
  background: #fff;
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
    color: #eb5757;
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
      color: #1d2128;
      border-radius: 4px;
      border: 1px solid #cacdd3;
    }

    .el-button--primary {
      border-radius: 4px;
      background: #2d5cf6;
      color: #fff;
      margin-left: 10px;
    }
  }
}

/deep/ .approver-select {
  max-width: 500px;
}
</style>
