import React, { useState, useEffect } from 'react'
import { NextPage, NextPageContext } from 'next'
import styles from './styles.scss'
import { Button } from '@gtms/ui/Button'
import { LoginForm } from '../../components/login/Form'
import { useTranslation, Link } from '@gtms/commons/i18n'
import { SocialButtons } from '../../components/login/SocialButtons'
import { userQuery, hasAuthSessionCookies } from '@gtms/state-user'
import { redirect } from '@gtms/commons/helpers/redirect'

export const LoginPage: NextPage<{}> = () => {
  const { t } = useTranslation('login')
  const [error, setError] = useState<string | undefined>()

  useEffect(() => {
    const sub = userQuery.isActive$.subscribe((isActive) => {
      if (userQuery.hasData() && !isActive) {
        redirect('/registration/success')
      }
    })

    const loggedSub = userQuery.isLogged$.subscribe((isLogged) => {
      if (isLogged) {
        redirect('/')
      }
    })

    return () => {
      sub && !sub.closed && sub.unsubscribe()
      loggedSub && !loggedSub.closed && loggedSub.unsubscribe()
    }
  }, [])

  return (
    <div className={styles.wrapper} data-testid="login-page">
      <div>
        {error && <div data-testid="login-page-error">{t(error)}</div>}
        <h2>Tempor irure qui exce</h2>
        <p>
          Tempor irure qui excepteur ipsum excepteur qui pariatur deserunt
          consequat aco nsequat est. Non eiusmod ea non cupidatat occaecat do
          cupidatat in duis ipsum velit veniam incididunt.
        </p>
        <LoginForm additionalStyles={styles.form} />
        <div className={styles.actionButtons}>
          <Link href="/registration">
            <Button additionalStyles={styles.btn}>
              {t('goToRegistration')}
            </Button>
          </Link>
          <Link href="/remind-password">
            <Button additionalStyles={styles.btn}>
              {t('goToRemindPassword')}
            </Button>
          </Link>
        </div>
        <SocialButtons
          additionalStyles={styles.socialButtons}
          onFailure={() => setError('socialMediaLoginFailed')}
        />
      </div>
    </div>
  )
}

LoginPage.getInitialProps = async (ctx: NextPageContext) => {
  if (hasAuthSessionCookies(ctx)) {
    redirect('/', ctx)
  }

  return Promise.resolve({ namespacesRequired: ['login'] })
}

export default LoginPage
