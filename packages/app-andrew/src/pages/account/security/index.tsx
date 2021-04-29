import React, { useState, useEffect, useCallback } from 'react'
import { NextPage, NextPageContext } from 'next'
import { hasAuthSessionCookies } from '@gtms/state-user'
import { redirect } from '@gtms/commons/helpers/redirect'
import { ILoginHistory, IActiveSession } from '@gtms/commons/models'
import { ChangePassword } from '@app/components/account/ChangePassword'
import { DeleteAccount } from '@app/components/account/DeleteAccount'
import { Navigation, Tabs } from '@app/components/account/Navigation'
import { LoggedUserAccountDetails } from '@app/components/account/LoggedUserAccountDetails'
import {
  fetchLoginHistoryAPI,
  fetchActiveSessionsAPI,
  deleteActiveSessionAPI,
} from '@gtms/api-auth'
import { addErrorNotification } from '@gtms/state-notification'
// ui
import { LoginHistory } from '@gtms/ui/LoginHistory'
import { UserSessions } from '@gtms/ui/UserSessions'
// styles
import styles from './styles.scss'

type IAccountSecurityPageProps = {
  namespacesRequired: readonly string[]
}

export const AccountSecurityPage: NextPage<IAccountSecurityPageProps> = () => {
  const [loginHistory, setLoginHistory] = useState<{
    history: ILoginHistory[]
    isLoading: boolean
    errorOccured: boolean
  }>({
    history: [],
    isLoading: true,
    errorOccured: false,
  })
  const [userSession, setUserSession] = useState<{
    sessions: IActiveSession[]
    isLoading: boolean
    errorOccured: boolean
  }>({
    sessions: [],
    isLoading: true,
    errorOccured: false,
  })

  const onDeleteSessionClick = useCallback((id: string) => {
    // todo display a confirmation here
    deleteActiveSessionAPI(id)
      .then(() => {
        setUserSession((data) => {
          const { sessions } = data
          const index = sessions.findIndex((session) => session.id === id)

          if (index > -1) {
            sessions.splice(index, 1)
          }

          return {
            sessions: [...sessions],
            isLoading: false,
            errorOccured: false,
          }
        })
      })
      .catch(() => addErrorNotification('Error occured, try again later'))
  }, [])

  useEffect(() => {
    fetchLoginHistoryAPI()
      .then((history) => {
        setLoginHistory({
          isLoading: false,
          errorOccured: false,
          history,
        })
      })
      .catch(() => {
        setLoginHistory({
          isLoading: false,
          errorOccured: true,
          history: [],
        })
      })
    fetchActiveSessionsAPI()
      .then((sessions) => {
        setUserSession({
          sessions,
          isLoading: false,
          errorOccured: false,
        })
      })
      .catch(() =>
        setUserSession({
          sessions: [],
          isLoading: false,
          errorOccured: true,
        })
      )
  }, [])
  return (
    <div className={styles.pageWrapper} data-testid="account-security-page">
      <div className={styles.wrapper}>
        <LoggedUserAccountDetails />
        <Navigation current={Tabs.security} />
        <ChangePassword additionalStyles={styles.changePassword} />
        <UserSessions {...userSession} onDeleteClick={onDeleteSessionClick} />
        <LoginHistory {...loginHistory} />
        <DeleteAccount onConfirm={() => null} />
      </div>
    </div>
  )
}

AccountSecurityPage.getInitialProps = async (ctx: NextPageContext) => {
  if (!hasAuthSessionCookies(ctx)) {
    redirect('/login', ctx)
  }

  return Promise.resolve({
    namespacesRequired: ['account'],
  })
}

export default AccountSecurityPage
