import React, { FC, useState, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { updateGroup, updateGroupAvatar } from '@gtms/state-group'
import { GroupAvatarNoImage } from '@app/enums'
import { useRouter } from 'next/router'
// commons
import { IGroup } from '@gtms/commons/models'
import { getImage } from '@gtms/commons/helpers'
import { useTranslation } from '@gtms/commons/i18n'
// ui
import { IoIosSettings } from 'react-icons/io'
import { Button } from '@gtms/ui/Button'
import { Error } from '@gtms/ui/Forms/Error'
import { ExpandingTextarea } from '@gtms/ui/Forms/ExpandingTextarea'
import { ImageWithLightbox } from '@gtms/ui/ImageWithLightbox'
import { Input } from '@gtms/ui/Forms/Input'
import { Modal } from '@gtms/ui/Modal'
import { Spinner } from '@gtms/ui/Spinner'
import { UploadFile } from '@gtms/ui/UploadFile'
// styles
import styles from './styles.scss'

interface IFormData {
  name?: string
  description?: string
}

export const BasicInfoSetup: FC<{ group: IGroup }> = ({ group }) => {
  const { t } = useTranslation('groupSettings')
  const [formState, setFormState] = useState<{
    isOpen: boolean
    isSaving: boolean
  }>({
    isOpen: false,
    isSaving: false,
  })
  const [fileUploadState, setFileUploadState] = useState<{
    isOpen: boolean
    isSaving: boolean
    isError: boolean
  }>({
    isOpen: false,
    isError: false,
    isSaving: false,
  })
  const { register, handleSubmit, errors, setError } = useForm<IFormData>()
  const router = useRouter()

  const onFormModalClose = useCallback(
    () => setFormState({ isOpen: false, isSaving: false }),
    []
  )

  const onFormModalOpen = useCallback(
    () => setFormState({ isOpen: true, isSaving: false }),
    []
  )

  const onUploadFileModalClose = useCallback(
    () =>
      setFileUploadState({
        isOpen: false,
        isError: false,
        isSaving: false,
      }),
    []
  )

  const onUploadFileModalOpen = useCallback(
    () =>
      setFileUploadState({
        isOpen: true,
        isError: false,
        isSaving: false,
      }),
    []
  )

  const validate = useCallback((data: IFormData) => {
    let hasErrors = false

    if (!data.name) {
      setError('name', 'required')
      hasErrors = true
    }

    return !hasErrors
  }, [])

  const onSubmit = async (data: IFormData) => {
    if (!validate(data)) {
      return
    }

    setFormState({
      isOpen: true,
      isSaving: true,
    })

    try {
      const result = await updateGroup(data, group.slug)

      if (result && result.slug !== group.slug) {
        router.push(`/group/${result.slug}/settings`)
      }
    } finally {
      setFormState({
        isOpen: false,
        isSaving: false,
      })
    }
  }

  const onAvatarDrop = useCallback((acceptedFiles) => {
    setFileUploadState({
      isOpen: true,
      isSaving: true,
      isError: false,
    })

    updateGroupAvatar(acceptedFiles[0])
      .then(() => {
        setFileUploadState({
          isSaving: false,
          isError: false,
          isOpen: false,
        })
      })
      .catch(() => {
        setFileUploadState({
          isOpen: true,
          isSaving: false,
          isError: true,
        })
      })
  }, [])

  return (
    <div data-testid="group-basic-info-setup" className={styles.wrapper}>
      <div className={styles.imagePreview}>
        <ImageWithLightbox
          additionalStyles={styles.imagePreview}
          src={getImage('200x200', group.avatar, GroupAvatarNoImage)}
        />
        <Button additionalStyles={styles.btn} onClick={onUploadFileModalOpen}>
          <i>
            <IoIosSettings />
          </i>
        </Button>
      </div>
      <div className={styles.headerAndDesc} onClick={onFormModalOpen}>
        <h2 className={styles.header}>{group.name}</h2>
        <p className={styles.description}>
          {group.description || 'no group description'}
        </p>
      </div>
      {formState.isOpen && (
        <Modal onClose={onFormModalClose}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            data-testid="group-basic-info-setup-form"
            method="post"
          >
            <Input
              type="text"
              name="name"
              defaultValue={group.name}
              placeholder={t('form.labels.name')}
              reference={register({ required: true })}
            />
            {errors.name && (
              <Error text={t('form.validation.name.isRequired')} />
            )}
            <ExpandingTextarea
              placeholder={t('form.labels.description')}
              name="description"
              defaultValue={group.description}
              reference={register({ required: false })}
            />
            <Button
              additionalStyles={styles.btnSave}
              disabled={formState.isSaving}
              type="submit"
            >
              {formState.isSaving && <Spinner size="xsm" />}
              Save
            </Button>
          </form>
        </Modal>
      )}
      {fileUploadState.isOpen && (
        <Modal onClose={onUploadFileModalClose}>
          <UploadFile
            additionalStyles={styles.uploadFile}
            isError={fileUploadState.isError}
            isLoading={fileUploadState.isSaving}
            onDrop={onAvatarDrop}
          />
        </Modal>
      )}
    </div>
  )
}
