import React, { FC, useState } from 'react'
import cx from 'classnames'
// ui
import { BsCardImage, BsCloudUpload } from 'react-icons/bs'
import { IoMdCloseCircle, IoIosAddCircle } from 'react-icons/io'
import { Button } from '../Button'
import { UploadFile } from '../UploadFile'
import styles from './styles.scss'

export const CoverImageGroup: FC<{
  activeCover?: string
  additionalStyles?: string
  cover?: string
  onClose: () => unknown
  options: {
    className: string
    cover: string
  }[]
  onSave: () => unknown
  setActiveCover: (cover: string) => unknown
  stepTwo?: boolean
  upload: {
    onDrop: (acceptedFiles: File[]) => unknown
    isLoading: boolean
    isError: boolean
    file: ArrayBuffer | string | null
  }
}> = ({
  activeCover,
  additionalStyles,
  cover,
  onClose,
  onSave,
  options,
  setActiveCover,
  stepTwo = false,
  upload,
}) => {
  const [isStepTwo, setIsStepTwo] = useState<boolean>(stepTwo)

  return (
    <div
      data-testid="cover-image-group"
      className={cx(styles.wrapper, additionalStyles)}
    >
      <div
        className={cx(styles.steps, {
          [styles.showCover]: ![undefined, 'noCover', 'unknown'].includes(
            activeCover
          ),
        })}
      >
        {!isStepTwo && (
          <div className={cx(styles.step, styles.one)}>
            <i className={styles.icon}>
              <BsCardImage />
            </i>
            <h2 className={styles.header}>You can add cover photo</h2>
            <div className={styles.buttons}>
              <Button additionalStyles={styles.btn} onClick={onClose}>
                <i>
                  <IoMdCloseCircle />
                </i>
                No, thanks
              </Button>
              <Button
                additionalStyles={styles.btn}
                onClick={() => setIsStepTwo(true)}
              >
                <i>
                  <IoIosAddCircle />
                </i>
                Lets add it
              </Button>
            </div>
          </div>
        )}
        <div
          className={cx(
            styles.step,
            styles.two,
            options.reduce(
              (classes, option) => {
                classes[option.className] = activeCover === option.cover

                return classes
              },
              {
                [styles.active]: isStepTwo,
              }
            )
          )}
          style={
            upload.file
              ? {
                  backgroundImage: `url(${upload.file})`,
                  backgroundSize: 'contain',
                }
              : undefined
          }
        >
          <div>
            <div className={styles.buttons}>
              <Button additionalStyles={styles.btn} onClick={onClose}>
                <i>
                  <IoMdCloseCircle />
                </i>
                Cancel
              </Button>
              {(cover !== activeCover || upload.file) && (
                <Button additionalStyles={styles.btn} onClick={onSave}>
                  <i>
                    <BsCloudUpload />
                  </i>
                  Save changes
                </Button>
              )}
            </div>
            <h2 className={styles.header}>
              Great!
              <span className={styles.text}>
                Page with cover image looks soo much better!
              </span>
            </h2>
          </div>
        </div>
      </div>
      <div
        className={cx(styles.choosePhoto, {
          [styles.active]: isStepTwo,
        })}
      >
        <UploadFile
          additionalStyles={styles.fileUpload}
          onDrop={upload.onDrop}
          isLoading={upload.isLoading}
          isError={upload.isError}
        />
        <ul className={styles.items}>
          {options.map((option, index) => (
            <li
              key={`cover-${index}`}
              className={cx(option.className, styles.item, {
                [styles.active]: activeCover === option.cover,
              })}
              onClick={() => setActiveCover(option.cover)}
            />
          ))}
          <li
            onClick={() => setActiveCover('noCover')}
            className={cx(styles.item, styles.noCover, {
              [styles.active]: activeCover === 'noCover',
            })}
          >
            <i>
              <IoMdCloseCircle />
            </i>
            Nah, I do not want cover image
          </li>
        </ul>
      </div>
    </div>
  )
}
