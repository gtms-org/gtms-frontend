import React from 'react'
import { render, act } from '@testing-library/react'
import { ResetPasswordForm, IResetPasswordFormData } from './index'
import { FetchMock } from 'jest-fetch-mock'
import useForm from 'react-hook-form'

const fetchMock = fetch as FetchMock

jest.mock('react-hook-form', () => {
  return jest.fn().mockImplementation(() => ({
    register: jest.fn(),
    handleSubmit: jest.fn(),
    errors: {},
    setError: jest.fn(),
  }))
})

describe('<ResetPasswordForm />', () => {
  beforeEach(() => {
    fetchMock.resetMocks()
  })

  const renderComponent = (onSuccess = jest.fn()) =>
    render(<ResetPasswordForm code={'testing'} onSuccess={onSuccess} />)

  it('Should be on the page', () => {
    const { getByTestId } = renderComponent()

    expect(getByTestId('reset-password-form')).toBeInTheDocument()
  })

  it('Should have password, confirmPassword fields and submit button', () => {
    const { getByPlaceholderText, getByText } = renderComponent()

    expect(getByPlaceholderText('form.labels.password')).toBeInTheDocument()
    expect(
      getByPlaceholderText('form.labels.confirmPassword')
    ).toBeInTheDocument()
    expect(getByText('form.submitButton')).toBeInTheDocument()
  })

  it('Should not display any errors when just loaded', () => {
    const { queryByTestId } = renderComponent()

    expect(queryByTestId('form-error')).toBeNull()
  })

  it('Should display validation errors for email field', () => {
    ;(useForm as jest.Mock).mockImplementationOnce(() => {
      return {
        register: jest.fn(),
        handleSubmit: jest.fn(),
        errors: {
          password: {
            type: 'required',
          },
        },
        setError: jest.fn(),
      }
    })

    const { getByText } = renderComponent()

    expect(getByText('form.validation.password.isRequired')).toBeInTheDocument()
  })

  it('Should display server errors when 500 from API response', () => {
    ;(useForm as jest.Mock).mockImplementationOnce(() => {
      return {
        register: jest.fn(),
        handleSubmit: jest.fn(),
        errors: {
          password: {
            type: 'serverError',
          },
        },
        setError: jest.fn(),
      }
    })

    const { getByText } = renderComponent()

    expect(getByText('serverError')).toBeInTheDocument()
  })

  it('Should set errors when clicking on submit button without filling form', () => {
    // eslint-disable-next-line
    let onSubmit: any
    const setError = jest.fn()
    ;(useForm as jest.Mock).mockImplementationOnce(() => {
      return {
        register: jest.fn(),
        handleSubmit: (
          func: (data: IResetPasswordFormData) => Promise<void>
        ) => {
          onSubmit = func
        },
        errors: {},
        setError,
      }
    })

    act(() => {
      renderComponent()
      onSubmit({})
    })

    expect(setError).toBeCalledTimes(2)
  })

  it('Should make an request to API to reset passwords', async done => {
    fetchMock.mockResponseOnce('{}')
    // eslint-disable-next-line
    let onSubmit: any
    const onSuccess = jest.fn()
    ;(useForm as jest.Mock).mockImplementationOnce(() => {
      return {
        register: jest.fn(),
        handleSubmit: (
          func: (data: IResetPasswordFormData) => Promise<void>
        ) => {
          onSubmit = func
        },
        errors: {},
        setError: jest.fn(),
      }
    })

    act(() => {
      renderComponent(onSuccess)
    })

    await onSubmit({
      password: 'testing1234',
      confirmPassword: 'testing1234',
    })

    expect(onSuccess).toBeCalledTimes(1)
    expect(fetchMock.mock.calls.length).toEqual(1)
    done()
  })

  it('Should set server error message when 500 from API response', async done => {
    fetchMock.mockRejectOnce(new Error('fake error'))
    // eslint-disable-next-line
    let onSubmit: any
    const setError = jest.fn()
    ;(useForm as jest.Mock).mockImplementationOnce(() => {
      return {
        register: jest.fn(),
        handleSubmit: (
          func: (data: IResetPasswordFormData) => Promise<void>
        ) => {
          onSubmit = func
        },
        errors: {},
        setError,
      }
    })

    renderComponent()

    await onSubmit({
      password: 'testing1234',
      confirmPassword: 'testing1234',
    })
    expect(fetchMock.mock.calls.length).toEqual(1)
    expect(setError).toBeCalledTimes(1)

    done()
  })
})
