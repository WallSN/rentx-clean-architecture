import { Rental } from "../../../domain/entities/Rental";
import { IRentalRepository } from "../../../domain/repositories/IRentalRepository";
export class InMemoryRentalRepository implements IRentalRepository
{
    public rentals: Rental[] = [];
    async findOpenRentalByUserId(userId: string): Promise<Rental | undefined>
    {
        // Simula a busca de um aluguel ativo para este usuário
        return this.rentals.find((rental) => rental.userId === userId);
    }
    async create(rental: Rental): Promise<void>
    {
        this.rentals.push(rental);
    }
}