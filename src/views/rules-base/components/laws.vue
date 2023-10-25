<!--
 * @Author: nimeimix huo.linchun@trs.com.cn
 * @Date: 2023-10-24 11:19:25
 * @LastEditors: nimeimix huo.linchun@trs.com.cn
 * @LastEditTime: 2023-10-25 16:50:21
 * @FilePath: /consumer-preview/src/views/rules-base/components/laws.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="laws" v-loading="search.loading">
    <Filters @addRule="addRule"></Filters>
    <div v-if="list.length" class="list-content">
      <div class="list" v-for="(item, index) in list" :key="index">
        <div class="cards pointer">
          <fileType
            :fileName="item.name || item.fileName"
            class="file-icon"
          ></fileType>
          <div class="file-info">
            <p class="name">
              {{ item.fileName }}

              <el-popover
                placement="bottom"
                width="108"
                popper-class="user-edit-popover"
                trigger="click"
                content="这是一段内容,这是一段内容,这是一段内容,这是一段内容。"
                v-model="lawEditPopover"
              >
                <ul>
                  <li @click="editRule">编辑</li>
                  <li @click="updateRule">更新</li>
                  <li @click="delRule">删除</li>
                </ul>
                <i
                  class="more iconfont icon-quanburenwu-gengduocaozuo"
                  slot="reference"
                ></i>
              </el-popover>
            </p>
            <p class="tags">
              <span class="effective">有效</span>
              <span class="prod-type">产品类型-理财产品</span>
              <span class="prod-type">事项类型-广告宣传</span>
              <span class="word-type">消费者自主选择权</span>
              <span class="word-type">公平交易权</span>
            </p>
            <p class="content ellipsis ellipsis_2">{{ item.content }}</p>
            <div class="detail">
              <div class="file-unit">
                <span
                  >发文单位：<i>{{ wordEllipsis(item.unit, 20) }}</i></span
                >
                <span>发文字号：北证公告〔2023〕76号</span>
                <span>发布时间：2023-11-23</span>
              </div>
              <div class="share">
                <span style="margin-right: 20px" @click="copyLink">
                  <i
                    class="iconfont icon-fenxiang"
                    style="margin-right: 4px"
                  ></i
                  >分享
                </span>
                <span>561次阅读</span>
              </div>
            </div>
          </div>
        </div>
        <trs-pagination
          :total="search.total"
          @getList="nextPage"
          :pageNow="search.pageNow"
        ></trs-pagination>
      </div>
    </div>
    <Empty v-else v-loading="search.loading" class="list"></Empty>
    <el-dialog
      title="新增法规"
      :visible.sync="dialogVisible"
      width="800px"
      center
      custom-class="add-rule"
      :before-close="closeDialog"
    >
      <el-form label-width="70px" :model="form" :rules="rules" ref="form">
        <el-form-item label="法规名称" prop="name">
          <el-input
            v-model="form.name"
            clearable
            placeholder="请输入法规名称"
          ></el-input>
          <div class="error-tip">
            <el-popover
              placement="top"
              trigger="hover"
              content="法规名称最多可输入50字"
              v-if="validatorForm.nameError"
            >
              <i class="iconfont icon-a-tubiao1 pointer" slot="reference"></i>
            </el-popover>
          </div>
        </el-form-item>
        <el-form-item label="发文单位" prop="unit">
          <el-input v-model="form.unit" clearable placeholder="请输入发文单位">
          </el-input>
          <div class="error-tip">
            <el-popover
              placement="top"
              trigger="hover"
              content="发文单位最多可输入50字"
              v-if="validatorForm.unitError"
            >
              <i class="iconfont icon-a-tubiao1 pointer" slot="reference"></i>
            </el-popover>
          </div>
        </el-form-item>
        <div class="flex form-item2">
          <el-form-item label="发文字号" prop="documentNumber">
            <el-input
              v-model="form.documentNumber"
              clearable
              placeholder="请输入发文字号"
            ></el-input>
            <div class="error-tip">
              <el-popover
                placement="top"
                trigger="hover"
                content="发文字号最多可输入50字"
                v-if="validatorForm.documentNumberError"
              >
                <i class="iconfont icon-a-tubiao1 pointer" slot="reference"></i>
              </el-popover>
            </div>
          </el-form-item>
          <el-form-item label="发布时间" prop="date">
            <el-date-picker
              type="date"
              placeholder="请选择日期"
              v-model="form.date"
              style="width: 100%"
            >
            </el-date-picker>
            <div class="error-tip">
              <el-popover
                placement="top"
                trigger="hover"
                content="请选择发布时间"
                v-if="validatorForm.dateError"
              >
                <i class="iconfont icon-a-tubiao1 pointer" slot="reference"></i>
              </el-popover>
            </div>
          </el-form-item>
        </div>
        <el-form-item label="添加标签"> </el-form-item>
        <el-form-item label="相关权益"> </el-form-item>
        <el-form-item label="" class="upload-item" prop="uploadFile">
          <el-upload
            action="#"
            :class="['upload-box', uploadDisabled]"
            :http-request="uploadContent"
            list-type="picture-card"
            :limit="uploadLimit"
            accept=".pdf, .doc, .docx"
            :file-list="form.uploadFile"
            :on-change="handleUploadChange"
          >
            <i slot="default" class="el-icon-plus"></i>
            <div slot="file" slot-scope="{ file }" class="upload-preview">
              <fileType
                :fileName="file.name || item.fileName"
                class="file-icon"
              ></fileType>
              <i
                class="iconfont icon-baocuo1 el-upload-list__item-del pointer"
                @click="handleRemoveUploadFile(file)"
              ></i>
            </div>
          </el-upload>
          <div class="" slot="label">
            上传内容
            <div class="error-tip" v-if="validatorForm.uploadFileError">
              <el-popover
                placement="top"
                trigger="hover"
                content="请上传当前法规文件"
              >
                <i class="iconfont icon-a-tubiao1 pointer" slot="reference"></i>
              </el-popover>
            </div>
          </div>

          <i
            style="
              font-weight: 400;
              line-height: 20px;
              color: #86909c;
              font-size: 12px;
              margin-left: 12px;
            "
            >点击上传内容，仅可上传1个文件（word、pdf）</i
          >
        </el-form-item>
        <el-form-item label="相关附件" class="upload-item upload-related-item">
          <el-upload
            action="#"
            class="upload-box"
            :http-request="uploadRelatedFile"
            list-type="picture-card"
            accept=".pdf, .doc, .docx"
            multiple
            :class="['upload-box', uploadRelatedDisabled]"
            :on-change="handleRelatedChange"
            :file-list="form.relatedFile"
          >
            <i slot="default" class="el-icon-plus"></i>
            <div slot="file" slot-scope="{ file }" class="upload-preview">
              <fileType
                :fileName="file.name || item.fileName"
                class="file-icon"
              ></fileType>
              <i
                class="iconfont icon-baocuo1 el-upload-list__item-del pointer"
                @click="removeRelatedFile(file)"
              ></i>
            </div>
          </el-upload>
          <i
            style="
              font-weight: 400;
              line-height: 20px;
              color: #86909c;
              font-size: 12px;
              margin-left: 12px;
            "
            >点击上传相关附件，支持上传8个文件（word、pdf）</i
          >
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <span type="default" @click="cancel" class="cancel">取消</span>
        <span type="primary" @click="submit" class="issue">发布</span>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import fileType from './file-type'
import Filters from './filters'
export default {
  components: { Filters, fileType },
  data() {
    // eslint-disable-next-line
    var checkIdInputName = (rule, value, callback) => {
      if (!value?.length || value.length > 50) {
        this.validatorForm.nameError = true
        return callback()
      } else {
        this.validatorForm.nameError = false
        callback()
      }
    }
    // eslint-disable-next-line
    var checkIdInputUnit = (rule, value, cb) => {
      if (!value?.length || value.length > 50) {
        this.validatorForm.unitError = true
        return cb()
      } else {
        this.validatorForm.unitError = false
        return cb()
      }
    }
    // eslint-disable-next-line
    var checkIdDocumentNumber = (rule, value, cb) => {
      if (!value?.length || value.length > 50) {
        this.validatorForm.documentNumberError = true
        return cb()
      } else {
        this.validatorForm.documentNumberError = false
        return cb()
      }
    }
    // eslint-disable-next-line
    var checkDate = (rule, value, cb) => {
      if (!value?.length || value.length > 50) {
        this.validatorForm.dateError = true
        return cb()
      } else {
        this.validatorForm.dateError = false
        return cb()
      }
    }
    // eslint-disable-next-line
    var checkFile = (rule, value, cb) => {
      if ((this.form.uploadFile?.length || 0) < 1) {
        this.validatorForm.uploadFileError = true
        return cb()
      } else {
        this.validatorForm.uploadFileError = false
        return cb()
      }
    }
    return {
      dialogVisible: false,
      list: [
        {
          fileName: '《中国银行保险监督管理委员会[2021年第8号]》.doc',
          unit: '北京证券交易所有限责任公司',
          content:
            '根据《理财公司理财产品销售管理暂行办法（银保监会令[2021]4号》，理财产品销售机构不得使用未说明选择原因。理财产品销售机构不得明选择原理财产品销售机构不得使用未说明选择原因。理财产品销售机构不得明选择原理财产品销售机构不得使用未说明选择原因。理财产品销售机构不得明选择原'
        }
      ],
      uploadDisabled: '',
      uploadRelatedDisabled: '',
      lawEditPopover: false,
      validatorForm: {
        nameError: false,
        unitError: false,
        documentNumberError: false,
        dateError: false,
        uploadFileError: false
      },
      uploadLimit: 1,
      form: {
        name: '',
        unit: '',
        documentNumber: '',
        date: '',
        uploadFile: [],
        relatedFile: []
      },
      rules: {
        name: [
          { required: true },
          { required: true, validator: checkIdInputName, trigger: ['change'] }
        ],
        documentNumber: [
          { required: true },
          { validator: checkIdDocumentNumber, trigger: ['change'] }
        ],
        unit: [
          { required: true },
          { validator: checkIdInputUnit, trigger: ['change'] }
        ],
        date: [
          { required: true },

          { validator: checkDate, trigger: ['change'] }
        ],
        uploadFile: [
          { required: true },
          { validator: checkFile, trigger: ['change'] }
        ]
      },
      search: {
        pageNow: 1,
        total: 0,
        loading: false
      }
    }
  },
  watch: {
    'form.name': function (val) {
      this.validatorForm.nameError = !val?.length > 0
    },
    'form.unit': function (val) {
      this.validatorForm.unitError = !val?.length > 0
    },
    'form.documentNumber': function (val) {
      this.validatorForm.documentNumberError = !val?.length > 0
    },
    'form.date': function (val) {
      this.validatorForm.dateError = !val
    }
    // 'form.uploadFile': function (val) {
    //   this.validatorForm.uploadFileError = !val?.length > 0
    //   console.log('gg3',this.validatorForm)
    // }
  },
  mounted() {},
  computed: {},
  methods: {
    nextPage() {},
    wordEllipsis(str, len) {
      if (!str.length) return false
      return str.length > len ? str.substr(0, len) + '...' : str
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
    /**
     * @description: 新增法规
     * @return {*}
     */
    addRule() {
      this.$refs.form.resetFields()
      this.$refs.form.clearValidate()
      this.uploadDisabled = ''
      this.uploadRelatedDisabled = ''
      const keys = Object.keys(this.validatorForm)
      for (const i in keys) {
        this.validatorForm[keys[i]] = false
      }
      this.dialogVisible = true
    },
    closeDialog() {
      this.cancel()
    },
    /**
     * @description: 上传法律文件
     * @param {*} val
     * @return {*}
     */
    uploadContent() {
      if (this.form.uploadFile.length > 0) {
        this.uploadDisabled = 'disabled'
      }
    },
    /**
     * @description: 上传法律文件change
     * @return {*}
     */
    handleUploadChange(file, fileList) {
      const reg = /\.\w+$/
      const fileName = file.name.replace(reg, '')
      if (!this.form.name) {
        this.form.name = fileName
      }
      this.form.uploadFile = fileList
    },
    /**
     * @description: 移除内容文件
     * @return {*}
     */
    handleRemoveUploadFile(file) {
      const index = this.form.uploadFile.findIndex((m) => m.uid === file.uid)
      this.form.uploadFile.splice(index, 1)
      this.uploadDisabled = ''
    },
    /**
     * @description: 上传关联附件
     * @return {*}
     */
    uploadRelatedFile() {
      if (this.form.relatedFile.length >= 8) {
        this.uploadRelatedDisabled = 'disabled'
      }
    },
    /**
     * @description: 关联附件change
     * @return {*}
     */
    handleRelatedChange(file, fileList) {
      this.form.relatedFile = fileList
    },
    /**
     * @description: 移除关联附件
     * @return {*}
     */
    removeRelatedFile(file) {
      const index = this.form.relatedFile.findIndex((m) => m.uid === file.uid)
      this.form.relatedFile.splice(index, 1)
      this.uploadRelatedDisabled = ''
    },
    /**
     * @description: 取消
     * @return {*}
     */
    cancel() {
      this.$refs.form.resetFields()
      this.$refs.form.clearValidate()
      this.uploadDisabled = ''
      this.uploadRelatedDisabled = ''
      const keys = Object.keys(this.validatorForm)
      for (const i in keys) {
        this.validatorForm[keys[i]] = false
      }
      this.dialogVisible = false
    },
    /**
     * @description: 校验必填项
     * @return {*}
     */
    checkMustValue() {
      this.validatorForm.nameError = !this.form.name?.length > 0 || this.form.name?.length > 50
      this.validatorForm.unitError = !this.form.unit?.length > 0 || this.form.unit?.length > 50
      this.validatorForm.documentNumberError = !this.form.documentNumber?.length > 0 || this.form.documentNumber?.length > 50
      this.validatorForm.dateError = !this.form.date?.length
      this.validatorForm.uploadFileError = !this.form.uploadFile?.length
    },
    /**
     * @description: 提交
     * @return {*}
     */
    submit() {
      this.$refs.form.validate(() => {
        this.checkMustValue()
        // if (valid) {}
      })
    },
    /**
     * @description: 编辑法律
     * @return {*}
     */
    editRule() {
      this.lawEditPopover = false
    },
    /**
     * @description: 更新法律
     * @return {*}
     */
    updateRule() {
      this.lawEditPopover = false
    },
    /**
     * @description: 删除法规
     * @return {*}
     */
    delRule() {
      this.lawEditPopover = false
      this.$confirm('一旦删除该法规内容不可恢复，请确认是否删除', '', {
        customClass: 'confirmBox',
        confirmButtonText: '取消',
        cancelButtonText: '删除',
        type: 'warning'
      }).then(() => {})
    }
  }
}
</script>
<style scoped lang="less">
.laws {
.list-content{
  margin-top: 20px;
}
  .list {
    .cards {
      padding: 20px 16px;
      display: flex;
      border-radius: 6px;
      border-radius: 6px;
      border-bottom: 1px dashed #e5e6eb;
      .file-icon {
        width: 40px;
        height: 40px;
        margin-right: 16px;
        border-radius: 6px;
      }
      .file-info {
        flex: 1;
        line-height: 22px;
        font-size: 14px;
        .name {
          color: #1d2128;
          font-weight: 700;
          margin-bottom: 6px;
          .more {
            float: right;
          }
        }
        .tags {
          margin-bottom: 8px;

          font-weight: 400;
          line-height: 20px;
          font-size: 12px;
          span {
            margin-right: 6px;
            padding: 1px 6px;
            display: inline-block;
          }
          .effective {
            border-radius: 3px;
            border: 1px solid #ffa39e;
            background: #fff1f0;
            color: #eb5757;
          }
          .ineffective {
            border-radius: 3px;
            border: 1px solid #acb1b9;
            background: #f2f3f5;
            color: #505968;
          }
          .prod-type {
            color: #2d5cf6;
            border-radius: 3px;
            border: 1px solid #a8c5ff;
            background: #f0f6ff;
          }
          .word-type {
            border-radius: 3px;
            border: 1px solid #ffd591;
            background: #fff7e6;
            color: #fa8c16;
          }
        }

        .content {
          margin-bottom: 8px;
        }
        .content,
        .detail {
          font-weight: 400;
          color: #505968;
        }
        .detail {
          display: flex;
          justify-content: space-between;
          align-items: center;
          .file-unit {
            span:nth-of-type(n + 2)::before {
              content: '';
              display: inline-block;
              width: 1px;
              height: 12px;
              background: #cacdd3;
              margin: 0 16px;
            }
          }
        }
      }
    }
    .cards:hover {
      border-radius: 6px;
      background: #f7f8fa;
    }
  }
  /deep/ .add-rule {
    .el-dialog__header {
      padding: 40px 60px 0;
      margin-bottom: 16px;
      font-size: 16px;
      font-weight: 700;
      line-height: 24px;
      color: #1d2128;
      .el-dialog__headerbtn {
        color: #505968;
        right: 60px;
        top: 36px;
        font-size: 24px;
      }
    }
    .dialog-footer {
      span {
        display: inline-block;
        padding: 8px 40px;
        font-size: 14px;
        font-weight: 400;
        line-height: 22px;
        color: #1d2128;
        cursor: pointer;
      }
      .cancel {
        margin-right: 20px;

        border-radius: 6px;
        border: 1px solid #cacdd3;
      }
      .issue {
        border-radius: 6px;
        background: #2d5cf6;
        color: #fff;
      }
    }
    .el-dialog__body {
      padding: 0 60px;
    }
    .el-form {
      .el-form-item__label {
        position: relative;
        color: #1d2128;
      }
      .el-form-item {
        margin-bottom: 12px;
        .el-form-item__content {
          display: flex;
          align-items: center;
          .el-input__inner {
            padding: 5px 12px 5px 16px;
            border-radius: 4px;
            border: 1px solid transparent;

            height: 32px;
            border-radius: 4px;
            background: #f7f8fa;
          }
          .el-input__inner:focus {
            background: #fff;
            border-radius: 4px;
            border: 1px solid #2d5cf6;
          }
          .el-form-item__error {
            display: none;
          }
          .error-tip {
            width: 20px;
            height: 20px;
            margin: 0 4px;
            line-height: 20px;
            color: #f76560;
            font-size: 20px;
          }
          .el-input__prefix {
            left: 80%;
            .el-icon-date::before {
              font-family: 'iconfont' !important;
              content: '\e66e';
            }
          }
        }
      }
      .upload-item {
        display: flex;
        flex-direction: column;
        .el-form-item__content {
          margin-left: 0 !important;
          flex-wrap: wrap;

          .el-upload {
            border-radius: 4px;
            border: 0.8px dashed #cacdd3;
            background: #f7f8fa;
            width: 60px;
            height: 60px;
            line-height: 60px;
          }
          .upload-box {
            height: 60px;
            .el-upload-list {
              .el-upload-list__item {
                border: 0.8px dashed #cacdd3;
                width: 60px;
                height: 60px;
                .file-icon {
                  width: 60px;
                  height: 60px;
                }
              }
            }
            .upload-preview {
              position: relative;
              .el-upload-list__item-del {
                position: absolute;
                right: 4px;
                top: 0px;
                font-size: 18px;
                color: rgba(29, 33, 40, 0.4);
              }
            }
          }
        }
        .el-form-item__label {
          position: relative;
          .error-tip {
            position: absolute;
            width: 20px;
            height: 20px;
            margin: 0 4px;
            line-height: 20px;
            color: #f76560;
            font-size: 20px;
            top: 8px;
            right: -18px;
          }
        }
      }
      .el-form-item__label:before {
        position: absolute;
        right: 0;
      }
      .form-item2 {
        .el-form-item {
          flex: 1;
        }
      }
      .is-error .el-input__inner {
        border: 1px solid #eb5757 !important;
        background: #fff !important;
      }
    }
  }
  /deep/ .disabled .el-upload--picture-card {
    display: none !important;
  }
}
</style>
<style lang="less">
.user-edit-popover {
  width: 108px;
  min-width: 108px;
  padding: 12px 8px;
  border-radius: 6px;
  background: #fff;

  /* 阴影/大 */
  box-shadow: 0px 0px 10px 0px rgba(67, 67, 67, 0.1);
  ul li {
    text-align: center;

    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 22px;
    color: #1d2128;
    height: 34px;
    line-height: 34px;
    cursor: pointer;
  }
  ul li:hover {
    background: #f7f8fa;
  }
}</style>
