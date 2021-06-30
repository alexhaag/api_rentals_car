import dayjs from "dayjs";
import { AppError } from "@shared/errors/AppError";

import { DayjsDateProvider } from "@shared/container/providers/DateProvider/implementations/DayjsDateProvider";

import { RentalsRepositoryInMemory } from "@modules/rentals/repositories/in-memory/RentalsRepositoryInMemory";

import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarsRepositoryInMemory";

import { CreateRentalUseCase } from "./CreateRentalUseCase"



let createRentalUseCase: CreateRentalUseCase;
let rentalsRepositoryInMemory: RentalsRepositoryInMemory;
let carsRepositoryInMemory: CarsRepositoryInMemory;
let dayjsDateProvider: DayjsDateProvider;

describe("Crie Aluguel", () => {
  const dayAdd24hours = dayjs().add(1, "day").toDate();

  beforeEach(() => {
    rentalsRepositoryInMemory = new RentalsRepositoryInMemory();
    carsRepositoryInMemory = new CarsRepositoryInMemory();
    dayjsDateProvider = new DayjsDateProvider();
    createRentalUseCase = new CreateRentalUseCase(
      rentalsRepositoryInMemory,
      dayjsDateProvider,
      carsRepositoryInMemory
    );
  });

  it("Deve ser capaz de criar um novo aluguel.", async () => {

    const car = await carsRepositoryInMemory.create({
      name: "Teste",
      description: "Car Test",
      daily_rate: 100,
      license_plate: "test",
      fine_amount: 40,
      category_id: "1234",
      brand: "brand"
    });

    const rental = await createRentalUseCase.execute({
      user_id: "12345",
      car_id: car.id,
      expected_return_date: dayAdd24hours,
    });

    expect(rental).toHaveProperty("id");
    expect(rental).toHaveProperty("start_date");


  });

  it("Não deve ser capaz de criar um novo aluguel se houver outro aberto para o mesmo usuário.", async () => {

    expect(async () => {
      await createRentalUseCase.execute({
        user_id: "12345",
        car_id: "id_car",
        expected_return_date: dayAdd24hours,
      });

      await createRentalUseCase.execute({
        user_id: "12345",
        car_id: "outro_id_car",
        expected_return_date: dayAdd24hours,
      });

    }).rejects.toBeInstanceOf(AppError);

  });


  it("Não deve ser capaz de criar um novo aluguel se houver outro aberto para o mesmo carro.", async () => {

    expect(async () => {
      await createRentalUseCase.execute({
        user_id: "123",
        car_id: "121212",
        expected_return_date: dayAdd24hours,
      });

      const rental = await createRentalUseCase.execute({
        user_id: "321",
        car_id: "121212",
        expected_return_date: dayAdd24hours,
      });

    }).rejects.toBeInstanceOf(AppError);
  });

  it("Não deve ser capaz de criar um novo aluguel com tempo de devolução inválido. Ou seja, menor 24 horas.", async () => {

    expect(async () => {
      await createRentalUseCase.execute({
        user_id: "123",
        car_id: "121212",
        expected_return_date: dayjs().toDate(),
      });
    }).rejects.toBeInstanceOf(AppError);
  });

});