<template>
  <div :class="{'node': true, 'node-error-state': showError}">
    <div :class="{'node-body': true, 'error': showError}">
      <!-- <div class="node-body-left" @click="$emit('leftMove')" v-if="level > 1">
        <i class="el-icon-arrow-left"></i>
      </div> -->
      <div class="node-body-main"  @click="$emit('selected')">
        <div class="node-body-main-header">
          <svg class="icon" aria-hidden="true" style="width: 16px;height: 16px;margin-right: 5px;position: relative;top:2px;">
            <use xlink:href="#icon-mind-mapping"></use>
          </svg>
          <!-- <i class="mind-mapping"></i> -->
          <span class="title">{{config.name ? config.name:('条件' + level)}}</span>
          <span class="option">
            <!-- <el-tooltip effect="dark" content="复制条件" placement="top">
              <i class="el-icon-copy-document" @click.stop="$emit('copy')"></i>
            </el-tooltip> -->
            <i class="el-icon-close" @click.stop="$emit('delNode')"></i>
          </span>
        </div>
        <div class="node-body-main-content">
          <span class="placeholder" v-if="!content">{{placeholder}}</span>
          <span v-else>{{content}}</span>
        </div>
        <div class="node-body-main-footer">
          <span class="level">优先级{{level}}</span>
        </div>
      </div>
      <!-- <div class="node-body-right" @click="$emit('rightMove')" v-if="level < size">
        <i class="el-icon-arrow-right"></i>
      </div> -->
      <div class="node-error" v-if="showError">
        <el-tooltip effect="dark" :content="errorInfo" placement="top-start">
          <i class="el-icon-warning-outline"></i>
        </el-tooltip>
      </div>
    </div>
    <div class="node-footer">
      <div class="btn">
        <insert-button @insertNode="type => $emit('insertNode', type)"></insert-button>
      </div>
    </div>
  </div>
</template>

<script>
import InsertButton from '@/views/common/InsertButton.vue'

export default {
  name: "ConditionNode",
  components: {InsertButton},
  props:{
    config:{
      type: Object,
      default: () => {
        return {}
      }
    },
    //索引位置
    level:{
      type: Number,
      default: 1
    },
    //条件数
    size:{
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      placeholder: '请设置条件',
      errorInfo:'',
      showError: false,
      content: ''
    }
  },
  // computed:{
  //   content(){
  //     this.config
  //   }
  // },
  watch: {
    config: {
      handler() {
        this.setContent()
      },
      immediate: true,
      deep: true
    }
  },
  created() {
    this.bus.$on('closeConfigDrawer', () => {
      this.setContent()
    })
  },
  methods: {
    //校验数据配置的合法性
    validate(err){
      const map = {
        0: 'A',
        1: 'B',
        2: 'C',
        3: 'D',
        4: 'E',
        5: 'F',
        6: 'G',
        7: 'H',
        8: 'I',
        9: 'J',
      }
      this.config.props.groups.forEach((g, i) => {
        if (!g.conditions.length) {
          this.showError = true
          this.errorInfo = '请完善条件信息'
          err.push(`${this.config.name} 条件组${map[i]} 未设置任何条件`)
        }
        g.conditions.forEach(c => {
          if (!c.value || c.value.length === 0) {
            err.push(`${this.config.name} 条件组${map[i]} 未设置${c.title}`)
            this.showError = true
            this.errorInfo = '请完善条件信息'
          }
        })
      })
      return this.showError
    },
    setContent() {
      this.content = ''
      this.config.props.groups.forEach((g, i) => {
        g.conditions.forEach(c => {
          if (c.value.length > 0) {
            this.content = '已设置'
            this.showError = false
          }
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import "@/assets/theme";

.node-error-state{
  .node-body{
    box-shadow: 0px 0px 5px 0px #F56C6C !important;
  }
}
.node{
  margin: 30px 55px 0;
  width: 220px;
  .node-body{
    cursor: pointer;
    min-height: 118px;
    max-height: 158px;
    position: relative;
    border-radius: 10px;
    background-color: white;
    box-shadow: 0px 0px 5px 0px #d8d8d8;
    &:hover{
      .node-body-left, .node-body-right{
        i{
          display: block !important;
        }
      }
      .node-body-main {
        // .level{
        //   display: none !important;
        // }
        .option{
          display: inline-block !important;
        }
      }
      box-shadow: 0px 0px 3px 0px @primary;
    }
    .node-body-left, .node-body-right{
      display: flex;
      align-items: center;
      position: absolute;
      height: 100%;
      i{
        display: none;
      }
      &:hover{
        background-color: #ececec;
      }
    }
    .node-body-left{
      left: 0;
    }
    .node-body-right{
      right: 0;
    }
    .node-body-main {
      .node-body-main-header{
        padding: 10px 16px 5px;
        font-size: 14px;
        position: relative;
        .title{
          color: #505968;
        }
        .option{
          position: absolute;
          right: 0;
          display: none;
          font-size: medium;
          i{
            color: #888888;
            padding: 0 3px;
          }
        }
      }
      .node-body-main-footer {
        position: absolute;
        width: 100%;
        height: 30px;
        line-height: 30px;
        bottom: 0;
        background: #20CE5B;
        text-align: center;
        border-bottom-left-radius: 5px;
        border-bottom-right-radius: 5px;
        .level{
          font-size: 14px;
          color: #FFFFFF;
        }
      }
      .node-body-main-content {
        padding: 6px 16px;
        color: #656363;
        font-size: 14px;

        i {
          position: absolute;
          top: 55%;
          right: 10px;
          font-size: medium;
        }

        .placeholder {
          color: #8c8c8c;
        }
      }
    }

    .node-error{
      position: absolute;
      right: -40px;
      top: 20px;
      font-size: 25px;
      color: #F56C6C;
    }
  }

  .node-footer{
    position: relative;
    .btn{
      width: 100%;
      display: flex;
      height: 70px;
      padding: 20px 0 32px;
      justify-content: center;
    }
    /deep/ .el-button{
      height: 32px;
      line-height: 14px;
    }
    &::before{
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: -1;
      margin: auto;
      width: 2px;
      height: 100%;
      background-color: #CACACA;
    }
  }
}
</style>
