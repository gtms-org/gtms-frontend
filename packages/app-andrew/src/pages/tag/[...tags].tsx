import React, { useState, useEffect, useCallback, useRef } from 'react'
import { NextPage, NextPageContext } from 'next'
import { useRouter } from 'next/router'
//commons
import { useInitState } from '@gtms/commons/hooks'
// api
import { fetchTaggedGroups, IRecentGroupsResponse } from '@gtms/api-group'
import { fetchTaggedUsers, ITagUsersResponse } from '@gtms/api-auth'
import { findTagsAPI } from '@gtms/api-tags'
import { findPostsAPI, IFindPostsResponse } from '@gtms/api-post'
// state
import { initGroupsList } from '@gtms/state-group'
import { initUsersList } from '@gtms/state-user'
import { initPostsSearchStore } from '@gtms/state-post'
import {
  ITagPageState,
  tagPageState,
  tagPageState$,
} from '@app/queries/tagPage.query'
// components
import { GroupsList } from '@app/components/tag/GroupsList'
import { PostsList } from '@app/components/tag/PostsList'
import { UsersList } from '@app/components/tag/UsersList'
// ui
import { FourHundredFour } from '@gtms/ui/FourHundredFour'
import { Modal } from '@gtms/ui/Modal'
import { TagsHeader } from '@gtms/ui/TagsHeader'
// styles
import styles from './styles.scss'

export interface TagPageProps {
  groups: IRecentGroupsResponse | null
  namespacesRequired: readonly string[]
  posts: IFindPostsResponse | null
  tags: string[]
  users: ITagUsersResponse | null
}

const TagPage: NextPage<TagPageProps> = ({ groups, posts, tags, users }) => {
  useInitState(() => {
    groups && initGroupsList(groups)
    users && initUsersList(users)
    posts && initPostsSearchStore(posts)
  })
  const [state, setState] = useState<ITagPageState>(tagPageState())
  const [isTagRemovedShowModal, setIsTagRemovedShowModal] = useState<boolean>(
    false
  )
  const [tagsHints, setTagsHints] = useState<{
    isLoading: boolean
    tags: string[]
  }>({
    isLoading: false,
    tags: [],
  })

  useEffect(() => {
    const sub = tagPageState$.subscribe((value) => setState(value))

    return () => {
      sub && !sub.closed && sub.unsubscribe()
    }
  }, [])

  const router = useRouter()
  const tagsSuggestionsAbortController = useRef<AbortController>()

  const onLoadSuggestion = useCallback(
    (query: string) => {
      setTagsHints({
        isLoading: true,
        tags: [],
      })

      const controller = new AbortController()
      const { signal } = controller

      tagsSuggestionsAbortController.current = controller

      findTagsAPI(query, signal)
        .then((tags: string[]) => {
          setTagsHints({
            isLoading: false,
            tags,
          })
        })
        .catch(() => {
          setTagsHints({
            isLoading: false,
            tags: [],
          })
        })
    },
    [tagsSuggestionsAbortController]
  )

  const onLoadSuggestionCancel = useCallback(() => {
    tagsSuggestionsAbortController.current &&
      tagsSuggestionsAbortController.current.abort()
  }, [tagsSuggestionsAbortController])

  const onTagAdd = useCallback(
    (tag: string) => {
      setTagsHints({
        isLoading: false,
        tags: [],
      })
      router.push(`/tag/${[...tags, tag].join('/')}`)
    },
    [tags]
  )

  const onTagRemove = useCallback(() => {
    setIsTagRemovedShowModal(true)
  }, [])

  if (groups === null) {
    // @todo add proper error component
    return <FourHundredFour />
  }

  return (
    <div data-testid="tag-page" className={styles.pageWrapper}>
      {isTagRemovedShowModal && (
        <Modal onClose={() => setIsTagRemovedShowModal(false)}>
          Tag removed! - success!
        </Modal>
      )}
      <div className={styles.wrapper}>
        <TagsHeader
          isLoading={tagsHints.isLoading}
          onLoadSuggestion={onLoadSuggestion}
          onLoadSuggestionCancel={onLoadSuggestionCancel}
          onTagAdd={onTagAdd}
          onTagRemove={onTagRemove}
          suggestions={tagsHints.tags}
          tags={tags}
        />
      
        {(
          (state.groups.docs.length === 0 ||
          state.posts.docs.length === 0 ||
          state.users.docs.length === 0) &&
          <div className={styles.noRecords}>no records</div>
        )}

        <h3 className={styles.header}>Groups</h3>
        <GroupsList
          isLoading={state.groups.isLoading}
          records={state.groups.docs}
        />

        <h3 className={styles.header}>Users</h3>
        <UsersList
          isLoading={state.users.isLoading}
          records={state.users.docs}
        />

        <h3 className={styles.header}>Posts</h3>
        {state.posts && (
          <PostsList
            isLoading={state.posts.isLoading}
            records={state.posts.docs}
            user={null}
          />
        )}
      </div>
    </div>
  )
}

TagPage.getInitialProps = async (
  ctx: NextPageContext
): Promise<TagPageProps> => {
  const tags = (ctx?.query.tags as string[])
    .map((tag) => (tag !== '' ? tag.trim() : null))
    .filter((tag) => tag !== null)
    .slice(0, 9) as string[]

  if (tags.length > 0) {
    return Promise.all([
      fetchTaggedGroups(tags, 0, 25).catch(() => null),
      fetchTaggedUsers(tags, 0, 25).catch(() => null),
      findPostsAPI({ tags }, 0, 25).catch(() => null),
    ]).then((data) => {
      const [groups, users, posts] = data

      return {
        groups,
        namespacesRequired: ['tagPage'],
        posts,
        tags,
        users,
      }
    })
  }

  return {
    groups: null,
    namespacesRequired: ['tagPage'],
    posts: null,
    tags,
    users: null,
  }
}

export default TagPage
