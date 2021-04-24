import React, { FC, useState, useEffect } from 'react'
import { userQuery } from '@gtms/state-user'
import { Navigation } from '@app/components/commons/Navigation'
import { NavigationDots } from '@app/components/commons/NavigationDots'
// ui
import { SearchBar } from '@gtms/ui/SearchBar'
import { AiFillRead } from 'react-icons/ai'
import { AiOutlineBell } from 'react-icons/ai'
import { AiOutlineForm } from 'react-icons/ai'
import { AiOutlineRead } from 'react-icons/ai'
import { AiOutlineRotateLeft } from 'react-icons/ai'
// styles
import styles from './styles.scss'

export const MobileNavigationWrapper: FC<{}> = () => {
  const [isLogged, setIsLogged] = useState<boolean>(userQuery.isLogged)

  useEffect(() => {
    const sub = userQuery.isLogged$.subscribe((value) => setIsLogged(value))

    return () => {
      sub && !sub.closed && sub.unsubscribe()
    }
  })

  return (
    <div
      className={styles.mobileMainNavigationWrapper}
      data-testid="mobile-navigation-wrapper"
    >
      <style global jsx>{`
        body {
          padding-bottom: 50px;
        }
      `}</style>
      <ul className={styles.items}>
        <li className={styles.item}>
          <i>
            <AiFillRead />
          </i>
          <span>button</span>
        </li>
        <li className={styles.item}>
          <i>
            <AiOutlineBell />
          </i>
          <span>button</span>
        </li>
        <li className={styles.item}>
          <i>
            <AiOutlineForm />
          </i>
          <span>button</span>
        </li>
        <li className={styles.item}>
          <i>
            <AiOutlineRead />
          </i>
          <span>button</span>
        </li>
        <li className={styles.item}>
          <i>
            <AiOutlineRotateLeft />
          </i>
          <span>button</span>
        </li>
      </ul>
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
  )
}
