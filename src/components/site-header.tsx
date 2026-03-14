import Link from "next/link";
import { LogoutButton } from "@/components/logout-button";
import { getCurrentUser } from "@/lib/current-user";
import { headerGroups } from "@/lib/marketing-data";

export async function SiteHeader() {
  const user = await getCurrentUser();

  return (
    <header className="site-header">
      <div className="utility-strip">
        <div className="container utility-strip__inner">
          <p>Compare freight, book digitally, and connect enterprise logistics workflows in one platform.</p>
          <div className="utility-strip__links">
            <Link href="/enterprise/demo">Request demo</Link>
            <Link href="/developers/freight-tools">API docs</Link>
          </div>
        </div>
      </div>
      <div className="container topbar">
        <Link className="brand" href="/">
          <span className="brand__mark">F</span>
          <span className="brand__copy">
            Freightos AI
            <small>Digital freight marketplace</small>
          </span>
        </Link>

        <nav className="topbar__nav topbar__nav--primary">
          {headerGroups.map((item) => (
            <Link key={item.href + item.label} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="topbar__auth">
          {user ? (
            <>
              <Link className="nav-pill nav-pill--muted" href="/dashboard">
                {user.fullName.split(" ")[0]}
              </Link>
              <LogoutButton />
            </>
          ) : (
            <>
              <Link className="nav-pill nav-pill--muted" href="/login">
                Login
              </Link>
              <Link className="nav-pill nav-pill--brand" href="/quote">
                Get a quote
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
