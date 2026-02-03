import { injectable } from "inversify";
import { IRentalRepository } from "../../../domain/repositories/IRentalRepository";
import { Rental } from "../../../domain/entities/Rental";
import { prisma } from "./client";

@injectable()
export class PrismaRentalRepository implements IRentalRepository {
  async findOpenRentalByUserId(userId: string): Promise<Rental | undefined> {
    const rentalData = await prisma.rental.findFirst({
      where: { userId },
      orderBy: { endDate: 'desc' } // Pega o mais recente
    });

    if (!rentalData) return undefined;

    // Se a data de fim do último aluguel for maior que agora, ele ainda está aberto
    if (rentalData.endDate > new Date()) {
        return new Rental(
            rentalData.id,
            rentalData.userId,
            rentalData.carId,
            rentalData.startDate,
            rentalData.endDate
        );
    }
    
    return undefined;
  }

  async create(rental: Rental): Promise<void> {
    await prisma.rental.create({
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