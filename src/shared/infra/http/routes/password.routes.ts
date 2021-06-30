import { Router } from "express";
const passwordRoutes = Router();

import { SendForgotPasswordMailController } from "@modules/accounts/useCases/sendForgotPasswordMail/SendForgotPasswordMailController";

import { ResetPasswordUserController } from "@modules/accounts/useCases/resetPasswordUser/ResetPasswordUserController";




const sendForgotPasswordMailController = new
  SendForgotPasswordMailController();

const resetPasswordUserController = new ResetPasswordUserController();


passwordRoutes.post('/forgot', sendForgotPasswordMailController.handle);
passwordRoutes.post('/reset', resetPasswordUserController.handle);


export { passwordRoutes }