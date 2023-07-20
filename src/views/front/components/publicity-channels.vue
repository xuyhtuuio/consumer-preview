<template>
  <div class="publicity-channels" ref="globalRef"> 
    <g-table-card :title="title">
      <template v-slot:cardInfo> 
        <div class="cardInfo">
            {{cardInfo}}
          </div>
          <div class="warn" v-if="judgeWarnFlag">
             <g-icon class="right-icon" stylePx="20" href="#icon-guanzhu1"/>
             {{warnInfo}}
          </div>
      </template>
      <template v-slot:content>
        <el-form ref="ruleForm" :hide-required-asterisk="true" label-width="100px" class="ruleForm my-form">
           <el-form-item  v-for="item,index in list" :key="index" prop="name">
                <label slot="label">{{item.title}}<span :style="{'color':'red',opacity: !item.props.required && 0}"> * </span></label>
              <el-checkbox-group v-model="item.value">
                <el-checkbox v-for="item in item.props.options" :key="item.id" @change="handleChange" :label="item.id">{{item.value}}</el-checkbox>
              </el-checkbox-group>
        </el-form-item>
        </el-form>
      </template>
    </g-table-card>
  </div>
</template>

<script>
  export default {
    props: {
      list: {
        typeof: Array,
        default: ()=> ([])
      }
    },
    data(){
      return {
        title: "宣传渠道",
        cardInfo: "*",
        judgeWarnFlag:false,
        warnInfo: "必须勾选至少一项才可提交申请",
       
      }
    },
    methods: {
      handleChange(flag) {
        if(this.judgeWarnFlag === true)this.judgeWarnFlag = false
      },
      judgeWarn() {
        if(this.list.some(item=> item.value.length !== 0)) {
          return [true]
        }else {
          const  offsetTop = this.$refs[`globalRef`].offsetTop
          this.judgeWarnFlag = true
          return [false,offsetTop]
        }
      }
    }
  }
</script>

<style lang="less" scoped>


.publicity-channels {
    .cardInfo {
      padding: 0 8px;
    }
     .warn {
      display: flex;
      align-items: center;
      margin-left: 14px;
      font-size: 12px;
      color: rgba(235, 87, 87, 1);
      .right-icon {
        margin-right:8px
      }
    }
     .ruleForm {
      padding: 16px 72px 0;
    }
}
</style>