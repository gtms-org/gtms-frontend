import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import { UserAvatar } from './index'
import styles from './styles.scss'

describe('<UserAvatar />', () => {
  it('Should be on the page and render all elements', () => {
    const { getByTestId, container } = render(
      <UserAvatar image={{ jpg: '/fake/img.jpg' }} />
    )

    expect(getByTestId('user-avatar')).toBeInTheDocument()
    expect(container.querySelector(`.${styles.wrapper}`)).toBeInTheDocument()
  })

  it('Should add additional css classes', () => {
    const { container } = render(
      <UserAvatar
        additionalStyles="testingClass"
        image={{ jpg: '/fake/img.jpg' }}
      />
    )

    expect(container.querySelector('.testingClass')).toBeInTheDocument()
  })

  it('Should trigger callback when clicking on avatar', () => {
    const callback = jest.fn()
    const { getByTestId } = render(
      <UserAvatar image={{ jpg: '/fake/img.jpg' }} onClick={callback} />
    )

    fireEvent.click(getByTestId('user-avatar'))

    expect(callback).toBeCalledTimes(1)
  })
})
