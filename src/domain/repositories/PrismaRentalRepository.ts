import { inject, injectable } from "inversify";
import { PrismaClient } from "@prisma/client";

import { IRentalRepository } from "../../domain/repositories/IRentalRepository";
import { Rental } from "../../domain/entities/Rental";

@injectable()
export class PrismaRentalRepository implements IRentalRepository {
  constructor(
    @inject("PrismaClient")
    private readonly prisma: PrismaClient
  ) {}

  async findOpenRentalByUserId(
    userId: string
  ): Promise<Rental | undefined> {
    const rentalData = await this.prisma.rental.findFirst({
      where: {
        userId,
        endDate: {
          gt: new Date(),
        },
      },
      orderBy: { endDate: "desc" },
    });

    if (!rentalData) {
      return undefined;
    }

    return new Rental(
      rentalData.id,
      rentalData.userId,
      rentalData.carId,
      rentalData.startDate,
      rentalData.endDate
    );
  }

  async create(rental: Rental): Promise<void> {
    await this.prisma.rental.create({
      data: {
        id: rental.id,
        userId: rental.userId,
        carId: rental.carId,
        startDate: rental.startDate,
        endDate: rental.endDate,
      },
    });
  }
}