import React, { FC, useState } from 'react'
import styles from './styles.scss'
import { ExpandingTextarea } from '@gtms/ui/Forms/ExpandingTextarea'
import { useForm } from 'react-hook-form'
import { Button } from '@gtms/ui/Button'
import { updateAccountDetails } from '@gtms/state-user'

export const UserDescription: FC<{
  description?: string
}> = ({ description }) => {
  const [isInEditMode, setIsInEditMode] = useState<boolean>(false)
  const { register, handleSubmit } = useForm<{ description?: string }>()
  const onSubmit = (data: { description?: string }) => {
    updateAccountDetails(data).finally(() => setIsInEditMode(false))
  }

  return (
    <div>
      {isInEditMode && (
        <form onSubmit={handleSubmit(onSubmit)}>
          <ExpandingTextarea
            additionalStyles={styles.textarea}
            defaultValue={''}
            name="description"
            placeholder={'Describe yourself :)'}
            reference={register({ required: false })}
          />
          <Button additionalStyles={styles.btn} type="submit" disabled={false}>
            Save
          </Button>
        </form>
      )}
      {!isInEditMode && (
        <p onClick={() => setIsInEditMode(true)}>
          {description ||
            'You dont have any description yet. Click here to add it'}
        </p>
      )}
    </div>
  )
}
