import React, { FC } from 'react'
import cx from 'classnames'
import { IGroup } from '@gtms/commons/models'
import { getImage } from '@gtms/commons/helpers'
import { IImage } from '@gtms/commons/types/image'
import { Link } from '@gtms/commons/i18n'
// ui
import { Button } from '@gtms/ui/Button'
import { GridCard } from '@gtms/ui/GridCard'
import { Spinner } from '@gtms/ui/Spinner'
import styles from './styles.scss'

export const UserGroups: FC<{
  additionalStyles?: string
  groups: IGroup[]
  isLoading?: boolean
  noImage: { [key: string]: IImage }
}> = ({ additionalStyles, groups, isLoading = false, noImage }) => {
  return (
    <div className={cx(styles.wrapper, additionalStyles)}>
      {isLoading && <Spinner />}
      {groups.length > 0 && (
        <>
          <ul className={styles.items}>
            {groups.map((group) => (
              <li className={styles.item} key={`group-${group.id}`}>
                <Link href={`/group/${group.slug}`}>
                  <a>
                    <GridCard
                      name={group.name}
                      desc={group.description}
                      image={getImage('200x200', group.avatar, noImage)}
                    />
                  </a>
                </Link>
              </li>
            ))}
          </ul>
          <Button type="submit" additionalStyles={styles.btn}>
            <Spinner size="xsm" />
            show more...
          </Button>
        </>
      )}
    </div>
  )
}
