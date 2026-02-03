import "reflect-metadata";
import { container } from "../../infra/container";
import { CreateRentalUseCase } from "../../application/useCases/createRental/CreateRentalUseCase";
import { prisma } from "../../infra/database/prisma/client";
import { TYPES } from "../../types";
import * as crypto from "crypto";

async function main() {
  console.log("--- Iniciando RentX CLI ---");

  // Criar um carro no banco apenas para testar, senão o aluguel falha.
  const carId = "carro-teste-01";
  
  try {
    // Tenta criar o carro. Se já existir, o Prisma vai reclamar e cai no catch (o que é ok).
    const carExists = await prisma.car.findUnique({ where: { id: carId } });
    
    if (!carExists) {
        await prisma.car.create({
            data: {
              id: carId,
              licensePlate: "ABC-1234",
              available: true
            }
        });
        console.log("Carro de teste inserido no banco de dados.");
    } else {
        // Se o carro já existe mas estava alugado (indisponível), reseta para disponível
        if (!carExists.available) {
            await prisma.car.update({
                where: { id: carId },
                data: { available: true }
            });
            console.log("Carro existente resetado para 'Disponível'.");
        } else {
            console.log("Carro de teste já existe e está disponível.");
        }
    }
  } catch (error) {
    console.error("Erro ao preparar base de dados:", error);
  }

  // --- PASSO 2: Obter o Caso de Uso ---
  const createRentalUseCase = container.get<CreateRentalUseCase>(TYPES.CreateRentalUseCase);

  // --- PASSO 3: Executar a Regra de Negócio ---
  console.log("\nTentando alugar o carro...");
  
  try {
    const rental = await createRentalUseCase.execute({
      userId: "usuario-cli-01",
      carId: carId,
      expectedReturnDate: new Date(new Date().getTime() + 48 * 60 * 60 * 1000) // Daqui a 48 horas
    });

    console.log("\nSUCESSO! Aluguel realizado.");
    console.log("Detalhes do Aluguel:", rental);
    
  } catch (error: any) {
    console.error("\nFALHA: Não foi possível alugar.");
    console.error("Motivo:", error.message);
  } finally {
      await prisma.$disconnect();
  }
}

main();