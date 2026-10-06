import { createFileRoute } from "@tanstack/react-router";

import { ServicePage, servicePageHead } from "@/components/ServicePage";

export const Route = createFileRoute("/professional-email")({
  head: () => servicePageHead("professional-email"),
  component: () => <ServicePage slug="professional-email" />,
});
