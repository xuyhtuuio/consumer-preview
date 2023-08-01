<template>
  <div class="addApply" v-loading.body="isGLoading">
    <g-breadcrunm />
    <div class="tag">
      <add-tag @submit="submit" @save="save" />
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
import { getFormCategoryArray, getApplyForm, submit, saveDraft } from '@/api/front.js';
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
    title: '审查类型',
    cardInfo: '提醒：产品类内容审查，需于在产品上线/宣传前14天进行提交。',
    isLoading: true,
    isGLoading: false,
    reviewList: [],
    promotionChannels: [],
    basicInformation: [],
    keyPointsForVerification: [],
    reviewMaterials: [],
    formId: undefined
  }),
  created() {
    this.initialData();
  },
  beforeRouteEnter({ name, params: { id } }, from, next) {
    if (name === 'addApply') return next();
    next(vm => {
      console.log('123', id);
      if (id || window.localStorage.getItem('editId')) {
        console.log(id, window.localStorage.getItem('editId'));
        vm.formId = id || window.localStorage.getItem('editId');
        window.localStorage.setItem('editId', id || window.localStorage.getItem('editId'));
      } else {
        vm.formId = undefined;
      }
    });
  },
  beforeRouteLeave(to, from, next) {
    window.localStorage.removeItem('editId');
    next();
  },
  activated() {
    this.initialData();
  },
  methods: {
    initialData() {
      getFormCategoryArray().then(res => {
        this.isLoading = true;
        this.reviewList = res.data.data[0];
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
        this.isGLoading = false
      });
    },
    // 提交
    submit() {
      if (!this.$refs['basicInformationRef'].judgeWarn()) {
        return this.$nextTick(() => {
          console.log(this.$refs['basicInformationRef'].$refs['refWarn']);
          const refs = this.$refs['basicInformationRef'].$refs['refWarn'];
          let offsetTop = refs[0].$el.offsetParent.offsetTop;
          refs.forEach(item => {
            if (item.$el.offsetParent.offsetTop < offsetTop) {
              offsetTop = item.$el.offsetParent.offsetTop;
            }
          });
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
      if(this.isGLoading) return
       this.isGLoading = true
     
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
      flag &&
        submit(result).then(res => {
          this.initialData();
          this.$message({ type: 'success', message: res.data.data });
          this.rollTo(0)
        });
      !flag &&
        saveDraft(result).then(res => {
          this.initialData();
          this.$message({ type: 'success', message: res.data.data });
          this.rollTo(0)
        });
    },
    rollTo(offsetTop) {
      document
        .querySelector('.addApply')
        .scrollTo({ top: Number(offsetTop - 100), behavior: 'smooth' });
    },
    // 保存草稿
    save() {
      if (!this.$refs['basicInformationRef'].judgeWarnSave()) {
        return this.$nextTick(() => {
          const offsetTop =
            this.$refs['basicInformationRef'].$refs['refWarn'][0].$el.offsetParent.offsetTop;
          this.rollTo(offsetTop);
        });
      }
      const [result2, offsetTop2] = this.$refs['reviewMaterialRef'].judgeWarn(false);
      if (result2) {
        this.submitTrue(false);
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