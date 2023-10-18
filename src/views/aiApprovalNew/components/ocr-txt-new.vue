<template>
  <div class="ocr-txt">
    <!-- <div class="header">
      <span :class="{ active: activeWordType === 1 }" @click="changeWorkType(1)"
        >禁用词</span
      >
      <span :class="{ active: activeWordType === 2 }" @click="changeWorkType(2)"
        >敏感词</span
      >
      <el-input
        v-model.trim="keyWords"
        placeholder="请输入关键字"
        @keyup.enter.native="search"
        @blur="search"
        size="medium"
      >
        <i
          slot="suffix"
          class="el-input__icon el-icon-search pointer"
          @click="search"
        ></i>
      </el-input>
    </div> -->
    <div class="results" ref="results" :key="resultKey" :class="{ light: lineWordItem?.word }"
      @mousedown="statrGetSelection" @mouseup="getSelection">
      <div class="results-div" :style="styleSet">
        <div v-for="(ocr, i) in html" class="div-position" :key="i" :style="returnStyle(i)">
          <template v-for="(item, j) in ocr">
            <!-- <template  v-if="typeof item === 'string'">{{ item }}</template> -->
            <div v-if="(typeof item === 'string')" :key="i + '_' + j + '_'" @click="showOcrCommentLine">{{ item }}</div>
            <span v-else :key="i + '_' + j" :wordType="item.wordType" :id="`word_${i}_${j}`" :class="{
              active:
                activeWordType === item.wordType || activeWordType === 0,
              gray: lineWordItem?.word && lineWordItem?.word !== item.word
            }" :word="item.word" @click="showLine(item, `word_${i}_${j}`)">{{ item.word }}</span>
          </template>
        </div>
      </div>
      <Empty v-if="html.length === 0"></Empty>
    </div>
    <div class="isAdd" ref="isAdd" v-if="selectText" :style="askIsAddPosition">
      <p>针对该词添加审查意见</p>
      <el-button size="small" @click="addWord">添加</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ocr-txt',
  props: {
    approval: {
      type: Object,
      default: () => ({})
    },
    lineWordItem: {
      type: [Object, Array],
      default: () => ({})
    },
    styleProp: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      keyWords: '',
      contentShow: '',
      html: [],
      activeWordType: 0, // 高亮禁用词或敏感词, 1 禁用词,  2 敏感词
      resultKey: 0,
      selectText: '',
      selectNodes: [],
      askIsAddPosition: {
        left: '',
        right: ''
      },
      styleSet: {}
    }
  },
  watch: {
    approval: {
      handler(val) {
        this.getInitContent(val)
      },
      deep: true
    },
    styleProp: {
      handler(val) {
        this.styleSet = {
          height: val.height,
          width: val.width,
          top: val.style.top,
          left: val.style.left,
          // transform: `scale(${1 / val.wordDomStyle.scale})`
        }
      },
      deep: true
    }
  },
  mounted() {
    document.addEventListener('click', this.hideAdd)
    this.getInitContent(this.approval)
  },
  methods: {
    addWord() {
      // this.$emit('addWord', this.selectText.trim())
      // this.selectText = ''
      this.getRectOverDom(this.selectNodes)
    },
    hideAdd(e) {
      e = e || window.event
      const elem = e.target
      if (this.$refs?.isAdd && !this.$refs.isAdd.contains(elem) && this.selectText) {
        this.selectText = ''
      }
    },
    statrGetSelection() {
      window.getSelection
        ? window.getSelection().removeAllRanges()
        : document.selection.empty()
    },
    getSelection(event) {
      const node = event.target.parentNode
      const { childNodes } = node
      const childNode = childNodes[0]
      const classs = Array.from(childNode.classList)
      // 如果二次选中高亮区域则判定为修改批注操作
      if (classs.includes('commentNode')) {
        this.$emit('checkEdit', true)
      } else {
        this.$emit('checkEdit', false)
      }
      const selectText = window.getSelection
        ? window.getSelection().toString()
        : document.selection.createRange().text
      if (selectText) {
        const select = window.getSelection()
        const range = select?.getRangeAt(0)
        const allNodes = Array.from(range.commonAncestorContainer.childNodes)
        setTimeout(() => {
          this.selectText = selectText
          this.askIsAddPosition = {
            left: event.clientX + 10 + 'px',
            top: event.clientY - 100 + 'px'
          }
          // 存在 allNodes ，代表选中的文本是由多个 dom 拼接
          if (allNodes.length) {
            const selectNodes = allNodes.filter((item) => {
              return selectText.includes(item.innerText)
            })
            this.selectNodes = selectNodes
          } else {
            // 不存在 allNodes，证明选中文本仅为一个 dom
            const selectNodes = [range.commonAncestorContainer.parentNode]
            this.selectNodes = selectNodes
          }
        }, 300)
      }
    },
    // 点击命中词,显示连线
    showLine(item, ocrWordId) {
      this.$emit('showLine', { ...item, ocrWordId })
    },
    // 修改高亮  关键词类型
    changeWorkType(type) {
      this.activeWordType = this.activeWordType === type ? 0 : type
      this.$emit('lineRemove', this.activeWordType)
    },
    // 标记命中关键词(敏感词,禁用词)
    getInitContent(approval) {
      // console.log(approval)
      const html = []
      approval?.ocr?.forEach((ocr) => {
        const { text, location } = ocr
        let newOcr = [text]
        approval?.recommends?.forEach((recommend, i) => {
          const { word, wordType } = recommend
          if (newOcr.join().includes(word)) {
            const temp = []
            for (let index = 0; index < newOcr.length; index++) {
              if (typeof newOcr[index] === 'string' && newOcr[index].includes(word)) {
                const a = newOcr[index].split(word)
                a.splice(1, 0, {
                  word,
                  wordType,
                  location,
                  recommendI: i
                })
                temp.push(...a.filter((b) => b !== ''))
              } else {
                temp.push(newOcr[index])
              }
            }
            newOcr = temp
          }
        })
        html.push(newOcr)
      })
      // console.log(html)
      this.html = html
    },
    // 高亮检索的关键词
    search(keyWords) {
      this.resultKey++
      this.keyWords = keyWords
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
        const characters = [...'\\[](){}?.+*^$:|'].reduce((r, c) => ((r[c] = true), r), {})
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
          const nodeMatchLength = Math.min(endIdx, matchEnd) - startIdx - nodeMatchStartIdx // 文本节点内容匹配关键词的长度
          if (nodeMatchStartIdx > 0) {
            textNode = textNode.splitText(nodeMatchStartIdx)
          }// textNode取后半部分
          if (nodeMatchLength < textNode.wholeText.length) {
            textNode.splitText(nodeMatchLength)
          }
          const font = document.createElement('font')
          font.style.color = '#2D5CF6'
          font.innerText = text.substr(nodeMatchStartIdx, nodeMatchLength)
          textNode.parentNode.replaceChild(font, textNode)
        }
      }
    },
    returnStyle(i) {
      if (!this.approval.ocr || !this.styleProp.wordDomStyle) {
        return {}
      }
      // console.log(this.styleProp.wordDomStyle.scale);
      return {
        left: `${this.approval.ocr[i].location.x / this.styleProp.wordDomStyle.scale}px`,
        top: `${this.approval.ocr[i].location.y / this.styleProp.wordDomStyle.scale}px`,
        fontSize: `${this.approval.ocr[i].location.w / this.approval.ocr[i].text.length
        }px`,
        transform: `scale(${1 / this.styleProp.wordDomStyle.scale})`,
        height: `${this.approval.ocr[i].location.h}px`,
        width: `${this.approval.ocr[i].location.w}px`,
        lineHeight: `${this.approval.ocr[i].location.h}px`
      }
    },
    // 获取计算后的覆盖在选中文字上的 dom 的宽高
    getRectOverDom(nodes) {
      const left = []
      const right = []
      const top = []
      const bottom = []
      nodes.forEach((node) => {
        const item = node.parentNode
        left.push(item.offsetLeft)
        // right.push(item.offsetLeft + (item.offsetWidth) * (1 / this.wordDomStyle.scale))
        right.push(item.offsetLeft + (item.offsetWidth) * (1 / this.styleProp.wordDomStyle.scale))
        top.push(item.offsetTop)
        bottom.push(item.offsetTop + (item.offsetHeight * (1 / this.styleProp.wordDomStyle.scale)))
        // bottom.push(item.offsetTop + item.offsetHeight * (1 / this.wordDomStyle.scale))
      })
      const l = left.sort((a, b) => a - b)[0]
      const t = top.sort((a, b) => a - b)[0]
      const r = right.sort((a, b) => a - b)[right.length - 1]
      const b = bottom.sort((c, d) => c - d)[bottom.length - 1]
      this.addRectOverDom(l, t, r, b, nodes)
    },
    // 添加覆盖 dom
    addRectOverDom(l, t, r, b, nodes) {
      const position = {
        left: Math.floor(l),
        top: Math.floor(t),
        height: Math.floor(b - t),
        width: Math.floor(r - l)
      }
      const string = this.selectText
      const obj = {
        position,
        string
      }
      this.$emit('addWord', obj, nodes)
    },
    showOcrCommentLine(event) {
      const selectText = window.getSelection
        ? window.getSelection().toString()
        : document.selection.createRange().text
      const node = event.target.parentNode
      // 区分：点击事件和 鼠标滑动选中事件
      if (selectText) {
        return;
      }
      const position = {
        left: Math.floor(node.offsetLeft),
        height: Math.floor((node.offsetHeight * (1 / this.styleProp.wordDomStyle.scale))),
        // right.push(item.offsetLeft + (item.offsetWidth) * (1 / this.wordDomStyle.scale))
        top: Math.floor(node.offsetTop),
        width: Math.floor((node.offsetWidth) * (1 / this.styleProp.wordDomStyle.scale)),
      }
      this.$emit('showOcrCommentLine', position)
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

  >span {
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

    +span {
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
  flex: 1;
  margin: 0px 0 15px;
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
    position: absolute;
    background-color: red;
    transform-origin: 0 0;

    .div-position {
      position: absolute;
      transform-origin: 0 0;
      z-index: 1;
      div {
        display: inline-block;
      }
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
  z-index: 2;
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
