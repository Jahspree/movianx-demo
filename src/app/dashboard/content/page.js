import DashboardShell from "../DashboardShell";
import ContentList from "./ContentList";

export const metadata = {
  title: "Content | Movianx Creator Dashboard",
};

export default function ContentPage() {
  return (
    <DashboardShell
      title="Private content library"
      description="Your films, episodes, stories, and sound worlds stay protected until you choose a release path."
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
