import type { Request, Response, NextFunction } from 'express'

export const authorize = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.header('Authorization')?.split(/\s+/)[1]

  if (!token) {
    res.status(401).json({ message: 'Unauthorized' })
    return
  }

  next()
}