import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { EmiPlan, OrderConfirmation, Product, ProductVariant } from '@/types/marketplace';

/**
 * Checkout state.
 *
 * The product -> variant -> EMI plan -> review -> confirmation journey spans four
 * screens, so the selection lives in one provider rather than being threaded
 * through navigation params. Routes carry ids only; the objects live here.
 *
 * Context is the right size for this: the state is small, changes rarely, and is
 * scoped to a single flow. A global store would be more machinery than the
 * problem needs.
 */
interface CheckoutState {
  product: Product | null;
  variant: ProductVariant | null;
  plan: EmiPlan | null;
  order: OrderConfirmation | null;
}

interface CheckoutContextValue extends CheckoutState {
  beginCheckout: (product: Product, variant: ProductVariant) => void;
  selectPlan: (plan: EmiPlan) => void;
  completeOrder: (order: OrderConfirmation) => void;
  reset: () => void;
}

const EMPTY: CheckoutState = { product: null, variant: null, plan: null, order: null };

const CheckoutContext = createContext<CheckoutContextValue | undefined>(undefined);

export function CheckoutProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<CheckoutState>(EMPTY);

  const beginCheckout = useCallback((product: Product, variant: ProductVariant) => {
    setState({ product, variant, plan: null, order: null });
  }, []);

  const selectPlan = useCallback((plan: EmiPlan) => {
    setState((previous) => ({ ...previous, plan }));
  }, []);

  const completeOrder = useCallback((order: OrderConfirmation) => {
    setState((previous) => ({ ...previous, order }));
  }, []);

  const reset = useCallback(() => setState(EMPTY), []);

  const value = useMemo<CheckoutContextValue>(
    () => ({ ...state, beginCheckout, selectPlan, completeOrder, reset }),
    [state, beginCheckout, selectPlan, completeOrder, reset],
  );

  return <CheckoutContext.Provider value={value}>{children}</CheckoutContext.Provider>;
}

export function useCheckout(): CheckoutContextValue {
  const context = useContext(CheckoutContext);
  if (!context) {
    throw new Error('useCheckout must be used inside a CheckoutProvider');
  }
  return context;
}
