<template>
    <div class="order-basic-info">
        <div class="user">
            <div class="user-info">
                <img src="@/assets/image/ai-approval/ocr-avatar.png" alt="" v-if="Math.random() > 0.5" />
                <div class="avatar" v-else>谭</div>
                <span class="nickname"> 谭新宇 / 300592 </span>
                <span>总行 | 财富平台部 | 财富平台部</span>
            </div>
            <slot name="apply-modify"></slot>
        </div>
        <p class="poppver-title">
            <span><svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-a-Rectangle143"></use>
                </svg>
                基本信息</span>
        </p>
        <!-- 项目基本信息-->
        <div v-if="orderInfo.newBaseInfo && orderInfo.newBaseInfo.length" >
            <div v-for="item, index in orderInfo.newBaseInfo" :key="index" class="proj-info">
                <div v-for="child, idx in item" :key="idx"
                    class="proj-info-item">
                    <div class="item">
                        <span class="label">{{ child.label }}</span>
                        <span class="value">{{ child.value }}</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="proj-info">
            <div class="item">
                <span class="label">申请说明</span>
                <span class="value">2睿远平衡18月产品宣传图审核睿远平衡18月产品宣传图审核睿远平衡18月产品宣传图审核睿远平衡
                    18月产品宣传图审核睿远平衡18月产品宣审核睿远平衡18月产品宣传图审核睿远平衡18月产品宣传
                    图审核睿远平衡18月产品宣传图审核18月产品宣传图审核睿远平衡18月产品宣传</span>
            </div>
        </div>
        <div class="line"></div>
        <div class="channel-info">
            <div class="item">
                <span class="label">线上渠道</span>
                <span class="value">手机银行、短信、手机银行直播、手机银行、短信、手机银行直播</span>
            </div>
            <div class="item">
                <span class="label">外部渠道</span>
                <span class="value">线上媒体</span>
            </div>
            <div class="item">
                <span class="label">线下渠道</span>
                <span class="value">- -</span>
            </div>
            <div class="item">
                <span class="label">个人渠道</span>
                <span class="value">- -</span>
            </div>
            <slot name="personal-channel"></slot>
        </div>
        <div class="line"></div>
        <p class="poppver-title">
            <span>
                <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-a-Rectangle143"></use>
                </svg>
                审查要点</span>
        </p>
        <div :class="[
            'proj-info',
            orderInfo.reviewPointer && orderInfo.reviewPointer.length > 1
                ? 'review-pointer'
                : 'review-pointer1',
        ]">
            <div class="item" v-for="(item, index) in orderInfo.reviewPointer" :key="index">
                <span class="label">{{ item.label }}</span>
                <span class="value"> {{ item.value }}</span>
            </div>
        </div>
        <div class="line"></div>
        <p class="poppver-title">
            <span>
                <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-a-Rectangle143"></use>
                </svg>审查材料 <i class="total">共 6 个</i></span>
            <span class="download pointer">下载全部</span>
        </p>
        <div class="file-list">
            <div class="file-item pointer" v-for="(item, index) in fileList" :key="index">
                <span class="left ellipsis ellipsis_1">
                    <i class="indexes">{{ index + 1 }}.</i>
                    <svg class="icon" aria-hidden="true" v-if="item.fileType == 'pdf'">
                        <use xlink:href="#icon-mianxingtubiao"></use>
                    </svg>
                    <svg class="icon" aria-hidden="true" v-if="item.fileType == 'xls'">
                        <use xlink:href="#icon-mianxingtubiao-1"></use>
                    </svg>
                    <svg class="icon" aria-hidden="true" v-if="item.fileType == 'doc'">
                        <use xlink:href="#icon-mianxingtubiao-2"></use>
                    </svg>
                    <i class="filename">{{ item.filename }}</i>
                </span>
                <span class="preview">预览</span>
            </div>
        </div>
    </div>
</template>

<script >
export default {
    data() {
        return {
            fileList: [
                {
                    filename: "附件附件附件1.png",
                    fileType: "pdf",
                },
                {
                    filename: "附件附件附件1.png",
                    fileType: "doc",
                },
                {
                    filename: "附件附件附件1.png",
                    fileType: "xls",
                },
                {
                    filename: "附件附件附件附件附件附件附件附件附件附件附件附件1.png",
                    fileType: "pdf",
                },
                {
                    filename: "附件附件附件附件附件附件附件附件附件附件附件附件1.png",
                    fileType: "pdf",
                },
                {
                    filename: "附件附件附件附件附件附件附件附件附件附件附件附件1.png",
                    fileType: "pdf",
                },
                {
                    filename: "附件附件附件附件附件附件附件附件附件附件附件附件1.png",
                    fileType: "pdf",
                },
                {
                    filename: "附件附件附件附件附件附件附件附件附件附件附件附件1.png",
                    fileType: "pdf",
                },
                {
                    filename: "附件附件附件附件附件附件附件附件附件附件附件附件1.png",
                    fileType: "pdf",
                },
                {
                    filename: "附件附件附件附件附件附件附件附件附件附件附件附件1.png",
                    fileType: "pdf",
                },
                {
                    filename: "附件附件附件附件附件附件附件附件附件附件附件附件1.png",
                    fileType: "pdf",
                },
                {
                    filename: "附件附件附件附件附件附件附件附件附件附件附件附件1.png",
                    fileType: "pdf",
                },
                {
                    filename: "附件附件附件附件附件附件附件附件附件附件附件附件1.png",
                    fileType: "pdf",
                },
                {
                    filename: "附件附件附件附件附件附件附件附件附件附件附件附件1.png",
                    fileType: "pdf",
                },
                {
                    filename: "附件附件附件附件附件附件附件附件附件附件附件附件1.png",
                    fileType: "pdf",
                },
                {
                    filename: "附件附件附件附件附件附件附件附件附件附件附件附件1.png",
                    fileType: "pdf",
                },
                {
                    filename: "附件附件附件附件附件附件附件附件附件附件附件附件1.png",
                    fileType: "pdf",
                },
                {
                    filename: "附件附件附件附件附件附件附件附件附件附件附件附件1.png",
                    fileType: "pdf",
                },
                {
                    filename: "附件附件附件附件附件附件附件附件附件附件附件附件1.png",
                    fileType: "pdf",
                },
            ],
            orderInfo: {
                baseInfo: [
                    { label: '项目名称', value: '国家石财富系列之睿远平衡18期' },
                    { label: '审批类型', value: '产品营销类' },
                    { label: '产品名称', value: '理财石财富系列之睿远平衡' },
                    { label: '产品类型', value: '理财类' },
                    { label: '上线时间', value: '2023-08-26' },
                    { label: '下线时间', value: '2023-08-26' },
                ],
                newBaseInfo: [],
                reviewPointer: [
                    {
                        label: "产品要点",
                        value:
                            "产品基本信息：起购金额、起购时间、销售起息方式、投资方式(存款)、免责条款",
                    },
                    {
                        label: "审查要点",
                        value:
                            "承担义务不得低于宣传所承诺的标准 不得虚假欺诈隐瞒或者误导宣传、资料真实准确、不得隐瞒限制条件",
                    },
                    {
                        label: "审查要点",
                        value:
                            "承担义务不得低于宣传所承诺的标准 不得虚假欺诈隐瞒或者误导宣传、资料真实准确、不得隐瞒限制条件",
                    },
                    {
                        label: "审查要点",
                        value:
                            "承担义务不得低于宣传所承诺的标准 不得虚假欺诈隐瞒或者误导宣传、资料真实准确、不得隐瞒限制条件",
                    },
                ],
            },
        };
    },
    mounted() {
        this.orderInfo.newBaseInfo = this.getMapping(this.orderInfo.baseInfo)
        console.log('ff', this.orderInfo.newBaseInfo)
    },
    methods: {
        getMapping(list) {
            let len = list.length
            let newList = []
            if (len) {
                let chunk = 4
                for (let i = 0, j = len; i < j; i += chunk) {
                    newList.push(list.slice(i, i + chunk))
                }
            }
            return newList
        },
    }
};
</script>
<style lang="less" scoped>
.order-basic-info {
    .user {
        margin-bottom: 16px;
        display: flex;
        align-items: center;
    }

    .user-info {
        flex: 1;
        border-radius: 20px;
        background: #f7f8fa;
        display: flex;
        align-items: center;

        .avatar {
            width: 32px;
            height: 32px;
            background: #80a6ff;
            text-align: center;
            line-height: 32px;
            border-radius: 20px;
            margin-right: 8px;
            font-weight: 700;
            color: #fff;
            font-size: 14px;
        }

        img {
            width: 32px;
            height: 32px;
            margin-right: 8px;
        }

        color: #505968;
        font-size: 12px;
        font-weight: 400;
        line-height: 32px;

        .nickname {
            color: #1d2128;
            font-weight: 700;
            line-height: 32px;
            margin-right: 16px;
        }
    }

    .poppver-title {
        color: #1d2128;
        font-size: 16px;
        font-style: normal;
        font-weight: 700;
        line-height: 24px;
        margin-bottom: 16px;
        display: flex;
        justify-content: space-between;

        .icon {
            font-size: 20px;
        }

        i {
            font-size: 12px;
            font-weight: 400;
            line-height: 22px;
            margin-left: 8px;
        }

        .download {
            color: #306ef5;
            font-size: 14px;
            font-weight: 400;
            line-height: 22px;
            /* 157.143% */
            text-decoration-line: underline;
        }
    }

    .item {
        display: flex;
        flex-direction: column;

        font-size: 12px;
        font-weight: 400;
        line-height: 20px;
        padding: 2px 0px;
        margin-bottom: 2px;

        .label {
            color: #505968;
            display: flex;
            align-items: center;
        }

        .label::before {
            content: "·";
            font-size: 20px;
            padding-right: 4px;
            line-height: 20px;
            color: #505968;
        }

        .value {
            color: #1d2128;
            font-weight: 700;
            padding-left: 14px;
        }
    }

    .proj-info {
        display: flex;
        margin-bottom: 12px;
        flex-wrap: wrap;

        .proj-info-item{
            flex: 1;
            margin-right: 13px;
        }
        .proj-info-item:last-of-type{
            margin-right: 0;
        }
    }

    .channel-info {
        display: flex;

        .item {
            flex: 1;
            margin-right: 13px;
        }

        .item:last-of-type {
            margin-right: 0;
        }
    }

    .review-pointer {
        flex-wrap: wrap;
        justify-content: space-between;

        .item {
            width: 49% !important;
        }
    }

    .review-pointer1 {
        .item {
            flex: 1;
        }
    }

    .line {
        width: 552px;
        width: 100%;
        margin: 16px 0;
        border-top: 1px dashed #e5e6eb;
    }

    .file-list {
        display: flex;
        flex-wrap: wrap;
        width: 100%;

        .file-item {
            width: 50%;
            padding: 8px 12px;
            font-size: 14px;
            font-weight: 400;
            line-height: 22px;
            display: flex;
            cursor: pointer;
            justify-content: space-between;

            .indexes {
                color: #505968;
                word-break: keep-all;
            }

            .filename {
                color: #505968;
                max-width: 80%;
            }

            .icon {
                margin: 0 10px;
                width: 20px;
                height: 20px;
            }

            .left {
                flex: 1;
                // display: flex;
                padding-right: 20px;
            }

            .preview {
                width: 32px;
                color: #2d5cf6;
                visibility: hidden;
            }
        }

        .file-item:hover {
            border-radius: 4px;
            background: #f7f8fa;
            cursor: pointer;

            .preview {
                visibility: visible;
            }
        }
    }
}
</style>