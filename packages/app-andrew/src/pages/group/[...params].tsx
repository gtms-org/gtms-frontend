import React, { useState, useEffect, useCallback } from 'react'
import { NextPage, NextPageContext } from 'next'
import { useRouter } from 'next/router'
import { PromotedTagNoImage, UserAvatarNoImage } from 'enums'
import {
  IGroupPageState,
  groupPageState,
  groupPageState$,
} from 'queries/groupPage.query'
import { useInitState } from '@gtms/commons/hooks'
import { useTranslation } from '@gtms/commons/i18n'
import { IPost } from '@gtms/commons/models'
// api
import { fetchPost } from '@gtms/api-post'
import { findTagsAPI } from '@gtms/api-tags'
// components
import { FavsButton } from 'components/group/FavsButton'
import { FollowButton } from 'components/group/FollowButton'
import { GroupAvatar } from 'components/group/GroupAvatar'
import { GroupDescription } from 'components/group/GroupDescription'
import { GroupMembers } from 'components/group/GroupMembers'
import { GroupNoAccess } from 'components/group/GroupNoAccess'
import { GroupNotFound } from 'components/group/GroupNotFound'
import { JoinLeaveButton } from 'components/group/JoinLeaveButton'
import { SettingsButton } from 'components/group/SettingsButton'
import { PostDetails } from 'components/post/PostDetails'
// ui
import { ErrorInfo } from '@gtms/ui/ErrorInfo'
import { NavigationPage } from '@gtms/ui/NavigationPage'
import { NavigationTabs } from '@gtms/ui/NavigationTabs'
import { PostCreate } from '@gtms/ui/PostCreate'
import { PromotedGroups } from '@gtms/ui/PromotedGroups'
import { PromotedTags } from '@gtms/ui/PromotedTags'
import { RecentlyAddedPosts } from '@gtms/ui/RecentlyAddedPosts'
import { Spinner } from '@gtms/ui/Spinner'
import { SearchBar } from '@gtms/ui/SearchBar'

import {
  IoIosHeart,
  IoIosGitNetwork,
  IoIosListBox,
  IoIosSettings,
} from 'react-icons/io'

// state
import {
  groupQuery,
  IGroupState,
  getGroup,
  initGroup,
  getGroupMembers,
} from '@gtms/state-group'
import {
  promotedTagsQuery,
  loadGroupPromotedTags,
  IPromotedTagsState,
  initPromoted,
} from '@gtms/state-tag'
import {
  createNewPost,
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
//styles
import styles from './styles.scss'

type GroupPageProps = {
  namespacesRequired: readonly string[]
  group?: IGroupState
  posts?: IPostsState
  promoted?: IPromotedTagsState
  post?: IPost
  comments?: IPostCommentsState
}

const getInitData = ({
  group,
  posts,
  promoted,
  post,
  comments,
}: GroupPageProps) => () => {
  group && initGroup(group)
  posts && initPostsStore(posts, post)
  promoted && initPromoted(promoted)
  comments && initPostCommentsStore(comments)
}

const GroupPage: NextPage<GroupPageProps> = (props) => {
  useInitState(getInitData(props))

  const { t } = useTranslation('groupPage')
  const router = useRouter()
  const [state, setState] = useState<IGroupPageState>(groupPageState())
  const onPostClick = useCallback((id) => {
    router.push(`/group/${state.group?.slug}/${id}`)
  }, [])

  useEffect(() => {
    if (state.group) {
      getGroupMembers(state.group.slug, 0, 8)
    }
    const sub = groupPageState$.subscribe((value) => setState(value))

    return () => {
      sub && !sub.closed && sub.unsubscribe()
    }
  }, [])

  return (
    <>
      <div className={styles.wrapper}>
        {state.isLoading && <Spinner />}

        {state.errorOccured && (
          <ErrorInfo>
            <h2>ERROR OCCURED</h2>
            <p>
              Create a proper component that can be used here when 500 from BE
            </p>
          </ErrorInfo>
        )}

        {state.notFound && <GroupNotFound />}

        {state.hasNoAccess && <GroupNoAccess />}

        {state.group && (
          <>
            <div className={styles.groupNavigationWrapper}>
              <div className={styles.groupHeader}>
                <div className={styles.avatarAndName}>
                  <GroupAvatar
                    additionalStyles={styles.groupAvatar}
                    files={groupQuery.getAvatar('200x200', state)}
                    filesStatus={groupQuery.getAvatarFileStatus()}
                    isEditAllowed={groupQuery.hasAdminRights()}
                  />
                  <h2 data-tip={t('click-here-to-edit')} data-type="dark">
                    {state.group?.name}
                  </h2>
                </div>
                <GroupDescription
                  additionalStyles={styles.desc}
                  isEditAllowed={groupQuery.hasAdminRights()}
                  slug={state.group?.slug || ''}
                  text={
                    !state.group?.description
                      ? groupQuery.hasAdminRights()
                        ? 'you did not add group description yet, click here to change it'
                        : ''
                      : state.group?.description || ''
                  }
                />
              </div>
              <NavigationPage />
              <div className={styles.actionButtons}>
                <FavsButton group={state.group} />
                <JoinLeaveButton group={state.group} />
                <SettingsButton group={state.group} />
                <FollowButton group={state.group} />
              </div>
            </div>
            <div className={styles.groupPostsListWrapper}>
              <div className={styles.searchInput}>
                <div className={styles.search}>
                  <SearchBar
                    onTagAdd={() => null}
                    onTagRemove={() => null}
                    onLoadSuggestion={() => null}
                    onQueryChange={() => null}
                    onLoadSuggestionCancel={() => null}
                    tags={[]}
                  />
                </div>
              </div>
              <div className={styles.posts}>
                <div>
                  {state.user && (
                    <PostCreate
                      fetchTags={findTagsAPI}
                      user={state.user}
                      noImage={UserAvatarNoImage}
                      onSubmit={(text: string) => {
                        createNewPost({
                          group: state.group?.id || '',
                          text,
                        })
                      }}
                      additionalStyles={styles.postCreate}
                    />
                  )}
                  <NavigationTabs>
                    <h2 className={styles.header}>Latest</h2>
                    <ul className={styles.elements}>
                      <li className={styles.item}>popular</li>
                      <li className={styles.item}>latest</li>
                      <li className={styles.item}>favorites </li>
                      <li className={styles.item}>my posts</li>
                    </ul>
                  </NavigationTabs>
                  <RecentlyAddedPosts
                    fetchTags={findTagsAPI}
                    onPostClick={onPostClick}
                    user={state.user}
                    activePost={state.activePost}
                    createComment={createNewComment}
                    noImage={UserAvatarNoImage}
                    posts={state.posts}
                  />
                </div>
                <div className={styles.third}>
                  <ul className={styles.buttons}>
                    <li>
                      <i>
                        <IoIosGitNetwork />
                      </i>
                    </li>
                    <li>
                      <i>
                        <IoIosListBox />
                      </i>
                    </li>
                    <li>
                      <i>
                        <IoIosHeart />
                      </i>
                    </li>
                    <li>
                      <i>
                        <IoIosSettings />
                      </i>
                    </li>
                  </ul>
                  {state.activePost && (
                    <PostDetails user={state.user} post={state.activePost} />
                  )}
                </div>
              </div>
            </div>
            <div className={styles.hide}>
              <PromotedGroups />
              <br /> {/* @todo remove it */}
              <PromotedTags
                tags={state.promotedTags.tags}
                isLoading={state.promotedTags.isLoading}
                noImage={PromotedTagNoImage}
                isAdmin={groupQuery.hasAdminRights()}
                onNoRecordsClick={() =>
                  router.push(`/group/${state.group?.slug}/settings#tags`)
                }
              />
              <br /> {/* @todo remove it */}
              <NavigationTabs>
                <h2 className={styles.header}>Recently registered</h2>
                <ul className={styles.elements}>
                  <li className={styles.item}>latest</li>
                  <li className={styles.item}>most popular</li>
                </ul>
              </NavigationTabs>
              <GroupMembers {...state.members} />
            </div>
          </>
        )}
      </div>
    </>
  )
}

GroupPage.getInitialProps = async (
  ctx: NextPageContext
): Promise<GroupPageProps> => {
  const { params } = ctx?.query
  const [slug, postId] = params as string[]

  await getGroup(slug as string)

  const id = groupQuery.getId() || ''
  return Promise.all([
    new Promise<IPost | undefined>((resolve) => {
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
    getGroupPosts(id).catch(() => null),
    loadGroupPromotedTags(id).catch(() => null),
  ]).then(([post]) => {
    return {
      namespacesRequired: ['groupPage', 'postCreate'],
      group: groupQuery.getValue(),
      posts: postsQuery.getValue(),
      promoted: promotedTagsQuery.getValue(),
      comments: post ? postCommentsQuery.getValue() : undefined,
      post,
    }
  })
}

export default GroupPage