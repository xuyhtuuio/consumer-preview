
<template>
  <div class="order-detail">
    <div class="header">
      <slot name="breadcrumb"> </slot>
      <div class="flex pointer">
        <div class="back flex" @click="goback">
          <i class="iconfont icon-fanhui1"></i>
          <i class="btn">返回</i>
        </div>
        <!-- 只有有修改权限的人能看到 -->
        <div class="back flex white" v-if="status == 5 && item.taskStatus == 3" @click="toModify">
          <i class="iconfont icon-xianxingtubiao"></i>
          <i class="btn">去修改</i>
        </div>
        <el-button class="back flex" type="primary" style="border: none;" :loading="loadings.storageLoading"
          @click="submit('storage')" v-if="(status == 3 || status == 5) && item.taskStatus != 3">
          <span class="flex"> <i class="iconfont icon-baocun"></i>
            <i class="btn">保存</i></span>
        </el-button>
        <el-button class="back flex white" type="primary" :loading="loadings.submitLoading" @click="submit('update')"
          v-if="(status == 3 || status == 5) && item.taskStatus != 3">
          <span class="flex"> <i class="iconfont icon-tijiao"></i>
            <i class="btn">确认</i></span>
        </el-button>
        <div v-if="item.taskStatus == 1" class="flex">
          <!-- <div class="back flex" @click="transferDialog = true">
            <i class="iconfont icon-zhuanban1"></i>
            <i class="btn">转办</i>
          </div> -->
          <div class="back flex" v-if="!isOCR" @click="submit('storage')">
            <i class="iconfont icon-baocun"></i>
            <i class="btn">保存</i>
          </div>
          <el-button class="back flex white" type="primary" :loading="loadings.submitLoading" @click="submit('update')"
            v-if="!isOCR">
            <i class="iconfont icon-tijiao"></i>
            <i class="btn">提交</i>
          </el-button>
          <div class="back flex white" @click="toApproval" v-if="isOCR">
            <i class="iconfont icon-yijianshu"></i>
            <i class="btn">审查</i>
          </div>
        </div>
      </div>
    </div>
    <div class="flex" style="align-items: flex-start;   height: calc(100% - 50px);">
      <!-- 左侧工单信息 -->
      <div class="left-info">
        <div class="order-name">
          <svg class="icon urgent-icon" aria-hidden="true" v-if="item.urgent == 1">
            <use xlink:href="#icon-shenpiyemiantubiao"></use>
          </svg>
          <svg class="icon urgent-icon" aria-hidden="true" v-if="item.dismissalMark == 1">
            <use xlink:href="#icon-tongyongtubiao2"></use>
          </svg>
          {{ item.taskName }}
          <span class="order-class tag" v-if="item.formManagementName">{{ item.formManagementName }}</span>
          <span class="event-status">
            <i v-if="item.taskStatus === '0'" class="tag draft">草稿</i>
            <i v-if="item.taskStatus === '1'" class="tag in-approval">审批中<i
                v-if="item.currentActivityName || item.nodeName">>{{
                  item.currentActivityName || item.nodeName }}</i></i>
            <i v-if="item.taskStatus === '2'" class="tag in-approval">撤销<i
                v-if="item.currentActivityName || item.nodeName">>{{
                  item.currentActivityName || item.nodeName }}</i></i>
            <i v-if="item.taskStatus === '3'" class="tag in-modify">待修改<i
                v-if="item.currentActivityName || item.nodeName">>{{
                  item.currentActivityName || item.nodeName }}</i></i>
            <i v-if="item.taskStatus === '5'" class="tag check">待确认<i v-if="item.currentActivityName || item.nodeName">>{{
              item.currentActivityName || item.nodeName }}</i></i>
            <i v-if="item.taskStatus === '4'" class="end">
              <i class="tag end-sign"> 已结束 </i>
            </i>
          </span>
        </div>
        <order-basic-info @preview='previewFile' :personInfo="item.initiator"></order-basic-info>
      </div>
      <div class="right">
        <!-- 消保审查/详情页/审批中预览 -->
        <div class="right-nav">
          <nav class="nav active-nav" v-if="status == 0">
            <span class="active-nav" style="text-align: left">审批记录明细</span>
          </nav>
          <!-- 消保审查/详情页/审批人审批（非消保 -->
          <nav class="nav" v-if="status == 2">
            <span :class="crtComp == 'leaderEditOpinion' ? 'active-nav' : ''" @click="() => {
              crtComp = 'leaderEditOpinion';
            }
              ">编辑意见</span>
            <span :class="crtComp == 'approvalRecordCard' ? 'active-nav' : ''" @click="() => {
              crtComp = 'approvalRecordCard';
            }
              ">审批记录明细</span>
          </nav>
          <nav class="nav" v-if="status == 3">
            <span :class="crtComp == 'approvedOpinionCard' ? 'active-nav' : ''" @click="() => {
              crtComp = 'approvedOpinionCard';
            }
              ">审查意见书</span>
            <!-- <span :class="crtComp == 'uploadFileCard' ? 'active-nav' : ''" @click="() => {
              crtComp = 'uploadFileCard';
            }
              "><i style="color: #eb5757">*</i> 最终上线材料</span> -->
            <span :class="crtComp == 'approvalRecordCard' ? 'active-nav' : ''" @click="() => {
              crtComp = 'approvalRecordCard';
            }
              ">审批记录明细</span>
          </nav>
          <!-- 已经结束-->
          <nav class="nav" v-if="status == 4">
            <span :class="crtComp == 'approvedOpinionCard' ? 'active-nav' : ''" @click="() => {
              crtComp = 'approvedOpinionCard';
            }
              ">审查意见书</span>
            <!-- <span :class="crtComp == 'uploadFileCard' ? 'active-nav' : ''" @click="() => {
              crtComp = 'uploadFileCard';
            }
              "><i style="color: #eb5757">*</i> 最终上线材料</span> -->
            <span :class="crtComp == 'approvalRecordCard' ? 'active-nav' : ''" @click="() => {
              crtComp = 'approvalRecordCard';
            }
              ">审批记录明细</span>
          </nav>
          <nav class="nav" v-if="status == 5">
            <span :class="crtComp == 'approvedOpinionCard' ? 'active-nav' : ''" @click="() => {
              crtComp = 'approvedOpinionCard';
            }
              ">审查意见书</span>
            <span :class="crtComp == 'approvalRecordCard' ? 'active-nav' : ''" @click="() => {
              crtComp = 'approvalRecordCard';
            }
              ">审批记录明细</span>
          </nav>
        </div>
        <div class="right-content">
          <keep-alive exclude="leader-edit-opinion">
            <component :is="crtComp" :status="status" ref="child" :taskStatus="item.taskStatus" :coment="coment"
              @sendOpinionInfo="sendOpinionInfo" :leaderApproveInfo="leaderApproveInfo">
              <template slot="head">
                <div class="approved-opinion-head">
                  <h2>消保审查意见书</h2>
                  <p>
                    <i>拟同意{{ item.taskName }}活动，并提出以下消保审查意见，</i>请您确认是否采纳以下意见：
                  </p>
                </div>
              </template>
              <template slot="foot">
                <div class="approved-opinion-foot">
                  <p>以上为消保审查办公室建议，请酌情考虑。</p>
                  <p style="text-align: right; color: #1d2128; padding: 16px 0">
                    消保审查中心<br />
                    {{ timeNow }}
                  </p>
                </div>
              </template>
            </component>
          </keep-alive>
        </div>
      </div>
    </div>
    <el-dialog :visible.sync="transferDialog" width="800px" center custom-class="transfer-dialog">
      <span slot="title">请选择转办对象</span>
      <div>
        <el-input v-model="staff.keyword" placeholder="搜索人员，支持拼音、姓名">
          <i slot="prefix" class="el-input__icon el-icon-search pointer"></i></el-input>
        <el-radio-group v-model="staff.people" class="trs-scroll">
          <el-radio :label="item.code" v-for="(item, index) in peoples" :key="index">
            <span class="avatar"><img src="@/assets/image/apply-center/avatar.png" alt="" /></span>
            {{ item.name }}</el-radio>
        </el-radio-group>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="transferDialog = false" type="text" class="cancel">取消</el-button>
        <el-button type="text" @click="transferDialog = false" class="submit-btn">确定</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="previewDialog" width="800px" custom-class="preview-dialog">
      <filePreview :url="previewUrl"></filePreview>
    </el-dialog>
  </div>
</template>
<script>
import orderBasicInfo from "@/components/card/order-basic-info.vue";
import leaderEditOpinion from "@/components/card/leader-edit-opinion.vue";
import approvalRecordCard from "@/components/card/approval-record-card.vue";
import approvedOpinionCard from "@/components/card/approved-opinion-card.vue";
import uploadFileCard from "@/components/card/upload-file-card";
import filePreview from '@/components/filePreview'
import { leaderEdit } from '@/api/approvalCenter'
import { updateAdoptEditedComments, updateEditedComments, getTemplatedetail } from '@/api/applyCenter'
import moment from 'moment';
import { set } from 'vue';
export default {
  name: "order-details",
  components: {
    orderBasicInfo,
    approvalRecordCard,
    leaderEditOpinion,
    approvedOpinionCard,
    uploadFileCard,
    filePreview
  },

  data() {
    return {
      loading: false,
      status: 0,
      crtComp: "",
      transferDialog: false,
      staff: {
        keyword: "",
        people: "",
      },
      timeNow: '',
      info: {},
      previewDialog: false,
      previewUrl: '',
      orderBaseInfo: {},
      item: {},
      isOCR: false,
      loadings: {
        submitLoading: false,
        storageLoading: false,
      },
      coment: {},
      personInfo: {},
      leaderApproveInfo: {},//TO_NODE TO_BEFORE
      peoples: [
        { name: "王明明", code: 1 },
        { name: "王明明", code: 2 },
        { name: "王明明", code: 3 },
        { name: "王明明", code: 4 },
        { name: "王明明", code: 5 },
        { name: "王明明", code: 6 },
        { name: "王明明", code: 7 },
      ],
    };
  },
  activated() {
    this.clearStoreStatus()
    this.judgeStatus();
  },
  mounted() {
    if (!this.$route.params.formId) {
      const { path } = this.$route
      const url = path.match(/\/(\S*)\//)[1]
      this.$router.replace({
        name: url
      })
    }
    this.judgeStatus();
  },
  created() { },
  methods: {
    clearStoreStatus() {
      this.$store.commit('setCheckApprovedFormFalse')
    },
    startLoading() { this.loading = true },
    previewFile(url) {
      this.previewDialog = true
      this.previewUrl = url
    },
    toApproval() {
      this.$router.push({
        name: "aiApproval",
        params: { item: this.item }
      });
    },
    async judgeStatus() {
      const { path } = this.$route
      const originRouter = path.match(/\/(\S*)\//)[1]
      // 一般进入详情页：展示返回按钮 及 审批记录详细
      // 已经结束的工单 展示: 返回按钮、审批记录详细、审查意见书、最终上线材
      // <!-- 任务状态（1：审查中 2：待修改 3：待确认 4：已完成 -->
      let { item } = JSON.parse(window.localStorage.getItem("order-detail"));
      const info = JSON.parse(window.localStorage.getItem("order-detail"));
      this.info = info
      this.item = item
      // 草稿
      if (item.taskStatus == '0') {
        this.status = 0;
        this.crtComp = "approvalRecordCard";
        //后期扩展,审批也分好几种类型
      }
      // 工单-审批中状态 主要区分是否OCR审批、部门审批  所有的的节点
      if (item.taskStatus == '1') {
        if (originRouter == 'applycenter') {
          this.status = 0;
          this.crtComp = "approvalRecordCard";
        } else if (originRouter == 'approvalcenter') {
          //区分是否OCR审批还是领导审批  先写死targetPage  LEADER XIAOBAO CONFIRM
          const res = await this.getTemplatedetail()
          this.isOCR = res.targetPage !== 'LEADER'
          !this.isOCR ? (this.status = 2, this.crtComp = "leaderEditOpinion") : (
            this.status = 0,
            this.crtComp = "approvalRecordCard"
          )
          this.$nextTick(() => {
            res.targetPage == 'LEADER' ? this.$refs['child'].initData(res) : ''
          })
        }
      }
      // 工单-状态待修改 
      if (item.taskStatus == '3') {
        this.status = 5;
        this.crtComp = "approvedOpinionCard";
      }
      //  工单-待确认状态
      if (item.taskStatus == '5') {
        // 工单-有实质性意见
        if (item.hasOpinions == 1) {
          this.status = 5;
        } else {
          //工单-无实质性意见
          this.status = 3;
        }
        this.crtComp = "approvedOpinionCard";
      }
      // 工单-已结束状态
      if (item.taskStatus == '4') {
        this.status = 4;
        this.crtComp = "approvedOpinionCard";
      }
    },
    // 获取当前的节点的配置信息
    async getTemplatedetail() {
      let targetPage = ''
      let refuseWay = ''
      let assignedType = ''
      let mode = ''
      let assignedUser = []
      let disavower = []
      const params = {
        processInstanceId: this.item.processInstanceId
      }
      const res = await getTemplatedetail(params)
      if (res.data) {
        const { data } = res.data
        //如果是消保审批，就不用走下面的判断了
        targetPage = data[data.length - 1].props['targetPage']
        refuseWay = data[data.length - 1].props['refuseWay']
        mode = data[data.length - 1].props['mode']
        assignedUser = data[data.length - 1].props['assignedUser']?.filter(v => v.type !== 'dept')?.map(v => v.id)
        if (targetPage !== 'LEADER') {
          return { targetPage, refuseWay, mode, assignedUser }
        }
        //如果是领导审批，走下面的判断
        //驳回人列表处理
        // 发起人
        const { name, id } = this.item['originator']
        const { institutional } = this.item
        const initiator = {
          label: institutional?.[institutional.length - 1],
          name,
          id,
          nodeName: data[0].name,
          targetNodeId: 'root'
        }
        disavower.push(initiator)
        if (data.length > 2) {
          let othersArray = data.slice(1, data.length - 1)
          let other_disavower = []
          for (let i = 0; i < othersArray.length; i++) {
            let arr = othersArray[i].props.assignedUser.map(m => {
              return {
                ...m,
                nodeName: othersArray[i].name,
                targetNodeId: othersArray[i].id
              }
            })
            other_disavower.push(...arr)
            disavower = disavower.concat(other_disavower)
          }
        }
        // 选中通过时的下一级审批人
        let approver = []
        let nextApprovers = data[data.length - 1]?.children?.props?.assignedUser.filter(v => v.type == 'user') || []
        nextApprovers = nextApprovers?.map(v => {
          return {
            ...v,
            nodeName: data[data.length - 1]?.children?.name
          }
        })
        approver = nextApprovers
        assignedType = data[data.length - 1]?.children?.props?.assignedType
        return { targetPage, refuseWay, disavower, approver, assignedType, mode, assignedUser }
      }
    },
    toModify() {
      this.$router.push({
        name: 'editApply',
        params: {
          id: this.item.taskNumber,
          formManagementId: this.item.formManagementId
        }
      })
    },
    goback() {
      // 申请页 正常返回
      if (this.info) {
        const that = this
        // 当前状态属于待确认的 要保存意见书
        if ([2, 3].includes(this.status) || this.item.taskStatus == '5') {
          const { opinionStorage } = this.$store.state.checkApprovedForm
          if (!opinionStorage || !editOpinionStorage) {
            this.$confirm("是否保存已编辑的意见确认信息？", "", {
              customClass: "confirmBox",
              confirmButtonText: "保存",
              cancelButtonText: "不保存",
              type: "warning",
            })
              .then(() => {
                that.status == 2 ? that.saveEditOpinion() : that.saveOpinion()
              })
              .catch(() => {
                this.$router.go(-1);
              });
          }
        } else {
          this.$router.go(-1);
        }
      }
    },
    //保存意见书功能
    saveOpinion() {
      const { approvedOpinionForm } = this.$store.state.checkApprovedForm
      const params = approvedOpinionForm.map(v => {
        return { ...v, cacheFlag: 1 }
      })
      this.loadings.storageLoading = true
      updateEditedComments(params).then(res => {
        const { status } = res.data
        if (status == 200) {
          this.loadings.storageLoading = false
          this.$store.commit('setOpinionStorage', true)
          this.$message.success({ message: '已保存当前意见确认内容' })
        }
      }).catch(() => {
        this.loadings.storageLoading = false
      })

    },
    //保存编辑意见功能
    saveEditOpinion() {
      this.loadings.storageLoading = true
      this.$store.commit('setEditOpinionStorage', true)
      setTimeout(() => {
        this.$message.success({ message: '已保存当前意见确认内容' })
        this.loadings.storageLoading = false
      }, 2000)
    },
    sendOpinionInfo(info) {
      const arr = info[info.length - 1]
      const time = moment(arr.substantiveopinion[arr.substantiveopinion.length - 1].updateTime).format('YYYY-MM-DD HH:mm:ss') || moment('YYYY-MM-DD HH:mm:ss')
      this.timeNow = time
    },
    submit(way) {
      const that = this
      //  待确认的 分有实质性意见和无实质性意见 status:3无/5有
      const { approvedOpinionRequired, uploadFileRequired, editOpinionRequired, editOpinionForm } = this.$store.state.checkApprovedForm
      //保存功能
      if (way == 'storage' && [3, 5].includes(this.status)) {
        this.$confirm("是否保存已编辑的意见确认信息？", "", {
          customClass: "confirmBox",
          confirmButtonText: "保存",
          cancelButtonText: "不保存",
          type: "warning",
        })
          .then(() => {
            that.saveOpinion()
          }).catch((e) => {
          })
        return false
      }
      if (this.status == 2 && way == 'storage') {
        this.$confirm("是否保存已编辑的意见确认信息？", "", {
          customClass: "confirmBox",
          confirmButtonText: "保存",
          cancelButtonText: "不保存",
          type: "warning",
        })
          .then(() => {
            that.saveEditOpinion()
          }).catch((e) => {
          })
        return false

      }
      // 无实质性意见
      if (this.status == 3 && way == 'update') {
        // 有意见书和上线材料
        if (!approvedOpinionRequired) {
          // 审批页定位第一个未输入项
          this.crtComp = 'approvedOpinionCard'
          this.$nextTick(() => {
            this.$refs['child'].checkParam()
          })
          return false
        }
        // 定位上线材料
        // if (!uploadFileRequired) {
        //   this.$message({
        //     type: 'warning',
        //     customClass: 'el-icon-warning-one',
        //     message: '当前未上传最终上线材料，请上传材料后提交'
        //   })
        //   this.crtComp = 'uploadFileCard'
        //   return false
        // }
        // 意见提交
        if (approvedOpinionRequired) {
          if (way == 'update') {
            // 细分已采纳，存在未采纳
            const { approvedOpinionForm } = this.$store.state.checkApprovedForm
            const isAllAccept = approvedOpinionForm.every(v => v.adoptOpinions == 1)
            if (isAllAccept) {
              this.$confirm("当前已采纳所有意见，是否继续提交？", "", {
                customClass: "confirmBox",
                confirmButtonText: "提交",
                cancelButtonText: "取消",
                type: "warning",
              })
                .then(() => {
                  this.loadings.submitLoading = true
                  that.submitOpinion()
                })
                .catch(() => {
                  this.loadings.submitLoading = false
                });
            } else {
              this.$confirm("当前存在不采纳意见，是否继续提交？", "", {
                customClass: "confirmBox",
                confirmButtonText: "提交",
                cancelButtonText: "取消",
                closeOnClickModal: false,
                type: "warning",
              })
                .then(() => {
                  this.loadings.submitLoading = true
                  that.submitOpinion()
                })
                .catch(() => {
                  this.loadings.submitLoading = false
                });
            }
            //上线材料提交
            //保存 给个状态吧
          }
        }
      }
      //有实质性意见
      if (this.status == 5 && way == 'update') {
        // 有意见书
        if (!approvedOpinionRequired) {
          this.crtComp == 'approvedOpinionCard'
          this.$nextTick(() => {
            this.$refs['child'].checkParam()
          })
          return
        }
        // 在这里做提交
        if (approvedOpinionRequired) {
          const { approvedOpinionForm } = this.$store.state.checkApprovedForm
          const isAllAccept = approvedOpinionForm.every(v => v.adoptOpinions == 1)
          if (isAllAccept) {
            this.$confirm("当前已采纳所有“实质意见”，是否继续提交？", "", {
              customClass: "confirmBox",
              confirmButtonText: "提交",
              cancelButtonText: "取消",
              closeOnClickModal: false,
              type: "warning",
            })
              .then(() => {
                this.loadings.submitLoading = true
                that.submitOpinion(true, 1)
              })
              .catch(() => {
                this.loadings.submitLoading = false
              });
          } else {
            this.$confirm("当前存在未采纳的“实质意见”，提交后将会进一步审核，是否继续提交？", "", {
              customClass: "confirmBox",
              confirmButtonText: "提交",
              cancelButtonText: "取消",
              closeOnClickModal: false,
              type: "warning",
            })
              .then(() => {
                this.loadings.submitLoading = true
                that.submitOpinion(true, 0)
              })
              .catch(() => {
                this.loadings.submitLoading = false
              });
          }

        }
      }
      // 审批中状态之领导审批 提交
      if (this.status == 2 && way == 'update') {
        if (!editOpinionRequired) {
          this.crtComp = 'leaderEditOpinion'
          this.$message.error('请在编辑意见后提交')
          return false
        }
        const { mode, assignedUser } = editOpinionForm
        let params = {
          success: editOpinionForm.isAccept == '1',
          taskId: this.item.taskId,
          msg: editOpinionForm.content,
          mode,
          userIds: assignedUser,
        }
        //通过时候，流程配置中下一节点审批人设置时选择“上一审批人选择”，增加选择审批人选择则框
        if (editOpinionForm.isAccept == '1' && editOpinionForm.assignedType == 'SELF_SELECT') {
          params.targetUser = editOpinionForm.crtApprover
        }
        //驳回时候，
        if (editOpinionForm.isAccept == '0') {
          params.reason = editOpinionForm.reason
          params.targetNodeId = editOpinionForm.targetNodeId
          params.targetUser = editOpinionForm.id
        }
        this.loadings.submitLoading = true
        leaderEdit(params).then(res => {
          if (res.status == 200) {
            this.loadings.submitLoading = false
            this.$message.success('审查意见已提交')
            setTimeout(() => {
              this.$router.replace({ name: 'approvalcenter' })
            }, 600)
          }
        }).catch(err => {
          this.loadings.submitLoading = false
          this.$message.error('审查意见提交失败')
        })
      }
    },
    submitOpinion(opinions, type) {
      const that = this
      const { approvedOpinionForm, fileUploadForm } = this.$store.state.checkApprovedForm
      const params = approvedOpinionForm.map(v => {
        return {
          adoptOpinions: v.adoptOpinions,
          notAdoptingReasons: v.notAdoptingReasons,
          recordId: v.recordId,
          substantiveOpinions: v.substantiveOpinions,
          cacheFlag: 0
        }
      })
      if (!opinions) {
        //上传文件的逻辑
      }
      const user = JSON.parse(window.localStorage.getItem('user_name'))
      const submission = []
      const data = {
        approvalSubmissionDto: {
          editedCommentsDtoList: [],
          formId: this.item.recordId
        },
        processInstanceId: this.item.processInstanceId,
        taskId: this.item.taskId,
        currentUserInfo: {
          id: user.id,
          name: user.fullname
        }
      }
      updateAdoptEditedComments(params).then(res => {
        this.loadings.submitLoading = false
        //有实质意见且采纳所以的有实质意见
        if (type && type == 1) {
          this.$confirm("审查意见已确认，请根据审查意见修改提单内容。", "", {
            customClass: "confirmBox",
            confirmButtonText: "去修改",
            cancelButtonText: "知道了",
            closeOnClickModal: false,
            distinguishCancelAndClose: true,
            type: "warning",
          }).then(() => {
            that.toModify()
          }).catch((e) => {
            switch (e) {
              case 'close':
                that.toModify()
                break;
              case 'cancel':
                break;
            }
          })
        } else {
          this.$confirm("审查意见已确认，可在申请中心查看。", "", {
            customClass: "confirmBox",
            cancelButtonText: "知道了",
            showConfirmButton: false,
            closeOnClickModal: false,
            type: "warning",
          }).then(res=>{
            this.$router.replace('/approval-list')
      })
        }
      }).catch(err => {
        this.loadings.submitLoading = false
      })
    }
  },

};
</script>
<style lang="less" scoped>
.order-detail {
  display: flex;
  height: 100%;
  flex-direction: column;
  overflow: hidden;
  width: 100%;

  .header {
    height: 34px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;

    .back {
      align-items: center;
      color: #2d5cf6;
      font-weight: 400;
      line-height: 22px;
      padding: 6px 16px;
      border-radius: 6px;
      background: #fff;
      margin-left: 8px;

      .iconfont {
        font-size: 20px;
        margin-right: 4px;
      }

      .btn {
        font-size: 14px;
      }
    }

    .el-button {
      height: 34px;
    }

    .white {
      color: #fff;
      background: #2d5cf6;
    }
  }

  .left-info {
    flex: 1;
    padding: 20px 24px;
    border-radius: 10px;
    background: #fff;
    height: 100%;
    overflow: auto;

    .order-name {
      color: #1d2128;
      font-size: 14px;
      font-weight: 700;
      line-height: 22px;
      margin-bottom: 17px;

      .icon {
        margin-right: 4px;
      }
    }

    .tag {
      display: inline-block;
      padding: 2px 12px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 400;
      line-height: 20px;
    }

    .order-class {
      background: #f0f6ff;

      color: #2d5cf6;
      margin: 0 4px;
    }

    .event-status {
      display: inline-block;



      .draft {
        background: #f0f6ff;
        color: #2d5cf6;
      }

      .in-approval {
        border-radius: 4px;
        background: #fff7e6;
        color: #fa8c16;
      }

      .check {
        border-radius: 4px;
        background: #e6fffb;
        color: #0da5aa;
      }

      .in-modify {
        background: #fff1f0;
        color: #eb5757;
      }

    }

    .end {
      background: #ecfeec;
      color: #50b142;
    }

    .waitConfirm {
      color: #0da5aa;
      background: #e6fffb;
    }

    .inApproval {
      color: #fa8c16;
      background: #fff7e6;
    }
  }

  .right {

    width: 420px;
    margin-left: 16px;
    padding: 22px 20px 20px 20px;
    display: inline-block;
    border-radius: 10px;
    background: #fff;
    height: 100%;
    overflow: hidden;

    .right-nav {
      height: 53px;
    }

    .right-content {
      height: calc(100% - 53px);
      overflow: auto;
    }


    .nav {
      padding: 2px 0px;
      padding-bottom: 12px;
      border-bottom: 1px dashed #e5e6eb;
      margin-bottom: 16px;
      display: flex;
      font-size: 14px;
      line-height: 22px;

      span {
        flex: 1;
        text-align: center;
        cursor: pointer;
      }
    }

    .active-nav {
      font-style: normal;
      font-weight: 700;

      color: #2d5cf6;
    }
  }

  .approved-opinion-head {
    h2 {
      color: #1d2128;
      text-align: center;
      font-size: 14px;
      font-weight: 700;
      line-height: 22px;
      margin-bottom: 12px;
    }

    p {
      color: #505968;
      font-size: 14px;
      font-weight: 400;
      line-height: 22px;
      margin-bottom: 12px;

      i {
        color: #2d5cf6;
      }
    }
  }

  .approved-opinion-foot {
    p {
      font-weight: 400;
      line-height: 22px;
      font-size: 14px;
      color: #306ef5;
    }
  }

  /deep/ .transfer-dialog {
    border-radius: 10px;
    background: #fff;
    padding: 40px 60px;
    /* 阴影/大 */
    box-shadow: 0px 0px 10px 0px rgba(67, 67, 67, 0.1);

    .el-dialog__header {
      padding: 0;
      color: var(--gray-gray-9, #1d2128);
      text-align: center;

      /* 二级标题/加粗 */
      font-family: Microsoft YaHei;
      font-size: 16px;
      font-style: normal;
      font-weight: 700;
      line-height: 24px;

      /* 150% */
      .el-dialog__headerbtn {
        right: 60px;
        top: 40px;
        font-size: 20px;
        color: #505968;
      }
    }

    .el-dialog__body {
      margin: 16px 0;
      padding: 0;
      width: 100%;
      padding: 16px;
      border-radius: 4px;
      border: 1px solid var(--gray-gray-4, #e5e6eb);

      .el-input {
        width: 100%;
        border-radius: 4px;
        margin-bottom: 8px;

        .el-input__inner {
          border: 1px solid var(--gray-gray-4, #e5e6eb);
          background: var(--gray-gray-1, #fff);
        }
      }

      .el-radio-group {
        display: flex;
        flex-direction: column;
        height: 284px;
        overflow-y: auto;

        .el-radio {
          padding: 6px 12px;
          margin-bottom: 4px;
          font-weight: 400;

          .avatar {
            width: 32px;
            height: 32px;
            display: inline-block;
            background: #e8faf7;
            border-radius: 50%;
            margin: 0 8px;

            img {
              width: 100%;
              height: 100%;
            }
          }
        }
      }
    }

    .el-dialog__footer {
      .el-button {
        width: 140px;
        padding: 6px 16px;
        border-radius: 6px;
        border: 1px solid #e5e6eb;
        background: #fff;
        color: #1d2128;
        text-align: center;
        font-size: 14px;
        font-weight: 400;
        line-height: 24px;
      }

      .submit-btn {
        border-radius: 6px;
        background: #2d5cf6;
        font-weight: 700;
        font-size: 14px;
        color: #fff;
      }
    }
  }


}
</style>
<style lang="less">
.preview-dialog {
  .el-dialog__body {
    height: 76vh;
  }
}
</style>