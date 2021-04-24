import React, { FC, useCallback, useState } from 'react'
import { IPost, IUser, IGroup } from '@gtms/commons/models'
import { addErrorNotification } from '@gtms/state-notification'
import { showGroupPreview as showGroupPreviewFunc } from '@app/state/groupPreview'
import { UserAvatarNoImage } from '@app/enums'
// api
import { createAbuseReportAPI } from '@gtms/api-abuse'
// components
import { PostAdmin } from '@app/components/post/Admin'
import { Favs } from '@app/components/post/Favs'
// ui
import { AbuseReportForm, VIEW } from '@gtms/ui/AbuseReportForm'
import { Modal } from '@gtms/ui/Modal'
import { UserPreview } from '@gtms/ui/UserPreview'

const renderFavs = (favs: string[], id: string) => <Favs id={id} favs={favs} />

export const PostsList: FC<{
  additionalStyles?: string
  isAdmin: boolean
  onUserPostsClick?: (user: IUser) => unknown
  posts: IPost[]
  renderPost: (
    post: IPost & {
      renderMenu: (postId: string) => JSX.Element | null
      renderFavs: (favs: string[], id: string) => JSX.Element
      onUserClick: (user: IUser) => unknown
      onOpenGroupPreview?: (group: IGroup) => unknown
    }
  ) => JSX.Element
}> = ({ additionalStyles, isAdmin, onUserPostsClick, posts, renderPost }) => {
  const [userPreview, setUserPreview] = useState<IUser | undefined>()
  const onUserClick = useCallback((user: IUser) => {
    setUserPreview(user)
  }, [])
  const onCloseUserPreview = useCallback(() => {
    setUserPreview(undefined)
  }, [])

  const [abuseReportState, setAbuseReportState] = useState<{
    postId: null | string
    isOpen: boolean
    isMakingRequest: boolean
    view: VIEW
  }>({
    isOpen: false,
    isMakingRequest: false,
    postId: null,
    view: VIEW.form,
  })
  const onCloseReportAbuse = useCallback(
    () =>
      setAbuseReportState({
        isMakingRequest: false,
        isOpen: false,
        view: VIEW.form,
        postId: null,
      }),
    []
  )
  const onReportAbuseClick = useCallback((postId: string) => {
    setAbuseReportState({
      isMakingRequest: false,
      isOpen: true,
      view: VIEW.form,
      postId,
    })
  }, [])
  const renderPostMenu = useCallback(
    (postId: string) => {
      if (!isAdmin) {
        return null
      }

      return (
        <PostAdmin postId={postId} onReportAbuseClick={onReportAbuseClick} />
      )
    },
    [isAdmin]
  )

  const onAbuseReportSubmit = useCallback(
    (data) => {
      setAbuseReportState((state) => ({
        ...state,
        isMakingRequest: true,
      }))
      createAbuseReportAPI({
        ...data,
        post: abuseReportState.postId,
      })
        .then(() => {
          setAbuseReportState({
            isMakingRequest: false,
            isOpen: true,
            view: VIEW.confirmation,
            postId: null,
          })
        })
        .catch(() => {
          setAbuseReportState({
            isMakingRequest: false,
            isOpen: false,
            view: VIEW.form,
            postId: null,
          })
          addErrorNotification('Error occured, try again later')
        })
    },
    [abuseReportState]
  )

  return (
    <div className={additionalStyles} data-testid="posts-list">
      {posts.map((post) =>
        renderPost({
          ...post,
          renderMenu: renderPostMenu,
          renderFavs,
          onUserClick,
          onOpenGroupPreview: showGroupPreviewFunc,
        })
      )}
      {abuseReportState.isOpen && (
        <Modal onClose={onCloseReportAbuse}>
          <AbuseReportForm
            onSubmit={onAbuseReportSubmit}
            view={abuseReportState.view}
            isMakingRequest={abuseReportState.isMakingRequest}
          />
        </Modal>
      )}
      {userPreview && (
        <Modal onClose={onCloseUserPreview}>
          <UserPreview
            noUserAvatar={UserAvatarNoImage}
            onUserPostsClick={onUserPostsClick}
            user={userPreview}
          />
        </Modal>
      )}
    </div>
  )
}
