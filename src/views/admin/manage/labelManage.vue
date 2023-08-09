<template>
  <div class="label">
    <div class="top">
      <div class="search">
        <el-form class="my-form form" :inline="true" :model="search">
          <el-form-item class="form-item" label="标签类型">
            <el-select
              v-model="search.type"
              placeholder="请选择标签类型"
              @change="(val)=>getList()"
              clearable
            >
              <el-option
                v-for="item in types"
                :key="item.id"
                :label="item.value"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item class="form-item">
            <el-autocomplete
              ref="autocomplete"
              v-model="search.keyword"
              placeholder="请输入标签名称进行搜索"
              :fetch-suggestions="querySearch"
              :trigger-on-focus="false"
              @select="handleSelect"
              @keyup.enter.native="getList(1)"
              clearable
              @clear="getList(1)"
            >
              <i slot="suffix" class="el-icon-search el-input__icon" @click="getList(1)"> </i>
              <template slot-scope="{ item }">
                <div class="option-info">
                  <span class="left" v-html="item.keywordContent"></span>
                  <span :class="['right', item.type === 1 ? 'right-zero' : 'right-one']">{{
                    item.type === 1 ? '禁用词' : '敏感词'
                  }}</span>
                </div>
              </template>
            </el-autocomplete>
          </el-form-item>

          <el-form-item class="form-item">
            <g-button class="g-btn" type="primary" @click="handleClick">
              <i class="iconfont icon-a-tubiaotianjiabiaoqian"></i>
              添加标签</g-button
            >
            <g-button class="g-btn" type="primary">
              <i class="iconfont icon-a-tubiaodaochu"></i>
              导出</g-button
            >
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="main" v-loading="loading">
      <TrsTable
        theme="TRS-table-gray"
        :data="data"
        :colConfig="colConfig"
        @sort-change="sortChange"
        @submitEdit="submitEdit"
        :header-cell-style="{ 'text-align': 'center' }"
        :cell-style="{ 'text-align': 'center' }"
      >
      <template #keywordContent="{ row }">
        <div style="text-align:left">{{row.keywordContent}}</div>
      </template>
        <template #type="{ row }">
          <span :class="[row.type === 1 ? 'class-zero' : 'class-one']">{{
            row.type === 1 ? '禁用词' : '敏感词'
          }}</span>
        </template>
        <template #operate="scope">
          <el-button type="text" size="small" @click="handleClick(scope.row)"> 编辑</el-button>
          <el-button
            type="text"
            size="small"
            v-if="scope.row.status === 0"
            @click="handleSubmitLimitTime(scope.row)"
            >恢复</el-button
          >
          <el-button type="text" class="red" @click="stopApllay(scope.row)" v-else>停用</el-button>
        </template>
      </TrsTable>
      <TrsPagination
        :pageSize="10"
        :pageNow="page.pageNow"
        :total="page.total"
        @getList="val => getList(val)"
        scrollType="scrollCom"
        scrollName="scrollCom"
        v-if="page.total"
      >
      </TrsPagination>
    </div>
    <!-- 编辑或新增 标签 -->
    <el-dialog
      class="trs-pagination"
      :visible.sync="limitTimeVisible"
      width="600px"
      custom-class="user-dialog"
      :show-close="false"
      center
    >
      <template slot="title">
        <span>{{ titleDialog }}</span>
        <span class="close" @click="limitTimeVisible = false"><i class="el-icon-close"></i></span>
      </template>
      <div class="label">
        标签类型
        <span
          v-for="item in types"
          :key="item.id"
          :class="[
            'class-common',
            item.id !== dialogItem.type ? 'class-com' : '',
            item.id === 1 ? ' class-zero' : ' class-one'
          ]"
          @click="handleLabelType(item.id)"
          >{{ item.value }}</span
        >
      </div>
      <div class="dialog-item">
        <g-table-card :title="dialogTitle">
          <template #content>
            <el-input v-model="dialogItem.keywordContent"></el-input>
          </template>
        </g-table-card>
      </div>
      <div slot="footer" class="dialog-footer">
        <g-button @click="limitTimeVisible = false">取 消</g-button>
        <g-button type="primary" @click="editKeyWord">确 定</g-button>
      </div>
    </el-dialog>
    <!-- 停用二次确认 -->
    <secondary-confirmation
      :option="confirmOption"
      ref="confirmation"
      @handleConfirm="handleSubmitLimitTime(dialogItem)"
    ></secondary-confirmation>
  </div>
</template>
<script>
import { getList, edit, add } from '@/api/admin-label.js';
import secondaryConfirmation from '@/components/common/secondaryConfirmation';
export default {
  name: 'labelManage',
  components: { secondaryConfirmation },
  data() {
    return {
      search: {
        type: '',
        keyword: ''
      },
      confirmOption: {
        message: '停用后提交的工单将不会对该关键词进行风险提示， 确定停用此标签吗？',
        cancelBtn: '取消',
        confirmBtn: '停用'
      },
      types: [
        { id: 1, value: '禁用词' },
        { id: 2, value: '敏感词' }
      ],
      limitTimeVisible: false,
      limitVisible: false,
      loading: false,
      data: [],
      colConfig: [
        {
          label: '标签',
          prop: 'keywordContent'
        },
        {
          label: '标签类型',
          prop: 'type',
          bind: {
            width: 250
          }
        },
        {
          label: '使用频率',
          prop: 'count',
          bind: {
            width: 250,
            align: 'center',
            sortable: 'custom'
          }
        },
        {
          label: '操作',
          prop: 'operate',
          bind: {
            width: 250,
            align: 'center'
          }
        }
      ],
      page: {
        pageNow: 1,
        total: 1
      },
      titleDialog: '新建标签',
      dialogTitle: '标签名称',
      dialogItem: []
    };
  },
  created() {
    this.getList();
  },
  methods: {
    handleSelect({keywordContent}) {
      this.search.keyword = keywordContent
      this.getList(1);
    },
    async querySearch(queryString, cb) {
      const res = await getList({
        pageNum: 1,
        pageSize: 10,
        isAll: 1,
        type: this.search.type,
        content: queryString
      });
      const { data } = res.data;
      cb(data?.list || []);
    },
    async getList(pageNow) {
      this.loading = true;
      const pageNum = pageNow || 1;
      const res = await getList({
        pageNum,
        pageSize: 10,
        isAll: 1,
        type: this.search.type,
        content: this.search.keyword
      });
      const { data, success } = res.data;
      if (success) {
        this.data = data.list;
        this.page.pageNow = pageNum;
        this.page.total = data.totalCount;
      }
      this.loading = false;
    },
    sortChange({ column, prop, order }) {
      // console.log(column, prop, order);
    },
    handleLabelType(id) {
      this.dialogItem.type = id;
    },
    handleClick(row, index) {
      this.titleDialog = row ? '编辑标签' : '新建标签';
      this.limitTimeVisible = true;
      this.dialogItem = row ? { ...row } : { type: 1 };
      this.dialogItem.index = index;
    },
    submitEdit(row) {
      // console.log(row);
    },
    // 停用
    stopApllay(item) {
      // this.limitVisible = true;
      this.$refs.confirmation.dialogVisible = true;
      this.dialogItem = item;
    },
    // 编辑标签
    async editKeyWord() {
      const recordId = this.dialogItem.recordId;
      // const index = this.dialogItem.index;
      const { keywordContent, type } = this.dialogItem;
      let res;
      if (recordId) {
        res = await edit({
          keywordContent,
          recordId,
          type
        });
      } else {
        res = await add({
          keywordContent,
          type
        });
      }
      const { success, msg } = res.data;
      if (success) {
        this.$message.success('操作成功!');
        // if (recordId) {
        //   this.$set(this.data, index, {
        //     ...this.data[index],
        //     ...this.dialogItem
        //   })
        // } else {
        //   this.getList(this.page.pageNow)
        // }
        this.getList(this.page.pageNow);
        this.limitTimeVisible = false;
      } else {
        this.$message.error(msg);
      }
    },
    async handleSubmitLimitTime(item) {
      const { recordId, status } = item;
      const res = await edit({
        status: status === 0 ? 1 : 0,
        recordId
      });
      const { success, msg } = res.data;
      if (success) {
        this.$message.success('操作成功!');
        this.getList(this.page.pageNow);
      } else {
        this.$message.error(msg);
      }
    }
  }
};
</script>
<style lang="less" scoped>
@color1: #1d2128;
.label {
  height: 100%;
  overflow-y: auto;
  .el-icon-search {
    cursor: pointer;
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
    padding: 24px 0 0;
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
    .label {
      margin: 24px 20px 0;
      display: flex;
      align-items: center;
      .class-com {
        background-color: #f7f8fa;
        color: #86909c;
      }
      .class-common {
        margin-left: 12px;

        cursor: pointer;
        &:last-child {
          margin-left: 10px;
        }
      }
    }
    .dialog-item {
      padding: 24px 20px;
      margin-bottom: 78px;
    }
    .dialog-footer {
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

  // /deep/ .el-input__inner {
  //   border: 0;
  //   background: #f7f8fa;
  //   color: #1d2128;
  // }
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

/deep/.pagination {
  // text-align: center;
  .el-input__inner {
    height: 28px;
    line-height: 28px;
  }
}
















</style>