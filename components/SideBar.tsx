import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { FaHome, FaUserCog } from 'react-icons/fa'
import apiHook from '../api'
import { userInfo } from '../api/api'
import { IClientPermission } from '../models/ClientPermission'

const SideBar = () => {
  const [show, setShow] = useState(null)
  const router = useRouter()

  useEffect(() => {
    typeof document !== 'undefined' && setShow(userInfo().userInfo)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router])

  const menus = () => {
    let dropdownItems = userInfo()?.userInfo?.routes?.map(
      (route: IClientPermission) => ({
        menu: route.menu,
        sort: route.sort,
      })
    )
    dropdownItems = dropdownItems?.filter(
      (item: IClientPermission) => item?.menu !== 'profile'
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getApi = apiHook({
    key: ['organization'],
    method: 'GET',
    url: `organization`,
  })?.get

  const menuIcon = (menu: string) => {
    switch (menu) {
      case 'admin':
        return (
          <span className="text-muted">
            <FaUserCog className="fs-5 mb-1" />{' '}
            {menu.charAt(0).toUpperCase() + menu.substring(1)}
          </span>
        )
      case 'Home':
        return (
          <span className="text-muted">
            <FaHome className="fs-5 mb-1" />{' '}
            {menu.charAt(0).toUpperCase() + menu.substring(1)}
          </span>
        )

      default:
        return menu.charAt(0).toUpperCase() + menu.substring(1)
    }
  }

  const authItems = () => {
    return (
      <ul className="nav flex-column">
        {menus()?.menuItems?.map(
          (menu: IClientPermission, index: number) =>
            menu.menu === 'normal' && (
              <li key={index} className="nav-item">
                <Link href={menu.path} className="nav-link" aria-current="page">
                  {/* {menu.name} */}
                  {menuIcon(menu?.name)}
                </Link>
              </li>
            )
        )}

        {menus()?.uniqueDropdowns?.map(
          (item: IClientPermission, index: number) => (
            <li key={index} className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                id="navbarDropdownMenuLink"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {menuIcon(item?.menu)}
              </a>
              <ul
                className="dropdown-menu border-0"
                aria-labelledby="navbarDropdownMenuLink"
              >
                {menus() &&
                  menus().menuItems.map(
                    (menu: IClientPermission, index: number) =>
                      menu.menu === item?.menu && (
                        <li key={index}>
                          <Link href={menu.path} className="dropdown-item">
                            {menu.name}
                          </Link>
                        </li>
                      )
                  )}
              </ul>
            </li>
          )
        )}
      </ul>
    )
  }

  return (
    <div
      className="bg-white  position-fixed h-100"
      style={{
        minWidth: 220,
        top: 55,
      }}
    >
      <div className="p-3" style={{ maxWidth: 220 }}>
        <div className="rounded-pill text-center">
          <Link href="/">
            {getApi?.data?.image ? (
              <Image
                priority
                width={100}
                height={100}
                src={getApi?.data?.image}
                className="img-fluid rounded-pill shadow p-3 border border-primary"
                alt="logo"
                style={{ objectFit: 'cover' }}
              />
            ) : (
              <Image
                priority
                width={100}
                height={100}
                src="/favicon.png"
                className="img-fluid rounded-pill shadow p-3 border border-primary"
                style={{ objectFit: 'cover' }}
                alt="logo"
              />
            )}
          </Link>
        </div>
        <h1 className="text-wrap text-center fs-6 fw-bold text-uppercase my-1 font-monospace text-primary">
          {getApi?.data?.name?.slice(0, 50) ||
            `Education Management Information System (EMIS)`}
        </h1>
        <hr />
      </div>

      {show && authItems()}
    </div>
  )
}

export default SideBar
