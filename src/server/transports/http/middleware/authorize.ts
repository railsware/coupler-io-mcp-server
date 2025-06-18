import type { Request, Response, NextFunction } from 'express'

export const authorize = (req: Request, res: Response, next: NextFunction): void => {
  // TODO: Implement authorization

  next()
}