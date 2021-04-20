import React, { FC } from 'react'
import styles from './styles.scss'
import cx from 'classnames'
import {
  FaFacebook,
  FaGithub,
  FaInstagram,
  FaLinkedin,
  FaMedium,
  FaRedditSquare,
  FaTelegram,
  FaTwitter,
  FaWhatsapp,
} from 'react-icons/fa'

export const SocialMedia: FC<{ additionalStyles?: string }> = ({
  additionalStyles,
}) => {
  return (
    <ul
      className={cx(styles.socialMedia, additionalStyles)}
      test-id="social-media"
    >
      <li className={styles.item}>
        <a>
          <i>
            <FaInstagram />
          </i>
        </a>
      </li>
      <li className={styles.item}>
        <a>
          <i>
            <FaFacebook />
          </i>
        </a>
      </li>
      <li className={styles.item}>
        <a>
          <i>
            <FaWhatsapp />
          </i>
        </a>
      </li>
      <li className={styles.item}>
        <a>
          <i>
            <FaTelegram />
          </i>
        </a>
      </li>
      <li className={styles.item}>
        <a>
          <i>
            <FaTwitter />
          </i>
        </a>
      </li>
      <li className={styles.item}>
        <a>
          <i>
            <FaGithub />
          </i>
        </a>
      </li>
      <li className={styles.item}>
        <a>
          <i>
            <FaRedditSquare />
          </i>
        </a>
      </li>
      <li className={styles.item}>
        <a>
          <i>
            <FaMedium />
          </i>
        </a>
      </li>
      <li className={styles.item}>
        <a>
          <i>
            <FaLinkedin />
          </i>
        </a>
      </li>
      <li className={styles.item}>
        <a>
          <i>
            <FaInstagram />
          </i>
        </a>
      </li>
    </ul>
  )
}
