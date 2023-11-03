<template>
  <div class="ocr-txt">
    <div
      class="results"
      ref="results"
      id="results"
      :key="resultKey"
      :class="{ light: lineWordItem?.word }"
    >
      <div class="results-div">
        <div
          v-for="(ocr, i) in html"
          class="div-position"
          :key="i"
          :style="returnBox(i)"
        >
          <template v-for="(item, j) in ocr.content">
            <template v-if="typeof item === 'string'">{{ item }}</template>
            <span
              :style="returnStyle(i, j)"
              v-else
              :key="i + '_' + j"
              :id="`word_${i}_${j}`"
              :class="{
                active:
                  activeWordType === item.wordType || activeWordType === 0,
                gray: lineWordItem?.word && lineWordItem?.word !== item.word
              }"
              v-html="item.text"
            ></span>
          </template>
        </div>
      </div>
      <Empty v-if="html.length === 0"></Empty>
    </div>
  </div>
</template>
<script>
const PLUGIN_FLAG = 'search-hightlight'

export default {
  name: 'ocr-txt',
  props: {
    approval: {
      type: Array,
      default: () => []
    },
    lineWordItem: {
      type: Object,
      default: () => ({})
    },
    keyWords: {
      type: String,
      default: ''
    },
    highlightStyle: {
      type: String,
      default: 'background: rgba(247, 186, 30, 0.3)'
    },
    currentStyle: {
      type: String,
      default: 'background: #F7BA1E'
    },
    regExp: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      contentShow: '',
      html: [],
      activeWordType: 0, // 高亮禁用词或敏感词, 1 禁用词,  2 敏感词
      resultKey: 0,
      lightIndex: 0,
      matchCount: 0,
      random: `${Math.random()}`.slice(2)
    }
  },
  watch: {
    // 关键词高亮
    watchString: {
      immediate: true,
      handler() {
        this.replaceKeywords()
      }
    },
    lightIndex: {
      immediate: true,
      handler() {
        this.$emit('current-change', this.lightIndex)
      }
    },
    matchCount: {
      immediate: true,
      handler() {
        this.$emit('match-count-change', this.matchCount)
      }
    },
    watchStyle: {
      immediate: true,
      handler() {
        this.setStyle()
      }
    },
    approval: {
      handler(val) {
        this.getInitContent(val)
      },
      deep: true
    }
  },
  computed: {
    watchString() {
      return [this.html, this.keyWords]
    },
    watchStyle() {
      return [this.lightIndex, this.highlightStyle, this.currentStyle]
    },
    flag() {
      return `${PLUGIN_FLAG}${this.random}`
    },
    styleSelector() {
      return `style[${this.flag}]`
    }
  },
  async mounted() {
    await this.getInitContent(this.approval)
  },
  methods: {
    replaceKeywords() {
      let errFlag = false
      if (this.regExp) {
        try {
          const reg = new RegExp(this.keyWords)
          if (reg.test('')) errFlag = true
        } catch (err) {
          errFlag = true
        }
      }
      if (errFlag || !this.keyWords) {
        this.contentShow = this.content
        return
      }
      const div = document.createElement('div')
      div.innerHTML = this.html
      const textNodes = this.getTextNodeList(div)
      const textList = this.getTextInfoList(textNodes)
      // const content = textList.map(({ text }) => text).join('')
      const content = this.html
        .map((m) => {
          const text = m.content.map((v) => {
            return v.text
          }).join('')
          return text
        })
        .join('')
      const matchList = this.getMatchList(content, this.keyWords)
      this.matchCount = matchList.length
      this.lightIndex = this.matchCount ? 1 : 0
      this.replaceMatchResult(textNodes, textList, matchList)
      this.contentShow = div.innerHTML
    },
    scrollTo(index) {
      this.$nextTick(() => {
        const node = this.$el.querySelector(`font[${this.flag}='${index}']`)
        if (node) {
          this.lightIndex = index
          node.scrollIntoView()
        }
      })
    },
    searchNext() {
      this.$nextTick(() => {
        const idx = this.lightIndex >= this.matchCount ? 1 : this.lightIndex + 1
        this.scrollTo(idx)
      })
    },
    searchLast() {
      this.$nextTick(() => {
        const idx = this.lightIndex <= 1 ? this.matchCount : this.lightIndex - 1
        this.scrollTo(idx)
      })
    },
    setStyle() {
      let style = document.head.querySelector(this.styleSelector)
      if (!style) {
        style = document.createElement('style')
        style.setAttribute(this.flag, 1)
      }
      style.innerText = `font[${this.flag}]{${this.highlightStyle}}font[${this.flag}='${this.lightIndex}']{${this.currentStyle}}`
      document.head.appendChild(style)
    },
    // 修改高亮  关键词类型
    changeWorkType(type) {
      this.activeWordType = this.activeWordType === type ? 0 : type
      this.$emit('lineRemove', this.activeWordType)
    },
    // 标记命中关键词(敏感词,禁用词)
    getInitContent(approval) {
      this.html = approval
    },
    // 高亮检索的关键词
    search() {
      this.resultKey++
      if (!this.keyWords) {
        return
      }
      this.$nextTick(() => {
        const textNodes = this.getTextNodeList(this.$refs.results)
        const textList = this.getTextInfoList(textNodes)
        const content = textList.map(({ text }) => text).join('')
        const matchList = this.getMatchList(content, this.keyWords)
        this.replaceMatchResult(textNodes, textList, matchList)
      })
    },
    getTextNodeList(dom) {
      const nodeList = [...dom.childNodes]
      const textNodes = []
      while (nodeList.length) {
        const node = nodeList.shift()
        if (node.nodeType === node.TEXT_NODE) {
          node.wholeText && textNodes.push(node)
        } else {
          nodeList.unshift(...node.childNodes)
        }
      }
      return textNodes
    },
    getTextInfoList(textNodes) {
      let length = 0
      const textList = textNodes.map((node) => {
        const startIdx = length
        const endIdx = length + node.wholeText.length
        length = endIdx
        return {
          text: node.wholeText,
          startIdx,
          endIdx
        }
      })
      return textList
    },
    getMatchList(content, keyword) {
      if (!this.regExp) {
        // eslint-disable-next-line
        const characters = [...'\\[](){}?.+*^$:|'].reduce(
          // eslint-disable-next-line
          (r, c) => ((r[c] = true), r),
          {}
        )
        keyword = keyword
          .split('')
          .map((s) => (characters[s] ? `\\${s}` : s))
          .join('[\\s\\n]*')
      }
      const reg = new RegExp(keyword, 'gmi')
      const matchList = []
      let match = reg.exec(content)
      while (match) {
        matchList.push(match)
        match = reg.exec(content)
      }
      return matchList
    },
    replaceMatchResult(textNodes, textList, matchList) {
      // 对于每一个匹配结果，可能分散在多个标签中，找出这些标签，截取匹配片段并用font标签替换出
      for (let i = matchList.length - 1; i >= 0; i--) {
        const match = matchList[i]
        const matchStart = match.index
        const matchEnd = matchStart + match[0].length // 匹配结果在拼接字符串中的起止索引
        // 遍历文本信息列表，查找匹配的文本节点
        for (let textIdx = 0; textIdx < textList.length; textIdx++) {
          const { text, startIdx, endIdx } = textList[textIdx] // 文本内容、文本在拼接串中开始、结束索引
          if (endIdx < matchStart) continue // 匹配的文本节点还在后面
          if (startIdx >= matchEnd) break // 匹配文本节点已经处理完了
          let textNode = textNodes[textIdx] // 这个节点中的部分或全部内容匹配到了关键词，将匹配部分截取出来进行替换
          const nodeMatchStartIdx = Math.max(0, matchStart - startIdx) // 匹配内容在文本节点内容中的开始索引
          // eslint-disable-next-line
          const nodeMatchLength =
            Math.min(endIdx, matchEnd) - startIdx - nodeMatchStartIdx // 文本节点内容匹配关键词的长度
          if (nodeMatchStartIdx > 0) {
            textNode = textNode.splitText(nodeMatchStartIdx)
          } // textNode取后半部分
          if (nodeMatchLength < textNode.wholeText.length) {
            textNode.splitText(nodeMatchLength)
          }
          const font = document.createElement('font')
          font.setAttribute(this.flag, i + 1)
          font.innerText = text.substr(nodeMatchStartIdx, nodeMatchLength)
          textNode.parentNode.replaceChild(font, textNode)
        }
      }
    },
    returnBox(i) {
      const H = this.approval[i].size.height
      const W = this.approval[i].size.width
      const x = document.getElementById('results').clientWidth
      const height = (x / W) * H
      return {
        position: 'relative',
        height: `${height}px`
      }
    },
    returnStyle(i, j) {
      const W = this.approval[i].size.width
      const x = document.getElementById('results').clientWidth
      const scale = x / W
      if (!this.approval) {
        return {}
      }
      return {
        position: 'absolute',
        left: `${this.approval[i].content[j].location.x / scale}px`,
        top: `${this.approval[i].content[j].location.y / scale}px`,
        fontSize: `${
          // eslint-disable-next-line
          this.approval[i].content[j].location.w /
          this.approval[i].content[j].text.length
        }px`,
        transform: `scale(${1 / scale}})`,
        height: `${this.approval[i].content[j].location.h}px`,
        width: `${this.approval[i].content[j].location.w}px`,
        lineHeight: `${this.approval[i].content[j].location.h}px`
      }
    }
  }
}
</script>
  <style lang="less" scoped>
.ocr-txt {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.header {
  background: #f7f8fa;
  padding: 6px 20px;
  display: flex;
  gap: 10px;
  align-items: center;

  > span {
    padding: 3px 16px;
    border-radius: 4px;
    line-height: 24px;
    font-weight: 700;
    white-space: pre;
    background: #ffffff;
    color: #eb5d78;
    cursor: pointer;
    height: fit-content;

    &.active {
      background: #fff1f0;
    }

    + span {
      color: #fdb123;

      &.active {
        background: #fff7e6;
      }
    }
  }

  .el-input {
    /deep/ input {
      border: none;
      border-radius: 18px;
      font-size: 12px;
      color: #1d2128;
    }

    /deep/ .el-icon-search {
      color: #86909c;
      font-size: 16px;
    }
  }
}

.results {
  position: relative;
  background: #ffffff;
  color: #333333;
  line-height: 22px;
  font-size: 14px;
  font-weight: 400;
  overflow-y: auto;
  word-break: break-all;

  [wordType] {
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    cursor: pointer;
  }
  .results-div {
    width: 100%;
    height: 100%;
    transform-origin: 0 0;
    .div-position {
      position: relative;
      height: 500px;
      transform-origin: 0 0;
    }
  }
  .active[wordtype='1'] {
    color: #f76560;
  }

  .active[wordtype='2'] {
    color: #fdb123;
  }

  &.light {
    color: #86909c;

    .gray {
      color: #86909c;
    }
  }
}

.isAdd {
  position: fixed;
  padding: 16px 24px;
  border-radius: 4px;
  box-shadow: 0px 0px 10px 0px #4343431a;
  font-size: 14px;
  font-weight: 700;
  line-height: 22px;
  background: #ffffff;

  .el-button {
    margin-top: 16px;
    background: linear-gradient(90deg, #2f54eb 0%, #5196ff 100%);
    border-radius: 6px;
    color: #ffffff;
    border: none;
  }
}
</style>
