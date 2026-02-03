import "reflect-metadata";
import { inject, injectable } from "inversify";
import { TYPES } from "../../../types";
import { ICarRepository } from "../../../domain/repositories/ICarRepository";
import { IRentalRepository } from "../../../domain/repositories/IRentalRepository";
import { CreateRentalDTO } from "./CreateRentalDTO";
import { Rental } from "../../../domain/entities/Rental";
import { Car } from "../../../domain/entities/Car";
import crypto from "crypto";

@injectable()
export class CreateRentalUseCase {
    constructor(
        @inject(TYPES.ICarRepository) private carRepository: ICarRepository,
        @inject(TYPES.IRentalRepository) private rentalRepository: IRentalRepository
    ) {}

    async execute({ userId, carId, expectedReturnDate }: CreateRentalDTO): Promise<Rental> {
        // 1. Validar duração mínima de 24 horas
        const minDuration = 24 * 60 * 60 * 1000; // 24 horas em milissegundos
        const now = new Date();
        const compareTime = expectedReturnDate.getTime() - now.getTime();

        if (compareTime < minDuration) {
            throw new Error("O aluguel deve ter duração mínima de 24 horas.");
        }

        // 2. Verificar se o carro existe
        const car = await this.carRepository.FindById(carId);
        if (!car) {
            throw new Error("Carro não encontrado.");
        }

        // 3. Verificar se o usuário já tem aluguel aberto
        const userHasOpenRental =
        await this.rentalRepository.findOpenRentalByUserId(userId);

        if (userHasOpenRental)
        {
            throw new Error("Usuário já possui um aluguel em andamento.");
        }

        // 4. Verificar disponibilidade do carro
        if (!car.available)
        {
            throw new Error("Carro indisponível.");
        }

        // 5. Criar a entidade Rental
        const rental = new Rental(
            crypto.randomUUID(),
            userId,
            carId,
            now,
            expectedReturnDate
        )

        // 6. Persistir os dados
        await this.rentalRepository.create(rental);

        // 7. Atualizar status do carro para indisponível
        await this.carRepository.updateAvailableStatus(carId, false);

        return rental;
    }
}