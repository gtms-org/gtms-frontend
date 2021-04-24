import React from 'react'
import { NextPage } from 'next'
import cx from 'classnames'
// ui
import { Button } from '@gtms/ui/Button'
// styles
import styles from './styles.scss'
// icons
// ai
import { AiFillRead } from 'react-icons/ai'
import { AiOutlineBell } from 'react-icons/ai'
import { AiOutlineForm } from 'react-icons/ai'
import { AiOutlineRead } from 'react-icons/ai'
import { AiOutlineRotateLeft } from 'react-icons/ai'
import { AiOutlineRotateRight } from 'react-icons/ai'
import { AiOutlineTags } from 'react-icons/ai'
import { AiOutlineUserAdd } from 'react-icons/ai'
import { AiOutlineClockCircle } from 'react-icons/ai'
//bs
import { BsArrow90DegUp } from 'react-icons/bs'
import { BsCardImage } from 'react-icons/bs'
import { BsCloudUpload } from 'react-icons/bs'
import { BsFillGridFill } from 'react-icons/bs'
import { BsFillImageFill } from 'react-icons/bs'
import { BsFillPlusSquareFill } from 'react-icons/bs'
import { BsUnlock } from 'react-icons/bs'
//fa
import { FaBars } from 'react-icons/fa'
import { FaEnvelopeOpenText } from 'react-icons/fa'
import { FaFacebook } from 'react-icons/fa'
import { FaFacebookF } from 'react-icons/fa'
import { FaGithub } from 'react-icons/fa'
import { FaIdBadge } from 'react-icons/fa'
import { FaIdCard } from 'react-icons/fa'
import { FaInstagram } from 'react-icons/fa'
import { FaLinkedin } from 'react-icons/fa'
import { FaMedium } from 'react-icons/fa'
import { FaRedditSquare } from 'react-icons/fa'
import { FaRegClock } from 'react-icons/fa'
import { FaRegLightbulb } from 'react-icons/fa'
import { FaRegUser } from 'react-icons/fa'
import { FaTelegram } from 'react-icons/fa'
import { FaTwitter } from 'react-icons/fa'
import { FaUsers } from 'react-icons/fa'
import { FaUserShield } from 'react-icons/fa'
import { FaWhatsapp } from 'react-icons/fa'
//fi
import { FiKey } from 'react-icons/fi'
import { FiUsers } from 'react-icons/fi'
//go
import { GoChevronLeft } from 'react-icons/go'
import { GoChevronRight } from 'react-icons/go'
import { GoPlus } from 'react-icons/go'
import { GoSettings } from 'react-icons/go'
//io
import { IoIosAddCircle } from 'react-icons/io'
import { IoIosAirplane } from 'react-icons/io'
import { IoIosArrowDown } from 'react-icons/io'
import { IoIosArrowDropright } from 'react-icons/io'
import { IoIosArrowRoundForward } from 'react-icons/io'
import { IoIosCheckbox } from 'react-icons/io'
import { IoIosCheckmarkCircle } from 'react-icons/io'
import { IoIosClose } from 'react-icons/io'
import { IoIosCloseCircle } from 'react-icons/io'
import { IoIosCloudUpload } from 'react-icons/io'
import { IoIosFlame } from 'react-icons/io'
import { IoIosHeart } from 'react-icons/io'
import { IoIosKeypad } from 'react-icons/io'
import { IoIosListBox } from 'react-icons/io'
import { IoIosLogOut } from 'react-icons/io'
import { IoIosMore } from 'react-icons/io'
import { IoIosNotifications } from 'react-icons/io'
import { IoIosPaw } from 'react-icons/io'
import { IoIosPeople } from 'react-icons/io'
import { IoIosSearch } from 'react-icons/io'
import { IoIosSettings } from 'react-icons/io'
import { IoIosStar } from 'react-icons/io'
import { IoIosStarOutline } from 'react-icons/io'
import { IoMdArrowBack } from 'react-icons/io'
import { IoMdArrowForward } from 'react-icons/io'
import { IoMdCheckmark } from 'react-icons/io'
import { IoMdClose } from 'react-icons/io'
import { IoMdCloseCircle } from 'react-icons/io'
import { IoMdGrid } from 'react-icons/io'
import { IoMdLogIn } from 'react-icons/io'
import { IoMdMusicalNote } from 'react-icons/io'
import { IoMdRefreshCircle } from 'react-icons/io'
import { IoMdSend } from 'react-icons/io'
import { IoMdStar } from 'react-icons/io'
import { IoMdStarOutline } from 'react-icons/io'
import { IoMdTrash } from 'react-icons/io'
//md
import { MdLockOutline } from 'react-icons/md'
import { MdSecurity } from 'react-icons/md'
import { MdSettingsBackupRestore } from 'react-icons/md'
//ri
import { RiUserStarLine } from 'react-icons/ri'

export const UiElements: NextPage<{}> = () => {
  return (
    <div className={styles.pageWrapper}>
      <h2>Icons</h2>

      <h3>/ai</h3>
      <ul className={styles.icons}>
        <li>
          1
          <i>
            <AiFillRead />
          </i>
        </li>
        <li>
          2
          <i>
            <AiOutlineBell />
          </i>
        </li>
        <li>
          3
          <i>
            <AiOutlineForm />
          </i>
        </li>
        <li>
          4
          <i>
            <AiOutlineRead />
          </i>
        </li>
        <li>
          5
          <i>
            <AiOutlineRotateLeft />
          </i>
        </li>
        <li>
          6
          <i>
            <AiOutlineRotateRight />
          </i>
        </li>
        <li>
          7
          <i>
            <AiOutlineTags />
          </i>
        </li>
        <li>
          8
          <i>
            <AiOutlineUserAdd />
          </i>
        </li>
        <li>
          9
          <i>
            <AiOutlineClockCircle />
          </i>
        </li>
      </ul>

      <h3>/bs</h3>
      <ul className={styles.icons}>
        <li>
          1
          <i>
            <BsArrow90DegUp />
          </i>
        </li>
        <li>
          2
          <i>
            <BsCardImage />
          </i>
        </li>
        <li>
          3
          <i>
            <BsCloudUpload />
          </i>
        </li>
        <li>
          4
          <i>
            <BsFillGridFill />
          </i>
        </li>
        <li>
          5
          <i>
            <BsFillImageFill />
          </i>
        </li>
        <li>
          6
          <i>
            <BsFillPlusSquareFill />
          </i>
        </li>
        <li>
          7
          <i>
            <BsUnlock />
          </i>
        </li>
      </ul>

      <h3>/fa</h3>
      <ul className={styles.icons}>
        <li>
          1
          <i>
            <FaEnvelopeOpenText />
          </i>
        </li>
        <li>
          2
          <i>
            <FaFacebookF />
          </i>
        </li>
        <li>
          3
          <i>
            <FaIdBadge />
          </i>
        </li>
        <li>
          4
          <i>
            <FaIdCard />
          </i>
        </li>
        <li>
          5
          <i>
            <FaRegLightbulb />
          </i>
        </li>
        <li>
          6
          <i>
            <FaRegUser />
          </i>
        </li>
        <li>
          7
          <i>
            <FaUsers />
          </i>
        </li>
        <li>
          8
          <i>
            <FaUserShield />
          </i>
        </li>
        <li>
          9
          <i>
            <FaBars />
          </i>
        </li>
        <li>
          10
          <i>
            <FaInstagram />
          </i>
        </li>
        <li>
          11
          <i>
            <FaFacebook />
          </i>
        </li>
        <li>
          12
          <i>
            <FaWhatsapp />
          </i>
        </li>
        <li>
          13
          <i>
            <FaTelegram />
          </i>
        </li>
        <li>
          14
          <i>
            <FaTwitter />
          </i>
        </li>
        <li>
          15
          <i>
            <FaGithub />
          </i>
        </li>
        <li>
          16
          <i>
            <FaRedditSquare />
          </i>
        </li>
        <li>
          17
          <i>
            <FaMedium />
          </i>
        </li>
        <li>
          18
          <i>
            <FaLinkedin />
          </i>
        </li>
        <li>
          19
          <i>
            <FaRegClock />
          </i>
        </li>
      </ul>

      <h3>/fi</h3>
      <ul className={styles.icons}>
        <li>
          1
          <i>
            <FiKey />
          </i>
        </li>
        <li>
          2
          <i>
            <FiUsers />
          </i>
        </li>
      </ul>

      <h3>/go</h3>
      <ul className={styles.icons}>
        <li>
          1
          <i>
            <GoChevronLeft />
          </i>
        </li>
        <li>
          2
          <i>
            <GoChevronRight />
          </i>
        </li>
        <li>
          3
          <i>
            <GoPlus />
          </i>
        </li>
        <li>
          4
          <i>
            <GoSettings />
          </i>
        </li>
      </ul>

      <h3>/io</h3>
      <ul className={styles.icons}>
        <li>
          1
          <i>
            <IoIosAddCircle />
          </i>
        </li>
        <li>
          2
          <i>
            <IoIosAirplane />
          </i>
        </li>
        <li>
          3
          <i>
            <IoIosArrowDown />
          </i>
        </li>
        <li>
          4
          <i>
            <IoIosArrowDropright />
          </i>
        </li>
        <li>
          5
          <i>
            <IoIosArrowRoundForward />
          </i>
        </li>
        <li>
          6
          <i>
            <IoIosCheckbox />
          </i>
        </li>
        <li>
          7
          <i>
            <IoIosCheckmarkCircle />
          </i>
        </li>
        <li>
          8
          <i>
            <IoIosClose />
          </i>
        </li>
        <li>
          9
          <i>
            <IoIosCloseCircle />
          </i>
        </li>
        <li>
          10
          <i>
            <IoIosCloudUpload />
          </i>
        </li>
        <li>
          11
          <i>
            <IoIosFlame />
          </i>
        </li>
        <li>
          12
          <i>
            <IoIosHeart />
          </i>
        </li>
        <li>
          13
          <i>
            <IoIosKeypad />
          </i>
        </li>
        <li>
          14
          <i>
            <IoIosListBox />
          </i>
        </li>
        <li>
          15
          <i>
            <IoIosLogOut />
          </i>
        </li>
        <li>
          16
          <i>
            <IoIosMore />
          </i>
        </li>
        <li>
          17
          <i>
            <IoIosNotifications />
          </i>
        </li>
        <li>
          18
          <i>
            <IoIosPaw />
          </i>
        </li>
        <li>
          19
          <i>
            <IoIosPeople />
          </i>
        </li>
        <li>
          20
          <i>
            <IoIosSearch />
          </i>
        </li>
        <li>
          21
          <i>
            <IoIosSettings />
          </i>
        </li>
        <li>
          22
          <i>
            <IoIosStar />
          </i>
        </li>
        <li>
          23
          <i>
            <IoIosStarOutline />
          </i>
        </li>
        <li>
          24
          <i>
            <IoMdArrowBack />
          </i>
        </li>
        <li>
          25
          <i>
            <IoMdArrowForward />
          </i>
        </li>
        <li>
          26
          <i>
            <IoMdCheckmark />
          </i>
        </li>
        <li>
          27
          <i>
            <IoMdClose />
          </i>
        </li>
        <li>
          28
          <i>
            <IoMdCloseCircle />
          </i>
        </li>
        <li>
          29
          <i>
            <IoMdGrid />
          </i>
        </li>
        <li>
          30
          <i>
            <IoMdLogIn />
          </i>
        </li>
        <li>
          31
          <i>
            <IoMdMusicalNote />
          </i>
        </li>
        <li>
          32
          <i>
            <IoMdRefreshCircle />
          </i>
        </li>
        <li>
          33
          <i>
            <IoMdSend />
          </i>
        </li>
        <li>
          34
          <i>
            <IoMdStar />
          </i>
        </li>
        <li>
          35
          <i>
            <IoMdStarOutline />
          </i>
        </li>
        <li>
          36
          <i>
            <IoMdTrash />
          </i>
        </li>
      </ul>

      <h3>/md</h3>
      <ul className={styles.icons}>
        <li>
          1
          <i>
            <MdLockOutline />
          </i>
        </li>
        <li>
          2
          <i>
            <MdSecurity />
          </i>
        </li>
        <li>
          3
          <i>
            <MdSettingsBackupRestore />
          </i>
        </li>
      </ul>

      <h3>/ri</h3>
      <ul className={styles.icons}>
        <li>
          1
          <i>
            <RiUserStarLine />
          </i>
        </li>
      </ul>

      <h2>Buttons</h2>
      <div className={styles.buttons}>
        <Button additionalStyles={cx(styles.btnColors, styles.one)}>
          Button
        </Button>
        <Button additionalStyles={cx(styles.btnColors, styles.two)}>
          Button
        </Button>
        <Button additionalStyles={cx(styles.btnColors, styles.three)}>
          Button
        </Button>
        <Button additionalStyles={cx(styles.btnColors, styles.four)}>
          Button
        </Button>
        <Button additionalStyles={cx(styles.btnColors, styles.five)}>
          Button
        </Button>
        <Button additionalStyles={cx(styles.btnColors, styles.six)}>
          Button
        </Button>
      </div>
    </div>
  )
}

UiElements.getInitialProps = () => {
  return Promise.resolve({ namespacesRequired: ['groupMembers'] })
}

export default UiElements
