import Navigation from './Navigation'
import Footer from './Footer'
import { ReactNode, useEffect, useReducer } from 'react'
import Meta from './Meta'

import reducer, { INITIAL_STATE } from '../pages/hook/useReducer'
import { IClientPermission } from '../models/ClientPermission'
import { userInfo } from '../api/api'
import Link from 'next/link'

type Props = {
  children: ReactNode
}

const Layout: React.FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE)

  const toggle = () => {
    dispatch({ type: 'TOGGLE' } as {
      toggler: boolean
      type?: string
    })
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
        <ul className="nav flex-column ">
          {menus()?.menuItems?.map(
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
                  {item?.menu === 'profile'
                    ? userInfo()?.userInfo?.name
                    : item?.menu.charAt(0).toUpperCase() +
                      item?.menu.substring(1)}
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
      </>
    )
  }

  return (
    <div>
      <Meta />
      <Navigation toggle={toggle} />
      <div className="d-flex justify-content-between">
        {state.toggler && (
          <div
            className="bg-white ps-5s position-fixed h-100"
            style={{
              minWidth: 220,
              top: 55,
            }}
          >
            {userInfo()?.userInfo && authItems()}
          </div>
        )}

        <main
          className="container mt-5 py-4"
          style={{
            minHeight: 'calc(100vh - 110px)',
            marginLeft: state.toggler ? 220 : 'auto',
          }}
        >
          {children}
        </main>
      </div>
      <Footer />
    </div>
  )
}

export default Layout
