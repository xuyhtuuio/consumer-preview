<template>
  <div>
    <TrsTable
      theme="TRS-table-gray"
      :data="recordList"
      :colConfig="colConfig"
      @sort-change="sortChange"
      @submitEdit="submitEdit"
      @rowDragSort="rowDragSort"
    >
      <template #fileName="scope">
        <div class="short hover" @click="openFilePreview(scope.row.fileUrl)">
          {{ scope.row.fileName }}
        </div>
      </template>
      <template #fullname="scope">
        <div>
          {{ scope.row.fullname }}
        </div>
        <div class="people-id">工号: {{ scope.row.userId }}</div>
      </template>
      <template #createTime="scope">
        <div class="short">
          {{ timeFormat(scope.row.createTime) }}
        </div>
      </template>

      <template #recheckCount="scope">
        <div class="center">
          {{ scope.row.recheckCount }}
          <span style="font-size: 12px">次</span>
          <img
            src="../../../assets/image/notice.png"
            alt=""
            style="width: 16px; height: 16px; cursor: pointer"
            @click="handleOpenRecord(scope.row.ocrId, scope.row.recheckCount)"
          />
        </div>
      </template>
      <template #feedBack="scope">
        <div class="short" @click="handleOpenOption(scope.row.feedBack)">
          {{ scope.row.feedBack }}
        </div>
      </template>

      <template #isPass="scope">
        <div>{{ scope.row.isPass === 1 ? '是' : '否' }}</div>
      </template>

      <template #formCategory="scope">
        <div class="center">{{ scope.row.formCategory }}</div>
      </template>
      <template #org="scope">
        <div class="center">{{ scope.row.org }}</div>
      </template>
    </TrsTable>
  </div>
</template>
<script>
import * as dayjs from 'dayjs'

export default {
  name: 'TestTrsTable',
  props: {
    recordList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      search: '',
      colConfig: [
        {
          label: '序号',
          prop: '',
          bind: {
            align: 'center',
            type: 'index',
            width: 70,
            index: function indexMethod(index) {
              return index + 1
            }
          }
        },
        {
          label: '回检文件名称',
          header: 'fileHeader',
          prop: 'fileName',
          bind: {
            align: 'center',
            width: 140
          }
        },
        {
          label: '回检人员',
          prop: 'fullname',
          header: 'people-header',
          bind: {
            align: 'center',
            width: 150
          }
        },
        {
          label: '回检时间',
          prop: 'createTime',
          bind: {
            align: 'center',
            width: 110
          }
        },
        {
          label: '是否符合要求',
          prop: 'isPass',
          bind: {
            align: 'center',
            width: 120
          }
        },
        {
          label: '事项类型',
          prop: 'formCategory',
          bind: {
            align: 'center',
            width: 120
          }
        },
        {
          label: '文件所在部门',
          prop: 'org',
          bind: {
            align: 'center',
            width: 150
          }
        },
        {
          label: '回检次数',
          prop: 'recheckCount',
          bind: {
            align: 'center'
          }
        },
        {
          label: '回检意见',
          prop: 'feedBack',
          bind: {
            align: 'center',
            width: 280
          }
        }
      ],
      dataList: []
    }
  },
  methods: {
    sortChange() {},
    handleClick() {},
    submitEdit() {},
    rowDragSort() {},
    handleOpenOption(option) {
      this.$emit('openOption', option)
    },
    handleOpenRecord(ocrId, recheckCount) {
      this.$emit('openRecord', ocrId, recheckCount)
    },
    openFilePreview(fileUrl) {
      this.$emit('openFilePreview', fileUrl)
    },
    timeFormat(val) {
      return val ? dayjs(val).format('YYYY-MM-DD ') : '--'
    }
  },
  created() {
    this.dataList = this.recordList
  },
  mounted() {}
}
</script>

<style lang="less" scoped>
.short {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.people-id {
  color: var(--gray-gray-8, #505968);
  font-size: 12px;
  line-height: 20px;
}

.center {
  display: flex;
  align-items: center;
  justify-content: center;
}

.left {
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  flex-direction: column;
}

.hover {
  &:hover {
    cursor: pointer;
    color: var(--unnamed, #2d5cf6);
  }
}
</style>
