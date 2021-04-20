import React, { FC, useState, useEffect } from 'react'
// state
import {
  IGroupSidebarContentState,
  groupSidebarContentState,
  groupSidebarContentState$,
} from './state.query'
// components
import { FavsButton } from '@app/components/group/FavsButton'
import { FollowButton } from '@app/components/group/FollowButton'
import { JoinLeaveButton } from '@app/components/group/JoinLeaveButton'
import { SettingsButton } from '@app/components/group/SettingsButton'
// ui
import { FaBars } from 'react-icons/fa'
import { Button } from '@gtms/ui/Button'
import { Overlay } from '@gtms/ui/Overlay'
// styles
import styles from './styles.scss'

export const GroupSidebarContent: FC<{}> = () => {
  const [state, setState] = useState<IGroupSidebarContentState>(
    groupSidebarContentState()
  )

  useEffect(() => {
    const sub = groupSidebarContentState$.subscribe((value) => {
      setState(value)
    })

    return () => {
      sub && !sub.closed && sub.unsubscribe()
    }
  }, [])

  const [isDropdownActive, setIsDropdownActive] = useState<boolean>(false)

  if (!state.group) {
    return null
  }

  return (
    <ul className={styles.wrapper}>
      <Button
        additionalStyles={styles.btnDropdown}
        onClick={() => setIsDropdownActive(!isDropdownActive)}
      >
        <i>
          <FaBars />
        </i>
      </Button>
      {isDropdownActive && (
        <>
          <FavsButton
            additionalStyles={styles.favsButton}
            group={state.group}
          />
          <JoinLeaveButton
            additionalStyles={styles.joinLeaveButton}
            group={state.group}
          />
          <SettingsButton
            additionalStyles={styles.settingsButton}
            group={state.group}
          />
          <FollowButton
            additionalStyles={styles.followButton}
            group={state.group}
          />
        </>
      )}
    </ul>
  )
}
