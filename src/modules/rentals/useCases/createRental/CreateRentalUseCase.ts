import { AppError } from "@shared/errors/AppError";
import { IRentalsRepository } from "@modules/rentals/repositories/IRentalsRepository";
import { Rental } from "@modules/rentals/infra/typeorm/entities/Rental";

interface IRequest {
  user_id: string;
  car_id: string;
  expected_return_date: Date;
}

class CreateRentalUseCase {

  constructor(
    private rentalsRepository: IRentalsRepository
  ) { }

  async execute({
    user_id,
    car_id,
    expected_return_date
  }: IRequest): Promise<Rental> {
    //Nao deve ser possivel cadastrar um novo aluguel caso já exista um aberto para o mesmo carro.
    const carUnAvailable = await this.rentalsRepository.findOpenRentalByCar(car_id);

    if (carUnAvailable) {
      throw new AppError("Carro não está disponivel.")
    }
    //Não deve ser possível cadastrar um novo aluguel caso já exista um aberto para o mesmo usuário.
    const rentalOpenToUser = await this.rentalsRepository.findOpenRentalByUser(user_id);

    if (rentalOpenToUser) {
      throw new AppError("Há uma locação em andamento para o usuário.")
    }

    //O aluguel deve ter duração de 24 horas

    const rental = await this.rentalsRepository.create({
      user_id,
      car_id,
      expected_return_date,
    });

    return rental;
  }
}

export { CreateRentalUseCase }