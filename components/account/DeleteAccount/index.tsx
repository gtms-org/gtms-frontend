import React, { FC, useState } from 'react'
import { Button } from 'components/common/Button'
import { Modal } from 'components/common/Modal'
import styles from './styles.scss'
// import { Link } from 'i18n'

export const DeleteAccount: FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

  return (
    <div data-testid="deleteAccount">
      {isModalOpen && (
        <Modal
          additionalStyles={styles.modalContent}
          onClose={() => setIsModalOpen(false)}
        >
          <div>
            {/* @todo create mixin for headers */}
            {/* @todo remove youd like hack for comma when translation applied */}
            <h2>Are you sure {`you'd`} like to delete your account?</h2>
            <div className={styles.buttons}>
              <Button
                additionalStyles={styles.no}
                onClick={() => setIsModalOpen(false)}
              >
                Nah, not, not really, just kidding
              </Button>
              <Button onClick={() => null}>
                Yes, really. Its time to say good bye...
              </Button>
            </div>
          </div>
        </Modal>
      )}

      <Button
        onClick={() => {
          setIsModalOpen(true)
        }}
        additionalStyles={styles.btnDeleteAccount}
      >
        Delete Account
      </Button>
    </div>
  )
}
