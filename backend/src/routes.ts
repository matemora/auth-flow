import { Router } from "express";
import UserController from "./controllers/UserController";

const routes = Router();

routes.post('/signup', UserController.signup);
routes.post('/signin', UserController.signin);
routes.get('/content', UserController.content);

export default routes;