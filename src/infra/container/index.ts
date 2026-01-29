import "reflect-metadata";
import { Container } from "inversify";
import { PrismaClient } from "@prisma/client";

import { prisma } from "../database/prisma/client";

import { IRentalRepository } from "../../domain/repositories/IRentalRepository";
import { PrismaRentalRepository } from "../../domain/repositories/PrismaRentalRepository";

const container = new Container();

// Prisma
container
  .bind<PrismaClient>("PrismaClient")
  .toConstantValue(prisma);

// Repositórios
container
  .bind<IRentalRepository>("RentalRepository")
  .to(PrismaRentalRepository);

export { container };