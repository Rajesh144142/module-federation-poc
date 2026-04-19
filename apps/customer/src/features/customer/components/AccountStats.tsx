interface AccountStatsProps {
  rewardsPoints: number;
  recentOrders: number;
  wishlistItems: number;
}

export function AccountStats({ rewardsPoints, recentOrders, wishlistItems }: AccountStatsProps) {
  return (
    <div className="account-stats">
      <div>
        <span>Reward points</span>
        <strong>{rewardsPoints}</strong>
      </div>
      <div>
        <span>Recent orders</span>
        <strong>{recentOrders}</strong>
      </div>
      <div>
        <span>Wishlist</span>
        <strong>{wishlistItems} items</strong>
      </div>
    </div>
  );
}
