import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import { UserRoleEnum } from "@/commons/enum";

const prisma = new PrismaClient();

async function main() {
	// Hash password
	const password = "Passw0rd!";
	const passwordHash = await bcrypt.hash(password, 10);

	// Create Client
	const client = await prisma.user.upsert({
		where: { email: "client1@mailinator.com" },
		update: {},
		create: {
			name: "Client One",
			email: "client1@mailinator.com",
			passwordHash,
			role: UserRoleEnum.CLIENT,
		},
	});

	// Create Lawyer
	const lawyer = await prisma.user.upsert({
		where: { email: "lawyer1@mailinator.com" },
		update: {},
		create: {
			name: "Lawyer One",
			email: "lawyer1@mailinator.com",
			passwordHash,
			role: UserRoleEnum.LAWYER,
			jurisdiction: "Indonesia",
			barNumber: "123456",
		},
	});

	console.log({ client, lawyer });
}

main()
	.then(() => prisma.$disconnect())
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
