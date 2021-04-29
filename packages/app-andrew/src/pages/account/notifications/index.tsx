import React from 'react'
import { NextPage, NextPageContext } from 'next'
import { NotificationsSettings } from '@app/components/account/NotificationsSettings'
import { Navigation, Tabs } from '@app/components/account/Navigation'
import { redirect } from '@gtms/commons/helpers/redirect'
import { hasAuthSessionCookies } from '@gtms/state-user'
import { LoggedUserAccountDetails } from '@app/components/account/LoggedUserAccountDetails'
// styles
import styles from './styles.scss'

type IAccountNotificationsPageProps = {
  namespacesRequired: readonly string[]
}

export const AccountNotificationsPage: NextPage<IAccountNotificationsPageProps> = () => {
  return (
    <div className={styles.pageWrapper}>
      <div className={styles.wrapper}>
        <LoggedUserAccountDetails />
        <Navigation current={Tabs.notifications} />
        <NotificationsSettings />
      </div>
    </div>
  )
}

AccountNotificationsPage.getInitialProps = async (ctx: NextPageContext) => {
  if (!hasAuthSessionCookies(ctx)) {
    redirect('/login', ctx)
  }

  return Promise.resolve({
    namespacesRequired: ['account'],
  })
}

export default AccountNotificationsPage
