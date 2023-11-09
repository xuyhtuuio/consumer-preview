<!--
 * @Author: nimeimix huo.linchun@trs.com.cn
 * @Date: 2023-10-26 13:51:55
 * @LastEditors: nimeimix huo.linchun@trs.com.cn
 * @LastEditTime: 2023-11-09 13:34:33
 * @FilePath: /consumer-preview/src/views/rules-base/detail.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="rule-detail">
    <div class="file-content" v-loading="loading">
      <div class="name">
        <div class="search">
          <el-input
            v-model="keyword"
            placeholder="查找"
            @keyup.enter.native="search"
            @blur="search"
          ></el-input>
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
        <p class="law-name">{{ lawInfo.name }}</p>
        <div class="law-info">
          <el-popover
            placement="bottom-start"
            width="450"
            trigger="click"
            popper-class="history-change"
            v-if="['0', '1'].includes(lawInfo.type)"
          >
            <div v-if="activities?.length">
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
                      {{ activity.ctime | timeFilter }}
                      <span
                        v-if="[0, 1].includes(activity.status)"
                        :class="`effective-tag effective${activity.status}`"
                        >{{ activity.status == 1 ? '有效' : '废止' }}</span
                      >
                    </p>
                    <p
                      :class="[
                        'file-name ellipsis ellipsis_1',
                        index == 0 ? 'active-file' : ''
                      ]"
                    >
                      {{ activity.name }}
                    </p>
                  </div>
                </el-timeline-item>
              </el-timeline>
            </div>
            <Empty v-else style="padding: 0"></Empty>
            <span slot="reference" class="no-line pointer">历史沿革</span>
          </el-popover>
          <div v-if="lawInfo.type == '0'" class="flex">
            发文单位：
            <el-popover placement="bottom" trigger="hover">
              <p>{{ lawInfo.unit }}</p>
              <i slot="reference" class="pointer">
                {{ wordEllipsis(lawInfo.unit, 20) }}
              </i>
            </el-popover>
          </div>
          <div v-if="lawInfo.type == '0'">
            <el-popover placement="bottom" trigger="hover">
              <p>{{ lawInfo.doc_no }}</p>
              <i slot="reference" class="pointer">
                {{ wordEllipsis(lawInfo.doc_no, 20) }}
              </i>
            </el-popover>
          </div>
          <div v-if="lawInfo.type == '1'" class="flex">
            拟稿部门：
            <el-popover placement="bottom" trigger="hover">
              <p>{{ lawInfo.unit }}</p>
              <i slot="reference" class="pointer">
                {{ wordEllipsis(lawInfo.unit, 20) }}
              </i>
            </el-popover>
          </div>
          <span v-if="lawInfo.type == '1'">制度文号：{{ lawInfo.doc_no }}</span>
          <span v-if="lawInfo.type == '2'"
            >发文单位：
            <el-popover placement="bottom" trigger="hover">
              <p>{{ lawInfo.unit }}</p>
              <i slot="reference" class="pointer">
                {{ wordEllipsis(lawInfo.unit, 20) }}
              </i>
            </el-popover>
          </span>
          <span class="no-line" style="margin-right: 32px"
            >发布时间：{{ lawInfo.pub_time | timeFilter }}</span
          >
          <span class="no-line">
            <i class="pointer flex" @click="downloadFile">
              <i class="iconfont icon-download"></i>
              下载</i
            >
            <i style="margin: 0 12px" class="pointer flex" @click="copyLink">
              <i class="iconfont icon-fenxiang"></i>
              分享</i
            >
            <i class="pointer">{{ lawInfo.read_count }}次阅读</i>
          </span>
        </div>
      </div>
      <div style="padding: 24px 0 16px; height: calc(100% - 144px)">
        <div class="text-part">
          <searchHighlightPDF
            :approval="lawInfo.newContent"
            :keyWords="keyword"
            @current-change="currentChange"
            @match-count-change="matchCountChange"
            ref="search"
            v-if="fileType === 'pdf'"
          ></searchHighlightPDF>
          <searchHighlight
            :keyword="keyword"
            @current-change="currentChange"
            @match-count-change="matchCountChange"
            :content="lawInfo.newContent"
            ref="search"
            v-if="fileType === 'docx'"
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
          @click="changeMenu(item)"
          >{{ item.name }}</span
        >
      </p>
      <div class="content trs-scroll" v-loading="rightLoading">
        <ul v-if="overviewFileList?.length && activeMuneId == 0">
          <li
            v-for="(item, index) in overviewFileList"
            :key="index"
            class="file-list"
            @click="toDetail(item)"
          >
            <fileType :fileName="item.fileKey" class="file-icon"></fileType>
            <div class="file-name">
              <p>{{ item.fileKey | handleName }}</p>
              <p v-if="item.tagList?.length" class="tags ellipsis ellipsis_1">
                <i v-for="(tag,idx) in item.tagList" :key="idx">{{ tag }}</i>
              </p>
            </div>
          </li>
        </ul>
        <Empty
        :imageSize="200"
          v-if="!overviewFileList?.length && activeMuneId == 0"
        ></Empty>
        <ul v-if="relatedFileList?.length && activeMuneId == 1">
          <li
            v-for="(item, index) in relatedFileList"
            :key="index"
            class="file-list"
            @click="toFilePreview(item)"
          >
            <fileType :fileName="item.fileKey" class="file-icon"></fileType>
            <div class="file-name">
              <p>{{ item.fileKey | handleName }}</p>
            </div>
          </li>
        </ul>
        <Empty
          :imageSize="200"
          v-if="!relatedFileList?.length && activeMuneId == 1"
        ></Empty>
      </div>
    </div>
  </div>
</template>
<script>
import {
  queryDetails,
  updateReadCount,
  queryHistoryLogs,
  queryViewLogs
} from '@/api/knowledge/knowledgeCollect'
import { download } from '@/api/aiApproval'

import dayjs from 'dayjs'
import fileType from './components/file-type'
import searchHighlightPDF from './components/search-highlight-new'
import searchHighlight from './components/search-highlight'
export default {
  name: 'law-detail',
  components: { fileType, searchHighlightPDF, searchHighlight },
  data() {
    return {
      menu: [
        { id: 0, name: '最近浏览' },
        { id: 1, name: '相关附件' }
      ],
      loading: false,
      activeMuneId: 0,
      overviewFileList: [],
      keyword: '',
      currentIdx: 0,
      matchCount: 0,
      rightLoading: false,
      activities: [],
      lawInfo: {},
      relatedFileList: [],
      fileType: ''
    }
  },
  watch: {
    $route: {
      async handler(val) {
        if (val.name === 'RulesDetail') {
          this.queryViewLogs()
          await this.searchDetails()
          await this.historyLogs()
          await this.readCount()
        }
      }
    }
  },
  async mounted() {
    this.queryViewLogs()
    await this.searchDetails()
    await this.historyLogs()
    await this.readCount()
  },
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
    search() {
      if (this.fileType === 'pdf') {
        this.$refs['search'].search()
      }
    },
    matchCountChange(count) {
      this.matchCount = count
    },
    changeMenu(item) {
      if (this.activeMuneId === item.id) return false
      this.activeMuneId = item.id
      this.getOverviewFile()
    },
    getOverviewFile() {
      if (this.activeMuneId === 0) {
        this.queryViewLogs()
      } else {
        this.handleRelevanceFile()
      }
    },
    handleRelevanceFile() {
      const { attachmentList } = this.lawInfo
      this.relatedFileList = attachmentList?.map((m) => {
        return {
          fileKey: m
        }
      }) || []
    },
    currentChange(idx) {
      this.currentIdx = idx
    },
    wordEllipsis(str, len) {
      if (!str?.length || !str) return ''
      return str?.length > len ? str.substr(0, len) + '...' : str
    },
    copyLink() {
      // eslint-disable-next-line
      const link =
        // eslint-disable-next-line
        window.location.protocol +
        // eslint-disable-next-line
        '//' +
        // eslint-disable-next-line
        window.location.host +
        `/knowledge/rulesDetail?law_id=${this.lawInfo.id}`
      const textarea = document.createElement('textarea')
      textarea.value = link
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      this.$message.success('复制链接成功')
    },
    // 最近浏览跳转详情
    async toDetail(item) {
      // 先查询当前是否存在数据
      const params = {
        id: item.id
      }
      const res = await queryDetails(params)
      const { success, data } = res.data
      if (success) {
        if (!data?.length) {
          this.$message.error('当前法规不存在，或已被删除')
          return
        }
      }
      this.$router.push({
        name: 'RulesDetail',
        query: {
          law_id: item.id
        }
      })
    },
    // 去预览文件
    toFilePreview(item) {
      const routeUrl = this.$router.resolve({
        name: 'file-preview',
        query: {
          url: item.fileKey
        }
      })
      window.open(routeUrl.href, '_blank')
    },
    // 下载
    downloadFile() {
      const params = {
        key: this.lawInfo.file_key
      }
      this.$message.info('下载中，请等候')
      download(params).then((res) => {
        fetch(res.data.data, {
          method: 'get',
          responseType: 'blob'
        })
          .then((response) => response.blob())
          .then((blob) => {
            const link = document.createElement('a')
            const URL = window.URL || window.webkitURL
            const herf = URL.createObjectURL(blob)
            link.style.display = 'none'
            link.href = herf
            link.setAttribute('download', this.lawInfo.fileName)
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            this.$message.success('下载完成')
          })
      })
    },
    // 查询详情
    async searchDetails() {
      const that = this
      const params = {
        id: this.$route.query.law_id
      }
      this.loading = true
      const res = await queryDetails(params)
      const { success, data } = res.data
      this.fileType = ''
      if (success) {
        if (!data?.length) {
          this.loading = false
          this.lawInfo = {}
          return
        }
        this.lawInfo = data?.map((m) => {
          const content = m.content ? JSON.parse(m.content) : []
          // 判断是pdf还是word
          const suffix = m.fileName.split('.')[m.fileName.split('.').length - 1]
          if (suffix === 'pdf') {
            this.fileType = 'pdf'
            const [first] = content
            const keys = first
            let arr = []
            for (const i in keys) {
              if (i.indexOf('jpg') !== -1) {
                const obj = {
                  page: i,
                  content: first[i],
                  size: first['size'][i]
                }
                arr.push(obj)
              }
            }
            // 排序
            arr = arr.sort((a, b) => {
              return a.page.split('-')[0] - b.page.split('-')[0]
            })
            return {
              ...m,
              newContent: arr
            }
          } else {
            this.fileType = 'docx'
            // docx 里面的表格
            const [first] = m.tableFileTag
            let str = content
              .map((o) => {
                return first?.length && first[o]
                  ? that.formatTable(first[o])
                  : o
              })
              .join('')
            str = str.replace(/\r/gi, '<br />')
            return {
              ...m,
              newContent: str
            }
          }
        })[0]
      }
      this.loading = false
    },
    // 将解析后的表格转为table
    formatTable(tableFile) {
      const rows = {} // 计算一共多少行
      tableFile.forEach((tr) => {
        if (!rows[tr.row]) {
          rows[tr.row] = []
        }
        rows[tr.row].push(tr)
      })
      // rows 转数组
      const keys = Object.keys(rows)
      const tableContent = []
      for (const i in keys) {
        let trs = ''
        rows[keys[i]].forEach((tr) => {
          trs += `<td>${tr.text}</td>`
        })
        const row = `<tr>${trs}</tr>` // 每行的要素
        tableContent.push(row)
      }
      // 有多少行
      const table = `<table border>${tableContent}</table>`
      return table
    },
    // 更新阅读次数
    readCount() {
      const { file_key: fileKey, id, name } = this.lawInfo
      const params = {
        fileKey,
        id,
        name,
        tagList: this.lawInfo?.tagList || [],
        beTagList: this.lawInfo?.equityList || [],
      }
      updateReadCount(params)
    },
    // 查询历史沿革
    async historyLogs() {
      const res = await queryHistoryLogs({ id: this.lawInfo.id })
      const { success, data } = res.data
      if (success) {
        let newData = data?.reverse()
        newData = newData.map((m, index) => {
          return {
            ...m,
            color: index === 0 ? 'rgba(235, 87, 87, 1)' : ''
          }
        })
        this.activities = newData
      }
    },
    // 查询最近浏览
    async queryViewLogs() {
      this.rightLoading = true
      const res = await queryViewLogs()
      const { success, data } = res.data
      if (success) this.overviewFileList = data
      this.rightLoading = false
    }
  },
  filters: {
    timeFilter(val) {
      if (val) {
        return dayjs(val).format('YYYY-MM-DD')
      }
    },
    handleName(val) {
      if (val) {
        return val.split('_').slice(2).join('')
      }
    }
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
        max-width: 183px;
        background: inherit;
        padding: 0;
        padding-right: 4px;
      }
      .position {
        position: relative;
        padding-right: 8px;
        white-space: nowrap;
        display: block;
        width: 40px;
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
