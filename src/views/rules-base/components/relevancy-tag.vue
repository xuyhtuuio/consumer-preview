<!--
 * @Author: nimeimix huo.linchun@trs.com.cn
 * @Date: 2023-10-25 18:21:55
 * @LastEditors: nimeimix huo.linchun@trs.com.cn
 * @LastEditTime: 2023-10-31 15:18:33
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
          <li
            class="tag-li pointer"
            v-if="
              !tagsList.includes(search) && search
            "
          >
            <span :class="{ 'tag-text ellipsis': true }">#{{ search }}</span>
            <span style="color: #2d5cf6" @click="updateTag(search)"
              >创建新标签</span
            >
          </li>
          <li
            class="tag-li pointer"
            v-for="(tag, index) in tagsList"
            :key="index"
            @click="addTags(tag)"
          >
            <span
              :class="{
                'tag-text ellipsis': true,
                tagged: tags.includes(tag)
              }"
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
import {
  queryTagCode,
  queryBenefitLabel,
  insertTagCode,
  insertBenefitLabel
} from '@/api/knowledge/knowledgeCollect'
export default {
  props: {
    tagType: {
      type: String,
      default: ''
    },
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
      tagIds: [],
      tagsList: []
    }
  },
  watch: {
    handlerTag(val) {
      this.tags = val
    }
  },
  mounted() {
    this.searchTag()
  },
  methods: {
    initData(tags) {
      this.tags = tags
    },
    // 查询tag
    async searchTag() {
      if (this.tagType === 'tag') {
        const res = await queryTagCode()
        const { data } = res.data
        this.tagsList = data?.map((m) => {
          return m.name
        }) || []
      } else if (this.tagType === 'benefit') {
        const res = await queryBenefitLabel()
        const { data } = res.data
        this.tagsList = data?.map((m) => {
          return m.name
        }) || []
      }
    },
    addTags(tag) {
      if (this.tags.includes(tag)) {
        const index = this.tags.findIndex((m) => {
          return m === tag
        })
        this.tags.splice(index, 1)
      } else {
        this.tags.push(tag)
        this.$emit('passTag', this.tags)
      }
    },
    async updateTag(tag) {
      const params = {
        name: tag
      }
      if (this.tagType === 'tag') {
        await insertTagCode(params)
      } else if (this.tagType === 'benefit') {
        await insertBenefitLabel(params)
      }
      this.searchTag()
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
