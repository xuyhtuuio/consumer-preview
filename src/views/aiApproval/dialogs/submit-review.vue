<template>
    <el-dialog :visible.sync="submitReviewDialog" :show-close="showClose" width="800px" :before-close="handleClose" center
        custom-class="submit-review">

        <div slot="title">
            <div class="top-op">
                <span class="flex">
                    <i class="iconfont icon icon-shenpixinxi"></i>
                    <i class="title">提交审查意见</i>
                </span>
                <div>
                    <el-button @click="addFileDialog = false">取 消</el-button>
                    <el-button type="primary" @click="addFileDialog = false"> 确 定</el-button>
                </div>

            </div>

        </div>
        <div>
            <p class="choose-new">请选择是否为“三新”
                <el-radio-group v-model="params.isNew">
                    <el-radio :label="item.id" v-for="item in checklist" :key="item.id">
                        {{ item.name }}

                    </el-radio>

                </el-radio-group>
            </p>
            <div class="line"></div>
        </div>
    </el-dialog>
</template>
<script>
export default {
    data() {
        return {
            showClose: false,
            submitReviewDialog: false,
            checklist: [
                { name: '新产品', id: '1' },
                { name: '新制度', id: '2' },
                { name: '新服务', id: '3' },

            ],
            params: {
                isNew: '3'
            }

        }
    },
    methods: {
        handleClose() {
            this.submitReviewDialog = false
        }
    }
}
</script>
<style lang="less" scoped>
/deep/ .submit-review {
    width: 1200px;
    height: 682px;
    padding: 40px 60px;
    border-radius: 15px;
    background: #FFF;

    .el-dialog__header {
        padding: 0;

        .top-op {
            display: flex;
            justify-content: space-between;

        }

        .flex {
            display: flex;
            align-items: center;

            .title {
                color: #1D2128;
                font-size: 16px;
                font-style: normal;
                font-weight: 700;
                line-height: 36px;
                /* 150% */

            }
        }

        .icon {
            font-size: 34px;
            color: #80A6FF;
            margin-right: 8px;
        }
    }

    .el-dialog__body {

        padding: 0;

        .choose-new {
            color: #1D2128;
            font-size: 14px;
            font-style: normal;
            font-weight: 400;
            line-height: 22px;
            /* 157.143% */

        }

        .el-radio-group {
            border-radius: 4px;
            background: #F7F8FA;
            padding: 8px 16px;
            margin-left: 8px;

            .el-radio__label {
                color: #1D2128;
                text-overflow: ellipsis;
                font-size: 14px;
                font-style: normal;
                font-weight: 400;
                line-height: 22px;
                /* 157.143% */

            }

        }

        .line {
            
            width: 100%;
            height: 1px;
            background: #E5E6EB;
            margin: 12px 0;
        }
    }

}
</style>