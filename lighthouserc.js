module.exports = {
  ci: {
    collect: {
      // Number of runs for each URL (median of 3 recommended)
      numberOfRuns: 3,
      // URLs to audit - only landing page for now
      url: [
        'http://localhost:3000', // Landing page
      ],
      // Start a server before running Lighthouse
      startServerCommand: 'npm run dev',
      startServerReadyPattern: 'Ready',
      startServerReadyTimeout: 60000,
    },
    assert: {
      // Performance thresholds
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.9 }],
        
        // Core Web Vitals
        'first-contentful-paint': ['warn', { maxNumericValue: 2000 }],
        'largest-contentful-paint': ['warn', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['warn', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['warn', { maxNumericValue: 300 }],
        
        // Other important metrics
        'speed-index': ['warn', { maxNumericValue: 3400 }],
        'interactive': ['warn', { maxNumericValue: 3800 }],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
