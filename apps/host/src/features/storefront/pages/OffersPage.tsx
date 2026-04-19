import type { Offer } from '../../../shared/types/store';
import { OffersPanel } from '../components/OffersPanel';

interface OffersPageProps {
  offers: Offer[];
  isLoading: boolean;
  activeCouponCode: string | null;
  onApplyCoupon: (couponCode: string) => void;
}

export function OffersPage(props: OffersPageProps) {
  return (
    <section className="page-stack">
      <OffersPanel {...props} />
    </section>
  );
}
