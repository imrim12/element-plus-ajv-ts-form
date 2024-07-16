import type { FormItemProps as ElFormItemProps } from 'element-plus'

export type FormItemProps = Partial<ElFormItemProps & {
  prop: string
  showIcon: boolean
  errorIcon: string
}>