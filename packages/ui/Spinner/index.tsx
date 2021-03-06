import React, { FC } from 'react'
import cx from 'classnames'
// icons
import { IoIosAirplane, IoIosPaw, IoMdMusicalNote } from 'react-icons/io'
import { FaRegUser } from 'react-icons/fa'
import { FiKey } from 'react-icons/fi'
import { BsUnlock } from 'react-icons/bs'
// styles
import styles from './styles.scss'

export const Spinner: FC<{
  additionalStyles?: string
  centered?: boolean
  size?: string
  type?: string
}> = ({ additionalStyles, centered, size, type }) => (
  <div
    className={cx(styles.wrapper, additionalStyles, {
      [styles.centered]: centered,
      [styles.sm]: size === 'sm',
      [styles.xsm]: size === 'xsm',
    })}
    data-testid={'spinner'}
  >
    {!type && (
      <>
        <i>
          <IoIosAirplane />
        </i>
        <i>
          <IoIosPaw />
        </i>
        <i>
          <IoMdMusicalNote />
        </i>
      </>
    )}
    {type && type === 'authentication' && (
      <>
        <i>
          <FaRegUser />
        </i>
        <i>
          <FiKey />
        </i>
        <i>
          <BsUnlock />
        </i>
      </>
    )}
    <div />
  </div>
)
