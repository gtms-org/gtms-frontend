import React, { useState, useEffect } from 'react'
import { NextPage, NextPageContext } from 'next'
import { LoginForm } from 'components/login/Form'
import { Logo } from 'components/common/Logo'
import { ImageCover } from 'components/common/ImageCover'
import { useTranslation, Router } from 'i18n'
import { parseCookies, destroyCookie } from 'nookies'
import styles from '../styles.scss'
import { SocialButtons } from 'components/login/SocialButtons'
import { userQuery } from 'state/user'
import { initAuthSession } from 'helpers/auth'

export const LoginPage: NextPage<{ redirectTo?: string }> = ({
  redirectTo,
}) => {
  const { t } = useTranslation('login')
  const [error, setError] = useState<string | undefined>()
  const onSuccess = () => console.log(redirectTo)
  // Router.push({
  //   pathname: `/${redirectTo || ''}`,
  // })

  useEffect(() => {
    const sub = userQuery.isActive$.subscribe(isActive => {
      if (userQuery.hasData() && !isActive) {
        Router.push({
          pathname: '/registration/success',
        })
      } else if (userQuery.hasData() && isActive) {
        Router.push({
          pathname: '/',
        })
      }
    })

    const loggedSub = userQuery.isLogged$.subscribe(isLogged => {
      if (isLogged) {
        Router.push({
          pathname: `/${redirectTo || ''}`,
        })
      }
    })

    return () => {
      sub.unsubscribe()
      loggedSub.unsubscribe()
    }
  }, [])

  return (
    <div className={styles.page} data-testid="login-page">
      <section
        style={{
          // @todo remove it soon
          position: 'relative',
          background: 'black',
          padding: '20px',
          zIndex: 1,
        }}
      >
        <div className={styles.header}>
          <p>{t('subtitle')}</p>
          <h1>{t('title')}</h1>
        </div>
        {error && <div data-testid="login-page-error">{t(error)}</div>}
        <Logo />
        <LoginForm onSuccess={onSuccess} />
        <SocialButtons
          onSuccess={onSuccess}
          onFailure={() => setError('socialMediaLoginFailed')}
        />
      </section>
      <ImageCover />
    </div>
  )
}

LoginPage.getInitialProps = async (ctx: NextPageContext) => {
  await initAuthSession(ctx)

  if (userQuery.isLogged()) {
  }

  const { redirectTo } = parseCookies(ctx)

  destroyCookie(ctx, 'redirectTo')

  return Promise.resolve({ redirectTo, namespacesRequired: ['login'] })
}

export default LoginPage
