<template>
  <div class="label">
    <div class="top">
      <div class="search">
        <el-form class="my-form form" :inline="true" :model="search">
          <el-form-item class="form-item" label="标签类型">
            <el-select v-model="search.type" placeholder="请选择标签类型">
              <el-option
                v-for="item in types"
                :key="item.id"
                :label="item.value"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item class="form-item">
            <el-input
              suffix-icon="el-icon-search"
              v-model="search.user1"
              placeholder="请输入标签名称进行搜索"
            ></el-input>
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
    <div class="main">
      <TrsTable
        theme="TRS-table-gray"
        :data="data"
        :colConfig="colConfig"
        @sort-change="sortChange"
        @submitEdit="submitEdit"
        :header-cell-style="{ 'text-align': 'center' }"
        :cell-style="{ 'text-align': 'center' }"
      >
        <template #type="{ row }">
          <span :class="[row.typeId === 0 ? 'class-zero' : 'class-one']">{{ row.type }}</span>
        </template>
        <template #operate="scope">
          <el-button type="text" size="small" @click="handleClick(scope.row)"> 编辑</el-button>
          <el-button type="text" size="small">恢复</el-button>
          <el-button type="text" class="red" @click="stopApllay(scope.row)">停用</el-button>
        </template>
      </TrsTable>
      <TrsPagination
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
            item.id !== dialogItem.typeId ? 'class-com' : '',
            item.id === 0 ? ' class-zero' : ' class-one'
          ]"
          @click="handleLabelType(item.id)"
          >{{ item.value }}</span
        >
      </div>
      <div class="dialog-item">
        <g-table-card :title="dialogTitle">
          <template #content>
            <el-input v-model="dialogItem.useFrequency"></el-input>
          </template>
        </g-table-card>
      </div>
      <div slot="footer" class="dialog-footer">
        <g-button @click="limitTimeVisible = false">取 消</g-button>
        <g-button type="primary" @click="handleSubmitLimitTime">确 定</g-button>
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
        <div class="info">停用后提交的工单将不会对该关键词进行风险提示， 确定停用此标签吗？</div>
      </div>
      <div slot="footer" class="dialog-footer">
        <g-button @click="limitVisible = false">取 消</g-button>
        <g-button class="stop" type="primary" @click="handleSubmitLimitTime">停用</g-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'UserManage',
  data() {
    return {
      search: {
        type: ''
      },
      types: [
        { id: 0, value: '禁用词' },
        { id: 1, value: '敏感词' }
      ],
      limitTimeVisible: false,
      limitVisible: false,
      data: [
        {
          label: '比较基准',
          type: '禁用词',
          typeId: 0,
          useFrequency: '110'
        },
        {
          label: '比较基准',
          type: '敏感词',
          typeId: 1,
          useFrequency: '财富运营团队'
        }
      ],
      colConfig: [
        {
          label: '标签',
          prop: 'label'
        },
        {
          label: '标签类型',
          prop: 'type'
        },
        {
          label: '使用频率',
          prop: 'useFrequency',
          bind: {
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
        total: 3
      },
      titleDialog: '新建标签',
      dialogTitle: '标签名称',
      dialogRadio: '',
      dialogRadioItem: [
        { label: 0, value: '超级管理员' },
        { label: 1, value: '超级管理员' },
        { label: 2, value: '总行' },
        { label: 3, value: '超级管理员' },
        { label: 4, value: '总行' }
      ],
      dialogItem: []
    };
  },
  created() {},
  methods: {
    sortChange({ column, prop, order }) {
      console.log(column, prop, order);
    },
    handleLabelType(id) {
      this.dialogItem.typeId = id;
    },
    handleClick(row) {
      this.titleDialog = row ? '编辑标签' : '新建标签';
      this.limitTimeVisible = true;
      this.dialogItem = row ? { ...row } : { typeId: 0 };
      console.log(row);
    },
    submitEdit(row) {
      console.log(row);
    },
    // 停用
    stopApllay(item) {
      console.log(item);
      this.limitVisible = true;
    },
    handleCurrentChange() {},
    handleSubmitLimitTime() {
      const { typeId, useFrequency } = this.dialogItem;
      console.log(typeId, useFrequency);
    }
  }
};
</script>
<style lang="less" scoped>
@color1: #1d2128;
.label {
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
    padding: 24px 0;
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

  /deep/ .el-input__inner {
    border: 0;
    background: #f7f8fa;
    color: #1d2128;
  }
}

</style>