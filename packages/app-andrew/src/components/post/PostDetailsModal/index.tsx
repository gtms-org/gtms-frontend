import React, {
  FC,
  useRef,
  useLayoutEffect,
  useEffect,
  useState,
  useCallback,
} from 'react'
import { createPortal } from 'react-dom'
import {
  IPostDetailsModalState,
  postDetailsModalState,
  postDetailsModalState$,
} from './state.query'
import { IPost } from '@gtms/commons/models'
import cx from 'classnames'
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock'
import useKey from 'use-key-hook'
import { hidePostDetailsModal, Status } from '@app/state/postDetails'
// ui
import { PostDetails } from '@app/components/post/PostDetails'
import { Spinner } from '@gtms/ui/Spinner'
// styles
import styles from './styles.scss'

export const PostDetailsModal: FC<{
  onClose?: () => void
}> = ({ onClose }) => {
  const [state, setState] = useState<IPostDetailsModalState>(
    postDetailsModalState()
  )
  const portalNode = useRef(
    typeof window !== 'undefined' && document.createElement('div')
  )

  const onCloseModalWindow = useCallback(() => {
    hidePostDetailsModal()
    onClose && onClose()
    enableBodyScroll(document.body)
  }, [onClose])

  useLayoutEffect(() => {
    if (document) {
      document.body.appendChild(portalNode.current as HTMLDivElement)
    }
  }, [])

  useEffect(() => {
    const sub = postDetailsModalState$.subscribe((value) => setState(value))

    return () => {
      sub && !sub.closed && sub.unsubscribe()
    }
  }, [])

  useKey(onCloseModalWindow, {
    detectKeys: [27],
  })

  if (!state.isOpen) {
    return null
  }

  if (!portalNode.current) {
    return null
  }

  disableBodyScroll(document.body)

  return createPortal(
    <>
      <div
        className={cx(styles.wrapper, {
          [styles.loggedIn]: state.user !== null,
        })}
      >
        {state.status === Status.isLoading && (
          <Spinner additionalStyles={styles.spinner} />
        )}
        {state.status === Status.isError && <div>PROPER ERROR VIEW HERE</div>}
        {state.status === Status.isLoaded && (
          <div className={styles.content}>
            <div className={styles.left}>
              <a onClick={onCloseModalWindow}>{`< CLOSE MODAL BUTTON`}</a>
            </div>
            <PostDetails
              additionalStyles={styles.post}
              post={state.post as IPost}
              user={state.user}
              comments={state.comments}
            />
            <div className={styles.right}>
              <ul className={styles.tabs}>
                <li className={cx(styles.tab, styles.active)}>
                  Recently visited
                </li>
                <li className={styles.tab}>New responses</li>
              </ul>
              <ul className={styles.items}>
                <li className={styles.item}>
                  Fgiat est culpa consectetur veniam nostrud pariatur eiusmod
                  sint fugiat deserunt.
                </li>
                <li className={styles.item}>
                  Irure sunt exercitation exercitation duis aliqua est ea non
                  magna ex nostrud sit dolor.
                </li>
                <li className={styles.item}>
                  d officia dolor ad sit amet sunt quis duis. Et aliquip anim
                  cillum dolore cillum.
                </li>
                <li className={styles.item}>
                  Sunt proident aliquip laborum reprehenderit non aute laborum
                  deserunt.
                </li>
                <li className={styles.item}>
                  Nisi irure id aliqua sit dolor commodo Lorem sit non. Officia
                  magna id aute tempor eu.
                </li>
                <li className={styles.item}>
                  Proident officia eiusmod ullamco id incididunt do sit sint
                  quis .
                </li>
                <li className={styles.item}>
                  Qui ut Lorem ipsum incididunt minim elit deserunt labore
                  occaecat.
                </li>
                <li className={styles.item}>
                  Id officia dolor ad sit amet sunt quis duis. Et aliquip anim
                  cillum dolore cillum.
                </li>
                <li className={styles.item}>
                  Consequat cillum minim aliqua fugiat eiusmod minim minim.
                </li>
                <li className={styles.item}>
                  roident officia eiusmod ullamco id incididunt do sit sint quis
                  enim magna.
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </>,
    portalNode.current
  )
}
