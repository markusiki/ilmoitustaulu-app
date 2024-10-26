import { Request, Response, NextFunction } from 'express'

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
