<template>
  <div class="ocr-txt">
    <div class="header">
      <span :class="{ active: activeWordType === 1 }" @click="changeWorkType(1)">禁用词</span>
      <span :class="{ active: activeWordType === 2 }" @click="changeWorkType(2)">敏感词</span>
      <el-input v-model.trim="keyWords" placeholder="请输入关键字" @keyup.enter.native="search" @blur="search" size="medium">
        <i slot="suffix" class="el-input__icon el-icon-search pointer" @click="search"></i>
      </el-input>
    </div>
    <div class="results" ref="results" :key="resultKey" :class="{ light: lineWordItem?.word }"
      @mousedown="statrGetSelection" @mouseup="getSelection">
      <p v-for="(ocr, i) in html" :key="i">
        <template v-for="(item, j) in ocr">
          <template v-if="typeof item === 'string'">{{ item }}</template>
          <span v-else :key="i + '_' + j" :wordType="item.wordType" :id="`word_${i}_${j}`" :class="{
            active: activeWordType === item.wordType || activeWordType === 0,
            gray: lineWordItem?.word && lineWordItem?.word !== item.word
          }" :word="item.word" @click="showLine(item, `word_${i}_${j}`)">{{
  item.word }}</span>
        </template>
      </p>
      <Empty v-if="html.length === 0"></Empty>
    </div>
    <div class="isAdd" ref="isAdd" v-if="seletTxt" :style="askIsAddPosition">
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
      type: Object,
      default: () => ({})
    },
  },
  data() {
    return {
      keyWords: '',
      contentShow: '',
      html: [],
      activeWordType: 0, // 高亮禁用词或敏感词, 1 禁用词,  2 敏感词
      resultKey: 0,
      seletTxt: '',
      askIsAddPosition: {
        left: '',
        right: '',
        zIndex: 1
      }
    }
  },
  watch: {
    approval: {
      handler(val) {
        // console.log(val)
        this.getInitContent(val)
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
      this.$emit('addWord', this.seletTxt.trim());
      this.seletTxt = '';
    },
    hideAdd(e) {
      e = e || window.event;
      const elem = e.target;
      if (this.$refs?.isAdd && !this.$refs.isAdd.contains(elem) && this.seletTxt) {
        this.seletTxt = '';
      }
    },
    statrGetSelection() {
      window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
    },
    getSelection(event) {
      const seletTxt = window.getSelection ? window.getSelection().toString() : document.selection.createRange().text;
      if (seletTxt) {
        setTimeout(() => {
          this.seletTxt = seletTxt;
          this.askIsAddPosition = {
            left: (event.clientX + 10) + 'px',
            top: (event.clientY - 100) + 'px',
            zIndex: 1
          }
        }, 300);
      }
    },
    // 点击命中词,显示连线
    showLine(item, ocrWordId) {
      this.$emit('showLine', { ...item, ocrWordId })
    },
    // 修改高亮  关键词类型
    changeWorkType(type) {
      this.activeWordType = this.activeWordType === type ? 0 : type;
      this.$emit('lineRemove', this.activeWordType)
    },
    // 标记命中关键词(敏感词,禁用词)
    getInitContent(approval) {
      const html = []
      approval?.ocr?.forEach((ocr) => {
        const { text, location } = ocr;
        let newOcr = [text];
        approval?.recommends?.forEach((recommend, i) => {
          const { word, wordType } = recommend
          if (newOcr.join().includes(word)) {
            const temp = [];
            for (let index = 0; index < newOcr.length; index++) {
              if (typeof newOcr[index] === 'string' && newOcr[index].includes(word)) {
                const a = newOcr[index].split(word)
                a.splice(1, 0, {
                  word,
                  wordType,
                  location,
                  recommendI: i
                });
                temp.push(...a.filter(b => b !== ''))
              } else {
                temp.push(newOcr[index])
              }
            }
            newOcr = temp
          }
        })
        html.push(newOcr)
      });
      // console.log(html)
      this.html = html
    },
    // 高亮检索的关键词
    search() {
      this.resultKey++;
      if (!this.keyWords) {
        return;
      }
      this.$nextTick(() => {
        const textNodes = this.getTextNodeList(this.$refs.results);
        const textList = this.getTextInfoList(textNodes);
        const content = textList.map(({ text }) => text).join('');
        const matchList = this.getMatchList(content, this.keyWords);
        this.replaceMatchResult(textNodes, textList, matchList);
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
      const textList = textNodes.map(node => {
        const startIdx = length; const
          endIdx = length + node.wholeText.length
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
        const characters = [...'\\[](){}?.+*^$:|'].reduce((r, c) => (r[c] = true, r), {})
        keyword = keyword.split('').map(s => (characters[s] ? `\\${s}` : s)).join('[\\s\\n]*')
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
        const matchStart = match.index; const
          matchEnd = matchStart + match[0].length // 匹配结果在拼接字符串中的起止索引
        // 遍历文本信息列表，查找匹配的文本节点
        for (let textIdx = 0; textIdx < textList.length; textIdx++) {
          const { text, startIdx, endIdx } = textList[textIdx] // 文本内容、文本在拼接串中开始、结束索引
          if (endIdx < matchStart) continue // 匹配的文本节点还在后面
          if (startIdx >= matchEnd) break // 匹配文本节点已经处理完了
          let textNode = textNodes[textIdx] // 这个节点中的部分或全部内容匹配到了关键词，将匹配部分截取出来进行替换
          const nodeMatchStartIdx = Math.max(0, matchStart - startIdx) // 匹配内容在文本节点内容中的开始索引
          const nodeMatchLength = Math.min(endIdx, matchEnd) - startIdx - nodeMatchStartIdx // 文本节点内容匹配关键词的长度
          if (nodeMatchStartIdx > 0) textNode = textNode.splitText(nodeMatchStartIdx) // textNode取后半部分
          if (nodeMatchLength < textNode.wholeText.length) textNode.splitText(nodeMatchLength)
          const font = document.createElement('font')
          font.style.color = '#2D5CF6';
          font.innerText = text.substr(nodeMatchStartIdx, nodeMatchLength)
          textNode.parentNode.replaceChild(font, textNode)
        }
      }
    },
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
  background: #F7F8FA;
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
    color: #EB5D78;
    cursor: pointer;
    height: fit-content;

    &.active {
      background: #FFF1F0;
    }

    +span {
      color: #FDB123;

      &.active {
        background: #FFF7E6;
      }
    }
  }

  .el-input {
    /deep/ input {
      border: none;
      border-radius: 18px;
      font-size: 12px;
      color: #1D2128;
    }

    /deep/ .el-icon-search {
      color: #86909C;
      font-size: 16px;
    }
  }
}

.results {
  background: #ffffff;
  flex: 1;
  margin: 20px;
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

  .active[wordtype="1"] {
    color: #F76560;
  }

  .active[wordtype="2"] {
    color: #FDB123;
  }

  &.light {
    color: #86909C;

    .gray {
      color: #86909C;
    }
  }
}

.isAdd {
  position: fixed;
  padding: 16px 24px;
  border-radius: 4PX;
  box-shadow: 0px 0px 10px 0px #4343431A;
  font-size: 14px;
  font-weight: 700;
  line-height: 22px;
  background: #ffffff;

  .el-button {
    margin-top: 16px;
    background: linear-gradient(90deg, #2F54EB 0%, #5196FF 100%);
    border-radius: 6px;
    color: #ffffff;
    border: none;
  }
}
</style>
