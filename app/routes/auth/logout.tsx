import { authMiddlewares } from '@/middlewares/auth'
import { createRoute } from 'honox/factory'

export default createRoute(authMiddlewares.signOut, (c) => c.redirect('/'))
