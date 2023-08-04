<template>
  <div class="opinion">
    <div class="top">
      <div class="search">
        <el-form class="my-form form" :inline="true" :model="search">
          <el-form-item class="form-item">
            <el-input
              v-model="search.review"
              placeholder="请输入审查意见搜索"
              @keyup.enter.native="onSearch"
            >
              <i slot="suffix" class="el-icon-search" @click="onSearch"></i>
            </el-input>
          </el-form-item>

          <el-form-item class="form-item">
            <el-autocomplete
              ref="autocomplete"
              popper-class="my-autocomplete"
              v-model="search.baseline"
              v-scrollLoad="load"
              :fetch-suggestions="querySearch"
              placeholder="关键词"
              @select="handleSelect"
              @blur="handleSearchBlur"
            >
              <i slot="suffix" class="el-icon-search el-input__icon" @click="onSearch"> </i>
              <template slot-scope="{ item }">
                <div class="option-info">
                  <span class="left" v-html="item.showItem"></span>
                  <span :class="['right', item.typeId === 0 ? 'right-zero' : 'right-one']">{{
                    item.type
                  }}</span>
                </div>
              </template>
            </el-autocomplete>
          </el-form-item>

          <el-form-item class="form-item">
            <g-button class="g-btn" type="primary" @click="handleClick">
              <i class="add-icon">+</i>
              添加意见</g-button
            >
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="main" v-loading.body="isLoading">
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
              :class="{ 'left-icon-reverse': referSort }"
            ></span>
          </span>
          <span
            :class="['r-item', !currentSort ? 'r-item-active' : '']"
            @click="handleSort('update')"
            >按更新时间排序
            <span
              style="font-size: 12px"
              class="iconfont icon-jiantou left-icon"
              :class="{ 'left-icon-reverse': updateSort }"
            ></span>
          </span>
        </div>
      </div>
      <div class="body">
        <div class="b-item" v-for="item in data" :key="item.id">
          <div class="left">
            <div class="title">
              <span>{{ item.keywordName }}</span>
              <g-icon
                class="left-icon"
                stylePx="20"
                href="#icon-fuzhi1"
                @click.native="handleCopy(item.recommendedOpinions)"
              />
            </div>
            <div class="content">{{ item.recommendedOpinions }}</div>
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
          <div class="btns">
            <span v-if="item.isTop !== 0" class="btn btn-yellow">
              <i> <g-icon class="left-icon" stylePx="20" href="#icon-zhiding" />取消置顶</i>
            </span>
            <span v-else class="btn"><i>置顶</i></span>
            <span class="btn"><i @click="handleClick(item)">编辑</i></span>
            <span class="btn btn-red"><i @click="stopApllay(item)">停用</i></span>
            <span class="btn"><i>删除</i></span>
          </div>
        </div>
      </div>
      <TrsPagination
        class="trs-pagination"
        :pageSize="10"
        :pageNow="page.pageNow"
        :total="page.total"
        @getList="handleCurrentChange"
        scrollType="scrollCom"
        scrollName="scrollCom"
        v-if="page.total"
      >
      </TrsPagination>
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
          <el-select
            class="label-right"
            v-model="dialogItem.titleId"
            filterable
            :filter-method="dataFilter"
            @visible-change="visibleHideSelectInput"
            placeholder="请输入标签名称"
          >
            <el-option
              v-for="item in deviceIdList"
              :key="item.value"
              :label="item.value"
              :value="item.label"
            >
              <div class="option-info">
                <span class="left" v-html="item.showItem"></span>
                <span :class="['right', item.typeId === 0 ? 'right-zero' : 'right-one']">{{
                  item.type
                }}</span>
              </div></el-option
            >
          </el-select>
        </el-form-item>
        <el-form-item class="item-form" label="审查话术">
          <el-input
            type="textarea"
            placeholder="请输入审查话术内容"
            v-model="dialogItem.content"
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
        <g-button class="stop" type="primary" @click="handleSubmitLimitTime">确 定</g-button>
      </div>
    </el-dialog>

    <el-dialog
      :visible.sync="limitVisible"
      width="500px"
      custom-class="stop-dialog"
      :show-close="false"
      center
    >
      <template slot="title">
        <span class="close" @click="limitVisible = false"><i class="el-icon-close"></i></span>
      </template>
      <div class="dialog-item">
        <i class="el-alert__icon el-icon-warning icon"></i>
        <div class="info">停用后将无法推荐此意见，确定停用吗？</div>
      </div>
      <div slot="footer" class="dialog-footer">
        <g-button @click="limitVisible = false">取 消</g-button>
        <g-button class="stop" type="primary" @click="handleSubmitLimitTime">停用</g-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getPageList } from '@/api/admin-opinion.js';
import { copyText } from '@/utils/Clipboard.js';
import { timestampToDateTime } from '@/utils/utils.js';
export default {
  name: 'OpinionManage',
  data() {
    return {
      search: {
        review: '',
        baseline: ''
      },
      types: [
        { id: 0, value: '禁用词' },
        { id: 1, value: '敏感词' }
      ],
      limitTimeVisible: false,
      limitVisible: false,
      isLoading: false,
      timestampToDateTime,
      data: [
        {
          id: 0,
          title: '比较基准',
          titleId: 1,
          type: '禁用词',
          typeId: 0,
          content:
            '根据《理财公司理财产品销售管理暂行办法（银保监会令[2021]4号》，理财产品销售机构不得使用未说明选择原因、测算依据或计算方法的业绩比较基准1。',
          isTop: true,
          updateTime: '2021-08-11',
          useFrequency: 110
        },
        {
          id: 1,
          title: '比较基准',
          titleId: 2,
          type: '敏感词',
          typeId: 1,
          content:
            '根据《理财公司理财产品销售管理暂行办法（银保监会令[2021]4号》，理财产品销售机构不得使用未说明选择原因、测算依据或计算方法的业绩比较基准2。',
          isTop: true,
          updateTime: '2021-08-11',
          useFrequency: 110
        },
        {
          id: 2,
          title: '比较基准',
          titleId: 3,
          type: '禁用词',
          typeId: 0,
          content:
            '根据《理财公司理财产品销售管理暂行办法（银保监会令[2021]4号》，理财产品销售机构不得使用未说明选择原因、测算依据或计算方法的业绩比较基准3。',
          isTop: false,
          updateTime: '2021-08-11',
          useFrequency: 110
        },
        {
          id: 3,
          title: '比较基准',
          titleId: 4,
          type: '敏感词',
          typeId: 1,
          content:
            '根据《理财公司理财产品销售管理暂行办法（银保监会令[2021]4号》，理财产品销售机构不得使用未说明选择原因、测算依据或计算方法的业绩比较基准4。',
          isTop: false,
          updateTime: '2021-08-11',
          useFrequency: 110
        }
      ],
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
      searchListFilter: [],
      currentSort: true,
      referSort: true,
      updateSort: true,
      searchDialogIndex: 1
    };
  },
  created() {
    this.initData();
  },
  directives: {
    scrollLoad: {
      bind(el, binding, vnode) {
        var that = this;
        let wrapDom = el.querySelector('.el-autocomplete-suggestion__wrap');
        let listDom = el.querySelector(
          '.el-autocomplete-suggestion__wrap  .el-autocomplete-suggestion__list'
        );
        wrapDom.addEventListener(
          'scroll',
          e => {
            let condition = wrapDom.offsetHeight + wrapDom.scrollTop - listDom.offsetHeight - 20;
            // console.log(condition,vnode);
            if (condition == 0) {
              //滚动到底部则执行滚动方法load，binding.value就是v-scrollLoad绑定的值，加()表示执行绑定的方法
              binding.value();
            }
          },
          false
        );
      }
    }
  },
  methods: {
    initData() {
      this.isLoading = true;
      const pageData = {
        keywordContent: this.search.baseline,
        opinionContent: this.search.review,
        orderType: this.currentSort ? (this.referSort ? 1 : 2) : this.updateSort ? 3 : 4,
        pageNow: this.page.pageNow,
        pageSize: this.page.pageSize
      };
      console.log(pageData);
      getPageList(pageData).then(({ totalCount, list }) => {
        this.page.total = totalCount;
        this.isLoading = false;
        this.data = list;
      });
      const data = {
        code: '0',
        content: [
          { value: 'M107NEC2E98BE9C95', id: 0, typeId: 0, type: '禁用词' },
          { value: '456王子沛123', id: 1, typeId: 0, type: '禁用词' },
          { value: 'M107W01decce91b7b810c', id: 2, typeId: 0, type: '禁用词' },
          { value: 'M107N000822B49FFB', id: 3, typeId: 1, type: '敏感词' },
          { value: 'M107W512780e6ef2a40d7', id: 4, typeId: 0, type: '禁用词' },
          { value: 'M107N0008229CA2FB', id: 5, typeId: 0, type: '禁用词' },
          { value: 'M107NEC2E98BEAE31', id: 6, typeId: 0, type: '禁用词' },
          { value: 'M107Ne1acff34c9b13a88', id: 7, typeId: 0, type: '禁用词' },
          { value: '比较基准', id: 8, typeId: 0, type: '禁用词' },
          { value: 'M107NC0847D2C5A72', id: 9, typeId: 0, type: '禁用词' }
        ],
        message: '获取成功'
      };
      data.content.forEach(({ value, id: label, typeId, type }) => {
        let obj = {
          label,
          value,
          typeId,
          type,
          showItem: value
        };
        this.deviceIdList.push(obj);
        this.deviceIdListFilter.push(obj);
        this.searchList.push(obj);
        this.searchListFilter.push(obj);
      });
    },
    onSearch() {
      console.log(this.search);
      this.initData();
      this.changeStyle('none', '.el-autocomplete-suggestion');
    },
    load(e) {
      this.searchDialogIndex += 1;
      this.$refs.autocomplete.activated = true;
      this.$refs.autocomplete.getData(this.search.baseline);
      // if (this.suppilerListTotal < this.suppilerListQuery.pageSize) {
      //   return false;
      // }
      // this.loading = true;
      // this.suppilerListQuery.pageSize += 10;
      //XXX -滚动到底部后请求的列表
      // XXX(this.suppilerListQuery, this.state2).then(res => {
      //   this.suppilerListTotal = res.data.total;
      //   this.$refs['autocomplete'].$data.suggestions = res.data.records;
      //   this.loading = false;
      // });
      console.log(e);
    },
    handleSearchBlur(flag) {
      console.log(flag);
    },
    //根据传进来的状态改变建议输入框的状态（展开|隐藏）
    changeStyle(status, className) {
      let dom = document.querySelectorAll(className);
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
    sortChange({ column, prop, order }) {
      console.log(column, prop, order);
    },
    handleLabelType(id) {
      this.dialogItem.typeId = id;
    },
    handleClick(row) {
      this.titleDialog = row ? '编辑意见' : '新建意见';
      this.limitTimeVisible = true;
      this.dialogItem = row ? { ...row } : { typeId: 0 };
      console.log(row);
      row && this.dataFilter(row.title);
    },
    submitEdit(row) {
      console.log(row);
    },
    // 停用
    stopApllay(item) {
      console.log(item);
      this.limitVisible = true;
    },
    handleCurrentChange(val) {
      this.page.pageNow = val;
      this.initData();
    },
    handleSubmitLimitTime() {
      const { typeId, useFrequency } = this.dialogItem;
      console.log(typeId, useFrequency);
    },

    // 自定义筛选方法
    dataFilter(val) {
      console.log(val);
      if (val) {
        let filterResult = [];
        let originalData = JSON.parse(JSON.stringify(this.deviceIdListFilter));
        originalData.filter(item => {
          if (item.value.includes(val) || item.value.toUpperCase().includes(val.toUpperCase())) {
            filterResult.push(item);
          }
        });
        this.setHighlight(filterResult, val); // 匹配文字高亮显示
      } else {
        this.deviceIdList = this.deviceIdListFilter;
      }
    },
    // 设置文字高亮
    setHighlight(arr, keyword) {
      if (arr && arr.length > 0 && keyword) {
        this.deviceIdList = [];
        arr.filter(item => {
          let reg = new RegExp(keyword, 'gi');
          const res = reg.exec(item.value);
          if (res) {
            let replaceString = `<span style="color:#2D5CF6;">${res[0]}</span>`;
            item.showItem = item.value.replace(res, replaceString);
            this.deviceIdList.push(item);
          }
        });
      } else {
        this.deviceIdList = [];
      }
    },
    // 当下拉框出现时触发
    visibleHideSelectInput(val) {
      if (val) {
        this.deviceIdList = JSON.parse(JSON.stringify(this.deviceIdListFilter));
      }
    },
    querySearch(val, cb) {
      console.log(val,this.searchDialogIndex);
      // let searchList = JSON.parse(JSON.stringify(this.searchList));
      let searchList = this.searchList
      this.searchList.push(this.searchList[0])
      // let results = val
      //   ? searchList.filter(
      //       item => item.value.includes(val) || item.value.toUpperCase().includes(val.toUpperCase())
      //     )
      //   : searchList;
      let results =[...searchList,searchList[0]]
      console.log(results);
      this.setHighlight(results, val);
      // 调用 callback 返回建议列表的数据
        cb(results);
    },
    handleSelect(val) {
      this.initData();
    },
    // 复制
    handleCopy(val) {
      copyText(
        val,
        msg => {
          this.$message.success(msg);
        },
        err => {
          console.log(err);
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
    padding: 24px 0;
    & > .info {
      display: flex;
      justify-content: space-between;
      margin-left: 16px;
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
      &-right {
        .right-option {
        }
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
    font-weight: 700;
    color: #fa8c16;
  }
  .class-zero {
    padding: 4px 12px;
    background: #fff1f0;
    border-radius: 4px;
    font-weight: 700;

    color: #eb5757;
  }

  /deep/ .el-input__inner {
    border: 0;
    background: #f7f8fa;
    color: #1d2128;
  }
}
/deep/.el-select-dropdown {
  left: 459px;
}
.option-info {
  display: flex;
  justify-content: space-between;
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
    text-align: center;
  }
}
</style>