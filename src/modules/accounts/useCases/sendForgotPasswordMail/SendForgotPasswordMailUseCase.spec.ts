
import { UsersTokensRepository } from "@modules/accounts/infra/typeorm/repositories/UsersTokenRepository";
import { UsersRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UsersRepositoryInMemory";
import { UsersTokensRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UsersTokensRepositoryInMemory";
import { DayjsDateProvider } from "@shared/container/providers/DateProvider/implementations/DayjsDateProvider";
import { MailProviderInMemory } from "@shared/container/providers/MailProvider/implementations/in-memory/MailProviderInMemory";
import { SendForgotPasswordMailUseCase } from "./SendForgotPasswordMailUseCase"
import { AppError } from "@shared/errors/AppError";


let sendForgotPasswordMailUseCase: SendForgotPasswordMailUseCase;
let usersRepositoryInMemory: UsersRepositoryInMemory;
let dateProvider: DayjsDateProvider;
let usersTokensRepositoryInMemory: UsersTokensRepository;
let mailProvider: MailProviderInMemory;



describe("Enviar esqueci senha - Email", () => {

  beforeEach(() => {

    usersRepositoryInMemory: new UsersRepositoryInMemory();
    dateProvider: new DayjsDateProvider();
    usersTokensRepositoryInMemory: new UsersTokensRepositoryInMemory();
    mailProvider: new MailProviderInMemory();

    sendForgotPasswordMailUseCase: new SendForgotPasswordMailUseCase(
      usersRepositoryInMemory,
      usersTokensRepositoryInMemory,
      dateProvider,
      mailProvider
    );
  });

  it("Deve ser capaz de enviar um e-mail de senha esquecida para o usuário", async () => {

    const sendMail = spyOn(mailProvider, "sendMail");

    await usersRepositoryInMemory.create({
      driver_license: "381777",
      email: "kifo@uwi.pl",
      name: "Teresa Bowman",
      password: "1234"
    });

    await sendForgotPasswordMailUseCase.execute("kifo@uwi.pl");
    expect(sendMail).toHaveBeenCalled();
  });

  it("Não deve ser capaz de enviar um e-mail se o usuário não existir ", async () => {
    await expect(
      sendForgotPasswordMailUseCase.execute("test@ka.gr")).rejects.toEqual(new AppError("Usuário não existe!"));
  });

  it("Deve ser capaz de criar um token de usuário", async () => {
    const generateTokenMail = spyOn(usersTokensRepositoryInMemory, "create");

    await usersRepositoryInMemory.create({
      driver_license: "805924",
      email: "idbazmo@pimjab.se",
      name: "Clifford Rios",
      password: "1234"
    });

    await sendForgotPasswordMailUseCase.execute("idbazmo@pimjab.se");
    expect(generateTokenMail).toBeCalled();
  });


});
