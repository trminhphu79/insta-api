import { Express } from "express"
import { usersRouters } from "./user.routes"

export const initializeRoutes = async (app: Express) => {
    await app.use('/', usersRouters())
}