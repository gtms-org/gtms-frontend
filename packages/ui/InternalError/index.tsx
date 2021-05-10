import React, { FC } from 'react'
import cx from 'classnames'
// ui
import { Link } from '@gtms/commons/i18n'
import { IoMdArrowBack } from 'react-icons/io'
import { Button } from '@gtms/ui/Button'
import { Overlay } from '@gtms/ui/Overlay'
// @todo find proper image GEOT-748
// import { Picture } from '@gtms/ui/Picture'
import styles from './styles.scss'

export const InternalError: FC<{
  statusCode?: number
  additionalStyles?: string
}> = ({ additionalStyles, statusCode }) => {
  return (
    <>
      <div
        data-testid={'internal-error'}
        className={cx(styles.wrapper, additionalStyles)}
      >
        {/* @todo find proper image GEOT-748 */}
        {/* <Picture
          additionalStyles={styles.image}
          jpg={'/images/theme-images/image404.png'}
        /> */}
        <h2>
          {statusCode
            ? `An error ${statusCode} occurred on server`
            : 'An error occurred on client'}
        </h2>
        <Button additionalStyles={styles.btn}>
          <Link href="/">
            <a>
              <i>
                <IoMdArrowBack />
              </i>
              Button
            </a>
          </Link>
        </Button>
      </div>
      <Overlay />
    </>
  )
}
