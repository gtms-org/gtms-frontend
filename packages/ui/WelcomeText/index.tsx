import React, { FC } from 'react'
import cx from 'classnames'
// ui
import styles from './styles.scss'

export const WelcomeText: FC<{ onClick?: () => void }> = ({ onClick }) => {
  return (
    <div
      className={cx(
        styles.welcomeTextWrapper,
        styles.animate,
        styles.fadeInUp,
        styles.one
      )}
      onClick={onClick}
      data-testid="welcome-text"
    >
      <div className={styles.content}>
        <h2 className={styles.header}>Welome to Black Rock City</h2>
        <p className={styles.desc}>
          {`Once a year, tens of thousands of people gather in Nevada's Black Rock Desert to create Black Rock City, a temporary metropolis dedicated to community, art, self-expression, and self-reliance. In this crucible of creativity, all are welcome.`}
        </p>
      </div>
    </div>
  )
}
