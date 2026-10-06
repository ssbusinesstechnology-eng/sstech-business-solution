import { createFileRoute } from "@tanstack/react-router";

import { ServicePage, servicePageHead } from "@/components/ServicePage";

export const Route = createFileRoute("/business-technology")({
  head: () => servicePageHead("business-technology"),
  component: () => <ServicePage slug="business-technology" />,
});
