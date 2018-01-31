// @flow
/* eslint-disable no-undef */
import { serialize, parse } from 'cookie'

export type Cookie = {|
  +token: string,
  +userId: string,
|}

const tokenKey = 'este_auth_token'
const userIdKey = 'este_user_id'

export const setCookie = (cookie: Cookie) => {
  const options = {
    maxAge: 30 * 24 * 60 * 60, // One month, it's graph.cool default.
    path: '/',
  }

  document.cookie = serialize(tokenKey, cookie.token, options)
  document.cookie = serialize(userIdKey, cookie.userId, options)
}

export const deleteCookie = () => {
  const options = {
    maxAge: -1, // Expire the cookie immediately.
    path: '/',
  }

  document.cookie = serialize(tokenKey, '', options)
  document.cookie = serialize(userIdKey, '', options)
}

export const getCookie = (serverReq: ?Object): ?Cookie => {
  const cookie = parse(
    serverReq
      ? (serverReq.headers && serverReq.headers.cookie) || ''
      : document.cookie,
  )
  if (!cookie || !cookie[tokenKey] || !cookie[userIdKey]) {
    return null
  }
  return { token: cookie[tokenKey], userId: cookie[userIdKey] }
}
