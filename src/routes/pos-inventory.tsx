import { createFileRoute } from "@tanstack/react-router";

import { ServicePage, servicePageHead } from "@/components/ServicePage";

export const Route = createFileRoute("/pos-inventory")({
  head: () => servicePageHead("pos-inventory"),
  component: () => <ServicePage slug="pos-inventory" />,
});
