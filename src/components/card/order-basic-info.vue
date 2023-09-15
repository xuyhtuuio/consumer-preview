<template>
  <div class="order-basic-info" v-loading="loading">
    <div class="user">
      <div class="user-info">
        <img src="@/assets/image/ai-approval/ocr-avatar.png" alt="" />
        <span class="nickname">
          {{ personInfo && personInfo.name }} /
          {{ personInfo && personInfo.id }}
        </span>
        <span v-if="personOrg&&personOrg.length"> <i v-for="(item,index) in personOrg" :key="index">{{ item }}
        <i v-if="index<personOrg.length-1"> | </i>
        </i></span>
      </div>
      <slot name="apply-modify"></slot>
    </div>
    <p class="poppver-title">
      <span
        ><svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-a-Rectangle143"></use>
        </svg>
        基本信息</span
      >
    </p>
    <!-- 项目基本信息-->
    <div v-if="orderInfo.newBaseInfo && orderInfo.newBaseInfo.length">
      <div
        v-for="(item, index) in orderInfo.newBaseInfo"
        :key="index"
        class="proj-info"
      >
        <div v-for="(child, idx) in item" :key="idx" class="proj-info-item">
          <div class="item">
            <span class="label">{{ child.title }}</span>
            <span class="value">{{ child | valueFormat }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="proj-info pro-info-textarea">
      <div
        class="item"
        v-for="(item, index) in orderInfo.textAreaBaseInfo"
        :key="index"
      >
        <span class="label">{{ item.title }}</span>
        <span class="value">{{ item | valueFormat }}</span>
      </div>
    </div>
    <!-- 发布渠道 -->
    <div v-if="orderInfo.promotionChannels">
      <div class="line"></div>
      <div
        class="channel-info"
        v-for="(item, index) in orderInfo.promotionChannels"
        :key="index"
      >
        <div class="item" v-for="(child, idx) in item.props.options" :key="idx">
          <span class="label">{{ child.value }}</span>
          <span class="value">{{ multipleSelect(child, item) }}</span>
        </div>
        <slot name="personal-channel"></slot>
      </div>
    </div>
    <!-- 审查要点 -->
    <div v-if="orderInfo.reviewPointer && orderInfo.reviewPointer.length > 0">
      <div class="line"></div>
      <p class="poppver-title">
        <span>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-a-Rectangle143"></use>
          </svg>
          审查要点</span
        >
      </p>
      <div
        :class="[
          'proj-info',
          orderInfo.reviewPointer && orderInfo.reviewPointer.length > 0
            ? 'review-pointer'
            : 'review-pointer1'
        ]"
      >
        <div
          class="item"
          v-for="(item, index) in orderInfo.reviewPointer"
          :key="index"
        >
          <span class="label">{{ item.title }}</span>
          <span class="value" v-if="item.name == 'MultipleSelect'">
            <i
              v-for="(points, index) in formatePoints(item)"
              :key="index"
              style="display: block"
            >
              {{ points }}</i
            >
          </span>
          <span class="value" v-if="item.name == 'SingleGroupsSelect'">
            <span
              v-for="(points, index) in formatePoints(item)"
              :key="index"
              style="justify-content: space-between"
              class="flex"
            >
              <i>-{{ points.point }}</i>
              <i>{{ points.isRelative }}</i>
            </span>
          </span>
        </div>
      </div>
    </div>
    <!-- 审查材料 -->
    <div class="line"></div>
    <p class="poppver-title">
      <span>
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-a-Rectangle143"></use></svg>审查材料
        <i class="total"
          >共 {{ orderInfo.fileList && orderInfo.fileList.length }} 个</i
        ></span
      >
      <span
        class="download pointer"
        v-if="orderInfo.fileList.length"
        @click="download(orderInfo.fileList)"
        >下载全部</span
      >
    </p>
    <div class="file-list">
      <div
        class="file-item pointer"
        v-for="(item, index) in orderInfo.fileList"
        :key="index"
      >
        <span class="left ellipsis ellipsis_1">
          <i class="indexes">{{ index + 1 }}.</i>
          <file-type :fileName="item.fileName"></file-type>
          <i class="filename">{{ item.fileName }}</i>
        </span>
        <span class="preview" @click="preview(item.url)">预览</span>
      </div>
    </div>
  </div>
</template>

<script >
import { getApplyForm } from '@/api/front'
import { downloadAllFiles } from '@/api/applyCenter'
// eslint-disable-next-line
import * as dayjs from 'dayjs'
import FileType from '@/components/common/file-type'
export default {
  name: 'order-basic-info',
  components: { FileType },
  props: {
    sidebarParam: {
      type: Object,
      default: () => {}
    },
    personInfo: {
      type: Object,
      default: () => {}
    },
    personOrg: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      loading: false,
      orderBaseInfo: {},
      orderInfo: {
        baseInfo: [],
        newBaseInfo: [],
        textAreaBaseInfo: [],
        reviewPointer: [],
        fileList: []
      }
    }
  },
  mounted() {
    this.init()
  },
  activated() {},
  watch: {
    sidebarParam: {
      handler(val) {
        if (val && Object.keys(val)?.length > 2) {
          this.getBsicData(val, true)
        }
      },
      immediate: true
    }
  },
  methods: {
    init() {
      const keys = Object.keys(this.$route.params) || Object.keys(this.$route.sidebarParam)
      if (this.sidebarParam && Object.keys(this.sidebarParam)?.length > 2) {
        this.getBsicData(this.sidebarParam, true)
      } else if (keys.length) {
        this.getOrderDetail()
      }
    },
    /**
     * @description: 折行，最多 4 个
     * @return {*}
     */
    getMapping(list) {
      const len = list.length
      const newList = []
      if (len) {
        const chunk = 4
        for (let i = 0, j = len; i < j; i += chunk) {
          newList.push(list.slice(i, i + chunk))
        }
      }
      return newList
    },
    getOrderDetail() {
      this.loading = true
      getApplyForm({
        formCategoryId:
          (this.$route.params && this.$route.params.formManagementId) || (this.sidebarParam && this.sidebarParam.formManagementId),
        formId: this.$route.params.formId || this.sidebarParam.formId,
        processTemplateId: this.$route.params.processTemplateId,
        nodeId: this.$route.params.nodeId
      })
        .then((res) => {
          const { data, status, message } = res.data
          if (status === 200) {
            this.getBsicData(data, true)
          } else {
            this.getBsicData(
              {
                basicInformation: [],
                keyPointsForVerification: [],
                promotionChannels: [],
                reviewMaterials: []
              },
              false
            )
            this.$message.error({ offset: 40, title: '提醒', message })
          }
        })
        .catch(() => {})
        .finally(() => {
          this.loading = false
        })
    },
    /**
     * @description: 格式化数据
     * @param {*} data 接口或者 props返回的数据
     * @param {*} flag false：说明拿到的 data为空
     * @return {*}
     */
    getBsicData(data, flag) {
      if (!flag) {
        this.orderInfo = {
          baseInfo: [],
          textAreaBaseInfo: [],
          newBaseInfo: [],
          reviewPointer: [],
          promotionChannels: [],
          fileList: []
        }
        return false
      }
      const {
        basicInformation,
        keyPointsForVerification,
        reviewMaterials,
        filledInByApprover
      } = data
      // 大段文本过滤
      const noTextAreaBeseInfo = basicInformation.filter((v) => {
        return !['TextareaInput', 'MultipleGroupsSelect'].includes(v.name)
      }) || []
      const textAreaBaseInfo = basicInformation.filter((v) => {
        return ['TextareaInput'].includes(v.name)
      }) || []
      const MultipleGroupsSelect = basicInformation.filter((v) => {
        return ['MultipleGroupsSelect'].includes(v.name)
      }) || []
      this.orderInfo = {
        baseInfo: noTextAreaBeseInfo,
        textAreaBaseInfo,
        newBaseInfo: this.getMapping(noTextAreaBeseInfo),
        reviewPointer: keyPointsForVerification,
        promotionChannels: MultipleGroupsSelect,
        fileList: reviewMaterials && reviewMaterials[0].value
      }
      this.$emit(
        'sendReviewMaterials',
        reviewMaterials && reviewMaterials[0].value
      )
      this.$emit('sendFilledInByApprover', filledInByApprover)
    },
    preview(url) {
      this.$emit('preview', url)
    },
    download() {
      const params = {
        formId: this.$route.params.formId || this.sidebarParam.formId,
      }
      this.$message.info('下载中，请稍等！')
      downloadAllFiles(params).then((res) => {
        const disposition = res.headers['content-disposition']
        const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf;charset=utf-8' }))
        const link = document.createElement('a');
        link.style.display = 'none'
        link.href = url
        link.setAttribute('download', decodeURI(disposition.replace('attachment;filename=', '')))
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      })
    },
    formatePoints(val) {
      if (val.name === 'MultipleSelect') {
        const { options } = val.props
        const array = []
        val.value.forEach((id) => {
          const strings = options.filter((v) => v.id === id)[0]
          array.push(strings)
        })
        const label = array.map((m) => {
          return m.value
        })
        return label || '--'
      } else if (val.name === 'SingleGroupsSelect') {
        const { options } = val.props
        // 展示所有的 label
        const label = options.map((labelItem) => {
          const isRelative = labelItem.children.filter((childValue) => val.value.includes(childValue.id))[0].value
          return {
            point: labelItem.value,
            isRelative,
          }
        })
        return label || '--'
      }
    },
    multipleSelect(child, item) {
      let strings = ''
      const array = []
      item.value.forEach((n) => {
        const filters = child.children.filter((v) => v.id === n)
        array.push(...filters)
      })
      strings = array
        .map((m) => {
          return m.value
        })
        .join('、')
      return strings || '--'
    }
  },
  filters: {
    valueFormat(val) {
      if (val.name === 'TextInput' || val.name === 'TextareaInput') {
        return val.value || '--'
      }
      if (val.name === 'SelectInput') {
        const { options } = val.props
        let strings = options.filter((v) => v.id === val.value)
        strings = strings
          .map((m) => {
            return m.value
          })
          .join('、')
        return strings || '--'
      }
      if (val.name === 'TimePicker') {
        if (!val.value) return '--'
        return val.value.length < 8 ? val.value : dayjs(val.value).format('YYYY-MM-DD HH:mm:ss')
      }
      if (val.name === 'MultipleSelect') {
        const { options } = val.props
        const array = []
        val.value.forEach((id) => {
          const strings = options.filter((v) => v.id === id)[0]
          array.push(strings)
        })
        const label = array
          .map((m) => {
            return m.value
          })
          .join('、')
        return label || '--'
      }
    }
  }
}
</script>
<style lang="less" scoped>
.order-basic-info {
  .user {
    margin-bottom: 16px;
    display: flex;
    align-items: center;
  }

  .user-info {
    flex: 1;
    border-radius: 20px;
    background: #f7f8fa;
    display: flex;
    align-items: center;

    .avatar {
      width: 32px;
      height: 32px;
      background: #80a6ff;
      text-align: center;
      line-height: 32px;
      border-radius: 20px;
      margin-right: 8px;
      font-weight: 700;
      color: #fff;
      font-size: 14px;
    }

    img {
      width: 32px;
      height: 32px;
      margin-right: 8px;
    }

    color: #505968;
    font-size: 12px;
    font-weight: 400;
    line-height: 32px;

    .nickname {
      color: #1d2128;
      font-weight: 700;
      line-height: 32px;
      margin-right: 16px;
    }
  }

  .poppver-title {
    color: #1d2128;
    font-size: 16px;
    font-style: normal;
    font-weight: 700;
    line-height: 24px;
    margin-bottom: 16px;
    display: flex;
    justify-content: space-between;

    .icon {
      font-size: 20px;
    }

    i {
      font-size: 12px;
      font-weight: 400;
      line-height: 22px;
      margin-left: 8px;
    }

    .download {
      color: #306ef5;
      font-size: 14px;
      font-weight: 400;
      line-height: 22px;
      /* 157.143% */
      text-decoration-line: underline;
    }
  }

  .item {
    display: flex;
    flex-direction: column;

    font-size: 12px;
    font-weight: 400;
    line-height: 20px;
    padding: 2px 0px;
    margin-bottom: 2px;

    .label {
      color: #505968;
      display: flex;
      align-items: center;
    }

    .label::before {
      content: '·';
      font-size: 20px;
      padding-right: 4px;
      line-height: 20px;
      color: #505968;
    }

    .value {
      color: #1d2128;
      font-weight: 700;
      padding-left: 14px;
    }
  }

  .proj-info {
    display: flex;
    margin-bottom: 12px;
    flex-wrap: wrap;

    .proj-info-item {
      flex: 1;
      margin-right: 13px;
    }

    .proj-info-item:last-of-type {
      margin-right: 0;
    }
  }

  .pro-info-textarea {
    display: flex;
    flex-direction: column;
  }

  .channel-info {
    display: flex;

    .item {
      flex: 1;
      margin-right: 13px;
    }

    .item:last-of-type {
      margin-right: 0;
    }
  }

  .review-pointer {
    flex-wrap: wrap;
    justify-content: space-between;

    .item {
      width: 49% !important;
    }
  }

  .review-pointer1 {
    .item {
      flex: 1;
    }
  }

  .line {
    width: 552px;
    width: 100%;
    margin: 16px 0;
    border-top: 1px dashed #e5e6eb;
  }

  .file-list {
    display: flex;
    flex-wrap: wrap;
    width: 100%;

    .file-item {
      width: 50%;
      padding: 8px 12px;
      font-size: 14px;
      font-weight: 400;
      line-height: 22px;
      display: flex;
      cursor: pointer;
      justify-content: space-between;

      .indexes {
        color: #505968;
        word-break: keep-all;
      }

      .filename {
        color: #505968;
        max-width: 80%;
      }

      .icon {
        margin: 0 10px;
        width: 20px;
        height: 20px;
      }

      .left {
        flex: 1;
        // display: flex;
        padding-right: 20px;
      }

      .preview {
        width: 32px;
        color: #2d5cf6;
        visibility: hidden;
      }
    }

    .file-item:hover {
      border-radius: 4px;
      background: #f7f8fa;
      cursor: pointer;

      .preview {
        visibility: visible;
      }
    }
  }
}</style>
