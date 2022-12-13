interface StateProps {
  toggler: boolean
  type?: string
}

export const INITIAL_STATE: StateProps = {
  toggler: true,
}

const reducer = (state: StateProps, action: StateProps) => {
  switch (action.type) {
    case 'TOGGLE':
      return {
        toggler: !state.toggler,
      }

    default:
      return state
  }
}

export default reducer
