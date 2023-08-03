<template>
  <div class="approved-opinion-card">
    <slot name="head"></slot>
    <div v-for="(item, index) in opinions" :key="index" class="opinion-box">
      <p class="stuff">
        <i class="line"></i>
        <span>
          {{ item.stuff }} / {{ item.post }} <i>共{{ item.total }}条</i>
          {{ item.time }}
        </span>
        <i class="line"></i>
      </p>
      <div class="opinions">
        <div
          v-for="(child, idx) in item.substantiveopinion"
          :key="idx"
          class="opinions-item pointer"
        >
          <div class="opinion-tag">
            <span v-if="child.isSubstantive" class="guanzhu">
              <i class="iconfont icon icon-guanzhu"></i>
              有实质意见
            </span>
            <span v-if="!child.isSubstantive" class="guanzhu2">
              <i class="iconfont icon icon-guanzhu2"></i>
              无实质意见
            </span>
          </div>
          <p class="opinion-text">{{ idx + 1 }} {{ child.opinion }}</p>
          <div class="relevant-file">
            关联文件：<i class="file-name">{{ child.relevantfile[0] }} </i>
            <el-popover
              placement="bottom"
              popper-class="file-overview-popper"
              trigger="click"
              v-if="child.relevantfile && child.relevantfile.length - 1"
            >
              <div class="file-list">
                <div
                  class="file-list-item pointer"
                  v-for="(file, i) in child.relevantfile"
                  :key="i"
                >
                  {{ file }}
                </div>
              </div>
              <i slot="reference">+{{ child.relevantfile.length - 1 }}</i>
            </el-popover>
          </div>
          <!-- 审批的时候选择采纳与否 -->
          <div class="accept-box" v-if="status == '3' || status == '5'">
            <el-radio-group
              v-model="child.isAccept"
              @change="changeAccept(child, index, idx)"
            >
              <el-radio :label="1">采纳</el-radio>
              <el-radio :label="0">不采纳</el-radio>
            </el-radio-group>
            <el-form
              :model="child"
              :ref="`form_${index}_${idx}`"
              :class="`form_${index}_${idx}`"
              :rules="child.isAccept == 0 ? rules : {}"
              class="desc-form"
            >
              <el-form-item prop="desc" label=" " class="flex">
                <el-input
                  v-model="child.desc"
                  class="input-desc"
                  :ref="`input_${index}_${idx}`"
                  :placeholder="
                    child.isAccept == 1 ? '请填写采纳说明' : '请填写不采纳说明'
                  "
                ></el-input>
              </el-form-item>
            </el-form>
          </div>
          <!-- 正常显示采纳与否 -->
          <div class="isAdopt-box" v-if="status == '4'">
            <span v-if="child.isAccept == 1" class="accept">已采纳</span>
            <span v-else class="no-accept">不采纳</span>
            <div v-if="child.isAccept !== 1" class="desc">
              【反馈】显示确认人在确认时输入的反馈内容
            </div>
          </div>
        </div>
      </div>
    </div>
    <slot name="foot"></slot>
  </div>
</template>
<script>
export default {
  props: {
    // 3 5显示复选框 4 显示已采纳 不采纳
    status: { type: Number, default: 0 },
  },
  data() {
    return {
      rules: {
        desc: [
          {
            required: true,
            message: "请填写说明",
            trigger: ["blur", "change"],
          },
        ],
      },
      opinions: [
        {
          stuff: "谭新宇",
          post: "产品研发与推广岗",
          total: 2,
          time: "2023-07-14",
          substantiveopinion: [
            {
              opinion:
                "1.活动应明确参与条件，如“达标私钻”专享，避免引起歧义，引发金融消费者不满；如存在收费情况，应提前向金融消费者明示，尊重金融消费者知情权",
              relevantfile: [
                "理财公司理财.png",
                "理财公司理财.png",
                "理财公司理财.png",
                "理财公司理财.png",
              ],
              isSubstantive: false,
              isAccept: 0,
              desc: "",
            },
            {
              opinion:
                "1.活动应明确参与条件，如“达标私钻”专享，避免引起歧义，引发金融消费者不满；如存在收费情况，应提前向金融消费者明示，尊重金融消费者知情权",
              relevantfile: [
                "理财公司理财.png",
                "理财公司理财.png",
                "理财公司理财.png",
                "理财公司理财.png",
              ],
              isAccept: 1,
              desc: "",
              isSubstantive: true,
            },
          ],
        },
        {
          stuff: "谭新宇",
          post: "产品研发与推广岗",
          total: 2,
          time: "2023-07-14",
          substantiveopinion: [
            {
              opinion:
                "1.活动应明确参与条件，如“达标私钻”专享，避免引起歧义，引发金融消费者不满；如存在收费情况，应提前向金融消费者明示，尊重金融消费者知情权",
              relevantfile: [
                "理财公司理财.png",
                "理财公司理财.png",
                "理财公司理财.png",
                "理财公司理财.png",
              ],
              isSubstantive: false,
              isAccept: 0,
              desc: "",
            },
            {
              opinion:
                "1.活动应明确参与条件，如“达标私钻”专享，避免引起歧义，引发金融消费者不满；如存在收费情况，应提前向金融消费者明示，尊重金融消费者知情权",
              relevantfile: [
                "理财公司理财.png",
                "理财公司理财.png",
                "理财公司理财.png",
                "理财公司理财.png",
              ],
              isAccept: 1,
              desc: "",
              isSubstantive: true,
            },
          ],
        },
      ],
    };
  },
  methods: {
    // 先获取详情
    changeAccept(child, index, idx) {
      if (child.isAccept == 1) {
        const form = `form_${index}_${idx}`;
        this.$nextTick(() => {
          this.$refs[form][0].clearValidate();
        });
      }
    },
    keep() {
      const inputArr = [];
      for (let i = 0; i < this.opinions.length; i++) {
        for (let j = 0; j < this.opinions[i].substantiveopinion.length; j++) {
          const form = `form_${i}_${j}`;
          this.$refs[form][0].validate((valid) => {
            if (valid) {
            } else {
              const ref = `input_${i}_${j}`;
              inputArr.push(ref);
            }
          });
        }
      }
      this.$refs[inputArr[0]][0].focus();
    },
    submit() {
      console.log("vv");
    },
    
  },
};
</script>
<style lang="less" scoped>
.approved-opinion-card {
  .opinion-box {
    margin-bottom: 12px;

    .stuff {
      display: flex;
      align-items: center;
      margin-bottom: 12px;

      .line {
        flex: 1;
        width: 100%;
        border-top: 1px dashed #e5e6eb;
      }

      span {
        color: #86909c;
        font-size: 12px;
        font-weight: 400;
        line-height: 20px;
        margin: 0 10px;
      }

      i {
        margin: 0 10px;
      }
    }

    .opinions {
      width: 100%;
      font-size: 12px;
      font-weight: 400;
      line-height: 20px;

      .opinions-item {
        border-radius: 10px;
        background: #f7f8fa;
        padding: 16px 16px 12px 16px;
        margin-bottom: 8px;
        position: relative;

        .opinion-tag {
          position: absolute;
          top: 0;
          left: -4px;
          border-radius: 0px 6px 6px 6px;
          color: #fff;
          font-style: normal;
          line-height: 14px;
          overflow: hidden;
          font-size: 10px;
          -webkit-transform: scale(0.8);

          .guanzhu {
            display: inline-block;
            padding: 2px 4px;
            border-radius: 0px 6px 6px 6px;
            background: linear-gradient(90deg, #e85167 0%, #ff8193 100%);
          }

          .guanzhu2 {
            display: inline-block;
            padding: 2px 4px;
            border-radius: 0px 6px 6px 6px;
            background: linear-gradient(90deg, #7b61ff 0%, #61a0ff 100%);
          }
        }

        .opinion-text {
          color: #1d2128;
          text-align: justify;
          margin-bottom: 6px;
        }

        .relevant-file {
          color: #86909c;
          display: flex;
          align-items: center;

          .file-name {
            margin: 0 8px 0 0;
            background: #fff;
            padding: 2px 12px;
          }

          i {
            color: #306ef5;
          }
        }
        .accept-box {
          margin-top: 8px;
          /deep/ .el-radio .el-radio__input.is-checked + .el-radio__label,
          /deep/ .el-radio .el-radio__label {
            color: #1d2128;
            font-weight: 400;
            line-height: 20px;
            font-size: 12px;
          }
          /deep/ .el-form {
            margin-top: 8px;
            .el-form-item__label {
              padding-right: 8px;
            }
            .el-form-item__content {
              flex: 1;
            }
            .el-form-item__error::before {
              font-family: element-icons !important;
              content: "\e7a3";
              font-size: 20px;
              margin-right: 8px;
            }
            .el-form-item__error {
              display: flex;
              align-items: center;
              margin-top: 6px;
              color: #eb5757;
            }
            .el-input {
              .el-input__inner {
                border: none;
              }

              border-radius: 4px;
              background: #fff;
              box-shadow: 1px 1px 5px 0px rgba(45, 92, 246, 0.15);
            }
          }
        }
        .isAdopt-box {
          span {
            display: inline-block;
            border-radius: 0px 6px 6px 6px;
            color: #fff;
            font-size: 10px;
            font-weight: 700;
            line-height: 18px;
            padding: 0px 6px;
          }
          .accept {
            background: #74e4bd;
          }
          .no-accept {
            background: #f98981;
          }
        }
        .desc {
          margin-top: 10px;
          padding: 4px 8px;
          border-radius: 4px;
          background: #f7f8fa;
          color: #86909c;
          font-size: 12px;
          font-style: normal;
          font-weight: 400;
          line-height: 20px;
          box-shadow: 1px 1px 5px 0px rgba(45, 92, 246, 0.15);
        }
      }
    }
    .opinions-item:hover {
      background: #f0f6ff;
      .opinion-text {
        color: #2d5cf6;
      }
    }
  }
}
</style>
<style lang="less">
.file-overview-popper {
  max-width: 422px;
  padding: 8px 12px;
  padding-bottom: 0;
  box-shadow: 0px 0px 10px 0px rgba(67, 67, 67, 0.1);

  .file-list {
    // display: flex;
    // flex-wrap: wrap;

    .file-list-item {
      display: inline-block;
      // width: 31%;
      border-radius: 4px;
      background: #f7f8fa;
      padding: 2px 12px;
      color: #306ef5;
      font-size: 12px;
      font-weight: 400;
      line-height: 20px;
      margin-bottom: 8px;
    }
    .file-list-item:nth-of-type(n+2) {
      margin-left: 12px;
    }
  }
}
</style>