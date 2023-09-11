<template>
  <div class="sensitive-prohibited">
    <g-table-card>
      <template #head-title>
        {{ title }}
        <el-tooltip placement="top" style="margin-left: 8px">
          <div slot="content">{{ titleInfo }}</div>
          <i class="iconfont icon-tishi1 top-icon"></i>
        </el-tooltip>
      </template>
      <template #content>
        <div class="my-content">
          <div
            class="content-item"
            v-for="(item, index) in list"
            :key="'content' + index"
          >
          </div>
        </div>
      </template>
    </g-table-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: '常见敏感词/禁用词',
      titleInfo: '12313231313',
      list: [
        {
          count: 100,
          createTime: '2023-07-22T18:55:57',
          keywordContent: '最高',
          recordId: 3,
          status: 1,
          type: 1,
          recommendedOpinions:
            '车险赔付未赔付至被保险人，如理赔环节未经过客户同意直赔至修理厂。在定损环节务必告知被保险人定损金额，包括三者财产、人伤的赔付金额，并在赔付后通过电话或者短信方式告知被保险人赔款已支付，严格遵守理赔流程，尽到告知义务。',
          updateTime: '2023-08-09T10:32:31'
        },
        {
          count: 100,
          createTime: '2023-07-22T18:55:57',
          keywordContent: '最高',
          recordId: 3,
          status: 1,
          type: 2,
          recommendedOpinions:
            '车险赔付未赔付至被保险人，如理赔环节未经过客户同意直赔至修理厂。在定损环节务必告知被保险人定损金额，包括三者财产、人伤的赔付金额，并在赔付后通过电话或者短信方式告知被保险人赔款已支付，严格遵守理赔流程，尽到告知义务。',
          updateTime: '2023-08-09T10:32:31',
        },
        {
          count: 100,
          createTime: '2023-07-22T18:55:57',
          keywordContent: '最高',
          recordId: 3,
          status: 1,
          type: 2,
          recommendedOpinions:
            '车险赔付未赔付至被保险人，如理赔环节未经过客户同意直赔至修理厂。在定损环节务必告知被保险人定损金额，包括三者财产、人伤的赔付金额，并在赔付后通过电话或者短信方式告知被保险人赔款已支付，严格遵守理赔流程，尽到告知义务。',
          updateTime: '2023-08-09T10:32:31',
        },
      ]
    }
  }
}
</script>

<style lang="less" scoped>
.sensitive-prohibited {
  .my-content {
    .content-item {
      padding: 8px;
    }
  }
}
</style>
