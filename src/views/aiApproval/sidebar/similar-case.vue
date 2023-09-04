<template>
  <div class="similar-case">
    <p class="poppver-title">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-a-Rectangle143"></use>
      </svg>
      相似案例
    </p>
    <div class="case-box" v-loading="caseListLoading">
      <div class="case-content" v-if="caseList.length">
        <div class="case-item pointer product-border " v-for="(item, index) in caseList" :key="index"
          @click="toDetail(item)">
          <div class="thumbnail-img">
            <div v-if="item.fileType === 'img'" class="other-icon">
              <img :src="item.fileUrl" alt="">
            </div>
            <div v-else class="other-icon">
              <svg class="icon" aria-hidden="true" v-if="item.fileType === 'pdf'">
                <use xlink:href="#icon-mianxingtubiao"></use>
              </svg>
              <svg class="icon" aria-hidden="true" v-if="item.fileType === 'doc' || item.fileType === 'docx'">
                <use xlink:href="#icon-mianxingtubiao-2"></use>
              </svg>
              <svg class="icon" aria-hidden="true" v-if="item.fileType === 'xls' || item.fileType === 'xlsx'">
                <use xlink:href="#icon-mianxingtubiao-1"></use>
              </svg>
              <svg class="icon" aria-hidden="true" v-if="item.fileType === 'ppt'">
                <use xlink:href="#icon-file-ppt"></use>
              </svg>
            </div>
          </div>
          <div class="case-info">
            <div class="name">
              {{ item.taskName }}
            </div>
            <div class="time">
              <span>申请时间：{{ item.createTime }}</span>
              <span>
                <img class="img" src="@/assets/image/ai-approval/orgIcon.png" alt="" />
                {{ item.org }}
              </span>
            </div>
            <div class="desc">
              <span class="tag" v-for="(itemOption, indexOption) in item.approvalTypeOption" :key="indexOption">{{
                itemOption.value }}</span>
              <span class="tag case-desc" v-for="(itemOption, indexOption) in item.productTypeOption"
                :key="indexOption">{{ itemOption.value }}</span>
            </div>
          </div>
          <div class="case-type cp-class">
            {{ item.reviewMattersType }}
          </div>
        </div>
        <trs-pagination :total="total" @getList="getSimilarCasesData" :pageNow="pageNum"></trs-pagination>
      </div>
      <el-empty v-else description="暂无数据"></el-empty>
    </div>
  </div>
</template>
<script>
import {
  getSimilarCases
} from '@/api/aiApproval';
export default {
  name: 'similar-case',
  data() {
    return {
      caseList: [],
      pageNum: 1,
      pageSize: 10,
      formCategoryId: '',
      formId: '',
      caseListLoading: false,
      total: 0,
    }
  },
  created() {
    const { item } = this.$route.params;
    this.formId = item.taskNumber;
    this.formCategoryId = item.formManagementId;
    this.getSimilarCasesData(1)
  },
  methods: {
    toDetail(item) {
      item.taskStatus = '4';
      item.taskId = item.processInstanceId;
      item.initiator = {
        id: item.userId,
        label: item.org,
        name: item.userName,
        org: item.org,
      }
      window.localStorage.setItem(
        'order-detail',
        JSON.stringify({
          item,
          clickPoint: 'taskName',
        })
      );
      this.$router.push({
        name: 'details',
        params: {
          formId: item.recordId,
          processInstanceId: item.processInstanceId,
          formManagementId: item.formManagementId,
          taskName: item.taskName
        },
      });
    },
    async getSimilarCasesData(pageNum) {
      this.caseListLoading = true
      this.pageNum = pageNum
      const waitParam = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        formCategoryId: this.formCategoryId,
        formId: this.formId,
      }
      getSimilarCases(waitParam).then(res => {
        const { data } = res.data;
        this.caseList = data.list;
        this.caseList.map((item) => {
          if (item.approvalTypeOption) {
            item.approvalTypeOption = item.approvalTypeOption.filter(itemOption => itemOption.id === item.approvalType)
          }
          if (item.productTypeOption) {
            item.productTypeOption = item.productTypeOption.filter(itemOption => item.productType.includes(String(itemOption.id)))
          }
          const lastDotIndex = item.fileName.lastIndexOf('.');
          const imgType = ['jpg', 'jpeg', 'png', 'gif'];
          if (lastDotIndex !== -1) {
            const fileType = item.fileName.substring(lastDotIndex + 1);
            if (imgType.includes(fileType)) {
              this.$set(item, 'fileType', 'img')
            } else {
              this.$set(item, 'fileType', fileType)
            }
          }
        })
        this.total = data.totalCount;
        this.caseListLoading = false;
      // eslint-disable-next-line no-unused-vars
      }).catch(err => {
        this.caseListLoading = false;
        this.total = 0
        this.caseList = []
      })
    }
  }
}

</script>
<style lang="less" scoped>
.similar-case {
  width: 600px;
  height: 100%;
  overflow: hidden;

  .poppver-title {
    color: #1D2128;
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 24px;
    margin-bottom: 16px;

    .icon {
      font-size: 20px;
    }
  }

  .case-box {
    height: calc(100% - 40px);
    overflow: hidden;
  }

  .case-content {
    overflow: auto;
    height: 100%;

    .case-item:hover {
      padding: 1px;
      background: #F7F8FA;
      /* 阴影/小 */
      box-shadow: 0px 0px 10px 0px rgba(67, 67, 67, 0.05);
      border: none;

      .case-type {
        right: 1px;
        top: 1px;
      }
    }

    .product-border {
      border: 1px solid #F0F6FF;
    }

    .activity-border {
      border: 1px solid #FFF1F0;
    }

    .customer-border {
      border: 1px solid #FFF7E6;
    }

    .other-border {
      border: 1px solid #E6FFFB;
    }

    .case-item {
      box-sizing: border-box;
      border-radius: 8px;

      background: #FFF;
      position: relative;
      height: 100px;
      display: flex;
      justify-content: flex-start;
      margin-bottom: 16px;
      overflow: hidden;
      border-radius: 10px;

      .thumbnail-img {
        width: 160px;
        height: 100%;
        margin-right: 8px;

        .other-icon {
          background: #F7F8FA;
          width: 100%;
          height: 100%;
          text-align: center;
          line-height: 100px;

          img {
            width: 100%;
          }
        }

        .icon {
          font-size: 40px;
        }
      }

      .name {
        color: #333;
        max-width: 78%;
        font-family: Microsoft YaHei;
        font-size: 14px;
        font-style: normal;
        font-weight: 700;
        line-height: 22px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: inline-block;
        white-space: nowrap;
      }

      .case-info {
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 0 12px 0 0px;
        flex: 1;
      }

      .time {
        margin: 8px 0;
        color: #505968;
        font-family: Microsoft YaHei;
        font-size: 12px;
        font-style: normal;
        font-weight: 400;
        line-height: 20px;
        display: flex;
        align-items: center;

        span {
          display: flex;
          align-items: center;
          gap: 4px;

          .img {
            width: 20px;
          }
        }

        /* 166.667% */
        span:nth-of-type(1)::after {
          display: inline-block;
          content: '';
          width: 1px;
          height: 12px;
          background: #E5E6EB;
          margin: 0 8px;
        }
      }

      .desc {
        display: flex;
        align-items: center;

        .tag {
          color: #2D5CF6;

          font-family: Microsoft YaHei;
          font-size: 12px;
          font-style: normal;
          font-weight: 400;
          line-height: 20px;
          border-radius: 4px;
          background: #F9FBFF;
          display: inline-block;
          padding: 3px 12px;
          margin-right: 8px;

        }

        .case-desc {
          max-width: 57%;
          overflow: hidden;
          text-overflow: ellipsis;
          display: inline-block;
          white-space: nowrap;
          font-weight: 700;
        }
      }

      .case-type {
        position: absolute;
        right: 0;
        top: 0;
        border-radius: 6px 0px 6px 6px;
        font-size: 12px;
        font-style: normal;
        font-weight: 400;
        line-height: 20px;
        padding: 2px 12px;
      }

      .cp-class {
        background: #F0F6FF;
        color: #2D5CF6;
      }

      .hd-class {
        background: #FFF1F0;

        span {
          background: linear-gradient(90deg, #E85167 0%, #FF8193 100%);
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      }

      .kh-class {
        background: #FFF7E6;

        span {
          background: linear-gradient(90deg, #FF5C00 0%, #FFAE64 100%);
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      }

      .other-class {
        background: #E6FFFB;
        color: #0DA5AA;
      }
    }
  }
}
</style>
