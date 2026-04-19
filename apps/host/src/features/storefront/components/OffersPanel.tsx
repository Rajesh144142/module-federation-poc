import type { Offer } from '../../../shared/types/store';
import { GridSkeleton } from '../../../shared/components/AppLoaders';

interface OffersPanelProps {
  offers: Offer[];
  isLoading: boolean;
  activeCouponCode: string | null;
  onApplyCoupon: (couponCode: string) => void;
}

export function OffersPanel({
  offers,
  isLoading,
  activeCouponCode,
  onApplyCoupon,
}: OffersPanelProps) {
  return (
    <section className="panel">
      <div className="section-heading">
        <div>
          <p className="section-label">Offers module</p>
          <h2>Available promotions</h2>
        </div>
      </div>

      {isLoading ? (
        <GridSkeleton count={3} minHeight={170} />
      ) : (
        <div className="offer-grid">
          {offers.map((offer) => {
            const isActive = activeCouponCode === offer.code;

            return (
              <article key={offer.id} className="offer-card">
                <h3>{offer.title}</h3>
                <p>{offer.description}</p>
                <div className="offer-footer">
                  <strong>{offer.discountPercent}% off</strong>
                  <button
                    type="button"
                    className={isActive ? 'secondary-button' : ''}
                    onClick={() => onApplyCoupon(offer.code)}
                  >
                    {isActive ? `Applied ${offer.code}` : `Apply ${offer.code}`}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
