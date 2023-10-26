<!--
 * @Author: nimeimix huo.linchun@trs.com.cn
 * @Date: 2023-10-25 18:21:55
 * @LastEditors: nimeimix huo.linchun@trs.com.cn
 * @LastEditTime: 2023-10-26 11:03:17
 * @FilePath: /consumer-preview/src/views/rules-base/components/relevancy-tag.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div>
    <el-popover placement="bottom-start" :width="260" trigger="click">
      <div class="content">
        <el-input
          v-model.trim="search"
          size="mini"
          class="is-dark"
          placeholder="请输入关键词搜索"
        ></el-input>
        <ul class="tags-list trs-scroll">
          <li class="tag-li pointer" v-if="!tagsList.includes(search) && search">
            <span :class="{ 'tag-text ellipsis': true }">#{{ search }}</span>
            <span style="color: #2d5cf6" @click="updateTag(search)"
              >添加标签</span
            >
          </li>
          <li
            class="tag-li pointer"
            v-for="(tag, index) in tagsList"
            :key="index"
            @mouseover="hoverText = tag"
            @mouseout="hoverText = ''"
            @click="addTags(tag)"
          >
            <span
              :class="{ 'tag-text ellipsis': true, tagged: tags.includes(tag) }"
              >#{{ tag }}</span
            >
            <span
              v-if="tags.includes(tag)"
              style="color: #2d5cf6"
              @click="addTags(tag)"
              >已添加</span
            >
          </li>
        </ul>
        <el-empty
          v-if="search && tagsList.length === 0"
          description="暂无数据"
          size="small"
        ></el-empty>
      </div>
      <template #reference>
        <i class="button pointer tags">
          <i class="img">+</i>
          <i class="text">关联标签</i>
        </i>
      </template>
    </el-popover>
  </div>
</template>
<script>
export default {
  props: {
    handlerTag: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      search: '',
      hoverText: '',
      tags: [],
      tagsList: [
        '案范围分为',
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
      ]
    }
  },
  watch: {
    handlerTag(val) {
      this.$set(this.tags, [], val)
    }
  },
  methods: {

    initData(tags) {
      this.tags = tags
    },
    addTags(tag) {
      if (this.tags.includes(tag)) return
      this.tags.push(tag)
      this.$emit('passTag', this.tags)
    },
    updateTag(tag) {
      this.tagsList.unshift(tag)
    }
  }
}
</script>
<style lang="less" scoped>
.tags-list {
  margin-top: 16px;
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
    .tagged {
      color: #2d5cf6;
    }
  }
}
</style>
