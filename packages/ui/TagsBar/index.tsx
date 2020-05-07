import React, { FC, useState, useEffect } from 'react'
import { Spinner } from '../Spinner'
import styles from './styles.scss'
import { useDebounce } from '@gtms/commons'

export const TagsBar: FC<{
  tags: string[]
  suggestions?: string[]
  editMode?: boolean
  isLoading?: boolean
  isSaving?: boolean
  hintMinLenght?: number
  onLoadSuggestion: (text: string) => void
  onLoadSuggestionCancel: () => void
  onTagAdd: (tag: string) => void
  onTagRemove: (tag: string) => void
  onSave: () => Promise<void>
}> = ({
  tags,
  onLoadSuggestion,
  onLoadSuggestionCancel,
  onTagAdd,
  onTagRemove,
  onSave,
  editMode = false,
  isLoading = false,
  isSaving = false,
  suggestions = [],
  hintMinLenght = 3,
}) => {
  const [isInEditMode, setIsInEditMode] = useState<boolean>(editMode)
  const [showSuggestions, setShowSuggestions] = useState<boolean>(
    suggestions.length > 0
  )
  const [value, setValue] = useState<string>('')
  const debouncedValue = useDebounce(value, 500)

  useEffect(() => {
    if (debouncedValue !== '' && debouncedValue.length >= hintMinLenght) {
      onLoadSuggestion(debouncedValue)
    }
  }, [debouncedValue])

  useEffect(() => {
    setShowSuggestions(suggestions.length > 0)
  }, [suggestions])

  return (
    <div className={styles.wrapper}>
      {isInEditMode && (
        <>
          <div className={styles.inputWrapper}>
            <input
              type="text"
              value={value}
              onChange={(e) => {
                setValue(e.target.value.trim().replace('#', ''))
              }}
              onKeyDown={(e) => {
                if (e.keyCode === 9 && !isLoading && showSuggestions) {
                  // tab
                  e.preventDefault()

                  setShowSuggestions(false)
                  onTagAdd(suggestions[0])
                  setValue('')
                  return
                }

                if ([32, 13].includes(e.keyCode)) {
                  // space and enter
                  const tag = value.trim()

                  if (tag !== '') {
                    setShowSuggestions(false)
                    onTagAdd(tag)
                    setValue('')
                    onLoadSuggestionCancel()
                  }
                }

                if (e.keyCode === 8 && value.trim() === '') {
                  // backspace
                  setShowSuggestions(false)
                  onLoadSuggestionCancel()
                }
              }}
            />
            <button
              type="submit"
              onClick={() =>
                onSave().then(() => {
                  setIsInEditMode(false)
                })
              }
              disabled={isSaving}
            >
              save
            </button>
            {isSaving && (
              <div className={styles.loader}>
                <Spinner />
              </div>
            )}
            {showSuggestions && !isLoading && (
              <div className={styles.suggestions}>
                {suggestions.map((tag) => (
                  <button
                    className={styles.tag}
                    key={`suggestion-tag-${tag}`}
                    type="button"
                    title="click to add"
                    onClick={() => {
                      setShowSuggestions(false)
                      onTagAdd(tag)
                      setValue('')
                    }}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            )}

            {isLoading && value !== '' && (
              <div className={styles.suggestions}>
                <div className={styles.loader}>
                  <Spinner />
                </div>
              </div>
            )}
          </div>
          <div className={styles.tagsList}>
            {tags.map((tag) => (
              <button
                className={styles.tag}
                key={`tag-${tag}`}
                type="button"
                title="click to remove"
                onClick={() => onTagRemove(tag)}
              >
                #{tag}
              </button>
            ))}
          </div>
        </>
      )}
      {!isInEditMode && tags.length === 0 && (
        <p className={styles.noRecords}>
          No tags have been added{' '}
          <a
            className={styles.actionButton}
            onClick={() => setIsInEditMode(true)}
          >
            Click here to add a new tag
          </a>
        </p>
      )}
      {!isInEditMode && tags.length > 0 && (
        <div className={styles.tagsList}>
          {tags.map((tag) => (
            <button className={styles.tag} key={`tag-${tag}`} type="button">
              #{tag}
            </button>
          ))}
          <a
            className={styles.actionButton}
            onClick={() => setIsInEditMode(true)}
          >
            Click here to edit
          </a>
        </div>
      )}
    </div>
  )
}
