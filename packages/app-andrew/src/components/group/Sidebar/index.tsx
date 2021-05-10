import React, { FC, useState, useEffect } from 'react'
import cx from 'classnames'
import useKey from 'use-key-hook'
import { useTranslation } from '@gtms/commons/i18n'
import { getImage } from '@gtms/commons/helpers'
import { FileStatus } from '@gtms/commons'
import { Link } from '@gtms/commons/i18n'
import { GroupAvatarNoImage } from '@app/enums'
// state
import {
  IGroupSidebarContentState,
  groupSidebarContentState,
  groupSidebarContentState$,
} from './state.query'
import { toggleGroupUsers, togglePromotedTagsInGroup } from '@app/state'
// components
import { GroupAvatar } from '@app/components/group/GroupAvatar'
import { GroupSidebarContent } from './GroupSidebarContent'
import { GroupDescription } from '@app/components/group/GroupDescription'
// ui
import { FaUsers } from 'react-icons/fa'
import { BsFillGridFill } from 'react-icons/bs'
import { Button } from '@gtms/ui/Button'
import styles from './styles.scss'

export const GroupSidebar: FC<{}> = () => {
  const { t } = useTranslation('groupPage')
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

  useKey(
    () => {
      state.group?.id && togglePromotedTagsInGroup(state.group.id)
    },
    {
      detectKeys: [27],
    }
  )

  if (!state.group) {
    return null
  }

  return (
    <div className={styles.groupSidebar}>
      <div className={styles.avatarAndName}>
        {state.hasAdminRights &&
          state.avatarFileStatus === FileStatus.notExists && (
            <GroupAvatar
              additionalStyles={styles.groupAvatar}
              files={getImage('50x50', state.group.avatar, GroupAvatarNoImage)}
              filesStatus={state.avatarFileStatus}
              isEditAllowed={true}
            />
          )}
        {((state.hasAdminRights &&
          state.avatarFileStatus !== FileStatus.notExists) ||
          !state.hasAdminRights) &&
          false && (
            <Link href={`/group/${state.group.slug}`}>
              <a>
                <GroupAvatar
                  additionalStyles={styles.groupAvatar}
                  files={getImage(
                    '50x50',
                    state.group.avatar,
                    GroupAvatarNoImage
                  )}
                  filesStatus={state.avatarFileStatus}
                  isEditAllowed={false}
                />
              </a>
            </Link>
          )}
        <h2
          className={styles.header}
          data-tip={t('click-here-to-edit')}
          data-type="dark"
        >
          {state.group?.name}
        </h2>
      </div>
      <GroupDescription
        additionalStyles={styles.desc}
        isEditAllowed={groupQuery.hasAdminRights()}
        slug={state.group?.slug || ''}
        text={
          !state.group?.description
            ? groupQuery.hasAdminRights()
              ? 'you did not add group description yet, click here to change it'
              : ''
            : state.group?.description || ''
        }
      />
      <Button
        onClick={() => {
          state.group?.id && togglePromotedTagsInGroup(state.group.id)
        }}
        additionalStyles={cx(styles.tagsbutton, {
          [styles.active]: state.showPromoted,
        })}
      >
        <i>
          <BsFillGridFill />
        </i>
        <span>Tags</span>
      </Button>
      <Button
        onClick={() => state.group?.id && toggleGroupUsers(state.group.id)}
        additionalStyles={cx(styles.tagsbutton, {
          [styles.active]: state.showUsers,
        })}
      >
        <i>
          <FaUsers />
        </i>
        <span>Users</span>
      </Button>
      <GroupSidebarContent />
    </div>
  )
}
