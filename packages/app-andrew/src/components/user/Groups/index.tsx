import React, { FC, useState } from 'react'
import cx from 'classnames'
import { Link } from '@gtms/commons/i18n'
import { IGroup } from '@gtms/commons/models'
import { getImage } from '@gtms/commons/helpers'
import { GroupAvatarNoImage } from '@app/enums'
// ui
import { Pagination } from '@gtms/ui/Pagination'
import { Picture } from '@gtms/ui/Picture'
import styles from './styles.scss'

enum Tabs {
  groupsMember,
  groupsAdmin,
  groupsOwner,
}

const GroupsList: FC<{ groups: IGroup[] }> = ({ groups }) => {
  return (
    <>
      <ul className={styles.groupItems}>
        {groups.map((group) => (
          <li className={styles.item} key={`group-${group.id}`}>
            <Link href={`/group/${group.id}`}>
              <a>
                <Picture
                  additionalStyles={styles.image}
                  {...getImage('200x200', group.avatar, GroupAvatarNoImage)}
                />
                <div className={styles.headerAndDesc}>
                  <h2 className={styles.header}>{group.name}</h2>
                  <p>
                    czlonkow: {group.membersCounter} / postow:{' '}
                    {group.postsCounter}
                  </p>
                </div>
              </a>
            </Link>
          </li>
        ))}
      </ul>
      <Pagination
        additionalStyles={styles.pagination}
        getCurrentUrl={() => null}
        limit={1}
        offset={1}
        onClick={() => null}
        total={5}
      />
    </>
  )
}

export const Groups: FC<{
  groupsMember: IGroup[]
  groupsAdmin: IGroup[]
  groupsOwner: IGroup[]
}> = ({ groupsMember, groupsAdmin, groupsOwner }) => {
  const [currentTab, setCurrentTab] = useState<Tabs>(Tabs.groupsMember)

  return (
    <div className={styles.wrapper} data-testid="user-groups">
      <div className={styles.navigation}>
        <h2 className={styles.header}>My groups:</h2>
        <ul className={styles.items}>
          <li
            className={cx(styles.item, {
              [styles.active]: currentTab === Tabs.groupsMember,
            })}
          >
            <a onClick={() => setCurrentTab(Tabs.groupsMember)}>All</a>
          </li>
          <li
            className={cx(styles.item, {
              [styles.active]: currentTab === Tabs.groupsAdmin,
            })}
          >
            <a onClick={() => setCurrentTab(Tabs.groupsAdmin)}>
              I administrate
            </a>
          </li>
          <li
            className={cx(styles.item, {
              [styles.active]: currentTab === Tabs.groupsOwner,
            })}
          >
            <a onClick={() => setCurrentTab(Tabs.groupsOwner)}>I own</a>
          </li>
        </ul>
      </div>

      {currentTab === Tabs.groupsMember && groupsMember?.length > 0 && (
        <GroupsList groups={groupsMember} />
      )}
      {currentTab === Tabs.groupsMember && groupsMember?.length === 0 && (
        <p>User did not join any group yet</p>
      )}

      {currentTab === Tabs.groupsAdmin && groupsAdmin?.length > 0 && (
        <GroupsList groups={groupsAdmin} />
      )}
      {currentTab === Tabs.groupsAdmin && groupsAdmin?.length === 0 && (
        <p>User has no admin rights</p>
      )}

      {currentTab === Tabs.groupsOwner && groupsOwner?.length > 0 && (
        <GroupsList groups={groupsOwner} />
      )}
      {currentTab === Tabs.groupsOwner && groupsOwner?.length === 0 && (
        <p>User did not create any group</p>
      )}
    </div>
  )
}
