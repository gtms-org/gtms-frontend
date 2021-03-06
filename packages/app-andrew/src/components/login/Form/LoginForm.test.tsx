import React from 'react'
import { render, act } from '@testing-library/react'
import { LoginForm } from './index'
import { useForm } from 'react-hook-form'
import { ILoginData } from '@gtms/api-auth'
import { FetchMock } from 'jest-fetch-mock'
import { useTranslation } from '@gtms/commons/i18n'

const fetchMock = fetch as FetchMock

jest.mock('react-hook-form', () => ({
  useForm: jest.fn().mockImplementation(() => ({
    register: jest.fn(),
    handleSubmit: jest.fn(),
    errors: {},
    setError: jest.fn(),
  })),
}))

describe('<LoginForm />', () => {
  beforeEach(() => {
    fetchMock.resetMocks()
  })

  it('Should be on the page', () => {
    const { getByTestId } = render(<LoginForm />)

    expect(getByTestId('login-form')).toBeInTheDocument()
    expect(useTranslation).toBeCalledWith('login')
  })

  it('Should have all required fields', () => {
    const { getByPlaceholderText, getByText } = render(<LoginForm />)

    expect(getByPlaceholderText('form.labels.email')).toBeInTheDocument()
    expect(getByPlaceholderText('form.labels.password')).toBeInTheDocument()
    expect(getByText('form.submitButton')).toBeInTheDocument()
  })

  it('Should not display any errors when just loaded', () => {
    const { queryByTestId } = render(<LoginForm />)

    expect(queryByTestId('form-error')).toBeNull()
  })

  it('Should display validation errors for email and password', () => {
    ;(useForm as jest.Mock).mockImplementationOnce(() => {
      return {
        register: jest.fn(),
        handleSubmit: jest.fn(),
        errors: {
          email: {
            type: 'required',
          },
          password: {
            type: 'required',
          },
        },
        setError: jest.fn(),
      }
    })

    const { getByText } = render(<LoginForm />)

    expect(getByText('form.validation.email.isRequired')).toBeInTheDocument()
    expect(getByText('form.validation.password.isRequired')).toBeInTheDocument()
  })

  it('Should set errors when clicking on submit button without filling form', () => {
    // eslint-disable-next-line
    let onSubmit: any
    const setError = jest.fn()
    ;(useForm as jest.Mock).mockImplementationOnce(() => {
      return {
        register: jest.fn(),
        handleSubmit: (func: (data: ILoginData) => Promise<void>) => {
          onSubmit = func
        },
        errors: {
          email: {
            type: 'required',
          },
          password: {
            type: 'required',
          },
        },
        setError,
      }
    })

    act(() => {
      render(<LoginForm />)

      onSubmit({})
    })

    expect(setError).toBeCalledTimes(2)
  })

  it('Should make an request to API to login the user', async (done) => {
    fetchMock.mockResponseOnce(
      JSON.stringify({
        accessToken:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb3VudHJ5Q29kZSI6IlBMIiwiZW1haWwiOiJtYXJpdXN6QGthYmFsYS53YXcucGwiLCJpZCI6IjVjZGZiNmE2YmFkODhiYjVkYmYxZWNjZiIsImxhbmd1YWdlQ29kZSI6InBsLVBMIiwicm9sZXMiOltdLCJpYXQiOjE1NzUwMzA2OTgsImV4cCI6MTU3NTAzMTU5OH0.L7KVbpbzJSRo6xt1rqyYzdL7RLS_ZrwSV9R_sO5aZuA',
        refreshToken:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb3VudHJ5Q29kZSI6IlBMIiwiZW1haWwiOiJtYXJpdXN6QGthYmFsYS53YXcucGwiLCJpZCI6IjVjZGZiNmE2YmFkODhiYjVkYmYxZWNjZiIsImxhbmd1YWdlQ29kZSI6InBsLVBMIiwicm9sZXMiOltdLCJpYXQiOjE1NzUwMzA2OTgsImV4cCI6MTU3NTExNzA5OH0.agCvu5lSJwaJL1ralwGKsobDRQjMEWZANrrwwA3gxT0',
      })
    )
    // eslint-disable-next-line
    let onSubmit: any
    ;(useForm as jest.Mock).mockImplementationOnce(() => {
      return {
        register: jest.fn(),
        handleSubmit: (func: (data: ILoginData) => Promise<void>) => {
          onSubmit = func
        },
        errors: {
          email: {
            type: 'required',
          },
          password: {
            type: 'required',
          },
        },
        setError: jest.fn(),
      }
    })

    act(() => {
      render(<LoginForm />)
    })

    await act(async () => {
      await onSubmit({
        email: 'tester@testing.jest',
        password: 'loremIpsum',
      })
    })

    expect(fetchMock.mock.calls.length).toEqual(1)
    done()
  })

  it('Should set login failed error message when 401 from API response', async (done) => {
    fetchMock.mockRejectOnce(new Error('fake error'))
    // eslint-disable-next-line
    let onSubmit: any
    const setError = jest.fn()
    ;(useForm as jest.Mock).mockImplementationOnce(() => {
      return {
        register: jest.fn(),
        handleSubmit: (func: (data: ILoginData) => Promise<void>) => {
          onSubmit = func
        },
        errors: {
          email: {
            type: 'required',
          },
          password: {
            type: 'required',
          },
        },
        setError,
      }
    })

    render(<LoginForm />)

    await act(async () => {
      await onSubmit({
        email: 'tester@testing.jest',
        password: 'loremIpsum',
      })
    })

    expect(fetchMock.mock.calls.length).toEqual(1)
    expect(setError).toBeCalledTimes(1)

    done()
  })
})
