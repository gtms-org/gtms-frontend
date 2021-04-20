import React, { FC, useState, useEffect } from 'react'
import { UserAvatarNoImage } from '@app/enums'
import { getDisplayName, getImage } from '@gtms/commons/helpers'
import { InviteToGroupButton } from '../InviteToGroupButton'
import { IUser, IAccountDetails } from '@gtms/commons/models'
import { userQuery } from '@gtms/state-user'
// ui
import { Modal } from '@gtms/ui/Modal'
import { Picture } from '@gtms/ui/Picture'
import { Tag } from '@gtms/ui/Tag'
import { TagGroup } from '@gtms/ui/TagGroup'
// styles
import styles from './styles.scss'

export const Profile: FC<{
  user: IUser
}> = ({ user }) => {
  const [state, setState] = useState<IAccountDetails>(
    userQuery.accountDetails()
  )
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

  useEffect(() => {
    const sub = userQuery.accountDetails$.subscribe((value) => setState(value))

    return () => {
      sub && !sub.closed && sub.unsubscribe()
    }
  }, [])

  return (
    <div className={styles.wrapper} data-testid="user-profile">
      <div className={styles.header}>
        {isModalOpen && (
          <Modal onClose={() => setIsModalOpen(false)}>
            <Picture
              additionalStyles={styles.image}
              {...getImage('200x200', user.avatar, UserAvatarNoImage)}
            />
          </Modal>
        )}
        <Picture
          additionalStyles={styles.image}
          onClick={() => setIsModalOpen(true)}
          {...getImage('800x800', user.avatar, UserAvatarNoImage)}
        />
        <div className={styles.headerAndDesc}>
          <h2 className={styles.header}>{getDisplayName(user)}</h2>
          <p className={styles.desc}>
            {user.description || 'user did not add any description yet'}
          </p>
        </div>
      </div>
      <div className={styles.tags}>
        <h2 className={styles.header}>Moje tagi:</h2>
        <TagGroup>
          {user.tags?.length > 0 &&
            user.tags.map((tag) => <Tag label={tag} key={`user-tag-${tag}`} />)}
          {user.tags?.length === 0 && <p>No tags</p>}
        </TagGroup>
      </div>
      {state.id !== user.id && (
        <div className={styles.actionButtons}>
          <InviteToGroupButton
            additionalStyles={styles.inviteToGroupButton}
            userId={user.id}
          />
        </div>
      )}
    </div>
  )
}
