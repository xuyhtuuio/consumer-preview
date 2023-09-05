<template>
  <el-dialog
    :visible.sync="dialogVisible"
    width="560px"
    :before-close="handleClose"
    append-to-body
  >
    <p><i class="iconfont icon-a-tubiao1"></i></p>
    <span>{{ option.message }}</span>
    <div class="select-div" v-if="nextStepObj?.selectObject === '1'">
      <el-form
        :model="params"
        ref="paramsForm"
        label-position="left"
        :rules="rules"
        :inline="true"
        class="paramsForm"
      >
        <el-form-item
          style="width: 100%"
          required
          label="请选择审批人"
          label-width="110px"
          prop="nextUser"
          class="params-nextUser params-nextUser"
        >
          <el-select
            v-model.trim="params.nextUser"
            multiple
            :multiple-limit="1"
            :placeholder="`需${nextStepObj.nextNodeName}审批，请选择审批人`"
            filterable
          >
            <el-option
              v-for="(item, code) in nextStepObj?.nodeSelectList?.[0] || {}"
              :key="code"
              :label="code"
              :value="item"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">{{ option.cancelBtn }}</el-button>
      <el-button type="primary" :disabled="isDisabled" @click="handleConfirm">{{
        option.confirmBtn
      }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { debounce } from 'lodash';
export default {
  props: {
    option: {
      type: Object,
      default: () => ({
        message: '是否保存本审查项目的审查意见？',
        cancelBtn: '不保存',
        confirmBtn: '保存',
      }),
    },
    nextStepObj: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      isDisabled: false,
      dialogVisible: false,
      params: {
        isPasses: true,
        reason: '',
        txt: '',
        nextUser: [],
        prevUser: '',
      },
      rules: {
        nextUser: [
          { required: true, message: '请选择审批人', trigger: 'change' },
        ],
      },
    };
  },
  mounted() {},
  methods: {
    handleClose() {
      this.dialogVisible = false;
      this.$emit('handleClose', true);
    },
    handleConfirm: debounce(function () {
      // 不需要在这里关闭弹框的确认弹框
      if (!this.option.noClose) {
        this.dialogVisible = false;
      }
      this.$emit('handleConfirm');
    }, 500),
  },
};
</script>

<style lang="less" scoped>
.el-dialog__wrapper {
  /deep/ .el-dialog__header {
    padding: 0;
  }
  /deep/ .el-dialog__body {
    text-align: center;
    font-size: 14px;
    font-weight: 400;

    span {
      line-height: 22px;
      color: #1d2128;
    }

    .icon-a-tubiao1 {
      display: inline-block;
      color: #fdb123;
      font-size: 50px;
      margin-bottom: 22px;
    }
  }
  .paramsForm {
    margin-top: 24px;
    /deep/.el-form-item {
      margin: 0;
      display: flex;
      .el-form-item__label {
        flex-shrink: 0;
      }
    }
    display: flex;
    flex-wrap: wrap;
    .params-nextUser,
    .params-prevUser,
    .params-reason,
    .params-txt {
      padding: 0;
      /deep/ .el-form-item__content {
        padding: 0;
      }
      /deep/ .el-input__inner {
        background: #f7f8fa;
        border: none;
        border-radius: 4px;
      }
    }
    .params-nextUser .el-select {
      width: 400px;
    }
    .params-txt {
      flex: 1;
      /deep/ .el-form-item__content {
        width: 100%;
      }
    }
  }
  /deep/ .el-dialog__footer {
    text-align: center;

    .el-button {
      min-width: 88px;
      text-align: center;
      font-size: 14px;
      font-weight: 400;
      line-height: 22px;
      border-radius: 6px;

      & + .el-button {
        margin-left: 24px;
      }
    }

    .el-button--default {
      border: 1px solid #cacdd3;
      color: #1d2128;
    }
    .el-button--primary {
      line-height: 24px;
      background: #2d5cf6;
      border: none;
    }
  }
}
</style>
