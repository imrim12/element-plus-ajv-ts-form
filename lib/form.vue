<script setup lang="ts">
import { omit, get } from 'lodash-es'

import type { ElForm, FormItemProp, FormValidateCallback } from 'element-plus'
import type { ValidateFieldsError, ValidateError } from 'async-validator'
import type { FormProps } from './form'
import { formProps } from './form'

defineOptions({
  name: 'AvForm',
})

const props = withDefaults(
  defineProps<FormProps>(),
  formProps,
)

const emit = defineEmits<{
  (e: 'submit'): void
  (e: 'error', errors: ValidateFieldsError ): void
}>()

defineSlots<{
  default: () => any
}>()

const propsComputed = computed(() => omit(props, ['schema']))

const formRef = ref<InstanceType<typeof ElForm>>()

function validate(callback?: FormValidateCallback) {
  return formRef.value?.validate(callback)
}

function reset() {
  return formRef.value?.resetFields()
}

const errors = ref<ValidateFieldsError>({})

function onSubmit(e: Event) {
  e.preventDefault()

  formRef.value?.validate((isValid, invalidFields) => {
    if (isValid)
      emit('submit')
    else if (invalidFields) {
      errors.value = invalidFields
    }
  })
}

function traverseSchema(schema: typeof props.schema, path: string) {
  const paths = path.split('.')

  let current: any = unref(schema)

  for (const p of paths) {
    current = current.def[p]
  }

  return current
}

function onValidate(prop: FormItemProp, isValid: boolean, message?: string) {
  const path = Array.isArray(prop) ? prop.join('.') : prop

  let error: ValidateError | undefined = undefined

  if (!isValid) {
    error = {
      message,
      fieldValue: get(props.model, path),
      field: path,
    }
  } else {
    const schema = traverseSchema(props.schema, path)

    const { success, error: ajvError } = schema.safeParse(get(props.model, path))

    if (!success) {
      error = {
        message: ajvError.message,
        fieldValue: get(props.model, path),
        field: path,
      }
    }
  }

  Object.assign(errors.value, {
    [path]: [error].filter(Boolean),
  })
}

const fields = computed(() => formRef.value
  ? formRef.value.fields.map((field) => field.prop)
  : []
)

function onFormMounted() {
  for (const prop of fields.value) {
    if (!prop)
      continue

    if (Array.isArray(prop))
      errors.value[prop.join('.')] = []
    else
      errors.value[prop] = []
  }
}

defineExpose({
  reset,
  validate,
  fields,
  errors,
})
</script>

<template>
  <ElForm
    ref="formRef"
    v-bind="propsComputed"
    :novalidate="true /* native form novalidate */"
    @submit="onSubmit"
    @validate="onValidate"
    @vue:mounted="onFormMounted"
  >
    <slot />
  </ElForm>
</template>