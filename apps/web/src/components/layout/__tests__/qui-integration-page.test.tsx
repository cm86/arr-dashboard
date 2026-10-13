import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const { useSystemSettings } = vi.hoisted(() => ({
	useSystemSettings: vi.fn(),
}));

vi.mock("../../../hooks/api/useSystem", () => ({
	useSystemSettings,
}));

vi.mock("next/navigation", () => ({
	usePathname: () => "/",
}));

import { QuiIntegrationProvider } from "../../../contexts/QuiIntegrationContext";
import { QuiIntegrationPage } from "../qui-integration-page";

describe("QuiIntegrationPage", () => {
	it("hides Qui-only page content when the integration is disabled", () => {
		useSystemSettings.mockReturnValue({ data: { data: { quiEnabled: false } } });

		render(
			<QuiIntegrationProvider>
				<QuiIntegrationPage>
					<div>Qui page</div>
				</QuiIntegrationPage>
			</QuiIntegrationProvider>,
		);

		expect(screen.queryByText("Qui page")).toBeNull();
	});

	it("keeps Qui-only page content hidden until settings confirm the integration is enabled", async () => {
		useSystemSettings.mockReturnValue({ data: undefined });

		const { rerender } = render(
			<QuiIntegrationProvider>
				<QuiIntegrationPage>
					<div>Qui page</div>
				</QuiIntegrationPage>
			</QuiIntegrationProvider>,
		);

		expect(screen.queryByText("Qui page")).toBeNull();

		useSystemSettings.mockReturnValue({ data: { data: { quiEnabled: true } } });
		rerender(
			<QuiIntegrationProvider>
				<QuiIntegrationPage>
					<div>Enabled Qui page</div>
				</QuiIntegrationPage>
			</QuiIntegrationProvider>,
		);

		expect(screen.getByText("Enabled Qui page")).toBeInTheDocument();
	});
});
