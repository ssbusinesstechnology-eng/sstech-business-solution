import { createFileRoute } from "@tanstack/react-router";

import { ServicePage, servicePageHead } from "@/components/ServicePage";

export const Route = createFileRoute("/branding")({
  head: () => servicePageHead("branding"),
  component: () => <ServicePage slug="branding" />,
});
