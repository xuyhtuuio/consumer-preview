<template>
    <el-dialog :visible.sync="submitReviewDialog" :show-close="showClose" width="1200px" :before-close="handleClose" center
        custom-class="submit-review">
        <div slot="title">
            <div class="top-op">
                <span class="flex">
                    <i class="iconfont icon icon-shenpixinxi"></i>
                    <i class="title">提交审查意见</i>
                </span>
                <div>
                    <el-button @click="handleClose">取消</el-button>
                    <el-button type="primary" @click="submit"> 提交</el-button>
                </div>
            </div>
        </div>
        <div>
            <el-form v-if="false" :model="params" ref="paramsForm" label-width="86px" label-position="left" :rules="rules">
                <el-form-item label="请选择">
                    <el-radio-group v-model="params.isPasses">
                        <el-radio :label="item.id" v-for="item in passlist" :key="item.id">
                            {{ item.name }}
                        </el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="产品要点" prop="productEssentials">
                    <el-checkbox-group v-model="params.productEssentials">
                        <div class="floor1">
                            <el-checkbox :label="item.value" v-for="item in productEssentialList.slice(0, 2)"
                                :key="item.value" :value="item.value">
                                {{ item.label }}
                            </el-checkbox>
                        </div>
                        <div class="floor2 reviewPoints">
                            <el-checkbox :label="item.value" v-for="item in productEssentialList.slice(2, 5)"
                                :key="item.value" :value="item.value">
                                {{ item.label }}
                            </el-checkbox>
                        </div>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="审查要点" prop="reviewPoints" class="reviewPoints">
                    <el-checkbox-group v-model="params.reviewPoints">
                        <el-checkbox :label="item.value" v-for="item in reviewPoints" :key="item.value" :value="item.value">
                            {{ item.label }}
                        </el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
            </el-form>
            <div class="line"></div>
            <p class="title">消保审查意见书</p>
            <div class="submission-content" v-if="submission.length">
                <p class="submission-name">
                    拟同意{{ params.submissionName }}活动，并提出以下消保审查意见：

                </p>
                <div class="submission-list">
                    <div class="submission-item" v-for="(item, index) in submission" :key="index" @mouseleave="mouseleave"
                        @mouseenter="mouseenter(item, index)">
                        <div class="submission-text">
                            <span class="sort">{{ index + 1 }}.</span> <span>{{ item.str }}</span>
                        </div>
                        <div class="submission-op">
                            <!-- <i>无实质意见</i> -->
                            <span v-if="item.opinion" class="opinion has-opinion" @click="item.opinion = !item.opinion">
                                <i class="iconfont icon icon-guanzhu"></i>
                                有实质意见
                            </span>
                            <span v-if="!item.opinion" class="opinion no-opinion" @click="item.opinion = !item.opinion">
                                <i class="iconfont icon icon-guanzhu2"></i>
                                无实质意见
                            </span>
                            <span style="width:20px;"> <i class="el-icon-top move" v-if="index !== 0 && mousePoint == index"
                                    @click="moveTop(index)"></i></span>
                            <span style="width:20px;"><i class="el-icon-bottom move"
                                    v-if="index !== submission.length - 1 && mousePoint == index"
                                    @click='moveDown(index)'></i></span>
                            <span style="width:20px;">
                                <i class="iconfont icon  icon-xianxingtubiao-1 del" @click="del(item, index)"></i></span>
                        </div>
                    </div>
                </div>
                <p class="submission-name">
                    以上为{{ params.organization }}建议，请酌情考虑。
                </p>
                <p class="organization">
                    <span>消保审查中心</span><br />
                    <span>2021-09-08 12：20：30</span>
                </p>
            </div>
            <div v-else class="nodata">
                <img src="@/assets/image/ai-approval/nodata.svg" alt="" class="暂无推荐的意见">
                <p>未提出相关意见内容</p>
            </div>
        </div>
        <secondary-confirmation :option="saveOption" ref="confirmation"
            @handleConfirm="() => { submitReviewDialog = false }"></secondary-confirmation>
    </el-dialog>
</template>
<script>
import {
    ocrApprovalSubmission
} from "@/api/aiApproval";
import secondaryConfirmation from "@/components/common/secondaryConfirmation"
export default {
    components: { secondaryConfirmation },
    props: {
        formId: {
            type: String,
            default: ''
        },
    },
    data() {
        return {
            saveOption: {
                message: '关闭提交弹窗将不保存已修改内容，确定关闭？',
                cancelBtn: '取消',
                confirmBtn: '关闭',
            },
            showClose: false,
            submitReviewDialog: false,
            passlist: [
                { name: '通过', id: '1' },
                { name: '不通过', id: '2' },
            ],
            productEssentialList: [
                { label: '产品基本信息：起购金额、起购时间、销售渠道、年化利率(含历史)、起息方式、投资方式(存款)', value: 1 },
                { label: '免责条款', value: 2 },
                { label: '重要提示(理财有风险、投资需谨慎等）', value: 3 },
                { label: '信息披露：咨询方式、投诉方式等', value: 4 },
                { label: '重要提示(理财有风险、投资需谨慎等）', value: 5 },
            ],
            reviewPoints: [
                { label: '承担义务不得低于宣传所承诺的标准', value: 1 },
                { label: '不得虚假欺诈隐瞒或者误导宣传', value: 2 },
                { label: '资料真实准确、不得隐瞒限制条件', value: 3 },
                { label: '无其他违反消保法律法规的营销行为', value: 4 },
                { label: '不得利用上级审核备案程序误导客户', value: 5 },
                { label: '不得承诺、夸大效果或收益', value: 6 },

            ],
            rules: {
                productEssentials: [
                    { required: true, message: '请选择产品要点', trigger: 'change' },
                ],
                reviewPoints: [
                    { required: true, message: '请选择审查要点', trigger: 'change' },
                ],
            },
            submission: [],
            increasedIds: {}, //须在最后提交时移除的
            mousePoint: -1,
            params: {
                isPasses: '2',
                productEssentials: [],
                reviewPoints: [],
                submissionName: 'xxxxx',
                organization: '消保审查办公室'
            }
        }
    },
    methods: {
        // 提交结果
        submit() {
            // console.log(this.submission, this.increasedIds)
            this.submission.forEach(comment => {
                comment.id = this.increasedIds.strIds.includes(comment.id) ? null : comment.id;
                comment.words = comment.words.filter(id => !this.increasedIds.words.includes(id))
            })
            ocrApprovalSubmission({
                editedCommentsDtoList: this.submission,
                formId: this.formId
            }).then((res) => {
                const { status, message } = res.data;
                if (status === 200) {
                    this.$message.success({ offset: 40, message });
                } else {
                    this.$message.error({ offset: 40, message });
                }
            })
        },
        handleClose() {
            this.$refs.confirmation.dialogVisible = true;
            // this.submitReviewDialog = false
        },
        mouseenter(item, index) {
            this.mousePoint = index
        },
        mouseleave() {
            this.mousePoint = -1
        },
        moveTop(index) {
            const copyCrtValue = this.submission[index]
            const copyUpValue = this.submission[index - 1]
            this.$set(this.submission, index, copyUpValue)
            this.$set(this.submission, index - 1, copyCrtValue)
        },
        moveDown(index) {
            const copyCrtValue = this.submission[index]
            const copyNextValue = this.submission[index + 1]
            this.$set(this.submission, index, copyNextValue)
            this.$set(this.submission, index + 1, copyCrtValue)
        },
        del(item, index) {
            this.$confirm('确定删除该条意见吗？', '', {
                customClass: 'confirmBox',
                confirmButtonText: '删除',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.submission.splice(index, 1)
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });

        }
    }
}
</script>
<style lang="less" scoped>
/deep/ .submit-review {
    width: 1200px;
    max-height: 682px;
    padding: 40px 60px;
    border-radius: 15px;
    background: #FFF;

    .el-dialog__header {
        padding: 0;
        margin-bottom: 16px;

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
        height: 90%;
        overflow: auto;

        .el-form {
            .el-form-item__label {
                color: #1D2128;
                font-size: 14px;
                font-style: normal;
                font-weight: 400;
                // line-height: 22px;
            }

            .el-form-item__label::before {
                display: none;
            }

            .is-required .el-form-item__label::after {
                content: "*";
                color: #F76560;
                margin-left: 5px;
                font-size: 16px; //改变星号的大小
            }

            .el-form-item__content {
                border-radius: 4px;
                background: #F7F8FA;
                padding: 0 16px;
            }

            .reviewPoints {
                .el-checkbox {
                    width: 30%;
                }
            }
        }

        .el-radio-group {
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

        .el-checkbox__label {
            color: #1D2128;
            text-overflow: ellipsis;
            font-size: 14px;
            font-style: normal;
            font-weight: 400;
            line-height: 22px;
        }

        .el-checkbox__inner {
            width: 18px;
            height: 18px;
        }

        .line {
            width: 100%;
            height: 1px;
            background: #E5E6EB;
            margin: 12px 0;
        }

        .title {
            color: #1D2128;
            text-align: center;
            /* 正文/加粗 */
            padding: 16px 0px;
            font-family: Microsoft YaHei;
            font-size: 14px;
            font-style: normal;
            font-weight: 700;
            line-height: 22px;
            /* 157.143% */

        }

        .submission-content {
            padding: 0px 24px;

            .submission-name {
                color: #306EF5;
                font-size: 14px;
                font-style: normal;
                font-weight: 400;
                line-height: 22px;
                /* 157.143% */

            }

            .organization {
                margin-top: 28px;
                color: #1D2128;
                text-align: right;
                font-size: 14px;
                font-style: normal;
                font-weight: 400;
                line-height: 22px;
                /* 157.143% */

            }

            .submission-item:hover {
                border-radius: 4px;
                background: #F7F8FA;
                cursor: pointer;
                padding: 8px 16px;
            }

            .submission-item {
                display: flex;
                padding: 8px 16px;
                cursor: pointer;
                margin: 12px 0;

                .submission-text {
                    width: 80%;
                    display: flex;
                    justify-items: flex-start;

                    .sort {
                        margin-right: 12px;

                    }

                    color: #1D2128;

                    /* 小字号/正文 */
                    font-family: Microsoft YaHei;
                    font-size: 14px;
                    font-style: normal;
                    font-weight: 400;
                    line-height: 22px;
                    margin-right: 4px;
                    /* 157.143% */
                }

                .submission-op {
                    display: flex;
                    align-items: flex-start;
                    flex: 1;
                    justify-content: space-evenly;


                    .opinion {
                        padding: 2px 4px;
                        border-radius: 0px 6px 6px 6px;
                        color: #FFF;
                        font-family: Microsoft YaHei;
                        font-size: 12px;
                        font-style: normal;
                        font-weight: 400;
                        line-height: 20px;
                        /* 166.667% */

                        .icon {
                            width: 16px;
                            height: 16px;
                        }

                    }

                    .no-opinion {
                        border-radius: 0px 6px 6px 6px;
                        background: linear-gradient(90deg, #E85167 0%, #FF8193 100%);


                    }

                    .has-opinion {
                        border-radius: 0px 6px 6px 6px;
                        background: linear-gradient(90deg, #7B61FF 0%, #61A0FF 100%);

                    }

                    .move {
                        font-size: 20px;
                        color: #306EF5;
                    }

                    .del {
                        font-size: 20px;
                        color: #3780F3;
                    }
                }
            }
        }

    }

}

.nodata {
    text-align: center;
    color: #86909C;
    padding: 12px;

    p {
        margin-top: 12px;
        font-size: 14px;
        font-weight: 400;
        line-height: 28px;
    }
}
</style>