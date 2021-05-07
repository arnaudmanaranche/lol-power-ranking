const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' *.youtube.com *.twitter.com cdn.panelbear.com cmp.osano.com;
  child-src *.youtube.com *.google.com *.twitter.com;
  style-src 'self' 'unsafe-inline' *.googleapis.com;
  img-src * blob: data:;
  media-src 'none';
  connect-src *;
  worker-src blob:;
  font-src 'self';
`

const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: ContentSecurityPolicy.replace(/\n/g, '')
  },

  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin'
  },

  {
    key: 'X-Frame-Options',
    value: 'DENY'
  },

  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },

  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },

  {
    key: 'Strict-Transport-Security',
    value: 'max-age=15768000; includeSubDomains; preload'
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()'
  }
]

module.exports = {
  future: {
    webpack5: true
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack']
    })

    return config
  },
  async headers() {
    return [
      {
        source: '/',
        headers: securityHeaders
      },
      {
        source: '/:path*',
        headers: securityHeaders
      }
    ]
  },
  images: {
    domains: ['firebasestorage.googleapis.com']
  }
}
