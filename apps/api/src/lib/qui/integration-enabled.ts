import type { PrismaClientInstance } from "../prisma.js";

export async function isQuiIntegrationEnabled(
	prisma: Pick<PrismaClientInstance, "systemSettings">,
): Promise<boolean> {
	const settings = await prisma.systemSettings.findUnique({
		where: { id: 1 },
		select: { quiEnabled: true },
	});

	return settings?.quiEnabled ?? true;
}
