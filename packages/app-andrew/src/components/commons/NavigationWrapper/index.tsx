import React, { FC, useState, useEffect } from 'react'
import { userQuery } from '@gtms/state-user'
import { Navigation } from '@app/components/commons/Navigation'
import { NavigationDots } from '@app/components/commons/NavigationDots'
// ui
import { SearchBar } from '@gtms/ui/SearchBar'
// styles
import styles from './styles.scss'

export const NavigationWrapper: FC<{}> = () => {
  const [isLogged, setIsLogged] = useState<boolean>(userQuery.isLogged)

  useEffect(() => {
    const sub = userQuery.isLogged$.subscribe((value) => setIsLogged(value))

    return () => {
      sub && !sub.closed && sub.unsubscribe()
    }
  })

  return (
    <div
      className={styles.mainNavigationWrapper}
      data-testid="navigation-wrapper"
    >
      <style global jsx>{`
        body {
          padding-left: 45px;
        }
      `}</style>
      <div className={styles.fixed}>
        {' '}
        {/* for position fixed - css purouse */}
        <a href="/">
          <img
            className={styles.logo}
            src="/images/theme-images/logo-burning-man.png"
          />
        </a>
        <SearchBar
          additionalStyles={styles.searchBar}
          onTagAdd={() => null}
          onTagRemove={() => null}
          onLoadSuggestion={() => null}
          onQueryChange={() => null}
          onLoadSuggestionCancel={() => null}
          onUserRemove={() => null}
        />
        {isLogged && (
          <>
            <Navigation />
            <NavigationDots />
          </>
        )}
      </div>
    </div>
  )
}
