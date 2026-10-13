import { QuiHomeClient } from "../../src/features/qui-home/components/qui-home-client";
import { QuiIntegrationPage } from "../../src/components/layout/qui-integration-page";

export const metadata = {
	title: "qui — Torrent Layer · Arr Control Center",
};

export default function QuiHomePage() {
	return (
		<QuiIntegrationPage>
			<QuiHomeClient />
		</QuiIntegrationPage>
	);
}
