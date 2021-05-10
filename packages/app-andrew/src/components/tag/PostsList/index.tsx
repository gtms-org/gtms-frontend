import React, { FC } from 'react'
import { IPost, IAccountDetails } from '@gtms/commons/models'
import { findTagsAPI } from '@gtms/api-tags'
import { findbyUsernameAPI } from '@gtms/api-auth'
import { UserAvatarNoImage } from '@app/enums'
import { openLoginModal } from '@app/state'
// ui
import { MockData } from '@gtms/ui/MockData'
import { PostSingle } from '@gtms/ui/PostSingle'
import { Spinner } from '@gtms/ui/Spinner'
// styles
import styles from './styles.scss'

export const PostsList: FC<{
  records: IPost[]
  isLoading: boolean
  user: IAccountDetails | null
}> = ({ records, isLoading, user }) => {
  return (
    <div className={styles.wrapper} data-testid="posts-list">
      {isLoading && <Spinner />}
      {!isLoading &&
        records.length > 0 &&
        records.map((post) => (
          <PostSingle
            {...post}
            createComment={() => null}
            fetchTags={findTagsAPI}
            fetchUsers={findbyUsernameAPI}
            key={`post-${post.id}`}
            noImage={UserAvatarNoImage}
            onLoginRequest={openLoginModal}
            user={user}
          />
        ))}
      {!isLoading && records.length === 0 && (
        <MockData additionalStyles={styles.noRecords} numberOfElements={4} />
      )}
    </div>
  )
}
