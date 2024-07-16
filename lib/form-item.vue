<script setup lang=ts>
import type { ElFormItem, FormItemRule } from 'element-plus'
import { formContextKey } from 'element-plus'
import { omit } from 'lodash-es'

import type { FormItemProps } from './form-item'

defineOptions({
  name: 'AvFormItem',
})

const props = withDefaults(
  defineProps<FormItemProps>(),
  {
    labelWidth: '',
    labelPosition: '',
    showMessage: true,
    showIcon: false,
    errorIcon: 'i-ol-alert-caution',
  },
)

defineSlots<{
  default: (slotProps: any) => any
  label: (slotProps: { label: string }) => any
  error: (slotProps: { error: string }) => any
}>()

const elFormContext = inject(formContextKey)

if (!(elFormContext)) {
  throw new Error('AvFormItem must be used inside AvForm')
}

if (!props.prop) {
  throw new Error('AvFormItem prop is required')
}

const propsComputed = computed(() => omit(props, ['rules', 'required', 'showIcon', 'errorIcon']))

const formItemRef = ref<InstanceType<typeof ElFormItem>>()

const formItemRules = computed<FormItemRule[]>(() =>
  [
    ...(Array.isArray(props.rules) ? props.rules : [props.rules || {}]),
    { required: props.required, message: 'This field is required.' } as FormItemRule,
  ],
)

function validate() {
  return elFormContext?.validateField(props.prop)
}

function clearValidate() {
  return elFormContext?.clearValidate(props.prop)
}

defineExpose({
  formItemRef,
  validate,
  clearValidate,
})
</script>

<template>
  <ElFormItem
    ref="formItemRef"
    v-bind="propsComputed"
    :rules="formItemRules"
  >
    <template #label>
      <slot
        name="label"
        :label="label || ''"
      />
    </template>
    <slot />
    <template #error="errorProps">
      <slot
        v-if="Boolean(errorProps.error || error)"
        name="error"
        :error="errorProps.error || error || ''"
      >
        <div
          :class="formItemRef?.validateClasses"
          class="el-form-item__error"
        >
          <i
            v-if="showIcon"
            :class="errorIcon"
          />
          <span>{{ errorProps.error || error || '' }}</span>
        </div>
      </slot>
    </template>
  </ElFormItem>
</template>