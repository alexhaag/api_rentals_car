import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarsRepositoryInMemory";
import { ListAvailableCarsUseCase } from "./ListAvailableCarsUseCase";

let listAvailableCarsUseCase: ListAvailableCarsUseCase;
let carsRepositoryInMemory: CarsRepositoryInMemory;

describe("Lista de Carros", () => {

  beforeEach(() => {
    carsRepositoryInMemory = new CarsRepositoryInMemory();
    listAvailableCarsUseCase = new ListAvailableCarsUseCase(carsRepositoryInMemory);
  });

  it("Deve ser possivel listar todos os carros disponiveis.", async () => {
    const car = await carsRepositoryInMemory.create(
      {
        "name": "Car1",
        "description": "car description",
        "daily_rate": 110.00,
        "license_plate": "DEF-1234",
        "fine_amount": 40,
        "brand": "Car_brand",
        "category_id": "category_id"
      }
    )
    const cars = await listAvailableCarsUseCase.execute({});
    expect(cars).toEqual([car]);

  });

  it("deve ser capaz de listar todos os carros disponíveis por marca (brand).", async () => {
    const car = await carsRepositoryInMemory.create(
      {
        "name": "Car2",
        "description": "car description",
        "daily_rate": 110.00,
        "license_plate": "DEF-1234",
        "fine_amount": 40,
        "brand": "Car_brand_test",
        "category_id": "category_id"
      }
    );

    const cars = await listAvailableCarsUseCase.execute({
      brand: "Car_brand_test",
    });

    expect(cars).toEqual([car]);

  });


  it("deve ser capaz de listar todos os carros disponíveis por nome (name).", async () => {
    const car = await carsRepositoryInMemory.create(
      {
        "name": "Car3",
        "description": "car description",
        "daily_rate": 110.00,
        "license_plate": "DEF-1234",
        "fine_amount": 40,
        "brand": "Car_brand_test",
        "category_id": "category_id"
      }
    );

    const cars = await listAvailableCarsUseCase.execute({
      name: "Car3",
    });

    expect(cars).toEqual([car]);

  });


  it("deve ser capaz de listar todos os carros disponíveis por categoria (category_id).", async () => {
    const car = await carsRepositoryInMemory.create(
      {
        "name": "Car4",
        "description": "car description",
        "daily_rate": 110.00,
        "license_plate": "DEF-1234",
        "fine_amount": 40,
        "brand": "Car_brand_test",
        "category_id": "12345"
      }
    );

    const cars = await listAvailableCarsUseCase.execute({
      category_id: "12345",
    });

    expect(cars).toEqual([car]);

  });

});