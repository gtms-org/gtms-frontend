import React, { FC, useState, useEffect } from 'react'
import cx from 'classnames'
// state
import { postsQuery } from '@gtms/state-post'
// ui
import { GroupSidebar } from '@app/components/group/Sidebar'
import { SearchBar } from '@gtms/ui/SearchBar'
// styles
import styles from './styles.scss'

interface IGroupHeaderState {
  activeTags: string[]
  activeUsers: string[]
}

const getState = (value = postsQuery.getValue()) => ({
  activeTags: value.tags || [],
  activeUsers: value.users || [],
})

export const GroupHeader: FC<{
  additionalStyles?: string
}> = ({ additionalStyles }) => {
  const [state, setState] = useState<IGroupHeaderState>(getState)

  useEffect(() => {
    const sub = postsQuery.select().subscribe((value) => {
      setState(getState(value))
    })

    return () => {
      sub && !sub.closed && sub.unsubscribe()
    }
  }, [])

  return (
    <div
      className={cx(styles.groupHeaderComponent, additionalStyles)}
      data-testid="group-header"
    >
      <SearchBar
        additionalStyles={styles.search}
        onLoadSuggestion={() => null}
        onLoadSuggestionCancel={() => null}
        onQueryChange={() => null}
        onTagAdd={() => null}
        onTagRemove={() => null}
        onUserRemove={() => null}
        tags={state.activeTags || []}
        users={state.activeUsers}
      />
      <GroupSidebar />
    </div>
  )
}
