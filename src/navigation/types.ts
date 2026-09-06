import { NativeStackScreenProps } from '@react-navigation/native-stack';

/**
 * Route params carry identifiers only.
 *
 * Deep links and state restoration keep working because every screen can rebuild
 * itself from an id, and no large object ever ends up in navigation state.
 *
 * The three Shop options (Top Brands / Nearby Stores / 1Fi Marketplace) are
 * segments inside `Shop` rather than separate routes: switching between them is
 * a filter on the same page, not a push, so the back button still means "leave
 * Shop" the way it does elsewhere in the app.
 */
export type RootStackParamList = {
  Shop: undefined;
  ProductDetail: { productId: string; productName: string };
  EmiPlans: { productId: string; variantId: string };
  ReviewOrder: undefined;
  OrderConfirmed: { orderId: string };
};

export type ScreenProps<T extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  T
>;
