import { authMiddlewares } from '@/middlewares/auth'
import { createRoute } from 'honox/factory'

export default createRoute(
  authMiddlewares.signInWithGoogle,
  authMiddlewares.afterSignInWithGoogle,
  (c) => c.redirect('/'),
)
