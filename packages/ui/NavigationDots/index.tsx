import React, { FC, useState } from 'react'
import cx from 'classnames'
import { Link } from '@gtms/commons/i18n'
import { IGroup } from '@gtms/commons/models'
import { IImage } from '@gtms/commons/types/image'
import { getImage } from '@gtms/commons/helpers'
import { ReactSortable } from 'react-sortablejs'
// ui
import useKey from 'use-key-hook'
import { IoIosKeypad } from 'react-icons/io'
import styles from './styles.scss'

export const NavigationDots: FC<{
  groups: IGroup[]
  isOpen: boolean
  noImage: { [key: string]: IImage }
  onClose: () => void
  onOpen: () => void
  onOrderChange?: (groups: IGroup[]) => unknown
}> = ({
  children,
  groups,
  isOpen,
  noImage,
  onClose,
  onOpen,
  onOrderChange,
}) => {
  const [sortedGroups, setSortedGroups] = useState<IGroup[]>(groups)

  useKey(
    () => {
      onClose()
    },
    {
      detectKeys: [27],
    }
  )

  if (groups.length === 0) {
    return null
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.navigationDot} data-testid="navigation-dots">
        <div
          className={cx(styles.item, styles.showAllGroups, {
            [styles.active]: isOpen,
          })}
          onClick={() => {
            isOpen ? onClose() : onOpen()
          }}
        >
          <i>
            <IoIosKeypad />
          </i>
        </div>
        <div className={styles.myGroups}>
          <ReactSortable
            list={sortedGroups}
            setList={setSortedGroups}
            onEnd={() => {
              onOrderChange && onOrderChange(sortedGroups)
            }}
          >
            {sortedGroups.map((value, index) => (
              <div className={styles.item} key={index}>
                <Link href={`/group/${value.slug}`}>
                  <div
                    style={{
                      backgroundImage: `url(${
                        getImage('50x50', value.avatar, noImage).jpg
                      })`,
                    }}
                  />
                </Link>
              </div>
            ))}
          </ReactSortable>
        </div>
      </div>
      <div
        className={cx(styles.fullView, {
          [styles.active]: isOpen,
        })}
      >
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  )
}
