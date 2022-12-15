import Navigation from './Navigation'
import Footer from './Footer'
import { ReactNode, useReducer } from 'react'
import Meta from './Meta'
import reducer, { INITIAL_STATE } from '../hook/useReducer'
import SideBar from './SideBar'

type Props = {
  children: ReactNode
}

const Layout: React.FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE)

  const toggle = () => {
    dispatch({ type: 'TOGGLE' })
  }

  return (
    <div>
      <Meta />
      <Navigation toggle={toggle} />
      <div className="d-flex justify-content-between">
        {state.toggler && <SideBar />}

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
