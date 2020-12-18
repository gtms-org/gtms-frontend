import React, { FC, useState, useRef, useCallback } from 'react'
import cx from 'classnames'
import { formatDistance } from 'date-fns'
import { pl } from 'date-fns/locale'
import Lightbox from 'react-image-lightbox'
// commons
import { getDisplayName, getImage } from '@gtms/commons/helpers'
import {
  IAccountDetails,
  IComment,
  IGroup,
  IPostImage,
  IUser,
} from '@gtms/commons/models'
import { IImage } from '@gtms/commons/types/image'
// ui
import { IoMdSend } from 'react-icons/io'
import { Button } from '../Button'
import { DeletePost } from './DeletePost'
import { GroupDetails } from './GroupDetails'
import { Picture } from '../Picture'
import { PostCreate } from '../PostCreate'
import { PostResponse } from './PostResponse'
import { Tag } from '../Tag'
import { TagGroup } from '../TagGroup'
import { UserAvatar } from '../UserAvatar'
// styles
import styles from './styles.scss'

export const PostSingle: FC<{
  activeTags?: string[]
  additionalStyles?: string
  allowToRespond?: boolean
  createComment: (payload: { post: string; text: string }) => unknown
  createdAt: string
  favs?: string[]
  fetchTags: (query: string, signal: AbortSignal) => Promise<string[]>
  fetchUsers: (query: string, signal: AbortSignal) => Promise<IUser[]>
  firstComments: IComment[]
  group?: string | IGroup
  html: string
  id: string
  images: IPostImage[]
  noImage: { [key: string]: IImage }
  onClick?: (id: string) => unknown
  onLoginRequest?: () => unknown
  onOpenGroupPreview?: (group: IGroup) => unknown
  onTagClick?: (tag: string) => unknown
  onUserClick?: (user: IUser) => unknown
  owner: IUser
  renderFavs?: (favs: string[], id: string) => JSX.Element
  renderMenu?: (postId: string) => JSX.Element | null
  tags: string[]
  user: IAccountDetails | null
}> = ({
  activeTags = [],
  additionalStyles,
  allowToRespond = false,
  createComment,
  createdAt,
  favs = [],
  fetchTags,
  fetchUsers,
  firstComments,
  group,
  html,
  id,
  images,
  noImage,
  onClick,
  onLoginRequest,
  onOpenGroupPreview,
  onTagClick,
  onUserClick,
  owner,
  renderFavs,
  renderMenu,
  tags,
  user,
}) => {
  const [isAnswerFormOpen, setIsAnswerFormOpen] = useState<boolean>(false)
  const [lightboxState, setLightboxState] = useState<{
    isOpen: boolean
    current: number
  }>({
    isOpen: false,
    current: -1,
  })
  const commentForm = useRef<HTMLDivElement>(null)
  const onClickCallback = useCallback(() => {
    onClick && onClick(id)
  }, [id, onClick])
  const onUserClickCallback = useCallback(() => {
    onUserClick && onUserClick(owner)
  }, [onUserClick, owner])
  const [value, setValue] = useState<string>('')
  const [showSendButton, setShowSendButton] = useState<boolean>(false)

  return (
    <div
      className={cx(styles.wrapper, additionalStyles)}
      data-testid="post-single"
    >
      {lightboxState.isOpen && (
        <Lightbox
          enableZoom={false}
          mainSrc={getImage('1300x1300', images[lightboxState.current]).jpg}
          nextSrc={
            getImage(
              '1300x1300',
              images[(lightboxState.current + 1) % images.length]
            ).jpg
          }
          onCloseRequest={() =>
            setLightboxState({
              isOpen: false,
              current: 0,
            })
          }
          onMovePrevRequest={() =>
            setLightboxState((state) => ({
              isOpen: true,
              current: (state.current + images.length - 1) % images.length,
            }))
          }
          onMoveNextRequest={() =>
            setLightboxState((state) => ({
              isOpen: true,
              current: (state.current + 1) % images.length,
            }))
          }
          prevSrc={
            getImage(
              '1300x1300',
              images[
                (lightboxState.current + images.length - 1) % images.length
              ]
            ).jpg
          }
        />
      )}
      {group && typeof group !== 'string' && (
        <GroupDetails
          additionalStyles={styles.groupDetails}
          group={group}
          onGroupClick={onOpenGroupPreview}
        />
      )}
      <div className={styles.postHeader}>
        <UserAvatar
          additionalStyles={styles.userAvatar}
          image={getImage('35x35', owner.avatar, noImage)}
          onClick={onUserClickCallback}
        />
        <a className={styles.userNameAndDate}>
          <span onClick={onUserClickCallback}>{getDisplayName(owner)}</span>
          <span className={styles.date} onClick={onClickCallback}>
            {formatDistance(new Date(createdAt), new Date(), {
              locale: pl,
            })}
          </span>
        </a>
        <div className={styles.actionButtons}>
          {owner.id === user?.id && (
            <DeletePost additionalStyles={styles.deleteBtn} />
          )}
          {renderFavs && renderFavs(favs, id)}
          {renderMenu && renderMenu(id)}
        </div>
      </div>
      <div className={styles.content}>
        <div
          className={styles.message}
          dangerouslySetInnerHTML={{ __html: html }}
        />
        {images.length > 0 && (
          <ul className={styles.images}>
            {images.map((img, index) => (
              <li className={styles.item} key={`post-img-${index}`}>
                <a
                  onClick={(e) => {
                    e.preventDefault()

                    setLightboxState({
                      isOpen: true,
                      current: index,
                    })
                  }}
                  href={getImage('1300x1300', img).jpg}
                >
                  <Picture {...getImage('200x200', img)} />
                </a>
              </li>
            ))}
          </ul>
        )}
        {tags.length > 0 && (
          <TagGroup additionalStyles={styles.tagGroup}>
            {tags.map((tag) => (
              <Tag
                additionalStyles={cx({
                  [styles.activeTag]: activeTags.includes(tag),
                })}
                key={`post-tag-${tag}`}
                label={tag}
                onClick={() => onTagClick && onTagClick(tag)}
              />
            ))}
          </TagGroup>
        )}
        {Array.isArray(firstComments) &&
          firstComments.length > 0 &&
          firstComments.map((comment) => (
            <PostResponse
              createdAt={comment.createdAt}
              html={comment.html}
              key={`comment-${comment.id}`}
              noImage={noImage}
              owner={comment.owner as IUser}
              user={user}
            />
          ))}
        {isAnswerFormOpen && allowToRespond && (
          <div ref={commentForm} onClick={() => setShowSendButton(true)}>
            <PostCreate
              fetchTags={fetchTags}
              fetchUsers={fetchUsers}
              noImage={noImage}
              setValue={setValue}
              user={user}
              value={value}
            />
            {showSendButton && (
              <Button
                additionalStyles={styles.btn}
                disabled={value === ''}
                onClick={() => {
                  createComment({
                    post: id,
                    text: value,
                  })

                  setValue('')
                }}
              >
                send
                <i>
                  <IoMdSend />
                </i>
              </Button>
            )}
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
