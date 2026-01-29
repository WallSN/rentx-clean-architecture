import { injectable } from "inversify";
import { PrismaClient } from "@prisma/client";

import { IRentalRepository } from "../../../domain/repositories/IRentalRepository";
import { Rental } from "../../../domain/entities/Rental";

const prisma = new PrismaClient();

@injectable()
export class PrismaRentalRepository implements IRentalRepository
{
  async findOpenRentalByUserId(
    userId: string
  ): Promise<Rental | undefined> {
    /**
     * Busca o aluguel mais recente do usuário.
     * Consideramos "aluguel em aberto" quando a data de fim
     * ainda é maior que a data atual.
     *
     * OBS:
     * Em um modelo mais completo, isso deveria ser tratado
     * com um campo explícito (ex: status).
     */
    const rentalData = await prisma.rental.findFirst({
      where: { userId },
      orderBy: { endDate: "desc" }, // Pega o mais recente
    });

    if(!rentalData)
    {
      return undefined;
    }

    // Se a data de fim for maior que agora, o aluguel ainda está aberto
    if(rentalData.endDate > new Date())
    {
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

  async create(rental: Rental): Promise<void>
  {
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