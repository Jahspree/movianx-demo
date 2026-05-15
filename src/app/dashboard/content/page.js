import DashboardShell from "../DashboardShell";
import ContentList from "./ContentList";

export const metadata = {
  title: "Content | Movianx Creator Dashboard",
};

export default function ContentPage() {
  return (
    <DashboardShell
      title="Private content library"
      description="Uploaded titles remain private until review approval and explicit publish."
    >
      <section className="dashboard-grid">
        <div className="panel">
          <h2>Your titles</h2>
          <ContentList />
        </div>
      </section>
    </DashboardShell>
  );
}
