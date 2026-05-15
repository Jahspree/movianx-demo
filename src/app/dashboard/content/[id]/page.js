import DashboardShell from "../../DashboardShell";
import ContentDetail from "./ContentDetail";

export const metadata = {
  title: "Content Detail | Movianx Creator Dashboard",
};

export default function ContentDetailPage({ params }) {
  return (
    <DashboardShell title="Content detail" description="Private asset, review, analysis, and monetization state.">
      <ContentDetail id={params.id} />
    </DashboardShell>
  );
}
