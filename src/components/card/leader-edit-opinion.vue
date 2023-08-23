<template>
  <div class="leader-edit-opinion">
    <el-form :model="form" :rules="rules" label-position="left" ref="form">
      <el-form-item label="请选择" prop="isAccept">
        <el-radio-group v-model="form.isAccept" @change="updateForm">
          <el-radio :label="'1'">通过</el-radio>
          <el-radio :label="'0'">驳回</el-radio>
        </el-radio-group>
      </el-form-item>
      <!-- &&refuseWay=='TO_BEFORE' -->
      <el-form-item label="请选择驳回人" prop="disavower" v-if="form.isAccept == '0'&&refuseWay=='TO_BEFORE'">
        <el-select v-model="form.disavower" placeholder="请选择驳回节点/驳回人" @change="updateForm">
          <el-option v-for="item in disavower" :key="item.id"  :label="item.name+'/'+item.label+ ' 【' + item.nodeName+'】'" :value="item.id">
            <span style="
             width: 33%;
                font-weight: 700;
                color: #1d2128;
                font-size: 14px;
                line-height: 34px;
                display: inline-block;
              ">{{ item.name }}</span>
            <span style="
                 width: 33%;
                color: #505968;
                font-size: 14px;
                line-height: 34px;
                display: inline-block;
                font-weight: 400;
              ">{{ item.label }}

            </span>
            <span style="
                 width: 33%;
                color: #505968;
                font-size: 14px;
                line-height: 34px;
                display: inline-block;
                font-weight: 400;
              "> · {{ item.nodeName }}
            </span>

          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="请选择驳回原因" prop="reason" v-if="form.isAccept == '0'">
        <el-select v-model="form.reason" placeholder="请选择驳回原因" @change="updateForm">
          <el-option v-for="item in reasons" :key="item.value" :label="item" :value="item"></el-option>
        </el-select>
      </el-form-item>
      <!--  && assignedType == 'SELF_SELECT' -->
      <el-form-item label="请选择审批人" prop="approver" v-if="form.isAccept == '1'&& assignedType == 'SELF_SELECT'">
        <el-select v-model="form.approver" placeholder="需【下一节点名称】审批，请选择审批人" @change="updateForm">
          <el-option v-for="item in approver" :key="item.id"   :label="item.name+'/'+item.label+ ' 【' + item.nodeName+'】'" :value="item.id">
            <p class="flex"> 
            <span style="
             width: 33%;
                font-weight: 700;
                color: #1d2128;
                font-size: 14px;
                line-height: 34px;
                display: inline-block;
              " class="ellipsis ellipsis_1">{{ item.name }}</span>
            <span style="
                 width: 33%;
                color: #505968;
                font-size: 14px;
                line-height: 34px;
                display: inline-block;
                font-weight: 400;

              " class="ellipsis ellipsis_1">{{ item.label }}

            </span>
            <span style="
                 width: 33%;
                color: #505968;
                font-size: 14px;
                line-height: 34px;
                display: inline-block;
                font-weight: 400;
              "> · {{ item.nodeName }}
              
            </span>
          </p>
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
  props: {
  },
  data() {
    return {
      disavower: [],
      approver: [],
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
        isAccept: "1",
        approver: "",
        content: "",
        reason: '',
        disavower: '',
      },
      refuseWay: '',
      assignedType: '',
    };
  },
  watch: {
    leaderApproveInfo(val) {
      console.log('watch', val)
    }
  },
  methods: {
    initData(data) {
      this.disavower = data.disavower
      this.approver = data.approver
      this.refuseWay = data.refuseWay
      this.assignedType = data.assignedType

    },
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

