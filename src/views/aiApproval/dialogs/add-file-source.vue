<template>
  <el-dialog :visible.sync="addFileDialog" width="800px" :before-close="handleClose" center custom-class="add-file">
    <div class="add-file-content">
      <el-checkbox-group v-model="selected" class="trs-scroll" ref="scroll">
        <el-checkbox v-for="(item, index) in files" :key="item.fileId" :label="item.id">
          <span class="sort">{{ index + 1 }}.</span>
          <file-type :fileName="item.fileName"></file-type>
          {{ item.fileName }}
        </el-checkbox>
      </el-checkbox-group>
    </div>
    <span slot="title"> 添加文件来源 </span>
    <span slot="footer" class="dialog-footer">
      <el-button @click="addFileDialog = false">取 消</el-button>
      <el-button type="primary" @click="updateSelected"> 确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import FileType from '@/components/common/file-type';
export default {
  name: 'addFileSource',
  components: { FileType },
  props: {
    files: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      addFileDialog: false,
      selected: []
    };
  },
  computed: {
    fileType() {
      return val => {
        return val.split('.')[val.split('.').length - 1]
      }
    },
  },
  methods: {
    init(val) {
      this.addFileDialog = true;
      this.selected = [...val];
      // this.$nextTick(() => {
      //   this.$refs.scroll.scrollTo({
      //     top: 0,
      //   });
      // });
    },
    handleClose() {
      this.addFileDialog = false;
    },
    updateSelected() {
      if (this.selected.length === 0) {
        this.$message.info('请至少选择一个文件来源')
      } else {
        this.$emit('updateFile', this.selected)
        this.addFileDialog = false;
      }
    },
  },
};
</script>
<style scoped lang="less">
/deep/.add-file {
  border-radius: 10px;
  background: #fff;
  padding: 40px 60px;
  height: 520px;

  .mb12 {
    margin-bottom: 12px;
  }

  .el-dialog__header {
    padding: 0;
    color: #434343;
    text-align: center;
    font-size: 20px;
    font-style: normal;
    font-weight: 700;
    line-height: 28px;

    /* 140% */
    .el-dialog__headerbtn {
      font-size: 28px;
      color: #505968;
      top: 34px;
      right: 40px;
    }
  }

  .el-dialog__body {
    padding: 0;
    height: 342px;
    overflow: hidden;
    margin-top: 12px;

    .add-file-content {
      height: 100%;
      display: flex;
      // align-items: center;
      overflow: auto;
      width: 100%;

      .el-checkbox-group {
        display: flex;
        flex-direction: column;
        width: 100%;

        .el-checkbox {
          width: 100%;

          .icon {
            width: 20px;
            height: 20px;
            margin: 0 10px;
          }

          display: flex;
          align-items: center;
          margin-bottom: 8px;
          padding: 8px 12px;

          .el-checkbox__label {
            margin-left: 10px;

            color: #505968;

            font-size: 14px;
            font-style: normal;
            font-weight: 400;
            line-height: 22px;
            display: flex;
            align-items: center;
          }

          .el-checkbox__inner {
            width: 20px;
            height: 20px;

            .el-checkbox__label {
              width: 20px;
              height: 20px;
            }
          }
        }

        .el-checkbox:hover {
          border-radius: 4px;
          background: #f7f8fa;
        }
      }
    }
  }

  .el-dialog__footer {
    margin-top: 36px;
    padding-bottom: 0;
  }

  .dialog-footer {
    .el-button {
      padding: 8px 40px;
      border-radius: 4px;
      font-size: 14px;
      font-weight: 400;
      line-height: 22px;
    }

    .el-button--default {
      color: #1d2128;
      border-radius: 4px;
      border: 1px solid #cacdd3;
    }

    .el-button--primary {
      border-radius: 4px;
      background: #2d5cf6;
      color: #fff;
      margin-left: 10px;
    }
  }
}
</style>
