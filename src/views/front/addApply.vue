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
        <g-button class="btn">流程总览</g-button>
        <g-button class="btn" @click.native="save">保存草稿</g-button>
        <g-button class="btn" type="primary" @click.native="submit">提交</g-button>
      </div>
    </div>
    <secondary-confirmation ref="RefSecondaryCon" :option="confirmOption"></secondary-confirmation>
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
    reviewList: [],
    promotionChannels: [],
    basicInformation: [],
    keyPointsForVerification: [],
    reviewMaterials: [],
    formId: undefined,
    confirmOption: {
      message: '是否保存当前编辑内容？',
      cancelBtn: '不保存',
      confirmBtn: '保存'
    },
    templateId: '',
    processDefinitionId: ''
  }),
  created() {
    this.initialData();
  },
  beforeRouteEnter({ name, params: { id } }, from, next) {
    if (name === 'addApply') return next();
    next(vm => {
      if (id || window.localStorage.getItem('editId')) {
        vm.formId = id || window.localStorage.getItem('editId');
        window.localStorage.setItem('editId', id || window.localStorage.getItem('editId'));
      } else {
        vm.formId = undefined;
      }
    });
  },
  beforeRouteLeave({ params: { isNoDialog } }, from, next) {
    const _this = this.$refs['RefSecondaryCon'];
    console.log(isNoDialog);

    !isNoDialog && (_this.dialogVisible = true);
    isNoDialog && next();
    _this.handleConfirm = () => {
      _this.dialogVisible = false;
      this.save(() => {
        console.log('save');
        window.localStorage.removeItem('editId');
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
    console.log('activated');
    this.initialData();
  },
  deactivated() {
    console.log('deactivated');
    this.formId = undefined;
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
        console.log(el, this.$refs[el]);
        this.$refs[el].judgeWarnFlag = false;
      });
    },
    // 审查事项类型
    handleReviewClick(id) {
      getApplyForm({
        formId: this.formId,
        formCategoryId: id
      }).then(res => {
        const { basicInformation, promotionChannels, keyPointsForVerification, reviewMaterials } =
          res.data.data;
        this.basicInformation = basicInformation;
        this.promotionChannels = promotionChannels;
        this.keyPointsForVerification = keyPointsForVerification;
        this.reviewMaterials = reviewMaterials;
        this.isLoading = false;
        this.isGLoading = false;
      });
      externalLogicController({ formId: id }).then(({ data: { data: res } }) => {
        (this.templateId = res.templateId), (this.processDefinitionId = res.processDefinitionId);
      });
    },
    // 提交
    async submit() {
      let result0 = true;
      if (!this.$refs['basicInformationRef'].judgeWarn()) {
        await this.$nextTick(() => {
          const refs = this.$refs['basicInformationRef'].$refs['refWarn'];
          result0 = refs?.length ? false : true;
          console.log('result0', result0);
          if (refs?.length) {
            let offsetTop = refs[0].$el.offsetParent.offsetTop;
            refs.forEach(item => {
              if (item.$el?.offsetParent?.offsetTop < offsetTop) {
                offsetTop = item.$el?.offsetParent?.offsetTop;
              }
            });
            console.log('offsetTop', offsetTop);
            this.rollTo(offsetTop);
          }
        });
      }
      const [result, offsetTop] = this.$refs['publicityChannelsRef'].judgeWarn();

      const [result1, offsetTop1] = this.$refs['reconPointRef'].judgeWarn();

      const [result2, offsetTop2] = this.$refs['reviewMaterialRef'].judgeWarn();
      console.log(result0, result, result1, result2);
      if (!result0 || !result || !result1 || !result2) {
        if (!result0) return;
        return this.rollTo(offsetTop ? offsetTop : offsetTop1 ? offsetTop1 : offsetTop2);
      }
      this.submitTrue();
    },
    submitTrue(flag = true, success) {
      if (this.isGLoading) return;
      this.isGLoading = true;

      const result = {
        approvalType: this.basicInformation[1].value,
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
        // submit(result).then(res => {
        //   this.$message({ type: 'success', message: res.data.data });
        //   this.$router.push({ name: 'apply-list', params: { isNoDialog: true } });
        // });
        const { id, name, dep: label } = this.$refs['refAddTag'].approverInfo;
        processStart({
          templateId: this.templateId,
          processDefinitionId: this.processDefinitionId,
          startUserInfo: {
            id,
            name,
            label
          },
          submitDto: result
        })
          .then(res => {
            this.$message({ type: 'success', message: res.data.msg === 'success' && '提交成功' });
            this.$router.push({ name: 'apply-list', params: { isNoDialog: true } });
          })
          .catch(err => {
            console.log(err);
            this,$message({ type: 'error', message: '提交失败'})
          });
      }
      !flag &&
        saveDraft(result).then(({ data: { data, msg } }) => {
          this.formId = data;
          this.$message({ type: 'success', message: msg });
          this.rollTo(0);
          this.isGLoading = false;
          this.handleClear();
          typeof success === 'function' && success();
        });
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
  },
  computed: {}
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
</style>