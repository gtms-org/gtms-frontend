import React, { FC, useState } from 'react'
import cx from 'classnames'
import { useTranslation } from '@gtms/commons/i18n'
// ui
import { IoIosCloseCircle, IoIosCheckbox } from 'react-icons/io'
import { Button } from '@gtms/ui/Button'
import { Modal } from '@gtms/ui/Modal'
import styles from './styles.scss'

export const DeleteAccount: FC<{
  additionalStyles?: string
  onConfirm: () => unknown
}> = ({ additionalStyles, onConfirm }) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const { t } = useTranslation('deleteUserAccount')

  return (
    <div data-testid="delete-account">
      {isModalOpen && (
        <Modal
          additionalStyles={styles.modalContent}
          onClose={() => setIsModalOpen(false)}
        >
          <h2 className={styles.header}>{t('header')}</h2>
          <p className={styles.desc}>
            Eteu in occaecat occaecat consectetur et laboris aliquip.
          </p>
          <div className={styles.buttons}>
            <Button
              additionalStyles={styles.no}
              testid="delete-account-cancel"
              onClick={() => setIsModalOpen(false)}
            >
              <i>
                <IoIosCloseCircle />
              </i>
              {t('noBtn')}
            </Button>
            <Button
              testid="delete-account-confirm"
              additionalStyles={styles.yes}
              onClick={() => {
                onConfirm()
                setIsModalOpen(false)
              }}
            >
              <i>
                <IoIosCheckbox />
              </i>
              {t('yesBtn')}
            </Button>
          </div>
        </Modal>
      )}

      <Button
        additionalStyles={cx(styles.btnDeleteAccount, additionalStyles)}
        onClick={() => {
          setIsModalOpen(true)
        }}
        testid="delete-account-button"
      >
        {t('deleteAccountBtn')}
      </Button>
    </div>
  )
}
