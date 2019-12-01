import React, { FC, useState } from 'react'
import useForm from 'react-hook-form'
import { useTranslation } from 'i18n'
import { ILoginData } from 'api/auth'
import { loginUser } from 'state/user'
import { Input } from 'components/common/Forms/Input'
import { Error } from 'components/common/Forms/Error'
import { Button } from 'components/common/Button'

export const LoginForm: FC<{ onSuccess: () => unknown }> = ({ onSuccess }) => {
  const { t } = useTranslation('login')
  const [isMakingRequest, setIsMakingRequest] = useState<boolean>(false)
  const { register, handleSubmit, errors, setError } = useForm<ILoginData>()
  const validate = (data: ILoginData): boolean => {
    let hasErrors = false
    if (!data.email) {
      setError('email', 'required')
      hasErrors = true
    }

    if (!data.password) {
      setError('password', 'required')
      hasErrors = true
    }

    return !hasErrors
  }
  const onSubmit = async (data: ILoginData) => {
    if (!validate(data)) {
      return
    }

    setIsMakingRequest(true)

    try {
      await loginUser(data)

      onSuccess()
    } catch (err) {
      setError('email', 'invalid')
    }

    setIsMakingRequest(false)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} data-testid="login-form">
      <Input
        type="email"
        placeholder={t('form.labels.email')}
        name="email"
        reference={register({ required: true })}
      />
      {errors.email && errors.email.type === 'required' && (
        <Error text={t('form.validation.email.isRequired')} />
      )}
      {errors.email && errors.email.type === 'invalid' && (
        <Error text={t('loginFailed')} />
      )}

      <Input
        type="password"
        placeholder={t('form.labels.password')}
        name="password"
        reference={register({ required: true })}
      />
      {errors.password && (
        <Error text={t('form.validation.password.isRequired')} />
      )}

      <Button type="submit" disabled={isMakingRequest}>
        {t('form.submitButton')}
      </Button>
    </form>
  )
}
