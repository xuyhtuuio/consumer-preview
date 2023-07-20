<template>
  <div class="publicity-channels"> 
    <g-table-card :title="title">
      <template v-slot:cardInfo>{{cardInfo}}</template>
      <template v-slot:content>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" :hide-required-asterisk="true" label-width="100px" class="ruleForm my-form">
           <el-form-item  v-for="item,index in list" :key="index" prop="name">
              <label slot="label">{{item.module}}<span style="color:red;opacity: 0;"> *</span></label>
              <el-checkbox-group v-model="item.value">
                <el-checkbox v-for="item in item.props.options" :key="item.id"  :label="item.id">{{item.value}}</el-checkbox>
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
        ruleForm: {
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
     .ruleForm {
      padding: 16px 72px 0;
    }
}
</style>