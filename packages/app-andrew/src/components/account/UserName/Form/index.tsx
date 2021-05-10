import React, { useState, FC } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from '@gtms/commons/i18n'
import { updateAccountDetails } from '@gtms/state-user'
// ui
import { Spinner } from '@gtms/ui/Spinner'
import { Button } from '@gtms/ui/Button'
import { Input } from '@gtms/ui/Forms/Input'
import styles from './styles.scss'

export const UserNameChangeForm: FC<{
  name?: string
  surname?: string
  onSaveSuccess: () => unknown
  onSaveFail: () => unknown
}> = ({ name, surname, onSaveFail, onSaveSuccess }) => {
  const { t } = useTranslation('userNameChangeForm')
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const { register, handleSubmit } = useForm<{
    name?: string
    surname?: string
  }>()

  const onSubmit = async (data: { name?: string; surname?: string }) => {
    setIsSaving(true)

    try {
      await updateAccountDetails(data)
      onSaveSuccess()
    } catch {
      setIsSaving(false)
      onSaveFail()
    }
  }

  if (isSaving) {
    return (
      <Spinner additionalStyles={styles.spinner} />
    )
  }

  return (
    <form
      data-testid="user-name-change-form"
      onSubmit={handleSubmit(onSubmit)}
      className={styles.wrapper}
    >
      <Input
        type="text"
        name="name"
        defaultValue={name}
        maxLength={200}
        placeholder={t('form.labels.name')}
        reference={register}
      />

      <Input
        type="text"
        name="surname"
        maxLength={200}
        defaultValue={surname}
        placeholder={t('form.labels.surname')}
        reference={register}
      />

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
