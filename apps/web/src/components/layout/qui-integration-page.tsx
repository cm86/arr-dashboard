"use client";

import type { ReactNode } from "react";
import { useQuiIntegrationEnabled } from "../../contexts/QuiIntegrationContext";

export function QuiIntegrationPage({ children }: { children: ReactNode }) {
	const enabled = useQuiIntegrationEnabled();
	return enabled ? children : null;
}
