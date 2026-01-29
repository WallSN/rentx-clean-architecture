import { Container } from "inversify";
import { TYPES } from "../container/types";

// Interfaces
import { ICarRepository } from "../../domain/repositories/ICarRepository";
import { IRentalRepository } from "../../domain/repositories/IRentalRepository";

// Implementações concretas
import { PrismaCarRepository } from "../database/prisma/PrismaCarRepository";
import { PrismaRentalRepository } from "../database/prisma/PrismaRentalRepository";

// Use Cases
// (também precisam ser injetáveis se forem resolvidos via container)
import { CreateRentalUseCase } from "../../application/useCases/createRental/CreateRentalUseCase";

const container = new Container();

// Configuração dos binds
container
  .bind<ICarRepository>(TYPES.ICarRepository)
  .to(PrismaCarRepository);

container
  .bind<IRentalRepository>(TYPES.IRentalRepository)
  .to(PrismaRentalRepository);

container
  .bind<CreateRentalUseCase>(CreateRentalUseCase)
  .toSelf();

export { container };