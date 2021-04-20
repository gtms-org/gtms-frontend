import React from 'react'
import { render } from '@testing-library/react'
import { SocialMedia } from './index'

describe('<SocialMedia />', () => {
  it('Should be on the page', () => {
    const { getByTestId } = render(<SocialMedia />)

    expect(getByTestId('social-media')).toBeInTheDocument()
  })
})
