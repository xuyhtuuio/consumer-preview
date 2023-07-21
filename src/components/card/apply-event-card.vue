<template>
    <div class="apply-event-card">
        <div class="event-info">
            <div class="event-name-status">
                <!-- 加急 -->
                <svg class="icon urgent-icon" aria-hidden="true" v-if="item.urgent == 1">
                    <use xlink:href="#icon-shenpiyemiantubiao"></use>
                </svg>
                <svg class="icon urgent-icon" aria-hidden="true">
                    <use xlink:href="#icon-tongyongtubiao2"></use>
                </svg>
                <span class="event-name">{{ item.name }}</span>
                <span class="event-status">
                    <i v-if="item.status === 1" class="end">
                        <i class="tag end-sign">
                            已结束
                        </i>
                    </i>
                    <i v-if="item.status === 2" class="tag draft">草稿</i>
                    <i v-if="item.status === 3" class="tag has-opinion">待修改>意见确认</i>
                    <i v-if="item.status === 4" class="tag check">待确认>意见确认</i>
                    <i v-if="item.status === 5" class="tag in-approval">审批中>消保中心审批</i>

                    <!-- 有无意见 -->
                    <i v-if="item.status === 1 || item.status === 3 || item.status === 4" class="flex">
                        <i class="tag has-opinion" v-if="item.hasOpinions == 1">
                            <svg class="icon" aria-hidden="true">
                                <use xlink:href="#icon-guanzhu2"></use>
                            </svg>
                            有实质性意见
                        </i>
                        <i class="tag has-opinion" v-if="item.adoptionStatus == 0">
                            <svg class="icon" aria-hidden="true">
                                <use xlink:href="#icon-tubiao2"></use>
                            </svg>
                            不采纳
                        </i>
                        <i class="tag no-opinion" v-else>
                            <svg class="icon" aria-hidden="true">
                                <use xlink:href="#icon-tubiao"></use>
                            </svg>
                            采纳
                        </i>
                    </i>
                    <i v-if="item.status === 5" class="tips">已滞留23小时</i>
                </span>

            </div>
            <div class="event-infos" v-if="item.status !== 5">
                <span class="id">{{ item.id }}</span>
                <span class="sDate date">发起时间：{{ item.releaseTime || '--' }}</span>
                <span class="sDate date">更新时间：{{ item.update_time || '--' }}</span>
                <span class="sDate date">上线时间：{{ item.launchDate || '--' }}</span>
                <el-popover placement="bottom" trigger="click" popper-class="popper-persons">
                    <div>
                        <div v-for="(child, index) in persons" :key="index" class="person-item">
                            <span>{{ child.name }}</span> <span class="reminder">催一下</span>
                        </div>

                    </div>
                    <span slot="reference" class="handler">当前处理人：{{ item.currentAssignee }} <i>+3</i></span>
                </el-popover>

            </div>
            <div class="event-infos error" v-else>
                <svg class="icon urgent-icon" aria-hidden="true">
                    <use xlink:href="#icon-baocuo1"></use>
                </svg>
                文件未上传成功，请检查文件名是否包含特殊符号，并重新提交
            </div>
        </div>
        <div class="right-operation">
            <!-- 123 -->
            <!-- 审批中  -->
            <div v-if="item.status === 5" class="flex">
                <span class="modify icon-op" @click="cancel(item)">
                    <svg class="icon urgent-icon" aria-hidden="true">
                        <use xlink:href="#icon-tubiao1"></use>
                    </svg>
                    撤销
                </span>
                <span class="attention icon-op" @click="() => { reminderDialog = true }">
                    <svg class="icon urgent-icon" aria-hidden="true">
                        <use xlink:href="#icon-guanzhu1"></use>
                    </svg>
                    催单
                </span>
            </div>
            <!-- 待确认 -->
            <div v-if="item.status === 4" class="flex">
                <span class="check icon-op">
                    <span class="iconfont icon icon-tubiao"></span>
                    确认
                </span>

            </div>
            <!-- 待修改 -->
            <div v-if="item.status === 3" class="flex">
                <span class="modify icon-op">
                    <svg class="icon urgent-icon" aria-hidden="true">
                        <use xlink:href="#icon-xianxingtubiao"></use>
                    </svg>
                    修改
                </span>

            </div>
            <!-- 草稿 -->
            <div v-if="item.status === 2" class="flex">
                <span class="modify icon-op">
                    <svg class="icon urgent-icon" aria-hidden="true">
                        <use xlink:href="#icon-xianxingtubiao"></use>
                    </svg>修改
                </span>
                <span class="del icon-op" @click="del(item)">
                    <svg class="icon urgent-icon" aria-hidden="true">
                        <use xlink:href="#icon-xianxingtubiao-1"></use>
                    </svg>删除
                </span>
            </div>
            <!-- 已结束 -->
            <div v-if="item.status !== 2">
                <span class="attention no-attention icon-op" v-if="Math.random() > 0.5" @click="concern(item)">
                    <svg class="icon urgent-icon" aria-hidden="true">
                        <use xlink:href="#icon-tubiao-1"></use>
                    </svg>
                    关注</span>
                <span class="attention has-attention icon-op" v-else @click="concern(item)">
                    <svg class="icon urgent-icon" aria-hidden="true">
                        <use xlink:href="#icon-guanzhu-1"></use>
                    </svg>已关注</span>
            </div>
        </div>
        <!-- 审批浮窗 -->
        <el-dialog :visible.sync="reminderDialog" align="center" custom-class="reminderDialog"
            :before-close="() => { reminderDialog = false }">
            <p slot="title">请选择催单对象</p>
            <div>
                <div v-for="(child, index) in persons" :key="index" class="person-item">
                    <span>{{ child.name }}</span> <span class="reminder">催一下</span>
                </div>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import { concernApplication } from '@/api/applyCenter'
export default {
    props: {
        item: {
            type: Object,
            default: () => { }
        }
    },
    data() {
        return {
            reminderDialog: false,
            allowConcernClick: true,
            persons: [
                { name: '杨晨格/300592/总行/消费者权益保护监督部/消费者权益保护监督部' },
                { name: '杨晨格/300592/总行/消费者权益保护监督部/消费者权益保护监督部' },
                { name: '杨晨格/300592/总行/消费者权益保护监督部/消费者权益保护监督部' }
            ]

        }
    },
    methods: {
        cancel(item) {
            this.$confirm('确定撤销该申请吗？', '', {
                customClass: 'confirmBox',
                confirmButtonText: '撤销',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$emit(quash, item)
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消撤销'
                });
            });
        },
        del(item) {
            this.$confirm('确定删除该草稿吗？', '', {
                customClass: 'confirmBox',
                confirmButtonText: '删除',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$emit(del, item.id)
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },

        concern(item) {
            if (!this.allowConcernClick) return
            const param = {
                recordId: item.id
            }
            this.allowConcernClick = false
            concernApplication(param).then(res => {
                const { data } = res.data
                if (data.status == 200) {
                    if (item.concernId == 1) {
                        this.$message.success('取消关注成功')
                    } else {
                        this.$message.success('关注成功')
                    }
                    item.concernId = item.concernId == 1 ? 0 : 1
                } else {
                    if (item.concernId == 1) {
                        this.$message.error('取消关注失败')
                    } else {
                        this.$message.error('关注失败')
                    }
                }
                this.allowConcernClick = true
            })
        }
    }
}
</script>
<style lang="less" scoped>
.apply-event-card {
    margin: 16px 0;
    padding: 12px 24px 12px 12px;
    border-radius: 8px;
    border: 1px solid #F2F3F5;
    background: #FFF;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;


    .event-info {
        flex: 1;

        .event-name-status {
            margin-bottom: 14px;
            display: flex;
            align-items: center;
        }

        .urgent-icon {
            margin-right: 8px;
            width: 16px;
            height: 16px;
        }

        .event-name {
            color: #1D2128;
            max-width: 50%;
            white-space: nowrap;
            overflow: hidden; //文本超出隐藏
            text-overflow: ellipsis; //文本超出省略号替代

            font-size: 14px;
            font-style: normal;
            font-weight: 700;
            line-height: 22px;
            /* 157.143% */
        }

        .event-status {
            display: flex;

            .tag {
                margin-left: 12px;
                display: inline-block;
                padding: 2px 12px;
                border-radius: 4px;
                font-size: 14px;
                font-style: normal;
                font-weight: 400;
                line-height: 22px;
                display: flex;
                align-items: center;

                .icon {
                    width: 20px;
                    height: 20px;
                    line-height: 22px;
                    margin-right: 4px;
                }
            }

            .draft {
                background: #F0F6FF;
                color: #2D5CF6;
            }

            .end-sign {
                background: #ECFEEC;
                color: #50B142;

            }

            .has-opinion {
                color: #EB5757;
                background: #FFF1F0;
            }

            .no-opinion {
                background: #E7F0FF;
                color: #2D5CF6;

            }

            .check {
                border-radius: 4px;
                background: #E6FFFB;
                color: #0DA5AA;

            }

            .in-approval {
                border-radius: 4px;
                background: #FFF7E6;
                color: #FA8C16;

            }
        }

        .event-infos {
            .id {
                color: #2D5CF6;
                font-size: 14px;
                font-style: normal;
                font-weight: 400;
                line-height: 22px;
                margin-right: 12px;
                /* 157.143% */
            }

            .date:after {
                content: '';
                display: inline-block;
                width: 1px;
                height: 10px;
                background: #E5E6EB;
                margin: 0 12px;

            }

            .sDate {
                color: #86909C;
                font-size: 14px;
                font-style: normal;
                font-weight: 400;
                line-height: 22px;
                /* 157.143% */

            }

            .handler {
                color: #1D2128;
                font-family: Microsoft YaHei;
                font-size: 14px;
                font-style: normal;
                font-weight: 400;
                line-height: 22px;

                /* 157.143% */
                i {
                    color: #2D5CF6;
                }

            }


        }

        .error {
            display: flex;
            align-items: center;
            border-radius: 2px;
            background: #F9F9FB;
            color: #EB5D78;
            font-size: 12px;
            font-style: normal;
            font-weight: 400;
            line-height: 20px;
            padding: 2px 10px;
            margin-top: -3px;
        }

        .tips {
            color: #EB5757;
            margin-left: 12px;
            font-size: 14px;
            font-style: normal;
            font-weight: 400;
            line-height: 30px;
        }
    }

    .right-operation {
        width: 250px;
        display: flex;
        justify-content: flex-end;

        .icon {
            width: 20px;
            height: 20px;
            margin-right: 2px;
        }

        .icon-op {
            // padding: 4px 8px 4px 4px;
            display: flex;
            text-align: center;
            font-size: 14px;
            font-style: normal;
            font-weight: 400;
            line-height: 22px;
            // width: 76px;
            text-align: center;
            justify-content: center;
            padding: 4px 8px 4px 4px;
            margin-right: 16px;
        }

        .icon-op:last-of-type {
            margin-right: 0;
        }

        .attention {
            padding: 4px 8px 4px 4px;
            display: flex;
            color: #2D5CF6;

            /* 157.143% */
        }

        .attention:hover {
            border-radius: 2px;
            background: #E7F0FF;
            padding: 4px 8px 4px 4px;
        }

        .no-attention {
            color: #2D5CF6;
        }

        .has-attention {
            color: #1D2128;
        }

        .modify {
            color: #FFA940;
            font-size: 14px;
            font-style: normal;
            font-weight: 400;
            line-height: 22px;

        }

        .modify:hover {
            border-radius: 2px;
            background: #FFF7E6;
            padding: 4px 8px 4px 4px;

        }

        .del:hover {
            border-radius: 2px;
            background: #FFF1F0;
            padding: 4px 8px 4px 4px;

        }

        .urges:hover {
            border-radius: 2px;
            background: #E7F0FF;
            padding: 4px 8px 4px 4px;

        }

        .check {
            color: #14C9C9;
        }

        .check:hover {
            padding: 4px 8px 4px 4px;
            background: #E6FFFB;
            border-radius: 2px;
        }

        .no-attention,
        .del {
            margin-right: 16px !important;
        }
    }
}

.apply-event-card:hover {
    background: #F7F8FA;

}
</style>
<style lang="less">
.reminderDialog,
.popper-persons {
    padding: 16px;

    .person-item {
        border-radius: 4px;
        background: #F7F8FA;
        padding: 8px 16px;
        margin-bottom: 16px;
        cursor: pointer;
        display: flex;
        justify-content: space-between;

        .reminder {
            color: #306EF5;
            margin-left: 16px;
            font-size: 14px;
            font-style: normal;
            font-weight: 400;
            line-height: 22px;
            /* 157.143% */

        }
    }

    .person-item:last-of-type {
        margin: 0;
    }

    .person-item:hover {
        background: #F2F3F5;
    }
}

.reminderDialog {
    width: 552px;
    padding: 36px;
    box-sizing: content-box;
    border-radius: 10px;

    .el-dialog__header {
        padding: 0;
        color: #1D2128;
        text-align: center;
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 22px;
        margin-bottom: 16px;

        .el-dialog__headerbtn {
            top: 36px;
            right: 36px;
            font-size: 22px;
        }

        /* 157.143% */
    }

    .el-dialog__body {
        padding: 0;
    }

    .person-item {
        width: 552px;
        padding: 8px 16px;

    }

}

.confirmBox {
    width: 500px;

    padding: 0px 0px 24px;
    border-radius: 10px;

    .el-message-box__content {
        height: 160px;

        .el-message-box__container {
            height: 100%;
        }
    }

    .el-message-box__status {
        top: 0;
        left: 50%;
        transform: translateX(-50%);

    }

    .el-message-box__message {
        position: absolute;
        top: 90px;
        left: 50%;
        transform: translateX(-50%);
    }

    .el-message-box__status::before {
        font-size: 54px;
    }

    .el-message-box__btns {
        .el-button--default {
            border-radius: 6px;
            border: 1px solid #CACDD3 !important;
            color: #1D2128;
            text-align: center;
            font-size: 14px;
            font-style: normal;
            font-weight: 400;
            line-height: 22px;
            /* 157.143% */

        }

        .el-button--primary {
            color: #FFF;
            border: none !important;
            border-radius: 6px;
            background: linear-gradient(90deg, #2F54EB 0%, #5196FF 100%);
        }
    }


}
</style>