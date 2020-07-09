import React, { FC } from 'react'
import styles from './styles.scss'
import cx from 'classnames'
import { DeletePost } from '../DeletePost'
import { UserAvatar } from '../../UserAvatar'
import ReactMarkdown from 'react-markdown'
import { formatDistance } from 'date-fns'
import { pl } from 'date-fns/locale'
import { Link } from '@gtms/commons/i18n'
import { IImage } from '@gtms/commons/types/image'
import { IAccountDetails, IUser } from '@gtms/commons/models'
import { getDisplayName, getImage } from '@gtms/commons/helpers'

export const PostResponse: FC<{
  text: string
  createdAt: string
  additionalStyles?: string
  owner: IUser
  noImage: { [key: string]: IImage }
  user: IAccountDetails | null
}> = ({ additionalStyles, text, createdAt, owner, noImage, user }) => {
  return (
    <div
      className={cx(styles.wrapper, additionalStyles)}
      data-testid="post-single"
    >
      <div className={styles.header}>
        <Link href={`/user/${owner.id}`}>
          <div className={styles.user}>
            <UserAvatar
              image={getImage('35x35', owner.avatar, noImage)}
              additionalStyles={styles.userAvatar}
            />
            <span>{getDisplayName(owner)}</span>
          </div>
        </Link>
        <span>
          {formatDistance(new Date(createdAt), new Date(), { locale: pl })}
        </span>
        {user?.id === owner.id && (
          <DeletePost additionalStyles={styles.deleteBtn} />
        )}
      </div>
      <div className={styles.desc}>
        <ReactMarkdown className={styles.text} source={text} />
      </div>
    </div>
  )
}
