import { Rental } from "../entities/Rental";

export interface IRentalRepository {
    // Necessário para a regra: "Não é possível alugar se o usuário já possuir um aluguel em aberto"
    findOpenRentalByUserId(userId: string): Promise<Rental | undefined>;

    // Para salvar o aluguel no final
    create(rental: Rental): Promise<void>;
}