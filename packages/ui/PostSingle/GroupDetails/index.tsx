import React, { FC, useCallback } from 'react'
import cx from 'classnames'
import { IGroup } from '@gtms/commons/models'
import { getImage } from '@gtms/commons/helpers'
import { Link } from '@gtms/commons/i18n'
// ui
import { Picture } from '../../Picture'
// styles
import styles from './styles.scss'

export const GroupDetails: FC<{
  additionalStyles?: string
  group: IGroup
  onGroupClick?: (group: IGroup) => unknown
}> = ({ additionalStyles, group, onGroupClick }) => {
  const onClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      if (!onGroupClick) {
        return
      }

      e.preventDefault()
      e.stopPropagation()

      onGroupClick(group)
    },
    [onGroupClick, group]
  )

  return (
    <div
      data-testid="group-details"
      className={cx(styles.wrapper, additionalStyles)}
    >
      <div className={styles.details}>
        <Link href={`/group/${group.slug}`}>
          <a onClick={onClick}>
            <span>{group.name}</span>
          </a>
        </Link>
        <ul className={styles.stats}>
          <li>
            Posts: <span>{group.postsCounter}</span>
          </li>
          <li>
            Members: <span>{group.membersCounter}</span>
          </li>
        </ul>
      </div>
      <div className={styles.groupAvatar}>
        <Link href={`/group/${group.slug}`}>
          <a onClick={onClick}>
            <Picture {...getImage('50x50', group.avatar)} alt={name} />
          </a>
        </Link>
      </div>
    </div>
  )
}
