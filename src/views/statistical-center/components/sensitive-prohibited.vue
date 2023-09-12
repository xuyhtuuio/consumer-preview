<template>
  <div class="sensitive-prohibited">
    <g-table-card :title="title">
      <template #head-right>
        <el-tooltip placement="top">
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
            <div class="cnt-title">{{ item.keywordContent }}</div>
            <div class="cnt-content my-ellipsis">
              {{ item.recommendedOpinions }}
            </div>
            <div class="cnt-info">
              <div class="flex">
                <span
                  :class="[
                    'left',
                    'class-common',
                    item.type === 1 ? 'class-zero' : 'class-one'
                  ]"
                  >{{ item.type === 1 ? '禁用词' : '敏感词' }}</span
                >
                <span class="center"
                  ><g-icon
                    class="left-icon"
                    stylePx="18"
                    href="#icon-yinyong"
                  />已引用 : <i class="high">{{ item.count }}</i
                  >次</span
                >
              </div>
              <span class="right">更新时间：{{ item.updateTime }}</span>
            </div>
          </div>
          <TrsPagination
            class="my-pagination"
            :pageSize="page.pageSize"
            :pageNow="page.pageNow"
            :total="page.total"
            @getList="handleCurrentChange"
          >
          </TrsPagination>
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
      titleInfo: '置顶>做多引用>最近更新',
      page: {
        pageNow: 1,
        pageSize: 3,
        total: 9
      },
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
          updateTime: '2023-08-09T10:32:31'
        }
      ]
    }
  },
  methods: {
    handleCurrentChange() {}
  }
}
</script>

<style lang="less" scoped>
@color-1: #86909c;
@color-2: #2d5cf6;
@color-3: #e5e6eb;
.sensitive-prohibited {
  color: #1d2128;
  .top-icon {
    position: relative;
    top: 1px;
    font-size: 20px;
    color: rgba(172, 177, 185, 1);

  }

  .my-content {
    width: 100%;
    .content-item {
      line-height: 22px;
      padding: 16px;
      border-bottom: 1px dotted @color-3;
      &:first-child {
        padding-top: 0;
      }
      .cnt-title {
        font-weight: 700;
      }
      .cnt-content {
        margin: 4px 0;
      }
      .cnt-info {
        display: flex;
        justify-content: space-between;
        line-height: 26px;
        .left {
          margin-right: 16px;
        }
        .center {
          display: flex;
          align-items: center;
          gap: 4px;
          .left-icon {
            height: 18px;
          }
          .high {
            color: @color-2;
          }
        }
        .right {
          color: @color-1;
        }
      }
    }
    .my-pagination {
      margin-top: -8px;
    }
  }
  .class-common {
    line-height: 22px;
    padding: 2px 6px;
    border-radius: 4px;
  }
  .class-one {
    background: #fff7e6;
    color: #fa8c16;
  }

  .class-zero {
    background: #fff1f0;
    color: #eb5757;
  }
}
</style>
