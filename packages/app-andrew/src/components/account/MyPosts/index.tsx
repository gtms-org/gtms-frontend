import React, { FC, useState, useEffect, useCallback, useRef } from 'react'
// commons
import { UserAvatarNoImage } from '@app/enums'
// api
import {
  fetchMyPosts,
  IMyPostsResponse,
  IMyPostsRequest,
  IMyPostsDetailsResponse,
  fetchMyPostDetails,
} from '@gtms/api-post'
import { findTagsAPI } from '@gtms/api-tags'
import { findbyUsernameAPI } from '@gtms/api-auth'
// state
import { createNewComment } from '@gtms/state-post'
import { openLoginModal } from '@app/state'
import { IMyPostsState, myPostsState, myPostsState$ } from './state.query'
// components
import { PostsList } from '@app/components/post/PostsList'
import { MyPostsFilters } from '@app/components/account/MyPostsFilters'
// ui
import { MockData } from '@gtms/ui/MockData'
import { PostSingle } from '@gtms/ui/PostSingle'
import { SearchBar, SuggestionTypes } from '@gtms/ui/SearchBar'
// styles
import styles from './styles.scss'

export const MyPosts: FC = () => {
  const [data, setData] = useState<
    IMyPostsResponse & {
      isLoading: boolean
      errorOccured: boolean
    }
  >({
    isLoading: true,
    errorOccured: false,
    docs: [],
    total: -1,
    limit: 50,
    offset: 0,
  })
  const [state, setState] = useState<IMyPostsState>(myPostsState())
  const [showFilters, setShowFilters] = useState<boolean>(false)
  const [search, setSearch] = useState<{
    groups: { id: string; name: string }[]
    tags: string[]
  }>({
    groups: [],
    tags: [],
  })
  const [suggestions, setSuggestions] = useState<{
    isLoading: boolean
    records: string[]
    type: keyof typeof SuggestionTypes
  }>({
    isLoading: false,
    records: [],
    type: SuggestionTypes.tags as keyof typeof SuggestionTypes,
  })

  const tagsSuggestionsAbortController = useRef<AbortController>()
  const myPostsDetails = useRef<IMyPostsDetailsResponse[]>()

  const getMyPostDetails = useCallback(
    (signal?: AbortSignal) => {
      if (myPostsDetails.current) {
        return Promise.resolve(myPostsDetails.current)
      }

      return fetchMyPostDetails(signal).then((response) => {
        myPostsDetails.current = response

        return response
      })
    },
    [myPostsDetails]
  )

  const onFindTags = useCallback(
    (text: string, type: keyof typeof SuggestionTypes) => {
      setSuggestions({
        isLoading: true,
        records: [],
        type,
      })

      const controller = new AbortController()
      const { signal } = controller

      tagsSuggestionsAbortController.current = controller

      switch (type) {
        case SuggestionTypes.tags:
          findTagsAPI(text, signal).then((records: string[]) => {
            setSuggestions({
              isLoading: false,
              records,
              type,
            })
          })
          break

        case SuggestionTypes.users:
          getMyPostDetails(signal).then((response) => {
            setSuggestions({
              isLoading: false,
              records: response
                .filter((group) =>
                  group.name.toLowerCase().includes(text.toLocaleLowerCase())
                )
                .map((group) => group.name),
              type,
            })
          })
          break
      }
    },
    []
  )

  const onTagAdd = useCallback(
    (tag: string) => {
      switch (suggestions.type) {
        case SuggestionTypes.tags:
          return setSearch((state) => ({
            ...state,
            tags: [...state.tags, tag],
          }))
        case SuggestionTypes.users:
          getMyPostDetails().then((myPostsDetails) => {
            const group = myPostsDetails.find((group) => group.name === tag)

            if (group) {
              setSearch((state) => ({
                ...state,
                groups: [...state.groups, { id: group.id, name: group.name }],
              }))
            }
          })
      }
    },
    [suggestions.type]
  )

  const onTagRemove = useCallback((tag: string) => {
    setSearch((state) => {
      const index = state.tags.indexOf(tag)

      if (index > -1) {
        state.tags.splice(index, 1)

        return {
          ...state,
          tags: [...state.tags],
        }
      }

      return state
    })
  }, [])

  const makeSearch = () => {
    setData((state) => ({
      ...state,
      isLoading: true,
      errorOccured: false,
    }))

    const query: IMyPostsRequest = { limit: data.limit, offset: data.offset }

    if (search.groups.length > 0) {
      query.groups = search.groups.map((r) => r.id)
    }

    if (search.tags.length > 0) {
      query.tags = search.tags
    }

    fetchMyPosts(query)
      .then((result) => {
        setData({
          isLoading: false,
          errorOccured: false,
          ...result,
        })
      })
      .catch(() =>
        setData((state) => ({
          ...state,
          isLoading: false,
          errorOccured: true,
        }))
      )
  }
  const onFilterGroupClick = useCallback(
    (groupName: string, groupId: string) => {
      const index = search.groups.findIndex((r) => r.id === groupId)

      if (index === -1) {
        setSearch((value) => ({
          ...value,
          groups: [
            ...value.groups,
            {
              id: groupId,
              name: groupName,
            },
          ],
        }))
      } else {
        search.groups.splice(index, 1)
        setSearch({ ...search })
      }
    },
    [search]
  )

  const onFilterGroupRemove = useCallback(
    (groupName: string) => {
      const index = search.groups.findIndex((r) => r.name === groupName)
      if (index === -1) {
        return
      }

      search.groups.splice(index, 1)
      setSearch({
        ...search,
      })
    },
    [search]
  )

  useEffect(() => {
    makeSearch()

    const sub = myPostsState$.subscribe((value) => {
      setState(value)
    })

    return () => {
      sub && !sub.closed && sub.unsubscribe()
    }
  }, [])

  useEffect(makeSearch, [search])

  const groupNames = search.groups.map((r) => r.name)

  const onLoadSuggestionCancel = useCallback(() => {
    tagsSuggestionsAbortController.current &&
      tagsSuggestionsAbortController.current.abort()
  }, [tagsSuggestionsAbortController])

  return (
    <div>
      <SearchBar
        disabled={data.isLoading}
        additionalStyles={styles.search}
        onTagAdd={onTagAdd}
        onTagRemove={onTagRemove}
        onLoadSuggestion={onFindTags}
        suggestions={suggestions.records}
        suggestionsType={suggestions.type}
        onQueryChange={() => null}
        onLoadSuggestionCancel={onLoadSuggestionCancel}
        tags={search.tags}
        users={groupNames}
        onUserRemove={onFilterGroupRemove}
      />
      {data.isLoading && (
        <div className={styles.noRecords}>
          <MockData />
          <MockData onClick={() => null} text="Loading, please wait" />
          <MockData numberOfElements={4} />
        </div>
      )}
      {!data.isLoading && data.docs.length > 0 && !data.errorOccured && (
        <>
          <MyPostsFilters
            active={groupNames}
            onGroupClick={onFilterGroupClick}
          />
          <PostsList
            posts={data.docs}
            isAdmin={false}
            renderPost={(post) => (
              <PostSingle
                additionalStyles={styles.post}
                activeTags={[]}
                allowToRespond={false}
                createComment={createNewComment}
                fetchTags={findTagsAPI}
                fetchUsers={findbyUsernameAPI}
                key={`post-${post.id}`}
                noImage={UserAvatarNoImage}
                onClick={() => null}
                onLoginRequest={openLoginModal}
                onTagClick={onTagAdd}
                user={state.user}
                {...post}
              />
            )}
          />
        </>
      )}

      {!data.isLoading && data.docs.length === 0 && !data.errorOccured && (
        <p>No records :( Add your first post!</p>
      )}

      {!data.isLoading && data.errorOccured && (
        <p>Error occured, we can not show your posts now. Sorry!</p>
      )}
    </div>
  )
}
