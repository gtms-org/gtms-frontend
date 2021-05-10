import React, { FC } from 'react'
import { format } from 'date-fns'
import { IActiveSession } from '@gtms/commons/models'
// ui
import { Button } from '@gtms/ui/Button'
import { Spinner } from '@gtms/ui/Spinner'
import { ErrorWrapper } from '@gtms/ui/ErrorWrapper'
import { IoMdTrash } from 'react-icons/io'
import styles from './styles.scss'

export const UserSessions: FC<{
  isLoading: boolean
  errorOccured: boolean
  sessions: IActiveSession[]
  onDeleteClick?: (id: string) => unknown
}> = ({ isLoading, errorOccured, sessions, onDeleteClick }) => {
  return (
    <div className={styles.wrapper} data-testid="user-sessions">
      {isLoading && <Spinner />}
      {!isLoading && errorOccured && (
        <ErrorWrapper>
          <h2>
            Error occured, we can not show you now list of your active sessions
          </h2>
        </ErrorWrapper>
      )}
      {!isLoading && !errorOccured && sessions.length === 0 && (
        <p>We have no info about your current sessions</p>
      )}
      {!isLoading && !errorOccured && sessions.length > 0 && (
        <ul className={styles.list}>
          {sessions.map((session) => (
            <li className={styles.item} key={`session-${session.id}`}>
              <div className={styles.row}>
                <div>
                  <h3 className={styles.header}>Created At</h3>
                  {session.createdAt &&
                    format(new Date(session.createdAt), 'HH:mm:ss dd.MM.yyyy')}
                </div>
                <div>
                  <h3 className={styles.header}>IP Address</h3>
                  {session.ipAddress}
                </div>
              </div>
              <div>
                <h3 className={styles.header}>User agent</h3>
                {session.userAgent}
              </div>
              <Button
                additionalStyles={styles.btn}
                onClick={() => onDeleteClick && onDeleteClick(session.id)}
              >
                <i>
                  <IoMdTrash />
                </i>
                Remove session
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
