import React, { FC, useState, useEffect } from 'react'
import { useDebounce } from '@gtms/commons/hooks/useDebounce'
// ui
import { Button } from '../Button'
import { Spinner } from '../Spinner'
import styles from './styles.scss'

export const TagsHeader: FC<{
  hintMinLenght?: number
  isLoading: boolean
  onLoadSuggestion: (text: string) => void
  onLoadSuggestionCancel: () => void
  onTagAdd: (tag: string) => void
  onTagRemove: (tag: string) => void
  suggestions?: string[]
  tags: string[]
}> = ({
  hintMinLenght = 3,
  isLoading,
  onLoadSuggestion,
  onLoadSuggestionCancel,
  onTagAdd,
  suggestions = [],
  tags,
}) => {
  const [isInEditMode, setIsInEditMode] = useState<boolean>(false)
  const [query, setQuery] = useState<string>('')
  const debouncedQuery = useDebounce(query, 500)

  useEffect(() => {
    if (debouncedQuery !== '' && debouncedQuery.length >= hintMinLenght) {
      onLoadSuggestion(debouncedQuery)
    }
  }, [debouncedQuery])
  return (
    <div className={styles.wrapper} data-testid="tags-header">
      <>
        <h2 className={styles.tags}></h2>
        <ul>
          {tags.map(tag => <li key={`tag-${tag}`}>{tag}</li>)}
        </ul>
        {!isInEditMode && <Button additionalStyles={styles.button} onClick={() => setIsInEditMode(true)}>+</Button>}
        {isInEditMode && (
          <input
            className={styles.inputWrapper}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value.trim().replace('#', ''))}
            onKeyDown={(e) => {
              if ([32, 13].includes(e.keyCode)) {
                const tag = query.trim()

                onTagAdd(tag)
                setQuery('')
                onLoadSuggestionCancel()
              }
            }}
          />
        )}
      </>
      <>
        {isLoading && query !== '' && (
          <div className={styles.suggestions}>
            <Spinner additionalStyles={styles.spinner} />
          </div>
        )}
        {!isLoading && suggestions.length > 0 && (
          <div className={styles.suggestions}>
            <ul>
              {suggestions.map((tag) => (
                <li
                  onClick={() => {
                    onTagAdd(tag)
                    setQuery('')
                    setIsInEditMode(false)
                  }}
                  key={`suggestion-${tag}`}
                >
                  {tag}
                </li>
              ))}
            </ul>
          </div>
        )}
      </>
    </div>
  )
}
