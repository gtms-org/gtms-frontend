import React, { FC, useRef, useLayoutEffect, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { IAccountDetails } from '@gtms/commons/models'
import cx from 'classnames'
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock'
import { Overlay } from '@gtms/ui/Overlay'
import useKey from 'use-key-hook'
import styles from './styles.scss'

export const PostDetailsModal: FC<{
  onClose: () => unknown
  user: IAccountDetails | null
}> = ({ onClose, user }) => {
  const portalNode = useRef(
    typeof window !== 'undefined' && document.createElement('div')
  )

  useLayoutEffect(() => {
    if (document) {
      document.body.appendChild(portalNode.current as HTMLDivElement)
    }
  }, [])

  useEffect(() => {
    disableBodyScroll(document.body)

    return () => enableBodyScroll(document.body)
  }, [])

  useKey(() => onClose(), {
    detectKeys: [27],
  })

  if (!portalNode.current) {
    return null
  }

  return createPortal(
    <>
      <Overlay />
      <div
        className={cx(styles.wrapper, {
          [styles.loggedIn]: user !== null,
        })}
      >
        FULL POST
      </div>
    </>,
    portalNode.current
  )
}
