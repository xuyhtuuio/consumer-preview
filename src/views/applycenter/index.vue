<template>
    <div class="apply-center">
        <p class="welcoming">欢迎来到消保管控平台！</p>
        <p class="tips">
            您有 2 笔【消保审查】任务待确认哦。请尽快确认！
        </p>
        <div class="data-statistics">
            <div v-for="(item, index) in dataStatistics" :key="index"
                :class="index !== 0 ? 'data-statistics-item' : 'data-statistics-item active-item'">
                <div class="icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="31" height="35" viewBox="0 0 31 35" fill="none"
                        class="default-icon" v-if="index !== 0">
                        <g filter="url(#filter0_d_813_7182)">
                            <path
                                d="M19.5853 4.39053C18.2143 3.79762 16.7543 3.5 15.292 3.5C13.8297 3.5 12.365 3.79762 10.9964 4.39287L6.10554 6.50904V12.5412C6.10085 13.9145 6.33754 15.276 6.79921 16.5696C7.24682 17.8351 7.88893 19.0209 8.69978 20.0849C9.52 21.1699 10.5113 22.112 11.6291 22.8806C12.7423 23.6423 13.9843 24.1907 15.2897 24.5C16.595 24.1883 17.83 23.6423 18.9408 22.8853C20.061 22.1214 21.05 21.1746 21.8702 20.0896C22.6881 19.0233 23.3349 17.8351 23.7848 16.5649C24.2465 15.2737 24.4808 13.9121 24.4785 12.5388V6.50904L19.5853 4.39053ZM20.3938 11.4679L18.1417 13.6614C18.1019 13.6989 18.0854 13.7528 18.0948 13.8067L18.6268 16.9048C18.6737 17.1743 18.3901 17.3758 18.1511 17.2516L15.3693 15.7893C15.3225 15.7635 15.2639 15.7635 15.217 15.7893L12.433 17.2539C12.1939 17.3805 11.9104 17.1766 11.9572 16.9071L12.4892 13.809C12.4962 13.7551 12.4798 13.7012 12.4423 13.6637L10.1902 11.4679C9.99573 11.278 10.1012 10.9476 10.373 10.9078L13.4828 10.4578C13.5367 10.4484 13.5836 10.4156 13.6047 10.3664L14.9944 7.5472C15.1163 7.30348 15.4631 7.30348 15.5826 7.5472L16.9746 10.3664C16.9981 10.4156 17.0449 10.4484 17.0965 10.4578L20.2063 10.9078C20.4805 10.9476 20.5883 11.278 20.3938 11.4679Z"
                                fill="url(#paint0_linear_813_7182)" />
                        </g>
                        <defs>
                            <filter id="filter0_d_813_7182" x="0.105469" y="1.5" width="30.3711" height="33"
                                filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                                <feColorMatrix in="SourceAlpha" type="matrix"
                                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                                <feOffset dy="4" />
                                <feGaussianBlur stdDeviation="3" />
                                <feComposite in2="hardAlpha" operator="out" />
                                <feColorMatrix type="matrix"
                                    values="0 0 0 0 1 0 0 0 0 0.384314 0 0 0 0 0.0313726 0 0 0 0.2 0" />
                                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_813_7182" />
                                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_813_7182"
                                    result="shape" />
                            </filter>
                            <linearGradient id="paint0_linear_813_7182" x1="6.10547" y1="14" x2="24.4785" y2="14"
                                gradientUnits="userSpaceOnUse">
                                <stop stop-color="#FF5C00" />
                                <stop offset="1" stop-color="#FFAE64" />
                            </linearGradient>
                        </defs>
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" width="33" height="37" viewBox="0 0 33 37" fill="none"
                        class="active-icon" v-else>
                        <g filter="url(#filter0_d_813_7171)">
                            <path
                                d="M23.1595 4.39053C21.7886 3.79762 20.3286 3.5 18.8662 3.5C17.4039 3.5 15.9392 3.79762 14.5706 4.39287L9.67976 6.50904V12.5412C9.67507 13.9145 9.91176 15.276 10.3734 16.5696C10.821 17.8351 11.4632 19.0209 12.274 20.0849C13.0942 21.1699 14.0855 22.112 15.2034 22.8806C16.3165 23.6423 17.5586 24.1907 18.8639 24.5C20.1692 24.1883 21.4042 23.6423 22.515 22.8853C23.6352 22.1214 24.6242 21.1746 25.4444 20.0896C26.2623 19.0233 26.9091 17.8351 27.359 16.5649C27.8207 15.2737 28.055 13.9121 28.0527 12.5388V6.50904L23.1595 4.39053ZM23.968 11.4679L21.7159 13.6614C21.6761 13.6989 21.6597 13.7528 21.669 13.8067L22.201 16.9048C22.2479 17.1743 21.9643 17.3758 21.7253 17.2516L18.9436 15.7893C18.8967 15.7635 18.8381 15.7635 18.7912 15.7893L16.0072 17.2539C15.7681 17.3805 15.4846 17.1766 15.5314 16.9071L16.0634 13.809C16.0704 13.7551 16.054 13.7012 16.0165 13.6637L13.7645 11.4679C13.5699 11.278 13.6754 10.9476 13.9472 10.9078L17.0571 10.4578C17.111 10.4484 17.1578 10.4156 17.1789 10.3664L18.5686 7.5472C18.6905 7.30348 19.0373 7.30348 19.1568 7.5472L20.5489 10.3664C20.5723 10.4156 20.6192 10.4484 20.6707 10.4578L23.7805 10.9078C24.0547 10.9476 24.1625 11.278 23.968 11.4679Z"
                                fill="url(#paint0_linear_813_7171)" />
                        </g>
                        <defs>
                            <filter id="filter0_d_813_7171" x="0.679688" y="3.5" width="30.3711" height="33"
                                filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                                <feColorMatrix in="SourceAlpha" type="matrix"
                                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                                <feOffset dx="-3" dy="6" />
                                <feGaussianBlur stdDeviation="3" />
                                <feComposite in2="hardAlpha" operator="out" />
                                <feColorMatrix type="matrix"
                                    values="0 0 0 0 0.447059 0 0 0 0 0.478431 0 0 0 0 1 0 0 0 0.4 0" />
                                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_813_7171" />
                                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_813_7171"
                                    result="shape" />
                            </filter>
                            <linearGradient id="paint0_linear_813_7171" x1="9.67969" y1="14.4773" x2="29.4307" y2="14.4773"
                                gradientUnits="userSpaceOnUse">
                                <stop stop-color="#7B61FF" />
                                <stop offset="1" stop-color="#61A0FF" />
                            </linearGradient>
                        </defs>
                    </svg>

                </div>
                <div class="name-count">
                    <span class="name">{{ item.name }}</span>
                    <span class="count"><i>{{ item.count }}</i> 个</span>
                </div>
            </div>
            <div class="data-statistics-item new-apply  pointer">
                <img src="@/assets/image/newApply.svg" alt="">
                新建申请
            </div>
        </div>
        <div class="apply-content">
            <div class="filters">
                <div class="filters-content">
                    <div class="floor1">
                        <el-select v-model="search.transactionType" placeholder="事项类型" @click="searchList">
                            <el-option v-for="(item, index) in transactionTypes" :key='index' :label="item.label"
                                :value="item.value"></el-option>
                        </el-select>
                        <el-select v-model="search.approvalPhase" placeholder="审批阶段" @click="searchList">
                            <el-option v-for="(item, index) in approvalPhases" :key='index' :label="item.label"
                                :value="item.value"></el-option></el-select>
                        <el-select v-model="search.isUrgent" placeholder="是否加急" @click="searchList">
                            <el-option v-for="(item, index) in isUrgents" :key='index' :label="item.label"
                                :value="item.value"></el-option>
                        </el-select>
                        <el-select v-model="search.isOpinion" placeholder="有/无实质意见" @click="searchList">
                            <el-option v-for="(item, index) in isOpinions" :key='index' :label="item.label"
                                :value="item.value"></el-option>
                        </el-select>
                        <el-select v-model="search.adoptionSituation" placeholder="采纳情况" @click="searchList">
                            <el-option v-for="(item, index) in adoptionSituations" :key='index' :label="item.label"
                                :value="item.value"></el-option>
                        </el-select>
                        <el-select v-model="search.updateTime2" placeholder="排序" multiple @click="searchList"
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
                        <el-date-picker v-model="search.sdate" clearable type="date" placeholder="请选择发起时间"
                            @clear="searchList" @click="searchList">
                        </el-date-picker>
                        <el-date-picker v-model="search.onlinedate" clearable type="date" placeholder="请选择产品上线时间"
                            @clear="searchList" @click="searchList">
                        </el-date-picker>
                    </div>
                </div>
                <div class="export-reset">
                    <el-button type="text">导出</el-button>
                    <el-button type="text" @click="reset">重置</el-button>

                </div>


            </div>
            <div class="list" v-if="list.length">
                <div v-for="(item, index) in list" :key="index">
                    <applyEventCard :item="item"></applyEventCard>
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
import applyEventCard from '@/components/common/apply-event-card'
export default {
    components: {
        applyEventCard
    },
    data() {
        return {
            dataStatistics: [{
                name: '全部申请',
                count: 10,
            },
            {
                name: '我的关注',
                count: 10,

            },
            {
                name: '待修改',
                count: 10,

            }, {
                name: '待确认',
                count: 10,

            }, {
                name: '审批中',
                count: 10,

            }, {
                name: '已撤销',
                count: 10,

            }, {
                name: '草稿箱',
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
            // list: [{ status: 1 },
            // { status: 2 },
            // { status: 3 },
            // { status: 4 },
            // { status: 5 }]
            list:[]


        }
    },
    mounted() {
        let dom = document.querySelectorAll('.arrow-select')[0].querySelector('.el-select__tags')
        this.$nextTick(() => {
            const text = this.search.updateTime[0] == 1 ? '发起时间' : '更新时间'
            dom.innerText = text
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
        searchList() {
        },
        reset() {
            this.search = {
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
            }
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

    }

    .data-statistics {
        display: flex;
        align-items: center;
        position: relative;
        justify-content: space-evenly;


        &-item {
            margin-right: 32px;
            padding: 12px;
            display: flex;
            cursor: pointer;

            .icon {
                box-sizing: border-box;
                width: 50px;
                height: 50px;
                justify-content: center;
                align-items: center;
                border-radius: 50px;
                background: #F2F3F5;
                margin-right: 12px;
                position: relative;


                .active-icon,
                .default-icon {
                    position: absolute;
                    width: 40px;
                    height: 40px;
                    top: 10px;
                    left: 6px;

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
        .active-item {
                .icon {
                    .active-icon,
                    .default-icon {
                        position: absolute;
                        width: 40px;
                        height: 40px;
                        top: 10px;
                        left: 4px;
                    }

                }
            }

        .active-item {
            // padding-left: 4px;
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


        }

        .new-apply {
            img {
                margin-bottom: 8px;
            }

            margin-right: 0;

            // position: absolute;
            // box-sizing: content-box;
            // right: 0;
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
                justify-content: space-evenly;

                .el-select {
                    margin-right: 16px;
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

    .list {
        // margin-top: 16px;
    }
}
</style>

