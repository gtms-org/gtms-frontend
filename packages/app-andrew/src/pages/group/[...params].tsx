import React, { useState, useEffect, useCallback } from 'react'
import cx from 'classnames'
import { NextPage, NextPageContext } from 'next'
import { useRouter } from 'next/router'
import { UserAvatarNoImage } from '@app/enums'
import { getImage, onlyUnique } from '@gtms/commons/helpers'
import { useInitState } from '@gtms/commons/hooks'
import { IPost } from '@gtms/commons/models'
// api
import { fetchPost, Sorting } from '@gtms/api-post'
import { findTagsAPI } from '@gtms/api-tags'
import { findbyUsernameAPI } from '@gtms/api-auth'
// components
import { GroupCover } from '@app/components/group/GroupCover'
import { GroupHeader } from '@app/components/group/GroupHeader'
import { GroupMembers } from '@app/components/group/GroupMembers'
import { GroupNoAccess } from '@app/components/group/GroupNoAccess'
import { GroupNotFound } from '@app/components/group/GroupNotFound'
import { PostCreate } from '@app/components/post/PostCreate'
import { PostDetails } from '@app/components/post/PostDetails'
import { PostsList } from '@app/components/post/PostsList'
import { PromotedTags } from '@app/components/group/PromotedTags'
import { TagsBar } from '@app/components/group/TagsBar'
// state
import {
  IGroupPageState,
  groupPageState,
  groupPageState$,
} from '@app/queries/groupPage.query'
import { openLoginModal } from '@app/state'
import { groupQuery, IGroupState, getGroup, initGroup } from '@gtms/state-group'
import { checkGroupsFavStatus } from '@gtms/state-user'
import {
  createNewComment,
  getGroupPosts,
  postsQuery,
  IPostsState,
  initPostsStore,
} from '@gtms/state-post'
import {
  getPostComments,
  postCommentsQuery,
  IPostCommentsState,
  initPostCommentsStore,
} from '@gtms/state-comment'
import { saveRecentlyViewedTag } from '@gtms/state-tag'
import {
  changePageBackground,
  changePageBackgroundImage,
  clearPageBackground,
  showPostDetailsModal,
} from '@app/state'
// ui
import { useSwipeable } from 'react-swipeable'
import Headroom from 'react-headroom'
import { IoMdGrid } from 'react-icons/io'
import { ErrorWrapper } from '@gtms/ui/ErrorWrapper'
import { Overlay } from '@gtms/ui/Overlay'
import { Pagination } from '@gtms/ui/Pagination'
import { PostSingle } from '@gtms/ui/PostSingle'
import { Spinner } from '@gtms/ui/Spinner'
import { WelcomeText } from '@gtms/ui/WelcomeText'
// styles
import styles from './styles.scss'

type GroupPageProps = {
  namespacesRequired: readonly string[]
  group?: IGroupState
  posts?: IPostsState
  post?: IPost
  comments?: IPostCommentsState
}

const getInitData = ({
  group,
  posts,
  post,
  comments,
}: GroupPageProps) => () => {
  if (group) {
    initGroup(group)

    if (group.group?.bgType) {
      if (group.group?.bgType === 'file') {
        changePageBackgroundImage(
          getImage('origin', group.group.bg).jpg,
          getImage('mini', group.group.bg).jpg
        )
      } else {
        changePageBackground(group.group.bgType)
      }
    }
  }
  posts && initPostsStore(posts, post)
  comments && initPostCommentsStore(comments)
}

const parseParams = (params: string[]) => {
  const result: {
    tag: string[]
    post: string[]
    user: string[]
    slug: null | string
    page: string[]
    sort: Sorting[]
  } = {
    tag: [],
    post: [],
    user: [],
    slug: null,
    page: [],
    sort: [],
  }

  let index: 'tag' | 'post' | 'sort' | 'user' | 'page' | null = null

  for (const param of params) {
    if (result.slug === null) {
      result.slug = param
      continue
    }

    if (['tag', 'post', 'sort', 'user', 'page'].includes(param)) {
      index = param as 'tag' | 'post' | 'sort' | 'user' | 'page'
      continue
    }

    if (index !== null) {
      result[index].push(param as any)
    }
  }

  return result
}

const GroupPage: NextPage<GroupPageProps> = (props) => {
  useInitState(getInitData(props))

  const router = useRouter()
  const [state, setState] = useState<IGroupPageState>(groupPageState())
  const [showWelcomeText, setShowWelcomeText] = useState<boolean>(false)
  const generateUrl = useCallback(
    ({
      sort,
      post,
      user,
      tag,
      page,
      fillEmptyValues = false,
    }: {
      sort?: Sorting
      post?: string
      user?: string | string[]
      tag?: string | string[]
      page?: string | number
      fillEmptyValues?: boolean
    }) => {
      if (fillEmptyValues) {
        sort = sort || state.postsSorting
        user = user || state.activeUsers
        tag = tag || state.activeTags
      }

      let url = `/group/${state.group?.slug}`

      if (page) {
        url += `/page/${page}`
      }

      if (
        (typeof user === 'string' && user !== '') ||
        (Array.isArray(user) && user.length > 0)
      ) {
        url += `/user/${
          Array.isArray(user) ? user.filter(onlyUnique).join('/') : user
        }`
      }

      if (sort) {
        url += `/sort/${sort}`
      }

      if (
        (typeof tag === 'string' && tag !== '') ||
        (Array.isArray(tag) && tag.length > 0)
      ) {
        url += `/tag/${
          Array.isArray(tag) ? tag.filter(onlyUnique).join('/') : tag
        }`
      }

      if (post) {
        url += `/post/${post}`
      }

      return url
    },
    [state]
  )
  const onClick = useCallback(
    ({
      sort,
      post,
      user,
      tag,
      page,
    }: {
      sort?: Sorting
      post?: string
      user?: string
      tag?: string
      page?: string | number
    }) => {
      const tags = Array.isArray(state.activeTags) ? state.activeTags : []

      if (tag) {
        tags.push(tag)
        if (state.group?.id) {
          saveRecentlyViewedTag(state.group.id, tag)
        }
      }

      const url = generateUrl({
        sort,
        post,
        user,
        tag: tags,
        page,
      })

      router.push(url)
    },
    [state]
  )

  const onPostClick = useCallback((id: string) => {
    showPostDetailsModal(id, true)
  }, [])
  const onTagClick = useCallback((tag: string) => onClick({ tag }), [onClick])

  useEffect(() => {
    const sub = groupPageState$.subscribe((value) => {
      if (value.group && value.user?.id) {
        checkGroupsFavStatus([value.group.id])
      }
      setState(value)
    })

    return () => {
      clearPageBackground()
      sub && !sub.closed && sub.unsubscribe()
    }
  }, [])

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => alert('left'),
    onSwipedRight: () => alert('right'),
  })

  return (
    <div className={styles.pageWrapper} {...swipeHandlers}>
      {state.isLoading && <Spinner />}

      {state.errorOccured && (
        <ErrorWrapper withFullBg>
          <h2>ERROR OCCURED</h2>
          <p>
            Create a proper component that can be used here when 500 from BE
          </p>
        </ErrorWrapper>
      )}

      {state.notFound && <GroupNotFound />}

      {state.hasNoAccess && <GroupNoAccess />}

      {showWelcomeText && (
        <WelcomeText onClick={() => setShowWelcomeText(false)} />
      )}

      {state.group && (
        <div className={styles.wrapper} data-testid="group-page">
          <GroupCover
            additionalStyles={styles.groupCover}
            group={state.group}
            isEditAllowed={groupQuery.hasAdminRights()}
          />
          <div className={styles.templogo} />
          <TagsBar additionalStyles={styles.tagsBar} />
          <div className={styles.content}>
            <GroupHeader />
            <br /> {/* for aligning horizontally logo tags and content */}
            {/* <Headroom upTolerance={5} className={styles.headroom}>
              <GroupHeader
                additionalStyles={cx({
                  [styles.widthMax]: !state.showPromoted && state.activePost,
                })}
              />
            </Headroom> */}
            {state.showPromoted && (
              <>
                <PromotedTags
                  additionalStyles={styles.promotedTags}
                  onTagClick={(tag) => onClick({ tag: tag.tag })}
                />
                {/* <Overlay /> */}
              </>
            )}
            {state.showUsers && (
              <>
                <GroupMembers
                  additionalStyles={styles.groupMembers}
                  slug={state.group.slug}
                  {...state.members}
                />
                {/* <Overlay /> */}
              </>
            )}
            {!showWelcomeText && (
              <>
                <div className={styles.posts}>
                  {state.posts.posts.length === 0 && (
                    <div className={styles.noPostsFound}>
                      <PostCreate groupId={state.group?.id || ''} />
                      <h3 className={styles.header}>
                        <span>Ooops</span>, wygląda na to, że nikt nie dodał
                        jeszcze żadnego posta... Możesz być pierwszy!
                      </h3>
                    </div>
                  )}
                  {state.posts.isLoading && (
                    <Spinner additionalStyles={styles.loading} />
                  )}
                  {!state.posts.isLoading &&
                    !state.posts.errorOccured &&
                    state.posts.posts.length > 0 && (
                      <>
                        {/* @todo GEOT-764 */}
                        {/* <h2 className={cx(styles.header, styles.active)}>
                          <i>
                            <IoMdGrid />
                          </i>
                          Posts
                        </h2>
                        <h2 className={styles.header}>
                          <i>
                            <IoMdGrid />
                          </i>
                          Users
                        </h2> */}
                        <ul className={styles.navigation}>
                          <li
                            onClick={() => onClick({ sort: Sorting.latest })}
                            className={cx(styles.item, {
                              [styles.active]:
                                state.postsSorting === Sorting.latest,
                            })}
                          >
                            <i>
                              <IoMdGrid />
                            </i>
                            latest
                          </li>
                          <li
                            onClick={() => onClick({ sort: Sorting.active })}
                            className={cx(styles.item, {
                              [styles.active]:
                                state.postsSorting === Sorting.active,
                            })}
                          >
                            <i>
                              <IoMdGrid />
                            </i>
                            active
                          </li>
                          <li
                            onClick={() => onClick({ sort: Sorting.popular })}
                            className={cx(styles.item, {
                              [styles.active]:
                                state.postsSorting === Sorting.popular,
                            })}
                          >
                            <i>
                              <IoMdGrid />
                            </i>
                            popular
                          </li>
                        </ul>
                        <PostCreate
                          additionalStyles={styles.postCreate}
                          groupId={state.group?.id || ''}
                        />
                        <PostsList
                          additionalStyles={styles.postsList}
                          posts={state.posts.posts}
                          onUserPostsClick={(user) =>
                            onClick({ user: user.username })
                          }
                          isAdmin={groupQuery.hasAdminRights()}
                          renderPost={(post) => (
                            <PostSingle
                              activeTags={state.activeTags || []}
                              additionalStyles={cx(styles.post, {
                                [styles.active]:
                                  state.activePost?.id === post.id,
                              })}
                              allowToRespond={post.id !== state.activePost?.id}
                              createComment={createNewComment}
                              fetchTags={findTagsAPI}
                              fetchUsers={findbyUsernameAPI}
                              key={`post-${post.id}`}
                              noImage={UserAvatarNoImage}
                              onClick={onPostClick}
                              onLoginRequest={openLoginModal}
                              onTagClick={onTagClick}
                              user={state.user}
                              {...post}
                            />
                          )}
                        />
                        <Pagination
                          additionalStyles={styles.pagination}
                          {...state.pagination}
                          getCurrentUrl={(page: number) => {
                            return generateUrl({
                              page,
                              fillEmptyValues: true,
                            })
                          }}
                          onClick={(page: number) => {
                            onClick({ page })
                          }}
                        />
                      </>
                    )}
                </div>
                {!state.showPromoted && state.activePost && (
                  <PostDetails
                    activeTags={state.activeTags || []}
                    additionalStyles={styles.postDetails}
                    comments={state.comments}
                    post={state.activePost}
                    user={state.user}
                  />
                )}
                {/* <Overlay /> */}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

GroupPage.getInitialProps = async (
  ctx: NextPageContext
): Promise<GroupPageProps> => {
  const { params } = ctx?.query
  const { slug, tag, post, user, sort, page } = parseParams(params as string[])
  const postId = Array.isArray(post) && post.length > 0 ? post[0] : undefined
  const POSTS_LIMIT = 10
  const postsOffset = (parseInt(page[0] || '1', 10) - 1) * POSTS_LIMIT

  await getGroup(slug as string)

  const id = groupQuery.getId() || ''
  return Promise.all([
    new Promise<any>((resolve) => {
      if (!postId) {
        return resolve()
      }

      fetchPost(postId, false)
        .then(resolve)
        .catch(() => resolve())
    }),
    new Promise<undefined>((resolve) => {
      if (!postId) {
        return resolve()
      }

      const callback = () => resolve()

      getPostComments(postId).then(callback).catch(callback)
    }),
    getGroupPosts({
      group: id,
      requestedOffset: postsOffset,
      requestedLimit: POSTS_LIMIT,
      tags: tag,
      users: user,
      sort: sort[0] || Sorting.latest,
    }).catch(() => null),
  ]).then(([post]) => {
    const group = groupQuery.getValue()

    return {
      namespacesRequired: ['groupPage', 'postCreate'],
      group,
      posts: postsQuery.getValue(),
      comments: post ? postCommentsQuery.getValue() : undefined,
      post,
    }
  })
}

export default GroupPage
