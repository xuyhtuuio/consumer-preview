<!--
 * @Author: nimeimix huo.linchun@trs.com.cn
 * @Date: 2023-10-24 11:21:09
 * @LastEditors: nimeimix huo.linchun@trs.com.cn
 * @LastEditTime: 2023-11-03 10:35:32
 * @FilePath: /consumer-preview/src/views/rules-base/components/filters.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="law-filters">
    <div class="total">共 {{ total }} 条</div>
    <div class="sort">
      <ul class="column">
        <li
          v-for="(item, index) in sorts"
          :key="index"
          :class="[
            'column-item',
            item.orderColumn == crtColumn ? 'active-sort' : ''
          ]"
          @click="changeColumn(item)"
        >
          {{ item.name }}
          <i class="el-icon-bottom" v-if="item.order == 'desc'"></i>
          <i class="el-icon-top" v-else></i>
        </li>
      </ul>
      <el-button class="new-add" @click="addRule">
        <span class="flex"><i class="iconfont icon-add-law"></i>新增</span>
      </el-button>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    total: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      crtColumn: 'pub_time',
      sorts: [
        {
          name: '按发布时间排序',
          order: 'desc',
          orderColumn: 'pub_time'
        },
        {
          name: '按更新时间排序',
          order: 'desc',
          orderColumn: 'u_time'
        },
        {
          name: '按阅读次数排序',
          order: 'desc',
          orderColumn: 'read_count'
        }
      ]
    }
  },
  mounted() {},
  computed: {},
  methods: {
    addRule() {
      this.$emit('addRule')
    },
    initSort() {
      this.crtColumn = 'pub_time'
      this.sorts.forEach((m) => {
        m.order = 'desc'
      })
    },
    changeColumn(item) {
      // 切换排序
      if (item.orderColumn === this.crtColumn) {
        item.order = item.order === 'desc' ? 'acs' : 'desc'
      }
      this.crtColumn = item.orderColumn
      this.$emit('sortChange', item)
    }
  }
}
</script>
<style scoped lang="less">
.law-filters {
  display: flex;
  font-size: 14px;
  font-weight: 400;
  color: #1d2128;
  line-height: 22px;
  justify-content: space-between;
  align-items: center;
  .new-add {
    border-radius: 4px;
    background: #2d5cf6;
    font-weight: 400;
    line-height: 22px;
    font-size: 12px;
    color: #fff;
    display: flex;
    align-items: center;
    span {
      display: flex;
      align-items: center;
    }
    .iconfont {
      font-size: 22px;
    }
  }

  .sort,
  .column {
    display: flex;
    align-items: center;
  }
  .column-item {
    margin-right: 8px;
    padding: 0 8px;
    cursor: pointer;
  }
  .active-sort {
    color: #2d5cf6;
  }
  .rotate {
    transform: rotate(90deg);
  }
}
</style>
