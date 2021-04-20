import React, { FC } from 'react'
import styles from './styles.scss'
import cx from 'classnames'
import { ClickToCopy } from '@gtms/ui/ClickToCopy'
import { useTranslation } from '@gtms/commons/i18n'

export const InviteFriends: FC<{
  additionalStyles?: string
}> = ({ additionalStyles }) => {
  const { t } = useTranslation('inviteFriendsComponent')

  return (
    <div
      className={cx(styles.wrapper, additionalStyles)}
      data-testid="invite-friends"
    >
      <div className={styles.content}>
        <h2 className={styles.header}>{t('header')}</h2>
        <ClickToCopy
          additionalStyles={styles.btn}
          text="wejdz na www.jedziemyna.pl"
        />
        <img src="/images/polandrock/invite-bg.png" />
      </div>
    </div>
  )
}
