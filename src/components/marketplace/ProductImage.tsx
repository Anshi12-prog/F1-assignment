import React, { useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, View } from 'react-native';
import { colors, radius } from '@/theme';
import { ProductCategoryId } from '@/types/marketplace';
import { CategoryGlyph } from './CategoryGlyph';

interface Props {
  uri?: string | null;
  category: ProductCategoryId;
  /** Square by default; the PDP hero overrides with a taller aspect. */
  aspectRatio?: number;
}

/**
 * Product imagery with its own loading and failure states.
 *
 * A remote URI gets a spinner while it downloads and falls back to the category
 * glyph if it 404s, so a bad CDN entry degrades quietly instead of showing a grey
 * box in the middle of the grid.
 */
export function ProductImage({ uri, category, aspectRatio = 1 }: Props) {
  const [loading, setLoading] = useState(Boolean(uri));
  const [failed, setFailed] = useState(false);

  const showGlyph = !uri || failed;

  return (
    <View style={[styles.container, { aspectRatio }]}>
      {showGlyph ? (
        <CategoryGlyph category={category} />
      ) : (
        <>
          <Image
            source={{ uri: uri as string }}
            style={StyleSheet.absoluteFill}
            resizeMode="contain"
            onLoadEnd={() => setLoading(false)}
            onError={() => {
              setLoading(false);
              setFailed(true);
            }}
            accessibilityIgnoresInvertColors
          />
          {loading ? (
            <View style={styles.loader}>
              <ActivityIndicator color={colors.brand} />
            </View>
          ) : null}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: radius.md,
    overflow: 'hidden',
    backgroundColor: colors.brandSurface,
  },
  loader: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
