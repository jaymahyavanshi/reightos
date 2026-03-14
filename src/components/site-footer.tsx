import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container site-footer__grid">
        <div>
          <h3>Freightos AI</h3>
          <p>
            Bacancy Technology, 15-16, Times Corporate Park, Thaltej, Ahmedabad, Gujarat 380059.
          </p>
        </div>
        <div>
          <h4>Products</h4>
          <Link href="/">Marketplace</Link>
          <Link href="/enterprise">Enterprise</Link>
          <Link href="/quote">Quote search</Link>
        </div>
        <div>
          <h4>Solutions</h4>
          <Link href="/solutions">Importers & exporters</Link>
          <Link href="/solutions">Forwarders</Link>
          <Link href="/solutions">Carriers</Link>
        </div>
        <div>
          <h4>Resources</h4>
          <Link href="/resources">Resources</Link>
          <Link href="/enterprise/demo">Request demo</Link>
          <Link href="/developers/freight-tools">Developers</Link>
        </div>
        <div>
          <h4>Support</h4>
          <Link href="/contact">Contact us</Link>
          <Link href="/support">Create support ticket</Link>
          <Link href="/support/track">Track support ticket</Link>
        </div>
        <div>
          <h4>Account</h4>
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/login">Login</Link>
          <Link href="/signup">Sign up</Link>
        </div>
      </div>
    </footer>
  );
}
