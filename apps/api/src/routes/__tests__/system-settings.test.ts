import Fastify from "fastify";
import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";
import { registerSystemRoutes } from "../system.js";
import { createInjectAuthenticated, setupAuthInjection } from "./test-helpers.js";

let app: ReturnType<typeof Fastify>;
let settings: Record<string, unknown>;
let injectAuthenticated: ReturnType<typeof createInjectAuthenticated>;

beforeEach(async () => {
	settings = {
		id: 1,
		apiPort: 3001,
		webPort: 3000,
		listenAddress: "0.0.0.0",
		appName: "Arr Dashboard",
		externalUrl: null,
		trustProxy: false,
		secureCookies: null,
		quiEnabled: true,
		updatedAt: new Date("2026-01-01T00:00:00Z"),
	};
	const prisma = {
		systemSettings: {
			findUnique: vi.fn(async () => settings),
			create: vi.fn(async () => settings),
			upsert: vi.fn(async ({ update }: { update: Record<string, unknown> }) => {
				settings = { ...settings, ...update };
				return settings;
			}),
		},
	};

	app = Fastify();
	app.decorate("prisma", prisma as never);
	app.decorate("config", {
		TRUST_PROXY: false,
		COOKIE_SECURE: false,
		APP_URL: "http://localhost",
	} as never);
	app.decorate("dbProvider", "sqlite" as never);
	app.decorate("lifecycle", { getRestartMessage: () => "ok", restart: vi.fn() } as never);
	app.decorate("notificationService", { setBaseUrl: vi.fn() } as never);
	setupAuthInjection(app);
	await app.register(registerSystemRoutes, { prefix: "/system" });
	await app.ready();

	injectAuthenticated = createInjectAuthenticated(app);
});

afterAll(async () => {
	await app?.close();
});

describe("system Qui integration setting", () => {
	it("returns the persisted integration state", async () => {
		settings.quiEnabled = false;

		const response = await injectAuthenticated("GET", "/system/settings");

		expect(response.statusCode).toBe(200);
		expect(JSON.parse(response.payload).data.quiEnabled).toBe(false);
	});

	it("persists updates without requiring an application restart", async () => {
		const response = await injectAuthenticated("PUT", "/system/settings", {
			body: { quiEnabled: false },
		});

		expect(response.statusCode).toBe(200);
		expect(JSON.parse(response.payload)).toMatchObject({
			data: { quiEnabled: false, requiresRestart: false },
		});
	});
});
