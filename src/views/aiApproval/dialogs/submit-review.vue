<template>
    <el-dialog :visible.sync="submitReviewDialog" :show-close="showClose" width="1200px" :before-close="handleClose" center
        custom-class="submit-review">
        <div slot="title">
            <div class="top-op">
                <span class="flex">
                    <i class="iconfont icon icon-shenpixinxi"></i>
                    <i class="title">提交审查意见</i>
                </span>
                <div>
                    <el-button @click="handleClose">取消</el-button>
                    <el-button type="primary" @click="submit" :disabled="disabled"> 提交</el-button>
                </div>
            </div>
            <div class="line"></div>
        </div>
        <div class="main">
            <el-form :model="params" ref="paramsForm" label-position="left" :rules="rules" :inline="true"
                class="paramsForm">
                <el-form-item required label="是否通过" label-width="110px"
                    v-if="approvalLetter.permissions === 'passNotAllow'">
                    <el-radio-group v-model="params.isPasses">
                        <el-radio :label="item.id" v-for="item in passlist" :key="item.id">
                            {{ item.name }}
                        </el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item v-if="nextStepObj?.selectObject === '1'" style="width: 100%;" required label="请选择审批人"
                    label-width="110px" prop="nextUser" class="params-nextUser params-nextUser">
                    <el-select v-model.trim="params.nextUser" multiple :multiple-limit="1"
                        :placeholder="`需${nextStepObj.nextNodeName}审批，请选择审批人`" filterable>
                        <el-option v-for="item in nextStepObj?.nodeSelectUserList || []" :key="item.id" :label="item.name"
                            :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <template v-if="approvalLetter.permissions === 'passNotAllow' && !params.isPasses">
                    <el-form-item required prop="prevUser" class="params-prevUser" label=" "
                        v-if="nextStepObj?.refuseWay === 'TO_BEFORE'">
                        <el-select v-model.trim="params.prevUser" placeholder="请选择驳回人">
                            <el-option v-for="(item, code) in nextStepObj?.nodeSelectList?.[0] || {}" :key="code"
                                :label="code" :value="item">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item required prop="reason" class="params-reason" label=" ">
                        <el-select v-model.trim="params.reason" placeholder="请选择驳回原因">
                            <el-option v-for="item in rejectOption" :key="item.value" :label="item.label"
                                :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item class="params-txt">
                        <el-input v-model="params.txt" placeholder="请补充说明具体原因描述"></el-input>
                    </el-form-item>
                </template>
            </el-form>
            <el-form label-width="110px" label-position="left" v-if="params.isPasses !== false">
                <!-- 其他审批人字段 -->
                <com-form-item v-for="item in applyFormWithPermissions.filledInByApprover" :key="item.id"
                    :item="item"></com-form-item>
                <!-- 核对要点 -->
                <ExaminePivot ref="refExamine" :titleShow="true" :isWidthDiff="true">
                    <p class="examine-title"><i class="iconfont icon-jinggao1"></i>{{ examineInfo }}</p>
                </ExaminePivot>
            </el-form>
            <template v-if="params.isPasses !== false">
                <p class="title">消保审查意见书</p>
                <div class="submission-content" v-if="submission.length">
                    <!-- <p class="submission-name">
                    拟同意该申请项目，并提出以下消保审查意见，<i style="color: #505968;">请您确认是否采纳以下意见：</i>
                </p> -->
                    <div class="submission-list">
                        <div class="submission-item" v-for="(item, index) in submission" :key="index"
                            @mouseleave="mouseleave" @mouseenter="mouseenter(item, index)">
                            <div class="submission-text" @dblclick="showEdit_collection(index)">
                                <span class="sort">{{ index + 1 }}.</span>
                                <span v-if="!item.showEdit">{{ item.str }}</span>
                                <el-input v-else :ref="`input_${index}`" v-model.trim="item.str" placeholder="请输入意见"
                                    type="textarea" :rows="3" class="edit-input" resize="none" @blur="item.showEdit = false"
                                    @keyup.enter.native="item.showEdit = false"></el-input>
                            </div>
                            <div class="submission-op">
                                <!-- <i>无实质意见</i> -->
                                <el-tooltip class="item" content="点击意见标签切换意见类型" placement="bottom"
                                    v-if="approvalLetter.permissions === 'passAllow'">
                                    <span v-if="item.opinion" class="opinion no-opinion"
                                        @click="item.opinion = !item.opinion">
                                        <i class="iconfont icon icon-guanzhu2"></i>
                                        有实质意见
                                    </span>
                                    <span v-if="!item.opinion" class="opinion has-opinion"
                                        @click="item.opinion = !item.opinion">
                                        <i class="iconfont icon icon-guanzhu"></i>
                                        无实质意见
                                    </span>
                                </el-tooltip>
                                <span style="width:20px;"> <i class="el-icon-top move"
                                        v-if="index !== 0 && mousePoint == index" @click="moveTop(index)"></i></span>
                                <span style="width:20px;"><i class="el-icon-bottom move"
                                        v-if="index !== submission.length - 1 && mousePoint == index"
                                        @click='moveDown(index)'></i></span>
                                <span style="width:20px;">
                                    <i class="iconfont icon  icon-xianxingtubiao-1 del"
                                        @click="del(item, index)"></i></span>
                            </div>
                        </div>
                    </div>
                    <!-- <p class="submission-name">
                    以上为消保审查办公室建议，请酌情考虑。<br />
                </p> -->
                    <p
                        style="font-size 12px;margin-top: 12px; font-weight: 400;line-height: 22px;color: #505968;text-indent: 2em;">
                        送审单位应落实消费者权益保护审查工作主体责任，并根据业务实际情况决定意见采纳情况。活动过程之中，应紧密监控开展情况，优化服务流程，提升客户体验，妥善处理客户投诉，并及时向消保部门反馈。敬请知悉。
                    </p>
                    <p class="organization">
                        <span>消保审查中心</span><br />
                        <span>{{ timeNow }}</span>
                    </p>
                </div>
                <div v-else class="nodata">
                    <img src="@/assets/image/ai-approval/nodata.svg" alt="" class="暂无推荐的意见">
                    <p>未提出相关意见内容</p>
                </div>
            </template>
        </div>
        <secondary-confirmation :option="saveOption" ref="confirmation"
            @handleConfirm="() => { submitReviewDialog = false }"></secondary-confirmation>
    </el-dialog>
</template>
<script>
// eslint-disable-next-line
import * as dayjs from 'dayjs'
import {
  updateRuleCode,
  ocrApprovalSubmission
} from '@/api/aiApproval';
import secondaryConfirmation from '@/components/common/secondaryConfirmation';
import ExaminePivot from '../components/examine-pivot';
import ComFormItem from '../../../components/common/com-form-item';
export default {
  components: { secondaryConfirmation, ExaminePivot, ComFormItem },
  props: {
    formId: {
      type: String,
      default: ''
    },
    formBase: {
      type: Object,
      default: () => ({})
    },
    approvalLetter: {
      type: Object,
      default: () => ({})
    },
    applyFormWithPermissions: {
      type: Object,
      default: () => ({})
    },
    rejectOption: {
      type: Array,
      default: () => ([])
    },
    nextStepObj: {
      type: Object,
      default: () => ({})
    },
  },
  data() {
    return {
      disabled: false,
      timeNow: '',
      saveOption: {
        message: '关闭提交弹窗将不保存已修改内容，确定关闭？',
        cancelBtn: '取消',
        confirmBtn: '关闭',
      },
      showClose: false,
      submitReviewDialog: false,
      passlist: [
        { name: '通过', id: true },
        { name: '驳回', id: false },
      ],
      rules: {
        nextUser: [
          { required: true, message: '请选择审批人', trigger: 'change' }
        ],
        prevUser: [
          { required: true, message: '请选择驳回人', trigger: 'change' }
        ],
        reason: [
          { required: true, message: '请选择驳回原因', trigger: 'change' }
        ],
        /*  productEssentials: [
                     { required: true, message: '请选择产品要点', trigger: 'change' },
                 ],
                 reviewPoints: [
                     { required: true, message: '请选择审查要点', trigger: 'change' },
                 ], */
      },
      submission: [],
      increasedIds: {}, // 须在最后提交时移除的
      mousePoint: -1,
      params: {
        isPasses: true,
        reason: '',
        txt: '',
        nextUser: [],
        prevUser: ''
      },
      examineList: [],
      examineInfo: '请选择当前项目是否包含以下要点，不勾选或选择“否”为不包含该要点信息，则会返回至发起人修改并二次会签。'
    }
  },
  watch: {
    submitReviewDialog(val) {
      if (val) {
        this.timeNow = dayjs().format('YYYY-MM-DD HH:mm:ss');
        this.params.isPasses = true;
        if (this.approvalLetter.permissions === 'passAllow') {
          this.submission = (this.approvalLetter.list || []).concat(this.submission || [])
        }
      }
    },
    examineList(val) {
      this.$nextTick(() => {
        this.$refs.refExamine.list = val
      })
    }
  },
  methods: {
    showEdit_collection(i) {
      this.$set(this.submission[i], 'showEdit', true);
      this.$nextTick(() => {
        this.$refs[`input_${i}`][0].focus()
      })
    },
    // 提交结果
    async submit() {
      // 驳回
      if (this.approvalLetter.permissions === 'passNotAllow' && !this.params.isPasses) {
        this.$refs['paramsForm'].validate((valid) => {
          if (valid) {
            this.$emit('submit', {
              ...this.params
            })
          } else {
            return false;
          }
        });
        return;
      }
      const filledInByApproverWithNull = this.applyFormWithPermissions.filledInByApprover.filter(item => item.value.length === 0 && item.props.required)
      if (filledInByApproverWithNull.length) {
        this.$message.error('存在必填项未填写，请填写！')
        return;
      }
      let opinionLetterRecordDtoList = null;
      const editedCommentsDtoList = this.submission.filter(item => !item.associatedAttachmentsIds)
      if (this.approvalLetter.permissions === 'passAllow') {
        opinionLetterRecordDtoList = this.submission.map(item => {
          return {
            ...item,
            content: item.str,
            substantiveOpinions: item.opinion ? 1 : 0
          }
        }) || [];
      } else {
        editedCommentsDtoList.forEach(item => {
          delete item.opinion
        })
      }
      editedCommentsDtoList.forEach(comment => {
        comment.id = this.increasedIds.strIds.includes(comment.id) ? null : comment.id;
        comment.words = comment.words.filter(id => !this.increasedIds.words.includes(id))
      })
      const keyPointsForVerification = this.$refs.refExamine.list?.map(item => {
        item.formItemId = item.id;
        return item;
      })
      const formItemDataList = this.applyFormWithPermissions.filledInByApprover?.map(item => {
        item.formItemId = item.id;
        return item;
      })
      const user = JSON.parse(window.localStorage.getItem('user_name'))
      const data = {
        approvalSubmissionDto: {
          opinionLetterRecordDtoList,
          editedCommentsDtoList,
          keyPointsForVerification,
          formItemDataList,
          formId: this.formId
        },
        processInstanceId: this.formBase.processInstanceId,
        taskId: this.formBase.taskId,
        templateId: this.formBase.processTemplateId,
        currentUserInfo: {
          id: user.id,
          name: user.fullname
        }
      }
      let formValid = true;
      if (this.nextStepObj?.selectObject === '1') {
        this.$refs['paramsForm'].validate((valid) => {
          if (valid) {
            data.nextNodeId = this.nextStepObj.nextNodeId;
            data.nextUserInfo = (this.nextStepObj?.nodeSelectUserList || []).filter(item => this.params.nextUser.includes(item.id))
          } else {
            formValid = false;
            return false;
          }
        });
      }
      if (!formValid) {
        return;
      }
      this.postData(data)
    },
    async postData(data) {
      this.$message.info('提交中，请稍等！')
      this.disabled = true;
      let updateRuleRes = {
        data: {
          status: 200,
          msg: '',
        }
      }
      if (this.nextStepObj?.selectObject === '1') {
        updateRuleRes = await updateRuleCode({
          nextNodeId: data.nextNodeId,
          nextUserInfo: data.nextUserInfo,
          templateId: data.templateId
        }).catch(() => {
          updateRuleRes.data.status = 400;
          this.disabled = false;
        })
      }
      const { status: ruleStatus, msg: ruleMsg } = updateRuleRes.data;
      if (ruleStatus === 200) {
        ocrApprovalSubmission(data).then((res) => {
          this.disabled = false;
          const { status, msg } = res.data;
          if (status === 200) {
            this.$message.success({ offset: 40, message: '审查意见已提交,可在审批中心查看' });
            this.submitReviewDialog = false;
            this.$router.go(-1)
          } else {
            this.$message.error({ offset: 40, message: msg });
          }
        }).catch(() => {
          this.disabled = false;
        })
      } else {
        ruleMsg && this.$message.error({ offset: 40, message: ruleMsg });
      }
    },
    handleClose() {
      this.$refs.confirmation.dialogVisible = true;
    },
    mouseenter(item, index) {
      this.mousePoint = index
    },
    mouseleave() {
      this.mousePoint = -1
    },
    moveTop(index) {
      const copyCrtValue = this.submission[index]
      const copyUpValue = this.submission[index - 1]
      this.$set(this.submission, index, copyUpValue)
      this.$set(this.submission, index - 1, copyCrtValue)
    },
    moveDown(index) {
      const copyCrtValue = this.submission[index]
      const copyNextValue = this.submission[index + 1]
      this.$set(this.submission, index, copyNextValue)
      this.$set(this.submission, index + 1, copyCrtValue)
    },
    del(item, index) {
      this.$confirm('确定删除该条意见吗？', '', {
        customClass: 'confirmBox',
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.submission.splice(index, 1)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    }
  }
}
</script>
<style lang="less" scoped>
/deep/ .submit-review {
    width: 1200px;
    max-height: 682px;
    padding: 40px 60px;
    border-radius: 15px;
    background: #FFF;
    display: flex;
    flex-direction: column;

    .main {
        .examine-title {
            margin-bottom: 16px;
            height: 38px;
            line-height: 38px;
            padding: 0 8px 0 10px;
            border-radius: 4px;
            background: #FFF7E6;
            color: #FA8C16;

            .iconfont {
                position: relative;
                top: 1px;
                margin-right: 8px;
                font-size: 18px;
            }
        }
    }

    .el-dialog__header {
        padding: 0;

        .top-op {
            display: flex;
            justify-content: space-between;
        }

        .flex {
            display: flex;
            align-items: center;

            .title {
                color: #1D2128;
                font-size: 16px;
                font-style: normal;
                font-weight: 700;
                line-height: 36px;
                /* 150% */

            }
        }

        .icon {
            font-size: 34px;
            color: #80A6FF;
            margin-right: 8px;
        }

        .line {
            width: 100%;
            height: 1px;
            background: #E5E6EB;
            margin: 16px 0;
        }

    }

    .el-dialog__body {

        padding: 0;
        height: 90%;
        overflow: auto;

        .el-form {
            .el-form-item__label {
                color: #1D2128;
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
                color: #F76560;
                margin-left: 5px;
                font-size: 16px; //改变星号的大小
            }

            .el-form-item__content {
                border-radius: 4px;
                background: #F7F8FA;
                padding: 0 16px;
            }

            .reviewPoints {
                .el-checkbox {
                    width: 30%;
                }
            }
        }

        .el-radio-group {
            .el-radio__label {
                color: #1D2128;
                text-overflow: ellipsis;
                font-size: 14px;
                font-style: normal;
                font-weight: 400;
                line-height: 22px;
                /* 157.143% */

            }

        }

        .el-checkbox__label {
            color: #1D2128;
            text-overflow: ellipsis;
            font-size: 14px;
            font-style: normal;
            font-weight: 400;
            line-height: 22px;
        }

        .el-checkbox__inner {
            width: 18px;
            height: 18px;
        }

        .title {
            color: #1D2128;
            text-align: center;
            /* 正文/加粗 */
            padding: 16px 0px;
            font-family: Microsoft YaHei;
            font-size: 14px;
            font-style: normal;
            font-weight: 700;
            line-height: 22px;
            /* 157.143% */

        }

        .submission-content {
            padding: 0px 24px;

            .submission-name {
                color: #306EF5;
                font-size: 14px;
                font-style: normal;
                font-weight: 400;
                line-height: 22px;
                /* 157.143% */

            }

            .organization {
                margin-top: 28px;
                color: #1D2128;
                text-align: right;
                font-size: 14px;
                font-style: normal;
                font-weight: 400;
                line-height: 22px;
                /* 157.143% */

            }

            .submission-item:hover {
                border-radius: 4px;
                background: #F7F8FA;
                cursor: pointer;
                padding: 8px 16px;
            }

            .submission-item {
                display: flex;
                padding: 8px 16px;
                cursor: pointer;
                margin: 12px 0;

                .submission-text {
                    width: 80%;
                    display: flex;
                    justify-items: flex-start;

                    .sort {
                        margin-right: 12px;

                    }

                    color: #1D2128;

                    /* 小字号/正文 */
                    font-family: Microsoft YaHei;
                    font-size: 14px;
                    font-style: normal;
                    font-weight: 400;
                    line-height: 22px;
                    margin-right: 4px;
                    /* 157.143% */
                }

                .submission-op {
                    display: flex;
                    align-items: flex-start;
                    flex: 1;
                    justify-content: space-evenly;

                    .opinion {
                        padding: 2px 4px;
                        border-radius: 0px 6px 6px 6px;
                        color: #FFF;
                        font-family: Microsoft YaHei;
                        font-size: 12px;
                        font-style: normal;
                        font-weight: 400;
                        line-height: 20px;
                        /* 166.667% */

                        .icon {
                            width: 16px;
                            height: 16px;
                        }

                    }

                    .no-opinion {
                        border-radius: 0px 6px 6px 6px;
                        background: linear-gradient(90deg, #E85167 0%, #FF8193 100%);

                    }

                    .has-opinion {
                        border-radius: 0px 6px 6px 6px;
                        background: linear-gradient(90deg, #7B61FF 0%, #61A0FF 100%);

                    }

                    .move {
                        font-size: 20px;
                        color: #306EF5;
                    }

                    .del {
                        font-size: 20px;
                        color: #3780F3;
                    }
                }
            }
        }

    }

}

.submit-review .paramsForm {
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
            background: #F7F8FA;
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

.nodata {
    text-align: center;
    color: #86909C;
    padding: 12px;

    p {
        margin-top: 12px;
        font-size: 14px;
        font-weight: 400;
        line-height: 28px;
    }

}
</style>
