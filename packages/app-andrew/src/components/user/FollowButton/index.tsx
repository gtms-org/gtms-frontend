import React, { FC, useState, useEffect } from 'react'
import { IUser } from '@gtms/commons/models'
import {
  loadNotificationsSettings,
  followUser,
  unfollowUser,
} from '@gtms/state-notification'
import {
  followButtonState,
  followButtonState$,
  IFollowButtonState,
} from './state.query'
import Switch from 'react-switch'
import { openLoginModal } from 'state'

export const FollowButton: FC<{ user: IUser }> = ({ user }) => {
  const [state, setState] = useState<IFollowButtonState>(
    followButtonState(user.id)
  )

  useEffect(() => {
    loadNotificationsSettings()
    const sub = followButtonState$(user.id).subscribe((value) =>
      setState(value)
    )

    return () => {
      sub && !sub.closed && sub.unsubscribe()
    }
  }, [])

  if (state.userId === user.id) {
    return null // user can not follow himself
  }

  if (state.errorOccurred) {
    return null
  }

  return (
    <div data-testid="follow-button">
      <label>
        <span>Follow</span>
        <Switch
          onChange={(value) => {
            if (!state.isLogged) {
              return openLoginModal()
            }

            if (value) {
              return followUser(user.id)
            }

            unfollowUser(user.id)
          }}
          checked={state.isFollowing}
        />
      </label>
    </div>
  )
}
