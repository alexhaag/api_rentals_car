import { AppError } from "@shared/errors/AppError";
import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";
import { UsersRepository } from "@modules/accounts/infra/typeorm/repositories/UsersRepository";

interface IPayload {
  sub: string;
}

export async function ensureAuthenticated(request: Request, response: Response, next: NextFunction) {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new AppError("Ausência de Token.", 401);
  }

  //Bearer <token>
  const [, token] = authHeader.split(" ");
  try {
    const { sub: user_id } = verify(token, "dexmeninodeouro") as IPayload;

    const usersRepository = new UsersRepository();
    const user = usersRepository.findById(user_id);

    if (!user) {
      throw new AppError("Usuário não existe!", 401);
    }

    request.user = {
      id: user_id
    }

    next();

  } catch {
    throw new AppError("Token inválido", 401);
  }
}