// @flow
import * as React from 'react'
import Box from './Box'
import Form from './Form'
import Heading from './Heading'
import Set from './Set'
import TextInputBig from './TextInputBig'
import ValidationError from './ValidationError'
import { SignInButton, SignUpButton } from './buttons'
import { defineMessages } from 'react-intl'
import SigninMutation from '../mutations/SigninMutation'
import SignupMutation from '../mutations/SignupMutation'
import Router from 'next/router'
import Mutate from './Mutate'
import * as validation from '../graphcool/lib/validation'
import { setCookie } from '../lib/cookie'
import type { IntlShape } from 'react-intl'

const messages = defineMessages({
  emailPlaceholder: {
    defaultMessage: 'email',
    id: 'authForm.emailPlaceholder',
  },
  passwordPlaceholder: {
    defaultMessage: 'password',
    id: 'authForm.passwordPlaceholder',
  },
})

type Props = {
  intl: IntlShape,
  redirectUrl: ?string,
}

type Fields = {
  email: string,
  password: string,
}

type State = {
  pending: boolean,
  validationErrors: validation.ValidationErrors<Fields>,
} & Fields

const initialState = {
  email: '',
  password: '',
  pending: false,
  validationErrors: {},
}

class Auth extends React.PureComponent<Props, State> {
  state = initialState

  handleCompleted = (idAndToken: *) => {
    this.setState({ pending: false })
    if (!idAndToken) return
    setCookie({ token: idAndToken.token, userId: idAndToken.id })
    const redirectUrl =
      this.props.redirectUrl != null
        ? decodeURIComponent(this.props.redirectUrl)
        : '/'
    Router.replace(redirectUrl)
  }

  handleError = (error: *) => {
    const functionError = error && error[0] && error[0].functionError
    let validationErrors = {}
    switch (functionError) {
      case 'Email already in use':
        validationErrors = { email: { type: 'alreadyExists' } }
        break
      case 'Invalid credentials!':
        validationErrors = { password: { type: 'wrongPassword' } }
        break
    }
    this.setState({ pending: false, validationErrors })
    const handled = Object.keys(validationErrors).length > 0
    return handled
  }

  auth = (mutate: *, isSignUp?: boolean) => () => {
    const variables = {
      email: this.state.email.trim(),
      password: this.state.password.trim(),
    }

    const validate = variables => {
      const email = validation.email(variables.email)
      if (email) return { email }
      const password = validation.password(variables.password)
      if (password) return { password }
    }

    const validationErrors = validate(variables)
    if (validationErrors) {
      this.setState({ validationErrors })
      return
    }

    this.setState({ pending: true })

    if (isSignUp === true) {
      mutate(
        SignupMutation.commit,
        variables,
        response => this.handleCompleted(response.signupUser),
        this.handleError,
      )
    } else {
      mutate(
        SigninMutation.commit,
        variables,
        response => this.handleCompleted(response.authenticateUser),
        this.handleError,
      )
    }
  }

  render() {
    return (
      <Mutate>
        {mutate => {
          const { intl } = this.props
          const { pending, validationErrors } = this.state
          return (
            <div>
              {/* https://stackoverflow.com/questions/2781549/removing-input-background-colour-for-chrome-autocomplete/32505530#32505530 */}
              <style jsx>{`
                div :global(input:-webkit-autofill),
                div :global(input:-webkit-autofill:hover),
                div :global(input:-webkit-autofill:focus),
                div :global(input:-webkit-autofill:active) {
                  -webkit-transition: 'color 9999s ease-out, background-color 9999s ease-out';
                  -webkit-transition-delay: 9999s;
                }
              `}</style>
              <Box>
                <Heading size={3}>Auth</Heading>
                <Form onSubmit={this.auth(mutate)}>
                  <Set vertical spaceBetween={0}>
                    <TextInputBig
                      autoFocus={validationErrors.email}
                      disabled={pending}
                      error={<ValidationError error={validationErrors.email} />}
                      maxWidth={26}
                      name="email"
                      onChange={email => this.setState({ email })}
                      placeholder={intl.formatMessage(
                        messages.emailPlaceholder,
                      )}
                      type="email"
                      value={this.state.email}
                    />
                    <TextInputBig
                      autoFocus={validationErrors.password}
                      disabled={pending}
                      error={
                        <ValidationError error={validationErrors.password} />
                      }
                      maxWidth={26}
                      name="password"
                      onChange={password => this.setState({ password })}
                      placeholder={intl.formatMessage(
                        messages.passwordPlaceholder,
                      )}
                      type="password"
                      value={this.state.password}
                    />
                  </Set>
                  <Set>
                    <SignInButton
                      disabled={pending}
                      onPress={this.auth(mutate)}
                      primary
                    />
                    <SignUpButton
                      disabled={pending}
                      onPress={this.auth(mutate, true)}
                    />
                  </Set>
                </Form>
              </Box>
            </div>
          )
        }}
      </Mutate>
    )
  }
}

export default Auth
