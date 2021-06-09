import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarsRepositoryInMemory";
import { CreateCarUseCase } from "./CreateCarUseCase";
import { AppError } from "@shared/errors/AppError";

let createCarUseCase: CreateCarUseCase;
let carsRepositoryInMemory: CarsRepositoryInMemory;

describe("Criar Carro", () => {

  beforeEach(() => {
    carsRepositoryInMemory = new CarsRepositoryInMemory();
    createCarUseCase = new CreateCarUseCase(carsRepositoryInMemory);
  });

  it("deveria criar um novo carro.", async () => {

    const car = await createCarUseCase.execute({
      name: "Car 1",
      description: "Description Car",
      daily_rate: 100,
      license_plate: "ABC-1234",
      fine_amount: 60,
      brand: "Brand",
      category_id: "category",
    });

    expect(car).toHaveProperty("id");
  });

  it("Não deve criar um carro novo se já existe uma placa (license_plate)", () => {

    expect(async () => {
      await createCarUseCase.execute({
        name: "Car 1",
        description: "Description Car 2",
        daily_rate: 100,
        license_plate: "ABC-1234",
        fine_amount: 60,
        brand: "Brand",
        category_id: "category",
      });

      await createCarUseCase.execute({
        name: "Car 2",
        description: "Description Car 2",
        daily_rate: 100,
        license_plate: "ABC-1234",
        fine_amount: 60,
        brand: "Brand",
        category_id: "category",
      });

    }).rejects.toBeInstanceOf(AppError);

  });

  it("Não deve ser possivel criar um carro como available true por padrão.", async () => {

    const car = await createCarUseCase.execute({
      name: "Car 1",
      description: "Description Car 2",
      daily_rate: 100,
      license_plate: "ABC-1234",
      fine_amount: 60,
      brand: "Brand",
      category_id: "category",
    });
    console.log(car);
    expect(car.available).toBe(true);

  });
});