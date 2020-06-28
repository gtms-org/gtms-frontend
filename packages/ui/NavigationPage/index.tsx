import React, { FC } from 'react'
import styles from './styles.scss'
import { Link } from '@gtms/commons/i18n'
import { toggleSidebarNotifications } from 'state'

// this is just a mock
// @todo remove it when no longer needed
import {
  IoIosNotifications,
  IoIosListBox,
  IoIosPricetags,
  IoIosPeople,
} from 'react-icons/io'

export const NavigationPage: FC<{}> = () => {
  // this is just a mock
  // @todo remove it when no longer needed
  const links = [
    {
      label: 'Notifications',
      icon: <IoIosNotifications />,
      onClick: toggleSidebarNotifications,
      url: '/',
    },
    {
      label: 'Posts',
      icon: <IoIosListBox />,
      url: '/',
    },
    {
      label: 'Tags',
      icon: <IoIosPricetags />,
      url: '/',
    },
    {
      label: 'Users',
      icon: <IoIosPeople />,
      url: '/',
    },
  ]

  return (
    <div className={styles.wrapper}>
      <ul className={styles.linksMock}>
        {links.map((value, index) => {
          // this is just a mock
          // @todo remove it when no longer needed

          return (
            <li className={styles.link} key={index}>
              {value?.onClick && (
                <a onClick={value.onClick}>
                  <i>{value.icon}</i>
                  <span>{value.label}</span>
                </a>
              )}
              {!value?.onClick && (
                <Link href={value.url}>
                  <a>
                    <i>{value.icon}</i>
                    <span>{value.label}</span>
                  </a>
                </Link>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
