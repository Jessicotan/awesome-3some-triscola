import { Elysia } from 'elysia'
import { helloSocket } from './hello'

export const socketRoutes = new Elysia({ name: 'socket-routes' }).use(helloSocket)
