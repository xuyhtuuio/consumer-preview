<template>
  <div class="tCard" v-loading="loadingList">
    <div class="sort">
      <span class="sort1" @click="changeSortType('sort1')" :class="{ active: currentSort === 'sort1' }">
        按讨论量排序
        <i :class="sortObject.sort1 === 'desc' ? 'el-icon-bottom' : 'el-icon-top'"></i>
      </span>
      <span class="sort2" @click="changeSortType('sort2')" :class="{ active: currentSort === 'sort2' }">
        按关注数排序
        <i :class="sortObject.sort2 === 'desc' ? 'el-icon-bottom' : 'el-icon-top'"></i>
      </span>
    </div>
    <div class="card" v-for="(tag, index) in list" :key="tag.id">
      <div class="num">{{ tag.orderNum }}</div>
      <div class="avatar" :style="getStyle(index)">{{ tag.name.slice(0, 1) }}</div>
      <div class="content">
        <div class="title">
          <b class="title-text pointer" @click="toTagDetail(tag)">#{{ tag.name }}</b>
        </div>
        <div class="meta-info">
          <div class="meta-right">
            <span class="item">
              <span>讨论量：{{ tag.discussNum }}</span>
            </span>
            <span class="item">
              <span>关注量：{{ tag.attentionCount }}</span>
            </span>
            <span class="item">
              <span>精选量：{{ tag.selectedNum }}</span>
            </span>
          </div>
        </div>
        <div class="desc ellipsis ellipsis_1">
          {{ tag.knowledgeContent }}
        </div>
      </div>
      <div style="width: 92px;">
        <el-switch v-model="tag.isAttention" @change="changeAttention(tag)"></el-switch> 已关注
      </div>
    </div>
    <el-empty description="暂无数据" v-if="list.length === 0 && loadingList === false" style="background: #fff;"></el-empty>
  </div>
</template>
<script>
import { getAttentionTagList, setAttention } from '@/api/knowledge/knowledgeCollect'
export default {
  name: 'tag-list',
  data() {
    return {
      colors: [
        ['#E5E6EB', '#86909c'],
        ['#FFF7E6', '#F9CC45'],
        ['#FFF1F0', '#F98981'],
        ['#F9F0FF', '#B37FEB'],
        ['#E6FFFB', '#5EDFD6'],
      ],
      index: new Array(10).fill(1).map(() => Math.floor(Math.random() * 5)),
      list: [],
      sortObject: {
        sort1: 'desc',
        sort2: 'asc',
      },
      currentSort: 'sort1',
      defalutParams: {
        keyword: '',
        orderType: 'desc',
        orderValue: 2,
        pageNum: 1,
        pageSize: 10
      },
      loadingList: false
    }
  },
  computed: {
    getStyle() {
      return (i) => {
        return {
          background: this.colors[this.index[i % 10]][0],
          color: this.colors[this.index[i % 10]][1]
        }
      }
    },
  },
  created() {
    this.getAttentionTagList()
  },
  methods: {
    getSearchList(params) {
      this.defalutParams = this.$options.data().defalutParams
      this.sortObject = this.$options.data().sortObject
      this.currentSort = 'sort1'
      this.getAttentionTagList({
        ...this.defalutParams,
        ...params
      })
    },
    async getAttentionTagList(params) {
      this.loadingList = true
      const res = await getAttentionTagList({
        ...this.defalutParams,
        ...params
      })
      if (res.data.success) {
        this.list = (res.data.data.list || []).map(item => {
          item.isAttention = Boolean(item.isAttention)
          return item;
        })
        this.$emit('updateTagList', {
          total: res.data.data.totalCount,
          pageNow: res.data.data.pageNow
        })
      }
      this.loadingList = false
    },
    changeSortType(type) {
      if (this.currentSort === type) {
        if (this.sortObject[type] === 'desc') {
          this.sortObject[type] = 'aec'
        } else {
          this.sortObject[type] = 'desc'
        }
      } else {
        this.currentSort = type
      }
      this.getAttentionTagList({
        orderValue: +type.slice(-1),
        orderType: this.sortObject[type]
      })
    },
    async changeAttention(tag) {
      const res = await setAttention({
        type: 2,
        isAttention: tag.isAttention ? 1 : 0,
        id: tag.id
      })
      if (res.data.success) {
        if (tag.isAttention) {
          this.$message.success('关注成功')
          return;
        }
        this.$message.success('取消关注成功')
      }
    },
    toTagDetail(tag) {
      this.$emit('toTagDetail', tag)
    }
  }
}
</script>
<style lang="less" scoped>
.tCard {
  width: calc(100vw - 372px);
}
.card {
  width: calc(100vw - 372px);
  display: flex;
  align-items: center;
  background: #FFFFFF;
  padding: 16px 16px 16px 0;
  .num {
    padding: 10px 0 10px 16px;
    font-weight: 700;
  }
  .avatar {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 56px;
    height: 56px;
    margin: 0 16px;
    font-size: 14px;
    border-radius: 50%;
  }
  .content {
    position: relative;
    width: calc(100% - 217px);
    margin-right: 16px;
    font-size: 12px;
    line-height: 20px;
    .title {
      margin-bottom: 4px;
      line-height: 18px;
      &-tag {
        display: inline-block;
        margin-right: 4px;
        color: #FFF;
        padding: 2px 4px;
        background: #EB5757;
        border-radius: 2px;
      }
      &-menu {
        display: inline;
        position: absolute;
        right: 0;
        top: -5px;
        color: #86909C;
        cursor: pointer;
      }
    }
    .desc {
      color: #505968;
    }
  }
  .meta-info {
    color: #505968;
    font-weight: 400;
    .meta-right {
      .item {
        margin-right: 20px;
      }
    }
  }
  &:hover {
    border-radius: 8px;
    background: #F7F8FA;
  }
}
.sort {
  // width: calc(100vw - 372px);
  padding: 16px 16px 4px;
  background: #FFFFFF;
  & > span {
    margin-right: 16px;
    cursor: pointer;
  }
  .active {
    color: #2D5CF6;
  }
}
</style>
