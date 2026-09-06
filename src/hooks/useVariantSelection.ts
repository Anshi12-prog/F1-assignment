import { useCallback, useMemo, useState } from 'react';
import { Product, ProductVariant } from '@/types/marketplace';

export interface VariantOptionGroup {
  key: string;
  label: string;
  options: Array<{
    value: string;
    hex?: string;
    /** False when no in-catalogue variant exists for this combination. */
    available: boolean;
    selected: boolean;
  }>;
}

interface VariantSelection {
  groups: VariantOptionGroup[];
  selectedVariant: ProductVariant | null;
  selectAttribute: (key: string, value: string) => void;
}

function attributesOf(variant: ProductVariant): Record<string, string> {
  return variant.attributes.reduce<Record<string, string>>((accumulator, attribute) => {
    accumulator[attribute.key] = attribute.value;
    return accumulator;
  }, {});
}

/**
 * Derives the variant matrix from the product payload instead of hard-coding
 * option lists per product.
 *
 * When the user picks an option that would produce a combination the catalogue
 * does not carry, the remaining attributes snap to the closest variant that does
 * exist - so it is impossible to land on a dead end.
 */
export function useVariantSelection(product: Product | null): VariantSelection {
  const defaultVariant = useMemo(() => {
    if (!product) {
      return null;
    }
    return product.variants.find((variant) => variant.inStock) ?? product.variants[0] ?? null;
  }, [product]);

  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedVariant = useMemo(() => {
    if (!product) {
      return null;
    }
    return product.variants.find((variant) => variant.id === selectedId) ?? defaultVariant;
  }, [product, selectedId, defaultVariant]);

  const groups = useMemo<VariantOptionGroup[]>(() => {
    if (!product || !selectedVariant) {
      return [];
    }

    const order: string[] = [];
    const byKey = new Map<string, { label: string; values: Map<string, string | undefined> }>();

    for (const variant of product.variants) {
      for (const attribute of variant.attributes) {
        if (!byKey.has(attribute.key)) {
          byKey.set(attribute.key, { label: attribute.groupLabel, values: new Map() });
          order.push(attribute.key);
        }
        byKey.get(attribute.key)!.values.set(attribute.value, attribute.hex);
      }
    }

    const selectedAttributes = attributesOf(selectedVariant);

    return order.map((key) => {
      const group = byKey.get(key)!;
      return {
        key,
        label: group.label,
        options: Array.from(group.values.entries()).map(([value, hex]) => ({
          value,
          hex,
          selected: selectedAttributes[key] === value,
          available: product.variants.some((variant) => {
            const attributes = attributesOf(variant);
            return attributes[key] === value && variant.inStock;
          }),
        })),
      };
    });
  }, [product, selectedVariant]);

  const selectAttribute = useCallback(
    (key: string, value: string) => {
      if (!product || !selectedVariant) {
        return;
      }

      const desired = { ...attributesOf(selectedVariant), [key]: value };

      const scored = product.variants
        .map((variant) => {
          const attributes = attributesOf(variant);
          if (attributes[key] !== value) {
            return null;
          }
          const matches = Object.keys(desired).filter(
            (attributeKey) => attributes[attributeKey] === desired[attributeKey],
          ).length;
          return { variant, matches };
        })
        .filter((entry): entry is { variant: ProductVariant; matches: number } => entry !== null)
        .sort((a, b) => {
          if (b.matches !== a.matches) {
            return b.matches - a.matches;
          }
          return Number(b.variant.inStock) - Number(a.variant.inStock);
        });

      if (scored.length > 0) {
        setSelectedId(scored[0].variant.id);
      }
    },
    [product, selectedVariant],
  );

  return { groups, selectedVariant, selectAttribute };
}
