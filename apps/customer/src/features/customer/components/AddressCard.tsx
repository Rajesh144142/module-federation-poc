import type { Address } from '../../../shared/types/customer';

interface AddressCardProps {
  address: Address;
}

export function AddressCard({ address }: AddressCardProps) {
  return (
    <div className="address-card">
      <span>Primary address</span>
      <strong>{address.line1}</strong>
      <p>
        {address.city}, {address.state} {address.zipCode}
      </p>
      <p>{address.country}</p>
    </div>
  );
}
