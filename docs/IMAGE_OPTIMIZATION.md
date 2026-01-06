# Image Optimization Guide

This guide covers best practices for image optimization in the Email Marketing Automation Dashboard.

## Table of Contents

1. [OptimizedImage Component](#optimizedimage-component)
2. [Image Formats](#image-formats)
3. [Responsive Images](#responsive-images)
4. [Blur Placeholders](#blur-placeholders)
5. [Performance Best Practices](#performance-best-practices)
6. [CDN Integration](#cdn-integration)

---

## OptimizedImage Component

The `OptimizedImage` component wraps Next.js Image with additional features for optimal performance and user experience.

### Basic Usage

```tsx
import { OptimizedImage } from '@/Components/ui/OptimizedImage'

// Simple usage
<OptimizedImage
  src="/images/hero.jpg"
  alt="Hero image"
  width={1200}
  height={600}
/>
```

### Advanced Usage

```tsx
import { OptimizedImage } from '@/Components/ui/OptimizedImage'
import { BLUR_PLACEHOLDERS } from '@/lib/utils/imageOptimization'

// With blur placeholder and responsive sizing
<OptimizedImage
  src="/images/product.jpg"
  alt="Product showcase"
  width={800}
  height={600}
  aspectRatio="4/3"
  blurDataURL={BLUR_PLACEHOLDERS.gradient}
  rounded="lg"
  border
  priority // Above the fold
/>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `src` | `string` | required | Image source URL |
| `alt` | `string` | required | Alternative text for accessibility |
| `width` | `number` | required | Image width in pixels |
| `height` | `number` | required | Image height in pixels |
| `fallbackSrc` | `string` | `'/images/placeholder.png'` | Fallback image on error |
| `showBlurPlaceholder` | `boolean` | `true` | Show blur placeholder during load |
| `blurDataURL` | `string` | `undefined` | Custom blur data URL |
| `aspectRatio` | `string` | `'auto'` | CSS aspect ratio (e.g., '16/9') |
| `rounded` | `boolean \| 'sm' \| 'md' \| 'lg' \| 'full'` | `false` | Border radius |
| `border` | `boolean \| string` | `false` | Border styling |
| `priority` | `boolean` | `false` | Load image with high priority (above fold) |
| `loading` | `'lazy' \| 'eager'` | `'lazy'` | Loading behavior |

---

## Image Formats

Next.js automatically converts images to modern formats (AVIF, WebP) based on browser support.

### Format Priority

1. **AVIF** - Best compression (~50% smaller than JPEG)
2. **WebP** - Great compression (~30% smaller than JPEG)
3. **JPEG/PNG** - Fallback for older browsers

### Configuration

In `next.config.js`:

```javascript
module.exports = {
  images: {
    formats: ['image/avif', 'image/webp'],
  },
}
```

---

## Responsive Images

### Device Sizes

Configured in `next.config.js`:

```javascript
module.exports = {
  images: {
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
}
```

### Responsive Sizing with `fill`

For responsive containers:

```tsx
<div className="relative w-full h-64">
  <OptimizedImage
    src="/images/banner.jpg"
    alt="Banner"
    fill
    className="object-cover"
    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  />
</div>
```

### Manual srcset and sizes

```tsx
import { generateSrcSet, generateSizes } from '@/lib/utils/imageOptimization'

const srcset = generateSrcSet('/image.jpg', [640, 1280, 1920])
const sizes = generateSizes({
  sm: '100vw',
  md: '50vw',
  lg: '33vw'
})

<img src="/image.jpg" srcSet={srcset} sizes={sizes} alt="..." />
```

---

## Blur Placeholders

### Using Predefined Placeholders

```tsx
import { BLUR_PLACEHOLDERS } from '@/lib/utils/imageOptimization'

<OptimizedImage
  src="/images/profile.jpg"
  alt="Profile"
  blurDataURL={BLUR_PLACEHOLDERS.gradient}
  width={200}
  height={200}
/>
```

### Available Placeholders

- `BLUR_PLACEHOLDERS.primary` - Primary brand color
- `BLUR_PLACEHOLDERS.secondary` - Secondary brand color
- `BLUR_PLACEHOLDERS.neutral` - Gray neutral
- `BLUR_PLACEHOLDERS.gradient` - Blue to purple
- `BLUR_PLACEHOLDERS.warm` - Warm gradient
- `BLUR_PLACEHOLDERS.cool` - Cool gradient

### Custom Placeholders

```tsx
import { generateBlurPlaceholder, generateGradientPlaceholder } from '@/lib/utils/imageOptimization'

// Solid color
const blueBlur = generateBlurPlaceholder('#3B82F6')

// Gradient
const customGradient = generateGradientPlaceholder('#FF0000', '#00FF00')

<OptimizedImage blurDataURL={blueBlur} {...props} />
```

### Using plaiceholder (Production Recommended)

For production, generate real blur hashes at build time:

```bash
npm install plaiceholder
```

```tsx
import { getPlaiceholder } from 'plaiceholder'

// In getStaticProps or getServerSideProps
const { base64 } = await getPlaiceholder('/images/photo.jpg')

<OptimizedImage blurDataURL={base64} {...props} />
```

---

## Performance Best Practices

### 1. Use `priority` for Above-the-Fold Images

```tsx
// Hero images, logos
<OptimizedImage
  src="/hero.jpg"
  alt="Hero"
  priority
  {...props}
/>
```

### 2. Lazy Load Below-the-Fold Images

```tsx
// Default behavior - images below fold
<OptimizedImage
  src="/product.jpg"
  alt="Product"
  loading="lazy" // Default
  {...props}
/>
```

### 3. Set Explicit Dimensions

Always provide `width` and `height` to prevent layout shift:

```tsx
<OptimizedImage
  src="/image.jpg"
  alt="Description"
  width={800}  // Explicit
  height={600} // Explicit
/>
```

### 4. Use Aspect Ratio

Prevent layout shift with aspect ratio:

```tsx
<OptimizedImage
  src="/image.jpg"
  alt="Description"
  width={800}
  height={600}
  aspectRatio="4/3" // Matches 800x600
/>
```

### 5. Optimize Image Sizes

Serve appropriately sized images:

```tsx
// Small thumbnail
<OptimizedImage src="/thumb.jpg" width={64} height={64} {...props} />

// Large hero
<OptimizedImage src="/hero.jpg" width={1920} height={1080} {...props} />
```

### 6. Combine with InViewport

For maximum performance, combine with InViewport wrapper:

```tsx
import { InViewport } from '@/Components/ui/InViewport'

<InViewport>
  <OptimizedImage src="/image.jpg" alt="..." {...props} />
</InViewport>
```

---

## CDN Integration

### Cloudinary

```javascript
// next.config.js
module.exports = {
  images: {
    loader: 'cloudinary',
    path: 'https://res.cloudinary.com/your-cloud-name/',
  },
}
```

### Imgix

```javascript
// next.config.js
module.exports = {
  images: {
    loader: 'imgix',
    path: 'https://your-domain.imgix.net/',
  },
}
```

### Custom Loader

```tsx
import { getImageLoader } from '@/lib/utils/imageOptimization'

<OptimizedImage
  src="/image.jpg"
  alt="..."
  loader={getImageLoader('cloudinary')}
  {...props}
/>
```

---

## Image Size Budget

Recommended maximum file sizes:

| Type | Max Size | Format |
|------|----------|--------|
| Hero images | 200 KB | WebP/AVIF |
| Product images | 100 KB | WebP/AVIF |
| Thumbnails | 20 KB | WebP/AVIF |
| Icons | 10 KB | SVG |
| Avatars | 15 KB | WebP/AVIF |

---

## Checklist

- [ ] Use `OptimizedImage` for all images
- [ ] Set explicit `width` and `height`
- [ ] Add `priority` to above-fold images
- [ ] Use `loading="lazy"` for below-fold images
- [ ] Provide meaningful `alt` text
- [ ] Set `aspectRatio` to prevent layout shift
- [ ] Use blur placeholders for better UX
- [ ] Configure responsive `sizes` for different viewports
- [ ] Compress images before upload (< 200 KB)
- [ ] Use WebP/AVIF formats
- [ ] Test on slow 3G connections
- [ ] Verify Lighthouse image metrics (>90)

---

## Resources

- [Next.js Image Optimization](https://nextjs.org/docs/basic-features/image-optimization)
- [Web.dev Image Optimization](https://web.dev/fast/#optimize-your-images)
- [plaiceholder](https://plaiceholder.co/)
- [Cloudinary](https://cloudinary.com/)
- [Imgix](https://imgix.com/)
