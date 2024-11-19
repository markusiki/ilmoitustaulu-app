import config from './config'
import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { CustomHttpRequest } from '../interfaces'



export const checkTrailingSlash = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.originalUrl.endsWith('/')) {
    res.redirect(301, req.originalUrl + '/')
    return
  }
  next()
}


const tokenExtractor = (req: CustomHttpRequest) => {
  const cookies = req.headers.cookie?.split(',')
  if (cookies) {
    for (const cookie of cookies) {
      if (cookie.startsWith('access_token=')) {
        const token = cookie.slice(13)
        return token
      }
    }
  }
}

export const authorizeConnection = (req: CustomHttpRequest) => {
  const token = tokenExtractor(req)
  if (!token) {
    return false
  }
  try {
    const decoded = jwt.verify(token, config.SECRET!)
      ; (req as CustomHttpRequest).user = decoded
    return true
  } catch (error) {
    return false
  }
}