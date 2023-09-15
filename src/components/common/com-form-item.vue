<template>
    <el-form-item :class="['com-form-item', item.name, item?.props?.expanding?.toString()]">
      <label slot="label"
        >{{ item.title
        }}<span :style="{ color: 'red', opacity: item.props.required || 0 }"> * </span></label
      >
      <el-input
        v-if="item.name === 'TextInput'"
        :disabled="item.perm === 'R'"
        v-model.trim="item.value"
        :placeholder="item.props.placeholder"
      ></el-input>

      <el-select
        v-else-if="item.name === 'SelectInput' && !item.props.expanding"
        :disabled="item.perm === 'R'"
        v-model.trim="item.value"
        :placeholder="item.props.placeholder"
      >
        <el-option
          v-for="(iten, indey) in item.props.options"
          :key="indey"
          :label="iten.value"
          :value="iten.id"
        ></el-option>
      </el-select>

      <el-radio-group
        v-else-if="item.name === 'SelectInput' && item.props.expanding"
        :disabled="item.perm === 'R'"
        v-model.trim="item.value"
      >
        <el-radio v-for="(iten, indey) in item.props.options" :key="indey" :label="iten.id">{{
          iten.value
        }}</el-radio>
      </el-radio-group>

      <el-checkbox-group
        v-else-if="item.name === 'MultipleSelect' && item.props.expanding"
        v-model.trim="item.value"
        :disabled="item.perm === 'R'"
      >
        <template v-for="(iten, indey) in item.props.options">
          <el-checkbox :key="indey" :label="iten.id">{{ iten.value }}</el-checkbox>
        </template>
      </el-checkbox-group>

      <div class="groups-select" v-else-if="item.name === 'MultipleGroupsSelect'">
        <div v-for="iten in item.props.options" :key="iten.id">
          <p class="group-title">{{ iten.value }}</p>
          <el-checkbox-group class="group-value" v-model="item.value" :disabled="item.perm === 'R'">
            <el-checkbox
              v-for="(itenItem, indey) in iten.children"
              :key="indey"
              :label="itenItem.id"
              >{{ itenItem.value }}
            </el-checkbox>
          </el-checkbox-group>
        </div>
      </div>
      <el-select
        v-else-if="item.name === 'MultipleSelect' && !item.props.expanding"
        :disabled="item.perm === 'R'"
        v-model.trim="item.value"
        :placeholder="item.props.placeholder"
        multiple
      >
        <el-option
          v-for="(iten, indey) in item.props.options"
          :key="indey"
          :label="iten.value"
          :value="iten.id"
        ></el-option>
      </el-select>

      <el-date-picker
        v-else-if="item.name === 'TimePicker'"
        :disabled="item.perm === 'R'"
        type="datetime"
        :placeholder="item.props.placeholder"
        :format="item.props.format"
        v-model.trim="item.value"
        style="width: 100%"
      ></el-date-picker>

      <el-input
        v-else-if="item.name === 'TextareaInput'"
        :disabled="item.perm === 'R'"
        type="textarea"
        v-model.trim="item.value"
        :placeholder="item.props.placeholder"
      ></el-input>

      <el-cascader
        v-else-if="item.name === 'Cascader'"
        v-model="item.value"
        :options="item.props.childrens"
        :props="{ label: 'value', value: 'id', checkStrictly: true, multiple: item.props.multiple }"
        clearable
      >
      </el-cascader>
    </el-form-item>
</template>

<script>
export default {
  props: {
    item: {
      typeof: Object,
      default: () => {}
    }
  },
};
</script>

<style lang="less" scoped>
.com-form-item {
  width: 100%;
  .el-select,.el-cascader{
    width: 100%;
  }
  /deep/ .el-input__inner,/deep/ .el-textarea__inner{
    background: transparent;
    border: none;
  }
}
.SelectInput.false, .MultipleSelect.false, .Cascader,.TimePicker{
  width: 49%;
  /deep/ .el-form-item__content{
    padding: 0 !important;
  }
}
.TextareaInput, .TextInput{
  /deep/ .el-form-item__content{
    padding: 0 !important;
  }
}
</style>
