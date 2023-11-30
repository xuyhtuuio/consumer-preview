<!--
 * @Author: nimeimix huo.linchun@trs.com.cn
 * @Date: 2023-10-24 11:19:25
 * @LastEditors: nimeimix huo.linchun@trs.com.cn
 * @LastEditTime: 2023-11-16 14:05:43
 * @FilePath: /consumer-preview/src/views/rules-base/components/laws.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="laws" v-loading="search.loading">
    <Filters
      @addRule="addRule"
      @sortChange="sortChange"
      :total="search.total"
      ref="filter-comp"
    >
    </Filters>
    <div v-if="list.length" class="list-content">
      <div
        class="list"
        v-for="item in list"
        :key="`${item.id}${Math.random()}`"
        @click="toDetail(item)"
      >
        <div class="cards pointer">
          <fileType :fileName="item.file_key" class="file-icon"></fileType>
          <div class="file-info">
            <div class="name">
              <i>{{ item.name }} </i>
              <div @click.stop v-if="role">
                <el-popover
                  placement="bottom"
                  width="108"
                  popper-class="user-edit-popover"
                  trigger="click"
                  :ref="`popover-${item.id}`"
                >
                  <ul>
                    <li @click="editRule(item, 'edit')">编辑</li>
                    <li @click="editRule(item, 'update')">更新</li>
                    <li @click="delRule(item)">删除</li>
                  </ul>
                  <i
                    class="more iconfont icon-quanburenwu-gengduocaozuo"
                    slot="reference"
                  ></i>
                </el-popover>
              </div>
            </div>
            <p class="tags">
              <span
                :class="{
                  effective: item.status == 1,
                  ineffective: item.status == 0
                }"
                >{{ $msg('LawStatus')[item.status] }}</span
              >
              <span
                class="prod-type"
                v-for="item in item.tagList"
                :key="`${item}${Math.random()}`"
                >{{ item }}</span
              >
              <span
                class="word-type"
                v-for="item in item.equityList"
                :key="`${item}${Math.random()}${Math.random()}`"
                >{{ item }}</span
              >
            </p>
            <p class="content ellipsis ellipsis_2" v-html="item.newContent"></p>
            <div class="detail">
              <div class="file-unit">
                <span v-if="item.type == 0"
                  >发文单位：<i>{{ wordEllipsis(item.unit, 15) }}</i></span
                >
                <span v-if="item.type == 0"
                  >发文字号：{{ wordEllipsis(item.doc_no, 15) }}</span
                >
                <span v-if="item.type === 1"
                  >拟稿部门：<i>{{ wordEllipsis(item.unit, 15) }}</i></span
                >
                <span v-if="item.type === 1"
                  >制度文号：{{ wordEllipsis(item.doc_no, 15) }}</span
                >
                <span v-if="item.type === 2"
                  >文件来源：{{ wordEllipsis(item.file_source, 15) }}</span
                >

                <span>发布时间：{{ item.pub_time | timeFilter }}</span>
              </div>
              <div class="share">
                <span
                  style="margin-right: 20px"
                  @click.stop="copyLink(item.id)"
                >
                  <i
                    class="iconfont icon-fenxiang"
                    style="margin-right: 4px"
                  ></i
                  >分享
                </span>
                <span>{{ item.read_count }}次阅读</span>
              </div>
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
    <Empty v-else v-loading="search.loading" class="list"></Empty>

    <el-dialog
      :title="`${dialogTitle[crtBehavior]}${dialogName[type]}`"
      :visible.sync="dialogVisible"
      width="800px"
      center
      custom-class="add-rule"
      :before-close="closeDialog"
    >
      <div class="trs-scroll">
        <el-form :model="form" :rules="rules" ref="form">
          <el-form-item
            label="是否废止当前法规文件"
            prop="isRepeal"
            v-if="crtBehavior == 'update'"
            class="flex"
          >
            <el-radio-group v-model="form.isRepeal" style="margin-left: 8px">
              <el-radio :label="0">废止</el-radio>
              <el-radio :label="1">否</el-radio>
            </el-radio-group>
            <div class="error-tip">
              <el-popover
                placement="top"
                trigger="hover"
                content="请选择是否废止当前法规文件"
                v-if="validatorForm.isRepealError"
              >
                <i class="iconfont icon-a-tubiao1 pointer" slot="reference"></i>
              </el-popover>
            </div>
          </el-form-item>
          <el-form-item :label="`${$msg('lawNameType')[type]}`" prop="name">
            <el-input
              v-model="form.name"
              clearable
              :placeholder="`请输入${$msg('lawNameType')[type]}`"
            ></el-input>
            <div class="error-tip">
              <el-popover
                placement="top"
                trigger="hover"
                :content="`${$msg('lawNameType')[type]}最多可输入50字`"
                v-if="validatorForm.nameError"
              >
                <i class="iconfont icon-a-tubiao1 pointer" slot="reference"></i>
              </el-popover>
            </div>
          </el-form-item>
          <el-form-item :label="`${$msg('lawUnitType')[type]}`" prop="unit">
            <el-input
              v-model="form.unit"
              clearable
              :placeholder="`请输入${$msg('lawUnitType')[type]}`"
            >
            </el-input>
            <div class="error-tip">
              <el-popover
                placement="top"
                trigger="hover"
                :content="`${$msg('lawUnitType')[type]}最多可输入50字`"
                v-if="validatorForm.unitError"
              >
                <i class="iconfont icon-a-tubiao1 pointer" slot="reference"></i>
              </el-popover>
            </div>
          </el-form-item>
          <div class="flex form-item2" v-if="[0, 1].includes(type)">
            <el-form-item
              :label="`${$msg('lawDocNoType')[type]}`"
              prop="documentNumber"
            >
              <el-input
                v-model="form.documentNumber"
                clearable
                :placeholder="`请输入${$msg('lawDocNoType')[type]}`"
              ></el-input>
              <div class="error-tip">
                <el-popover
                  placement="top"
                  trigger="hover"
                  :content="`${$msg('lawDocNoType')[type]}最多可输入50字`"
                  v-if="validatorForm.documentNumberError"
                >
                  <i
                    class="iconfont icon-a-tubiao1 pointer"
                    slot="reference"
                  ></i>
                </el-popover>
              </div>
            </el-form-item>
            <el-form-item label="发布时间" prop="date">
              <el-date-picker
                type="datetime"
                placeholder="请选择日期"
                v-model="form.date"
                style="width: 100%"
                value-format="yyyy-MM-dd HH:mm:ss"
                :picker-options="optionsDisable"
              >
              </el-date-picker>
              <div class="error-tip">
                <el-popover
                  placement="top"
                  trigger="hover"
                  content="请选择发布时间"
                  v-if="validatorForm.dateError"
                >
                  <i
                    class="iconfont icon-a-tubiao1 pointer"
                    slot="reference"
                  ></i>
                </el-popover>
              </div>
            </el-form-item>
          </div>
          <el-form-item label="发布时间" prop="date" v-if="type == 2">
            <el-date-picker
              type="datetime"
              placeholder="请选择日期"
              v-model="form.date"
              style="width: 100%"
              value-format="yyyy-MM-dd HH:mm:ss"
              :picker-options="optionsDisable"
              class="type2-date"
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
          <el-form-item label="添加标签" class="tag-item">
            <span
              v-for="(item, idx) in tagsList"
              :key="`${idx}+Math.random()`"
              class="add-relevancy-tag relevancy-tag"
              >{{ item }}
              <i class="el-icon-close" @click="delTag(item)"></i>
            </span>
            <relevancyTag
              class="add-relevancy-tag"
              :handlerTag="tagsList"
              tagType="tag"
              @passTag="addTag"
            ></relevancyTag>
          </el-form-item>
          <el-form-item label="相关权益" class="tag-item">
            <span
              v-for="(item, idx) in relevancyTags"
              :key="`${idx}`"
              class="add-relevancy-tag relevancy-tag"
              >{{ item }}
              <i class="el-icon-close" @click="delRelevancyTag(item)"></i>
            </span>
            <relevancyTag
              class="add-relevancy-tag"
              tagType="benefit"
              @passTag="passTag"
              :handlerTag="relevancyTags"
              ref="relevancyTagRef"
            ></relevancyTag>
          </el-form-item>
          <el-form-item label="" class="upload-item" prop="uploadFile">
            <div class="upload-box">
              <el-upload
                action="#"
                :class="[uploadDisabled]"
                :http-request="uploadContent"
                list-type="picture-card"
                :limit="uploadLimit"
                accept=".docx,.pdf,.doc"
                :file-list="form.uploadFile"
                :on-change="handleUploadChange"
              >
                <i slot="default" class="el-icon-plus"></i>
                <div
                  slot="file"
                  slot-scope="{ file }"
                  class="upload-preview"
                  v-loading="file.loading"
                >
                  <fileType
                    :fileName="file.name || file.fileName"
                    class="file-icon"
                  ></fileType>
                  <i
                    v-if="file.key"
                    class="iconfont icon-baocuo1 el-upload-list__item-del pointer"
                    @click="handleRemoveUploadFile(file)"
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
                >点击上传内容，仅可上传1个文件（word、pdf）</i
              >
            </div>
            <div class="" slot="label">
              上传内容
              <div class="error-tip" v-if="validatorForm.uploadFileError">
                <el-popover
                  placement="top"
                  trigger="hover"
                  content="请上传当前法规文件"
                >
                  <i
                    class="iconfont icon-a-tubiao1 pointer"
                    slot="reference"
                  ></i>
                </el-popover>
              </div>
            </div>
            <ul class="file-list">
              <li v-for="file in form.uploadFile" :key="file.uid">
                <fileType
                  :fileName="file.name || file.fileName"
                  class="file-icon"
                ></fileType>
                {{ file.name }}
                <i
                  v-if="file.key"
                  class="el-icon-error"
                  style="color: rgba(29, 33, 40, 0.4); cursor: pointer"
                  @click="handleRemoveUploadFile(file)"
                ></i>
              </li>
            </ul>
          </el-form-item>
          <el-form-item
            label="相关附件"
            class="upload-item upload-related-item"
          >
            <div class="upload-box">
              <el-upload
                action="#"
                :http-request="uploadRelatedFile"
                list-type="picture-card"
                multiple
                accept=".docx,.pdf,.doc"
                :class="[uploadRelatedDisabled]"
                :on-change="handleRelatedChange"
                :file-list="form.relatedFile"
              >
                <i slot="default" class="el-icon-plus"></i>
                <div
                  slot="file"
                  slot-scope="{ file }"
                  class="upload-preview"
                  v-loading="file.loading"
                >
                  <fileType
                    :fileName="file.name || item.fileName"
                    class="file-icon"
                  ></fileType>
                  <i
                    v-if="file.key"
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
            </div>
            <ul class="file-list">
              <li v-for="(file, index) in form.relatedFile" :key="index">
                <fileType
                  :fileName="file.name || item.fileName"
                  class="file-icon"
                ></fileType>
                {{ file.name }}
                <i
                  v-if="file.key"
                  class="el-icon-error"
                  style="color: rgba(29, 33, 40, 0.4); cursor: pointer"
                  @click="removeRelatedFile(file)"
                ></i>
              </li>
            </ul>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel" class="cancel">取消</el-button>
        <el-button
          type="primary"
          @click="submit"
          class="issue"
          :loading="form.loading"
          >{{ finishBtns[crtBehavior] }}</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>
<script>
import dayjs from 'dayjs'
import {
  queryRegulationList,
  insertRegulation,
  updateRegulation,
  deleteRegulation
} from '@/api/knowledge/knowledgeCollect'
import { getFormGroups, deleteFormGroups } from '@/api/front'
import fileType from './file-type'
import Filters from './filters'
import relevancyTag from './relevancy-tag'

export default {
  components: { Filters, fileType, relevancyTag },

  data() {
    // eslint-disable-next-line
    var checkIdInputName = (rule, value, callback) => {
      if (!value?.length || value.length > 50) {
        this.validatorForm.nameError = true
        callback(new Error(''))
      } else {
        this.validatorForm.nameError = false
        callback()
      }
    }
    // eslint-disable-next-line
    var checkIdInputUnit = (rule, value, callback) => {
      if (!value?.length || value.length > 50) {
        this.validatorForm.unitError = true
        callback(new Error(''))
      } else {
        this.validatorForm.unitError = false
        return callback()
      }
    }
    // eslint-disable-next-line
    var checkIdDocumentNumber = (rule, value, callback) => {
      if (!value?.length || value.length > 50) {
        this.validatorForm.documentNumberError = true
        callback(new Error(''))
      } else {
        this.validatorForm.documentNumberError = false
        return callback()
      }
    }
    // eslint-disable-next-line
    var checkDate = (rule, value, callback) => {
      if (!value?.length) {
        this.validatorForm.dateError = true
        callback(new Error(''))
      } else {
        this.validatorForm.dateError = false
        return callback()
      }
    }
    // eslint-disable-next-line
    var checkFile = (rule, value, callback) => {
      if ((this.form.uploadFile?.length || 0) < 1) {
        this.validatorForm.uploadFileError = true
        callback(new Error(''))
      } else {
        this.validatorForm.uploadFileError = false
        return callback()
      }
    }
    // eslint-disable-next-line
    var checkIsRepeal = (rule, value, callback) => {
      if (![0, 1].includes(this.form.isRepeal)) {
        this.validatorForm.isRepealError = true

        callback(new Error(''))
      } else {
        this.validatorForm.isRepealError = false
        return callback()
      }
    }
    return {
      dialogVisible: false,
      list: [],
      uploadDisabled: '',
      uploadRelatedDisabled: '',

      validatorForm: {
        nameError: false,
        unitError: false,
        documentNumberError: false,
        dateError: false,
        uploadFileError: false,
        isRepealError: false
      },
      showPop: false,
      reference: {},
      uploadLimit: 1,
      form: {
        name: '',
        unit: '',
        documentNumber: '',
        date: '',
        uploadFile: [],
        relatedFile: [],
        isRepeal: 0,
        loading: false
      },
      rules: {
        isRepeal: [
          { validator: checkIsRepeal, trigger: ['change', 'blur'] },
          { required: true, trigger: ['change'] }
        ],
        name: [
          { required: true, trigger: ['change', 'blur'] },
          { validator: checkIdInputName, trigger: ['change', 'blur'] }
        ],
        documentNumber: [
          { required: true, trigger: ['change'] },
          { validator: checkIdDocumentNumber, trigger: ['change', 'blur'] }
        ],
        unit: [
          { required: true, trigger: ['change'] },
          { validator: checkIdInputUnit, trigger: ['change', 'blur'] }
        ],
        date: [
          { required: true, trigger: ['change'] },
          { validator: checkDate, trigger: ['change', 'blur'] }
        ],
        uploadFile: [
          { required: true, trigger: ['change'] },
          { validator: checkFile, trigger: ['change'] }
        ]
      },
      search: {
        pageNow: 1,
        total: 0,
        loading: false,
        name: '',
        status: '',
        sortField: '-pub_time'
      },
      optionsDisable: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      relevancyTags: [],
      tagsList: [],
      crtBehavior: 'increase',
      dialogTitle: {
        increase: '新增',
        edit: '编辑',
        update: '更新'
      },
      dialogName: {
        0: '法律法规',
        1: '内部制度',
        2: '监督通报'
      },
      finishBtns: {
        increase: '发布',
        edit: '完成',
        update: '更新'
      },
      type: 0,
      role: false
    }
  },
  watch: {
    'form.name': function (val) {
      this.validatorForm.nameError = !val?.length > 0 || val.length > 50
    },
    'form.unit': function (val) {
      this.validatorForm.unitError = !val?.length > 0 || val.length > 50
    },
    'form.documentNumber': function (val) {
      // eslint-disable-next-line
      this.validatorForm.documentNumberError =
        !val?.length > 0 || val.length > 50
    },
    'form.date': function (val) {
      this.validatorForm.dateError = !val
    },
    'form.isRepeal': function (val) {
      this.validatorForm.isRepealError = !val
    }
  },
  mounted() {
    // 获取当前角色权限
    this.getUserRole()
    this.nextPage(1)
  },
  computed: {},
  methods: {
    getUserRole() {
      const role = this.$store.getters.getPermissionByCode('knowledge')?.type
      this.role = role === 'edit'
    },
    showElPopover(item) {
      this.showPop = false
      this.reference = this.$refs['more-' + item.id]?.[0]
      this.$nextTick(() => {
        // 等待显示的popover销毁后再 重新渲染新的popover
        this.showPop = true
        this.$nextTick(() => {
          // 此时才能获取refs引用
          this.$refs.pop.doShow()
        })
      })
    },
    // 右上角关键词搜搜
    initData(keywords) {
      const { keyword, effectiveValue, type } = keywords
      this.search.name = keyword
      this.search.status = effectiveValue
      this.type = type
      this.$refs['filter-comp'].initSort()
      this.search.sortField = '-pub_time'
      this.nextPage(1)
    },
    /**
     * @description: 获取列表接口
     * @return {*}
     */
    sortChange(val) {
      const { order, orderColumn } = val
      // eslint-disable-next-line
      this.search.sortField =
        order === 'desc' ? '-' + orderColumn : '+' + orderColumn
      this.nextPage(1)
    },
    /**
     * @description: 去详情页
     * @param {*}
     * @return {*}
     */
    toDetail(item) {
      this.$router.push({
        name: 'RulesDetail',
        query: {
          law_id: item.id
        }
      })
    },
    async nextPage(val) {
      const that = this
      this.search.pageNow = val || 1
      this.search.loading = true
      const params = {
        pageNow: val,
        pageSize: 10,
        status: this.search.status,
        name: this.search.name,
        sortField: this.search.sortField,
        type: this.type
      }
      try {
        const res = await queryRegulationList(params)
        const { success, data } = res.data
        if (success) {
          const handleData = data.list?.map((m) => {
            const content = m.content && JSON.parse(m.content) ? JSON.parse(m.content) : []
            // eslint-disable-next-line
            const suffix =
              m.fileName.split('.')[m.fileName.split('.').length - 1]
            let info = {}
            if (suffix === 'pdf') {
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
              // 组成字符串
              const fileText = arr
                .map((o) => {
                  const text = o.content
                    .map((v) => {
                      return v.text
                    })
                    .join('')
                  return text
                })
                .join('')
              info = {
                ...m,
                newContent: fileText
              }
            } else {
              const [first] = m.tableFileTag
              let str = content
                ?.map((o) => {
                  return first?.length && first[o]
                    ? that.formatTable(first[o])
                    : o
                })
                ?.join('')
              str = str?.replace(/\r/gi, '')
              info = {
                ...m,
                newContent: str
              }
            }
            return info
          })
          this.list = handleData
          this.search.total = data.totalCount
        }
        this.search.loading = false
      } catch {
        this.list = []
        this.search.total = 0
        this.search.loading = false
      }
    },
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
    wordEllipsis(str, len) {
      if (!str?.length) return false
      return str.length > len ? str.substr(0, len) + '...' : str
      /**
       * @description: 获取相关权益的标签
       * @return {*}
       */
    },
    passTag(tags) {
      this.relevancyTags = tags
    },
    /**
     * @description: 获取当前的添加标签
     * @return {*}
     */
    addTag(tags) {
      this.tagsList = tags
    },
    /**
     * @description: 删除当前的添加标签
     * @return {*}
     */
    delTag(tag) {
      const index = this.tagsList.findIndex((v) => tag === v)
      this.tagsList.splice(index, 1)
    },
    /**
     * @description: 上传文件前的校验
     * @return {*}
     */
    handleBefore(file) {
      const judgment = ['pdf', 'doc', 'docx']
      // 上传文件之前钩子
      const type = file.name.replace(/.+\./, '')
      const judgeRes = judgment.includes(type)
      if (!judgeRes) {
        this.$message({
          type: 'error',
          message: '只支持pdf/doc/docx格式的文件！'
        })
        return false
      }
    },
    /**
     * @description: 删除当前的权益标签
     * @return {*}
     */
    delRelevancyTag(tag) {
      const index = this.relevancyTags.findIndex((v) => tag === v)
      this.relevancyTags.splice(index, 1)
    },
    copyLink(id) {
      // eslint-disable-next-line
      const link =
        // eslint-disable-next-line
        window.location.protocol +
        // eslint-disable-next-line
        '//' +
        // eslint-disable-next-line
        window.location.host +
        `/#/knowledge/rulesDetail?law_id=${id}`
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
    addRule(type) {
      this.crtBehavior = type || 'increase'
      this.dialogVisible = true
      setTimeout(() => {
        this.$refs.form.clearValidate()
        this.$refs.form.resetFields()
        this.tagsList = []
        this.relevancyTags = []
        this.uploadDisabled = ''
        this.uploadRelatedDisabled = ''
        const keys = Object.keys(this.validatorForm)
        for (const i in keys) {
          this.validatorForm[keys[i]] = false
        }
      }, 80)
    },
    closeDialog() {
      this.cancel()
    },
    /**
     * @description: 上传法律文件
     * @param {*} val
     * @return {*}
     */
    uploadContent(param) {
      const _that = this
      if (this.form.uploadFile.length > 0) {
        this.uploadDisabled = 'disabled'
      }
      const judgment = ['pdf', 'doc', 'docx']
      // 上传文件之前钩子
      const type = param.file.name.replace(/.+\./, '')
      const judgeRes = judgment.includes(type)
      if (!judgeRes) {
        return false
      }
      this.form.uploadFile.forEach((m) => {
        if (m.uid === param.file.uid) {
          m.loading = true
        }
      })
      const formData = new FormData()
      formData.append('mf', param.file) // 传入bpmn文件
      getFormGroups(formData)
        .then((res) => {
          const { data, success } = res.data
          const { uid: id } = param.file
          if (success) {
            this.form.uploadFile.forEach((item) => {
              if (item.uid === id) {
                item.loading = false
                item.key = data.key
                item.url = data.url
              }
            })
            _that.$forceUpdate()
          } else {
            this.form.uploadFile = []
            this.uploadDisabled = ''
            this.$message.error(res.data.msg)
          }
          param.loading = false
        })
        .catch(() => {
          this.$message.error('上传文件失败，请重新上传')
          this.form.uploadFile = []
          this.uploadDisabled = ''
        })
    },
    /**
     * @description: 上传法律文件change
     * @return {*}
     */
    handleUploadChange(file, fileList) {
      const judgment = ['pdf', 'doc', 'docx']
      // 上传文件之前钩子
      const type = file.name.replace(/.+\./, '')
      const judgeRes = judgment.includes(type)
      if (judgeRes) {
        const reg = /\.\w+$/
        const fileName = file.name.replace(reg, '')
        if (!this.form.name) {
          this.form.name = fileName
        }
        this.form.uploadFile = fileList
      } else {
        this.$message({
          type: 'error',
          message: '只支持pdf/doc/docx格式的文件！'
        })
        fileList = []
        this.form.uploadFile = fileList
      }
    },
    /**
     * @description: 移除内容文件
     * @return {*}
     */
    handleRemoveUploadFile(file) {
      const key = this.form.uploadFile.filter((m) => {
        return m.key === file.key
      })[0]?.key
      // 接口删除文件
      if (this.crtBehavior !== 'increase') {
        const index = this.form.uploadFile.findIndex((m) => m.key === file.key)
        this.form.uploadFile.splice(index, 1)
        this.uploadDisabled = ''
      } else {
        deleteFormGroups({ key }).then((res) => {
          const index = this.form.uploadFile.findIndex(
            (m) => m.key === file.key
          )
          this.form.uploadFile.splice(index, 1)
          this.uploadDisabled = ''
          this.$message({ type: 'success', message: res.data.data })
        })
      }
    },
    /**
     * @description: 上传关联附件
     * @return {*}
     */
    uploadRelatedFile(param) {
      const _that = this
      if (this.form.relatedFile.length >= 8) {
        this.uploadRelatedDisabled = 'disabled'
      }
      const judgment = ['pdf', 'doc', 'docx']
      // 上传文件之前钩子
      const type = param.file.name.replace(/.+\./, '')
      const judgeRes = judgment.includes(type)
      if (!judgeRes) {
        return false
      }
      const formData = new FormData()
      formData.append('mf', param.file) // 传入bpmn文件
      getFormGroups(formData)
        .then((res) => {
          const { data, success } = res.data
          const { uid: id } = param.file
          if (success) {
            this.form.relatedFile.forEach((item) => {
              if (item.uid === id) {
                item.loading = false
                item.key = data.key
                item.url = data.url
              }
            })
            _that.$forceUpdate()
          } else {
            const index = this.form.relatedFile.findIndex(
              (m) => m.uid === param.file.uid
            )
            this.form.relatedFile.splice(index, 1)
            this.uploadRelatedDisabled = ''
            this.$message.error(res.data.msg)
          }
        })
        .catch(() => {
          this.$message.error('上传文件失败，请重新上传')
          const index = this.form.relatedFile.findIndex(
            (m) => m.uid === param.file.uid
          )
          this.form.relatedFile.splice(index, 1)
          this.uploadRelatedDisabled = ''
        })
    },
    /**
     * @description: 关联附件change
     * @return {*}
     */
    handleRelatedChange(file, fileList) {
      if (fileList.length > 8) {
        this.$message.error('最多可上传8份附件')
        return false
      }
      const judgment = ['pdf', 'doc', 'docx']
      // 上传文件之前钩子
      const type = file.name.replace(/.+\./, '')
      const judgeRes = judgment.includes(type)
      if (!judgeRes) {
        this.$message({
          type: 'error',
          message: '只支持pdf/doc/docx格式的文件！'
        })
        this.form.relatedFile = this.form.relatedFile.filter(
          (list) => list.uid !== file.uid
        )
        return false
      }
      this.form.relatedFile = fileList
    },
    /**
     * @description: 移除关联附件
     * @return {*}
     */
    removeRelatedFile(file) {
      const key = this.form.relatedFile.filter((m) => {
        return m.key === file.key
      })[0]?.key
      // 接口删除文件
      if (this.crtBehavior !== 'increase') {
        const index = this.form.relatedFile.findIndex((m) => m.key === file.key)
        this.form.relatedFile.splice(index, 1)
        this.uploadRelatedDisabled = ''
      } else {
        deleteFormGroups({ key }).then((res) => {
          const index = this.form.relatedFile.findIndex(
            (m) => m.key === file.key
          )
          this.form.relatedFile.splice(index, 1)
          this.uploadRelatedDisabled = ''
          this.$message({ type: 'success', message: res.data.data })
        })
      }
    },
    /**
     * @description: 取消
     * @return {*}
     */
    cancel() {
      this.$refs.form.resetFields()
      this.$refs.form.clearValidate()
      this.tagsList = []
      this.relevancyTags = []
      this.form.uploadFile = []
      this.form.relatedFile = []
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
      // eslint-disable-next-line
      this.validatorForm.nameError =
        !this.form.name?.length > 0 || this.form.name?.length > 50
      // eslint-disable-next-line
      this.validatorForm.unitError =
        !this.form.unit?.length > 0 || this.form.unit?.length > 50
      // eslint-disable-next-line
      this.validatorForm.documentNumberError =
        // eslint-disable-next-line
        !this.form.documentNumber?.length > 0 ||
        this.form.documentNumber?.length > 50
      this.validatorForm.dateError = !this.form.date?.length
      this.validatorForm.uploadFileError = !this.form.uploadFile?.length
    },
    /**
     * @description: 提交
     * @return {*}
     */
    submit() {
      const _that = this
      // 上传内容文件
      this.$refs.form.validate(async (valid) => {
        this.checkMustValue()
        if (valid) {
          // 共计可以添加8个标签
          // eslint-disable-next-line
          const tagsCounts =
            (this.tagsList?.length || 0) + (this.relevancyTags?.length || 0)
          if (tagsCounts > 8) {
            this.$message.error('添加的标签和相关权益标签最多可以添加8个')
            return false
          }
          // eslint-disable-next-line
          const attachmentList =
            this.form.relatedFile?.map((m) => {
              return m.key
            }) || []
          const params = {
            name: this.form.name,
            pub_time: dayjs(this.form.date).format('YYYY-MM-DD HH:mm:ss'),
            file_key: this.form.uploadFile[0]?.key,
            tagList: this.tagsList,
            equityList: this.relevancyTags,
            attachmentList,
            type: this.type
          }
          // 法规和内部制度是单位字号，通报是文件来源
          if ([0, 1].includes(this.type)) {
            params.unit = this.form.unit
            params.doc_no = this.form.documentNumber
          } else {
            params.file_source = this.form.unit
          }
          let res = null
          this.form.loading = true
          this.$forceUpdate()
          try {
            if (_that.crtBehavior === 'increase') {
              res = await insertRegulation(params)
            } else {
              // 编辑和更新
              params.id = this.form.id
              const newParams = {
                ...this.form,
                ...params
              }
              if (_that.crtBehavior === 'edit') {
                newParams.isEdit = 'edit'
              }
              if (_that.crtBehavior === 'update') {
                newParams.status = _that.form.isRepeal
              }
              delete newParams.newContent
              delete newParams.uploadFile
              delete newParams.c_time
              delete newParams.u_time
              delete newParams.content
              delete newParams.tableFileTag
              delete newParams.loading
              delete newParams.date
              delete newParams.isRepeal
              res = await updateRegulation(newParams)
            }
            const { success } = res.data
            _that.form.loading = false
            if (success) {
              this.$message.success(
                `${this.dialogTitle[this.crtBehavior]}${
                  this.dialogName[this.type]
                }成功`
              )
              this.cancel()
              this.nextPage(1)
            }
          } catch {
            _that.form.loading = false
            _that.$forceUpdate()
          }
        }
      })
    },
    /**
     * @description: 编辑法律
     * @return {*}
     */
    editRule(item, type) {
      this.addRule(type)
      if (type === 'edit') {
        setTimeout(() => {
          // 回显内容
          const file = {
            key: item.file_key,
            name: item.file_key
          }
          const relatedFile = item.attachmentList?.map((m) => {
            return {
              key: m,
              name: m
            }
          })
          this.form = {
            ...item,
            id: item.id,
            name: item.name,
            unit: item.unit,
            content: item.content,
            documentNumber: item.doc_no,
            date: dayjs(item.pub_time).format('YYYY-MM-DD HH:mm:ss'),
            uploadFile: [file],
            relatedFile
          }
          if (this.form.uploadFile?.length > 0) {
            this.uploadDisabled = 'disabled'
          }
          if (this.form.relatedFile?.length >= 8) {
            this.uploadRelatedDisabled = 'disabled'
          }
          this.tagsList = item.tagList
          this.relevancyTags = item.equityList
        }, 200)
      } else if (type === 'update') {
        this.form = {
          id: item.id,
          name: '',
          unit: '',
          documentNumber: '',
          date: '',
          uploadFile: [],
          relatedFile: [],
          isRepeal: '',
          loading: false
        }
      }
    },
    /**
     * @description: 删除法规
     * @return {*}
     */
    delRule(item) {
      const _that = this

      this.$confirm('一旦删除该法规内容不可恢复，请确认是否删除', '', {
        customClass: 'confirmBox',
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const params = {
          id: item.id,
          file_key: item.file_key
        }
        const res = await deleteRegulation(params)
        const { success } = res.data
        if (success) {
          _that.$message.success('删除成功')
          _that.nextPage(1)
        }
      })
    }
  },
  filters: {
    timeFilter(val) {
      if (val) {
        return dayjs(val).format('YYYY-MM-DD HH:mm:ss')
      }
    }
  }
}
</script>
<style scoped lang="less">
.laws {
  .list-content {
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
        flex-shrink: 0;
        height: 40px;
        margin-right: 16px;
        border-radius: 6px;
      }
      .file-info {
        // width: calc(100% - 56px);
        flex: 1;
        line-height: 22px;
        font-size: 14px;
        word-break: break-all;
        .name {
          color: #1d2128;
          font-weight: 700;
          margin-bottom: 6px;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          .more {
            float: right;
          }
        }
        .tags {
          margin-bottom: 4px;

          font-weight: 400;
          line-height: 20px;
          font-size: 12px;
          span {
            margin-right: 6px;
            padding: 1px 6px;
            display: inline-block;
            margin-bottom: 4px;
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
      .el-button {
        display: inline-block;
        padding: 8px 40px;
        font-size: 14px;
        font-weight: 400;
        line-height: 22px;
        color: #1d2128;
        cursor: pointer;
        width: auto;
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
      margin: 10px 0;
      overflow: hidden;
      .trs-scroll {
        overflow: auto;
        max-height: 500px;
      }
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
          .el-radio-group {
            font-size: 14px;
            font-weight: 400;
            line-height: 22px;
          }
          .el-input__prefix {
            left: 80%;
            .el-icon-time::before {
              font-family: 'iconfont' !important;
              content: '\e66e';
            }
          }
          .type2-date .el-input__prefix {
            left: 90%;
          }
        }
      }
      .upload-item {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        .el-form-item__content {
          margin-left: 0 !important;
          flex-wrap: wrap;
          display: block;
          line-height: 0;
          .el-upload {
            border-radius: 4px;
            border: 0.8px dashed #cacdd3;
            background: #f7f8fa;
            width: 60px;
            height: 60px;
            line-height: 60px;
          }
          .upload-box {
            display: flex;
            align-items: center;
            flex-wrap: wrap;
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
        .file-list {
          li {
            margin-bottom: 8px;
            width: fit-content;
            border-radius: 4px;
            background: #f7f8fa;
            padding: 8px;
            font-size: 14px;
            font-style: normal;
            font-weight: 400;
            line-height: 22px;
            color: #1d2128;
            .file-icon {
              font-size: 24px;
              vertical-align: bottom;
            }
          }
        }
      }
      .tag-item {
        .el-form-item__content {
          min-height: 40px;
          flex-wrap: wrap;
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
  .add-relevancy-tag {
    display: flex;
    align-items: center;
    padding: 2px 16px;
    border-radius: 4px;
    border: 1px dashed #cacdd3;
    background: #f7f8fa;
    height: 28px;
    margin-bottom: 4px;
  }
  .relevancy-tag {
    border-radius: 3px;
    border: 1px solid #a8c5ff;
    background: #f0f6ff;
    padding: 2px 6px;
    font-size: 12px;
    font-weight: 400;
    line-height: 20px;
    color: #2d5cf6;
    margin-right: 4px;
    margin-bottom: 4px;
    .el-icon-close {
      margin-left: 10px;
      font-size: 14px;
      cursor: pointer;
    }
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
}
</style>
