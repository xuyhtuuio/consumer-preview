<template>
    <div class="ocr-aIknowledge-base">
        <p class="poppver-title">
            <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-a-Rectangle143"></use>
            </svg>
            AI知识语料库
        </p>

        <div class="keywords">
            <el-input v-model="search.keywords" placeholder="请输入关键词进行查询" clearable @clear="searchList(1)"
                @keyup.enter.native="searchList(1)">
                <i slot="suffix" class="el-input__icon el-icon-search pointer" @click="searchList(1)"></i>
            </el-input>
        </div>
        <div class="list-content">
            <div class="list" v-loading="search.loading" v-if="search.total > 0">
                <div v-for="(item, index) in search.list" :key="index" class="item pointer">
                    <div class="base-left">
                        <i class="iconfont icon-fuzhi" @click="copy(item)"></i>
                        <p>
                            <span>
                                <i class="name">{{ item.name }}</i>
                                <i
                                    :class="{ 'word': true, 'sensitive-word': item.type === '敏感词', 'stop-word': item.type === '禁用词' }">{{
                                        item.type }}</i>
                            </span>
                        </p>
                        <p class="content">
                            {{ item.content }}
                        </p>
                    </div>
                    <div class="base-citation">
                        <p>近期引用</p>
                        <p class="count">{{ item.count }}</p>
                    </div>


                </div>
                <trs-pagination :total="search.total" @getList="searchList"></trs-pagination>
            </div>
            <div v-else v-loading="search.loading">
                <el-empty :image="require('@/assets/image/empty.png')" :image-size="imageSize">
                </el-empty>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'aiknowledge-base',
    data() {
        return {
            search: {
                keywords: '',
                total: 1,
                loading: false,
                imageSize: 292,
                list: [
                    {
                        name: '业绩比较基准 1',
                        type: '禁用词',
                        content: '根据《理财公司理财产品销售管理暂行办法（银保监会令[2021]4号》，理财产品销售机构不得使用未说明选择原因、测算依据或计算方法的业绩比较基准，单独或突出使用绝对数值、区间数值展示业绩比较基准。不得预测理财产品的投资业绩，或者出具、宣传理财产品预期收益率。请修改。',
                        count: '10',
                    },
                    {
                        name: '业绩比较基准 1',
                        type: '敏感词',
                        content: '根据《理财公司理财产品销售管理暂行办法（银保监会令[2021]4号》，理财产品销售机构不得使用未说明选择原因、测算依据或计算方法的业绩比较基准，单独或突出使用绝对数值、区间数值展示业绩比较基准。不得预测理财产品的投资业绩，或者出具、宣传理财产品预期收益率。请修改。',
                        count: '10',
                    }, {
                        name: '业绩比较基准 1',
                        type: '禁用词',
                        content: '根据《理财公司理财产品销售管理暂行办法（银保监会令[2021]4号》，理财产品销售机构不得使用未说明选择原因、测算依据或计算方法的业绩比较基准，单独或突出使用绝对数值、区间数值展示业绩比较基准。不得预测理财产品的投资业绩，或者出具、宣传理财产品预期收益率。请修改。',
                        count: '10',
                    }, {
                        name: '业绩比较基准 1',
                        type: '禁用词',
                        content: '根据《理财公司理财产品销售管理暂行办法（银保监会令[2021]4号》，理财产品销售机构不得使用未说明选择原因、测算依据或计算方法的业绩比较基准，单独或突出使用绝对数值、区间数值展示业绩比较基准。不得预测理财产品的投资业绩，或者出具、宣传理财产品预期收益率。请修改。',
                        count: '10',
                    }
                ],
            }

        }
    },
    methods: {
        searchList(pageNow) {
            const params = {
                keyword: this.search.keywords,
                pageNow,
                pageSize: 5
            }
        },
        copy(item) {
            const input = document.createElement('input');
            input.value = item.content;
            document.body.appendChild(input);
            input.select();
            document.execCommand('Copy');
            this.$message.success('复制成功！')
        }
    }
}

</script>
<style lang="less" scoped>
.ocr-aIknowledge-base {
    width: 600px;
    height: 100%;
    overflow: hidden;

    .poppver-title {
        color: #1D2128;
        font-size: 16px;
        font-style: normal;
        font-weight: 400;
        line-height: 24px;
        margin-bottom: 36px;

        .icon {
            font-size: 20px;

        }
    }

    .keywords {
        margin-bottom: 24px;

        /deep/ .el-input .el-input__inner {
            background: #F7F8FA;
            border-radius: 32px;
            border: none;
        }
    }

    .list-content {
        height: 82%;
        overflow: auto;
    }

    .list {
        .item:hover {
            background: #F9FBFF;

            .base-left .iconfont {
                display: block;
            }
        }


        .item {
            padding: 12px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px dashed #E5E6EB;

            .base-left {
                color: #1D2128;
                font-size: 14px;
                font-weight: 700;
                line-height: 22px;
                position: relative;

                .iconfont {
                    display: none;
                    position: absolute;
                    right: 0;
                    top: 14px;
                    font-size: 14px;
                    color: rgba(45, 92, 246, 1);
                }

                p {
                    margin-bottom: 8px;
                }

                .content {

                    font-size: 12px;
                    line-height: 20px;
                    font-weight: 400;
                }

                .word {
                    margin-left: 12px;
                    display: inline-block;
                    padding: 6px 20px;
                    border-radius: 4px;
                    font-size: 12px;
                    font-weight: 700;
                    line-height: 20px;
                }

                .stop-word {
                    background: #FDF1F4;
                    color: #EB5D78;

                }

                .sensitive-word {
                    background: #F9FBFF;
                    color: #FDB123;

                }
            }

            .base-citation {
                margin-left: 10px;
                min-width: 60px;
                display: block;

                p {
                    text-align: center;
                    font-size: 14px;
                    font-weight: 400;
                    line-height: 22px;
                    color: #86909C;
                }

                .count {
                    color: #505968;
                    font-size: 20px;
                    font-weight: 700;
                    line-height: 28px;
                }


            }


        }
    }


}</style>