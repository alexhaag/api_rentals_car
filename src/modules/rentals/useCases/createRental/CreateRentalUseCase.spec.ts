import { AppError } from "@shared/errors/AppError";

import { RentalsRepositoryInMemory } from "@modules/rentals/repositories/in-memory/RentalsRepositoryInMemory";
import { CreateRentalUseCase } from "./CreateRentalUseCase"

let createRentalUseCase: CreateRentalUseCase;
let rentalsRepositoryInMemory: RentalsRepositoryInMemory;

describe("Crie Aluguel", () => {
  beforeEach(() => {
    rentalsRepositoryInMemory = new RentalsRepositoryInMemory();
    createRentalUseCase = new CreateRentalUseCase(rentalsRepositoryInMemory);
  });

  it("Deve ser capaz de criar um novo aluguel.", async () => {
    const rental = await createRentalUseCase.execute({
      user_id: "12345",
      car_id: "121212",
      expected_return_date: new Date(),
    });

    expect(rental).toHaveProperty("id");
    expect(rental).toHaveProperty("start_date");


  });

  it("Não deve ser capaz de criar um novo aluguel se houver outro aberto para o mesmo usuário.", async () => {

    expect(async () => {
      await createRentalUseCase.execute({
        user_id: "12345",
        car_id: "id_car",
        expected_return_date: new Date(),
      });

      await createRentalUseCase.execute({
        user_id: "12345",
        car_id: "outro_id_car",
        expected_return_date: new Date(),
      });

    }).rejects.toBeInstanceOf(AppError);

  });


  it("Não deve ser capaz de criar um novo aluguel se houver outro aberto para o mesmo carro.", async () => {

    expect(async () => {
      await createRentalUseCase.execute({
        user_id: "123",
        car_id: "121212",
        expected_return_date: new Date(),
      });

      const rental = await createRentalUseCase.execute({
        user_id: "321",
        car_id: "121212",
        expected_return_date: new Date(),
      });

    }).rejects.toBeInstanceOf(AppError);
  });

});