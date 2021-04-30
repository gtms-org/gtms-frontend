import React, { FC, useState, useEffect } from 'react'
import {
  userQuery,
  updateAccountAvatar,
  updateAccountDetails,
} from '@gtms/state-user'
import { IAccountDetails } from '@gtms/commons/models'
import { FileStatus } from '@gtms/commons/enums'
import { UserEmail } from '@app/components/account/UserEmail'
import { UserName } from '@app/components/account/UserName'
import { UserDescription } from '@app/components/account/UserDescription'
import { Picture } from '@gtms/ui/Picture'
import { Spinner } from '@gtms/ui/Spinner'
import { UserAvatarNoImage } from '@app/enums'
import { ImageEditor } from '@gtms/ui/ImageEditor'

import styles from './styles.scss'

export const LoggedUserAccountDetails: FC = () => {
  const [state, setState] = useState<IAccountDetails>(
    userQuery.accountDetails()
  )
  const [isAvatarEditorVisible, setIsAvatarEditorVisible] = useState<boolean>(
    false
  )

  useEffect(() => {
    const sub = userQuery.accountDetails$.subscribe((value) => {
      setState(value)
    })

    return () => {
      sub && !sub.closed && sub.unsubscribe()
    }
  }, [])

  return (
    <div data-testid="logged-user-account-details">
      <div className={styles.userHeader}>
        <ImageEditor
          isVisible={isAvatarEditorVisible}
          onSave={(file: File) => {
            updateAccountAvatar(file)
            setIsAvatarEditorVisible(false)
          }}
          onClose={() => setIsAvatarEditorVisible(false)}
        />
        <div className={styles.avatarWrapper}>
          <a onClick={() => setIsAvatarEditorVisible(true)}>
            {[FileStatus.uploaded, FileStatus.processing].includes(
              state.avatar.status
            ) && <Spinner />}
            <Picture
              {...(userQuery.hasAvatar('200x200')
                ? userQuery.getAvatar('200x200')
                : UserAvatarNoImage['200x200'])}
            />
          </a>
        </div>
        <div className={styles.userNameSurnameLogin}>
          <UserName name={state.name} surname={state.surname} />
          <UserEmail email={state.email} />
          <span className={styles.login}>@{state.username}</span>
        </div>
        <div className={styles.desc}>
          <span className={styles.aboutMeLabel}>About me:</span>
          <UserDescription description={state.description} />
        </div>
      </div>
    </div>
  )
}
