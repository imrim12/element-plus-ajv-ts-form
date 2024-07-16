<script setup lang="ts">
import { AvForm, AvFormItem } from '../lib'

import { s } from "ajv-ts";

const formRef = ref<InstanceType<typeof AvForm>>()

const formErrors = computed(() => formRef.value?.errors)
const formFields = computed(() => formRef.value?.fields)

const formSchema = s.object({
  username: s.string().minLength(3),
  foo: s.object({
    bar: s.string().minLength(3),
  }),
})

type FormSchema = s.infer<typeof formSchema>

const formData = ref<FormSchema>({
  username: '',
  foo: {
    bar: '', // expect error
  },
})

</script>

<template>
  <div>
    <AvForm
      ref="formRef"
      :model="formData"
      :schema="formSchema"
    >
      <AvFormItem label="Username" prop="username" required :rules="{ min: 3 }">
        <ElInput v-model="formData.username" />
      </AvFormItem>
      <AvFormItem label="Foo Bar" prop="foo.bar" required>
        <ElInput v-model="formData.foo.bar" />
      </AvFormItem>
      <ElButton native-type="submit">Submit</ElButton>
    </AvForm>
    <pre>fields: {{ formFields }}</pre>
    <pre>errors: {{ formErrors }}</pre>
  </div>
</template>
