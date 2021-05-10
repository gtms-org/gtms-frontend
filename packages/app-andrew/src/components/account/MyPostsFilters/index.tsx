import React, { FC, useState, useEffect } from 'react'
import cx from 'classnames'
// api
import { fetchMyPostDetails, IMyPostsDetailsResponse } from '@gtms/api-post'
// commons
import { getImage } from '@gtms/commons/helpers'
import { GroupAvatarNoImage } from '@app/enums'
//state
import { showGroupPreview } from '@app/state/groupPreview'
// ui
import { IoMdInformationCircleOutline } from 'react-icons/io'
import { Picture } from '@gtms/ui/Picture'
import { Spinner } from '@gtms/ui/Spinner'
// styles
import styles from './styles.scss'

export const MyPostsFilters: FC<{
  active?: string[]
  additionalStyles?: string
  onGroupClick: (groupName: string, groupId: string) => void
}> = ({ active = [], additionalStyles, onGroupClick }) => {
  const [data, setData] = useState<{
    isLoading: boolean
    errorOccured: boolean
    filters?: IMyPostsDetailsResponse[]
  }>({
    isLoading: true,
    errorOccured: false,
  })

  useEffect(() => {
    fetchMyPostDetails().then((res) => {
      setData({
        isLoading: false,
        errorOccured: false,
        filters: res,
      })
    })
  }, [])

  if (!data.isLoading && !data.errorOccured && data.filters?.length === 0) {
    // in general should not happen, as we should not load this component if user has no posts
    return null
  }

  return (
    <div 
      data-testid="posts-filters"
      className={cx(styles.wrapper, additionalStyles)}
      >
      {data.isLoading && <Spinner additionalStyles={styles.spinner} />}
      {!data.isLoading && data.errorOccured && (
        <p>Error occured, please try later</p>
      )}
      {data.filters && data.filters.length > 0 && (
        <ul className={styles.items}>
          {data.filters.map((group) => (
            <li
              className={cx(styles.item, {
                [styles.active]: active.includes(group.name),
              })}
              key={`group-filter-${group.id}`}
            >
              <Picture
                additionalStyles={styles.avatar}
                onClick={() => showGroupPreview(group)}
                {...getImage('50x50', group.avatar, GroupAvatarNoImage)}
              />
              <div className={styles.desc}>
                <a onClick={() => onGroupClick(group.name, group.id)}>
                  {group.name}
                  <span>
                    {group.count} posts created
                  </span>
                </a>
              </div>
              <i className={styles.iconInfo}>
                <IoMdInformationCircleOutline />
              </i>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
