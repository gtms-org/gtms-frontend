import React, { FC } from 'react'
import cx from 'classnames'
// import { IImage } from '@gtms/commons/types/image'
// import { Picture } from '../Picture'
import styles from './styles.scss'

export const UserCard: FC<{
  additionalStyles?: string
  alt?: string
  // @todo remove any
  image: any
  user?: any
  // image: IImage
  onClick?: () => void
  size?: string
}> = ({ additionalStyles, alt, image, onClick, user }) => {
  return (
    <div
      className={cx(styles.wrapper, additionalStyles)}
      data-testid="user-avatar"
      onClick={onClick}
    >
      <span className={cx(styles.status, { [styles.online]: true })} />
      <div className={styles.headerAndDesc}>
        <h2 className={styles.header}>{user.name}</h2>
        {user.surname && <p>{user.surname}</p>}
      </div>
      <img alt={alt} src={image} />
      {/* <Picture alt={alt} {...image} /> */}
    </div>
  )
}
