import type { FastifyPluginCallback } from "fastify";
import { isQuiIntegrationEnabled } from "../lib/qui/integration-enabled.js";
import { registerActionRoutes } from "./qui/action-routes.js";
import { registerInstanceRoutes } from "./qui/instance-routes.js";
import { registerLibraryRoutes } from "./qui/library-routes.js";
import { registerPanelRoutes } from "./qui/panel-routes.js";
import { registerTorrentRoutes } from "./qui/torrent-routes.js";
import { registerWebhookRoutes } from "./qui/webhook-routes.js";

/**
 * qui integration routes — read-only torrent observability for the
 * media-stack dashboard. Each handler:
 *   - resolves the user's qui ServiceInstance via requireQuiInstance
 *     (filters by userId AND service=QUI; never trust ids alone)
 *   - constructs a request-scoped client (decrypts API key, no caching)
 *   - returns canonical camelCase shapes — wire-format normalization
 *     happens inside the client at the Zod boundary
 *
 * Errors surface through QuiApiError / QuiInstanceUnreachableError, both
 * of which expose `statusCode` for the centralized error handler in
 * server.ts to map onto HTTP responses.
 */
const quiRoute: FastifyPluginCallback = (app, _opts, done) => {
	app.addHook("onRequest", async (_request, reply) => {
		if (!(await isQuiIntegrationEnabled(app.prisma))) {
			return reply.status(404).send({ error: "Qui integration is disabled" });
		}
	});

	registerInstanceRoutes(app);
	registerTorrentRoutes(app);
	registerPanelRoutes(app);
	registerLibraryRoutes(app);
	registerActionRoutes(app);
	registerWebhookRoutes(app);
	done();
};

export const registerQuiRoutes = quiRoute;
