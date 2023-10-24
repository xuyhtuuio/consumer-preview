<template>
  <div class="addApply" v-loading.body="isGLoading">
    <g-breadcrunm />
    <div class="tag">
      <add-tag ref="refAddTag" @submit="submit" @save="save" :formBasicInfo="formBasicInfo">
        <div v-if="!reviewList.length"></div>
      </add-tag>
    </div>
    <div class="content" v-loading="isLoading">
      <review-matters
        ref="refReviewMatters"
        class="cnt-head"
        :list="reviewList"
        :formManagementId="formManagementId"
        :allawChange="formBasicInfo.submitted !== 1"
        @handleTo="handleReviewClick"
      />
      <div class="cnt-main" v-loading="isCntLoading">
        <div v-if="!reviewList.length" class="main-no-data">
          <img src="@/assets/image/noData.png" alt="" />
          <p>抱歉，您暂无可申请的审查事项</p>
        </div>
        <basic-information class="cnt-item" ref="basicInformationRef" :list="basicInformation" :limitTime="limitTime"/>
        <publicity-channels class="cnt-item" ref="publicityChannelsRef" :list="promotionChannels" />
        <reconciliation-point
          class="cnt-item"
          ref="reconPointRef"
          :list="keyPointsForVerification"
        />
        <review-material class="cnt-item" ref="reviewMaterialRef" :list="reviewMaterials" />
      </div>
      <div class="footer" v-if="!isLoading && reviewList.length">
        <g-button class="btn" @click="previewFlow" v-if="formBasicInfo.submitted !== 1">流程总览</g-button>
        <g-button class="btn" @click.native="save" v-if="formBasicInfo.submitted !== 1">保存草稿</g-button>
        <g-button class="btn" type="primary" @click.native="submit">提交</g-button>
      </div>
    </div>
    <secondary-confirmation ref="RefSecondaryCon" :option="confirmOption"></secondary-confirmation>
    <el-dialog
      class="loadingDialog"
      :visible.sync="submitDialogVisible"
      width="500px"
      append-to-body
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :show-close="false"
      center
    >
      <div class="item">
        <g-icon stylePx="44" href="#icon-zhengzaishangchuan"></g-icon>
      </div>
      <div class="item">
        <span class="text">正在提交申请，请耐心等待</span>
        <img class="img" src="@/assets/image/gif/loading.gif" alt="" />
      </div>
      <span class="item">提交成功后可在申请中心查看，了解工单审批进度</span>
    </el-dialog>
    <el-dialog class="processDialog" :visible.sync="processDialogVisible"> 流程图 </el-dialog>
    <w-dialog
      :showFooter="false"
      v-model="flowVisible"
      :title="currentRow?.templateName + '-预览'"
      width="70%"
    >
      <process-design from="flowManage" ref="processDesign" style="background: #f5f6f6" />
    </w-dialog>

    <secondary-confirmation
      :option="{
      message: `当前申请发起时间小于[${showInfoDialogTitle}]最短审批时限要求，判断为加急单，请知悉`,
      cancelBtn: '返回',
      confirmBtn: '提交'
    }"
      ref="Refconfirmation"
      @handleConfirm="editStatus"
    ></secondary-confirmation>
  </div>
</template>

<script>
import SecondaryConfirmation from '@/components/common/secondaryConfirmation';
import ProcessDesign from '@/views/admin/layout/ProcessDesign';

import { timestampToDateTime } from '@/utils/utils';
import {
  getFormCategoryArray,
  getApplyForm,
  saveDraft,
  externalLogicController,
  processStart,
  getProcess
} from '@/api/front';
import {
  getNextUserOption,
  ocrApprovalSubmission,
  updateRuleCode
} from '@/api/aiApproval'
import AddTag from './components/add-tag';
import ReviewMatters from './components/review-matters';
import BasicInformation from './components/basic-information';
import PublicityChannels from './components/publicity-channels';
import ReconciliationPoint from './components/reconciliation-point';
import ReviewMaterial from './components/review-material-1';

export default {
  components: {
    AddTag,
    ReviewMatters,
    BasicInformation,
    PublicityChannels,
    ReconciliationPoint,
    ReviewMaterial,
    SecondaryConfirmation,
    ProcessDesign
  },
  data: () => ({
    title: '审查类型',
    cardInfo: '提醒：产品类内容审查，需于在产品上线/宣传前14天进行提交。',
    isLoading: true,
    isCntLoading: false,
    limitTime: 0, // 限制时间
    isGLoading: false,
    submitDialogVisible: false,
    processDialogVisible: false,
    flowVisible: false,
    reviewList: [],
    promotionChannels: [],
    basicInformation: [],
    keyPointsForVerification: [],
    reviewMaterials: [],
    formId: '',
    formManagementId: -1,
    confirmOption: {
      message: '是否保存当前编辑内容？',
      cancelBtn: '不保存',
      confirmBtn: '保存'
    },
    templateId: '',
    processDefinitionId: '',
    currentRow: null,
    currentRowInfo: '',
    nodeSelectUserList: null,
    formBasicInfo: {}, // 编辑表单时，从路由处获取的基础信息
    showInfoDialog: false,
    showInfoDialogTitle: '',
  }),
  created() {
    this.initialData();
  },
  beforeRouteEnter({ name, params }, from, next) {
    if (name === 'addApply') return next();
    next(vm => {
      const { id, formManagementId } = params
      if (id || window.localStorage.getItem('editId')) {
        vm.formBasicInfo = {
          ...JSON.parse(window.localStorage.getItem('formBasicInfo') || '{}'),
          ...params
        }
        vm.formId = id || window.localStorage.getItem('editId');
        vm.formManagementId = formManagementId || window.localStorage.getItem('formManagementId');
        window.localStorage.setItem('formBasicInfo', JSON.stringify(vm.formBasicInfo));
        window.localStorage.setItem('editId', id || window.localStorage.getItem('editId'));
        window.localStorage.setItem(
          'formManagementId',
          formManagementId || window.localStorage.getItem('formManagementId')
        );
      } else {
        vm.formId = '';
        vm.formManagementId = -1;
      }
    });
  },
  beforeRouteLeave({ params: { isNoDialog } }, from, next) {
    const _this = this.$refs['RefSecondaryCon'];
    if (!this.reviewList.length) {
      return next()
    }
    !isNoDialog && (_this.dialogVisible = true);
    isNoDialog && next();
    _this.handleConfirm = () => {
      _this.dialogVisible = false;
      this.save(() => {
        this.removeStorage()
        next();
      });
    };
    _this.handleClose = () => {
      _this.dialogVisible = false;
      this.removeStorage()
      next();
    };
  },
  methods: {
    removeStorage() {
      window.localStorage.removeItem('editId');
      window.localStorage.removeItem('formManagementId');
      window.localStorage.removeItem('formBasicInfo');
    },
    initialData() {
      this.isLoading = true;
      getFormCategoryArray().then(res => {
        this.reviewList = res.data.data;
        this.isLoading = false;
      });
    },
    clearForm() {
      this.promotionChannels = [];
      this.basicInformation = [];
      this.keyPointsForVerification = [];
      this.reviewMaterials = [];
    },
    // 审查事项类型
    async handleReviewClick(id, limitTime, title) {
      this.isCntLoading = true;
      this.limitTime = limitTime
      this.showInfoDialogTitle = title
      this.clearForm();
      await this.handleAllListprefix(id);
      const { data: result } = await getNextUserOption({ nodeId: 'root', templateId: this.templateId })

      if (result.success) {
        if (result.data.selectObject === '1') {
          const options = result.data.nodeSelectUserList
          const { nextNodeId } = result.data
          // TODO: 选择审批人（关联后台流程配置）
          const data = {
            id: '-1',
            title: '审批人',
            name: 'MultipleSelect',
            module: '基本信息',
            value: [],
            valueType: 'Array',
            props: {
              required: true,
              placeholder: '因选择渠道涉及总行，请选择总行对应业务部门的审批人',
              expanding: false,
              options
            },
            nextNodeId
          }
          this.nodeSelectUserList = data
        } else {
          this.nodeSelectUserList = null
        }
      }
      getApplyForm({
        formId: this.formId,
        processTemplateId: this.templateId,
        nodeId: 'root',
        formCategoryId: id
      }).then(({ data: { data: res, success } }) => {
        this.isCntLoading = false;
        this.isGLoading = false;
        if (success) {
          const { basicInformation, promotionChannels, keyPointsForVerification, reviewMaterials } = res;
          const data = this.nodeSelectUserList
          this.basicInformation = data
            ? [...basicInformation, data] : basicInformation;
          this.promotionChannels = promotionChannels;
          this.keyPointsForVerification = keyPointsForVerification;
          this.reviewMaterials = reviewMaterials;
        } else {
          this.clearForm();
          // this.$message.error(msg)
        }
      });
    },
    handleAllListprefix(id) {
      return Promise.all([externalLogicController({ formId: id }), getProcess({ formId: id })])
        .then(([res1, res2]) => {
          this.isLoading = false;
          let flag = true;
          const {
            data: { data: result1, success: success1 }
          } = res1;
          if (success1) {
            this.templateId = result1.templateId;
            this.processDefinitionId = result1.processDefinitionId;
          } else {
            this.templateId = '';
            flag = false;
          }
          const {
            data: { data: result2, msg: msg2, success: success2 }
          } = res2;
          if (success2) {
            this.currentRow = result2.list.length ? result2.list[0] : null;
          } else {
            this.currentRow = null;
            this.currentRowInfo = msg2;
          }
          if (!flag) {
            return Promise.reject()
          }
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    // 提交
    async submit() {
      let result0 = true;
      if (!this.$refs['basicInformationRef'].judgeWarn()) {
        await new Promise((resolve) => {
          this.$nextTick(() => {
            const refs = this.$refs['basicInformationRef'].$refs['refWarn'] || [];
            result0 = refs.length === 0 || false
            if (refs.length) {
              let { offsetTop } = refs[0].$el.offsetParent;
              refs.forEach(item => {
                if (item.$el?.offsetParent?.offsetTop < offsetTop) {
                  offsetTop = item.$el?.offsetParent?.offsetTop;
                }
              });
              this.rollTo(offsetTop);
            }
            resolve()
          });
        })
      }

      const [result, offsetTop] = this.$refs['publicityChannelsRef'].judgeWarn();

      const [result1, offsetTop1] = this.$refs['reconPointRef'].judgeWarn();

      const [result2, offsetTop2] = this.$refs['reviewMaterialRef'].judgeWarn();

      if (!result0 || !result || !result1 || !result2) {
        if (!result0) return;
        let rollToNum
        if (offsetTop && offsetTop !== 0) {
          rollToNum = offsetTop
        } else if (offsetTop1 && offsetTop1 !== 0) {
          rollToNum = offsetTop1
        } else {
          rollToNum = offsetTop2
        }
        return this.rollTo(rollToNum);
      }
      this.submitTrue();
    },
    async submitTrue(flag = true, success) {
      const result = {
        entryName: this.basicInformation[0].value,
        form_managementId: this.$refs.refReviewMatters.currentId,
        uptime: '',
        formId: this.formId
      };
      const formItemDataList = [];
      const list = ['basicInformation', 'promotionChannels', 'keyPointsForVerification'];
      list.forEach(item => {
        this[item].forEach(iten => {
          if (Number(iten.props.order) === 0) {
            result.uptime = iten.value ? timestampToDateTime(iten.value) : '';
          }
          if (Number(iten.props.order) === 1 && iten.props.placeholder === '永久' && iten.props.isRoyalty && iten.lastProps) {
            iten.value = iten.props.placeholder
          }
          if (iten.id !== '-1') {
            formItemDataList.push({
              formItemId: iten.id,
              value: iten.value,
              valueType: iten.valueType
            });
          }
        });
      });
      const reviewMaterialsData = {
        formItemId: this.reviewMaterials[0].id,
        valueType: this.reviewMaterials[0].valueType,
        value: []
      };
      this.$refs['reviewMaterialRef'].fileList.forEach(item => {
        reviewMaterialsData.value.push({
          fileName: item.name,
          key: item.key,
          url: item.url
        });
      });
      formItemDataList.push(reviewMaterialsData);
      result.formItemDataList = formItemDataList;
      if (flag) {
        if (this.submitDialogVisible) return;
        const limitTime = +new Date(result.uptime) - +new Date()
        const limitTime1 = this.limitTime * 24 * 60 * 60 * 1000
        if (limitTime < limitTime1) {
          this.showInfoDialog = true
          this.$refs.Refconfirmation.dialogVisible = true
          this.submitResult = result
        } else {
          this.submitTrue1(result)
        }
      } else {
        if (this.isGLoading) return;
        this.isGLoading = true;
        saveDraft(result).then(({ data: { data, msg } }) => {
          this.formId = data;
          this.$message({ type: 'success', message: msg });
          this.rollTo(0);
          this.isGLoading = false;
          typeof success === 'function' && success();
        });
      }
    },
    async submitTrue1(result) {
      this.submitDialogVisible = true;
      const { userId: id, fullname: name } = this.$refs['refAddTag'];
      const user = JSON.parse(window.localStorage.getItem('user_name'))
      let res = {};
      const postData = {
        submitDto: result,
        ocessInstanceId: this.formBasicInfo.processInstanceId,
        taskId: this.formBasicInfo.taskId,
        templateId: this.templateId,
        nodeId: this.formBasicInfo.nodeId,
        currentUserInfo: {
          id: user.id,
          name: user.fullname
        }
      }
      if (this.formBasicInfo.submitted === 1) {
        res = await ocrApprovalSubmission(postData).catch(() => {
          this.submitDialogVisible = false;
        });
      } else {
        const data = this.nodeSelectUserList
        if (data) {
          const dataObj = []
          data.value.forEach(item => dataObj.push({ id: item }))
          await updateRuleCode({
            nextNodeId: data.nextNodeId || '',
            nextUserInfo: dataObj || [],
            templateId: this.templateId,
            nodeId: 'root'
          })
        }
        res = await processStart({
          templateId: this.templateId,
          processDefinitionId: this.processDefinitionId,
          startUserInfo: {
            id,
            name
          },
          submitDto: result
        }).catch(() => {
          this.submitDialogVisible = false;
        });
      }
      const { success: sus, msg: message } = res.data;
      if (sus) {
        this.submitDialogVisible = false;
        this.$message({ type: 'success', message: '提交成功' });
        this.$router.push({ name: 'apply-list', params: { isNoDialog: true } });
      } else {
        this.$message({ type: 'error', message });
        this.submitDialogVisible = false;
      }
    },
    rollTo(offsetTop) {
      document
        .querySelector('.addApply')
        .scrollTo({ top: Number(offsetTop - 100), behavior: 'smooth' });
    },
    // 保存草稿
    save(success) {
      if (!this.$refs['basicInformationRef'].judgeWarnSave()) {
        this.$nextTick(() => {
          const { offsetTop } = this.$refs['basicInformationRef'].$refs['refWarn'][0].$el.offsetParent;
          this.rollTo(offsetTop);
        });
        return false;
      }
      const [result2] = this.$refs['reviewMaterialRef'].judgeWarn(false);
      if (result2) {
        return this.submitTrue(false, success);
      }
    },
    editStatus() {
      this.submitTrue1(this.submitResult)
    },
    //
    previewFlow() {
      if (!this.currentRow) {
        return this.$message.error(this.currentRowInfo);
      }
      const design = JSON.parse(JSON.stringify(this.currentRow));
      design.formId = +design.formId;
      design.settings = JSON.parse(design.settings);
      design.formItems = JSON.parse(design.formItems);
      design.process = JSON.parse(design.process);
      this.$store.commit('loadForm', design);
      this.$store.commit('setIsPreview', true);
      this.$nextTick(() => {
        this.flowVisible = true;
      });
    }
  }
};
</script>

<style lang="less" scoped>
.addApply {
  .tag {
    display: flex;
    align-items: center;
    margin: 16px 0;
    height: 66px;
  }
  .content {
    min-width: 300px;
    .cnt-head {
      margin-bottom: 8px;
      background: rgba(255, 255, 255, 1);
      border-radius: 10px;
    }
    .cnt-main {
      min-height: 200px;
      background: rgba(255, 255, 255, 1);
      border-radius: 10px;
      .main-no-data {
        text-align: center;
        padding-top: 64px;
        height: 600px;
        &>img {
          width: 300px;
          height: 300px;
        }
        p {
          margin-top: 24px;
          font-size: 20px;
          line-height: 28px;
          color: #86909C;
        }
      }
    }
    .btn {
      font-weight: 700;
    }
  }

  .footer {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 20px;
    .btn {
      font-weight: normal;

      &:not(:last-child) {
        margin-right: 24px;
      }
    }
  }
}
.loadingDialog {
  /deep/.el-dialog {
    padding: 40px 60px;
    border-radius: 10px;
    .el-dialog__header {
      padding: 0;
    }
    .el-dialog__body {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 0;

      .item {
        position: relative;
        z-index: 2;
        .text {
          position: relative;
          z-index: 2;
        }
        &:nth-child(2) {
          .img {
            position: relative;
            left: 16px;
            top: 4px;
            width: 28px;
            height: 20px;
            transform: scale(4);
          }
        }
        &:not(:first-child) {
          margin-top: 16px;
        }
        &:last-child {
          line-height: 20px;
          font-size: 12px;
          color: #86909c;
        }
      }
    }
  }
}
</style>
