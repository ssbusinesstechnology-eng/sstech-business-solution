import { createFileRoute } from "@tanstack/react-router";

import { ServicePage, servicePageHead } from "@/components/ServicePage";

export const Route = createFileRoute("/digital-marketing")({
  head: () => servicePageHead("digital-marketing"),
  component: () => <ServicePage slug="digital-marketing" />,
});
