import { injectable } from "inversify";
import { PrismaClient } from "@prisma/client";

import { ICarRepository } from "../../../domain/repositories/ICarRepository";
import { Car } from "../../../domain/entities/Car";

const prisma = new PrismaClient();

@injectable()
export class PrismaCarRepository implements ICarRepository
{
  async FindById(id: string): Promise<Car | undefined>
  {
    const carData = await prisma.car.findUnique({
      where: { id },
    });

    if (!carData) {
      return undefined;
    }

    // Converte o dado do Prisma para a Entidade de Domínio
    return new Car(
      carData.id,
      carData.licensePlate,
      carData.available
    );
  }

  async updateAvailableStatus(
    id: string,
    available: boolean
  ): Promise<void> {
    await prisma.car.update({
      where: { id },
      data: { available },
    });
  }
}