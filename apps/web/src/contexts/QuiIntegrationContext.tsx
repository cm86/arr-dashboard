"use client";

import { usePathname } from "next/navigation";
import { createContext, type ReactNode, useContext } from "react";
import { useSystemSettings } from "../hooks/api/useSystem";

const PUBLIC_ROUTES = new Set(["/login", "/setup"]);
const QuiIntegrationContext = createContext(false);

export function QuiIntegrationProvider({ children }: { children: ReactNode }) {
	const pathname = usePathname();
	const { data } = useSystemSettings({
		enabled: !PUBLIC_ROUTES.has(pathname ?? ""),
	});

	return (
		<QuiIntegrationContext.Provider value={data?.data.quiEnabled ?? false}>
			{children}
		</QuiIntegrationContext.Provider>
	);
}

export function useQuiIntegrationEnabled(): boolean {
	return useContext(QuiIntegrationContext);
}
