import React, { FC } from 'react'
import styles from './styles.scss'
import cx from 'classnames'
import { useTranslation } from '@gtms/commons/i18n'
import { Button } from '@gtms/ui/Button'
import useClipboard from 'react-use-clipboard'

export const InviteFriends: FC<{
  additionalStyles?: string
}> = ({ additionalStyles }) => {
  const [isCopied, setCopied] = useClipboard(
    'http://jedziemyna.pl/openerfestival'
  )
  const { t } = useTranslation('inviteFriends')

  return (
    <>
      <div
        className={cx(styles.wrapper, additionalStyles)}
        data-testid="invite-friends"
      >
        <h2>{t('invite.header')}</h2>
        <Button
          additionalStyles={styles.btn}
          onClick={setCopied}
          data-testid="invite-friends-copy-button"
        >
          {!isCopied && t('copyLink')}
          {isCopied && t('copied')}
        </Button>
      </div>
    </>
  )
}
