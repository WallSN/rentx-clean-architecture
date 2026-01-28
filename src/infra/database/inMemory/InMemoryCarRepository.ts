import { Car } from "../../../domain/entities/Car";
import { ICarRepository } from "../../../domain/repositories/ICarRepository";
export class InMemoryCarRepository implements ICarRepository
{
    // Array público para podermos popular dados facilmente nos testes
    public cars: Car[] = [];
    async FindById(id: string): Promise<Car | undefined>
    {
        return this.cars.find((car) => car.id === id);
    }
    async updateAvailableStatus(id: string, available: boolean): Promise<void>
    {
        const carIndex = this.cars.findIndex((car) => car.id === id);
        if (carIndex !== -1 && this.cars[carIndex])
        {
            this.cars[carIndex]!.available = available;
        }
    }
}