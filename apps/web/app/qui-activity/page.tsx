import { PageLayout } from "../../src/components/layout";
import { QuiIntegrationPage } from "../../src/components/layout/qui-integration-page";
import { QuiActivityClient } from "../../src/features/qui-activity/components/qui-activity-client";

export default function QuiActivityPage() {
	return (
		<QuiIntegrationPage>
			<PageLayout maxWidth="6xl">
				<QuiActivityClient />
			</PageLayout>
		</QuiIntegrationPage>
	);
}
