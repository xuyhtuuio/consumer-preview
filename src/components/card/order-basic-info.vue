<template>
    <div class="order-basic-info" v-loading="loading">
        <div class="user">
            <div class="user-info">
                <img src="@/assets/image/ai-approval/ocr-avatar.png" alt="" />
                <span class="nickname"> {{ orderBaseInfo.approverInfo && orderBaseInfo.approverInfo.name }} /
                    {{ orderBaseInfo.approverInfo && orderBaseInfo.approverInfo.workId }} </span>
                <span>{{ orderBaseInfo.approverInfo && orderBaseInfo.approverInfo.institution }} <i
                        v-if="orderBaseInfo.approverInfo && orderBaseInfo.approverInfo.dep">|
                        {{ orderBaseInfo.approverInfo.dep }}</i></span>
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
        <div v-if="orderInfo.newBaseInfo && orderInfo.newBaseInfo.length">
            <div v-for="item, index in orderInfo.newBaseInfo" :key="index" class="proj-info">
                <div v-for="child, idx in item" :key="idx" class="proj-info-item">
                    <div class="item">
                        <span class="label">{{ child.title }}</span>
                        <span class="value">{{ child | valueFormat }}</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="proj-info pro-info-textarea">
            <div class="item" v-for="(item, index) in orderInfo.textAreaBaseInfo" :key="index">
                <span class="label">{{ item.title }}</span>
                <span class="value">{{ item | valueFormat }}</span>
            </div>
        </div>
        <div class="line"></div>
        <div class="channel-info">
            <div class="item" v-for="(item, index) in orderInfo.promotionChannels" :key="index">
                <span class="label">{{ item.title }}</span>
                <span class="value">{{ item | valueFormat }}</span>
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
                <span class="label">{{ item.title }}</span>
                <span class="value"> {{ item | valueFormat }}</span>
            </div>
        </div>
        <div class="line"></div>
        <p class="poppver-title">
            <span>
                <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-a-Rectangle143"></use>
                </svg>审查材料 <i class="total">共 {{ orderInfo.fileList && orderInfo.fileList.length }} 个</i></span>
            <span class="download pointer" v-if="orderInfo.fileList.length">下载全部</span>
        </p>
        <div class="file-list">
            <div class="file-item pointer" v-for="(item, index) in orderInfo.fileList" :key="index">
                <span class="left ellipsis ellipsis_1">
                    <i class="indexes">{{ index + 1 }}.</i>
                    <file-type :fileName="item.fileName"></File-type>
                    <i class="filename">{{ item.fileName }}</i>
                </span>
                <span class="preview" @click="preview(item.url)">预览</span>
            </div>
        </div>
    </div>
</template>

<script >
import { getApplyForm, workOrderTaskInfo } from "@/api/front";
import moment from 'moment'
import FileType from '@/components/common/file-type.vue';

export default {
    components: { FileType },
    props: {
        sidebarParam: {
            type: Object,
            default: () => { }
        }
    },
    data() {
        return {
            loading: false,
            orderBaseInfo: {},
            orderInfo: {
                baseInfo: [],
                newBaseInfo: [],
                textAreaBaseInfo: [],
                reviewPointer: [],
                fileList: []
            },
        };
    },
    mounted() {
        this.getWorkOrderTaskInfo()
        this.getOrderDetail()
    },
    activated() {
        if (!this.$route.params) {
            this.$router.go(-1)
        }
        this.getWorkOrderTaskInfo()
        this.getOrderDetail()
    },
    methods: {
        getWorkOrderTaskInfo() {
            const param = {
                formId: this.$route.params.formId || this.sidebarParam.formId,
                originatorId: this.$route.params.originatorId || this.sidebarParam.originatorId,
            }
            workOrderTaskInfo(param).then(res => {
                const { data, status, message } = res.data;
                if (status == 200) {
                    this.orderBaseInfo = {
                        ...data,
                    }
                    this.$emit('sendbaseInfo', this.orderBaseInfo)
                }
            })
        },
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

        getOrderDetail() {
            this.loading = true
            getApplyForm({
                formCategoryId: '1',
                formId: this.$route.params.formId || this.sidebarParam.formId,
            }).then(res => {
                const { data, status, message } = res.data;
                if (status === 200) {
                    let { basicInformation, keyPointsForVerification, promotionChannels, reviewMaterials } = data

                    //大段文本过滤
                    const noTextAreaBeseInfo = basicInformation.filter(v => { return v.name !== 'TextareaInput' })
                    const textAreaBaseInfo = basicInformation.filter(v => { return v.name == 'TextareaInput' })
                    this.orderInfo = {
                        baseInfo: noTextAreaBeseInfo,
                        textAreaBaseInfo: textAreaBaseInfo,
                        newBaseInfo: this.getMapping(noTextAreaBeseInfo),
                        reviewPointer: keyPointsForVerification,
                        promotionChannels,
                        fileList: reviewMaterials && reviewMaterials[0].value

                    }
                } else {
                    this.$message.error({ offset: 40, title: "提醒", message });
                }
            }).finally(() => {
                this.loading = false
            });
        },
        preview(url) {
            this.$emit('preview', url)
        }
    },
    filters: {
        valueFormat(val) {
            if (val.name == 'TextInput' || val.name == 'TextareaInput') {
                return val.value || '--'
            }
            if (val.name == 'SelectInput') {
                const { options } = val.props
                let strings = options.filter(v => v.id == val.value)
                strings = strings.map(m => { return m.value }).join('、')
                return strings || '--'
            }
            if (val.name == 'TimePicker') {
                return val.value ? moment(val.value).format('YYYY-MM-DD HH:mm:ss') : '--'
            }
            if (val.name == 'MultipleSelect') {
                const { options } = val.props
                let array = []
                val.value.forEach(id => {
                    let strings = options.filter(v => v.id == id)[0]
                    array.push(strings)
                })
                const label = array.map(m => { return m.value }).join('、')
                return label || '--'
            }
        }
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

        .proj-info-item {
            flex: 1;
            margin-right: 13px;
        }

        .proj-info-item:last-of-type {
            margin-right: 0;
        }
    }

    .pro-info-textarea {
        display: flex;
        flex-direction: column;
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