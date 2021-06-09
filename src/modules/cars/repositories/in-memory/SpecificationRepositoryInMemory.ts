import { Specification } from "@modules/cars/infra/typeorm/entities/Specification";
import { ICreateSpecificationDTO, ISpecificationsRepository } from "../ISpecificationsRepository";


class SpecificationRepositoryInMemory implements ISpecificationsRepository {
  specification: Specification[] = []

  async create({ description, name }: ICreateSpecificationDTO): Promise<Specification> {
    const specification = new Specification();
    Object.assign(specification, {
      description,
      name,
    });

    this.specification.push(specification);

    return specification;
  }
  async findByName(name: string): Promise<Specification> {
    return this.specification.find((specification) => specification.name === name);
  }
  async findByIds(ids: string[]): Promise<Specification[]> {
    const allSpecification = this.specification.filter(specification => ids.includes(specification.id));
    return allSpecification;
  }
}

export { SpecificationRepositoryInMemory }