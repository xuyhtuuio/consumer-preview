<template>
  <div class="addApply" v-loading.body="isGLoading">
    <g-breadcrunm />
    <div class="tag">
      <add-tag ref="refAddTag" @submit="submit" @save="save" />
    </div>
    <div class="content" v-loading="isLoading">
      <review-matters
        ref="refReviewMatters"
        class="cnt-head"
        :list="reviewList"
        :formManagementId="formManagementId"
        @handleTo="handleReviewClick"
      />
      <div class="cnt-main">
        <basic-information class="cnt-item" ref="basicInformationRef" :list="basicInformation" />
        <publicity-channels class="cnt-item" ref="publicityChannelsRef" :list="promotionChannels" />
        <reconciliation-point
          class="cnt-item"
          ref="reconPointRef"
          :list="keyPointsForVerification"
        />
        <review-material class="cnt-item" ref="reviewMaterialRef" :list="reviewMaterials" />
      </div>
      <div class="footer" v-if="!isLoading">
        <!-- <g-button class="btn" @click.native="processDialogVisible=true">流程总览</g-button> -->
        <g-button class="btn" @click.native="save">保存草稿</g-button>
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
    <el-dialog class="processDialog" :visible.sync="processDialogVisible">
      流程图
    </el-dialog>
  </div>
</template>

<script>
import AddTag from './components/add-tag.vue';
import ReviewMatters from './components/review-matters.vue';
import BasicInformation from './components/basic-information.vue';
import PublicityChannels from './components/publicity-channels.vue';
import ReconciliationPoint from './components/reconciliation-point.vue';
import SecondaryConfirmation from '@/components/common/secondaryConfirmation';
import ReviewMaterial from './components/review-material.vue';
import { timestampToDateTime } from '@/utils/utils.js';
import {
  getFormCategoryArray,
  getApplyForm,
  submit,
  saveDraft,
  externalLogicController,
  processStart
} from '@/api/front.js';
export default {
  components: {
    AddTag,
    ReviewMatters,
    BasicInformation,
    PublicityChannels,
    ReconciliationPoint,
    ReviewMaterial,
    SecondaryConfirmation
  },
  data: () => ({
    title: '审查类型',
    cardInfo: '提醒：产品类内容审查，需于在产品上线/宣传前14天进行提交。',
    isLoading: true,
    isGLoading: false,
    submitDialogVisible: false,
    processDialogVisible:false,
    reviewList: [],
    promotionChannels: [],
    basicInformation: [],
    keyPointsForVerification: [],
    reviewMaterials: [],
    formId: undefined,
    formManagementId: -1,
    confirmOption: {
      message: '是否保存当前编辑内容？',
      cancelBtn: '不保存',
      confirmBtn: '保存'
    },
    templateId: '',
    processDefinitionId: ''
  }),
  created() {
    // this.initialData();
  },
  beforeRouteEnter({ name, params: { id, formManagementId } }, from, next) {
    if (name === 'addApply') return next();
    next(vm => {
      if (id || window.localStorage.getItem('editId')) {
        vm.formId = id || window.localStorage.getItem('editId');
        vm.formManagementId = formManagementId || window.localStorage.getItem('formManagementId');
        window.localStorage.setItem('editId', id || window.localStorage.getItem('editId'));
        window.localStorage.setItem(
          'formManagementId',
          formManagementId || window.localStorage.getItem('formManagementId')
        );
      } else {
        vm.formId = undefined;
        vm.formManagementId = -1;
      }
    });
  },
  beforeRouteLeave({ params: { isNoDialog } }, from, next) {
    const _this = this.$refs['RefSecondaryCon'];

    !isNoDialog && (_this.dialogVisible = true);
    isNoDialog && next();
    _this.handleConfirm = () => {
      _this.dialogVisible = false;
      this.save(() => {
        window.localStorage.removeItem('editId');
         window.localStorage.removeItem('formManagementId');
        // this.formId = undefined;
        // this.initialData();
        next();
      });
    };
    _this.handleClose = () => {
      _this.dialogVisible = false;
      next();
    };
  },
  activated() {
    this.initialData();
  },
  deactivated() {
    this.formId = undefined;
    this.formManagementId = undefined;
    this.initialData();
    this.handleClear();
  },
  methods: {
    initialData() {
      getFormCategoryArray().then(res => {
        this.isLoading = true;
        this.reviewList = res.data.data[0];
      });
    },
    // handleConfirm() {
    //   this.initialData()
    // },
    handleClear() {
      const list = [
        'basicInformationRef',
        'publicityChannelsRef',
        'reconPointRef',
        'reviewMaterialRef'
      ];
      list.forEach(el => {
        this.$refs[el].judgeWarnFlag = false;
      });
    },
    clearForm() {
      this.promotionChannels = [];
      this.basicInformation = [];
      this.keyPointsForVerification = [];
      this.reviewMaterials = [];
      this.$refs['publicityChannelsRef'].judgeWarnFlag = false;
      this.$refs['reconPointRef'].judgeWarnFlag = false;
      this.$refs['reviewMaterialRef'].judgeWarnFlag = false;
      // this.isLoading = true
    },
    // 审查事项类型
    handleReviewClick(id) {
      this.isLoading = true;
      this.clearForm();
      getApplyForm({
        formId: this.formId,
        formCategoryId: id
      }).then(({ data: { data: res, msg, success } }) => {
        if (success) {
          const { basicInformation, promotionChannels, keyPointsForVerification, reviewMaterials } =
            res;
          this.basicInformation = basicInformation;
          this.promotionChannels = promotionChannels;
          this.keyPointsForVerification = keyPointsForVerification;
          this.reviewMaterials = reviewMaterials;
          this.isLoading = false;
          this.isGLoading = false;
        } else {
          // this.$message.error(msg)
          this.isLoading = false;
          this.isGLoading = false;
        }
      });
      externalLogicController({ formId: id }).then(({ data: { data: res, msg, success } }) => {
        if (success) {
          this.templateId = res.templateId;
          this.processDefinitionId = res.processDefinitionId;
        } else {
          // this.$message.error(msg)
          this.isLoading = false;
        }
      });
    },
    // 提交
    async submit() {
      let result0 = true;
      if (!this.$refs['basicInformationRef'].judgeWarn()) {
        await this.$nextTick(() => {
          const refs = this.$refs['basicInformationRef'].$refs['refWarn'];
          result0 = refs?.length ? false : true;
          if (refs?.length) {
            let offsetTop = refs[0].$el.offsetParent.offsetTop;
            refs.forEach(item => {
              if (item.$el?.offsetParent?.offsetTop < offsetTop) {
                offsetTop = item.$el?.offsetParent?.offsetTop;
              }
            });
            this.rollTo(offsetTop);
          }
        });
      }
      const [result, offsetTop] = this.$refs['publicityChannelsRef'].judgeWarn();

      const [result1, offsetTop1] = this.$refs['reconPointRef'].judgeWarn();

      const [result2, offsetTop2] = this.$refs['reviewMaterialRef'].judgeWarn();
      if (!result0 || !result || !result1 || !result2) {
        if (!result0) return;
        return this.rollTo(offsetTop ? offsetTop : offsetTop1 ? offsetTop1 : offsetTop2);
      }
      this.submitTrue();
    },
    submitTrue(flag = true, success) {
      const result = {
        entryName: this.basicInformation[0].value,
        form_managementId: 1,
        uptime: '',
        formId: this.formId
      };
      const formItemDataList = [];
      const list = ['basicInformation', 'promotionChannels', 'keyPointsForVerification'];
      list.forEach(item => {
        this[item].forEach(iten => {
          if (iten.props.order == 0) {
            result.uptime = iten.value ? timestampToDateTime(iten.value) : '';
          }
          formItemDataList.push({
            formItemId: iten.id,
            value: iten.value,
            valueType: iten.valueType
          });
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
        this.submitDialogVisible = true;
        // submit(result).then(res => {
        //   this.$message({ type: 'success', message: res.data.data });
        //   this.$router.push({ name: 'apply-list', params: { isNoDialog: true } });
        // });
        const { userId: id, fullname: name } = this.$refs['refAddTag'];
        processStart({
          templateId: this.templateId,
          processDefinitionId: this.processDefinitionId,
          startUserInfo: {
            id,
            name
          },
          submitDto: result
        })
          .then(({ data: { success, msg: message } }) => {
            if (success) {
              this.submitDialogVisible = false;
              this.$message({ type: 'success', message: '提交成功' });
              this.$router.push({ name: 'apply-list', params: { isNoDialog: true } });
            } else {
              this.$message({ type: 'error', message });
              this.submitDialogVisible = false;
            }
          })
          .catch(err => {
            // this.$message({ type: 'error', message: '提交失败' });
            this.submitDialogVisible = false;
          });
      } else {
        if (this.isGLoading) return;
        this.isGLoading = true;
        saveDraft(result).then(({ data: { data, msg } }) => {
          this.formId = data;
          this.$message({ type: 'success', message: msg });
          this.rollTo(0);
          this.isGLoading = false;
          this.handleClear();
          typeof success === 'function' && success();
        });
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
          const offsetTop =
            this.$refs['basicInformationRef'].$refs['refWarn'][0].$el.offsetParent.offsetTop;
          this.rollTo(offsetTop);
        });
        return false;
      }
      const [result2, offsetTop2] = this.$refs['reviewMaterialRef'].judgeWarn(false);
      if (result2) {
        return this.submitTrue(false, success);
      }
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
      background: rgba(255, 255, 255, 1);
      border-radius: 10px;
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