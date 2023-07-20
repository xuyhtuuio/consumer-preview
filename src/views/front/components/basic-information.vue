<template>
  <div class="basic-information"> 
    <g-table-card :title="title">
      <template v-slot:cardInfo>
          <div class="cardInfo">
            <g-icon class="right-icon" stylePx="20" href="#icon-guanzhu1"/>
            {{cardInfo}}
          </div>
      </template>
      <template v-slot:content> 
      <el-form :hide-required-asterisk="true" label-width="100px" class="ruleForm my-form ">
        <template v-for="item,index in list">
          <el-form-item :ref="`${item.id}Ref`"  v-if="item.name==='TextInput'" :key=index>
           <label slot="label">{{item.title}}<span :style="{'color':'red',opacity: !item.props.required && 0}"> * </span></label>
            <el-input v-model="item.value" :placeholder="item.props.placeholder"></el-input>
              <div class="warn" v-if="item.isWarning"><warn-info :info="judgementWarnCpt(item)"></warn-info></div>
          </el-form-item>
          <el-form-item :ref="`${item.id}Ref`" v-if="item.name==='SelectInput' && item.props.expanding" class="form-item" :prop="item.id" :key=index>
        <label slot="label">{{item.title}}<span :style="{'color':'red',opacity: !item.props.required && 0}"> * </span></label>
          <el-select v-model="item.value" :placeholder="item.props.placeholder">
            <el-option v-for="iten,indey in item.props.options" :key="indey" :label="iten.value" :value="iten.id"></el-option>
          </el-select>
           <div class="warn" v-if="item.isWarning"><warn-info :info="judgementWarnCpt(item)"></warn-info></div>
        </el-form-item>
        <el-form-item :ref="`${item.id}Ref`" v-if="item.name==='SelectInput' && !item.props.expanding" :key="index">
          <label slot="label">{{item.title}}<span :style="{'color':'red',opacity: !item.props.required && 0}"> * </span></label>
          <el-radio-group v-model="item.value">
             <el-radio v-for="iten,indey in item.props.options" :key="indey" :label="iten.value" :value="iten.id"></el-radio>
          </el-radio-group>
           <div class="warn" v-if="item.isWarning"><warn-info :info="judgementWarnCpt(item)"></warn-info></div>
        </el-form-item>

          <el-form-item :ref="`${item.id}Ref`" v-if="item.name==='MultipleSelect' && item.props.expanding" :key="index">
             <label slot="label">{{item.title}}<span :style="{'color':'red',opacity: !item.props.required && 0}"> * </span></label>
              <el-checkbox-group v-model="item.value">
                <template v-for="iten,indey in item.props.options">
                  <!-- <template v-if="iten.id == 9999">
                     <el-checkbox :key="indey" @change="checked=>checkRow (checked, item)" :label="iten.id">{{iten.value}}</el-checkbox>
                    <el-input class="checkbox-ipt" v-show="item.value.includes(iten.id)" :key="iten.id" :value="checkBox[item.id]" @input="(val)=>handleInput(val,item,iten.id)" placeholder="请补充具体内容"></el-input>
                  </template> -->
                   <el-checkbox  :key="indey"  :label="iten.id">{{iten.value}}</el-checkbox>
                  
                </template>
                

              </el-checkbox-group>
               <div class="warn" v-if="item.isWarning"><warn-info :info="judgementWarnCpt(item)"></warn-info></div>
        </el-form-item>
        
          <el-form-item :ref="`${item.id}Ref`" class="form-item" v-if="item.name==='MultipleSelect' && !item.props.expanding" :key="index" :prop="item.id">
            <label slot="label">{{item.title}}<span :style="{'color':'red',opacity: !item.props.required && 0}"> * </span></label>
               <el-select v-model="item.value" :placeholder="item.props.placeholder" :multiple="true">
            <el-option v-for="iten,indey in item.props.options" :key="indey" :label="iten.value" :value="iten.id"></el-option>
          </el-select>
           <div class="warn" v-if="item.isWarning"><warn-info :info="judgementWarnCpt(item)"></warn-info></div>
        </el-form-item>

        <el-form-item :ref="`${item.id}Ref`" class="form-item" v-if="item.name==='TimePicker'" :key="index"  :prop="item.id" >
               <label slot="label">{{item.title}}<span :style="{'color':'red',opacity: !item.props.required && 0}"> * </span></label>
              <el-date-picker type="datetime" :placeholder="item.props.placeholder" :format="item.props.format" v-model="item.value" :picker-options="pickerTime(item.props.gl,item.props.order)" style="width: 100%;"></el-date-picker>
               <div class="warn" v-if="item.isWarning"><warn-info :info="judgementWarnCpt(item)"></warn-info></div>
         </el-form-item>
            <!-- <el-form-item :ref="`${item.id}Ref`" class="form-item" v-if="item.name==='TimePicker' && !item.props.required" :key="index" :prop="item.id">
               <label slot="label">{{item.title}}<span :style="{'color':'red',opacity: !item.props.required && 0}"> * </span></label>
              <el-date-picker type="datetime" :placeholder="item.props.placeholder" :format="item.props.format" v-model="item.value" :picker-options="endTime(item.props.gl)" style="width: 100%;"></el-date-picker>
               <div class="warn" v-if="item.isWarning"><warn-info :info="judgementWarnCpt(item)"></warn-info></div>
            </el-form-item> -->
              <el-form-item :ref="`${item.id}Ref`" v-if="item.name==='TextareaInput'" :key="index" :prop="item.id">
                <label slot="label">{{item.title}}<span :style="{'color':'red',opacity: !item.props.required && 0}"> * </span></label>
                <el-input type="textarea" v-model="item.value" :maxlength="item.props.numberOfWords" :placeholder="item.props.placeholder"></el-input>
                 <div class="warn" v-if="item.isWarning"><warn-info :info="judgementWarnCpt(item)"></warn-info></div>
              </el-form-item>

              <el-form-item :ref="`${item.id}Ref`" class="form-item"  v-if="item.name==='Cascader'" :key="index" :prop="item.id">
                <label slot="label">{{item.title}}<span :style="{'color':'red',opacity: !item.props.required && 0}"> * </span></label>
                 <el-cascader
                  v-model="item.value"
                  :options="item.props.options"
                  >
                  </el-cascader>
                   <div class="warn" v-if="item.isWarning"><warn-info :info="judgementWarnCpt(item)"></warn-info></div>
              </el-form-item>
        </template>
      </el-form>
      </template>
    </g-table-card>
  </div>
</template>

<script>
import WarnInfo from "./warn-info"
function rulesFn(data) {
  switch(data.name) {
    case "TextInput":
      return [{ required: true, message: `请输入${data.title}`, },
            { min: 3, max: data.props.numberOfWords, message: `长度在 1 到 ${data.props.numberOfWords} 个字符` }]
    case "SelectInput":
      return  [{ required: true, message: `请选择${data.title}`, trigger: 'change' }]
    case "MultipleSelect":
      return [{ type: 'array', required: true, message: `请至少选择一个${data.title}`, trigger: 'change' }]
    case "TimePicker":
      return [{ type: 'date', required: true, message: '请选择日期', trigger: 'change' }]
      case "Cascader":
        return [{ type: 'array',required: true, message: `请选择${data.title}`, trigger: 'change' }]
  }
}
  export default {
    components: {
      WarnInfo
    },
    props: {
      list: {
        typeof: Array,
        default: ()=> ([])
      }
    },
    data(){
      return {
        flag:9999,
        title: '基本信息',
        cardInfo: "提醒：产品类内容审查，需于在产品上线/宣传前14天进行提交。",
        startTime1:  this.list.find(item =>  item.name==='TimePicker' && item.props.required ),
        endTime1:  this.list.find(item =>  item.name==='TimePicker' && !item.props.required ),
        checkBox: {

        },
      // endTime:{
      //   disabledDate: time => {
      //   // 既不能大于当前日期 也不能大于开始日期
      //      if(this.startTime1.value) {
      //         return time.getTime() < new Date(this.startTime1.value).getTime()
      //      }
      //       return time.getTime() < new Date() - 8.64e7
      //       // 如果想实现结束时间可以在开始时间当天内的话 可以减掉86400000秒，相当于一天。
      //       // return time.getTime() < new Date(this.params.actStartTime).getTime() - 86400000;
      //     }
      // },
        ruleForm: {
        },
        rules: {
          1231231: [{ required: true, message: '请输入活动名称', trigger: 'blur' },
            { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }],
          name: [
            { required: true, message: '请输入活动名称', trigger: 'blur' },
            { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ],
          region: [
            { required: true, message: '请选择活动区域', trigger: 'change' }
          ],
          date1: [
            { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
          ],
          type: [
            { type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change' }
          ],
          resource: [
            { required: true, message: '请选择活动资源', trigger: 'change' }
          ],
          desc: [
            { required: false, message: '请填写活动形式', trigger: 'blur' }
          ]
        },
        offsetTop: 0
      }
    },
    created() {
       this.list.forEach(item =>  {
         if(item.props.required) {
          item.warnInfo = rulesFn(item)
          this.$set(item,'isWarning',false)
         }
          
        })
    },
    computed: {
      rulesCpt() {
        const result = {}
        this.list.forEach(item =>  {
          // this.ruleForm[item.id] = item.value
          if(item.props.required) {
            result[item.id] = rulesFn(item)
          }
        })
        const result2 = {}
          result2[this.list[0].id] = rulesFn(this.list[0])
        return result
      },
    },
    methods: {
      pickerTime(id, order) {
        if(order == 0) {return this.startTime(id)}
        else {
          return this.endTime(id)
        }
      },
      startTime(nextId){
        const value = this.list.find(item=>item.id === nextId).value
        return {
          disabledDate: time => {
          // 既不能大于当前日期 也不能小于结束日期
            if(value) {
                return time.getTime() > new Date(value).getTime()
            }
              return time.getTime() < new Date() - 8.64e7
              // - 8.64e7减去了当天，即可选择当天
          }
        }
      },
      handleInput(val,item,id) {
        // this.checkBox[item.id]= val
        this.$set(this.checkBox,item.id,val)
        // item.value
      },
       endTime(prevId) {
        const value = this.list.find(item=>item.id === prevId).value
        return {
        disabledDate: time => {
        // 既不能大于当前日期 也不能大于开始日期
           if(value) {
              return time.getTime() < new Date(value).getTime()
           }
            return time.getTime() < new Date() - 8.64e7
            // 如果想实现结束时间可以在开始时间当天内的话 可以减掉86400000秒，相当于一天。
            // return time.getTime() < new Date(this.params.actStartTime).getTime() - 86400000;
          }
      }
       },
      judgementWarnCpt(item) {
        console.log(String(item.value));
        const offsetTop = this.$refs[`${item.id}Ref`][0].$el.offsetTop
        let flag
        if(item.valueType == 'Date') {
          flag = String(item.value)
        }else {
          flag = item.value
        }
        if(!flag.length && typeof item.value !== 'number') {
          if(this.offsetTop === 0) {
            this.offsetTop = offsetTop
          }
            return item.warnInfo[0].message
          }else if (item.props.numberOfWords && item.value,length >item.props.numberOfWords) {
            console.log(this.$refs[`${item.id}Ref`][0].$el.offsetTop);
            if(this.offsetTop === 0) {
            this.offsetTop = offsetTop
          }
              return item.warnInfo[1].message
          }else {
              item.isWarning = false
          }
       },
      judgeWarn() {
       const result = this.list.every((item,index)=>{
        if(item.props.required) {
          return item.value.length !== 0
        }else {
          return true
        }
        })
        console.log(result);
        if(!result) {
          this.list.forEach(item => {
          if(item.props.required) {
            console.log(item.title);
            // item.isWarning = true;
            this.$set(item,'isWarning',true)
          }
          })
        }
        return result
      },
      // 其他输入框
      checkRow(check,item) {
        console.log(check,item);
        if(!check) {
        this.checkBox[item.id] = ""
        }
      }
    }
  }
</script>

<style lang="less" scoped>


.basic-information {
  .cardInfo {
      display: flex;
      align-items: center;
      padding: 0 8px;
      border-radius: 20px;
      background: rgba(255, 252, 232, 1);
      color: rgba(250, 140, 22, 1);
    }
    .ruleForm {
      padding: 16px 72px 0;
      display: flex;
      flex-wrap: wrap;
      /deep/.el-form-item{
        width: 100%;
      }
      .form-item {
        width: 50%;

        
      }
      .checkbox-ipt {
        display: inline-block;
        width: auto;
          /deep/.el-input__inner {
            width: 320px;
            height: 24px;
            padding-left: 10px;
            background-color: rgba(255, 255, 255, 1); 
            border-radius: 6px;
            font-size: 12px;
          }
        }
    }

    .warn {
      // margin-top: -16px;
      margin-left: -16px;
      background: #fff;
      line-height: normal;
      font-size: 12px;
      color: rgba(235, 87, 87, 1);
    }
}
</style>