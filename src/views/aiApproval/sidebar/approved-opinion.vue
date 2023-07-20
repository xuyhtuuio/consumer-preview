<template>
    <div class="approved-opinion">
        <p class="poppver-title">
            <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-a-Rectangle143"></use>
            </svg>
            已审查意见
        </p>
        <div class="opinion-content">
            <div v-for="(item, index) in opinions" :key="index" class="opinion-box">
                <p class="stuff">
                    <i class="line"></i>
                    <span>
                        {{ item.stuff }} / {{ item.post }} <i>共{{ item.total }}条</i> {{ item.time }}
                    </span>
                    <i class="line"></i>
                </p>
                <div class="opinions">
                    <div v-for="(child, idx) in item.substantiveopinion" :key="idx" class="opinions-item pointer">
                        <div class="opinion-tag">
                            <span v-if="child.isSubstantive" class="guanzhu">
                                <i class="iconfont icon icon-guanzhu"></i>
                                有实质意见
                            </span>
                            <span v-if="!child.isSubstantive" class="guanzhu2">
                                <i class="iconfont icon icon-guanzhu2"></i>
                                无实质意见
                            </span>

                        </div>
                        <p class="opinion-text">{{ idx + 1 }} {{ child.opinion }}</p>
                        <div class="relevant-file">关联文件：<i class="file-name">{{ child.relevantfile }} </i><i>+3</i>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'ocr-approved-opinion',
    data() {
        return {
            opinions: [
                {
                    stuff: '谭新宇',
                    post: '产品研发与推广岗',
                    total: 2,
                    time: '2023-07-14',
                    substantiveopinion: [
                        {
                            opinion: '1.活动应明确参与条件，如“达标私钻”专享，避免引起歧义，引发金融消费者不满；如存在收费情况，应提前向金融消费者明示，尊重金融消费者知情权',
                            relevantfile: '理财公司理财.png',
                            isSubstantive: false
                        },
                        {
                            opinion: '1.活动应明确参与条件，如“达标私钻”专享，避免引起歧义，引发金融消费者不满；如存在收费情况，应提前向金融消费者明示，尊重金融消费者知情权',
                            relevantfile: '理财公司理财.png',
                            isSubstantive: true
                        }
                    ],
                },
                {
                    stuff: '谭新宇',
                    post: '产品研发与推广岗',
                    total: 2,
                    time: '2023-07-14',
                    substantiveopinion: [
                        {
                            opinion: '1.活动应明确参与条件，如“达标私钻”专享，避免引起歧义，引发金融消费者不满；如存在收费情况，应提前向金融消费者明示，尊重金融消费者知情权',
                            relevantfile: '理财公司理财.png',
                            isSubstantive: false
                        },
                        {
                            opinion: '1.活动应明确参与条件，如“达标私钻”专享，避免引起歧义，引发金融消费者不满；如存在收费情况，应提前向金融消费者明示，尊重金融消费者知情权',
                            relevantfile: '理财公司理财.png',
                            isSubstantive: true
                        }
                    ],
                },{
                    stuff: '谭新宇',
                    post: '产品研发与推广岗',
                    total: 2,
                    time: '2023-07-14',
                    substantiveopinion: [
                        {
                            opinion: '1.活动应明确参与条件，如“达标私钻”专享，避免引起歧义，引发金融消费者不满；如存在收费情况，应提前向金融消费者明示，尊重金融消费者知情权',
                            relevantfile: '理财公司理财.png',
                            isSubstantive: false
                        },
                        {
                            opinion: '1.活动应明确参与条件，如“达标私钻”专享，避免引起歧义，引发金融消费者不满；如存在收费情况，应提前向金融消费者明示，尊重金融消费者知情权',
                            relevantfile: '理财公司理财.png',
                            isSubstantive: true
                        }
                    ],
                },{
                    stuff: '谭新宇',
                    post: '产品研发与推广岗',
                    total: 2,
                    time: '2023-07-14',
                    substantiveopinion: [
                        {
                            opinion: '1.活动应明确参与条件，如“达标私钻”专享，避免引起歧义，引发金融消费者不满；如存在收费情况，应提前向金融消费者明示，尊重金融消费者知情权',
                            relevantfile: '理财公司理财.png',
                            isSubstantive: false
                        },
                        {
                            opinion: '1.活动应明确参与条件，如“达标私钻”专享，避免引起歧义，引发金融消费者不满；如存在收费情况，应提前向金融消费者明示，尊重金融消费者知情权',
                            relevantfile: '理财公司理财.png',
                            isSubstantive: true
                        }
                    ],
                },{
                    stuff: '谭新宇',
                    post: '产品研发与推广岗',
                    total: 2,
                    time: '2023-07-14',
                    substantiveopinion: [
                        {
                            opinion: '1.活动应明确参与条件，如“达标私钻”专享，避免引起歧义，引发金融消费者不满；如存在收费情况，应提前向金融消费者明示，尊重金融消费者知情权',
                            relevantfile: '理财公司理财.png',
                            isSubstantive: false
                        },
                        {
                            opinion: '1.活动应明确参与条件，如“达标私钻”专享，避免引起歧义，引发金融消费者不满；如存在收费情况，应提前向金融消费者明示，尊重金融消费者知情权',
                            relevantfile: '理财公司理财.png',
                            isSubstantive: true
                        }
                    ],
                }
            ]
        }

    }

}
</script>
<style lang="less" scoped>
.approved-opinion {
    width: 600px;
    height: 100%;
    overflow-y: hidden;
    display: flex;
    flex-direction: column;

    .poppver-title {
        color: #1D2128;
        font-size: 16px;
        font-style: normal;
        font-weight: 400;
        line-height: 24px;
        margin-bottom: 16px;
        height: 24px;

        .icon {
            font-size: 20px;

        }
    }

    .opinion-content {
   flex: 1;
        overflow: auto;
        .opinion-box {
            margin-bottom: 12px;
            .stuff {
                display: flex;
                align-items: center;
                margin-bottom: 12px;

                .line {
                    flex: 1;
                    width: 100%;
                    border-top: 1px dashed #E5E6EB;
                }

                span {
                    color: #86909C;
                    font-size: 12px;
                    font-weight: 400;
                    line-height: 20px;
                    margin: 0 10px;
                }

                i {
                    margin: 0 10px;
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
    }


}
</style>