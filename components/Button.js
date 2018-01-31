// @flow
import * as React from 'react'
import type { ColorProps } from '../themes/types'
import Text, { type TextProps } from './Text'
import Theme from './Theme'

// Browser button is rendered as div with button role because button element is
// hard to style consistently in Firefox and maybe elsewhere. Div is just fine.
// https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques/Using_the_button_role
const BrowserButton = ({
  disabled,
  onPress,
  style,
  ...props
}: {
  disabled?: boolean,
  onPress?: () => void,
  style?: Object,
}) => (
  <div // eslint-disable-line jsx-a11y/no-static-element-interactions
    onClick={onPress}
    onKeyPress={(e: KeyboardEvent) => {
      if (!onPress) return
      if (disabled === true) return
      // Buttons are expected to be triggered using the Space or Enter key.
      const isTriggered = e.key === ' ' || e.key === 'Enter'
      if (!isTriggered) return
      // Prevent scroll on spacebar press.
      e.preventDefault()
      onPress()
    }}
    role="button"
    tabIndex={disabled === true ? -1 : 0}
    style={{
      ...style,
      cursor: disabled === true ? 'default' : 'pointer',
      pointerEvents: disabled === true ? 'none' : 'auto',
      userSelect: 'none',
      MozUserSelect: 'none',
      WebkitUserSelect: 'none',
    }}
    {...props}
  />
)

export type ButtonProps = ColorProps &
  TextProps & {
    disabled?: boolean,
    onPress?: () => any,
    outline?: boolean,
  }

class Button extends React.PureComponent<ButtonProps> {
  render() {
    return (
      <Theme>
        {theme => {
          const {
            as = BrowserButton,
            size = 0,
            borderRadius = theme.button.borderRadius,
            // For size < 0, there is no space for a padding.
            marginVertical = size < 0
              ? theme.button.marginVertical + theme.button.paddingVertical
              : theme.button.marginVertical,
            paddingHorizontal = 1,
            // For size < 0, there is no space for a padding.
            paddingVertical = size < 0 ? 0 : theme.button.paddingVertical,
            outline,
            ...props
          } = this.props
          const defaultProps = {}

          // <Button primary shorthand.
          const colorName = Object.keys(theme.colors).find(
            color => props[color],
          )
          if (colorName) {
            delete props[colorName]
            if (outline === true) {
              defaultProps.borderColor = colorName
              defaultProps.borderStyle = 'solid'
              defaultProps.borderWidth = theme.button.borderWidth
              defaultProps.color = colorName
              if (size < 0) {
                // Ensure vertical rhythm for small outline button. The lineHeight
                // is the only possible way to do it. It doesn't work for multilines.
                defaultProps.lineHeight =
                  theme.typography.lineHeight - 2 * defaultProps.borderWidth
              }
            } else {
              defaultProps.backgroundColor = colorName
              defaultProps.bold = true
              defaultProps.color = 'white'
            }
          }

          if (props.disabled === true) {
            defaultProps.opacity = theme.button.disabledOpacity
          }

          return (
            <Text
              as={as}
              size={size}
              borderRadius={borderRadius}
              marginVertical={marginVertical}
              paddingHorizontal={paddingHorizontal}
              paddingVertical={paddingVertical}
              {...defaultProps}
              {...props}
            />
          )
        }}
      </Theme>
    )
  }
}

export default Button
