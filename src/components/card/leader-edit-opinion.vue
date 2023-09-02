<template>
  <div class="leader-edit-opinion" v-loading="searchLoading">
    <el-form :model="form" :rules="rules" label-position="left" ref="form" class="basic-form">
      <el-form-item label="请选择" prop="isAccept">
        <el-radio-group v-model="form.isAccept" @change="updateForm">
          <el-radio :label="'1'">通过</el-radio>
          <el-radio :label="'0'">驳回</el-radio>
        </el-radio-group>
      </el-form-item>
      <!-- &&refuseWay=='TO_BEFORE' -->
      <el-form-item label="请选择驳回人" prop="crtDisavower" v-if="form.isAccept == '0' && refuseWay == 'TO_BEFORE'">
        <el-select v-model="form.crtDisavower" placeholder="请选择驳回节点/驳回人" @change="updateForm('disavower')"
        popper-class="disavower-popper" :popper-append-to-body="true">
          <el-option v-for="(item, index) in disavower" :key="index"
            :label="item.name + '/' + item.label + ' 【' + item.nodeName + '】'" :value="item" >
            <div style="display: flex;justify-content: space-between;" >
              <span class="ellipsis ellipsis_1" style="
                width: 32%;
                font-weight: 700;
                color: #1d2128;
                font-size: 14px;
                line-height: 34px;
                display: inline-block;
              ">{{ item.name }}</span>
            <span class="ellipsis ellipsis_1 " style="
                width: 32%;
                color: #505968;
                font-size: 14px;
                line-height: 34px;
                display: inline-block;
                font-weight: 400;
              ">{{ item.label }}

            </span>
            <span class="ellipsis ellipsis_1 " style="
                width: 32%;
                color: #505968;
                font-size: 14px;
                line-height: 34px;
                display: inline-block;
                font-weight: 400;
              "> · {{ item.nodeName }}
            </span> </div>
      
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="请选择驳回原因" prop="reason" v-if="form.isAccept == '0'">
        <el-select v-model="form.reason" placeholder="请选择驳回原因" @change="updateForm">
          <el-option v-for="item in reasons" :key="item.value" :label="item" :value="item"></el-option>
        </el-select>
      </el-form-item>
      <!--  && assignedType == 'SELF_SELECT' -->
      <el-form-item label="请选择审批人" prop="crtApprover" v-if="form.isAccept == '1' && assignedType == 'SELF_SELECT'">
        <el-select v-model="form.crtApprover" placeholder="需【下一节点名称】审批，请选择审批人" @change="updateForm">
          <el-option v-for="item in approver" :key="item.id"
            :label="item.name + '/' + item.label + ' 【' + item.nodeName + '】'" :value="item.id">
            <p class="flex">
              <span style="
             width: 33%;
                font-weight: 700;
                color: #1d2128;
                font-size: 14px;
                line-height: 34px;
                display: inline-block;
              " class="ellipsis ellipsis_1">{{ item.name }}</span>
              <span style="
                 width: 33%;
                color: #505968;
                font-size: 14px;
                line-height: 34px;
                display: inline-block;
                font-weight: 400;

              " class="ellipsis ellipsis_1">{{ item.label }}

              </span>
              <span style="
                 width: 33%;
                color: #505968;
                font-size: 14px;
                line-height: 34px;
                display: inline-block;
                font-weight: 400;
              "> · {{ item.nodeName }}

              </span>
            </p>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="审查意见" class="opinion">
        <el-input type="textarea" placeholder="请输入审查话术内容" v-model="form.content" resize="none"
          @change="updateForm"></el-input>
      </el-form-item>

    </el-form>
    <!-- 用户自定义模块 -->
    <template>
      <el-form hide-required-asterisk label-width="75px" class="my-form">
        <template v-for="(item, index) in filledInByApprover">
          <el-form-item :class="formItemCpt(item)" :key="index">
            <label slot="label">
              <i>{{ item.title }}</i>
              <span :style="{ color: 'red', opacity: item.props.required || 0 }">
                *
              </span></label>
            <el-input v-if="item.name === 'TextInput'" :disabled="item.perm === 'R'" v-model.trim="item.value"
              :placeholder="item.props.placeholder" @change="updateForm"></el-input>
            <el-select v-else-if="item.name === 'SelectInput' && !item.props.expanding" :disabled="item.perm === 'R'"
              v-model.trim="item.value" :placeholder="item.props.placeholder" @change="updateForm">
              <el-option v-for="(iten, indey) in item.props.options" :key="indey" :label="iten.value"
                :value="iten.id"></el-option>
            </el-select>

            <el-radio-group v-else-if="item.name === 'SelectInput' && item.props.expanding" :disabled="item.perm === 'R'"
              v-model.trim="item.value" @change="updateForm">
              <el-radio v-for="(iten, indey) in item.props.options" :key="indey" :label="iten.id">{{ iten.value
              }}</el-radio>
            </el-radio-group>
            <el-checkbox-group v-else-if="item.name === 'MultipleSelect' && item.props.expanding"
              v-model.trim="item.value" :disabled="item.perm === 'R'" @change="updateForm">
              <template v-for="(iten, indey) in item.props.options">
                <el-checkbox :key="indey" :label="iten.id">{{ iten.value }}</el-checkbox>
              </template>
            </el-checkbox-group>

            <div class="groups-select" v-else-if="item.name === 'MultipleGroupsSelect'">
              <div v-for="iten in item.props.options" :key="iten.id">
                <p class="group-title">{{ iten.value }}</p>
                <el-checkbox-group class="group-value" v-model="item.value" :disabled="item.perm === 'R'"
                  @change="updateForm">
                  <el-checkbox v-for="(itenItem, indey) in iten.children" :key="indey" :label="itenItem.id">{{
                    itenItem.value }}
                  </el-checkbox>
                </el-checkbox-group>
              </div>
            </div>
            <el-select v-else-if="item.name === 'MultipleSelect' && !item.props.expanding" :disabled="item.perm === 'R'"
              v-model.trim="item.value" :placeholder="item.props.placeholder" multiple @change="updateForm">
              <el-option v-for="(iten, indey) in item.props.options" :key="indey" :label="iten.value"
                :value="iten.id"></el-option>
            </el-select>

            <el-date-picker v-else-if="item.name === 'TimePicker'" :disabled="item.perm === 'R'" type="datetime"
              :placeholder="item.props.placeholder" :format="item.props.format" v-model.trim="item.value"
              :picker-options="pickerTime(item.props.gl, item.props.order)" @change="updateForm"
              style="width: 100%"></el-date-picker>

            <el-input v-else-if="item.name === 'TextareaInput'" :disabled="item.perm === 'R'" type="textarea"
              v-model.trim="item.value" :placeholder="item.props.placeholder" @change="updateForm"></el-input>
            <el-cascader v-else-if="item.name === 'Cascader'" v-model="item.value" :options="item.props.childrens"
              :props="{ label: 'value', value: 'id', checkStrictly: true, multiple: item.props.multiple }" clearable
              @change="updateForm">
            </el-cascader>
          </el-form-item>
        </template>
      </el-form>
    </template>
  </div>
</template>
<script>
import { getEditById } from '@/api/approvalCenter'
export default {
  props: {
    filledInByApprover: {
      type: Array,
      default: () => []
    },
  },
  data() {
    return {
      disavower: [],
      approver: [],
      rules: {
        isAccept: [{ required: true, message: "请选择", trigger: ["blur"] }],
        crtApprover: [
          { required: true, message: "请选择审批人", trigger: ["blur"] },
        ],
        crtDisavower: [
          { required: true, message: "请选择驳回节点/驳回人", trigger: ["blur"] },
        ],
        reason: [
          { required: true, message: "请选择驳回原因", trigger: ["blur"] },
        ],
      },
      searchLoading: false,
      reasons: ['文件预览失败（文件损坏/清晰度过低）', '附件材料与审批项目不匹配', '其他'],
      form: {
        isAccept: "",
        approver: "",
        content: "",
        reason: '',
        crtDisavower: null,
      },
      refuseWay: '',  // TO_NODE 驳回到指定节点 / TO_BEFORE 审批人自选（前序节点）
      assignedType: '', // SELF_SELECT 流程配置中下一节点审批人设置时选择“上一审批人选择”，增加选择审批人选择则框
      externalData: {},// 
    };
  },
  computed: {
    formItemCpt() {
      return item => {
        if (item.name === 'SelectInput' && !item.props.expanding) {
          return ['form-item'];
        } else if (item.name === 'MultipleSelect' && !item.props.expanding) {
          return ['form-item'];
        } else if (item.name === 'TimePicker' || item.name === 'Cascader') {
          return ['form-item'];
        } else {
          return [];
        }
      };
    }
  },
  watch: {},

  mounted() {
    console.log('filledInByApprover', this.filledInByApprover)
  },
  methods: {
    initData(data) {
      // 查询是否保存过东西
      const { taskId, processInstanceId } = data
      this.getEditById(taskId, processInstanceId)
      this.externalData = data
      this.disavower = data.disavower
      this.approver = data.approver
      this.refuseWay = data.refuseWay
      this.assignedType = data.assignedType
    },
    getEditById(taskId, processInstanceId) {
      const param = {
        taskId,
        processInstanceId,
      }
      this.searchLoading = true
      getEditById(param).then(res => {
        const { data } = res.data
        this.searchLoading = false
        // 如果 data为空
        if (!data) {
          this.$refs['form'].resetFields()
        } else {
          // 区分通过与驳回
          const { success, msg, targetUser, reason } = data
          this.form.isAccept = success ? '1' : '0'
          this.form.content = msg
          if (success) {
            this.form.crtApprover = targetUser || ''
          } else {
            this.form.crtDisavower = targetUser || ''
            this.form.reason = reason
          }
        }
      }).catch(err => {
        this.searchLoading = false
      })

    },
    updateForm() {
      //动态表单
      const approver_params = this.filledInByApprover?.map(v => {
        return {
          formItemId: v.id,
          valueType: v.name,
          value: v.value
        }
      }) || []
      let params = {
        ...this.externalData,
        ...this.form,
        formId: this.externalData.formId,
        assignedType: this.assignedType,
        formItemDataList: approver_params
      }
      // 若审核员选择了驳回
      if (this.form.isAccept == '0') {
        params = {
          ...params,
          ...this.form.crtDisavower,
        }
      }
      this.$refs["form"].validate((valid) => {
        this.$store.commit('setEditOpinionRequired', valid)
        this.$store.commit('setEditOpinionForm', params)
      });
    },
  },
};
</script>
<style lang="less" scoped>
.leader-edit-opinion {
  width: 100%;

  /deep/ .basic-form {
    .el-form-item {
      display: flex;
      flex-direction: column;
    }

    .el-form-item__label {
      color: #1d2128;
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      // line-height: 22px;
    }

    .el-form-item__label::before {
      display: none;
    }

    .is-required .el-form-item__label::after {
      content: "*";
      color: #f76560;
      margin-left: 5px;
      font-size: 16px; //改变星号的大小
    }

    .el-form-item__content {
      border-radius: 4px;
      background: #f7f8fa;
      border-radius: 4px;
      padding: 0 16px;

      .el-select {
        width: 100%;
      }

      .el-select .el-input__inner {
        background: #f7f8fa;
        border: none;
        padding: 0;
        // color: #ACB1B9;
      }

      .el-select .el-input .el-icon-arrow-up::before {
        font-family: element-icons !important;
        content: "\e78f";
      }
    }

    .el-form-item__error::before {
      font-family: element-icons !important;
      content: "\e7a3";
      font-size: 20px;
      margin-right: 8px;
    }

    .el-form-item__error {
      display: flex;
      align-items: center;
      margin-top: 6px;
      color: #eb5757;
    }

    .opinion {
      .el-form-item__content {
        padding: 0;

        .el-textarea {
          height: 96px;

          .el-textarea__inner {
            height: 100%;
          }
        }
      }
    }
  }

  /deep/ .my-form {
    .el-form-item {
      display: flex;
      align-items: center;
    }

    .el-form-item__label {
      line-height: 22px;
      color: #1d2128;
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      display: flex;
      align-items: center;
      text-align: left;
    }

    .el-form-item__content {
      flex: 1;
      margin-left: 0 !important;
    }
  }

}</style>
<style lang="less">
.disavower-popper{
width: 384px !important;
}
</style>

