import React, { FC, useState, useEffect } from 'react'
import { formatDistance } from 'date-fns'
import cx from 'classnames'
import { useTranslation, Link } from '@gtms/commons/i18n'
import { PromotedTagNoImage } from '@app/enums'
import { truncateString } from '@gtms/commons/helpers'
import { generateSearchURL } from '@app/helpers'
// state
import { ITagsBarState, tagsBarState, tagsBarState$ } from './state.query'
import {
  loadGroupPromotedTags,
  loadRecentlyViewedTags,
  saveRecentlyViewedTag,
  loadGroupFavTags,
} from '@gtms/state-tag'
import { getGroupPosts } from '@gtms/state-post'
// ui
import { Button } from '@gtms/ui/Button'
import { Image } from '@gtms/ui/Image'
import { IoMdClose, IoMdGrid } from 'react-icons/io'
import { Scrollbars } from 'react-custom-scrollbars'
import { Spinner } from '@gtms/ui/Spinner'
// styles
import styles from './styles.scss'

enum Tabs {
  promoted,
  favorites,
  recentlyViewed,
}

export const TagsBar: FC<{ additionalStyles?: string }> = ({
  additionalStyles,
}) => {
  const [currentTab, setCurrentTab] = useState<Tabs>(Tabs.promoted)
  const [state, setState] = useState<ITagsBarState>(tagsBarState())
  const [isActive, setIsActive] = useState<boolean>(false)
  const { i18n } = useTranslation('groupPage')

  useEffect(() => {
    const sub = tagsBarState$.subscribe((value) => {
      setState(value)
    })

    return () => {
      sub && !sub.closed && sub.unsubscribe()
    }
  }, [])

  useEffect(() => {
    if (
      currentTab === Tabs.recentlyViewed &&
      !state.recentlyViewed.isLoading &&
      !state.recentlyViewed.isLoaded &&
      !state.recentlyViewed.errorOccured &&
      state.groupId
    ) {
      loadRecentlyViewedTags(state.groupId)
    }

    if (
      currentTab === Tabs.promoted &&
      !state.promoted.isLoading &&
      !state.promoted.errorOccured &&
      !state.promoted.isLoaded &&
      state.groupId
    ) {
      loadGroupPromotedTags(state.groupId)
    }

    if (
      currentTab === Tabs.favorites &&
      state.isLogged &&
      !state.fav.isLoading &&
      !state.fav.isLoaded &&
      !state.fav.errorOccured &&
      state.groupId
    ) {
      loadGroupFavTags(state.groupId)
    }
  }, [
    currentTab,
    state.recentlyViewed,
    state.promoted,
    state.fav,
    state.groupId,
    state.isLogged,
  ])

  // @todo this can be done better
  // http://geotags.atlassian.net/browse/GEOT-708
  if (
    state.promoted.tags.length === 0 &&
    state.recentlyViewed.tags.length === 0 &&
    state.fav.tags.length === 0
  ) {
    return null
  }

  return (
    <div
      className={cx(styles.wrapper, additionalStyles, {
        [styles.active]: isActive,
      })}
    >
      {!isActive && (
        <Button additionalStyles={styles.btn} onClick={() => setIsActive(true)}>
          <i>
            <IoMdGrid />
          </i>
          My tags
        </Button>
      )}
      {isActive && (
        <div className={styles.fixedWrapper}>
          <div className={styles.navWrapper}>
            <ul className={styles.nav}>
              <li
                className={cx({
                  [styles.active]: currentTab === Tabs.promoted,
                })}
                onClick={() => setCurrentTab(Tabs.promoted)}
              >
                <i>
                  <IoMdGrid />
                </i>
                Tags
              </li>
              {state.isLogged && (
                <li
                  onClick={() => setCurrentTab(Tabs.favorites)}
                  className={cx({
                    [styles.active]: currentTab === Tabs.favorites,
                  })}
                >
                  Favorites
                </li>
              )}
              {
                !state.recentlyViewed.isLoading &&
                !state.recentlyViewed.errorOccured &&
                state.recentlyViewed.tags.length > 0 && 
                <li
                  className={cx({
                    [styles.active]: currentTab === Tabs.recentlyViewed,
                  })}
                  onClick={() => setCurrentTab(Tabs.recentlyViewed)}
                >
                  last viewed
                </li>
              }
            </ul>
            <Button
              additionalStyles={styles.btnClose}
              onClick={() => setIsActive(false)}
            >
              <i>
                <IoMdClose />
              </i>
            </Button>
          </div>          
          <Scrollbars style={{ width: '100%', height: '100%' }}>
            {currentTab === Tabs.promoted &&
              !state.promoted.isLoading &&
              !state.promoted.errorOccured &&
              state.promoted.tags.length > 0 && (
                <ul className={styles.items}>
                  {state.promoted.tags.map((tag) => {
                    const url = generateSearchURL(`/group/${state.groupSlug}`, {
                      tag: [tag.tag],
                    })
                    return (
                      <li 
                        className={styles.item} 
                        key={`promotedTag-${tag.id}`}>
                        <Link href={url}>
                          <a
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()

                              if (!state.groupId) {
                                return
                              }

                              window.history.pushState(
                                null,
                                '',
                                `/${i18n.language}${url}`
                              )

                              getGroupPosts({
                                group: state.groupId,
                                tags: [tag.tag],
                              })
                              saveRecentlyViewedTag(state.groupId, tag.tag)
                            }}
                          >
                            <Image
                              {...(tag.logo as any)}
                              noImage={PromotedTagNoImage}
                              size={'35x35'}
                            />
                            <div className={styles.desc}>
                              <h4>#{tag.tag}</h4>
                              <span>{truncateString(tag.description, 28)}</span>
                            </div>
                          </a>
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              )}
            {currentTab === Tabs.recentlyViewed &&
              !state.recentlyViewed.isLoading &&
              !state.recentlyViewed.errorOccured &&
              state.recentlyViewed.tags.length > 0 && (
                <ul className={styles.items}>
                  {state.recentlyViewed.tags.map((tag, index) => (
                    <li
                      className={styles.item}
                      key={`recently-viewed-${tag.tag}-${index}`}
                    >
                      <a>
                        <div className={styles.desc}>
                          <h4>#{tag.tag}</h4>
                          <span>
                            visited{' '}
                            {tag.createdAt && formatDistance(
                              new Date(tag.createdAt),
                              new Date()
                            )}
                          </span>
                        </div>
                      </a>
                    </li>
                  ))}
                </ul>
              )}

            {currentTab === Tabs.favorites &&
              state.isLogged &&
              !state.fav.isLoading &&
              !state.fav.errorOccured &&
              state.fav.tags.length > 0 && (
                <ul className={styles.items}>
                  {state.fav.tags.map((tag) => {
                    const url = generateSearchURL(`/group/${state.groupSlug}`, {
                      tag: [tag.groupTag.tag],
                    })
                    return (
                      <li className={styles.item} key={`favTag-${tag.id}`}>
                        <Link href={url}>
                          <a
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()

                              if (!state.groupId) {
                                return
                              }

                              window.history.pushState(
                                null,
                                '',
                                `/${i18n.language}${url}`
                              )

                              getGroupPosts({
                                group: state.groupId,
                                tags: [tag.groupTag.tag],
                              })
                              saveRecentlyViewedTag(
                                state.groupId,
                                tag.groupTag.tag
                              )
                            }}
                          >
                            <Image
                              {...(tag.groupTag.logo as any)}
                              noImage={PromotedTagNoImage}
                              size={'35x35'}
                            />
                            <div className={styles.desc}>
                              <h4>#{tag.groupTag.tag}</h4>
                              <span>
                                {truncateString(tag.groupTag.description, 28)}
                              </span>
                            </div>
                          </a>
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              )}

            {((currentTab === Tabs.promoted && state.promoted.isLoading) ||
              (currentTab === Tabs.recentlyViewed &&
                state.recentlyViewed.isLoading) ||
              (currentTab === Tabs.favorites && state.fav.isLoading)) && (
              <Spinner additionalStyles={styles.spinner} size="sm" />
            )}

            {((currentTab === Tabs.promoted && state.promoted.errorOccured) ||
              (currentTab === Tabs.recentlyViewed &&
                state.recentlyViewed.errorOccured) ||
              (currentTab === Tabs.favorites && state.fav.errorOccured)) && (
              <p>error occured, try later</p>
            )}

            {((currentTab === Tabs.promoted &&
              state.promoted.isLoading === false &&
              state.promoted.tags.length === 0) ||
              (currentTab === Tabs.recentlyViewed &&
                state.recentlyViewed.isLoaded === true &&
                state.recentlyViewed.tags.length === 0) ||
              (currentTab === Tabs.favorites &&
                state.fav.isLoading === false &&
                state.fav.tags.length === 0)) && (
              <p className={styles.noRecords}>No records</p>
            )}
          </Scrollbars>
        </div>
      )}
    </div>
  )
}
