<template>
  <div class="addApply">
    <g-breadcrunm :title="title" />
    <div class="tag">
      <add-tag @submit="submit" @save="save"/>
    </div>
    <div class="content" v-loading="isLoading">
      <review-matters class="cnt-head" :list="reviewList" @handleTo="handleReviewClick" />
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

      <div class="footer">
        <g-button class="btn" >流程总览</g-button>
        <g-button class="btn" @click.native="save">保存草稿</g-button>
        <g-button class="btn" type="primary" @click.native="submit">提交</g-button>
      </div>
    </div>
  </div>
</template>

<script>
import AddTag from './components/add-tag.vue';
import ReviewMatters from './components/review-matters.vue';
import BasicInformation from './components/basic-information.vue';
import PublicityChannels from './components/publicity-channels.vue';
import ReconciliationPoint from './components/reconciliation-point.vue';
import ReviewMaterial from './components/review-material.vue';
import { timestampToDateTime } from '@/utils/utils.js';
import { getFormCategoryArray, getApplyForm, submit,saveDraft } from '@/api/front.js';
export default {
  components: {
    AddTag,
    ReviewMatters,
    BasicInformation,
    PublicityChannels,
    ReconciliationPoint,
    ReviewMaterial
  },
  data: () => ({
    userId: 1,
    title: '审查类型',
    cardInfo: '提醒：产品类内容审查，需于在产品上线/宣传前14天进行提交。',
    isLoading: false,
    reviewList: [],
    promotionChannels: [],
    basicInformation: [],
    keyPointsForVerification: [],
    reviewMaterials: []
  }),
  created() {
    this.initialData();
  },

  methods: {
    initialData() {
      getFormCategoryArray({ userId: this.userId }).then(res => {
        this.isLoading = true
        // console.log(123,res.data.data[0]);
        this.reviewList = res.data.data[0];
        console.log(res.data.data[0]);
        this.handleReviewClick(res.data.data[0][0].recordId);
      });
    },
    // 审查事项类型
    handleReviewClick(id) {
      getApplyForm({
        formCategoryId: id,
        userId: this.userId
      }).then(res => {
        const { basicInformation, promotionChannels, keyPointsForVerification, reviewMaterials } =
          res.data.data;
        this.basicInformation = basicInformation;
        this.promotionChannels = promotionChannels;
        this.keyPointsForVerification = keyPointsForVerification;
        this.reviewMaterials = reviewMaterials;
        this.isLoading = false
      });
    },
    // 提交
    submit() {
      if (!this.$refs['basicInformationRef'].judgeWarn()) {
        return this.$nextTick(() => {
          const offsetTop = this.$refs['basicInformationRef'].offsetTop;
          this.rollTo(offsetTop);
        });
      }
      const [result, offsetTop] = this.$refs['publicityChannelsRef'].judgeWarn();
      if (!result) {
        return this.rollTo(offsetTop);
      }
      const [result1, offsetTop1] = this.$refs['reconPointRef'].judgeWarn();
      if (!result1) {
        return this.rollTo(offsetTop1);
      }
      const [result2, offsetTop2] = this.$refs['reviewMaterialRef'].judgeWarn();
      if (!result2) {
        return this.rollTo(offsetTop2);
      }
      this.submitTrue();
    },
    submitTrue(flag = true) {
      const result = {
        approvalType: this.basicInformation[1].value,
        entryName: this.basicInformation[0].value,
        form_managementId: 1,
        uptime: '',
        userId: this.userId
      };
      const formItemDataList = [];
      this.basicInformation.forEach(item => {
        if (item.props.order == 0) {
          result.uptime = timestampToDateTime(item.value);
        }
        formItemDataList.push({
          formItemId: item.id,
          value: item.value,
          valueType: item.valueType
        });
      });
      this.promotionChannels.forEach(item => {
        formItemDataList.push({
          formItemId: item.id,
          value: item.value,
          valueType: item.valueType
        });
      }),
        this.keyPointsForVerification.forEach(item => {
          formItemDataList.push({
            formItemId: item.id,
            value: item.value,
            valueType: item.valueType
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
      flag && submit(result).then(res => {
        this.initialData()
        this.$message({ type: 'success', message: res.data.data });
      });
      !flag && saveDraft(result).then(res => {
        this.initialData()
        this.$message({ type: 'success', message: res.data.data });
      });
    },
    rollTo(offsetTop) {
      console.log('offsetTop', Number(offsetTop - 100));
      document
        .querySelector('.addApply')
        .scrollTo({ top: Number(offsetTop - 100), behavior: 'smooth' });
    },
    // 保存草稿
    save(){
   
      if (!this.$refs['basicInformationRef'].judgeWarnSave()) {
        return this.$nextTick(() => {
          const offsetTop = this.$refs['basicInformationRef'].offsetTop;
          this.rollTo(offsetTop);
        });
      }
      this.submitTrue(false)
    }
  },
  computed: {}
};
</script>

<style lang="less" scoped>
.addApply {
  .tag {
    margin: 16px 0;
  }
  .content {
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