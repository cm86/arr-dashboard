import { PageLayout } from "../../src/components/layout";
import { QuiIntegrationPage } from "../../src/components/layout/qui-integration-page";
import { CrossSeedClient } from "../../src/features/cross-seed/components/cross-seed-client";

export default function CrossSeedPage() {
	return (
		<QuiIntegrationPage>
			<PageLayout maxWidth="7xl">
				<CrossSeedClient />
			</PageLayout>
		</QuiIntegrationPage>
	);
}
