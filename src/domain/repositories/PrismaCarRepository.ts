import { inject, injectable } from "inversify";
import { PrismaClient } from "@prisma/client";

import { ICarRepository } from "./ICarRepository";
import { Car } from "../entities/Car";

@injectable()
export class PrismaCarRepository implements ICarRepository {
  constructor(
    @inject("PrismaClient")
    private readonly prisma: PrismaClient
  ) {}

  async FindById(id: string): Promise<Car | undefined> {
    const carData = await this.prisma.car.findUnique({
      where: { id },
    });

    if (!carData) {
      return undefined;
    }

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
    await this.prisma.car.update({
      where: { id },
      data: { available },
    });
  }
}