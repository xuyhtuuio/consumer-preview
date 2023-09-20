<template>
  <div class="opinion" :class="pageConfig?.pageType">
    <div class="top">
      <div class="search">
        <el-form class="my-form form" :inline="true" :model="search" @submit.native.prevent>
          <el-form-item class="form-item" v-if="pageConfig?.pageType !== 'nonManage'">
            <el-input
              class="onlyInput"
              v-model="search.review"
              placeholder="请输入审查意见搜索"
              @keyup.enter.native="onSearch"
              @clear="onSearch"
              clearable
            >
              <i slot="suffix" class="el-icon-search" @click="onSearch"></i>
            </el-input>
          </el-form-item>

          <el-form-item class="form-item">
            <el-autocomplete
              class="onlyInput"
              ref="autocomplete"
              popper-class="my-autocomplete"
              v-model="search.baseline"
              v-scrollLoad="load"
              :fetch-suggestions="querySearch"
              placeholder="请输入关键词进行查询"
              @select="handleSelect"
              @keyup.enter.native="onSearch"
              clearable
              @clear="onSearch"
            >
              <i slot="suffix" class="el-icon-search el-input__icon" @click="onSearch"> </i>
              <template slot-scope="{ item }">
                <div class="option-info">
                  <span class="left ellipsis" v-html="item.showItem"></span>
                  <span :class="['right', item.keywordType === 1 ? 'right-zero' : 'right-one']">{{
                    item.keywordType === 1 ? '禁用词' : '敏感词'
                  }}</span>
                </div>
              </template>
            </el-autocomplete>
          </el-form-item>

          <el-form-item class="form-item" v-if="pageConfig?.pageType !== 'nonManage'">
            <g-button class="g-btn" type="primary" @click="handleClick">
              <i class="add-icon">+</i>
              添加意见</g-button
            >
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="main" v-loading="isLoading">
      <div class="main-body">
        <div class="info">
          <div class="left">
            共
            <span class="high">{{ this.page.total }}</span>
            条
          </div>
          <div class="right">
            <span
              :class="['r-item', currentSort ? 'r-item-active' : '']"
              @click="handleSort('refer')"
            >
              按引用次数排序
              <span
                style="font-size: 12px"
                class="iconfont icon-jiantou left-icon"
                :class="{ 'left-icon-reverse': !referSort }"
              ></span>
            </span>
            <span
              :class="['r-item', !currentSort ? 'r-item-active' : '']"
              @click="handleSort('update')"
              >按更新时间排序
              <span
                style="font-size: 12px"
                class="iconfont icon-jiantou left-icon"
                :class="{ 'left-icon-reverse': !updateSort }"
              ></span>
            </span>
          </div>
        </div>
        <div class="body">
          <div class="b-item" v-for="item in data" :key="item.id">
            <div class="left">
              <div class="title">
                <span v-html="item.goalName"></span>
                <g-icon
                  class="left-icon"
                  stylePx="20"
                  href="#icon-fuzhi1"
                  @click.native="handleCopy(item.recommendedOpinions)"
                />
              </div>
              <div class="content" v-html="item.showItem"></div>
              <div class="info">
                <span :class="['info-item', item.keywordType === 1 ? 'class-zero' : 'class-one']">
                  {{ item.keywordType === 1 ? '禁用词' : '敏感词' }}
                </span>
                <span class="info-item"
                  ><g-icon class="left-icon" stylePx="20" href="#icon-yinyong" />已引用<i
                    class="high"
                    >{{ item.citationsCount }}</i
                  >次</span
                >
                <span class="info-item">更新时间：{{ timestampToDateTime(item.updateTime) }}</span>
              </div>
            </div>
            <div class="btns" v-if="pageConfig?.pageType !== 'nonManage'">
              <span v-if="item.isTop !== 0" class="btn btn-yellow" @click="changeIsTop(item)">
                <i> <g-icon class="left-icon" stylePx="20" href="#icon-zhiding" />取消置顶</i>
              </span>
              <span v-else class="btn" @click="changeIsTop(item)"><i>置顶</i></span>
              <span class="btn"><i @click="handleClick(item)">编辑</i></span>
              <span class="btn" :class="{ 'btn-red': item.status === 1 }"
                ><i @click="stopApllay(item, 'edit' + item.status)">{{
                  item.status === 1 ? '停用' : '恢复'
                }}</i></span
              >
              <span class="btn"><i @click="stopApllay(item, 'remove')">删除</i></span>
            </div>
          </div>
        </div>
        <TrsPagination
          class="trs-pagination"
          :pageSize="page.pageSize"
          :pageNow="page.pageNow"
          :total="page.total"
          @getList="handleCurrentChange"
          scrollType="scrollCom"
          scrollName="scrollCom"
          v-if="page.total"
        >
        </TrsPagination>
      </div>
    </div>
    <el-dialog
      :visible.sync="limitTimeVisible"
      width="800px"
      custom-class="user-dialog"
      :show-close="false"
      center
    >
      <template slot="title">
        <span>{{ titleDialog }}</span>
        <span class="close" @click="limitTimeVisible = false"><i class="el-icon-close"></i></span>
      </template>
      <el-form class="my-form" :model="dialogItem" label-width="100px">
        <el-form-item class="form-item" label="标签名称">
          <el-autocomplete
            class="onlyInput"
            ref="autocomplete"
            popper-class="my-autocomplete"
            v-model="dialogItem.keywordName"
            v-scrollLoad="el => load(el, true)"
            :fetch-suggestions="(val, cb) => querySearch(val, cb, true)"
            placeholder="关键词"
            @select="handleSelect"
            @keyup.enter.native="onSearch"
            clearable
          >
            <i slot="suffix" class="el-icon-search el-input__icon"> </i>
            <template slot-scope="{ item }">
              <div class="option-info">
                <span class="left ellipsis" v-html="item.showItem"></span>
                <span :class="['right', item.keywordType === 1 ? 'right-zero' : 'right-one']">{{
                  item.keywordType === 1 ? '禁用词' : '敏感词'
                }}</span>
              </div>
            </template>
          </el-autocomplete>
        </el-form-item>
        <el-form-item class="item-form" label="审查话术">
          <el-input
            type="textarea"
            placeholder="请输入审查话术内容"
            v-model="dialogItem.recommendedOpinions"
            resize="none"
            size="medium"
            :autosize="{ minRows: 10, maxRows: 10 }"
          >
          </el-input>
        </el-form-item>
      </el-form>
      <div class=""></div>
      <div slot="footer" class="dialog-footer">
        <g-button @click="limitTimeVisible = false">取 消</g-button>
        <g-button class="stop" type="primary" @click="editItem(dialogItem)">确 定</g-button>
      </div>
    </el-dialog>
    <secondary-confirmation
      :option="saveOption[action]"
      ref="confirmation"
      @handleConfirm="editStatus"
    ></secondary-confirmation>
  </div>
</template>
<script>
import secondaryConfirmation from '@/components/common/secondaryConfirmation';
import { getPageList, getSearchList, edit, add, remove } from '@/api/admin-opinion';
import { copyText } from '@/utils/Clipboard';
import { timestampToDateTime } from '@/utils/utils';
export default {
  name: 'OpinionManage',
  props: {
    pageConfig: {
      type: Object,
      default: () => ({})
    }
  },
  components: { secondaryConfirmation },
  data() {
    return {
      search: {
        review: '',
        baseline: ''
      },
      limitTimeVisible: false,
      isLoading: false,
      timestampToDateTime,
      data: [],
      page: {
        pageNow: 1,
        total: 0,
        pageSize: 10
      },
      titleDialog: '新建标签',
      dialogTitle: '标签名称',
      dialogItem: {},
      deviceIdList: [],
      deviceIdListFilter: [],
      searchList: [],
      currentSort: true,
      referSort: true,
      updateSort: true,
      searchDialogIndex: 1,
      iptPaddingFlag: true,
      isSearchFocus: false,
      action: '',
      saveOption: {
        edit1: {
          message: '停用后将无法推荐此意见，确定停用吗？',
          cancelBtn: '取消',
          confirmBtn: '停用'
        },
        edit0: {
          message: '恢复后工单中将可能推荐此意见，确定恢复吗？',
          cancelBtn: '取消',
          confirmBtn: '恢复'
        },
        remove: {
          message: '删除后将无法推荐此意见，确定删除吗？',
          cancelBtn: '取消',
          confirmBtn: '删除'
        }
      }
    };
  },
  created() {
    this.initSearchData();
  },
  mounted() {
    this.page.pageSize = this.pageConfig.pageSize || this.page.pageSize;
    this.initData();
  },
  watch: {
    limitTimeVisible(val) {
      !val && (this.searchList.length = 0);
    }
  },
  directives: {
    scrollLoad: {
      bind(el, binding) {
        const wrapDom = el.querySelector('.el-autocomplete-suggestion__wrap');
        const listDom = el.querySelector(
          '.el-autocomplete-suggestion__wrap  .el-autocomplete-suggestion__list'
        );
        wrapDom.addEventListener(
          'scroll',
          () => {
            const condition = wrapDom.offsetHeight + wrapDom.scrollTop - listDom.offsetHeight - 20;
            if (+condition === 0 && wrapDom.scrollTop !== 0) {
              // 滚动到底部则执行滚动方法load，binding.value就是v-scrollLoad绑定的值，加()表示执行绑定的方法
              binding.value();
            }
          },
          false
        );
      }
    }
  },
  methods: {
    // 初始化数据
    initData(pageNum, callback) {
      this.isLoading = true;
      const referSort = this.referSort ? 1 : 2
      const updateSort = this.updateSort ? 3 : 4
      const pageData = {
        keywordContent: this.search.baseline,
        opinionContent: this.search.review,
        orderType: this.currentSort ? referSort : updateSort,
        pageNum: pageNum || this.page.pageNow,
        pageSize: this.page.pageSize,
        isAll: this.pageConfig.isAll !== undefined ? this.pageConfig.isAll : 1
      };
      getPageList(pageData).then(({ totalCount, list }) => {
        this.page.total = totalCount;
        this.isLoading = false;
        this.data = list;
        this.handleTextHigh(this.data, {
          // keywordName: ['goalName', this.search.baseline],
          // keywordName: 需要转换的key goalName: 转后以后新增的字段， this.search.baseline:需要高亮显示的关键字
          keywordName: ['goalName', this.search.baseline],
          recommendedOpinions: ['showItem', this.search.review]
        });
        this.$rollTo(0, document
          .querySelector('.main-body'))
        callback && callback()
      });
      this.searchList.length = 0;
    },
    // 初始化搜索数据
    initSearchData(flag = false) {
      const data = {
        content: flag ? this.dialogItem.keywordName : this.search.baseline,
        pageNum: this.searchDialogIndex,
        pageSize: 10
      };
      getSearchList(data).then(res => {
        const arr = res.list;
        this.formatting(arr);
        const keyword = flag ? this.dialogItem.keywordName : this.search.baseline;
        if (arr && arr.length > 0 && keyword?.length > 0) this.handleTextHigh(arr, { value: ['showItem', keyword] });

        if (this.searchDialogIndex === 1) this.searchList.length = 0;

        this.searchList.push(...arr);
      });
    },
    formatting(data) {
      data.forEach(({ keywordContent: value, recordId: label, type: keywordType }, index) => {
        data[index] = {
          label,
          value,
          keywordType,
          showItem: value
        };
      });
    },
    // 文字关键字高亮显示
    // keyword 只能是字符串或者数组
    handleTextHigh(originArr, originObj) {
      Object.entries(originObj).forEach(([originKey, originValue]) => {
        originArr.filter(item => {
          item[originValue[0]] = item[originKey];
          const keyword = originValue[1];
          const reg = new RegExp(keyword, 'gi');
          const regRes = reg.exec(item[originKey]);
          if (regRes) {
            const replaceString = `<span style="color:#2D5CF6;">${regRes[0]}</span>`;
            item[originValue[0]] = item[originKey].replace(regRes, replaceString);
          }
        });
      });
    },

    onSearch() {
      this.initData(1);
      this.changeStyle('none', '.el-autocomplete-suggestion');
    },
    load(el, flag = false) {
      this.searchDialogIndex += 1;
      this.$refs.autocomplete.activated = true;
      this.initSearchData(flag);
    },
    // 根据传进来的状态改变建议输入框的状态（展开|隐藏）
    changeStyle(status, className) {
      const dom = document.querySelectorAll(className);
      dom[0].style.display = status;
    },
    handleSort(type) {
      if (type === 'refer') {
        if (this.currentSort) {
          this.referSort = !this.referSort;
        } else {
          this.currentSort = true;
        }
      } else {
        !this.currentSort && (this.updateSort = !this.updateSort);
        this.currentSort && (this.currentSort = false);
      }
      this.initData();
    },
    async changeIsTop(item) {
      this.isLoading = true;
      const isTop = item.isTop === 0 ? 1 : 0;
      const res = await edit({
        ...item,
        isTop
      });
      if (res.success) {
        this.$message.success('操作成功!');
        this.initData();
      } else {
        this.$message.error(res.msg);
      }
    },
    handleLabelType(id) {
      this.dialogItem.keywordType = id;
    },
    handleClick(row) {
      this.titleDialog = row ? '编辑意见' : '新建意见';
      this.dialogItem = row ? { ...row } : {};
      this.limitTimeVisible = true;
      this.initSearchData(true);
    },
    // submitEdit(row) {
    //   console.log(row);
    // },
    // 停用
    stopApllay(item, action) {
      this.dialogItem = item;
      this.action = action;
      this.$refs.confirmation.dialogVisible = true;
    },
    handleCurrentChange(val) {
      this.page.pageNow = val;
      this.initData(val, () => { this.initSearchData() });
    },
    // 停用 或启用 意见， 或删除意见
    async editStatus() {
      let res;
      if (this.action === 'remove') {
        res = await remove({
          ...this.dialogItem
        });
      } else if (this.action.indexOf('edit') !== -1) {
        const status = this.dialogItem.status === 0 ? 1 : 0;
        res = await edit({
          ...this.dialogItem,
          status
        });
      }
      if (res.success) {
        this.$message.success('操作成功!');
        this.handleCurrentChange(
          this.action === 'remove' && this.data.length === 1
            ? this.page.pageNow - 1
            : this.page.pageNow
        );
      } else {
        this.$message.error(res.msg);
      }
    },
    // 编辑意见 或新增
    async editItem({ keywordName, recommendedOpinions }) {
      if (!keywordName || !recommendedOpinions) return this.$message.error('请填写相关信息');
      if (
        this.searchList.length
        && !this.searchList.find(listItem => listItem.value === keywordName)
      ) return this.$message.error('请选择正确的标签名称');
      let res;
      if (this.dialogItem?.recordId) {
        res = await edit({
          ...this.dialogItem,
          content: this.dialogItem.recommendedOpinions
        });
      } else {
        res = await add({
          ...this.dialogItem,
          content: this.dialogItem.recommendedOpinions
        });
      }
      if (res.success) {
        this.$message.success('操作成功!');
        this.handleCurrentChange(this.page.pageNow);
        this.limitTimeVisible = false;
      } else {
        this.$message.error(res.msg);
      }
    },
    querySearch(val, cb, flag = false) {
      this.searchDialogIndex = 1;
      cb(this.searchList.length ? this.searchList : []);
      this.initSearchData(flag);
    },
    handleSelect(val) {
      if (this.limitTimeVisible) {
        this.dialogItem.keywordId = val.label;
      } else {
        this.initData(1);
      }
    },
    // 复制
    handleCopy(val) {
      copyText(
        val,
        msg => {
          this.$message.success(msg);
        },
        err => {
          this.$message.success(err);
        }
      );
    }
  }
};
</script>
<style lang="less" scoped>
@color1: #1d2128;
@color2: #2d5cf6;
@color3: #306ef5;
@color4: #e5e6eb;
@color5: #eb5d78;
@color6: #fa8c16;
@color7: #86909c;
@color8: #1d2128;
@color9: #f7f8fa;

.opinion {
  height: 100%;

  .el-icon-search {
    cursor: pointer;
  }

  .left-icon {
    display: inline-block;
    position: relative;
    margin-right: 4px;
  }

  .top {
    font-size: 14px;
    margin: 0 -24px;
    padding: 0 24px 24px;
    border-bottom: 1px solid #e5e6eb;

    .info {
      margin-bottom: 20px;

      &-title {
        font-size: 20px;
        font-weight: 700;
        color: rgba(51, 51, 51, 1);
      }

      &-desc {
        margin-left: 20px;
        font-size: 14px;
        color: rgba(51, 51, 51, 1);

        .desc-blue {
          color: rgba(48, 110, 245, 1);
        }
      }
    }

    .search {
      .form {
        display: flex;

        &-item {
          // flex: 1;
          display: flex;
          width: 320px;
          margin-right: 0;
          margin-bottom: 0;

          &:first-child {
            margin-right: 10px;
          }

          &:last-child {
            flex: 1;

            /deep/.el-form-item__content {
              justify-content: flex-end;
              background-color: transparent;
            }
          }

          /deep/.el-form-item__content {
            border-radius: 4px;
            flex: 1;
            display: flex;

            .g-btn {
              margin-left: 10px;

              .add-icon {
                position: relative;
                top: -1px;
                margin-right: 8px;
                font-size: 26px;
                font-weight: 100;
              }

              .btn {
                min-width: auto;
                padding: 0 16px;

                .iconfont {
                  margin-right: 4px;
                }
              }
            }
          }

          &.btn {
            display: flex;
          }
        }
      }
    }

    .el-button {
      width: 80px;
      height: 34px;
      line-height: 26px;
      border-radius: 6px;

      span {
        position: relative;
        bottom: 5px;
      }
    }

    .el-button--primary {
      border: none;
    }
  }

  .main {
    height: calc(~'100% - 63px');
    overflow-y: auto;
    padding: 24px 0 0;
    &-body {
      height: 100%;
      overflow: auto;
    }

    .info {
      display: flex;
      justify-content: space-between;
      line-height: 22px;

      .left {
        font-size: 14px;

        .high {
          color: @color2;
          font-weight: 700;
        }
      }

      .right {
        .r-item {
          font-size: 12px;

          &.r-item-active {
            color: #2d5cf6;
          }

          cursor: pointer;

          .left-icon {
            &-reverse {
              transform: rotate(180deg);
            }
          }

          &:first-child {
            margin-right: 10px;
          }
        }
      }
    }

    .body {
      .b-item {
        display: flex;
        align-items: center;
        margin-top: 16px;
        padding: 12px 16px;
        font-size: 14px;
        border-radius: 10px;

        &:hover {
          background: @color9;

          .left {
            .title {
              .left-icon {
                display: block;
              }
            }
          }
        }

        .left {
          flex: 1;
          line-height: 24px;

          .title {
            display: flex;
            justify-content: space-between;
            line-height: 25px;
            font-weight: 700;

            .left-icon {
              display: none;
              cursor: pointer;
            }
          }

          .content {
            margin: 10px 0;
          }

          .info {
            display: flex;
            justify-content: flex-start;
            &-item {
              margin-right: 24px;

              .left-icon {
                top: 4px;
              }

              .high {
                color: @color2;
                font-weight: 700;
              }

              &:nth-child(2) {
                color: @color8;
              }

              &:last-child {
                color: @color7;
              }
            }
          }
        }

        .btns {
          margin-left: 24px;
          line-height: 22px;

          .btn {
            color: @color3;
            font-size: 14px;

            .left-icon {
              top: 2px;
            }

            &-red {
              color: @color5;
            }

            &-yellow {
              color: @color6;
            }

            &:not(:first-child) {
              &::before {
                content: '|';
                color: @color4;
                margin: 0 12px;
              }
            }

            i {
              cursor: pointer;
            }
          }
        }
      }
    }
  }

  .el-button--text {
    padding: 5px;
  }

  /deep/.el-dialog {
    .el-dialog__header {
      padding: 0;
      font-size: 16px;
      font-weight: 700;
      color: @color1;
      line-height: 24px;
      height: 24px;

      .close {
        float: right;
        font-size: 24px;

        &:hover {
          cursor: pointer;
        }
      }
    }

    .el-dialog__body {
      padding: 0;
    }
  }

  /deep/.el-dialog.user-dialog {
    border-radius: 10px;
    padding: 40px;

    .my-form {
      margin-top: 24px;

      .item-form {
        margin-right: 20px;
        margin-top: 2px;

        .el-form-item__content {
          padding: 12px 20px;
          border: 1px solid @color4;
          background-color: transparent;

          .el-textarea,
          .el-textarea__inner {
            background-color: transparent;
            padding: 0;
          }
        }
      }
    }

    .label {
      margin: 24px 20px 0;
      display: flex;

      &-left {
        margin-right: 12px;
        min-width: fit-content;
        line-height: 36px;
      }
    }

    .dialog-footer {
      margin-top: 56px;

      .g-button {
        .btn {
          width: 108px;
          height: 38px;
        }
      }
    }
  }

  /deep/.el-dialog.stop-dialog {
    border-radius: 10px;
    padding: 20px 20px 40px;

    .dialog-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: 40px;

      .icon {
        margin-bottom: 16px;
        color: #fdb123;
        font-size: 54px;
      }

      .info {
        padding: 0 60px;
        text-align: center;
        color: #1d2128;
      }
    }

    .el-dialog__footer {
      padding: 0;

      .dialog-footer {
        display: flex;
        justify-content: center;
        align-items: center;

        .g-button {
          margin-right: 24px;

          .btn-primary {
            background-image: linear-gradient(
              to right,
              rgba(47, 84, 235, 1),
              rgba(81, 150, 255, 1)
            );
          }
        }
      }
    }
  }

  /deep/ .tableCard {
    padding: 0;

    .left {
      position: relative;
      left: -8px;
    }

    & > .content {
      margin-top: 20px;
      font-weight: 700;
      color: @color1;
    }
  }

  /deep/.el-radio-group {
    display: flex;
    flex-wrap: wrap;

    .el-radio {
      // display: flex;
      // align-items: center;
      padding: 15px 20px;
      width: 140px;
      margin-top: 20px;
      margin-right: 10px;
      border-radius: 4px;
      background: #f7f8fa;

      &:nth-child(3n) {
        margin-right: 0;
      }
    }
  }

  /deep/.el-dialog__footer {
    padding: 0;

    .dialog-footer {
      display: flex;
      justify-content: center;
      align-items: center;

      .g-button {
        margin-right: 20px;

        .btn {
          height: 36px;
        }

        .btn-primary {
          background: #306ef5;
        }
      }
    }
  }

  /deep/ .el-input__inner {
    height: 36px;
    line-height: 36px;
  }

  .class-one {
    padding: 4px 12px;
    background: #fff7e6;
    border-radius: 4px;
    color: #fa8c16;
  }

  .class-zero {
    padding: 4px 12px;
    background: #fff1f0;
    border-radius: 4px;
    color: #eb5757;
  }
}

.nonManage {
  flex: 1;
  overflow: hidden;

  .top {
    border: 0;
    padding: 0;
    margin: 0;

    /deep/.search .my-form .el-form-item__content {
      padding-left: 0;
      border-radius: 32px;
      overflow: hidden;
    }

    .search .form-item {
      &:first-child {
        margin: 0;
      }
    }

    /deep/ .el-input__inner {
      padding-left: 20px;
    }
  }

  .main {
    padding: 16px 0;
    height: calc(100% - 25px);
  }

  .el-form-item__content {
    padding: 0;
  }
}

/deep/.el-select-dropdown {
  left: 459px;
}

.option-info {
  display: flex;
  justify-content: space-between;

  .left {
    flex: 1;
    overflow: hidden;
  }

  .right {
    position: relative;
    left: 10px;
    display: flex;
    align-items: center;
    font-size: 20px;
    -webkit-transform: scale(0.5);

    &::before {
      display: inline-block;
      content: '';
      margin-right: 16px;
      width: 6px;
      height: 6px;
      border-radius: 50%;
    }

    &-zero {
      color: #eb5757;

      &::before {
        background: #eb5757;
      }
    }

    &-one {
      color: #fa8c16;

      &::before {
        background: #fa8c16;
      }
    }
  }
}

.trs-pagination {
  /deep/.pagination {
    // text-align: center;
    .el-input__inner {
      height: 28px;
      line-height: 28px;
    }
  }
}
</style>
