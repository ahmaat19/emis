import { userInfo } from '../api/api'

export const hide = (role: string[]) => {
  if (role.includes(userInfo()?.userInfo?.role)) return true

  return false
}
