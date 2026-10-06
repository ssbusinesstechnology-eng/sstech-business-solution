import { createFileRoute } from "@tanstack/react-router";

import { ServicePage, servicePageHead } from "@/components/ServicePage";

export const Route = createFileRoute("/web-design")({
  head: () => servicePageHead("web-design"),
  component: () => <ServicePage slug="web-design" />,
});
