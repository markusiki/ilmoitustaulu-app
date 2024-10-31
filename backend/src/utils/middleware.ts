import config from './config'
import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

export interface CustomRequest extends Request {
  user: string | jwt.JwtPayload
}

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

export const authorization = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token: string = req.cookies.acces_token

  if (!token) {
    res.status(401).json({
      error: 'token missing'
    })
    return
  }
  try {
    const decoded = jwt.verify(token, config.SECRET!)
    ;(req as CustomRequest).user = decoded
    next()
  } catch (error) {
    res.status(401).json({ error: 'invalid token' })
    return
  }
}
