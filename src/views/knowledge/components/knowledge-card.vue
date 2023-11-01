<template>
  <div class="kCard">
    <div class="card">
      <div class="avatar" :style="getStyle()">{{ data.pinYinHeader }}</div>
      <div class="content">
        <div class="title">
          <img v-if="data.isSelected" src="@/assets/image/knowledge/精选.svg" style="margin-right:4px;"/>
          <b class="title-tag" :class="{ green: data.type === 1 }" v-if="data.type > 0">{{ data.type === 1 ? '正' : '反' }}</b>
          <b class="title-text">{{ data.title }}</b>
          <el-popover
            placement="bottom-start"
            :width="100"
            trigger="hover"
            popper-class="k-card">
            <ul class="content">
              <li @click="handleSelected">{{ data.isSelected > 0 ? '取消' : '设为' }}精选</li>
              <li @click="copyClipboard(data.content)">复制</li>
              <li @click="deleteKnowledge">删除</li>
            </ul>
            <template #reference>
              <b class="title-menu">...</b>
            </template>
          </el-popover>
        </div>
        <div class="desc" style="position: relative;">
          <span :id="`computedtextheight_${data.id}`" :class="{ 'ellipsis ellipsis_2': !(data.isCollaplse && data.showCollaplse === false) }">
            {{ data.content }}
            <span class="pointer" v-if="data.isCollaplse && data.showCollaplse === false" style="font-size:14px;color:#2D5CF6;" @click="changeCollaplse(true)">收起 <i class="el-icon-arrow-up"></i></span>
          </span>
          <span v-if="data.showCollaplse" class="pointer" style="position: absolute;right:0;bottom: 0;display:inline-block;background:#fff;">
            ...
            <span style="font-size:14px;color:#2D5CF6;" @click="changeCollaplse(false)">展开全部 <i class="el-icon-arrow-down"></i></span>
          </span>
        </div>

        <template v-for="(tag, index) in data.tagList">
          <el-popover
            placement="bottom-start"
            :width="260"
            :show-after="1200"
            trigger="hover"
            :key="index"
            @show="showTagEvent(tag)">
            <div class="content" v-loading="loadingTag">
              <img src="@/assets/image/knowledge/标签.svg" />
              <b style="font-size:12px;">{{ tag.name }}</b>
              <div class="info">
                <div class="left">
                  <p class="title">讨论量</p>
                  <p class="num">{{ tag.discussNum }}</p>
                </div>
                <div class="middle">
                  <p class="title">精选量</p>
                  <p class="num">{{ tag.selectedNum }}</p>
                </div>
                <div class="middle">
                  <p class="title">关注量</p>
                  <p class="num">{{ tag.attentionCount }}</p>
                </div>
              </div>
              <div style="text-align:center;margin:16px;">
                <el-button type="primary" @click="handleCollect(2, tag)">
                {{ tag.isAttention === 1 ? '取消关注' : '关注标签' }}
                </el-button>
              </div>
            </div>
            <template #reference>
            <TrsTag
              style="margin: 12px 0;margin-right: 10px;cursor: pointer;"
              :tag="{ label: tag.name, ...tagConfig }"
            />
            </template>
          </el-popover>
        </template>

        <div class="meta-info">
          <div class="meta-left">
            <span class="time">{{ data.releaseTime }}</span>来自:
            <span class="dept">{{ data.orgName }}</span>
          </div>
          <div class="meta-right">
            <span class="item" @click="handleZan">
              <img v-if="data.isLiked > 0" src="@/assets/image/knowledge/赞1.svg" />
              <img v-else src="@/assets/image/knowledge/赞.svg" />
              <span>{{ data.upvoteCount }}</span>
            </span>
            <span class="item" @click="openComment">
              <img v-if="data.extends > 0" src="@/assets/image/knowledge/评论1.svg" />
              <img v-else src="@/assets/image/knowledge/评论.svg" />
              <span>{{ data.extends > 0 ? '收起评论' : `${data.commentCount}条评论` }}</span>
            </span>
            <el-popover
              placement="bottom-start"
              :width="150"
              :show-after="1200"
              trigger="hover"
              popper-class="k-card">
              <ul class="content">
                <li @click="copeLink(data)">
                  <img src="@/assets/image/knowledge/复制.svg" />
                  复制链接
                </li>
                <li @click="createImage(data)">
                  <img src="@/assets/image/knowledge/图片.svg" />
                  生成图片
                </li>
              </ul>
              <template #reference>
                <span class="item">
                  <img src="@/assets/image/knowledge/分享.svg" />
                  <span>分享</span>
                </span>
              </template>
            </el-popover>
            <span class="item" @click="handleCollect(1, data)">
              <img v-if="data.isAttention > 0" src="@/assets/image/knowledge/收藏1.svg" />
              <img v-else src="@/assets/image/knowledge/收藏.svg" />
              <span>收藏</span>
            </span>
          </div>
        </div>
        <div class="picture">
          <span v-for="(item) in data.fileList" :key="item.key">
            <el-popover
            placement="bottom-start"
            :width="260"
            :show-after="200"
            trigger="hover"
            :key="item.key">
            <div class="content">
              <b style="font-size:12px;">{{ item.fileName }}</b>
            </div>
            <template #reference>
              <el-image v-if="['jpeg', 'jpg', 'png'].includes(getfileType(item.fileName))" :src="item.url" :preview-src-list="[item.url]"></el-image>
              <div v-else @click="newPageOpen(item.url)"><file-type :fileName="item.fileName"></file-type></div>
            </template>
            </el-popover>
          </span>
        </div>
      </div>
    </div>
    <CommentCard v-if="data.extends > 0" :id="data.id" :fullName="data.fullName"></CommentCard>
    <div style="height: 16px;border-top: 1px dotted #E5E6EB;"></div>
  </div>
</template>
<script>
import fileType from '@/components/common/file-type'
import { copyText } from '@/utils/Clipboard';
import { setSelected, setLike, setAttention, deleteKnowledge, getTagBaseInformation } from '@/api/knowledge/knowledgeCollect'
import CommentCard from './comment-card'
export default {
  name: 'knowledge-card',
  components: {
    fileType,
    CommentCard
  },
  props: {
    data: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      loadingTag: false,
      colors: [
        ['#E5E6EB', '#86909c'],
        ['#FFF7E6', '#F9CC45'],
        ['#FFF1F0', '#F98981'],
        ['#F9F0FF', '#B37FEB'],
        ['#E6FFFB', '#5EDFD6'],
      ],
      tagConfig: {
        background: '#f0f6ff',
        color: '#2d5cf6',
        borderColor: 'transparent',
        borderRadius: '20px',
        closable: false,
        size: 'mini'
      },
      index: Math.floor(Math.random() * 5),
    }
  },
  computed: {
    getfileType() {
      return val => {
        return val?.split('.')[val.split('.').length - 1]
      }
    },
    getStyle() {
      return () => {
        return {
          background: this.colors[this.index][0],
          color: this.colors[this.index][1]
        }
      }
    },
  },
  mounted() {
    const { knowledgeId } = this.$route.query
    if (knowledgeId) {
      this.$set(this.data, 'showCollaplse', false)
      return;
    }
    this.computedTextHeight(`computedtextheight_${this.data.id}`)
  },
  methods: {
    newPageOpen(url) {
      window.open(url)
    },
    computedTextHeight(id) {
      this.$nextTick(() => {
        const text = document.getElementById(id)
        if (text.scrollHeight !== text.clientHeight) {
          this.data.isCollaplse = true
          this.$set(this.data, 'showCollaplse', true)
          return;
        }
        this.$set(this.data, 'showCollaplse', false)
      })
    },
    changeCollaplse(val) {
      this.$set(this.data, 'showCollaplse', val)
    },
    async showTagEvent(tag) {
      this.loadingTag = true
      const res = await getTagBaseInformation({
        tagId: tag.id
      })
      if (res.data.success) {
        const detail = res.data.data
        this.$set(tag, 'discussNum', detail.discussNum)
        this.$set(tag, 'selectedNum', detail.selectedNum)
        this.$set(tag, 'attentionCount', detail.attentionCount)
        this.$set(tag, 'isAttention', detail.isAttention)
      }
      this.loadingTag = false
    },
    async handleZan() {
      const res = await setLike({
        type: 1,
        isLike: this.data.isLiked ? 0 : 1,
        id: this.data.id
      })
      if (res.data.success) {
        if (this.data.isLiked) {
          this.$message.success('取消点赞成功')
          this.data.isLiked = 0;
          this.data.upvoteCount -= 1
          return;
        }
        this.$message.success('点赞成功')
        this.data.isLiked = 1;
        this.data.upvoteCount += 1
        this.$set(this.data, 'isLiked', 1)
      }
    },
    openComment() {
      if (this.data.extends) {
        this.$set(this.data, 'extends', 0)
        return;
      }
      this.data.extends = 1;
      this.$set(this.data, 'extends', 1)
    },
    async handleSelected() {
      const res = await setSelected({
        type: 1,
        isSelected: this.data.isSelected ? 0 : 1,
        id: this.data.id
      })
      if (res.data.success) {
        if (this.data.isSelected) {
          this.$message.success('取消精选成功')
          this.data.isSelected = 0;
          return;
        }
        this.$message.success('精选成功')
        this.data.isSelected = 1;
        this.$set(this.data, 'isSelected', 1)
      }
    },
    async handleCollect(type, data) {
      const res = await setAttention({
        type,
        isAttention: data.isAttention ? 0 : 1,
        id: data.id
      })
      let msg = '收藏'
      if (type === 2) {
        msg = '关注'
      }
      if (res.data.success) {
        if (data.isAttention) {
          this.$set(data, 'isAttention', 0)
          this.$message.success(`取消${msg}成功`)
          return;
        }
        this.$set(data, 'isAttention', 1)
        this.$message.success(`${msg}成功`)
      }
    },
    async deleteKnowledge() {
      this.$emit('setLoading')
      const res = await deleteKnowledge({
        deleteType: 1,
        id: this.data.id
      })
      if (res.data.success) {
        this.$emit('fetchList')
        this.$message.success('删除成功')
      }
    },
    createImage() {
    },
    copeLink(data) {
      const url = window.location.origin + window.location.pathname + '?knowledgeId=' + data.id + '&extend=1'
      this.copyClipboard(url)
    },
    copyClipboard(val) {
      copyText(
        val,
        msg => {
          this.$message.success(msg);
        },
        err => {
          this.$message.success(err);
        }
      );
    }
  }
}
</script>
<style lang="less" scoped>
.kCard {
  background: #FFFFFF;
}
.card {
  width: calc(100vw - 372px);
  display: flex;
  background: #FFFFFF;
  padding: 16px 0;
  .avatar {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    margin: 0 16px;
    font-size: 14px;
    border-radius: 50%;
  }
  .content {
    position: relative;
    width: calc(100% - 88px);
    margin-right: 16px;
    font-size: 14px;
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
      .green {
        background: #14C9C9;
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
  }
  .meta-info {
    display: flex;
    justify-content: space-between;
    color: #86909C;
    font-weight: 400;
    margin-top: 10px;
    .time {
      margin-right: 6px;
    }
    .dept {
      text-decoration: underline;
    }
    .meta-right {
      display: flex;
      align-items: center;
      .item {
        display: flex;
        align-items: center;
        margin-left: 20px;
        cursor: pointer;
        img {
          margin-right: 4px;
          cursor: pointer;
        }
        .active {
          color: #2D5CF6;
        }
      }
    }
  }
}
.picture {
  display: flex;
  align-items: center;
  margin: 10px 0;
  span {
    position: relative;
    margin-right: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 60px;
    height: 60px;
    background: #F2F3F5;
  }
  .el-icon-error {
    position: absolute;
    right: 2px;
    top: 2px;
    z-index: 999;
    cursor: pointer;
    font-size: 16px;
    opacity: 0.7;
  }
  .el-image {
    width: 50px;
    height: 50px;
  }
  svg {
    font-size: 50px;
  }
  .add-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 50px;
    height: 50px;
    border-radius: 4px;
    border: 1px dashed #CACDD3;
    background: #FFF;
    cursor: pointer;
  }
}
.info {
  display: flex;
  justify-content: space-around;
  justify-items: center;
  margin-top: 16px;
  .left,.right,.middle {
    font-size: 12px;
    text-align: center;
    line-height: 22px;
  }
  .title {
    color: #86909C;
  }
  .num {
    font-weight: 700;
  }
}
</style>
<style lang="less">
.k-card {
  li {
    padding: 4px 10px;
    cursor: pointer;
  }
  li:hover {
    background: #eee;
  }
}
</style>
