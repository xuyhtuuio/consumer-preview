<template>
    <div class="apply-center">
        <p class="welcoming">欢迎来到消保管控平台！</p>
        <p class="tips" v-if="tipsMsg">
            <i class="iconfont icon-xiaoxi-tongzhi"></i>{{ tipsMsg }}
        </p>
        <div class="data-statistics">
            <div v-for="(item, index) in dataStatistics" :key="index" @click="changeStatis(item)"
                :class="item.value !== crtSign ? 'data-statistics-item' : 'data-statistics-item active-item'">
                <div class="icon">
                    <img src="@/assets/image/apply-center/attention.png" alt="" v-if="item.value == crtSign"
                        class="active-icon">
                    <img src="@/assets/image/apply-center/no-attention.png" v-else alt="" class="default-icon">
                </div>
                <div class="name-count">
                    <span class="name">{{ item.name }}</span>
                    <span class="count"><i>{{ item.count }}</i> 个</span>
                </div>
            </div>
            <div class=" new-apply  pointer">
                <img src="@/assets/image/apply-center/newApply.svg" alt="">
                <p>新建申请</p>
            </div>
        </div>
        <div class="apply-content">
            <div class="filters">
                <div class="filters-content">
                    <div class="floor1">
                        <div class="floor1-item">
                            <el-select v-model="search.approvalType" placeholder="事项类型" @change="searchList">
                                <el-option v-for="(item, index) in transactionTypes" :key='index' :label="item.label"
                                    :value="item.value"></el-option>
                            </el-select>
                            <el-select v-model="search.approvalStage" placeholder="审批阶段" @change="searchList">
                                <el-option v-for="(item, index) in approvalPhases" :key='index' :label="item.label"
                                    :value="item.value"></el-option></el-select>
                        </div>
                        <div class="floor1-item ">
                            <el-select v-model="search.urgent" placeholder="是否加急" @change="searchList">
                                <el-option v-for="(item, index) in isUrgents" :key='index' :label="item.label"
                                    :value="item.value"></el-option>
                            </el-select>
                            <el-select v-model="search.hasOpinions" placeholder="有/无实质意见" @change="searchList">
                                <el-option v-for="(item, index) in isOpinions" :key='index' :label="item.label"
                                    :value="item.value"></el-option>
                            </el-select>
                        </div>
                        <div class="floor1-item">
                            <el-select v-model="search.adoptionStatus" placeholder="采纳情况" @change="searchList">
                                <el-option v-for="(item, index) in adoptionSituations" :key='index' :label="item.label"
                                    :value="item.value"></el-option>
                            </el-select>
                            <el-select v-model="search.updateTime2"  ref='multiSelect' placeholder="排序" multiple @change="changeSort"
                                :class="search.updateTime2[1] == 'desc' ? 'arrow-select descArrow' : 'arrow-select ascArrow'">
                                <el-option-group v-for="group in updateTimeGroup" :key="group.label">
                                    <el-option v-for="item in group.options" :key="item.value" :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-option-group>
                            </el-select>
                        </div>
                    </div>
                    <div class="floor2">
                        <el-input v-model="search.keywords" placeholder="请输入项目名称关键词查询" clearable @clear="searchList"
                            @keyup.enter.native="searchList">
                            <i slot="suffix" class="el-input__icon el-icon-search pointer" @click="searchList"></i>
                        </el-input>
                        <el-date-picker v-model="search.startDate" value-format="yyyy-MM-dd" clearable type="date"
                            placeholder="请选择发起时间" @clear="searchList" @change="searchList">
                        </el-date-picker>
                        <el-date-picker v-model="search.productLaunchDate" value-format="yyyy-MM-dd" clearable type="date"
                            placeholder="请选择产品上线时间" @clear="searchList" @change="searchList">
                        </el-date-picker>
                    </div>
                </div>
                <div class="export-reset">
                    <el-button type="text">导出</el-button>
                    <el-button type="text" @click="reset">重置</el-button>
                </div>
            </div>
            <div class="list" v-if="list.length" v-loading="search.loading">
                <div v-for="(item, index) in list" :key="index">
                    <applyEventCard :item="item" @del="del" @quash="quash"></applyEventCard>
                </div>
                <trs-pagination :total="search.total" @getList="getApplicationList"></trs-pagination>
            </div>
            <div v-else v-loading="search.loading">
                <Empty></Empty>
            </div>
        </div>
    </div>
</template>
<script>
import {
    getDataStatistics, getUserStatus, getApprovalType, getApprovalStage, getApplicationList, delApplication, quashApplication
} from '@/api/applyCenter'
import applyEventCard from '@/components/card/apply-event-card'
export default {
    components: {
        applyEventCard
    },
    data() {
        return {
            imageSize: 292,
            tipsMsg: null,
            crtSign: 'applyAll',
            dataStatistics: [{
                name: '全部申请',
                count: 0,
                value: 'applyAll',
            },
            {
                name: '我的关注',
                count: 0,
                value: 'myAttention',

            },
            {
                name: '待修改',
                count: 0,
                value: 'toModified',

            }, {
                name: '待确认',
                count: 0,
                value: 'toConfirmed',

            }, {
                name: '审批中',
                count: 0,
                value: 'Approval',

            }, {
                name: '草稿箱',
                count: 0,
                value: 'draftBin',

            },

            ],
            search: {
                approvalType: '',
                approvalStage: '',
                urgent: '',
                hasOpinions: '',
                adoptionStatus: '',
                updateTime: [1, 'asc'],
                updateTime2: [1, 'asc'],
                keywords: '',
                releaseTime: '',
                productLaunchDate: '',
                total: 0,
                loading: false

            },
            transactionTypes: [],
            approvalPhases: [],
            isUrgents: [
                { label: '不加急', value: '0' },
                { label: '加急', value: '1' },
            ],
            isOpinions: [
                { label: '无', value: '0' },
                { label: '有', value: '1' },
            ],
            adoptionSituations: [
                { label: '未采纳', value: '0' },
                { label: '已采纳', value: '1' },
            ],
            updateTimeGroup: [
                {
                    options: [{
                        value: 1,
                        label: '发起时间'
                    }, {
                        value: 2,
                        label: '更新时间'
                    }]
                },
                {
                    options: [{
                        value: 'asc',
                        label: '升序'
                    }, {
                        value: 'desc',
                        label: '降序'
                    }]
                },
            ],
            list: []
            // list: []
        }
    },
    mounted() {
        let dom = document.querySelectorAll('.arrow-select')[0].querySelector('.el-select__tags')
        this.$nextTick(() => {
            const text = this.search.updateTime[0] == 1 ? '发起时间' : '更新时间'
            dom.innerText = text
        })
        let floor2 = document.querySelectorAll('.apply-center .floor2')[0]
        floor2.style.paddingRight = 16 + 'px'
        window.addEventListener('resize', () => {
            let floor2 = document.querySelectorAll('.apply-center .floor2')[0]
            floor2.style.paddingRight = 16 + 'px'
        })
        this.userStatus()
        this.getDataStatistic()
    },
    watch: {},
    created() {
        this.getApprovalType()
        this.getApprovalStage()
        this.getApplicationList(1)
    },
    methods: {
        getApprovalStage() {
            getApprovalStage().then(res => {
                this.approvalPhases = res.data.data.map(v => {
                    return {
                        label: v,
                        value: v
                    }
                })
            })
        }
        ,
        getApprovalType() {
            getApprovalType().then(res => {
                this.transactionTypes = res.data.data.map(v => {
                    return {
                        label: v,
                        value: v
                    }
                })
            })
        },
        getDataStatistic() {
            getDataStatistics().then((res) => {
                const { data } = res.data
                this.dataStatistics.forEach(v => {
                    v.count = data[v.value]
                })
            })
        },
        changeSort() {
            const lastKey = this.search.updateTime2[this.search.updateTime2.length - 1]
            if (this.search.updateTime2.length < 2) {
                this.search.updateTime2 = this.search.updateTime
            } else {
                if (!isNaN(lastKey)) {
                    this.search.updateTime[0] = lastKey
                } else {
                    this.search.updateTime[1] = lastKey
                }
                this.$nextTick(() => {
                    this.search.updateTime2 = this.search.updateTime
                })
            }
            let dom = document.querySelectorAll('.arrow-select')[0].querySelector('.el-select__tags')
            this.$nextTick(() => {
                const text = this.search.updateTime[0] == 1 ? '发起时间' : '更新时间'
                dom.innerText = text
                setTimeout(() => {
                    this.$refs.multiSelect.blur()
                }, 50)

                this.searchList()
            })

        },
        getApplicationList(pageNow) {
            // 关于排序
            const param = {
                pageNow,
                pageSize: 10,
                ...this.search,
                taskStatus: this.crtSign
            }
            let sortType = ''
            // desc:降序 asc 升序 1 发起时间 2 更新时间
            // 1：创建时间：升序 2：创建时间：降序 3：更新时间：升序 4：更新时间：降序
            if (this.search.updateTime2[0] == 1) {
                sortType = this.search.updateTime2[1] == 'desc' ? 2 : 1
            } else if (this.search.updateTime2[0] == 2) {
                sortType = this.search.updateTime2[1] == 'desc' ? 4 : 3
            }
            param.sortType = sortType
            Reflect.deleteProperty(param, 'updateTime')
            Reflect.deleteProperty(param, 'updateTime2')
            Reflect.deleteProperty(param, 'total')
            Reflect.deleteProperty(param, 'loading')

            this.search.loading = true
            getApplicationList(param).then(res => {
                const { data } = res.data
                this.search.total = data.totalCount
                this.list = data.list
                this.search.loading = false
            })
        },
        del(id) {
            const param = {
                recordId: id
            }
            delApplication(param).then(res => {
                const { data } = res.data
                if (data.status === 0) {
                    this.$message.success('删除成功')
                    this.getApplicationList(1)
                }
            })
        },
        quash(item) {
            // 0 代表不能撤销 1代表可以撤销
            const param = {
                recordId: item.id,
                Revocable: 1,
            }
            quashApplication(param).then(res => {
                const { data } = res.data
                if (data.status === 0) {
                    this.$message.success('撤销成功')
                    this.getApplicationList(1)
                }
            })
        },
        userStatus() {
            getUserStatus().then(res => {
                this.tipsMsg = res.data
            }).catch(err => {
                this.tipsMsg = false
            })

        },
        changeStatis(item) {
            if (item.value == this.crtSign) return
            this.crtSign = item.value
        },
        searchList() {
            this.getApplicationList(1)
        },
        reset() {
            this.search = {
                approvalType: '',
                approvalStage: '',
                urgent: '',
                hasOpinions: '',
                adoptionSituation: '',
                updateTime: [1, 'asc'],
                updateTime2: [1, 'asc'],
                keywords: '',
                releaseTime: '',
                productLaunchDate: '',
                total: 0,
                loading: false
            }
            this.searchList()
        },
    }
}
</script>
<style lang="less" scoped>
.apply-center {
    overflow-y: auto;
    background: #F9FBFF;
    height: 100vh;


    .welcoming {
        font-size: 14px;
        font-weight: 400;
        line-height: 22px;
        letter-spacing: 0em;
        text-align: left;
        margin-bottom: 8px;

    }

    .tips {
        display: inline-block;
        color: #FA8C16;
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 22px;
        padding: 6px 12px;
        border-radius: 20px;
        background: #FFFCE8;
        margin-bottom: 8px;
        cursor: default;

        i {
            margin-right: 8px;
            font-size: 16px;
        }

    }

    .data-statistics {
        display: flex;
        align-items: center;
        position: relative;
        justify-content: space-between;


        &-item {
            margin-right: 24px;
            flex: 1;
            padding: 12px;
            padding-left: 24px;

            display: flex;
            cursor: pointer;
            // justify-content: center;

            .icon {
                box-sizing: border-box;
                width: 50px;
                height: 50px;
                border-radius: 50px;
                background: #F2F3F5;
                margin-right: 12px;
                position: relative;

                img {
                    width: 32px;
                    height: 32px;
                }

                .active-icon,
                .default-icon {
                    position: absolute;
                    top: 12px;
                    left: 9px;
                }

            }



            .name-count {
                font-size: 12px;
                font-style: normal;
                font-weight: 400;
                line-height: 20px;
                color: #505968;
                display: flex;
                flex-direction: column;


                .name {
                    margin-bottom: 8px;
                    word-break: keep-all;

                }

                .count {
                    color: #1D2128;
                    word-break: keep-all;
                    display: flex;
                    flex-wrap: nowrap;
                    align-items: flex-end;

                    i {
                        font-weight: 700;
                        line-height: 28px;
                        font-size: 20px;
                        margin-right: 8px;
                    }
                }
            }

        }

        &-item:hover {
            background: #fff;
            border-radius: 6px;

        }

        .active-item {
            .icon {

                .active-icon,
                .default-icon {
                    position: absolute;
                    top: 12px;
                    left: 7px;
                }

            }
        }

        .active-item {
            position: relative;
            border-radius: 8px;
            background: linear-gradient(90deg, #7B61FF 0%, #61A0FF 100%);

            .name-count,
            .count {
                color: #fff;
            }
        }

        .active-item::after {
            position: absolute;
            content: '';
            top: 70px;
            left: 50%;
            background-image: url('../../assets/image/apply-center/triangle.svg');
            transform: translateX(-50%);
            width: 18px;
            height: 18px;
            background-size: 100% 100%;


        }

        .new-apply {
            width: 120px !important;

            img {
                margin-bottom: 8px;
                width: 32px;
                height: 32px;
            }

            margin-right: 0;
            display: flex;
            padding: 6px 32px;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            align-self: stretch;
            border-radius: 6px;
            color: #2D5CF6;
            font-size: 14px;
            font-style: normal;
            font-weight: 700;
            line-height: 22px;
            /* 157.143% */
            background: linear-gradient(90deg, rgba(123, 97, 255, 0.15) 0%, rgba(97, 160, 255, 0.15) 100%);
        }

        .new-apply:hover {
            background: linear-gradient(90deg, rgba(123, 97, 255, 0.07) 0%, rgba(97, 160, 255, 0.07) 100%);

            img {
                width: 36px;
                height: 36px;
                margin-bottom: 4px;
            }
        }
    }

    .apply-content {
        border-radius: 10px;
        background: #FFF;
        padding: 24px;
        margin-top: 16px;
    }

    .filters {
        display: flex;

        justify-content: space-between;

        .filters-content {
            display: flex;
            flex-direction: column;
            flex: 1;

            /deep/ .el-input__inner {
                border-radius: 4px;
                border: none;
                background: #F7F8FA;
                color: #1D2128;
                font-size: 14px;
                font-weight: 400;
                line-height: 22px;

            }

            .floor1 {
                margin-bottom: 12px;
                padding-right: 16px;
                display: flex;
                justify-content: space-between;

                .el-select:last-of-type {
                    margin-right: 0;
                }

                /deep/ .el-select .el-input .el-select__caret::before {
                    font-family: element-icons !important;
                    content: "\e78f";
                }

                .descArrow,
                .ascArrow {
                    display: flex;
                    align-items: center;

                    &::before {
                        font-family: element-icons !important;
                        content: "\e6e6";
                        display: inline-block;
                        position: absolute;
                        top: 52%;
                        transform: translateY(-50%);
                        left: 12px;
                        color: #86909C;
                        z-index: 10;
                        font-size: 20px;
                    }

                    /deep/ .el-select__tags {
                        position: absolute;
                        left: 40px;
                        width: 0;
                        font-size: 14px;
                        font-style: normal;
                        font-weight: 400;
                        line-height: 22px;
                        color: #1D2128;

                        span {
                            display: none;
                        }
                    }

                }

                .descArrow {
                    &::before {
                        font-family: element-icons !important;
                        content: "\e6eb";
                        display: inline-block;
                        position: absolute;
                        top: 52%;
                        transform: translateY(-50%);
                        left: 12px;
                        color: #86909C;
                        z-index: 10;
                        font-size: 20px;
                    }
                }

                .floor1-item {
                    flex: 1;
                    display: flex;
                    margin-right: 16px;
                    justify-content: space-between;

                    .el-select {
                        width: 49%;


                    }
                }

                .floor1-item:last-of-type {
                    margin-right: 0;
                }
            }

            .floor2 {
                width: 100%;
                display: flex;
                padding-right: 16px;

                .el-input {
                    flex: 1;
                    margin-right: 16px;
                }

                .el-input:last-of-type {
                    margin-right: 0;
                }

                /deep/.el-date-editor {
                    position: relative;

                    .el-input__prefix {
                        position: relative;
                        right: 0;

                        .el-icon-date {
                            position: absolute;
                            right: 8px;
                            top: 50%;
                            transform: translateY(-50%);
                        }
                    }

                    .el-input__suffix {
                        right: 20px;
                    }

                }
            }

        }

        .export-reset {
            border-left: 1px dashed #E5E6EB;
            padding-left: 16px;
            display: flex;
            flex-direction: column;

            .el-button {
                height: 38px;
                padding: 6px 28px;
                border-radius: 6px;
                border: 1px solid #A8C5FF;
                background: #F0F6FF;
                margin-left: 0;
                margin-bottom: 12px;
            }

            .el-button:last-of-type {
                margin-bottom: 0;
            }
        }

    }

    .list {
        // margin-top: 16px;
    }
}
</style>

