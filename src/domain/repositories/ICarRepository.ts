import { Car } from "../entities/Car";

export interface ICarRepository {
    // Necessário para verificar se o carro existe e seu status atual
    FindById(id: string): Promise<Car | undefined>;

    // Necessário para atualizar o status para "indisponível" ao alugar
    updateAvailableStatus(id: string, available: boolean): Promise<void>;
}