<template>
    <div class="approval-record-detail">
        <p class="poppver-title">
            <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-a-Rectangle143"></use>
            </svg>
            审批记录明细
        </p>
        <div class="workflow">
            <div>
                <div v-for="(activity, index) in recordList" :key="index" class="task-item pointer">
                    <div class="left">
                        <div class="top-line"></div>
                        <img src="@/assets/image/timeline-ellipse.svg" alt="" class="dot">
                        <div class="bottom-line"> </div>
                    </div>
                    <div class="right">
                        <p class="taskname-staff">
                            <span class="taskname">{{ activity.taskName }}</span>
                            <span class="staff">
                                <i>{{ activity.initiator }}</i>
                                <i class="post">（{{ activity.post }}）</i>
                                <img src="@/assets/image/record-avatar.svg" alt="" v-if="Math.random() > 0.5">
                                <div class="avatar" v-else>谭</div>
                            </span>
                        </p>
                        <div class="time-notes">
                            <div v-if="activity.taskName == '发起申请'">
                                任务发起：{{ activity.startingtime }}
                            </div>
                            <div class="time-note" v-else>
                                <span>任务到达：07-08 09:12</span>
                                <span class="handle-time">处理：<i>12 小时</i></span>
                                <span>任务结束：07-08 09:12</span>
                            </div>
                        </div>
                        <div class="opinions" v-if="activity.taskName !== '发起申请'">
                            <div v-for="(item, idx) in activity.substantiveopinion" :key="idx" class="opinions-item">
                                <div class="opinion-tag" v-if="activity.targetPage === 'ocr'">
                                    <span v-if="item.isSubstantive" class="guanzhu">
                                        <i class="iconfont icon icon-guanzhu"></i>
                                        有实质意见
                                    </span>
                                    <span v-if="!item.isSubstantive" class="guanzhu2">
                                        <i class="iconfont icon icon-guanzhu2"></i>
                                        无实质意见
                                    </span>

                                </div>
                                <p class="opinion-text">{{ idx + 1 }} {{ item.opinion }}</p>
                                <div class="relevant-file">关联文件：<i class="file-name">{{ item.relevantfile }} </i><i>+3</i>
                                </div>
                            </div>

                        </div>
                    </div>

                </div>
            </div>


        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            recordList: [
                {
                    startingtime: '07-08 09:12',
                    initiator: '谭新宇',
                    post: '产品研发与推广岗',
                    taskName: '发起申请',
                    arrivaltime: '07-08 09:12',
                    finishtime: '07-08 09:12',
                    handletime: '12',
                    substantiveopinion: [
                        {
                            opinion: '1.活动应明确参与条件，如“达标私钻”专享，避免引起歧义，引发金融消费者不满；如存在收费情况，应提前向金融消费者明示，尊重金融消费者知情权',
                            relevantfile: '理财公司理财.png',
                            isSubstantive: false
                        }
                    ],
                    targetPage: '领导审批',
                },
                {
                    startingtime: '07-08 09:12',
                    initiator: '谭新宇',
                    post: '产品研发与推广岗',
                    taskName: '发起申请1',
                    arrivaltime: '07-08 09:12',
                    finishtime: '07-08 09:12',
                    handletime: '12',
                    substantiveopinion: [
                        {
                            opinion: '1.活动应明确参与条件，如“达标私钻”专享，避免引起歧义，引发金融消费者不满；如存在收费情况，应提前向金融消费者明示，尊重金融消费者知情权',
                            relevantfile: '理财公司理财.png',
                            isSubstantive: false
                        }
                    ],

                    targetPage: '领导审批',
                }, {
                    startingtime: '07-08 09:12',
                    initiator: '谭新宇',
                    post: '产品研发与推广岗',
                    taskName: '发起申请1',
                    arrivaltime: '07-08 09:12',
                    finishtime: '07-08 09:12',
                    handletime: '12',
                    substantiveopinion: [
                        {
                            opinion: '活动应明确参与条件，如“达标私钻”专享，避免引起歧义，引发金融消费者不满；如存在收费情况，应提前向金融消费者明示，尊重金融消费者知情权',
                            relevantfile: '理财公司理财.png',
                            isSubstantive: false
                        }
                    ],
                    targetPage: '领导审批',
                }, {
                    startingtime: '07-08 09:12',
                    initiator: '谭新宇',
                    post: '产品研发与推广岗',
                    taskName: '发起申请1',
                    arrivaltime: '07-08 09:12',
                    finishtime: '07-08 09:12',
                    handletime: '12',
                    substantiveopinion: [
                        {
                            opinion: '活动应明确参与条件，如“达标私钻”专享，避免引起歧义，引发金融消费者不满；如存在收费情况，应提前向金融消费者明示，尊重金融消费者知情权',
                            relevantfile: '理财公司理财.png',
                            isSubstantive: false
                        }
                    ],
                    targetPage: '领导审批',
                }, {
                    startingtime: '07-08 09:12',
                    initiator: '谭新宇',
                    post: '产品研发与推广岗',
                    taskName: '发起申请1',
                    arrivaltime: '07-08 09:12',
                    finishtime: '07-08 09:12',
                    handletime: '12',
                    substantiveopinion: [
                        {
                            opinion: '活动应明确参与条件，如“达标私钻”专享，避免引起歧义，引发金融消费者不满；如存在收费情况，应提前向金融消费者明示，尊重金融消费者知情权',
                            relevantfile: '理财公司理财.png',
                            isSubstantive: false
                        }
                    ],
                    targetPage: 'ocr',
                }, {
                    startingtime: '07-08 09:12',
                    initiator: '谭新宇',
                    post: '产品研发与推广岗',
                    taskName: '发起申请1',
                    arrivaltime: '07-08 09:12',
                    finishtime: '07-08 09:12',
                    handletime: '12',
                    substantiveopinion: [
                        {
                            opinion: '活动应明确参与条件，如“达标私钻”专享，避免引起歧义，引发金融消费者不满；如存在收费情况，应提前向金融消费者明示，尊重金融消费者知情权',
                            relevantfile: '理财公司理财.png',
                            isSubstantive: true
                        },
                        {
                            opinion: 'ww活动应明确参与条件，如“达标私钻”专享，避免引起歧义，引发金融消费者不满；如存在收费情况，应提前向金融消费者明示，尊重金融消费者知情权',
                            relevantfile: '理财公司理财.png',
                            isSubstantive: false
                        }
                    ],
                    targetPage: 'ocr',
                }



            ]
        }
    }
}
</script>
<style lang="less" scoped>
.approval-record-detail {
    width: 600px;
    max-height: 752px;
    overflow-y: auto;

    .poppver-title {
        color: #1D2128;
        font-size: 16px;
        font-style: normal;
        font-weight: 400;
        line-height: 24px;
        margin-bottom: 16px;

        .icon {
            font-size: 20px;

        }
    }

    .workflow {
        margin-left: 4px;
    }

    /deep/ .el-timeline {
        padding: 12px;

        .el-timeline-item {
            padding-bottom: 0 !important;
        }

        .el-timeline-item__tail {
            background: url(../../../assets/image/record-line.svg);
            background-repeat: no-repeat;
            width: 2px;

        }

        .el-timeline-item__content {
            padding: 12px;
            cursor: pointer;
        }



        .el-timeline-item__node {
            // content:'xx';
            background: url(../../../assets/image/timeline-ellipse.svg);
        }

    }

   .task-item:hover {
        .right {
            border-radius: 6px;
            background: #F0F6FF !important;

            .opinions-item {
                background: #fff;
            }
        }
    }

    .task-item {
        width: 100%;

        .taskname-staff {
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;

            .taskname {
                color: #1D2128;
                font-size: 16px;
                font-style: normal;
                font-weight: 700;
                line-height: 24px;

            }


            .staff {
                display: flex;
                color: #1D2128;
                font-size: 12px;
                font-style: normal;
                font-weight: 400;
                line-height: 20px;

                img {
                    width: 20px;
                    height: 20px;
                }

                .avatar {
                    width: 20px;
                    height: 20px;
                    background: #80A6FF;
                    text-align: center;
                    line-height: 20px;
                    border-radius: 20px;
                    font-weight: 600;
                    color: #fff;
                    font-size: 12px;
                }

                /* 166.667% */
            }
        }

        .time-notes {
            width: 100%;
            color: #1D2128;
            font-size: 10px;
            font-style: normal;
            font-weight: 400;
            line-height: 18px;
            display: flex;
            margin-bottom: 8px;



            .time-note {
                display: flex;
                width: 100%;
                padding-bottom: 8px;
                justify-content: space-between;
                border-bottom: 1px dashed #E5E6EB;

                .handle-time {
                    color: #2D5CF6;
                    text-align: center;
                    font-size: 10px;
                    font-style: normal;
                    font-weight: 400;
                    line-height: 18px;

                    i {
                        font-weight: 700;
                    }

                    /* 180% */
                }

            }


        }

        .opinions {
            width: 100%;
            font-size: 12px;
            font-weight: 400;
            line-height: 20px;


            .opinions-item {
                border-radius: 10px;
                background: #F7F8FA;
                padding: 16px 16px 12px 16px;
                margin-bottom: 8px;
                position: relative;

                .opinion-tag {
                    position: absolute;
                    top: 0;
                    left: -4px;
                    border-radius: 0px 6px 6px 6px;
                    color: #FFF;
                    font-style: normal;
                    line-height: 14px;
                    overflow: hidden;
                    font-size: 10px;
                    -webkit-transform: scale(0.8);

                    .guanzhu {
                        display: inline-block;
                        padding: 2px 4px;
                        border-radius: 0px 6px 6px 6px;
                        background: linear-gradient(90deg, #E85167 0%, #FF8193 100%);

                    }

                    .guanzhu2 {
                        display: inline-block;
                        padding: 2px 4px;
                        border-radius: 0px 6px 6px 6px;
                        background: linear-gradient(90deg, #7B61FF 0%, #61A0FF 100%);

                    }

                }

                .opinion-text {
                    color: #1D2128;
                    text-align: justify;
                    margin-bottom: 6px;
                }

                .relevant-file {
                    color: #86909C;
                    display: flex;
                    align-items: center;


                    .file-name {
                        margin: 0 8px 0 0;
                        background: #fff;
                        padding: 2px 12px;

                    }

                    i {
                        color: #306EF5;
                    }

                }

            }

        }
    }

    .task-item {
        display: flex;
        justify-content: flex-start;

        .left {
            width: 13px;
            // height: auto;
            display: flex;
            flex-direction: column;
            align-items: center;
            max-height: 100%;
            margin-right: 8px;

            .dot {
                width: 13px;
                height: 13px;
            }

            .top-line {
                height: 30px;
                width: 1px;
                background-repeat: no-repeat;
                background-repeat-y: inherit;
                background-image: url(../../../assets//image/record-line.svg);
            }

            .bottom-line {
                height: 84%;
                width: 1px;
                background-repeat: no-repeat;
                background-repeat-y: inherit;
                background-image: url(../../../assets//image/record-line.svg);
            }
        }

        .right {
            flex: 1;
            padding: 12px;


        }
    }

}
</style>