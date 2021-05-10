import React, { FC, useState, useRef } from 'react'
import { ISubComment, IUser, IAccountDetails } from '@gtms/commons/models'
import { createNewComment } from '@gtms/state-comment'
import { findTagsAPI } from '@gtms/api-tags'
import { findbyUsernameAPI } from '@gtms/api-auth'
import { UserAvatarNoImage } from '@app/enums'
import { showUserPreview } from '@app/state/userPreview'
// ui
import { PostCreate } from '@gtms/ui/PostCreate'
import { PostResponse } from '@gtms/ui/PostSingle/PostResponse'
import { Button } from '@gtms/ui/Button'
import { IoMdSend } from 'react-icons/io'
// styles
import styles from './styles.scss'

export const SubCommentsList: FC<{
  parentComment: string
  postId: string
  subComments?: ISubComment[]
  user: IAccountDetails | null
}> = ({ subComments, user, parentComment, postId }) => {
  const [isAnswerFormOpen, setIsAnswerFormOpen] = useState<boolean>(false)
  const commentForm = useRef<HTMLDivElement>(null)
  const [value, setValue] = useState<string>('')
  const [showSendButton, setShowSendButton] = useState<boolean>(false)

  return (
    <div className={styles.wrapper}>
      {Array.isArray(subComments) && subComments.length > 0 && (
        <div>
          {subComments.map((subComment) => (
            <PostResponse
              key={`subComment-${subComment.id}`}
              html={subComment.html}
              createdAt={subComment.createdAt}
              owner={subComment.owner as IUser}
              user={user}
              noImage={UserAvatarNoImage}
              onUserPreviewClick={showUserPreview}
            />
          ))}
        </div>
      )}

      {!isAnswerFormOpen && (
        <button
          className={styles.btn}
          onClick={(e) => {
            e.preventDefault()

            setIsAnswerFormOpen(true)

            if (commentForm.current) {
              window.scrollTo(0, commentForm.current.offsetTop)
            }
          }}
        >
          Respond
        </button>
      )}

      {isAnswerFormOpen && (
        <div ref={commentForm} onClick={() => setShowSendButton(true)}>
          <PostCreate
            value={value}
            setValue={setValue}
            fetchTags={findTagsAPI}
            fetchUsers={findbyUsernameAPI}
            user={user}
            noImage={UserAvatarNoImage}
          />
          {showSendButton && (
            <Button
              additionalStyles={styles.btn}
              disabled={value === ''}
              onClick={() => {
                createNewComment({
                  post: postId,
                  text: value,
                  parent: parentComment,
                })

                setValue('')
              }}
            >
              senda
              <i>
                <IoMdSend />
              </i>
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
