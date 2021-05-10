import React, { FC, useState, useCallback, useRef, useEffect } from 'react'
import cx from 'classnames'
import { useTranslation } from '@gtms/commons/i18n'
import { IPost, IUser, IGroup } from '@gtms/commons/models'
import { parseFiles } from '@gtms/commons/helpers'
import { FileStatus } from '@gtms/commons/enums'
import { generateSearchURL } from '@app/helpers/url'
// api
import { findTagsAPI } from '@gtms/api-tags'
import { findPostsAPI } from '@gtms/api-post'
import { fetchTaggedGroups } from '@gtms/api-group'
import { fetchTaggedUsers, findbyUsernameAPI } from '@gtms/api-auth'
// components
import { GroupResults } from '@app/components/search/GroupResults'
import { PostResults } from '@app/components/search/PostResults'
import { UserResults } from '@app/components/search/UserResults'
// ui
import { FaUsers } from 'react-icons/fa'
import { IoIosListBox, IoIosKeypad } from 'react-icons/io'
import { SearchBar, SuggestionTypes } from '@gtms/ui/SearchBar'
// styles
import styles from './styles.scss'

export enum Tabs {
  posts = 'post-results',
  groups = 'group-results',
  users = 'user-results',
}

interface ISeachPageState {
  search: {
    tags: string[]
    users: string[]
  }
  suggestions: {
    isLoading: boolean
    records: string[]
    type: keyof typeof SuggestionTypes
  }
  posts: {
    isLoading: boolean
    isError: boolean
    docs: IPost[]
    limit: number
    offset: number
    total: number
  }
  groups: {
    isLoading: boolean
    isError: boolean
    docs: IGroup[]
    limit: number
    offset: number
    total: number
  }
  users: {
    isLoading: boolean
    isError: boolean
    docs: IUser[]
    limit: number
    offset: number
    total: number
  }
}

const RESULTS_LIMIT = 50

export const SearchPage: FC<{
  initialTab?: Tabs
  tags?: string[]
  users?: string[]
}> = ({ initialTab = Tabs.posts, tags = [], users = [] }) => {
  const { t, i18n } = useTranslation('searchPage')
  const [tab, setTab] = useState<Tabs>(initialTab)
  const [state, setState] = useState<ISeachPageState>({
    search: {
      tags,
      users,
    },
    suggestions: {
      isLoading: false,
      records: [],
      type: SuggestionTypes.tags as keyof typeof SuggestionTypes,
    },
    posts: {
      isLoading: false,
      isError: false,
      docs: [],
      limit: RESULTS_LIMIT,
      offset: 0,
      total: 0,
    },
    groups: {
      isLoading: false,
      isError: false,
      docs: [],
      limit: RESULTS_LIMIT,
      offset: 0,
      total: 0,
    },
    users: {
      isLoading: false,
      isError: false,
      docs: [],
      limit: RESULTS_LIMIT,
      offset: 0,
      total: 0,
    },
  })

  // fetch results
  useEffect(() => {
    const hasTags = state.search.tags.length > 0
    const hasUsers = state.search.users.length > 0

    if (!hasTags && !hasUsers) {
      setState((state: ISeachPageState) => ({
        ...state,
        posts: {
          isLoading: false,
          isError: false,
          docs: [],
          limit: 50,
          offset: 0,
          total: 0,
        },
        groups: {
          isLoading: false,
          isError: false,
          docs: [],
          limit: 50,
          offset: 0,
          total: 0,
        },
        users: {
          isLoading: false,
          isError: false,
          docs: [],
          limit: 50,
          offset: 0,
          total: 0,
        },
      }))
      return
    }

    setState((state: ISeachPageState) => ({
      ...state,
      posts: {
        isLoading: true,
        isError: false,
        docs: [],
        limit: 50,
        offset: 0,
        total: 0,
      },
      groups: {
        isLoading: true,
        isError: false,
        docs: [],
        limit: 50,
        offset: 0,
        total: 0,
      },
      users: {
        isLoading: true,
        isError: false,
        docs: [],
        limit: 50,
        offset: 0,
        total: 0,
      },
    }))

    // fetch posts
    findPostsAPI(
      {
        tags: state.search.tags,
      },
      0,
      50,
      true
    ).then((response) => {
      setState((state: ISeachPageState) => ({
        ...state,
        posts: {
          isLoading: false,
          isError: false,
          ...response,
        },
      }))
    })

    // fetch groups
    fetchTaggedGroups(state.search.tags, 0, 50).then((response) => {
      // parse files in the response
      response.docs = response.docs.map((group) => {
        if (
          Array.isArray(group.avatar?.files) &&
          group.avatar?.status === FileStatus.ready
        ) {
          group.avatar.files = parseFiles(group.avatar.files)
        }

        return group
      })
      setState((state: ISeachPageState) => ({
        ...state,
        groups: {
          isLoading: false,
          isError: false,
          ...response,
        },
      }))
    })

    // fetch users
    fetchTaggedUsers(state.search.tags, 0, 50).then((response) => {
      setState((state: ISeachPageState) => ({
        ...state,
        users: {
          isLoading: false,
          isError: false,
          ...response,
        },
      }))
    })
  }, [state.search])

  // update url
  useEffect(() => {
    window.history.pushState(
      null,
      'Search',
      generateSearchURL(`/${i18n.language}/search/${tab}`, {
        tag: state.search.tags,
        user: state.search.users,
      })
    )
  }, [state.search, tab])

  const generatePaginationPostsUrl = useCallback(
    (page: number) => {
      const url = generateSearchURL(`/${i18n.language}/search/${Tabs.posts}`, {
        tag: state.search.tags,
        user: state.search.users,
      })

      const groupsPage = state.groups.offset / state.groups.limit + 1
      const usersPage = state.users.offset / state.users.limit + 1

      return `${url}?posts=${page}&groups=${groupsPage}&users=${usersPage}`
    },
    [
      state.groups.limit,
      state.groups.offset,
      state.search,
      state.users.limit,
      state.users.offset,
    ]
  )

  const changePostsPage = useCallback((page: number) => {
    const offset = page * RESULTS_LIMIT

    setState((state: ISeachPageState) => ({
      ...state,
      posts: {
        ...state.posts,
        offset,
      },
    }))
  }, [])

  const generatePaginationGroupsUrls = useCallback(
    (page: number) => {
      const url = generateSearchURL(`/${i18n.language}/search/${Tabs.groups}`, {
        tag: state.search.tags,
        user: state.search.users,
      })

      const postsPage = state.posts.offset / state.posts.limit + 1
      const usersPage = state.users.offset / state.users.limit + 1

      return `${url}?posts=${postsPage}&groups=${page}&users=${usersPage}`
    },
    [
      state.posts.limit,
      state.posts.offset,
      state.search,
      state.users.limit,
      state.users.offset,
    ]
  )

  const changeGroupsPage = useCallback((page: number) => {
    const offset = page * RESULTS_LIMIT

    setState((state: ISeachPageState) => ({
      ...state,
      groups: {
        ...state.groups,
        offset,
      },
    }))
  }, [])

  const generatePaginationUsersUrls = useCallback(
    (page: number) => {
      const url = generateSearchURL(`/${i18n.language}/search/${Tabs.groups}`, {
        tag: state.search.tags,
        user: state.search.users,
      })

      const postsPage = state.posts.offset / state.posts.limit + 1
      const groupsPage = state.groups.offset / state.groups.limit + 1

      return `${url}?posts=${postsPage}&groups=${groupsPage}&users=${page}`
    },
    [
      state.groups.limit,
      state.groups.offset,
      state.posts.limit,
      state.posts.offset,
      state.search,
    ]
  )

  const changeUsersPage = useCallback((page: number) => {
    const offset = page * RESULTS_LIMIT

    setState((state: ISeachPageState) => ({
      ...state,
      users: {
        ...state.users,
        offset,
      },
    }))
  }, [])

  const tagsSuggestionsAbortController = useRef<AbortController>()
  const onFindTags = useCallback(
    (text: string, type: keyof typeof SuggestionTypes) => {
      setState((state: ISeachPageState) => ({
        ...state,
        suggestions: {
          isLoading: true,
          records: [],
          type,
        },
      }))

      const controller = new AbortController()
      const { signal } = controller

      tagsSuggestionsAbortController.current = controller

      const callback = (records: string[]) => {
        setState((state: ISeachPageState) => ({
          ...state,
          suggestions: {
            isLoading: false,
            records,
            type,
          },
        }))
      }

      switch (type) {
        case SuggestionTypes.tags:
          findTagsAPI(text, signal).then(callback)
          break

        case SuggestionTypes.users:
          findbyUsernameAPI(text, signal)
            .then((results: IUser[]) => {
              return results.map((user: IUser) => user.username)
            })
            .then(callback)
          break
      }
    },
    []
  )

  const onTagAdd = useCallback((tag: string) => {
    setState((state: ISeachPageState) => {
      switch (state.suggestions.type) {
        case SuggestionTypes.tags:
          return {
            ...state,
            search: {
              ...state.search,
              tags: [...state.search.tags, tag],
            },
          }

        case SuggestionTypes.users:
          return {
            ...state,
            search: {
              ...state.search,
              users: [...state.search.users, tag],
            },
          }

        default:
          return state
      }
    })
  }, [])

  const onTagRemove = useCallback(
    (tag: string) => {
      const tags = state.search.tags
      const index = state.search.tags.indexOf(tag)

      if (index > -1) {
        tags.splice(index, 1)

        setState((state: ISeachPageState) => ({
          ...state,
          search: {
            ...state.search,
            tags: [...tags],
          },
        }))
      }
    },
    [state.search.tags]
  )

  const onLoadSuggestionCancel = useCallback(() => {
    tagsSuggestionsAbortController.current &&
      tagsSuggestionsAbortController.current.abort()
  }, [tagsSuggestionsAbortController])

  return (
    <div 
      data-testid="search-page"
      className={cx(styles.pageWrapper, {
        [styles.isOverlay]: state.suggestions.isLoading || state.suggestions.records.length >= 1,
      })}
    >
      <div className={styles.content}>
        <h2 className={styles.header}>{t('searchHeader2')}</h2>
        <SearchBar
          additionalStyles={styles.searchWrapper}
          isLoading={state.suggestions.isLoading}
          onLoadSuggestion={onFindTags}
          onLoadSuggestionCancel={onLoadSuggestionCancel}
          onQueryChange={() => null}
          onTagAdd={onTagAdd}
          onTagRemove={onTagRemove}
          onUserRemove={() => null}
          suggestions={state.suggestions.records}
          tags={state.search.tags}
        />
        {state.search.tags.length > 0 && (
          <>
            <ul className={styles.tabs}>
              <li
                className={cx({
                  [styles.active]: tab === Tabs.posts,
                })}
              >
                <a onClick={() => setTab(Tabs.posts)}>
                  <i>
                    <IoIosListBox />
                  </i>
                  Posts<span>({state.posts.total})</span>
                </a>
              </li>
              <li
                className={cx({
                  [styles.active]: tab === Tabs.groups,
                })}
              >
                <a onClick={() => setTab(Tabs.groups)}>
                  <i>
                    <IoIosKeypad />
                  </i>
                  Groups<span>({state.groups.total})</span>
                </a>
              </li>
              <li
                className={cx({
                  [styles.active]: tab === Tabs.users,
                })}
              >
                <a onClick={() => setTab(Tabs.users)}>
                  <i>
                    <FaUsers />
                  </i>
                  Users<span>({state.users.total})</span>
                </a>
              </li>
            </ul>
            {tab === Tabs.posts && (
              <PostResults
                {...state.posts}
                getCurrentUrl={generatePaginationPostsUrl}
                onChangePage={changePostsPage}
                tags={state.search.tags}
              />
            )}
            {tab === Tabs.groups && (
              <GroupResults
                {...state.groups}
                getCurrentUrl={generatePaginationGroupsUrls}
                onChangePage={changeGroupsPage}
                tags={state.search.tags}
              />
            )}
            {tab === Tabs.users && (
              <UserResults
                {...state.users}
                getCurrentUrl={generatePaginationUsersUrls}
                onChangePage={changeUsersPage}
                tags={state.search.tags}
              />
            )}
          </>
        )}
      </div>
    </div>
  )
}
