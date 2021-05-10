import React, { FC } from 'react'
import cx from 'classnames'
import { IImage } from '@gtms/commons/types/image'
import { Picture } from '../Picture'
import styles from './styles.scss'

export const UserAvatar: FC<{
  additionalStyles?: string
  alt?: string
  image: IImage
  onClick?: () => void
  size?: string
}> = ({ additionalStyles, alt, image, onClick, size }) => (
  <div
    className={cx(styles.wrapper, additionalStyles, {
      [styles.xs]: size === 'xs',
      [styles.sm]: size === 'sm',
      [styles.md]: size === 'md',
      [styles.xxl]: size === 'xxl',
      [styles.percent100]: size === '100percent',
    })}
    data-testid="user-avatar"
    onClick={onClick}
  >
    <Picture alt={alt} {...image} />
  </div>
)
