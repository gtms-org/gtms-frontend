import React, { FC, useState, useEffect } from 'react'
import cx from 'classnames'
import { IUser } from '@gtms/commons/models'
import { getImage } from '@gtms/commons/helpers'
import { Link } from '@gtms/commons/i18n'
import { UserAvatarNoImage } from '@app/enums'
// state
import { getGroupMembers } from '@gtms/state-group'
// ui
import { Button } from '@gtms/ui/Button'
import { ErrorWrapper } from '@gtms/ui/ErrorWrapper'
import { InviteFriends } from '@gtms/ui/InviteFriends'
import { Modal } from '@gtms/ui/Modal'
import { Pagination } from '@gtms/ui/Pagination'
import { Spinner } from '@gtms/ui/Spinner'
import { UserCard } from '@gtms/ui/UserCard'
// styles
import styles from './styles.scss'
import { mock, faces } from './mock.js'

export const GroupMembers: FC<{
  additionalStyles: string
  errorOccured: boolean
  isLoading: boolean
  slug?: string
  users: IUser[]
}> = ({ additionalStyles, errorOccured, isLoading, slug, users }) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

  useEffect(() => {
    if (!errorOccured && !isLoading && users.length === 0 && slug) {
      getGroupMembers(slug, 0, 8)
    }
  }, [])
  return (
    <div
      className={cx(styles.wrapper, additionalStyles)}
      data-testid="group-members"
    >
      {users.length === 0 && !isLoading && !errorOccured && (
        <Spinner additionalStyles={styles.spinner} />
      )}

      {isModalOpen && (
        <Modal
          additionalStyles={styles.modal}
          onClose={() => setIsModalOpen(false)}
        >
          <InviteFriends />
        </Modal>
      )}

      {isLoading && <Spinner size="sm" />}

      {errorOccured && (
        <ErrorWrapper>
          <h2>Sorry we can not show you groups members now</h2>
        </ErrorWrapper>
      )}

      {users.length > 0 && (
        <ul className={styles.items}>
          {mock.map((user, index) => (
            <li className={styles.item} key={`group-member-${user.id}`}>
              <Link href={`/user/${user.id}`}>
                <a>
                  <UserCard
                    additionalStyles={styles.avatar}
                    image={faces[index].jpg}
                    user={user}
                    image={getImage('50x50', user.avatar, UserAvatarNoImage)}
                  />
                </a>
              </Link>
            </li>
          ))}
          <li
            className={cx(styles.item, styles.invite)}
            key={`group-member-invite}`}
          >
            <Button
              additionalStyles={styles.btnInvite}
              onClick={() => setIsModalOpen(true)}
            >
              +
            </Button>
          </li>
        </ul>
      )}

      <Pagination
        additionalStyles={styles.pagination}
        getCurrentUrl={() => null}
        limit={1}
        offset={1}
        onClick={() => null}
        total={5}
      />
    </div>
  )
}
