interface HomePageProps {
  customerName: string;
  featuredCategory?: string;
  heroMessage?: string;
  orderTotal: number;
  isLoading: boolean;
  onGoToCatalog: () => void;
}

export function HomePage({
  customerName,
  featuredCategory,
  heroMessage,
  orderTotal,
  isLoading,
  onGoToCatalog,
}: HomePageProps) {
  return (
    <section className="page-stack">
      <section className="panel home-intro">
        <p className="section-label">Welcome</p>
        <h2>Shopping made simple</h2>
        <p>
          {isLoading
            ? 'Loading store updates...'
            : heroMessage ?? 'Explore products, apply offers, and checkout with confidence.'}
        </p>
        <button type="button" className="primary-inline" onClick={onGoToCatalog}>
          Start shopping
        </button>
      </section>

      <section className="journey-strip panel">
        <article className="journey-step">
          <span>1</span>
          <div>
            <h3>Browse catalog</h3>
            <p>Filter and search products quickly.</p>
          </div>
        </article>
        <article className="journey-step">
          <span>2</span>
          <div>
            <h3>Apply offers</h3>
            <p>Pick a coupon before final checkout.</p>
          </div>
        </article>
        <article className="journey-step">
          <span>3</span>
          <div>
            <h3>Review order</h3>
            <p>Confirm totals and shipping details.</p>
          </div>
        </article>
      </section>

      <section className="home-kpis">
        <article className="summary-card">
          <span>Featured category</span>
          <strong>{isLoading ? 'Loading...' : featuredCategory}</strong>
        </article>
        <article className="summary-card">
          <span>Customer</span>
          <strong>{customerName}</strong>
        </article>
        <article className="summary-card">
          <span>Current order total</span>
          <strong>Rs. {orderTotal}</strong>
        </article>
      </section>
    </section>
  );
}
