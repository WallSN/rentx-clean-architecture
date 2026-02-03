import "reflect-metadata";

import { Container } from "inversify";
import { TYPES } from "../../types";

// Interfaces
import { ICarRepository } from "../../domain/repositories/ICarRepository";
import { IRentalRepository } from "../../domain/repositories/IRentalRepository";

// Implementações Concretas
import { PrismaCarRepository } from "../database/prisma/PrismaCarRepository";
import { PrismaRentalRepository } from "../database/prisma/PrismaRentalRepository";

// Use Cases
import { CreateRentalUseCase } from "../../application/useCases/createRental/CreateRentalUseCase";

const container = new Container();

// Configurando os Binds
container.bind<ICarRepository>(TYPES.ICarRepository).to(PrismaCarRepository);
container.bind<IRentalRepository>(TYPES.IRentalRepository).to(PrismaRentalRepository);
container.bind<CreateRentalUseCase>(TYPES.CreateRentalUseCase).to(CreateRentalUseCase);

export { container };