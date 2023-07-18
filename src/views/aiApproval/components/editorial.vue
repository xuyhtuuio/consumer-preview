<template>
  <div class="editorial">
    <div class="header">
      <span v-show="showRecommend" :class="{ active: active === 1 }" @click="changeType(1)">推荐意见 9</span>
      <i v-show="showRecommend">|</i>
      <span :class="{ active: active === 2 }" @click="changeType(2)">已编辑意见 5</span>
    </div>
    <div class="results">
      <!-- 推荐意见 -->
      <template v-if="active === 1">
        <div class="recommend" v-for="(recommend, a) in recommends" :key="recommend.word">
          <span class="recommend-word" :wordType="recommend.wordType">{{ recommend.word }}</span>
          <div class="list-item" v-for="(item, i) in recommend.list.slice(0, recommend.hideMore ? 3: recommend.list.length)" :key="i">
            <p style="cursor: pointer;" @dblclick="showEdit(a, i)" v-if="!item.showEdit">{{ item.str }}</p>
            <el-input v-else :ref="`input_${a}_${i}`" @blur="hideEdit(a, i)" v-model.trim="input" placeholder="请输入意见"
              type="textarea" :rows="3" class="edit-input" resize="none"></el-input>
            <i class="checkbox" @click="changeSelect(a, i)" :class="{active : item.id === recommend.selectd}"></i>
          </div>
          <!-- 展开收起 -->
          <p class="list-btns">
            <i class="iconfont icon-zhankai" @click="getMoreList(a)" v-if="recommend.hideMore || recommend.totalPage > recommend.pageNow"></i>
            <i class="iconfont icon-shouqi" @click="hideList(a)" v-if="recommend.pageNow > 1 && !recommend.hideMore"></i>
          </p>
        </div>
      </template>
      <!-- 编辑意见 -->
      <template v-else></template>
    </div>
  </div>
</template>

<script>
export default {
  name: 'editorial',
  props: {
    approval: {
      type: Object,
      default: () => ({})
    },
  },
  watch: {
    approval: {
      handler(val) {
        const ocrType = ['pdf', 'jpeg', 'jpg', 'png'].includes(val.fileName.split('.')[1])
        this.showRecommend = ocrType;
        this.active = ocrType ? 1 : 2;
        this.recommends = val.recommends.map(item => {
          item.hideMore = false;
          item.selectd = null;
          return item
        });
      },
      deep: true
    }
  },
  data() {
    return {
      active: 1,
      showRecommend: true,
      recommends: [],
      collection: [], // 最后的编辑及意见,需反向修改 对应选中的 意见
      input: ''
    }
  },
  methods: {
    changeSelect(a, i) {
      this.recommends[a].selectd = this.recommends[a].list[i].id;
    },
    getMoreList(a) {
      this.$set(this.recommends[a], 'hideMore', false);
      if (this.recommends[a].pageNow < this.recommends[a].totalPage) {
        this.recommends[a].pageNow++;
        this.recommends[a].list.push({
          str: 4
        },{
          str: 4
        },{
          str: 4
        })
      }
    },
    hideList(a) {
      this.$set(this.recommends[a], 'hideMore', true);
    },
    showEdit(a, i) {
      this.$set(this.recommends[a].list[i], 'showEdit', true);
      this.input = this.recommends[a].list[i].str;
      this.$nextTick(() => {
        this.$refs[`input_${a}_${i}`][0].focus()
      })
    },
    hideEdit(a, i) {
      this.$set(this.recommends[a].list[i], 'showEdit', false);
      this.$set(this.recommends[a].list[i], 'str', this.input);
      if (this.input !== this.recommends[a].list[i].str) {
        // 在父组件更新文件对应 内容
      }
    },
    changeType(val) {
      this.active = val;
    }
  }
}
</script>

<style lang="less" scoped>
.editorial {
  display: flex;
  flex-direction: column;
}

.header {
  background: #F7F8FA;
  padding: 9px 20px;
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: space-around;

  >span {
    flex: 1;
    display: inline-block;
    text-align: center;
    padding: 4px 10px;
    line-height: 22px;
    font-size: 14px;
    white-space: pre;
    color: #86909C;
    cursor: pointer;
    height: fit-content;

    &.active {
      color: #333333;
      font-weight: 700;
    }
  }

  i {
    color: #86909C;
    margin: 0 10px;
  }
}

.results {
  background: #ffffff;
  flex: 1;
  margin: 24px 16px;
  overflow-y: auto;
  word-break: break-all;
  color: #1D2128;
  line-height: 22px;
  font-size: 14px;
  font-weight: 400;
}

.recommend {
  margin-bottom: 24px;
  &-word {
    padding: 2px 20px;
    border-radius: 4px;
    display: inline-block;
    &[wordtype="1"] {
      color: #F76560;
      background: #FDF1F4;
    }

    &[wordtype="2"] {
      color: #FDB123;
      background: #FFF7E6;
    }
  }
  /deep/ .edit-input textarea{
    border-color: #E5E6EB;
    padding: 10px 12px;
    &:focus{
      border-color: #80A6FF;
    }
  }
}
.list-item{
  margin-top: 10px;
  padding: 10px 50px 10px 42px;
  position: relative;
  border-radius: 8px;
  background: #F9F9FB;

  &::before{
    counter-increment: section;
    content: counters(section,".") ".";
    position: absolute;
    left: 20px;
  }
  .checkbox{
    content: ' ';
    display: inline-block;
    position: absolute;
    border: 1px solid #306EF5;
    border-radius: 4px;
    width: 20px;
    height: 20px;
    right: 20px;
    top: 10px;
    color: #ffffff;
    cursor: pointer;
    &.active{
      content: '√';
      background: #2D5CF6;
    }
  }
}
.list-btns{
  text-align: center;
  color: #306EF5;
  display: flex;
  justify-content: center;
  gap: 10px;
  i{
    font-size: 12px;
    background: #F9F9FB;
    border-radius:  0px 0px 10px 10px;
    padding: 6px 30px;
    cursor: pointer;
    
  }
}
</style>