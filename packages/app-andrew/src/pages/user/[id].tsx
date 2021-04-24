import React, { useState, useEffect } from 'react'
import { NextPage, NextPageContext } from 'next'
import { IUserPageState, userPageState, userPageState$ } from '@app/queries'
import { getUserDetails, initialize } from '@gtms/state-user'
// components
import { Profile } from '@app/components/user/Profile'
import { Groups } from '@app/components/user/Groups'
import { FollowButton } from '@app/components/user/FollowButton'
// styles
import styles from './styles.scss'

type UserPageProps = {
  namespacesRequired: readonly string[]
  initialState: IUserPageState
}

const UserPage: NextPage<UserPageProps> = ({ initialState }) => {
  const [state, setState] = useState<IUserPageState>(initialState)

  useEffect(() => {
    initialize(initialState)
    const sub = userPageState$.subscribe((value) => setState(value))

    return () => {
      sub && !sub.closed && sub.unsubscribe()
    }
  }, [])

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.wrapper}>
        <Profile user={state} />
        <FollowButton user={state} />
        <Groups
          groupsMember={state.groupsMember}
          groupsAdmin={state.groupsAdmin}
          groupsOwner={state.groupsOwner}
        />
      </div>
    </div>
  )
}

UserPage.getInitialProps = async (
  ctx: NextPageContext
): Promise<UserPageProps> => {
  const { id } = ctx?.query

  await getUserDetails(id as string)

  return {
    namespacesRequired: ['userPage'],
    initialState: userPageState(),
  }
}

export default UserPage
