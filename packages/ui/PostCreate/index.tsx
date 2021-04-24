import React, { FC, useRef, useEffect, useState, useCallback } from 'react'
import cx from 'classnames'
// commons
import { useTranslation } from '@gtms/commons/i18n'
import { useDebounce } from '@gtms/commons/hooks/useDebounce'
import { useExpandingArea } from '@gtms/commons/hooks/expandingArea'
import { getImage, getDisplayName } from '@gtms/commons/helpers'
import { IImage } from '@gtms/commons/types/image'
import { Link } from '@gtms/commons/i18n'
import { IAccountDetails, IUser } from '@gtms/commons/models'
// ui
import { UserAvatar } from '../UserAvatar'
import { Spinner } from '../Spinner'
import { Tag } from '../Tag'
import { TagGroup } from '../TagGroup'
import styles from './styles.scss'

export const PostCreate: FC<{
  additionalStyles?: string
  fetchSuggestedTags?: (tags: string[]) => Promise<string[]>
  fetchTags: (query: string, signal: AbortSignal) => Promise<string[]>
  fetchUsers: (query: string, signal: AbortSignal) => Promise<IUser[]>
  hintMinLenght?: number
  isLoading?: boolean
  noImage: { [key: string]: IImage }
  onFocus?: () => unknown
  onLoginRequest?: () => unknown
  setValue: any // needs to be fixed later!
  user: IAccountDetails | null
  value?: string
}> = ({
  additionalStyles,
  fetchSuggestedTags,
  fetchTags,
  fetchUsers,
  hintMinLenght = 3,
  isLoading = false,
  noImage,
  onFocus,
  onLoginRequest,
  setValue,
  user,
  value = '',
}) => {
  const { t } = useTranslation('postCreate')
  const [query, setQuery] = useState<{ type: 'tag' | 'user'; value: string }>({
    value: '',
    type: 'tag',
  })
  const [suggestedTags, setSuggestedTags] = useState<{
    isLoading: boolean
    tags: string[]
  }>({
    isLoading: false,
    tags: [],
  })
  const debouncedQuery = useDebounce(query.value, 100)
  const { ref, handleInput } = useExpandingArea(1)
  const tagsSuggestionsAbortController = useRef<AbortController>()
  const [tagsHints, setTagsHints] = useState<{
    isLoading: boolean
    tags: string[] | IUser[]
  }>({
    isLoading: false,
    tags: [],
  })
  const suggestionsTimeout = useRef<NodeJS.Timeout>()

  const loadSuggestedTags = useCallback(() => {
    if (!fetchSuggestedTags) {
      return
    }
    const tags = value.match(/#(\w+)\b/gi)

    if (!Array.isArray(tags)) {
      return
    }

    setSuggestedTags({
      isLoading: true,
      tags: [],
    })

    fetchSuggestedTags(tags.map((tag) => tag.substr(1)))
      .then((suggested) => {
        setSuggestedTags({
          isLoading: false,
          tags: suggested,
        })
      })
      .catch(() =>
        setSuggestedTags({
          isLoading: false,
          tags: [],
        })
      )
  }, [value])

  const addSuggestedTag = useCallback((tag: string) => {
    setValue((value: string) => `${value} #${tag}`)
    setSuggestedTags((state) => {
      const suggested = state.tags
      const index = suggested.indexOf(tag)

      if (index > -1) {
        suggested.splice(index, 1)
      }

      return {
        isLoading: false,
        tags: [...suggested],
      }
    })
  }, [])

  const addAllSuggestedTags = useCallback(() => {
    setValue(
      (value: string) =>
        `${value} ${suggestedTags.tags.map((tag) => `#${tag}`).join(' ')}`
    )
    setSuggestedTags({
      isLoading: false,
      tags: [],
    })
  }, [suggestedTags])

  const onLoadSuggestion = useCallback(
    (queryToFind: string) => {
      setTagsHints({
        isLoading: true,
        tags: [],
      })

      const controller = new AbortController()
      const { signal } = controller

      tagsSuggestionsAbortController.current = controller

      switch (query.type) {
        case 'user':
          fetchUsers(queryToFind, signal)
            .then((users: IUser[]) => {
              setTagsHints({
                isLoading: false,
                tags: users,
              })
            })
            .catch(() => {
              setTagsHints({
                isLoading: false,
                tags: [],
              })
            })
          break

        case 'tag':
          fetchTags(queryToFind, signal)
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
          break
      }
    },
    [tagsSuggestionsAbortController, query]
  )

  const onLoadSuggestionCancel = useCallback(() => {
    tagsSuggestionsAbortController.current &&
      tagsSuggestionsAbortController.current.abort()
  }, [tagsSuggestionsAbortController])

  useEffect(() => {
    if (debouncedQuery !== '' && debouncedQuery.length >= hintMinLenght) {
      onLoadSuggestionCancel()
      onLoadSuggestion(debouncedQuery)
    }
  }, [debouncedQuery])
  return (
    <div
      className={cx(styles.postCreateWrapper, additionalStyles)}
      data-testid="postCreate"
    >
      {isLoading && <Spinner additionalStyles={styles.spinner} size="sm" />}

      <div className={styles.avatarAndTextInput}>
        <Link href={`/user/${user?.id}`}>
          <a>
            <UserAvatar
              size="sm"
              image={getImage('50x50', user?.avatar, noImage)}
            />
            {user && user.name && user.surname && (
              <span>{`${user.name} ${user.surname}`}</span>
            )}
          </a>
        </Link>
        <textarea
          onFocus={() => {
            if (!user && onLoginRequest) {
              onLoginRequest()
              return
            }

            onFocus && onFocus()
          }}
          className={styles.textarea}
          data-testid="form-expanding-textarea"
          value={value}
          onInput={handleInput}
          onKeyDown={(e) => {
            if (
              e.keyCode === 9 &&
              !tagsHints.isLoading &&
              tagsHints.tags.length > 0
            ) {
              e.preventDefault()
              const pat = new RegExp(
                '(\\b' + query.value + '\\b)(?!.*\\b\\1\\b)',
                'i'
              )
              const replaced =
                query.type === 'tag'
                  ? `${tagsHints.tags[0]}`
                  : `${(tagsHints.tags[0] as IUser).username}`
              setValue(value.replace(pat, replaced))
              setTagsHints({
                isLoading: false,
                tags: [],
              })
            }

            if ([32, 13, 27].includes(e.keyCode)) {
              // esc
              setTagsHints({
                isLoading: false,
                tags: [],
              })
            }
          }}
          onChange={(event) => {
            setValue(event.target.value)

            if (typeof suggestionsTimeout.current !== 'undefined') {
              clearTimeout(suggestionsTimeout.current)
            }

            if (typeof fetchSuggestedTags === 'function') {
              suggestionsTimeout.current = setTimeout(loadSuggestedTags, 750)
            }

            const tags = event.target.value.match(/[#@](\w+)\b/gi)
            if (!Array.isArray(tags)) {
              return
            }

            const lastTag = tags[tags.length - 1]

            if (event.target.value.substr(-lastTag.length) === lastTag) {
              setQuery({
                type: lastTag.charAt(0) === '@' ? 'user' : 'tag',
                value: lastTag.substr(1),
              })
            }
          }}
          rows={1}
          placeholder={t('yourMessage')}
          ref={ref as any}
        />
      </div>

      <div className={styles.tags}>
        {tagsHints.tags.length > 0 && query.type === 'tag' && (
          <ul className={styles.tagsSuggestions}>
            {(tagsHints.tags as string[]).map((tag: string) => (
              <li
                className={styles.tag}
                onClick={() => {
                  const pat = new RegExp(
                    '(\\b' + query.value + '\\b)(?!.*\\b\\1\\b)',
                    'i'
                  )
                  setValue(value.replace(pat, `${tag}`))
                  setTagsHints({
                    isLoading: false,
                    tags: [],
                  })
                  ref.current?.focus()
                }}
                key={`suggested-${tag}`}
              >
                #{tag}
              </li>
            ))}
          </ul>
        )}

        {tagsHints.tags.length > 0 && query.type === 'user' && (
          <ul className={styles.userSuggestions}>
            {(tagsHints.tags as IUser[]).map((tag: IUser) => (
              <li
                onClick={() => {
                  const pat = new RegExp(
                    '(\\b' + query.value + '\\b)(?!.*\\b\\1\\b)',
                    'i'
                  )
                  setValue(value.replace(pat, `${tag.username}`))
                  setTagsHints({
                    isLoading: false,
                    tags: [],
                  })
                  ref.current?.focus()
                }}
                key={`suggested-user-${tag.id}`}
              >
                {getDisplayName(tag)}
              </li>
            ))}
          </ul>
        )}

        {!suggestedTags.isLoading && suggestedTags.tags.length > 0 && (
          <div className={styles.otherTagsSuggestions}>
            <h2 className={styles.header}>Suggested tags:</h2>
            <div className={styles.list}>
              <TagGroup>
                {suggestedTags.tags.map((tag) => (
                  <Tag
                    onClick={() => addSuggestedTag(tag)}
                    label={tag}
                    key={`suggested-tag-${tag}`}
                  />
                ))}
              </TagGroup>
              <button
                className={styles.btnAddSuggestions}
                onClick={addAllSuggestedTags}
              >
                Add all suggestions
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
