<template>
    <div class="approval-center">
        <p class="welcoming">欢迎来到消保管控平台！</p>
        <p class="tips">
            您有 2 笔【消保审查】任务待确认哦。请尽快确认！
        </p>
        <div class="data-statistics">
            <div v-for="(item, index) in dataStatistics" :key="index"
                :class="index !== 0 ? 'data-statistics-item' : 'data-statistics-item active-item'">
                <div class="icon">
                    <img src="@/assets/image/apply-center/attention.png" alt="" v-if="index !== 0" class="active-icon">
                    <img src="@/assets/image/apply-center/no-attention.png" v-else alt="" class="default-icon">
                </div>
                <div class="name-count">
                    <span class="name">{{ item.name }}</span>
                    <span class="count"><i>{{ item.count }}</i> 个</span>
                </div>
            </div>
        </div>
        <div class="apply-content">
            <div class="filters">
                <div class="filters-content">
                    <div class="floor1">
                        <el-select v-model="search.transactionType" placeholder="审批类型">
                            <el-option v-for="(item, index) in transactionTypes" :key='index' :label="item.label"
                                :value="item.value"></el-option>
                        </el-select>
                        <el-select v-model="search.approvalPhase" placeholder="审批阶段">
                            <el-option v-for="(item, index) in approvalPhases" :key='index' :label="item.label"
                                :value="item.value"></el-option></el-select>
                        <el-select v-model="search.isUrgent" placeholder="是否加急">
                            <el-option v-for="(item, index) in isUrgents" :key='index' :label="item.label"
                                :value="item.value"></el-option>
                        </el-select>
                        <el-select v-model="search.isOpinion" placeholder="有/无实质意见">
                            <el-option v-for="(item, index) in isOpinions" :key='index' :label="item.label"
                                :value="item.value"></el-option>
                        </el-select>
                        <el-select v-model="search.adoptionSituation" placeholder="采纳情况">
                            <el-option v-for="(item, index) in adoptionSituations" :key='index' :label="item.label"
                                :value="item.value"></el-option>
                        </el-select>
                        <el-select v-model="search.billOrganization" placeholder="提单机构">
                            <el-option v-for="(item, index) in adoptionSituations" :key='index' :label="item.label"
                                :value="item.value"></el-option>
                        </el-select>
                        <el-select v-model="search.updateTime2" placeholder="排序" multiple
                            :class="search.updateTime2[1] == 'desc' ? 'arrow-select descArrow' : 'arrow-select ascArrow'">
                            <el-option-group v-for="group in updateTimeGroup" :key="group.label">
                                <el-option v-for="item in group.options" :key="item.value" :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-option-group>
                        </el-select>
                    </div>
                    <div class="floor2">
                        <el-input v-model="search.searchKey" placeholder="请输入项目名称关键词查询" clearable @clear="searchList"
                            @keyup.enter.native="searchList">
                            <i slot="suffix" class="el-input__icon el-icon-search pointer" @click="searchList"></i>
                        </el-input>
                        <el-date-picker v-model="search.sdate" clearable type="date" placeholder="请选择发起时间">
                        </el-date-picker>
                        <el-date-picker v-model="search.onlinedate" clearable type="date" placeholder="请选择产品上线时间">
                        </el-date-picker>
                    </div>
                </div>
                <div class="export-reset">
                    <el-button type="text">导出</el-button>
                    <el-button type="text">重置</el-button>

                </div>

            </div>
            <div class="list" v-if="list.length">
                <div v-for="(item, index) in list" :key="index">
                    <approvalEventCard :item="item"></approvalEventCard>
                </div>
                <trs-pagination :total="list.length"></trs-pagination>
            </div>
            <div v-else>
                <el-empty :image="require('../../assets/image/empty.png')" image-size="292">
                </el-empty>
            </div>
        </div>


    </div>
</template>
<script>
import approvalEventCard from '@/components/common/approval-event-card'
export default {
    components: {
        approvalEventCard
    },
    data() {
        return {
            crtSign: 'approval',
            dataStatistics: [
                {
                    name: '待审批',
                    count: 10,
                    value: 'approval'

                }, {
                    name: '已审批',
                    count: 10,

                }, {
                    name: '待修改',
                    count: 10,

                }, {
                    name: '我的关注',
                    count: 10,

                }, {
                    name: '全部任务',
                    count: 10,
                },

            ],
            search: {
                transactionType: '',
                approvalPhase: '',
                isUrgent: '',
                isOpinion: '',
                adoptionSituation: '',
                updateTime: [1, 'asc'],
                updateTime2: [1, 'asc'],
                searchKey: '',
                sdate: '',
                onlinedate: '',
                billOrganization: '',

            },
            transactionTypes: [
                { label: '产品类', value: '1' },
                { label: '活动类', value: '2' },
                { label: '客户类', value: '3' },
            ],
            approvalPhases: [
                { label: '负责人审批', value: '1' },
                { label: '负责人复核', value: '2' },
                { label: '消保审批', value: '3' },
            ],
            isUrgents: [
                { label: '是', value: '1' },
                { label: '否', value: '2' },
            ],
            isOpinions: [
                { label: '有', value: '1' },
                { label: '无', value: '2' },
            ],
            adoptionSituations: [
                { label: '有', value: '1' },
                { label: '无', value: '2' },
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
            list: [{ status: 1 },
            { status: 2 },
            { status: 3 },
            { status: 4 },
            { status: 5 }]
        }
    },
    mounted() {
        let dom = document.querySelectorAll('.arrow-select')[0].querySelector('.el-select__tags')
        this.$nextTick(() => {
            const text = this.search.updateTime[0] == 1 ? '发起时间' : '更新时间'
            dom.innerText = text
        })
        this.resize()
        window.addEventListener('resize', () => {
            this.resize()
        })

    },
    watch: {

        'search.updateTime2'(val) {
            const lastKey = val[val.length - 1]
            if (val.length < 2) {
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
            })
            this.searchList()
        }
    },
    methods: {
        resize() {
            let floor2 = document.querySelectorAll('.floor2')[0]
            floor2.style.paddingRight = floor2.offsetWidth * (1 / 7) + 16 + 'px'
        },
        searchList() {
            console.log('search', this.search.updateTime)
        },
    }
}
</script>
<style lang="less" scoped>
.approval-center {
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

    }

    .data-statistics {
        display: flex;
        align-items: center;
        position: relative;

        &-item {
            margin-right: 32px;
            padding: 12px;
            display: flex;
            cursor: pointer;

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

                .active-icon,
                .default-icon {
                    position: absolute;
                    width: 40px;
                    height: 40px;
                    top: 10px;
                    left: 6px;

                }


                .name {
                    margin-bottom: 8px;

                }

                .count {
                    color: #1D2128;

                    i {
                        font-weight: 700;
                        line-height: 28px;
                        font-size: 20px;
                    }
                }
            }

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
            background-image: url('../../assets//image/triangle.svg');
            transform: translateX(-50%);
            width: 18px;
            height: 18px;
            background-size: 100% 100%;
            // display: inline-block;
            // border: 9px solid;
            // border-color: #707FFF transparent transparent transparent;

        }

        .new-apply {
            img {
                margin-bottom: 8px;
            }

            position: absolute;
            box-sizing: content-box;
            right: 0;
            // height: 68px;
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

                .el-select {
                    margin-right: 16px;
                    flex: 1;
                }

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
}
</style>

