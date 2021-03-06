import React, { FC, useState, useEffect } from 'react'
import cx from 'classnames'
import { useTranslation } from '@gtms/commons/i18n'
import { IGroup } from '@gtms/commons/models'
import {
  myGroupsQuery,
  userQuery,
  joinGroup,
  leaveGroup,
} from '@gtms/state-user'
import { openLoginModal } from '@app/state'
// ui
import { IoIosHeart } from 'react-icons/io'
import { Button } from '@gtms/ui/Button'
import { Spinner } from '@gtms/ui/Spinner'
// styles
import styles from './styles.scss'

export const JoinLeaveButton: FC<{
  additionalStyles?: string
  group: IGroup
}> = ({ additionalStyles, group }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [status, setStatus] = useState<{
    isGroupAdmin: boolean
    isGroupOwner: boolean
    isGroupMember: boolean
    canJoinGroup: boolean
    errorOccurred: boolean
    isLoading: boolean
  }>({
    ...myGroupsQuery.status(),
    ...myGroupsQuery.groupStatus(group.id),
  })

  useEffect(() => {
    if (!userQuery.isLogged()) {
      return
    }

    const sub = myGroupsQuery.groupStatus$(group.id).subscribe((value) =>
      setStatus({
        ...status,
        ...value,
      })
    )
    return () => {
      sub && !sub.closed && sub.unsubscribe()
    }
  }, [])
  const { t } = useTranslation('groupPage')

  if (status.errorOccurred || status.isGroupAdmin || status.isGroupOwner) {
    return null
  }

  return (
    <Button
      additionalStyles={cx(styles.btn, additionalStyles)}
      onClick={() => {
        if (!userQuery.isLogged()) {
          return openLoginModal()
        }

        setIsLoading(true)

        const method = status.canJoinGroup ? joinGroup : leaveGroup

        method(group).finally(() => setIsLoading(false))
      }}
    >
      {(status.isLoading || isLoading) && <Spinner size="xsm" />}
      {!status.isLoading && !isLoading && (
        <>
          {status.canJoinGroup || !userQuery.isLogged() ? (
            <>
              <i>
                <IoIosHeart />
              </i>
              <span>{t('join-this-group')}</span>
            </>
          ) : (
            <>
              <i>
                <IoIosHeart />
              </i>
              <span>{t('leave-this-group')}</span>
            </>
          )}
        </>
      )}
    </Button>
  )
}
