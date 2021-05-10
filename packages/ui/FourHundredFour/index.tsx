import React, { FC } from 'react'
import cx from 'classnames'
// ui
import { Link } from '@gtms/commons/i18n'
import { IoMdArrowBack } from 'react-icons/io'
import { Button } from '@gtms/ui/Button'
import { Picture } from '@gtms/ui/Picture'
import styles from './styles.scss'

export const FourHundredFour: FC<{ additionalStyles?: string }> = ({
  additionalStyles,
}) => {
  return (
    <div
      data-testid={'four-hundred-four'}
      className={cx(styles.wrapper, additionalStyles)}
    >
      <Picture
        additionalStyles={styles.image}
        jpg={'/images/theme-images/image404.png'}
      />
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
  )
}
