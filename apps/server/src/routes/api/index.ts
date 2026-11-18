import { Elysia } from 'elysia'
import { helloRoute } from './hello'

export const apiRoutes = new Elysia({ name: 'api-routes' }).use(helloRoute)
