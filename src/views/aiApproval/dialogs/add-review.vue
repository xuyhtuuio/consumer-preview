<template>
    <el-dialog :visible.sync="addReviewDialog" :show-close="showClose" width="800px" :before-close="handleClose" center
        custom-class="add-review">
        <div class="add-review-content">
            <p class="option-heading mb12">请选择</p>
            <p style="margin-bottom: 16px;">
                <span :class="['stop-word pointer', params.type == 1 ? 'active-stop-word' : '']"
                    @click="() => { params.type = 1 }">禁用词</span>
                <span :class="['sensitive-word pointer', params.type == 2 ? 'active-sensitive-word' : '']"
                    @click="() => { params.type = 2 }">敏感词</span>
            </p>
            <p class="option-heading mb12">审查话术</p>
            <p class="mb12"><span
                    :class="params.type == 1 ? 'stop-word active-stop-word' : 'sensitive-word active-sensitive-word'">{{
                        params.keywords }}</span></p>
            <el-input type="textarea" placeholder="请输入审查话术内容" v-model="params.content" resize="none"></el-input>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="handleClose">取 消</el-button>
            <el-button type="primary" @click="addRecommend"> 确 定</el-button>
        </span>
    </el-dialog>
</template>
<script>
export default {
    name: 'addReviewDialog',
    data() {
        return {
            addReviewDialog: false,
            showClose: false,
            params: {
                keywords: '',
                type: '',
                content: ''
            }
        }
    },
    methods: {
        init(word) {
            this.addReviewDialog = true;
            this.params.keywords = word;
            this.params.type = 1
            this.params.content = ''
        },
        handleClose() {
            this.addReviewDialog = false;
        },
        addRecommend() {
            const newId = Date.parse(new Date());
            this.$emit('addRecommend', {
                word: this.params.keywords,
                wordType: this.params.type,
                id: this.params.keywords,
                totalPage: 1,
                pageNow: 1,
                list: [{
                    str: this.params.content,
                    id: newId
                }],
                selected: newId
            }, this.params.keywords, newId)
            this.handleClose();
        }
    }
}
</script>
<style lang="less" scoped>
/deep/.add-review {
    border-radius: 10px;
    background: #FFF;
    padding: 40px 60px;
    height: 520px;

    .mb12 {
        margin-bottom: 12px;
    }

    .el-dialog__header,
    .el-dialog__body {
        padding: 0;
    }

    &-content {
        .option-heading {
            color: #333;
            text-align: left;
            font-size: 14px;
            font-style: normal;
            font-weight: 700;
            line-height: 22px;
            /* 157.143% */
        }
    }

    .stop-word {
        padding: 8px 20px;
        display: inline-block;
        color: #EB5D78;
        font-size: 12px;
        font-style: normal;
        font-weight: 700;
        line-height: 24px;
        border-radius: 4px;
        background: #F7F8FA;
        margin-right: 10px;


    }

    .sensitive-word {
        padding: 8px 20px;
        display: inline-block;
        border-radius: 4px;
        background: #F7F8FA;
        color: #FDB123;
        font-size: 12px;
        font-style: normal;
        font-weight: 700;
        line-height: 24px;
        /* 200% */
    }

    .active-stop-word {
        border-radius: 4px;
        background: #FDF1F4;

    }

    .active-sensitive-word {
        border-radius: 4px;
        background: #FFF7E6;

    }

    .el-textarea {
        .el-textarea__inner {
            height: 180px;
            padding: 12px;
        }
    }

    .el-dialog__footer {
        margin-top: 36px;
        padding-bottom: 0;
    }

    input,
    select,
    option,
    .el-textarea__inner {
        outline: none !important;
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
            color: #1D2128;
            border-radius: 4px;
            border: 1px solid #CACDD3;
        }

        .el-button--primary {
            border-radius: 4px;
            background: #2D5CF6;
            color: #FFF;
            margin-left: 10px;

        }
    }
}
</style>