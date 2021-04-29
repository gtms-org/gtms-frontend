import React, { FC, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { updateAccountDetails } from '@gtms/state-user'
// ui
import { IoIosCheckbox } from 'react-icons/io'
import { Button } from '@gtms/ui/Button'
import { ExpandingTextarea } from '@gtms/ui/Forms/ExpandingTextarea'
import { Modal } from '@gtms/ui/Modal'
import { Spinner } from '@gtms/ui/Spinner'
import styles from './styles.scss'

export const UserDescription: FC<{
  description?: string
}> = ({ description }) => {
  enum Status {
    isEditNotStarted,
    isError,
    isInEditMode,
    isSaving,
    isSuccess,
  }
  const [status, setStatus] = useState<Status>(Status.isEditNotStarted)
  const { register, handleSubmit } = useForm<{ description?: string }>()
  const onSubmit = (data: { description?: string }) => {
    setStatus(Status.isSaving)
    updateAccountDetails(data)
      .then(() => {
        setStatus(Status.isSuccess)
      })
      .catch(() => {
        setStatus(Status.isError)
      })
  }

  useEffect(() => {
    if ([Status.isSuccess, Status.isError].includes(status)) {
      setTimeout(() => {
        setStatus(Status.isEditNotStarted)
      }, 1500)
    }
  }, [status])

  return (
    <>
      {(status === Status.isError ||
        status === Status.isInEditMode ||
        status === Status.isSaving ||
        status === Status.isSuccess) && (
        <Modal onClose={() => setStatus(Status.isSaving)}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <ExpandingTextarea
              additionalStyles={styles.textarea}
              defaultValue={description}
              name="description"
              placeholder={'Describe yourself :)'}
              reference={register({ required: false })}
            />
            <Button
              additionalStyles={styles.btn}
              type="submit"
              disabled={false}
            >
              {status === Status.isSuccess && (
                <>
                  <i className={styles.check}>
                    <IoIosCheckbox />
                  </i>
                  Saved!
                </>
              )}
              {status === Status.isSaving && <Spinner size="xsm" />}
              {status === Status.isError && <>Error occured</>}
              {status === Status.isInEditMode && <>Save</>}
            </Button>
          </form>
        </Modal>
      )}
      <p
        className={styles.description}
        onClick={() => setStatus(Status.isInEditMode)}
      >
        {description ||
          'You dont have any description yet. Click here to add it'}
      </p>
    </>
  )
}
