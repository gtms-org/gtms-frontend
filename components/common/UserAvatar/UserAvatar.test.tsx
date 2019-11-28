import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import { UserAvatar } from './index'
import styles from './styles.scss'

describe('<UserAvatar />', () => {
  it('Should be on the page and render all elements', () => {
    const { getByTestId, container, getByText } = render(
      <UserAvatar userName="Tester" image="/fake/img.png" onClick={jest.fn()} />
    )

    expect(getByTestId('user-avatar')).toBeInTheDocument()
    expect(getByTestId('user-avatar-image')).toBeInTheDocument()
    expect(container.querySelector(`.${styles.container}`)).toBeInTheDocument()
    expect(getByText('Tester')).toBeInTheDocument()
  })

  it('Should add additional css classes', () => {
    const { container } = render(
      <UserAvatar
        additionalStyles="testingClass"
        userName="Tester"
        image="/fake/img.png"
        onClick={jest.fn()}
      />
    )

    expect(container.querySelector('.testingClass')).toBeInTheDocument()
  })

  it('Should trigger callback when clicking on avatar', () => {
    const callback = jest.fn()
    const { getByTestId } = render(
      <UserAvatar userName="Tester" image="/fake/img.png" onClick={callback} />
    )

    fireEvent.click(getByTestId('user-avatar'))

    expect(callback).toBeCalledTimes(1)
  })
})
