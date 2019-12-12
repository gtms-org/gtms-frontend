import React, { useEffect } from 'react'
import { Logo } from 'components/common/Logo'
import { NextPage, NextPageContext } from 'next'
import { useState } from 'react'
import { useTranslation, Link } from 'i18n'
import { userQuery } from 'state/user'
import { RegistrationForm } from 'components/registration/Form'
import { ImageCover } from 'components/common/ImageCover'
import { SocialButtons } from 'components/login/SocialButtons'
import { initAuthSession } from 'helpers/auth'
import { redirect } from 'helpers/redirect'
import styles from '../styles.scss'

export const RegistrationPage: NextPage<{}> = () => {
  const { t } = useTranslation('registration')
  const [error, setError] = useState<string | undefined>()

  useEffect(() => {
    const sub = userQuery.isActive$.subscribe(isActive => {
      if (userQuery.hasData() && !isActive) {
        redirect('/registration/success')
      }
    })
    return () => sub.unsubscribe()
  }, [])

  return (
    <>
      <div className={styles.page} data-testid="registration-page">
        <div
          style={{
            position: 'relative',
            zIndex: 1000,
            background: '#000',
            padding: '20px',
          }}
        >
          <p>{t('subtitle')}</p>
          <h1>{t('header')}</h1>
          {error && <div data-testid="registration-page-error">{t(error)}</div>}
          <Logo />

          <RegistrationForm />
          <SocialButtons
            onFailure={() => setError('socialMediaRegistrationFailed')}
          />
          <Link href="/login">
            <a>{t('goToLogin')}</a>
          </Link>
        </div>
      </div>
      <ImageCover />
    </>
  )
}

RegistrationPage.getInitialProps = async (ctx: NextPageContext) => {
  await initAuthSession(ctx)

  if (userQuery.isLogged()) {
    redirect('/', ctx)
  }

  if (userQuery.hasData() && !userQuery.isActive()) {
    redirect('/registration/success', ctx)
  }

  return Promise.resolve({ namespacesRequired: ['registration'] })
}

export default RegistrationPage
