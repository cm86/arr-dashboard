import { afterEach, describe, expect, it, vi } from "vitest";
import { QuiIntegrationDisabledError, quiHealthProbe, quiRequest } from "../client-helpers.js";
import { isQuiIntegrationEnabled } from "../integration-enabled.js";

describe("Qui integration switch", () => {
	afterEach(() => vi.restoreAllMocks());

	it("defaults to enabled when system settings have not been created", async () => {
		const prisma = {
			systemSettings: { findUnique: vi.fn().mockResolvedValue(null) },
		};

		await expect(isQuiIntegrationEnabled(prisma as never)).resolves.toBe(true);
	});

	it("does not issue Qui requests while the integration is disabled", async () => {
		const fetch = vi.spyOn(globalThis, "fetch");
		const context = {
			instanceId: "qui-1",
			baseUrl: "http://qui.test",
			apiKey: "key",
			log: { warn: vi.fn() },
			isIntegrationEnabled: async () => false,
		};

		await expect(
			quiRequest(context as never, "/api/instances", { safeParse: vi.fn() } as never),
		).rejects.toBeInstanceOf(QuiIntegrationDisabledError);
		await expect(quiHealthProbe(context as never)).resolves.toEqual({
			ok: false,
			reason: "Qui integration is disabled",
		});
		expect(fetch).not.toHaveBeenCalled();
	});
});
