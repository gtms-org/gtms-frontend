import React, { useState } from 'react'
import { NextPage } from 'next'
import styles from './styles.scss'
import { useTranslation } from '@gtms/commons/i18n'
import { Button } from '@gtms/ui/Button'
import { UserCard } from '@gtms/ui/UserCard'
import { GridCard } from '@gtms/ui/GridCard'

export const GroupMembersPage: NextPage<{}> = () => {
  const { t } = useTranslation('groupMembers')
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

  return (
    <div className={styles.pageWrapper} data-testid="group-members-page">
      <div className={styles.wrapper}>
        <h2 className={styles.header}>{t('header')}</h2>
        <div className={styles.grid}>
          {isModalOpen && (
            <UserCard
              onClose={() => setIsModalOpen(false)}
              image={'/images/temp_images/avatar-1.png'}
            />
          )}
          <GridCard
            name="Johnny Silverhand"
            desc=" Cupidatat nisi aliquip culpa enim laborum cupidatat consequat consequat non occaecat sit et. Reprehenderit quis"
            onClick={() => setIsModalOpen(true)}
            image={{ jpg: '/images/temp_images/logo-wioska-1.png' }}
          />
          <GridCard
            name="Johnny Silverhand"
            desc=" Cupidatat nisi aliquip culpa enim laborum cupidatat consequat consequat non occaecat sit et. Reprehenderit quis"
            onClick={() => setIsModalOpen(true)}
            image={{ jpg: '/images/temp_images/logo-wioska-2.png' }}
          />
          <GridCard
            name="Johnny Silverhand"
            desc=" Cupidatat nisi aliquip culpa enim laborum cupidatat consequat consequat non occaecat sit et. Reprehenderit quis"
            onClick={() => setIsModalOpen(true)}
            image={{ jpg: '/images/temp_images/logo-wioska-3.png' }}
          />
          <GridCard
            name="Johnny Silverhand"
            desc=" Cupidatat nisi aliquip culpa enim laborum cupidatat consequat consequat non occaecat sit et. Reprehenderit quis"
            onClick={() => setIsModalOpen(true)}
            image={{ jpg: '/images/temp_images/logo-wioska-4.png' }}
          />
          <GridCard
            name="Johnny Silverhand"
            desc=" Cupidatat nisi aliquip culpa enim laborum cupidatat consequat consequat non occaecat sit et. Reprehenderit quis"
            onClick={() => setIsModalOpen(true)}
            image={{ jpg: '/images/temp_images/logo-wioska-5.png' }}
          />
          <GridCard
            name="Johnny Silverhand"
            desc=" Cupidatat nisi aliquip culpa enim laborum cupidatat consequat consequat non occaecat sit et. Reprehenderit quis"
            onClick={() => setIsModalOpen(true)}
            image={{ jpg: '/images/temp_images/logo-wioska-6.png' }}
          />
          <GridCard
            name="Johnny Silverhand"
            desc=" Cupidatat nisi aliquip culpa enim laborum cupidatat consequat consequat non occaecat sit et. Reprehenderit quis"
            onClick={() => setIsModalOpen(true)}
            image={{ jpg: '/images/temp_images/logo-wioska-7.png' }}
          />
          <GridCard
            name="Johnny Silverhand"
            desc=" Cupidatat nisi aliquip culpa enim laborum cupidatat consequat consequat non occaecat sit et. Reprehenderit quis"
            onClick={() => setIsModalOpen(true)}
            image={{ jpg: '/images/temp_images/logo-wioska-8.png' }}
          />
          <GridCard
            name="Johnny Silverhand"
            desc=" Cupidatat nisi aliquip culpa enim laborum cupidatat consequat consequat non occaecat sit et. Reprehenderit quis"
            onClick={() => setIsModalOpen(true)}
            image={{ jpg: '/images/temp_images/logo-wioska-9.png' }}
          />
          <GridCard
            name="Johnny Silverhand"
            desc=" Cupidatat nisi aliquip culpa enim laborum cupidatat consequat consequat non occaecat sit et. Reprehenderit quis"
            onClick={() => setIsModalOpen(true)}
            image={{ jpg: '/images/temp_images/logo-wioska-10.png' }}
          />
          <GridCard
            name="Johnny Silverhand"
            desc=" Cupidatat nisi aliquip culpa enim laborum cupidatat consequat consequat non occaecat sit et. Reprehenderit quis"
            onClick={() => setIsModalOpen(true)}
            image={{ jpg: '/images/temp_images/logo-wioska-11.png' }}
          />
          <GridCard
            name="Johnny Silverhand"
            desc=" Cupidatat nisi aliquip culpa enim laborum cupidatat consequat consequat non occaecat sit et. Reprehenderit quis"
            onClick={() => setIsModalOpen(true)}
            image={{ jpg: '/images/temp_images/logo-wioska-1.png' }}
          />
          <GridCard
            name="Johnny Silverhand"
            desc=" Cupidatat nisi aliquip culpa enim laborum cupidatat consequat consequat non occaecat sit et. Reprehenderit quis"
            onClick={() => setIsModalOpen(true)}
            image={{ jpg: '/images/temp_images/logo-wioska-2.png' }}
          />
          <GridCard
            name="Johnny Silverhand"
            desc=" Cupidatat nisi aliquip culpa enim laborum cupidatat consequat consequat non occaecat sit et. Reprehenderit quis"
            onClick={() => setIsModalOpen(true)}
            image={{ jpg: '/images/temp_images/logo-wioska-3.png' }}
          />
          <GridCard
            name="Johnny Silverhand"
            desc=" Cupidatat nisi aliquip culpa enim laborum cupidatat consequat consequat non occaecat sit et. Reprehenderit quis"
            onClick={() => setIsModalOpen(true)}
            image={{ jpg: '/images/temp_images/logo-wioska-4.png' }}
          />
          <GridCard
            name="Johnny Silverhand"
            desc=" Cupidatat nisi aliquip culpa enim laborum cupidatat consequat consequat non occaecat sit et. Reprehenderit quis"
            onClick={() => setIsModalOpen(true)}
            image={{ jpg: '/images/temp_images/logo-wioska-5.png' }}
          />
          <GridCard
            name="Johnny Silverhand"
            desc=" Cupidatat nisi aliquip culpa enim laborum cupidatat consequat consequat non occaecat sit et. Reprehenderit quis"
            onClick={() => setIsModalOpen(true)}
            image={{ jpg: '/images/temp_images/logo-wioska-6.png' }}
          />
          <GridCard
            name="Johnny Silverhand"
            desc=" Cupidatat nisi aliquip culpa enim laborum cupidatat consequat consequat non occaecat sit et. Reprehenderit quis"
            onClick={() => setIsModalOpen(true)}
            image={{ jpg: '/images/temp_images/logo-wioska-7.png' }}
          />
          <GridCard
            name="Johnny Silverhand"
            desc=" Cupidatat nisi aliquip culpa enim laborum cupidatat consequat consequat non occaecat sit et. Reprehenderit quis"
            onClick={() => setIsModalOpen(true)}
            image={{ jpg: '/images/temp_images/logo-wioska-8.png' }}
          />
          <GridCard
            name="Johnny Silverhand"
            desc=" Cupidatat nisi aliquip culpa enim laborum cupidatat consequat consequat non occaecat sit et. Reprehenderit quis"
            onClick={() => setIsModalOpen(true)}
            image={{ jpg: '/images/temp_images/logo-wioska-9.png' }}
          />
          <GridCard
            name="Johnny Silverhand"
            desc=" Cupidatat nisi aliquip culpa enim laborum cupidatat consequat consequat non occaecat sit et. Reprehenderit quis"
            onClick={() => setIsModalOpen(true)}
            image={{ jpg: '/images/temp_images/logo-wioska-10.png' }}
          />
          <GridCard
            name="Johnny Silverhand"
            desc=" Cupidatat nisi aliquip culpa enim laborum cupidatat consequat consequat non occaecat sit et. Reprehenderit quis"
            onClick={() => setIsModalOpen(true)}
            image={{ jpg: '/images/temp_images/logo-wioska-11.png' }}
          />
          <Button additionalStyles={styles.btn}>See more</Button>
        </div>
      </div>
    </div>
  )
}

GroupMembersPage.getInitialProps = () => {
  return Promise.resolve({ namespacesRequired: ['groupMembers', 'userCard'] })
}

export default GroupMembersPage
