import { createContext, useReducer, useEffect } from 'react'
import { auth } from '../utils/firebase/firebase.utils'
import { onAuthStateChanged } from 'firebase/auth'

export const UserContext = createContext()

function authReducer(state, action) {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        user: action.payload
      }
    case 'LOGOUT':
      return {
        ...state,
        user: null
      }
    case 'AUTH_IS_READY':
      return {
        user: action.payload,
        authIsReady: true
      }
    default:
      return state
  }
}

export function UserContextProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    authIsReady: false
  })

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      dispatch({ type: 'AUTH_IS_READY', payload: user })
    })

    return () => {
      unsubscribe() // unsubscribe -- stop listening (watching) for auth state changes once we get the user
    }
  }, [])

  console.log('UserContext state: >>>>>>>>>>>', state)

  return (
    <UserContext.Provider value={{ ...state, dispatch }}>
      {children}
    </UserContext.Provider>
  )
}
