import "reflect-metadata";
import { describe, it, expect, beforeEach } from "vitest";
import { CreateRentalUseCase } from "./CreateRentalUseCase";
import { InMemoryCarRepository } from "../../../infra/database/inMemory/InMemoryCarRepository";
import { InMemoryRentalRepository } from "../../../infra/database/inMemory/InMemoryRentalRepository";
import { Car } from "../../../domain/entities/Car";

let createRentalUseCase: CreateRentalUseCase;
let carsRepository: InMemoryCarRepository;
let rentalsRepository: InMemoryRentalRepository;

describe("Caso de Uso de Criação de Aluguel", () => {
  // Antes de cada teste, limpamos e reinicializamos as instâncias
  beforeEach(() => {
    carsRepository = new InMemoryCarRepository();
    rentalsRepository = new InMemoryRentalRepository();

    // Injetamos os repositórios manualmente (sem container) para um teste unitário puro
    createRentalUseCase = new CreateRentalUseCase(
      carsRepository,
      rentalsRepository
    );
  });

  it("deve ser capaz de criar um novo aluguel", async () => {
    // criar um carro no banco de dados em memória
    const car = new Car("123", "ABC-1234", true);
    carsRepository.cars.push(car);

    const rental = await createRentalUseCase.execute({
      userId: "user-1",
      carId: "123",
      expectedReturnDate: new Date(
        new Date().getTime() + 24 * 60 * 60 * 1000
      ),
    });

    expect(rental).toHaveProperty("id");
    expect(rental.userId).toBe("user-1");
  });

  it("não deve ser capaz de criar um aluguel com duração inferior a 24 horas", async () => {
    await expect(
      createRentalUseCase.execute({
        userId: "user-1",
        carId: "123",
        expectedReturnDate: new Date(),
      })
    ).rejects.toEqual(
      new Error("O aluguel deve ter duração mínima de 24 horas.")
    );
  });

  it("não deve ser capaz de criar um aluguel se o usuário já possuir um em andamento", async () => {
    // carro e usuário já possuem um aluguel ativo
    const car = new Car("123", "ABC-1234", true);
    carsRepository.cars.push(car);

    // Cria o primeiro aluguel
    await createRentalUseCase.execute({
      userId: "user-test",
      carId: "123",
      expectedReturnDate: new Date(
        new Date().getTime() + 25 * 60 * 60 * 1000
      ),
    });

    // Tenta criar um segundo aluguel para o mesmo usuário
    await expect(
      createRentalUseCase.execute({
        userId: "user-test",
        carId: "123",
        expectedReturnDate: new Date(
          new Date().getTime() + 25 * 60 * 60 * 1000
        ),
      })
    ).rejects.toEqual(
      new Error("Usuário já possui um aluguel em andamento.")
    );
  });

  it("não deve ser capaz de alugar um carro indisponível", async () => {
    // carro indisponível
    const car = new Car("123", "ABC-1234", false); // disponível: false
    carsRepository.cars.push(car);

    await expect(
      createRentalUseCase.execute({
        userId: "user-2",
        carId: "123",
        expectedReturnDate: new Date(
          new Date().getTime() + 25 * 60 * 60 * 1000
        ),
      })
    ).rejects.toEqual(new Error("Carro indisponível."));
  });
});