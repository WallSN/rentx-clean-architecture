import "reflect-metadata";
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import crypto from "crypto";
import { container } from "../../infra/container";
import { CreateRentalUseCase } from "../../application/useCases/createRental/CreateRentalUseCase";
import { ICarRepository } from "../../domain/repositories/ICarRepository";
import { TYPES } from "../../infra/container/types";
import { disconnectPrisma } from "../../infra/database/prisma/prismaClient";

const prisma = new PrismaClient();

async function main() {
  try {
    console.log("🚗 Iniciando Sistema de Aluguel de Carros...\n");

    // 1. Criar um carro no banco de dados
    console.log("📝 Criando um carro...");
    const carId = crypto.randomUUID();
    const licensePlate = `ABC-${Math.floor(Math.random() * 9000) + 1000}`;

    const createdCar = await prisma.car.create({
      data: {
        id: carId,
        licensePlate,
        available: true,
      },
    });

    console.log(`✅ Carro criado com sucesso!`);
    console.log(`   ID: ${createdCar.id}`);
    console.log(`   Placa: ${createdCar.licensePlate}`);
    console.log(`   Disponível: ${createdCar.available}\n`);

    // 2. Tentar alugar o carro
    console.log("🔄 Tentando alugar o carro...");

    const userId = crypto.randomUUID();
    const now = new Date();
    const expectedReturnDate = new Date(now.getTime() + 48 * 60 * 60 * 1000); // 48 horas depois

    const createRentalUseCase = container.get<CreateRentalUseCase>(
      CreateRentalUseCase
    );

    const rental = await createRentalUseCase.execute({
      userId,
      carId: createdCar.id,
      expectedReturnDate,
    });

    console.log(`✅ Aluguel criado com sucesso!`);
    console.log(`   ID do Aluguel: ${rental.id}`);
    console.log(`   ID do Usuário: ${rental.userId}`);
    console.log(`   ID do Carro: ${rental.carId}`);
    console.log(`   Data de Início: ${rental.startDate.toLocaleString("pt-BR")}`);
    console.log(`   Data de Retorno: ${rental.endDate.toLocaleString("pt-BR")}\n`);

    // 3. Verificar se o carro foi marcado como indisponível
    console.log("🔍 Verificando status do carro...");
    const carRepository = container.get<ICarRepository>(TYPES.ICarRepository);
    const updatedCar = await carRepository.FindById(createdCar.id);

    if (updatedCar) {
      console.log(`   ID: ${updatedCar.id}`);
      console.log(`   Placa: ${updatedCar.licensePlate}`);
      console.log(`   Disponível: ${updatedCar.available}`);
      console.log(
        updatedCar.available
          ? "\n⚠️  Carro ainda está marcado como disponível!"
          : "\n✅ Carro foi marcado como indisponível corretamente!"
      );
    }

    console.log("\n🎉 Teste concluído com sucesso!");
  } catch (error) {
    if (error instanceof Error) {
      console.error(`\n❌ Erro: ${error.message}`);
    } else {
      console.error("\n❌ Erro desconhecido:", error);
    }
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    await disconnectPrisma();
  }
}

main();