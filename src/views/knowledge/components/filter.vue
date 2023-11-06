<template>
  <div class="filter">
    <div class="main">
      <span class="total">
        共
        <span class="num">{{ total }}</span>
        条
      </span>
      <el-popover
        placement="bottom-start"
        :width="260"
        trigger="click"
      >
        <div class="content">
          <el-input v-model.trim="serach" @keypress.native.enter="changeJustCare" size="mini" class="is-dark" placeholder="请输入关键词搜索"></el-input>
          <div style="position: relative; top: 12px;font-size: 12px;">
            <el-switch v-model="justCare" @change="changeJustCare" size="mini" style="position: relative; bottom: 2px;"></el-switch>
            仅看我关注的
          </div>
          <ul class="tags-list trs-scroll" v-loading="loadingTag">
            <li class="tag-li pointer" v-for="(tag, index) in tagsList" :class="{ active: checkedTags.includes(tag.id) }" :key="index" @click="changeCheckedTags(tag.id)">
              <span class="tag-text ellipsis">#{{ tag.name }}</span>
            </li>
          </ul>
          <Empty v-if="serach && tagsList.length === 0"></Empty>
        </div>
        <template #reference>
          <span class="button pointer tags-select">
            <span class="text">选择标签项 </span>
            <img v-if="!checkedTags.length" src="@/assets/image/person-center/down.png" style="width: 10px;"/>
            <template v-else>
              <span class="num">{{ checkedTags.length }}</span>
              <i class="el-icon-error" @click="deleteTags"></i>
            </template>
          </span>
        </template>
      </el-popover>
      <span class="sort">
        <!-- <span class="sort1" @click="changeSortType('sort1')" :class="{ active: currentSort === 'sort1' }">
          按点赞数排序
          <i :class="sortObject.sort1 === 'desc' ? 'el-icon-bottom' : 'el-icon-top'"></i>
        </span> -->
        <span class="sort2" @click="changeSortType('sort2')" :class="{ active: currentSort === 'sort2' }">
          按更新时间排序
          <i :class="sortObject.sort2 === 'desc' ? 'el-icon-bottom' : 'el-icon-top'"></i>
        </span>
        <span class="sort3" @click="changeSortType('sort3')" :class="{ active: currentSort === 'sort3' }">
          按发布时间排序
          <i :class="sortObject.sort3 === 'desc' ? 'el-icon-bottom' : 'el-icon-top'"></i>
        </span>
        <span class="sort4">
          <el-switch v-model="sortObject.justSelected" @change="changeJustSelected" size="mini" style="position: relative; bottom: 2px;"></el-switch>
          仅看精选
        </span>
      </span>
    </div>
  </div>
</template>
<script>
import { getTagInfoList } from '@/api/knowledge/knowledgeCollect'
export default {
  name: 'knowledge-filter',
  props: {
    total: {
      type: Number
    }
  },
  data() {
    return {
      loadingTag: false,
      serach: '',
      tagsList: [],
      checkedTags: [],
      justCare: false, // 仅看我关注的
      sortObject: {
        sort1: 'desc',
        sort2: 'desc',
        sort3: 'asc',
        justSelected: false,
      },
      currentSort: 'sort2'
    }
  },
  async created() {
    const data = await this.getTagInfoList({
      justCare: 0,
      keyword: ''
    })
    this.$store.state.setDefalutTagsList = data
  },
  methods: {
    resetForm() {
      this.currentSort = 'sort2'
      this.checkedTags = []
      this.sortObject.justSelected = false
    },
    async getTagInfoList(data) {
      this.loadingTag = true
      const res = await getTagInfoList(data)
      if (res.data.success) {
        this.tagsList = res.data.data
      } else {
        this.tagsList = []
      }
      this.loadingTag = false
      return this.tagsList
    },
    changeJustCare() {
      this.getTagInfoList({
        justCare: this.justCare ? 1 : 0,
        keyword: this.serach
      })
    },
    changeCheckedTags(tagId) {
      const index = this.checkedTags.findIndex(item => item === tagId);
      if (index === -1) {
        this.checkedTags.push(tagId)
      } else {
        this.checkedTags.splice(index, 1)
      }
      this.$emit('changeTags', JSON.parse(JSON.stringify(this.checkedTags)))
    },
    deleteTags() {
      this.checkedTags = []
      this.$emit('changeTags', [])
    },
    changeSortType(type) {
      if (this.currentSort === type) {
        if (this.sortObject[type] === 'desc') {
          this.sortObject[type] = 'asc'
        } else {
          this.sortObject[type] = 'desc'
        }
      } else {
        this.currentSort = type
      }
      this.$emit('changeSort', {
        orderValue: +type.slice(-1),
        orderType: this.sortObject[type],
        justSelected: this.sortObject.justSelected ? 1 : 0
      })
    },
    changeJustSelected() {
      this.$emit('changeSort', {
        orderValue: +this.currentSort.slice(-1),
        orderType: this.sortObject[this.currentSort],
        justSelected: this.sortObject.justSelected ? 1 : 0
      })
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
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
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
      .sort4 {
        margin-right: 0;
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
