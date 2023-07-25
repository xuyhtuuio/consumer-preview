<template>
    <div class="approval-event-card">
        <div class="event-info">
            <div class="event-name-status">
                <!-- 加急 -->
                <svg class="icon urgent-icon" aria-hidden="true"  v-if="item.urgent == 1">
                    <use xlink:href="#icon-shenpiyemiantubiao"></use>
                </svg>
                <svg class="icon urgent-icon" aria-hidden="true"   v-if="item.dismissalMark == 1">
                    <use xlink:href="#icon-tongyongtubiao2"></use>
                </svg>
                <span class="event-name">{{ item.name }}</span>
                <span class="event-status">
                    <i class="tag in-approval">审批中>消保中心审批</i>
                    <i class="tag in-analysis">智能解析中，请您耐心等待...</i>
                </span>
            </div>
            <div class="event-infos">
                <span class="id">{{ item.taskNumber }}</span>
                <span class="sDate date">发起时间：{{ item.launchDate || "--" }}</span>
                <span class="sDate date">更新时间：{{ item.update_time || "--" }}</span>
                <span class="sDate date">上线时间：{{ item.launchDate || "--" }}</span>

                <!-- <span class="handler date">当前处理人：王明明</span> -->
                <el-popover placement="bottom" trigger="hover" popper-class="popper-persons">
                    <div>财富平台部门 | 财富客群团队</div>
                    <span slot="reference" class="handler date">当前处理人：王明明</span>
                </el-popover>
                <span class="handler">
                    <i class="iconfont icon-dept"></i>
                    北京银行XX分行</span>
            </div>
        </div>
        <div class="right-operation">
            <span class="attention icon-op">
                <svg class="icon urgent-icon" aria-hidden="true">
                    <use xlink:href="#icon-tubiao3"></use>
                </svg>
                审查
            </span>
            <span class="modify icon-op">
                <svg class="icon urgent-icon" aria-hidden="true">
                    <use xlink:href="#icon-xianxingtubiao"></use>
                </svg>
                修改
            </span>
            <span class="attention no-attention icon-op" v-if="!item.concernId" @click="concern(item)">
                <svg class="icon urgent-icon" aria-hidden="true">
                    <use xlink:href="#icon-tubiao-1"></use>
                </svg>
                关注</span>
            <span class="attention has-attention icon-op" v-else>
                <svg class="icon urgent-icon" aria-hidden="true">
                    <use xlink:href="#icon-guanzhu-1"></use>
                </svg>已关注</span>
        </div>
    </div>
</template>
<script>
import { concernApplication } from "@/api/approvalCenter";
export default {
    name: "applyEventCard",
    props: {
        item: {
            type: Object,
            default: () => { },
        },
    },
    data() {
        return {
            allowConcernClick: true,
        };
    },
    methods: {
        concern(item) {
            if (!this.allowConcernClick) return;
            const param = {
                recordId: item.id,
            };
            this.allowConcernClick = true;
            concernApplication(param).then((res) => {
                if (res.status == 200) {
                    this.$message.success(res.data.msg);
                    this.allowConcernClick = true;
                    item.concernId = item.concernId == 1 ? 0 : 1;
                }
                this.allowConcernClick = false;
            });
        },
    },
};
</script>
<style lang="less" scoped>
.approval-event-card {
    margin: 16px 0;
    padding: 12px 24px 12px 12px;
    border-radius: 8px;
    border: 1px solid #f2f3f5;
    background: #fff;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .event-info {
        flex: 1;

        .event-name-status {
            margin-bottom: 17px;
            display: flex;
            align-items: center;
        }

        .urgent-icon {
            margin-right: 8px;
            width: 16px;
            height: 16px;
        }

        .event-name {
            color: #1d2128;
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
                    font-size: 20px;
                    line-height: 22px;
                    margin-right: 4px;
                }
            }

            .draft {
                background: #f0f6ff;
                color: #2d5cf6;
            }

            .end-sign {
                background: #ecfeec;
                color: #50b142;
            }

            .has-opinion {
                color: #eb5757;
                background: #fff1f0;
            }

            .no-opinion {
                background: #e7f0ff;
                color: #2d5cf6;
            }

            .in-approval {
                border-radius: 4px;
                background: #fff7e6;
                color: #fa8c16;
            }

            .in-analysis {
                border-radius: 4px;
                background: #fff1f0;
                color: #f76560;
            }
        }

        .event-infos {
            .id {
                color: #2d5cf6;
                font-size: 14px;
                font-style: normal;
                font-weight: 400;
                line-height: 22px;
                margin-right: 12px;
                /* 157.143% */
            }

            .date:after {
                content: "";
                display: inline-block;
                width: 1px;
                height: 10px;
                background: #e5e6eb;
                margin: 0 12px;
            }

            .sDate {
                color: #86909c;
                font-size: 14px;
                font-style: normal;
                font-weight: 400;
                line-height: 22px;
                /* 157.143% */
            }

            .handler {
                color: #1d2128;
                font-family: Microsoft YaHei;
                font-size: 14px;
                font-style: normal;
                font-weight: 400;
                line-height: 22px;

                /* 157.143% */
                i {
                    color: #2d5cf6;
                }
            }
        }
    }

    .right-operation {
        width: 250px;
        display: flex;
        justify-content: flex-end;

        .icon {
            width: 20px !important;
            height: 20px !important;
            margin-right: 2px;
        }

        .icon-op {
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
            color: #2d5cf6;

            /* 157.143% */
        }

        .attention:hover {
            border-radius: 2px;
            background: #e7f0ff;
            padding: 4px 8px 4px 4px;
        }

        .no-attention {
            color: #2d5cf6;
        }

        .has-attention {
            color: #1d2128;
        }

        .modify {
            color: #ffa940;
            font-size: 14px;
            font-style: normal;
            font-weight: 400;
            line-height: 22px;
        }

        .modify:hover {
            border-radius: 2px;
            background: #fff7e6;
            padding: 4px 8px 4px 4px;
        }

        .no-attention,
        .del {
            margin-right: 16px !important;
        }
    }
}

.approval-event-card:hover {
    background: #f7f8fa;
}
</style>