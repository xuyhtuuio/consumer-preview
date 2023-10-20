<template>
  <div class="filter">
    <div class="main">
      <span class="total">
        共
        <span class="num">32045</span>
        条
      </span>
      <el-popover
        placement="bottom-start"
        :width="260"
        trigger="hover"
      >
        <div class="content">
          <el-input v-model.trim="serach" size="mini" class="is-dark" placeholder="请输入关键词搜索"></el-input>
          <div style="position: relative; top: 12px;">
            <el-switch v-model="isFollow" size="mini" style="position: relative; bottom: 2px;"></el-switch>
            仅看我关注的
          </div>
          <ul class="tags-list trs-scroll">
            <li class="tag-li pointer" v-for="(tag, index) in tagsList" :class="{ active: checkedTags.includes(tag) }" :key="index" @click="changeCheckedTags(tag)">
              <span class="tag-text ellipsis">#{{ tag }}</span>
            </li>
          </ul>
          <el-empty v-if="serach && tagsList.length === 0" description="暂无数据"></el-empty>
        </div>
        <template #reference>
          <span class="button pointer tags-select">
            <span class="text">选择标签项 </span>
            <img v-if="!checkedTags.length" src="@/assets/image/person-center/down.png" style="width: 10px;"/>
            <template v-else>
              <span class="num">{{ checkedTags.length }}</span>
              <i class="el-icon-error" @click="checkedTags = []"></i>
            </template>
          </span>
        </template>
      </el-popover>
      <span class="sort">
        <span class="sort1" @click="changeSortType('sort1')" :class="{ active: currentSort === 'sort1' }">
          按点赞数排序
          <i :class="sortObject.sort1 === 'desc' ? 'el-icon-bottom' : 'el-icon-top'"></i>
        </span>
        <span class="sort2" @click="changeSortType('sort2')" :class="{ active: currentSort === 'sort2' }">
          按更新时间排序
          <i :class="sortObject.sort2 === 'desc' ? 'el-icon-bottom' : 'el-icon-top'"></i>
        </span>
        <span class="sort3" @click="changeSortType('sort3')" :class="{ active: currentSort === 'sort3' }">
          按发布时间排序
          <i :class="sortObject.sort3 === 'desc' ? 'el-icon-bottom' : 'el-icon-top'"></i>
        </span>
        <span class="sort4">
          <el-switch v-model="sortObject.sort4" size="mini" style="position: relative; bottom: 2px;"></el-switch>
          仅看精选
        </span>
      </span>
    </div>
  </div>
</template>
<script>
export default {
  name: 'knowledge-filter',
  data() {
    return {
      serach: '',
      tagsList: [
        '案',
        'afws wefwef文',
        'wefwae问的人违反文档威风威风为',
        '阿尔法违法未',
        '案范围分为1',
        'afws wefwef文1',
        'wefwae问的人违反',
        '阿尔法违法未1',
        '案范围分为2',
        'afws wefwef文2',
        'wefwae问的人违反2',
        '阿尔法违法未2',
        '案范围分为3',
        'afws wefwef文3',
        'wefwae问的人违反3',
        '阿尔法违法未3',
        '案范围分为4',
        'afws wefwef文4',
        'wefwae问的人违反4',
        '阿尔法违法未4'
      ],
      checkedTags: [],
      isFollow: false, // 仅看我关注的
      sortObject: {
        sort1: 'desc',
        sort2: 'desc',
        sort3: 'aec',
        sort4: false,
      },
      currentSort: 'sort1'
    }
  },
  methods: {
    changeCheckedTags(tag) {
      const index = this.checkedTags.findIndex(item => item === tag);
      if (index === -1) {
        this.checkedTags.push(tag)
      } else {
        this.checkedTags.splice(index, 1)
      }
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
    }
  }
}
</script>
<style lang="less" scoped>
.filter {
  position: relative;
  margin-top: 12px;
  padding: 16px 20px;
  width: calc(100vw - 372px);
  background: #FFFFFF;
  border-radius: 10px;
  .main {
    .total {
      font-size: 14px;
      .num {
        color: #2D5CF6;
      }
    }
    .sort {
      float: right;
      & > span {
        margin-right: 16px;
        cursor: pointer;
      }
      .active {
        color: #2D5CF6;
      }
    }
  }
}
.tags-list {
  margin-top: 20px;
  max-height: 200px;
  overflow: auto;
  .tag-li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 3px 8px;
    font-size: 12px;
    .tag-text {
      width: 150px;
    }
  }
  .active {
    color: #2D5CF6;
  }
}
.num {
  color: #2D5CF6;
}
.tags-select {
  margin-left: 10px;
  padding: 4px 10px;
  border: 1px solid #E5E6EB;
  border-radius: 4px;
}
.el-icon-error {
  position: relative;
  right: -2px;
  top: 1px;
  cursor: pointer;
  font-size: 16px;
  opacity: 0.4;
}
</style>
