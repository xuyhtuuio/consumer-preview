<template>
    <div class="similar-case">
        <p class="poppver-title">
            <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-a-Rectangle143"></use>
            </svg>
            相似案例
        </p>
        <div class="case-box">
            <div class="case-content">
                <div class="case-item pointer" v-for="(item, index) in caseList" :key="index"
                    :class="{ 'product-border': item.type === '保险类', 'activity-border': item.type === '活动类', 'customer-border': item.type === '客户类', 'other-border': item.type === '其他', }">
                    <div class="thumbnail-img">
                        <div v-if="item.fileType === 'img'">
                            我是背景图
                        </div>
                        <div v-else class="other-icon">
                            <svg class="icon" aria-hidden="true" v-if="item.fileType === 'pdf'">
                                <use xlink:href="#icon-mianxingtubiao"></use>
                            </svg>
                            <svg class="icon" aria-hidden="true" v-if="item.fileType === 'doc'">
                                <use xlink:href="#icon-mianxingtubiao-2"></use>
                            </svg>
                            <svg class="icon" aria-hidden="true" v-if="item.fileType === 'xls'">
                                <use xlink:href="#icon-mianxingtubiao-1"></use>
                            </svg>
                        </div>
                    </div>
                    <div class="case-info">
                        <div class="name">
                            {{ item.name }}
                        </div>
                        <div class="time">
                            <span>申请时间：{{ item.applyTime }}</span>
                            <span>
                                {{ item.organization }}
                            </span>

                        </div>
                        <div class="desc">
                            <span class="tag">{{ item.tag }}</span>
                            <span class="tag case-desc" v-for="word in item.desc.split(' ') || []" :key="word">{{ word }}</span>
                        </div>
                    </div>
                    <div class="case-type cp-class" v-show="item.type == '保险类'">
                        {{ item.type }}
                    </div>
                    <div class="case-type hd-class" v-show="item.type == '活动类'">
                        <span>{{ item.type }}</span>
                    </div>
                    <div class="case-type kh-class" v-show="item.type == '客户类'">
                        <span>{{ item.type }}</span>
                    </div>
                    <div class="case-type other-class" v-show="item.type == '其他'">
                        {{ item.type }}
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>
<script>
export default {
    name: 'similar-case',
    data() {
        return {
            caseList: [{
                name: '尊享金生年金保险产品审查',
                type: '保险类',
                applyTime: '2023-08-02',
                organization: '北京分行',
                tag: '人身险',
                desc: '人寿保险 年金保险',
                fileType: 'pdf'
            },{
                name: '附加健康优享重大疾病保险',
                type: '保险类',
                applyTime: '2023-07-28',
                organization: '长春分行',
                tag: '人身险',
                desc: '健康保险 重疾保险',
                fileType: 'doc'
            },{
                name: '附加住院日额医疗保险产品审查',
                type: '保险类',
                applyTime: '2023-07-26',
                organization: '上海分行',
                tag: '人身险',
                desc: '健康保险 医疗保险',
                fileType: 'pdf'
            },{
                name: '保利盈2.0两全保险产品审查',
                type: '保险类',
                applyTime: '2023-07-22',
                organization: '广州分行',
                tag: '人身险',
                desc: '人寿保险 两全保险',
                fileType: 'pdf'
            },{
                name: '富德生命如意福两全保险（分红型）',
                type: '保险类',
                applyTime: '2023-07-12',
                organization: '西安分行',
                tag: '人身险',
                desc: '人寿保险 两全保险',
                fileType: 'pdf'
            }
            ]

        }
    }
}

</script>
<style lang="less" scoped>
.similar-case {
    width: 600px;
   height: 100%;
    overflow:hidden;

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

    .case-box {
        height: 97%;
        overflow: hidden;
    }

    .case-content {
        overflow: auto;
        height: 100%;

        .case-item:hover {
            padding: 1px;
            background: #F7F8FA;
            /* 阴影/小 */
            box-shadow: 0px 0px 10px 0px rgba(67, 67, 67, 0.05);
            border: none;

            .case-type {
                right: 1px;
                top: 1px;
            }
        }

        .product-border {
            border: 1px solid #F0F6FF;
        }

        .activity-border {
            border: 1px solid #FFF1F0;
        }

        .customer-border {
            border: 1px solid #FFF7E6;

        }

        .other-border {
            border: 1px solid #E6FFFB;

        }

        .case-item {
            box-sizing: border-box;
            border-radius: 8px;

            background: #FFF;
            position: relative;
            height: 100px;
            display: flex;
            justify-content: flex-start;
            margin-bottom: 16px;
            overflow: hidden;
            border-radius: 10px;

            .thumbnail-img {
                width: 160px;
                height: 100%;
                margin-right: 8px;
                .other-icon{
                    background: #F7F8FA;
                    width: 100%;
                    height: 100%;
                    text-align: center;
                    line-height: 100px;
                }
                .icon{
                    font-size: 40px;
                }
            }

            .name {
                color: #333;
                max-width: 78%;
                /* 小字号/正文-加粗 */
                font-family: Microsoft YaHei;
                font-size: 14px;
                font-style: normal;
                font-weight: 700;
                line-height: 22px;
                overflow: hidden;
                text-overflow: ellipsis;
                display: inline-block;
                white-space: nowrap;

                /* 157.143% */
            }

            .case-info {
                display: flex;
                flex-direction: column;
                justify-content: center;
                padding: 0 12px 0 0px;
            }

            .time {
                margin: 8px 0;
                color: #505968;
                font-family: Microsoft YaHei;
                font-size: 12px;
                font-style: normal;
                font-weight: 400;
                line-height: 20px;
                display: flex;
                align-items: center;

                span {
                    display: flex;
                    align-items: center;
                }

                /* 166.667% */
                span:nth-of-type(1)::after {
                    display: inline-block;
                    content: '';
                    width: 1px;
                    height: 12px;
                    background: #E5E6EB;
                    margin: 0 8px;


                }
            }

            .desc {
                display: flex;
                align-items: center;

                .tag {
                    color: #2D5CF6;

                    /* 次级正文/常规 */
                    font-family: Microsoft YaHei;
                    font-size: 12px;
                    font-style: normal;
                    font-weight: 400;
                    line-height: 20px;
                    /* 166.667% */
                    border-radius: 4px;
                    background: #F9FBFF;
                    display: inline-block;
                    padding: 3px 12px;
                    margin-right: 8px;

                }

                .case-desc {
                    max-width: 57%;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: inline-block;
                    white-space: nowrap;
                    font-weight: 700;
                }
            }

            .case-type {
                position: absolute;
                right: 0;
                top: 0;
                border-radius: 6px 0px 6px 6px;
                font-size: 12px;
                font-style: normal;
                font-weight: 400;
                line-height: 20px;
                padding: 2px 12px;
            }

            .cp-class {
                background: #F0F6FF;
                color: #2D5CF6;
            }

            .hd-class {
                background: #FFF1F0;

                span {
                    background: linear-gradient(90deg, #E85167 0%, #FF8193 100%);
                    background-clip: text;
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
            }

            .kh-class {
                background: #FFF7E6;

                span {
                    background: linear-gradient(90deg, #FF5C00 0%, #FFAE64 100%);
                    background-clip: text;
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
            }

            .other-class {
                background: #E6FFFB;
                color: #0DA5AA;

            }
        }
    }

}</style>