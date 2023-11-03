<template>
  <div class="sensitive-prohibited" v-loading="isShow">
    <g-table-card :title="title">
      <template #head-right>
        <el-tooltip placement="top">
          <div slot="content">{{ titleInfo }}</div>
          <i class="iconfont icon-tishi1 top-icon"></i>
        </el-tooltip>
      </template>
      <template #content>
        <div class="my-content">
          <template v-if="list.length">
            <div
              class="content-item"
              v-for="(item, index) in list"
              :key="'content' + index"
            >
              <div class="cnt-title">
                <span
                  class="iconfont icon-Frame1"
                  :class="[item.type === 2 && 'active']"
                ></span>
                {{ item.content }}
              </div>

              <el-popover
                placement="bottom"
                trigger="hover"
                :content="item.opinion"
              >
                <div slot="reference" class="cnt-content my-ellipsis">
                {{ item.opinion }}
              </div>
              </el-popover>
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
          </template>
          <template v-else>
            <empty></empty>
          </template>
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
import { commonKeywordsPaginationList } from '@/api/statistical-center'
export default {
  data() {
    return {
      title: '常见敏感词/禁用词',
      isShow: true,
      titleInfo: '置顶>做多引用>最近更新',
      page: {
        pageNow: 1,
        pageSize: 3,
        total: 9
      },
      list: [],
      searchData: {}
    }
  },
  methods: {
    async initData(data) {
      this.isShow = true
      if (data !== this.searchData) {
        this.searchData = data
        this.page.pageNow = 1
        this.searchData = data
      }
      const { data: res } = await commonKeywordsPaginationList({
        ...data,
        pageNum: this.page.pageNow,
        pageSize: this.page.pageSize
      })
      if (res.success) {
        this.list = res.data.list
        this.page.total = res.data.totalCount
      }
      this.isShow = false
    },
    handleCurrentChange(val) {
      this.page.pageNow = val
      this.initData(this.searchData)
    }
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
        display: flex;
        gap: 5px;
        font-weight: 700;
        .iconfont {
          width: 16px;
          height: 16px;
          color: #eb5757;
          font-weight: 400;
          &.active {
            color: #fa8c16;
          }
        }
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
