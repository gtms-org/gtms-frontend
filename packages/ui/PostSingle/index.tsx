import React, { FC, useState, useRef, useCallback } from 'react'
import cx from 'classnames'
import ReactMarkdown from 'react-markdown'
import { formatDistance } from 'date-fns'
import { pl } from 'date-fns/locale'
// commons
import { getDisplayName } from '@gtms/commons/helpers'
import { IAccountDetails, IUser, IComment } from '@gtms/commons/models'
import { FileStatus } from '@gtms/commons/enums'
import { Link } from '@gtms/commons/i18n'
import { IImage } from '@gtms/commons/types/image'
// ui
import { DeletePost } from './DeletePost'
import { Picture } from '../Picture'
import { PostCreate } from '../PostCreate'
import { PostResponse } from './PostResponse'
import { Tag } from '../Tag'
import { TagGroup } from '../TagGroup'
import { UserAvatar } from '../UserAvatar'
import styles from './styles.scss'

export const PostSingle: FC<{
  id: string
  text: string
  createdAt: string
  additionalStyles?: string
  firstComments: IComment[]
  owner: IUser
  tags: string[]
  activeTags?: string[]
  favs?: string[]
  renderFavs?: (favs: string[], id: string) => JSX.Element
  user: IAccountDetails | null
  allowToRespond?: boolean
  createComment: (payload: { post: string; text: string }) => unknown
  fetchTags: (query: string, signal: AbortSignal) => Promise<string[]>
  fetchUsers: (query: string, signal: AbortSignal) => Promise<string[]>
  noImage: { [key: string]: IImage }
  onClick?: (id: string) => unknown
  onTagClick?: (tag: string) => unknown
  onLoginRequest?: () => unknown
}> = ({
  id,
  additionalStyles,
  text,
  createdAt,
  owner,
  noImage,
  tags,
  fetchTags,
  fetchUsers,
  createComment,
  firstComments,
  user,
  onClick,
  onTagClick,
  onLoginRequest,
  renderFavs,
  favs = [],
  allowToRespond = true,
  activeTags = [],
}) => {
  const [isAnswerFormOpen, setIsAnswerFormOpen] = useState<boolean>(false)
  const commentForm = useRef<HTMLDivElement>(null)
  const onClickCallback = useCallback(() => {
    onClick && onClick(id)
  }, [id, onClick])

  return (
    <div
      className={cx(styles.wrapper, additionalStyles)}
      data-testid="post-single"
    >
      <div className={styles.header}>
        <div className={styles.user}>
          <Link href={`/user/${owner.id}`}>
            <>
              <UserAvatar
                image={
                  owner.avatar?.status === FileStatus.ready
                    ? (owner.avatar.files['35x35'] as IImage)
                    : noImage['35x35']
                }
                additionalStyles={styles.userAvatar}
              />
            </>
          </Link>
          <div>
            <Link href={`/user/${owner.id}`}>
              <span>{getDisplayName(owner)}</span>
            </Link>
            <a onClick={onClickCallback}>
              <span className={styles.date}>
                {formatDistance(new Date(createdAt), new Date(), {
                  locale: pl,
                })}
              </span>
            </a>
          </div>
        </div>
        <div className={styles.actionButtons}>
          {owner.id === user?.id && (
            <DeletePost additionalStyles={styles.deleteBtn} />
          )}
          {renderFavs && renderFavs(favs, id)}
        </div>
      </div>
      <div className={styles.desc}>
        <ReactMarkdown className={styles.text} source={text} />
        {tags.length > 0 && (
          <TagGroup additionalStyles={styles.tagGroup}>
            {tags.map((tag) => (
              <Tag
                onClick={() => onTagClick && onTagClick(tag)}
                label={tag}
                additionalStyles={cx({
                  [styles.activeTag]: activeTags.includes(tag),
                })}
                key={`post-tag-${tag}`}
              />
            ))}
          </TagGroup>
        )}
        {Array.isArray(firstComments) && firstComments.length > 0 && (
          <>
            {firstComments.map((comment) => (
              <PostResponse
                key={`comment-${comment.id}`}
                text={comment.text}
                createdAt={comment.createdAt}
                owner={comment.owner as IUser}
                noImage={noImage}
                user={user}
              />
            ))}
          </>
        )}
        {isAnswerFormOpen && allowToRespond && (
          <div ref={commentForm}>
            <PostCreate
              additionalStyles={styles.postResponseCreate}
              onSubmit={(text) => {
                createComment({
                  text,
                  post: id,
                })
              }}
              fetchTags={fetchTags}
              fetchUsers={fetchUsers}
              user={user}
              noImage={noImage}
            />
          </div>
        )}
      </div>
      <div className={styles.btns}>
        {allowToRespond && (user || onLoginRequest) && (
          <button
            className={styles.respondBtn}
            onClick={(e) => {
              e.preventDefault()

              if (!user && onLoginRequest) {
                return onLoginRequest()
              }

              setIsAnswerFormOpen(true)
              if (commentForm.current) {
                window.scrollTo(0, commentForm.current.offsetTop)
              }
            }}
          >
            respond...
          </button>
        )}
        <button className={styles.readMoreBtn} onClick={onClickCallback}>
          read more...
        </button>
      </div>
    </div>
  )
}
