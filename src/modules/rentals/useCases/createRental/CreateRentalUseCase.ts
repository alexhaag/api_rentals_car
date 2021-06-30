import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { inject, injectable } from "tsyringe";

import { AppError } from "@shared/errors/AppError";

import { Rental } from "@modules/rentals/infra/typeorm/entities/Rental";
import { IRentalsRepository } from "@modules/rentals/repositories/IRentalsRepository";

import { ICarsRepository } from "@modules/cars/repositories/ICarsRepository";

import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";


dayjs.extend(utc);
interface IRequest {
  user_id: string;
  car_id: string;
  expected_return_date: Date;
}

@injectable()
class CreateRentalUseCase {

  constructor(
    @inject("RentalsRepository")
    private rentalsRepository: IRentalsRepository,
    @inject("DayjsDateProvider")
    private dateProvider: IDateProvider,
    @inject("CarsRepository")
    private carsRepository: ICarsRepository
  ) { }

  async execute({
    user_id,
    car_id,
    expected_return_date
  }: IRequest): Promise<Rental> {
    //Nao deve ser possivel cadastrar um novo aluguel caso já exista um aberto para o mesmo carro.

    const minimumHour = 24;

    const carUnAvailable = await this.rentalsRepository.findOpenRentalByCar(car_id);

    if (carUnAvailable) {
      throw new AppError("Carro não está disponivel.")
    }
    //Não deve ser possível cadastrar um novo aluguel caso já exista um aberto para o mesmo usuário.
    const rentalOpenToUser = await this.rentalsRepository.findOpenRentalByUser(user_id);

    if (rentalOpenToUser) {
      throw new AppError("Há uma locação em andamento para o usuário.")
    }

    const dateNow = this.dateProvider.dateNow();

    //O aluguel deve ter duração de 24 horas

    const compare = this.dateProvider.compareInHours(
      dateNow,
      expected_return_date
    );

    if (compare < minimumHour) {
      throw new AppError("Tempo de retorno inválido!");
    }

    const rental = await this.rentalsRepository.create({
      user_id,
      car_id,
      expected_return_date,
    });

    await this.carsRepository.updateAvailable(car_id, false);

    return rental;
  }
}

export { CreateRentalUseCase }