<template>
    <div class="approval-event-card">
        <div class="event-info">
            <div class="event-name-status">
                <!-- 加急 -->
                <svg class="icon urgent-icon" aria-hidden="true">
                    <use xlink:href="#icon-shenpiyemiantubiao"></use>
                </svg>
                <svg class="icon urgent-icon" aria-hidden="true">
                    <use xlink:href="#icon-tongyongtubiao2"></use>
                </svg>
                <span class="event-name">景顺长城集英成长7月报景顺长城集英成长7月报景顺长城集英成长7月报景顺长城集英成长7月报</span>
                <span class="event-status">
                    <i class="tag in-approval">审批中>消保中心审批</i>
                </span>
            </div>
            <div class="event-infos">
                <span class="id">202307075091985</span>
                <span class="sDate date">发起时间：2023-07-07</span>
                <span class="sDate date">更新时间：2023-07-07</span>
                <span  class="sDate date">上线时间：2023-08-08</span>


                <!-- <span class="handler date">当前处理人：王明明</span> -->
                <el-popover placement="bottom" trigger="hover" popper-class="popper-persons">
                    <div>财富平台部门 | 财富客群团队</div>
                    <span slot="reference" class="handler date">当前处理人：王明明</span>
                </el-popover>

                <span class="handler">
                    <svg class="icon urgent-icon" aria-hidden="true">
                        <use xlink:href="#icon-xianxingtubiao1"></use>
                    </svg>
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
            <span class="attention no-attention icon-op" v-if="Math.random() > 0.5">
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
export default {
    name:'applyEventCard',
    props: {
        item: {
            type: Object,
            default: () => { }
        }
    },
    data() {
        return {

        }
    }
}
</script>
<style lang="less" scoped>
.approval-event-card {
    margin: 16px 0;
    padding: 12px 24px 12px 12px;
    border-radius: 8px;
    border: 1px solid #F2F3F5;
    background: #FFF;
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
            color: #1D2128;
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
                background: #F0F6FF;
                color: #2D5CF6;
            }

            .end-sign {
                background: #ECFEEC;
                color: #50B142;

            }

            .has-opinion {
                color: #EB5757;
                background: #FFF1F0;
            }

            .no-opinion {
                background: #E7F0FF;
                color: #2D5CF6;

            }


            .in-approval {
                border-radius: 4px;
                background: #FFF7E6;
                color: #FA8C16;

            }
        }

        .event-infos {
            .id {
                color: #2D5CF6;
                font-size: 14px;
                font-style: normal;
                font-weight: 400;
                line-height: 22px;
                margin-right: 12px;
                /* 157.143% */
            }

            .date:after {
                content: '';
                display: inline-block;
                width: 1px;
                height: 10px;
                background: #E5E6EB;
                margin: 0 12px;

            }

            .sDate {
                color: #86909C;
                font-size: 14px;
                font-style: normal;
                font-weight: 400;
                line-height: 22px;
                /* 157.143% */

            }

            .handler {
                color: #1D2128;
                font-family: Microsoft YaHei;
                font-size: 14px;
                font-style: normal;
                font-weight: 400;
                line-height: 22px;

                /* 157.143% */
                i {
                    color: #2D5CF6;
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
            color: #2D5CF6;

            /* 157.143% */
        }

        .attention:hover {
            border-radius: 2px;
            background: #E7F0FF;
            padding: 4px 8px 4px 4px;
        }

        .no-attention {
            color: #2D5CF6;
        }

        .has-attention {
            color: #1D2128;
        }

        .modify {
            color: #FFA940;
            font-size: 14px;
            font-style: normal;
            font-weight: 400;
            line-height: 22px;

        }

        .modify:hover {
            border-radius: 2px;
            background: #FFF7E6;
            padding: 4px 8px 4px 4px;

        }





        .no-attention,
        .del {
            margin-right: 16px !important;
        }
    }
}

.approval-event-card:hover {
    background: #F7F8FA;

}
</style>