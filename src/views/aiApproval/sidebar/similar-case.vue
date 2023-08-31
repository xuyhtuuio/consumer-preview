<template>
    <div class="similar-case">
        <p class="poppver-title">
            <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-a-Rectangle143"></use>
            </svg>
            相似案例
        </p>
        <div class="case-box" v-loading="caseListLoading">
            <div class="case-content">
                <!-- <div class="case-item pointer" v-for="(item, index) in caseList" :key="index"
                    :class="{ 'product-border': item.type === '产品类', 'activity-border': item.type === '活动类', 'customer-border': item.type === '客户类', 'other-border': item.type === '其他', }">
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
                            <span>申请时间：{{ item.createTime  }}</span>
                            <span>
                                {{ item.org }}
                            </span>

                        </div>
                        <div class="desc">
                            <span class="tag">{{ item.tag }}</span>
                            <span class="tag case-desc">{{ item.desc }}</span>
                        </div>
                    </div>
                    <div class="case-type cp-class" v-show="item.type == '产品类'">
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
                </div> -->

                <div class="case-item pointer" v-for="(item, index) in caseList1" :key="index"
                    :class="{ 'product-border': item.reviewMattersType === '产品类', 'activity-border': item.reviewMattersType === '活动类', 'customer-border': item.reviewMattersType === '客户类', 'other-border': item.reviewMattersType === '其他', }">
                    <div class="thumbnail-img">
                        <div v-if="item.fileType === 'img'" class="other-icon">
                            <img :src="item.fileUrl" alt="">
                        </div>
                        <div v-else class="other-icon">
                            <svg class="icon" aria-hidden="true" v-if="item.fileType === 'pdf'">
                                <use xlink:href="#icon-mianxingtubiao"></use>
                            </svg>
                            <svg class="icon" aria-hidden="true" v-if="item.fileType === 'doc' || item.fileType === 'docx'">
                                <use xlink:href="#icon-mianxingtubiao-2"></use>
                            </svg>
                            <svg class="icon" aria-hidden="true" v-if="item.fileType === 'xls'">
                                <use xlink:href="#icon-mianxingtubiao-1"></use>
                            </svg>
                            <svg class="icon" aria-hidden="true" v-if="item.fileType === 'ppt'">
                                <use xlink:href="#icon-file-ppt"></use>
                            </svg>
                        </div>
                    </div>
                    <div class="case-info">
                        <div class="name">
                            {{ item.name }}
                        </div>
                        <div class="time">
                            <span>申请时间：{{ item.createTime }}</span>
                            <span>
                                {{ item.org }}
                            </span>
                        </div>
                        <div class="desc">
                            <span class="tag">{{ item.tag }}</span>
                            <span class="tag case-desc">{{ item.desc }}</span>
                        </div>
                    </div>
                    <div class="case-type cp-class" v-show="item.reviewMattersType == '产品类'">
                        {{ item.reviewMattersType }}
                    </div>
                    <div class="case-type hd-class" v-show="item.reviewMattersType == '活动类'">
                        <span>{{ item.reviewMattersType }}</span>
                    </div>
                    <div class="case-type kh-class" v-show="item.reviewMattersType == '客户类'">
                        <span>{{ item.reviewMattersType }}</span>
                    </div>
                    <div class="case-type other-class" v-show="item.reviewMattersType == '其他'">
                        {{ item.reviewMattersType }}
                    </div>
                </div>
            </div>
            <!-- <trs-pagination :total="search.total" @getList="getSimilarCasesData" :pageNow="pageNow"></trs-pagination> -->
        </div>

    </div>
</template>
<script>
import {
    getSimilarCases
} from '@/api/aiApproval';
export default {
    name: 'similar-case',
    data() {
        return {
            caseList: [{
                name: '涌薪添利尊享68号人民币理财产品',
                type: '产品类',
                applyTime: '2023-08-02',
                organization: '北京分行',
                tag: '理财产品',
                desc: '涌薪添利系列',
                fileType: 'pdf'
            }, {
                name: '涌薪增利尊享36号人民币理财产品',
                type: '产品类',
                applyTime: '2023-07-28',
                organization: '长春分行',
                tag: '理财产品',
                desc: '涌薪增利系列',
                fileType: 'doc'
            }, {
                name: '聚鑫赢A周周开1号人民币理财产品',
                type: '产品类',
                applyTime: '2023-07-26',
                organization: '上海分行',
                tag: '理财产品',
                desc: '聚鑫赢系列',
                fileType: 'pdf'
            }, {
                name: '南银理财鑫逸稳一年114期-B份额',
                type: '产品类',
                applyTime: '2023-07-22',
                organization: '广州分行',
                tag: '代销理财产品',
                desc: '鑫逸稳系列',
                fileType: 'pdf'
            }, {
                name: '兴银理财增盈稳享封闭式44号固收类理财产品',
                type: '产品类',
                applyTime: '2023-07-12',
                organization: '西安分行',
                tag: '代销理财产品',
                desc: '增盈稳享系列',
                fileType: 'img'
            }, {
                name: '苏银理财恒源封闭债权42期14月A',
                type: '产品类',
                applyTime: '2023-07-11',
                organization: '深圳分行',
                tag: '代销理财产品',
                desc: '恒源系列',
                fileType: 'doc'
            }],
            caseList1: [{
                "id": 1300,
                "name": "保险审批",
                "reviewMattersType": "产品类旧",
                "fileName": "1.jpeg",
                "fileUrl": "http://192.168.210.51:9090/cpr/cpr_1692865382335_1.jpeg",
                "userId": 813,
                "org": "研发组",
                "createTime": "2023-08-24 16:23:35",
                "approvalTypeOption": [
                    {
                        "id": "0",
                        "value": "新产品"
                    },
                    {
                        "id": "1",
                        "value": "产品营销类"
                    }
                ],
                "productTypeOption": [
                    {
                        "id": "0",
                        "value": "理财"
                    },
                    {
                        "id": "1",
                        "value": "基金"
                    }
                ],
                "approvalType": "0",
                "productType": [
                    "0"
                ]
            },
            {
                "id": 1299,
                "name": "保险宣传",
                "reviewMattersType": "产品类旧",
                "fileName": "1.jpeg",
                "fileUrl": "http://192.168.210.51:9090/cpr/cpr_1692863900824_1.jpeg",
                "userId": 914,
                "org": null,
                "createTime": "2023-08-24 16:03:07",
                "approvalTypeOption": [
                    {
                        "id": "0",
                        "value": "新产品"
                    },
                    {
                        "id": "1",
                        "value": "产品营销类"
                    }
                ],
                "productTypeOption": [
                    {
                        "id": "0",
                        "value": "理财"
                    },
                    {
                        "id": "1",
                        "value": "基金"
                    }
                ],
                "approvalType": "0",
                "productType": [
                    "0"
                ]
            },
            {
                "id": 1295,
                "name": "svdbjkndfblfm kfm",
                "reviewMattersType": "产品类旧",
                "fileName": "屏幕截图 2023-06-05 140504.png",
                "fileUrl": "http://192.168.210.51:9090/cpr/cpr_1692859132085_屏幕截图 2023-06-05 140504.png",
                "userId": 813,
                "org": "研发组",
                "createTime": "2023-08-24 14:39:01",
                "approvalTypeOption": [
                    {
                        "id": "0",
                        "value": "新产品"
                    },
                    {
                        "id": "1",
                        "value": "产品营销类"
                    }
                ],
                "productTypeOption": [
                    {
                        "id": "0",
                        "value": "理财"
                    },
                    {
                        "id": "1",
                        "value": "基金"
                    }
                ],
                "approvalType": "0",
                "productType": [
                    "0"
                ]
            },
            {
                "id": 1258,
                "name": "测试16",
                "reviewMattersType": "产品类旧",
                "fileName": "认证与上网.pdf",
                "fileUrl": "http://192.168.210.51:9090/cpr/cpr_1692607777465_认证与上网.pdf",
                "userId": 1416,
                "org": "研发组",
                "createTime": "2023-08-21 16:50:15",
                "approvalTypeOption": [
                    {
                        "id": "0",
                        "value": "新产品"
                    },
                    {
                        "id": "1",
                        "value": "产品营销类"
                    }
                ],
                "productTypeOption": [
                    {
                        "id": "0",
                        "value": "理财"
                    },
                    {
                        "id": "1",
                        "value": "基金"
                    }
                ],
                "approvalType": "0",
                "productType": [
                    "0"
                ]
            },
            {
                "id": 1253,
                "name": "测试12",
                "reviewMattersType": "产品类旧",
                "fileName": "认证与上网.pdf",
                "fileUrl": "http://192.168.210.51:9090/cpr/cpr_1692595040407_认证与上网.pdf",
                "userId": 1416,
                "org": "研发组",
                "createTime": "2023-08-21 13:17:27",
                "approvalTypeOption": [
                    {
                        "id": "0",
                        "value": "新产品"
                    },
                    {
                        "id": "1",
                        "value": "产品营销类"
                    }
                ],
                "productTypeOption": [
                    {
                        "id": "0",
                        "value": "理财"
                    },
                    {
                        "id": "1",
                        "value": "基金"
                    }
                ],
                "approvalType": "0",
                "productType": [
                    "0"
                ]
            },
            {
                "id": 1201,
                "name": "测试_zwh",
                "reviewMattersType": "产品类旧",
                "fileName": "测试.ppt",
                "fileUrl": "http://192.168.210.51:9090/cpr/cpr_1692078613010_测试.ppt",
                "userId": 1416,
                "org": "研发组",
                "createTime": "2023-08-15 13:50:19",
                "approvalTypeOption": [
                    {
                        "id": "0",
                        "value": "新产品"
                    },
                    {
                        "id": "1",
                        "value": "产品营销类"
                    }
                ],
                "productTypeOption": [
                    {
                        "id": "0",
                        "value": "理财"
                    },
                    {
                        "id": "1",
                        "value": "基金"
                    }
                ],
                "approvalType": "0",
                "productType": [
                    "0"
                ]
            },
            {
                "id": 1197,
                "name": "测试7",
                "reviewMattersType": "产品类旧",
                "fileName": "认证与上网.docx",
                "fileUrl": "http://192.168.210.51:9090/cpr/cpr_1692066491409_认证与上网.docx",
                "userId": 1416,
                "org": "研发组",
                "createTime": "2023-08-15 10:28:15",
                "approvalTypeOption": [
                    {
                        "id": "0",
                        "value": "新产品"
                    },
                    {
                        "id": "1",
                        "value": "产品营销类"
                    }
                ],
                "productTypeOption": [
                    {
                        "id": "0",
                        "value": "理财"
                    },
                    {
                        "id": "1",
                        "value": "基金"
                    }
                ],
                "approvalType": "0",
                "productType": [
                    "0"
                ]
            },
            {
                "id": 1148,
                "name": "半导体产品",
                "reviewMattersType": "产品类旧",
                "fileName": "file1.jpg.png",
                "fileUrl": "http://192.168.210.51:9090/cpr/cpr_1691724631363_file1.jpg.png",
                "userId": 1133,
                "org": "研发组",
                "createTime": "2023-08-11 11:30:42",
                "approvalTypeOption": [
                    {
                        "id": "0",
                        "value": "新产品"
                    },
                    {
                        "id": "1",
                        "value": "产品营销类"
                    }
                ],
                "productTypeOption": [
                    {
                        "id": "0",
                        "value": "理财"
                    },
                    {
                        "id": "1",
                        "value": "基金"
                    }
                ],
                "approvalType": "0",
                "productType": [
                    "0"
                ]
            }
            ],
            pageNum: 1,
            pageSize: 10,
            formCategoryId: '',
            formId: '',
            caseListLoading: false,
            total: 0,
        }
    },
    created() {
        const { item } = this.$route.params;
        this.formId = item.taskNumber;
        this.formCategoryId = item.formManagementId;
        this.getSimilarCasesData(1)
    },
    methods: {
        async getSimilarCasesData(pageNum) {
            this.pageNum = pageNum
            const wait_param = {
                pageNum: this.pageNum,
                pageSize: this.pageSize,
                formCategoryId: this.formCategoryId,
                formId: this.formId
            }

            this.caseList1.map((item, index) => {
                item.approvalTypeOption = item.approvalTypeOption.filter(itemOption => itemOption.id === approvalType)
                const lastDotIndex = item.fileName.lastIndexOf('.');
                console.log('lastDotIndex', lastDotIndex);
                const imgType = ['jpg', 'jpeg', 'png', 'gif'];
                if (lastDotIndex !== -1) {
                    const fileType = item.fileName.substring(lastDotIndex + 1);
                    console.log(fileType); // 输出 "pdf"
                    if (imgType.includes(fileType)) {
                        this.$set(item, 'fileType', 'img')
                    } else {
                        this.$set(item, 'fileType', fileType)
                    }
                } else {
                    console.log("字符串中没有点（.）");
                }
            })
            console.log('this.caseList1', this.caseList1);
            getSimilarCases(wait_param).then(res => {
                const { data } = res.data;
                // this.caseList = data.list;

                this.total = data.totalCount;
                this.caseListLoading = false;
            }).catch(err => {
                this.caseListLoading = false;
                this.total = 0
                this.caseList = []
            })
        }
    }
}

</script>
<style lang="less" scoped>
.similar-case {
    width: 600px;
    height: 100%;
    overflow: hidden;

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

                .other-icon {
                    background: #F7F8FA;
                    width: 100%;
                    height: 100%;
                    text-align: center;
                    line-height: 100px;

                    img {
                        width: 100%;
                    }
                }

                .icon {
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
                flex: 1;
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

}
</style>