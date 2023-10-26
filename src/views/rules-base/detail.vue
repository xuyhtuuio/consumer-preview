<!--
 * @Author: nimeimix huo.linchun@trs.com.cn
 * @Date: 2023-10-26 13:51:55
 * @LastEditors: nimeimix huo.linchun@trs.com.cn
 * @LastEditTime: 2023-10-26 18:17:13
 * @FilePath: /consumer-preview/src/views/rules-base/detail.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="rule-detail">
    <div class="file-content">
      <div class="name">
        <div class="search">
          <el-input v-model="keyword" placeholder="查找"></el-input>
          <span class="position" v-if="keyword"
            >{{ currentIdx }}/{{ matchCount }}</span
          >
          <i
            class="el-icon-arrow-up icon pointer"
            v-if="keyword"
            @click="searchLast"
          ></i>
          <i
            class="el-icon-arrow-down icon pointer"
            v-if="keyword"
            @click="searchNext"
          ></i>
          <i
            class="el-icon-close icon pointer"
            v-if="keyword"
            @click="closeSearch"
          ></i>
        </div>
        <p class="law-name">银行保险机构消费者权益保护管理办法</p>
        <div class="law-info">
          <el-popover
            placement="bottom-start"
            width="450"
            trigger="click"
            popper-class="history-change"
          >
            <div>
              <el-timeline>
                <el-timeline-item
                  v-for="(activity, index) in activities"
                  :key="index"
                  :timestamp="activity.timestamp"
                  :color="activity.color"
                  hide-timestamp
                >
                  <div class="pointer">
                    <p class="time">
                      {{ activity.timestamp }}
                      <span
                        :class="`effective-tag effective${activity.isEffective}`"
                        >{{ activity.isEffective == 1 ? '有效' : '失效' }}</span
                      >
                    </p>
                    <p
                      :class="[
                        'file-name ellipsis ellipsis_1',
                        index == 0 ? 'active-file' : ''
                      ]"
                    >
                      {{ activity.fileName }}
                    </p>
                  </div>
                </el-timeline-item>
              </el-timeline>
            </div>

            <span slot="reference" class="no-line">历史沿革</span>
          </el-popover>
          <span>发文单位：北京证券交易所有限责任公司</span>
          <span>发文字号：北证公告〔2023〕76号</span>
          <span class="no-line" style="margin-right: 32px"
            >发布时间：2023-11-23</span
          >
          <span class="no-line">
            <i class="pointer flex">
              <i class="iconfont icon-download"></i>
              下载</i
            >
            <i style="margin: 0 12px" class="pointer flex" @click="copyLink">
              <i class="iconfont icon-fenxiang"></i>
              分享</i
            >
            <i class="pointer">561次阅读</i>
          </span>
        </div>
      </div>
      <div style="padding: 24px 0 16px; height: calc(100% - 144px)">
        <div class="text-part">
          <searchHighlight
            class="search-highlight"
            ref="search"
            @current-change="currentChange"
            @match-count-change="matchCountChange"
            :content="content"
            regExp
            :keyword="keyword"
          ></searchHighlight>
        </div>
      </div>
    </div>
    <div class="overview-file">
      <p class="title">
        <span
          v-for="(item, index) in menu"
          :key="index"
          :class="activeMuneId == item.id ? 'active-menu' : ''"
          @click="
            () => {
              activeMuneId = item.id
            }
          "
          >{{ item.name }}</span
        >
      </p>
      <div class="content trs-scroll">
        <ul>
          <li
            v-for="(item, index) in overviewFileList"
            :key="index"
            class="file-list"
          >
            <fileType
              :fileName="item.name || item.fileName"
              class="file-icon"
            ></fileType>
            <div class="file-name">
              <p>{{ item.name }}</p>
              <div class="tags ellipsis ellipsis_1">
                <i>发债企业</i>
                <i>发债企业</i>
                <i>发债企业</i>
                <i>发债企业</i>
                <i>发债企业</i>
                <i>发债企业</i>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import fileType from './components/file-type'
import searchHighlight from './components/search-highlight'
import text from './text'
export default {
  components: { fileType, searchHighlight },
  data() {
    return {
      menu: [
        { id: 0, name: '最近浏览' },
        { id: 1, name: '相关附件' }
      ],
      activeMuneId: 0,
      overviewFileList: [
        { name: '关于取消和暂停商业银行部分基础金融服务收费的通知.docx' }
      ],
      keyword: '',
      currentIdx: 0,
      matchCount: 0,
      content: text,
      activities: [
        {
          fileName: '(本文)招商银行客户满意程度测评管理方法（第二版）',
          timestamp: '2018-04-12 20:46',
          isEffective: 1,
          color: 'rgba(235, 87, 87, 1)'
        },
        {
          fileName: '(本文)招商银行客户满意程度测评管理方法（第二版）',
          timestamp: '2018-04-03 20:46',
          isEffective: 1,
          color: 'rgba(80, 89, 104, 1)'
        },
        {
          fileName: '(本文)招商银行客户满意程度测评管理方法（第二版）',
          timestamp: '2018-04-03 20:46',
          isEffective: 1,
          color: 'rgba(80, 89, 104, 1)'
        },
        {
          fileName: '(本文)招商银行客户满意程度测评管理方法（第二版）',
          timestamp: '2018-04-03 20:46',
          isEffective: 0,
          color: 'rgba(80, 89, 104, 1)'
        }
      ]
    }
  },
  mounted() {},
  methods: {
    closeSearch() {
      this.keyword = ''
    },
    searchLast() {
      this.$refs.search.searchLast()
    },
    searchNext() {
      this.$refs.search.searchNext()
    },
    matchCountChange(count) {
      this.matchCount = count
    },
    currentChange(idx) {
      this.currentIdx = idx
    },
    copyLink() {
      const link = 'https://www.example.com'
      const textarea = document.createElement('textarea')
      textarea.value = link
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      this.$message.success('复制链接成功')
    },
  }
}
</script>
<style lang="less" scoped>
.rule-detail {
  display: flex;
  height: 100%;
  width: 100%;
  overflow: hidden;
  .file-content {
    flex: 1;
    width: 0;
    border-radius: 10px;
    background: #fff;
    height: 100%;

    .search {
      border-radius: 24px;
      border: 1px solid #e5e6eb;
      background: #f7f8fa;
      height: 32px;
      padding: 6px 12px;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: flex-end;

      position: absolute;
      right: 40px;
      /deep/ .el-input__inner {
        border: none;
        height: 20px;
        width: 183px;
        background: inherit;
        padding: 0;
      }
      .position {
        position: relative;
        padding-right: 8px;
        white-space: nowrap;
      }
      .position::after {
        position: absolute;
        right: 0;
        top: 2px;
        content: '';
        display: inline-block;
        width: 1px;
        height: 12px;
        background: #cacdd3;
      }
      .icon {
        margin-left: 4px;
        font-size: 20px;
        flex-shrink: 0;
        color: rgba(134, 144, 156, 1);
      }
    }
    .name {
      padding: 16px 40px 12px 40px;
      border-bottom: 1px solid #e5e6eb;
      background: #fff;
      position: relative;
      height: 144px;
    }
    .law-name {
      margin: 48px 0 16px;
      color: #1d2128;
      text-align: center;
      font-size: 20px;
      font-weight: 700;
      line-height: 28px;
    }
    .law-info {
      text-align: center;
      color: #505968;
      font-size: 12px;
      font-style: normal;
      font-weight: 400;
      line-height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      span {
        display: flex;
        align-items: center;
      }
      span::after {
        content: '';
        display: inline-block;
        width: 1px;
        height: 12px;
        background: #cacdd3;
        margin: 0 16px;
      }
      .no-line {
        .iconfont {
          margin-right: 4px;
          font-size: 16px;
        }
      }
      .no-line::after {
        display: none;
      }
    }
    .text-part {
      padding: 0 160px;
      font-size: 14px;
      height: 100%;
      position: relative;
      overflow: auto;
    }
  }
  .overview-file {
    margin-left: 8px;
    flex-shrink: 0;
    width: 280px;
    padding: 16px 20px 8px 8px;
    border-radius: 10px;
    background: var(--gray-gray-1, #fff);
    overflow: hidden;
    max-height: 100%;
    .title {
      padding: 0px 0px 4px 8px;
      font-size: 12px;
      font-weight: 400;
      line-height: 20px;
      color: #505968;
      margin-bottom: 8px;
      span {
        cursor: pointer;
      }
      span:nth-of-type(1) {
        margin-right: 16px;
      }
      .active-menu {
        font-weight: 700;
        color: #1d2128;
      }
    }
    .content {
      overflow: auto;
      max-height: calc(100% - 24px);
      .file-list {
        display: flex;
        align-items: flex-start;
        padding: 16px 8px;
        cursor: pointer;
        .file-icon {
          font-size: 32px;
          margin-right: 8px;
          flex-shrink: 0;
        }
        .file-name {
          width: calc(100% - 40px);
          color: #505968;
          font-size: 12px;
          font-weight: 400;
          line-height: 20px; /* 166.667% */
          .tags {
            margin-top: 4px;

            // overflow: hidden;
            // display: flex;
            text-align: left;
            i {
              flex: 1;
              word-break: keep-all;
              border-radius: 3px;
              background: #f0f6ff;
              display: inline-block;
              padding: 1px 6px;
              font-size: 12px;
              font-style: normal;
              font-weight: 400;
              line-height: 18px;
              color: #2d5cf6;
              transform: scale(0.8);
              margin-right: 4px;
            }
          }
        }
      }
      .file-list:hover {
        border-radius: 6px;
        background: #f7f8fa;
      }
    }
  }
}
</style>
<style lang="less">
.history-change {
  padding: 24px 16px;
  .el-timeline {
    .time {
      color: #505968;
      font-size: 12px;
      font-weight: 400;
      line-height: 20px;
    }
    .effective-tag {
      border-radius: 4px;
      background: #fff1f0;
      padding: 0px 4px;
      font-size: 12px;
      font-style: normal;
      font-weight: 400;
      line-height: 20px;
      margin-left: 8;
    }
    .effective1 {
      background: #fff1f0;
      color: #eb5757;
    }
    .effective0 {
      background: #e5e6eb;
      color: #86909c;
    }
    .file-name {
      color: #1d2128;
      font-size: 12px;
      font-style: normal;
      font-weight: 400;
      line-height: 20px;
    }
    .active-file {
      color: #eb5757;
      font-weight: 700;
    }
    .el-timeline-item__tail {
      background: #e5e6eb !important;
    }
    .el-timeline-item__node {
      background: rgba(80, 89, 104, 1);
      top: 10px;
    }
    .el-timeline-item:last-of-type {
      .el-timeline-item__tail {
        display: block !important;
      }
    }
  }
}
</style>
