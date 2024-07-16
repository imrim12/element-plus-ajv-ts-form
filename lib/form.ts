import { object } from "ajv-ts";
import type { FormProps as ElFormProps } from 'element-plus'
import type { MaybeRef } from 'vue'

export type FormProps = ElFormProps & {
  schema: MaybeRef<ReturnType<typeof object>>
}

export const formProps = {
  inline: false,
  labelPosition: 'right' as const,
  labelWidth: '',
  labelSuffix: '',
  hideRequiredAsterisk: false,
  requireAsteriskPosition: 'left' as const,
  showMessage: true,
  inlineMessage: false,
  statusIcon: false,
  validateOnRuleChange: true,
  disabled: false,
  scrollToError: true,
}