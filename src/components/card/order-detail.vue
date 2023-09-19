<!--
 * @Author: nimeimix huo.linchun@trs.com.cn
 * @Date: 2023-08-29 13:49:23
 * @LastEditors: nimeimix huo.linchun@trs.com.cn
 * @LastEditTime: 2023-09-18 16:31:25
 * @FilePath: /consumer-preview/src/components/card/order-detail.vue
 * @Description: 左侧：工单详细信息   右侧：工单处于不同状态下，会回显不同的信息
-->

<template>
  <div class="order-detail">
    <!-- 头部 -按钮区域 -->
    <div class="header">
      <slot name="breadcrumb"> </slot>
      <div class="flex pointer">
        <div class="back flex" @click="goback">
          <i class="iconfont icon-fanhui1"></i>
          <i class="btn">返回</i>
        </div>
        <!-- 只有有修改权限的人能看到 -->
        <div v-if="((pagePath== 'approval'&&item?.approvedSign==0)||pagePath=='apply')&&hasAuth" class="flex">
        <div
          class="back flex white"
          v-if="status == 5 && item.taskStatus == 3"
          @click="toModify"
        >
          <i class="iconfont icon-xianxingtubiao"></i>
          <i class="btn">去修改</i>
        </div>
        <el-button
          class="back flex"
          type="primary"
          style="border: none"
          :loading="loadings.storageLoading"
          @click="turnTo"
          v-if="nextStepObj.isChangeHandle !== null"
        >
          <span class="flex">
            <i class="iconfont icon-baocun"></i> <i class="btn">转办</i></span
          >
        </el-button>
        <el-button
          class="back flex"
          type="primary"
          style="border: none"
          :loading="loadings.storageLoading"
          @click="submit('storage')"
          v-if="(status == 3 || status == 5) && item.taskStatus != 3"
        >
          <span class="flex">
            <i class="iconfont icon-baocun"></i> <i class="btn">保存</i></span
          >
        </el-button>
        <el-button
          class="back flex white"
          type="primary"
          :loading="loadings.submitLoading"
          @click="submit('update')"
          v-if="(status == 3 || status == 5) && item.taskStatus != 3"
        >
          <span class="flex">
            <i class="iconfont icon-tijiao"></i> <i class="btn">确认</i></span
          >
        </el-button>
        <el-button
          class="back flex white"
          type="primary"
          @click="compare"
          v-if="item.taskStatus == 6"
        >
          <span class="flex">
            <i class="iconfont icon-tijiao"></i> <i class="btn">去比对</i></span
          >
        </el-button>
      </div>
        <div
          v-if="item.taskStatus == 1 && pagePath && pagePath == 'approval'&&item?.approvedSign==0"
          class="flex"
        >
          <!-- <div class="back flex" @click="transferDialog = true">
            <i class="iconfont icon-zhuanban1"></i>
            <i class="btn">转办</i>
          </div> -->
          <el-button
            class="back flex"
            style="border: none"
            v-if="!isOCR"
            :loading="loadings.storageLoading"
            @click="submit('storage')"
          >
            <span class="flex">
              <i class="iconfont icon-baocun"></i> <i class="btn">保存</i></span
            >
          </el-button>
          <el-button
            class="back flex white"
            type="primary"
            :loading="loadings.submitLoading"
            @click="submit('update')"
            v-if="!isOCR"
          >
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
    <div
      class="flex"
      style="align-items: flex-start; height: calc(100% - 50px)"
    >
      <!-- 左侧工单信息 -->
      <div class="left-info">
        <div class="order-name">
          <svg
            class="icon urgent-icon"
            aria-hidden="true"
            v-if="item.urgent == 1"
          >
            <use xlink:href="#icon-shenpiyemiantubiao"></use>
          </svg>
          <svg
            class="icon urgent-icon"
            aria-hidden="true"
            v-if="item.dismissalMark == 1"
          >
            <use xlink:href="#icon-tongyongtubiao2"></use>
          </svg>
          {{ item.taskName }}
          <span class="order-class tag" v-if="item.formManagementName">{{
            item.formManagementName
          }}</span>
          <span class="event-status">
            <i v-if="item.taskStatus === '0'" class="tag draft">草稿</i>
            <i v-if="item.taskStatus === '1'" class="tag in-approval"
              >审批中<i v-if="item.currentActivityName || item.nodeName"
                >>{{ item.currentActivityName || item.nodeName }}</i
              ></i
            >
            <i v-if="item.taskStatus === '2'" class="tag in-approval"
              >撤销<i v-if="item.currentActivityName || item.nodeName"
                >>{{ item.currentActivityName || item.nodeName }}</i
              ></i
            >
            <i v-if="item.taskStatus === '3'" class="tag in-modify"
              >待修改<i v-if="item.currentActivityName || item.nodeName"
                >>{{ item.currentActivityName || item.nodeName }}</i
              ></i
            >
            <i v-if="item.taskStatus === '5'" class="tag check"
              >待确认<i v-if="item.currentActivityName || item.nodeName"
                >>{{ item.currentActivityName || item.nodeName }}</i
              ></i
            >
            <i v-if="item.taskStatus === '6'" class="tag check"
              >待比对<i v-if="item.currentActivityName || item.nodeName"
                >>{{ item.currentActivityName || item.nodeName }}</i
              ></i
            >
            <i v-if="item.taskStatus === '4'" class="end">
              <i class="tag end-sign"> 已结束 </i>
            </i>
          </span>
        </div>
        <order-basic-info
          @preview="previewFile"
          :personInfo="item.initiator"
          :personOrg = 'item.institutional'
          @sendReviewMaterials="sendReviewMaterials"
          @sendFilledInByApprover="sendFilledInByApprover"
        ></order-basic-info>
      </div>
      <div class="right">
        <!-- 消保审查/详情页/审批中预览 -->
        <div class="right-nav">
          <nav class="nav active-nav" v-if="status == 0">
            <span class="active-nav" style="text-align: left"
              >审批记录明细</span
            >
          </nav>
          <!-- 消保审查/详情页/审批人审批（非消保 -->
          <nav class="nav" v-if="status == 2">
            <span
              :class="crtComp == 'leaderEditOpinion' ? 'active-nav' : ''"
              @click="
                () => {
                  crtComp = 'leaderEditOpinion'
                }
              "
              >编辑意见</span
            >
            <span
              :class="crtComp == 'approvalRecordCard' ? 'active-nav' : ''"
              @click="
                () => {
                  crtComp = 'approvalRecordCard'
                }
              "
              >审批记录明细</span
            >
          </nav>
          <nav class="nav" v-if="status == 3">
            <span
              :class="crtComp == 'approvedOpinionCard' ? 'active-nav' : ''"
              @click="
                () => {
                  crtComp = 'approvedOpinionCard'
                }
              "
              >审查意见书</span
            >
            <span
              :class="crtComp == 'uploadFileCard' ? 'active-nav' : ''"
              @click="
                () => {
                  crtComp = 'uploadFileCard'
                }
              "
              ><i style="color: #eb5757">*</i> 最终上线材料</span
            >
            <span
              :class="crtComp == 'approvalRecordCard' ? 'active-nav' : ''"
              @click="
                () => {
                  crtComp = 'approvalRecordCard'
                }
              "
              >审批记录明细</span
            >
          </nav>
          <!-- 已经结束-->
          <nav class="nav" v-if="status == 4">
            <span
              :class="crtComp == 'approvedOpinionCard' ? 'active-nav' : ''"
              @click="
                () => {
                  crtComp = 'approvedOpinionCard'
                }
              "
              >审查意见书</span
            >
            <span
              :class="crtComp == 'uploadFileCard' ? 'active-nav' : ''"
              @click="
                () => {
                  crtComp = 'uploadFileCard'
                }
              "
              ><i style="color: #eb5757">*</i> 最终上线材料</span
            >
            <span
              :class="crtComp == 'approvalRecordCard' ? 'active-nav' : ''"
              @click="
                () => {
                  crtComp = 'approvalRecordCard'
                }
              "
              >审批记录明细</span
            >
          </nav>
          <nav class="nav" v-if="status == 5">
            <span
              :class="crtComp == 'approvedOpinionCard' ? 'active-nav' : ''"
              @click="
                () => {
                  crtComp = 'approvedOpinionCard'
                }
              "
              >审查意见书</span
            >
            <span
              :class="crtComp == 'approvalRecordCard' ? 'active-nav' : ''"
              @click="
                () => {
                  crtComp = 'approvalRecordCard'
                }
              "
              >审批记录明细</span
            >
          </nav>
        </div>
        <div class="right-content">
          <keep-alive>
            <component
              :is="crtComp"
              :status="status"
              ref="child"
              :taskStatus="item.taskStatus"
              @sendOpinionInfo="sendOpinionInfo"
              :reviewMaterial="reviewMaterials"
              :processInstanceId="item.processInstanceId"
              :taskId="item.taskId"
              @preview="previewFile"
              :filledInByApprover="filledInByApprover"
            >
              <template slot="head">
                <div class="approved-opinion-head">
                  <h2>消保审查意见书</h2>
                  <p>
                    <i>拟同意该申请项目，并提出以下消保审查意见，</i
                    >请您确认是否采纳以下意见：
                  </p>
                </div>
              </template>
              <template slot="foot">
                <div class="approved-opinion-foot">
                  <p>以上为消保审查办公室建议，请酌情考虑。</p>
                  <p style="color: #505968; margin-top: 12px; text-indent: 2em">
                    送审单位应落实消费者权益保护审查工作主体责任，并根据业务实际情况决定意见采纳情况。活动过程之中，应紧密监控开展情况，优化服务流程，提升客户体验，妥善处理客户投诉，并及时向消保部门反馈。敬请知悉。
                  </p>
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
    <el-dialog
      :visible.sync="transferDialog"
      width="800px"
      center
      custom-class="transfer-dialog"
    >
      <span slot="title">请选择转办对象</span>
      <div>
        <el-input
          v-model="staff.keyword"
          placeholder="搜索人员，支持拼音、姓名"
        >
          <i slot="prefix" class="el-input__icon el-icon-search pointer"></i
        ></el-input>
        <el-radio-group v-model="staff.people" class="trs-scroll">
          <el-radio
            :label="item.code"
            v-for="(item, index) in peoples"
            :key="index"
          >
            <span class="avatar"
              ><img src="@/assets/image/apply-center/avatar.png" alt=""
            /></span>
            {{ item.name }}</el-radio
          >
        </el-radio-group>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="transferDialog = false" type="text" class="cancel"
          >取消</el-button
        >
        <el-button
          type="text"
          @click="transferDialog = false"
          class="submit-btn"
          >确定</el-button
        >
      </span>
    </el-dialog>
    <el-dialog
      :visible.sync="previewDialog"
      width="800px"
      custom-class="preview-dialog"
    >
      <filePreview :url="previewUrl"></filePreview>
    </el-dialog>
    <SubmitDialog
      :option="nextStepObj?.selectObject === '1' ? optionOther : option"
      :nextStepObj="nextStepObj"
      ref="confirmation"
      @handleConfirm="endTaskSubmit"
      :disabled="disabled"
    ></SubmitDialog>
    <TurnDialog ref="turnDialog" :formBase="item" :nextStepObj="nextStepObj"></TurnDialog>
  </div>
</template>
<script>
// eslint-disable-next-line
import * as dayjs from 'dayjs'
import orderBasicInfo from '@/components/card/order-basic-info'
import leaderEditOpinion from '@/components/card/leader-edit-opinion'
import approvalRecordCard from '@/components/card/approval-record-card'
import approvedOpinionCard from '@/components/card/approved-opinion-card'
import uploadFileCard from '@/components/card/upload-file-card'
import filePreview from '@/components/filePreview'
import SubmitDialog from '@/components/common/submit-dialog'
import TurnDialog from '@/components/common/turn-dialog'
import { leaderEdit, finalMaterial } from '@/api/approvalCenter'
import { updateRuleCode, rollback, getNextUserOption } from '@/api/aiApproval';

import {
  updateAdoptEditedComments,
  updateEditedComments,
  getTemplatedetail
} from '@/api/applyCenter'
export default {
  name: 'order-details',
  components: {
    orderBasicInfo,
    approvalRecordCard,
    leaderEditOpinion,
    approvedOpinionCard,
    uploadFileCard,
    filePreview,
    SubmitDialog,
    TurnDialog
  },
  props: {
    pagePath: {
      // 用于判断展示申请单详情还是审批单详情
      type: String,
      default: ''
    }
  },
  data() {
    return {
      status: 0,
      crtComp: '',
      item: {},
      transferDialog: false,
      staff: {
        // 转办功能用的
        keyword: '',
        people: ''
      },
      timeNow: '',
      info: {},
      previewDialog: false,
      previewUrl: '',
      orderBaseInfo: {},
      isOCR: false,
      loadings: {
        // 点击保存、确认时候的loading状态
        submitLoading: false,
        storageLoading: false
      },
      reviewMaterials: [], // 工单上已上传的文件
      filledInByApprover: [], // 审批模块配置项目
      hasAuth: false, // 是否有权限
      peoples: [
        { name: '王明明', code: 1 },
        { name: '王明明', code: 2 },
        { name: '王明明', code: 3 },
        { name: '王明明', code: 4 },
        { name: '王明明', code: 5 },
        { name: '王明明', code: 6 },
        { name: '王明明', code: 7 }
      ],
      nextStepObj: {
        // 提交： selectObject：1 上一审批选择，nodeSelectUserList
        // 驳回：  "refuseWay": "TO_BEFORE" ： 调回指定节点  nodeSelectList
        nextNodeName: '',
        selectObject: '',
        nodeSelectUserList: [],
        refuseWay: '',
        nodeSelectList: [],
        isChangeHandle: null
      },
      option: {
        message: '确认结束后该申请单结束流转，不可再进行修改',
        cancelBtn: '取消',
        confirmBtn: '确认',
        noClose: true
      },
      optionOther: {
        message: '采纳后该申请单进入下一审批阶段，不可再进行修改',
        cancelBtn: '取消',
        confirmBtn: '确认',
        noClose: true
      },
      disabled: false,
    }
  },
  mounted() {
    if (!this.$route.params.formId) {
      const { path } = this.$route
      const url = path.match(/\/(\S*)\//)[1]
      this.$router.replace({
        name: url
      })
      return
    }
    this.clearStoreStatus()
    this.judgeStatus()
  },
  created() {
  },
  methods: {
    turnTo() {
      this.$refs.turnDialog.turnDialog = true;
    },
    /**
     * description:  store置为默认值
     * return {*}
     */
    clearStoreStatus() {
      this.$store.commit('setCheckApprovedFormFalse')
    },
    // 获取  下一审批人列表
    getNextUserOption() {
      getNextUserOption({
        nodeId: this.item.nodeId,
        templateId: this.item.processTemplateId,
        processInstanceId: this.item.processInstanceId
        // bool: 'Y'
      }).then((res) => {
        const { data, status } = res.data
        const keys = Object.keys(data || {})
        if (status === 200 && keys.length) {
          this.nextStepObj = data
        }
      })
    },
    async endTaskSubmit(val) {
      this.$message.info('提交中，请稍等！')
      this.disabled = true
      let updateRuleRes = {
        data: {
          status: 200,
          msg: ''
        }
      }
      const data = {};
      if (this.nextStepObj?.selectObject === '1') {
        data.nextNodeId = this.nextStepObj.nextNodeId
        data.nextUserInfo = (this.nextStepObj?.nodeSelectUserList || []).filter(
          (item) => val.includes(item.id)
        )
      }

      updateRuleRes = await updateRuleCode({
        nextNodeId: this.nextStepObj?.selectObject === '1' ? data.nextNodeId : '',
        nextUserInfo: this.nextStepObj?.selectObject === '1' ? data.nextUserInfo : [],
        templateId: this.item.processTemplateId,
        processInstanceId: this.item.processInstanceId,
        nodeId: this.item.nodeId
      }).catch(() => {
        updateRuleRes.data.status = 400
        this.disabled = false
      })
      const { status: ruleStatus } = updateRuleRes.data;
      if (ruleStatus === 200) {
        this.submitOpinion();
      }
    },
    /**
     * description: 打开弹窗，预览文件
     * param {*} url
     * return {*}
     */
    previewFile(url) {
      this.previewDialog = true
      this.previewUrl = url
    },
    /**
     * @description: 去 OCR 审查页面
     * @return {*}
     */
    toApproval() {
      this.$router.push({
        name: 'aiApproval',
        params: { item: this.item }
      })
    },
    /**
     * @description: 从左侧详情接口拿到-该申请单-的已上传文件，用于上线最终材料关联
     * @return {*}
     */
    sendReviewMaterials(val) {
      this.reviewMaterials = val
    },
    /**
     * @description: 从左侧详情获取到的有关领导审批自定义字段
     * @return {*}
     */
    sendFilledInByApprover(val) {
      this.filledInByApprover = val
    },
    /**
     * @description: 刚进入详情页，对单子的状态进行判断，用于页面展示不同的要素
     * @return {*}
     */
    async judgeStatus() {
      const { path } = this.$route
      const originRouter = path.match(/\/(\S*)\//)[1]
      // 一般进入详情页只：展示返回按钮 及 审批记录详细
      const { item } = JSON.parse(window.localStorage.getItem('order-detail'))
      const info = JSON.parse(window.localStorage.getItem('order-detail'))
      this.info = info
      this.item = item
      // 抄送功能，能看不能做其他操作 判断一下是否已经审批过
      if (this.pagePath === 'approval' && item.taskStatus !== '4') {
        let { currentProcessor } = this.item
        currentProcessor = currentProcessor?.map((v) => {
          return Object.keys(v)[0]
        })
        const { id } = JSON.parse(window.localStorage.getItem('user_name'))
        const hasAuth = currentProcessor?.includes(id + '') || false
        this.hasAuth = hasAuth
        if (!hasAuth) {
          this.status = 0
          this.crtComp = 'approvalRecordCard'
          return
        }
      }
      // 工单状态: 草稿 待比对  taskStatus为6时，右上角增加去比对按钮
      if (['0', '6'].includes(item.taskStatus) || item.approvedSign === 1) {
        this.status = 0
        this.crtComp = 'approvalRecordCard'
        return
      }
      // 工单-审批中状态 主要区分是否OCR审批、部门审批
      if (item.taskStatus === '1') {
        // 详情页区分来源：申请列表or审批列表
        if (originRouter === 'applycenter') {
          this.status = 0
          this.crtComp = 'approvalRecordCard'
        } else if (originRouter === 'approvalcenter') {
          // OCR审批或领导审批 由targetPage确认【 LEADER XIAOBAO 】  注：targetPage：[‘线上比对’ ，taskStatus=6，不在此判断]、[确认 taskStatus=5，也不在此判断]
          const res = await this.getTemplatedetail()
          this.isOCR = res.targetPage !== 'LEADER'
          !this.isOCR
            ? ((this.status = 2), (this.crtComp = 'leaderEditOpinion'))
            : ((this.status = 0), (this.crtComp = 'approvalRecordCard'))
          this.$nextTick(() => {
            res.targetPage === 'LEADER' ? this.$refs['child'].initData(res) : ''
          })
        }
      }
      // 工单-状态待修改
      if (item.taskStatus === '3') {
        this.status = 5
        this.crtComp = 'approvedOpinionCard'
      }
      //  工单-待确认状态
      if (item.taskStatus === '5') {
        // this.getNextUserOption()
        // 工单-有实质性意见 status=5 ；无实质性意见：status=3，有无实质意见的区别在页面上表现为：是否要上传最终上线材料
        this.status = item.substantiveOpinions === 1 ? 5 : 3
        this.crtComp = 'approvedOpinionCard'
      }
      // 工单-已结束状态  页面回显: 返回按钮、审批记录详细、审查意见书、最终上线材
      if (item.taskStatus === '4') {
        this.status = 4
        this.crtComp = 'approvedOpinionCard'
      }
      this.getNextUserOption()
    },
    /**
     * @description: 获取申请单的所有节点信息，从root根节点一直到下一节点
     * @return {*}
     */
    async getTemplatedetail() {
      // 要传递给编辑意见组件的字段 ---start
      let targetPage = ''
      let refuseWay = ''
      let assignedType = ''
      let assignedUser = []
      let disavower = []
      const { taskId, formId, processInstanceId } = this.item
      // 要传递给编辑意见组件的字段 ---end
      const params = {
        processInstanceId: this.item.processInstanceId
      }
      const res = await getTemplatedetail(params)
      if (res.data) {
        const { data } = res.data
        targetPage = data[data.length - 1].props['targetPage']
        refuseWay = data[data.length - 1].props['refuseWay']
        assignedUser = data[data.length - 1].props['assignedUser']?.map((v) => v.id)

        if (targetPage === 'XIAOBAO') {
          // 如果是ocr审批,页面显示无需太多内容
          return { targetPage, refuseWay, assignedUser, taskId, formId }
        }
        // 如果是领导审批，走下面的判断
        // 1、获取驳回人列表 disavower  1.1 第一个节点是发起人initiator
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
        // 1.2 该接口返回当前流程的所有的节点[node_1,node_2,node_3...],
        //    arr[0]虽然是发起节点，但是发起人信息要从该工单详情里获取，不通过 arr[0]，原因好像是手动加 targetNodeId='root'
        //    arr[arr.length-1]为当前节点，不能驳回到当前节点，因此要获取 1～arr.length-1之间的节点assignedUser信息
        if (data.length > 2) {
          const othersArray = data.slice(1, data.length - 1)
          // eslint-disable-next-line
          let other_disavower = []
          for (let i = 0; i < othersArray.length; i++) {
            const arr = othersArray[i].props?.assignedUser?.map((m) => {
              return {
                ...m,
                nodeName: othersArray[i].name,
                targetNodeId: othersArray[i].id
              }
            }) || []
            other_disavower.push(...arr)
            disavower = disavower.concat(other_disavower)
          }
        }
        // 2.选中通过时的下一级审批人
        let approver = []
        let nextApprovers = data[data.length - 1]?.children?.props?.assignedUser.filter((v) => v.type === 'user') || []
        nextApprovers = nextApprovers?.map((v) => {
          return {
            ...v,
            nodeName: data[data.length - 1]?.children?.name
          }
        })
        approver = nextApprovers
        assignedType = data[data.length - 1]?.children?.props?.assignedType
        return {
          targetPage,
          refuseWay,
          disavower,
          approver,
          assignedType,
          assignedUser,
          taskId,
          processInstanceId,
          formId
        }
      }
    },
    /**
     * @description: 去修改
     * @return {*}
     */
    toModify() {
      this.$router.push({
        name: 'editApply',
        params: {
          ...this.item,
          id: this.item.taskNumber,
          formManagementId: this.item.formManagementId
        }
      })
    },
    /**
     * description: 待比对状态，去比对页面
     * return {*}
     */
    compare() {
      this.$router.push({
        name: 'compare',
        params: { item: this.item }
      })
    },
    /**
     * description: 页面右上角返回功能
     * return {*}
     */
    goback() {
      const that = this
      // 当前审核模块页面显示为领导审批的或者工单处于待确认的，点击返回的时候，要弹窗提示是否保存当前的操作
      if ([2, 3].includes(this.status) || this.item.taskStatus === '5') {
        const { opinionStorage, editOpinionStorage } = this.$store.state.checkApprovedForm
        if (!opinionStorage || !editOpinionStorage) {
          this.$confirm('是否保存已编辑的意见确认信息？', '', {
            customClass: 'confirmBox',
            confirmButtonText: '保存',
            cancelButtonText: '不保存',
            type: 'warning'
          })
            .then(() => {
              //  2：编辑意见   3：待确认模块
              that.status === 2
                ? that.saveEditOpinion(true)
                : that.saveOpinion()
            })
            .catch(() => {
              this.$router.go(-1)
            })
        }
      } else {
        this.$router.go(-1)
      }
    },
    /**
     * @description:意见书-保存
     * @return {*}
     */
    saveOpinion() {
      const { approvedOpinionForm } = this.$store.state.checkApprovedForm
      const params = approvedOpinionForm.map((v) => {
        return { ...v, cacheFlag: 1 }
      })
      this.loadings.storageLoading = true
      updateEditedComments(params)
        .then((res) => {
          const { status } = res.data
          if (status === 200) {
            this.loadings.storageLoading = false
            this.$store.commit('setOpinionStorage', true)
            this.$message.success({ message: '已保存当前意见确认内容' })
          }
        })
        .catch(() => {
          this.loadings.storageLoading = false
        })
    },

    /**
     * @description: 编辑意见-保存、提交
     * @param {*} isSave  true为保存，false提交
     * @return {*}
     */
    saveEditOpinion(isSave) {
      const that = this
      const { editOpinionForm } = this.$store.state.checkApprovedForm
      const { assignedUser } = editOpinionForm
      // eslint-disable-next-line
      const params = {
        // eslint-disable-next-line
        isSave: isSave ? isSave : false, // 区分保存还是提交
        success: editOpinionForm.isAccept === '1',
        taskId: this.item.taskId,
        msg: editOpinionForm.content,
        userIds: assignedUser,
        processInstanceId: this.item.processInstanceId,
        formId: editOpinionForm.formId,
        formItemDataList: editOpinionForm.editOpinionForm,
        templateId: this.item.processTemplateId
      }
      // 通过时候，流程配置中下一节点审批人设置时选择“上一审批人选择”，增加选择审批人选择则框
      if (
        editOpinionForm.isAccept === '1' && editOpinionForm.assignedType === 'SELF_SELECT'
      ) {
        params.targetUser = editOpinionForm.crtApprover
      }
      // 驳回并且是提交，调用新的接口
      if (editOpinionForm.isAccept === '0' && !isSave) {
        that.leaderReject(isSave, editOpinionForm)
      } else {
        // 驳回保存的话，还用之前的接口
        if (editOpinionForm.isAccept === '0') {
          params.reason = editOpinionForm.reason
          params.targetNodeId = editOpinionForm.targetNodeId
          params.targetUser = editOpinionForm.id
        }
        // eslint-disable-next-line
        const end_submit = {
          ...params,
          comments: params
        }
        isSave
          ? (this.loadings.storageLoading = true)
          : (this.loadings.submitLoading = true)
        leaderEdit(end_submit)
          .then((res) => {
            const { success, msg } = res.data
            if (success) {
              if (isSave) {
              // 保存-------start
                this.loadings.storageLoading = false
                this.$store.commit('setEditOpinionStorage', true)
                this.$message.success('审查意见已保存')
                setTimeout(() => {
                  this.$router.replace({ name: 'approvalcenter' })
                }, 600)
              // 保存---------end
              } else {
              // 提交-------start
                this.loadings.submitLoading = false
                this.$message.success('审查意见已提交')
                setTimeout(() => {
                  this.$router.replace({ name: 'approvalcenter' })
                }, 600)
              // 提交-------end
              }
            } else {
              this.loadings.submitLoading = false
              this.$message.error(msg)
            }
          })
          .catch(() => {
            if (isSave) {
              this.loadings.storageLoading = false
              this.$message.error('审查意见保存失败')
            } else {
              this.loadings.submitLoading = false
              this.$message.error('审查意见提交失败')
            }
          })
      }
    },
    /**
     * @description: 领导审批驳回
     * @return {*}
     */
    async leaderReject(isSave, editOpinionForm) {
      let updateRuleRes = {
        data: {
          status: 200,
          msg: '',
        }
      }
      updateRuleRes = await updateRuleCode({
        rollbackId: editOpinionForm.targetNodeId,
        nextUserInfo: [{
          id: editOpinionForm.refuseWay === 'TO_BEFORE' ? editOpinionForm.id : ''
        }],
        templateId: this.item.processTemplateId,
        processInstanceId: this.item.processInstanceId,
        nodeId: this.item.nodeId
      }).catch(() => {
        updateRuleRes.data.status = 400;
      })
      const user = JSON.parse(window.localStorage.getItem('user_name'))
      const data = {
        comments: `${editOpinionForm.reason}${editOpinionForm.content?.trim() ? '-' + editOpinionForm.content : ''}`,
        currentUserInfo: {
          id: user.id,
          name: user.name
        },
        processInstanceId: this.item.processInstanceId,
        rollbackId: editOpinionForm.refuseWay === 'TO_BEFORE' ? editOpinionForm.id : '',
        nodeId: this.item.nodeId,
        taskId: this.item.taskId,
        templateId: this.item.processTemplateId
      }
      const { status: ruleStatus } = updateRuleRes.data;
      if (ruleStatus === 200) {
        rollback(data).then((res) => {
          const { status, msg } = res.data;
          if (status === 200) {
            this.$message.success('操作成功！');
            this.$router.go(-1)
            isSave ? this.loadings.storageLoading = false : this.loadings.submitLoading = false
          } else {
            this.$message.error({ offset: 40, message: msg });
            isSave ? this.loadings.storageLoading = false : this.loadings.submitLoading = false
          }
        }).catch(() => {
          isSave ? this.loadings.storageLoading = false : this.loadings.submitLoading = false
        })
      }
    },

    /**
     * description: 用于审查意见书显示最下面的时间
     * param {*} info
     * return {*}
     */
    sendOpinionInfo(info) {
      const arr = info[info.length - 1]
      const time = dayjs(arr?.substantiveopinion[arr.substantiveopinion.length - 1].createTime).format('YYYY-MM-DD HH:mm:ss') || dayjs().format('YYYY-MM-DD HH:mm:ss')
      this.timeNow = time
    },
    /**
     * description: 合并右上角的保存、提交功能，
     * param {*} way  storage 保存，update：提交
     * return {*}
     */
    submit(way) {
      const that = this
      const { approvedOpinionRequired, uploadFileRequired, uploadFileRadio } = this.$store.state.checkApprovedForm
      // 保存功能  待确认的工单  分有实质性意见和无实质性意见 status:3无 /5有
      if (way === 'storage' && [3, 5].includes(this.status)) {
        this.$confirm('是否保存已编辑的意见确认信息？', '', {
          customClass: 'confirmBox',
          confirmButtonText: '保存',
          cancelButtonText: '不保存',
          type: 'warning'
        })
          .then(() => {
            that.saveOpinion()
          })
          .catch(() => {})
        return false
      }
      // 保存功能  状态-审批中；编辑意见
      if (this.status === 2 && way === 'storage') {
        this.$confirm('是否保存已编辑的意见确认信息？', '', {
          customClass: 'confirmBox',
          confirmButtonText: '保存',
          cancelButtonText: '不保存',
          type: 'warning'
        })
          .then(() => {
            that.saveEditOpinion(true)
          })
          .catch(() => {})
        return false
      }
      // 提交功能   工单待确认状态，为无实质性意见的，需要提交审查意见书和最终上线材料
      if (this.status === 3 && way === 'update') {
        if (!approvedOpinionRequired) {
          // 1.审查意见书校验不通过时，要定位第一个未输入项
          this.crtComp = 'approvedOpinionCard'
          this.$nextTick(() => {
            this.$refs['child'].checkParam()
          })
          return false
        }
        // 2.  2.1 最终上线材料模块：选中活动正常上线：radio=1,需要上传材料; 选中活动未开展：radio=0，不需要上传材料
        if (uploadFileRadio === 1 && !uploadFileRequired) {
          this.$message({
            type: 'warning',
            customClass: 'el-icon-warning-one',
            message: '当前未上传最终上线材料，请上传材料后提交'
          })
          this.crtComp = 'uploadFileCard'
          return false
        }
        // 2.  2.2 最终上线材料模块：选中活动正常上线：radio=1,需要上传材料; 选中活动未开展：radio=0，不需要上传材料;校验是否全部关联文件
        const { fileUploadForm } = this.$store.state.checkApprovedForm
        const hasAllRelevant = fileUploadForm.every(m => m.relevantFile && m.relevantFile.url)
        if (uploadFileRadio === 1 && !hasAllRelevant) {
          this.$message({
            type: 'warning',
            customClass: 'el-icon-warning-one',
            message: '存在未关联的文件，请在关联后提交'
          })
          this.crtComp = 'uploadFileCard'
          return false
        }
        // 3.审查意见及上线材料都已提交完毕, 意见提交
        if (approvedOpinionRequired) {
          // 细分已采纳，存在未采纳
          const { approvedOpinionForm } = this.$store.state.checkApprovedForm
          const isAllAccept = approvedOpinionForm.every(
            (v) => v.adoptOpinions === 1
          )
          const msg = isAllAccept
            ? '当前已采纳所有意见，是否继续提交？'
            : '当前存在不采纳意见，是否继续提交？'
          this.option.message = msg;
          this.$refs.confirmation.dialogVisible = true
          // this.$confirm(msg, '', {
          //   customClass: 'confirmBox',
          //   confirmButtonText: '提交',
          //   cancelButtonText: '取消',
          //   type: 'warning'
          // })
          //   .then(() => {
          //     this.loadings.submitLoading = true
          //     that.submitOpinion()
          //   })
          //   .catch(() => {
          //     // this.loadings.submitLoading = false
          //   })
        }
      }
      // 提交功能  工单待确认状态，为有实质性意见的，需要提交审查意见书
      if (this.status === 5 && way === 'update') {
        if (!approvedOpinionRequired) {
          this.crtComp === 'approvedOpinionCard'
          this.$nextTick(() => {
            this.$refs['child'].checkParam(true)
          })
          return
        }
        // 在这里做提交
        if (approvedOpinionRequired) {
          const { approvedOpinionForm } = this.$store.state.checkApprovedForm
          const isAllAccept = approvedOpinionForm.every(
            (v) => v.adoptOpinions === 1
          )
          const msg = isAllAccept
            ? '当前已采纳所有“实质意见”，是否继续提交？'
            : '当前存在未采纳的“实质意见”，提交后将会进一步审核，是否继续提交？'
          const type = isAllAccept ? 1 : 0
          this.$confirm(msg, '', {
            customClass: 'confirmBox',
            confirmButtonText: '提交',
            cancelButtonText: '取消',
            closeOnClickModal: false,
            type: 'warning'
          })
            .then(() => {
              this.loadings.submitLoading = true
              that.submitOpinion(true, type)
            })
            .catch(() => {
              this.loadings.submitLoading = false
            })
        }
      }
      // 审批中状态之领导审批 提交
      if (this.status === 2 && way === 'update') {
        // 先切换当前的显示组件
        this.crtComp = 'leaderEditOpinion'
        // 判断。
        this.$refs['child'].updateForm()
        const { editOpinionRequired } = this.$store.state.checkApprovedForm
        if (!editOpinionRequired) {
          this.crtComp = 'leaderEditOpinion'
          this.$message.error('请在编辑意见后提交')
          return false
        }
        this.saveEditOpinion()
      }
    },
    /**
     * description: 审查意见书提交功能
     * param {*} opinions true为有实质性意见，需要上传审查意见书、上线材料； fase为无实质性意见，不需要上传材料
     * param {*} type :1 已采纳所有意见 0: 存在未采纳
     * return {*}
     */
    async submitOpinion(opinions) {
      const that = this
      const { approvedOpinionForm, fileUploadForm, uploadFileRadio } = this.$store.state.checkApprovedForm
      const approvedOpinionFormParams = approvedOpinionForm.map((v) => {
        return {
          adoptOpinions: v.adoptOpinions,
          notAdoptingReasons: v.notAdoptingReasons,
          recordId: v.recordId,
          substantiveOpinions: v.substantiveOpinions,
          cacheFlag: 0
        }
      })
      // eslint-disable-next-line
      const opinion_submit_params = {
        editedCommentsAdoptDtoList: approvedOpinionFormParams,
        handleDataDTO: {
          currentUserInfo: {
            id: this.item.initiator.id
          },
          processInstanceId: this.item.processInstanceId,
          taskId: this.item.taskId,
          templateId: this.item.processTemplateId
        }
      }
      try {
        // 上传文件的逻辑 选中活动正常上线
        if (!opinions && uploadFileRadio === 1) {
          const params = fileUploadForm.map((v) => {
            return {
              fileName: v.fileName,
              key: v.key,
              url: v.url,
              isRelation: true,
              otherFilename: v.relevantFile.fileName,
              otherKey: v.relevantFile.key,
              otherUrl: v.relevantFile.url
            }
          })
          const res = await finalMaterial(
            params,
            this.item.processInstanceId,
            this.item.taskId,
            that.item.taskNumber
          )
          const { success, msg } = res?.data
          if (!success) {
            this.$message.error(msg)
            return
          }
        }
        const res = await updateAdoptEditedComments(opinion_submit_params, this.item.taskId)
        const { success, msg } = res?.data
        if (success) {
          this.loadings.submitLoading = false
          // 有实质意见且采纳所以的有实质意见
          /* if (type && type === 1) {
            this.$confirm(
              '审查意见已确认，请根据审查意见修改提单内容。',
              '',
              {
                customClass: 'confirmBox',
                confirmButtonText: '去修改',
                cancelButtonText: '知道了',
                closeOnClickModal: false,
                distinguishCancelAndClose: true,
                type: 'warning'
              }
            )
              .then(() => {
                that.toModify()
              })
              .catch((e) => {
              // eslint-disable-next-line
                switch (e) {
                  case 'close':
                    that.toModify()
                    break
                  case 'cancel':
                    break
                }
              })
          } else {
            this.$confirm('审查意见已确认，可在申请中心查看。', '', {
              customClass: 'confirmBox',
              cancelButtonText: '知道了',
              showConfirmButton: false,
              closeOnClickModal: false,
              type: 'warning'
            })
              .then(() => {
                this.$router.replace('/applycenter')
              })
              .catch(() => {
                this.$router.replace('/applycenter')
              })
          } */
          this.$message.success('提交成功')
          setTimeout(() => {
            this.$router.go(-1)
          }, 1000)
        } else {
          this.loadings.submitLoading = false
          this.$message.error(msg)
        }
      } catch (error) {
        this.loadings.submitLoading = false
        this.$message.error(error)
      }
    },
  }
}
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
      border-bottom: 1px solid #e5e6eb;
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
