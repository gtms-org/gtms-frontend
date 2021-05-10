import React, { useState, FC } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from '@gtms/commons/i18n'
import { updateAccountDetails } from '@gtms/state-user'
// ui
import { Button } from '@gtms/ui/Button'
import { Error } from '@gtms/ui/Forms/Error'
import { Input } from '@gtms/ui/Forms/Input'
import { Spinner } from '@gtms/ui/Spinner'
import styles from './styles.scss'

export const EmailChangeForm: FC<{
  email: string
  onSaveSuccess: () => unknown
  onSaveFail: () => unknown
}> = ({ email, onSaveFail, onSaveSuccess }) => {
  const { t } = useTranslation('EmailChangeForm')
  const { register, handleSubmit, errors, setError } = useForm<{
    email: string
  }>()
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const validate = (data: { email: string }): boolean => {
    let hasErrors = false
    if (!data.email) {
      setError('email', 'required')
      hasErrors = true
    }

    return !hasErrors
  }
  const onSubmit = async (data: { email: string }) => {
    if (!validate(data)) {
      return
    }

    setIsSaving(true)

    try {
      await updateAccountDetails(data)
      onSaveSuccess()
    } catch {
      onSaveFail()
    } finally {
      setIsSaving(false)
    }
  }

  if (isSaving) {
    return (
      <Spinner additionalStyles={styles.spinner} />
    )
  }

  return (
    <form
      className={styles.wrapper}
      data-testid="user-email-change-form"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Input
        type="email"
        name="email"
        defaultValue={email}
        placeholder={t('form.labels.email')}
        reference={register}
      />
      {errors.email && <Error text={t('form.validation.email.isRequired')} />}
      <Button
        type="submit"
        disabled={false}
        additionalStyles={styles.btnSubmit}
      >
        {t('form.submitButton')}
      </Button>
    </form>
  )
}
