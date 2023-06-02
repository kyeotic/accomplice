import { mergeProps, splitProps, type ParentProps, type JSX } from 'solid-js'
import classNames from 'classnames'

interface ButtonProps
  extends ParentProps<JSX.ButtonHTMLAttributes<HTMLButtonElement>> {
  small?: boolean
  danger?: boolean
  secondary?: boolean
  class?: string
  extraClass?: string
}

const BASE = 'font-bold rounded-full'
const MEDIUM = 'py-2 px-4'
const SMALL = 'py-0.5 px-3'
const DISABLED = 'opacity-50 cursor-not-allowed'

const COLOR_BASE = 'bg-teal-500 hover:bg-teal-700 text-white'
const COLOR_DANGER = 'bg-red-500 hover:bg-red-700 text-white'
const COLOR_SECONDARY = 'bg-gray-500 hover:bg-gray-700 text-white'

export default function Button(props: ButtonProps) {
  const [merged, rest] = splitProps(
    mergeProps(
      {
        class: BASE,
      },
      props
    ),
    [
      'class',
      'extraClass',
      'small',
      'danger',
      'secondary',
      'disabled',
      'onClick',
    ]
  )

  function style() {
    let result = classNames(
      merged.class,
      merged.extraClass,
      merged.small ? SMALL : MEDIUM,
      merged.danger
        ? COLOR_DANGER
        : merged.secondary
        ? COLOR_SECONDARY
        : COLOR_BASE,
      merged.disabled && DISABLED
    )

    if (merged.small) result = classNames(result, SMALL)
    else result = classNames(result, MEDIUM)

    return result
  }

  function onClick(e: Event) {
    if (merged.disabled) return
    // @ts-ignore
    props.onClick?.(e)
  }

  return (
    <button
      class={style()}
      {...rest}
      onClick={props.onClick ? onClick : undefined}
    />
  )
}
