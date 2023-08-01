<template>
    <div class="ocr-apply-form">
        <order-basic-info :sidebarParam="sidebarParam">
            <template slot="apply-modify">
                <el-button type="text" class="apply-modify">
                    <i class="icon el-icon-edit-outline"></i>修改申请单
                </el-button>
            </template>

        </order-basic-info>
    </div>
</template>
<script >
import orderBasicInfo from '@/components/card/order-basic-info'
export default {
    props: {
        sidebarParam: {
            type: Object,
            default: () => { }
        }
    },
    components: {
        orderBasicInfo
    },
    data() {
        return {
        }
    }
}

</script>
<style lang="less" scoped>
.ocr-apply-form {
    width: 600px;
    height: 100%;
    overflow-y: auto;

    .apply-modify {
        padding: 6px 16px 6px 18px;
        margin-left: 16px;
        border-radius: 6px;
        background: #2D5CF6;
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 22px;
        color: #FFF;

        .icon {
            margin-right: 7px;
            font-size: 16px;
        }



    }


}
</style>