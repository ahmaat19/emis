import React, { useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { FaSignInAlt, FaPowerOff, FaBars, FaUser } from 'react-icons/fa'
import { userInfo } from '../api/api'
import { IClientPermission } from '../models/ClientPermission'

const Logout = () => {
  typeof window !== undefined && localStorage.removeItem('userRole')
  return typeof window !== undefined && localStorage.removeItem('userInfo')
}

const Navigation = ({ toggle }: { toggle: () => void }) => {
  const logoutHandler = () => {
    Logout()
  }

  const guestItems = () => {
    return (
      <>
        <ul className="navbar-nav ms-auto">
          <li className="nav-item">
            <Link href="/auth/login" className="nav-link" aria-current="page">
              <FaSignInAlt className="mb-1" /> Login
            </Link>
          </li>
        </ul>
      </>
    )
  }

  const menus = () => {
    const dropdownItems = userInfo()?.userInfo?.routes?.map(
      (route: IClientPermission) => ({
        menu: route.menu,
        sort: route.sort,
      })
    )

    const menuItems = userInfo()?.userInfo?.routes?.map(
      (route: IClientPermission) => route
    )

    const dropdownArray = dropdownItems?.filter(
      (item: IClientPermission) =>
        item?.menu !== 'hidden' && item?.menu !== 'normal'
    )

    const uniqueDropdowns = dropdownArray?.reduce((a: any[], b: any) => {
      const i = a.findIndex((x: IClientPermission) => x.menu === b.menu)
      return (
        i === -1 ? a.push({ menu: b.menu, ...b, times: 1 }) : a[i].times++, a
      )
    }, [])

    return {
      uniqueDropdowns: uniqueDropdowns?.sort(
        (a: { sort: number }, b: { sort: number }) => b?.sort - a?.sort
      ),
      menuItems: menuItems?.sort(
        (a: { sort: number }, b: { sort: number }) => b?.sort - a?.sort
      ),
    }
  }

  useEffect(() => {
    menus()
  }, [])

  const authItems = () => {
    return (
      <>
        <ul className="navbar-nav ms-auto">
          {/* {menus()?.menuItems?.map(
            (menu: IClientPermission, index: number) =>
              menu.menu === 'normal' && (
                <li key={index} className="nav-item">
                  <Link
                    href={menu.path}
                    className="nav-link"
                    aria-current="page"
                  >
                    {menu.name}
                  </Link>
                </li>
              )
          )} */}

          <li className="nav-item dropdown profile-dropdown">
            <a
              className="nav-link dropdown-toggle"
              href="#"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <Image
                src="https://github.com/ahmaat19.png"
                alt="Ahmed"
                className="rounded-pill me-1"
                width={30}
                height={30}
              />
              {userInfo()?.userInfo?.name}
            </a>
            <ul className="dropdown-menu border-0">
              <li>
                <Link
                  href="/account/profile"
                  className="dropdown-item"
                  aria-current="page"
                >
                  <FaUser className="mb-1" /> {userInfo()?.userInfo?.name}
                </Link>
              </li>
              <li>
                <Link
                  href="/auth/login"
                  className="dropdown-item"
                  aria-current="page"
                  onClick={logoutHandler}
                >
                  <FaPowerOff className="mb-1" /> Logout
                </Link>
              </li>
            </ul>
          </li>
        </ul>
      </>
    )
  }

  return (
    <nav
      className="navbar navbar-expand-md navbar-light bg-light position-fixed w-100"
      style={{ minHeight: 55, zIndex: 1 }}
    >
      <div className="container-fluid">
        <FaBars onClick={toggle} className="fs-5 ms-1s" />

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          {userInfo()?.userInfo ? authItems() : guestItems()}
        </div>
      </div>
    </nav>
  )
}

export default dynamic(() => Promise.resolve(Navigation), { ssr: false })
