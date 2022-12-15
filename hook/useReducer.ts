interface StateProps {
  toggler?: boolean
  isAuth?: any
  type?: string
}

export const userInfo = () => {
  return {
    userInfo:
      typeof window !== 'undefined' && localStorage.getItem('userInfo')
        ? JSON.parse(
            typeof window !== 'undefined' &&
              (localStorage.getItem('userInfo') as string | any)
          )
        : null,
  }
}

export const INITIAL_STATE: StateProps = {
  toggler: true,
  isAuth: userInfo()?.userInfo,
}

const reducer = (state: StateProps, action: StateProps) => {
  switch (action.type) {
    case 'TOGGLE':
      return {
        toggler: !state.toggler,
      }
    case 'SHOW':
      return {
        toggler: true,
        isAuth: userInfo().userInfo,
      }
    case 'HIDE':
      return {
        toggler: false,
        isAuth: null,
      }

    default:
      return state
  }
}

export default reducer
