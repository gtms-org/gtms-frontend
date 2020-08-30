import React, { FC } from 'react'
import cx from 'classnames'
import { IGroup } from '@gtms/commons/models'
import { getImage } from '@gtms/commons/helpers'
import { IImage } from '@gtms/commons/types/image'
// ui
import { Button } from '@gtms/ui/Button'
import { GridCard } from '@gtms/ui/GridCard'
import { Spinner } from '@gtms/ui/Spinner'
import styles from './styles.scss'

export const UserGroups: FC<{
  additionalStyles?: string
  isLoading?: boolean
  groups: IGroup[]
  noImage: { [key: string]: IImage }
}> = ({ additionalStyles, groups, noImage, isLoading = false }) => {
  return (
    <div className={cx(styles.wrapper, additionalStyles)}>
      {isLoading && <Spinner />}
      {groups.length > 0 && (
        <>
          <ul className={styles.items}>
            {groups.map((group) => (
              <li className={styles.item} key={`group-${group.id}`}>
                <GridCard
                  name={group.name}
                  desc={group.description}
                  image={getImage('200x200', group.avatar, noImage)}
                />
              </li>
            ))}
          </ul>
          <div className={styles.btnWrapper}>
            <Button type="submit" additionalStyles={styles.btn}>
              <Spinner size="sm" />
              show more...
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
