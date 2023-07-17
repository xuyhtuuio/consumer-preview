<template>
    <el-dialog :visible.sync="addFileDialog" width="800px" :before-close="handleClose" center custom-class="add-file">
        <div class="add-file-content">
            <el-checkbox-group v-model="params.file" class="trs-scroll" ref="trs-scroll">
                <el-checkbox v-for="(item, index) in fileList" :key="item.fileId" :label="item.fileId">
                    <span class="sort">{{ index + 1 }}.</span>
                    <svg class="icon" aria-hidden="true" v-if="item.type == 'pdf'">
                        <use xlink:href="#icon-mind-mapping"></use>
                    </svg>
                    <svg class="icon" aria-hidden="true" v-if="item.type == 'xls'">
                        <use xlink:href="#icon-mianxingtubiao-1"></use>
                    </svg>
                    <svg class="icon" aria-hidden="true" v-if="item.type == 'doc'">
                        <use xlink:href="#icon-mianxingtubiao-2"></use>
                    </svg>
                    {{ item.fileName }}
                </el-checkbox>
            </el-checkbox-group>
        </div>
        <span slot="title">
            添加文件来源
        </span>

        <span slot="footer" class="dialog-footer">
            <el-button @click="addFileDialog = false">取 消</el-button>
            <el-button type="primary" @click="addFileDialog = false"> 确 定</el-button>
        </span>
    </el-dialog>
</template>
<script>
export default {
    name: 'addFileSource',
    data() {
        return {
            addFileDialog: true,
            fileList: [
                {
                    type: 'pdf',
                    fileName: '附件附件附件1.png',
                    fileId: 1
                },
                {
                    type: 'xls',
                    fileName: '附件附件附2.png',
                    fileId: 2

                },
                {
                    type: 'doc',
                    fileName: '附件附件附3.png',
                    fileId: 3
                },
                {
                    type: 'pdf',
                    fileName: '附件附件附3.png',
                    fileId: 36
                }, {
                    type: 'pdf',
                    fileName: '附件附件附3.png',
                    fileId: 35
                }, {
                    type: 'pdf',
                    fileName: '附件附件附3.png',
                    fileId: 34
                }, {
                    type: 'pdf',
                    fileName: '附件附件附3.png',
                    fileId: 33
                }, {
                    type: 'pdf',
                    fileName: '附件附件附33.png',
                    fileId: 31
                },
                {
                    type: 'pdf',
                    fileName: '附件附件附33.png',
                    fileId: 311
                }, {
                    type: 'pdf',
                    fileName: '附件附件附33.png',
                    fileId: 31123
                }, {
                    type: 'pdf',
                    fileName: '附件附件附33.png',
                    fileId: 3112
                }, {
                    type: 'pdf',
                    fileName: '附件附件附3d3.png',
                    fileId: 31121
                }
            ],
            params: {
                file: []
            }
        }
    },
    methods: {
        init() {
            this.addFileDialog = true
            this.params.file = []
            this.$nextTick(() => {
                this.$refs['trs-scroll'].scrollTo({
                    top: 0,
                })
            })
        },
        handleClose() {
            this.addFileDialog = false
        }
    }
}
</script>
<style scoped lang="less">
/deep/.add-file {
    border-radius: 10px;
    background: #FFF;
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
                        font-size: 20px;
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
                    }
                }

                .el-checkbox:hover {
                    border-radius: 4px;
                    background: #F7F8FA;

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