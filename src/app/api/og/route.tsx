import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    // Derive absolute URL for brand logo from public/logo.png
    const brandLogoUrl = new URL('/logo.png', req.url).toString();

    // Extract query parameters with fallbacks
    const title = searchParams.get('title') || 'The intelligent index for frontier AI tools';
    const subtitle =
      searchParams.get('subtitle') ||
      'Discover, compare, and integrate verified AI software tools across handpicked categories.';
    const categoryParam = searchParams.get('category');
    const badgeText = categoryParam ? `+ ${categoryParam}` : '+ The Curated AI Directory';

    // Resolve logo URL for watermark
    const rawLogo = searchParams.get('logo') || '';
    const logoUrl = rawLogo
      ? rawLogo.startsWith('http')
        ? rawLogo
        : new URL(rawLogo, req.url).toString()
      : brandLogoUrl;

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '44px 52px',
            backgroundColor: '#FAF9FE',
            backgroundImage:
              'radial-gradient(circle at 10% 20%, rgba(139, 92, 246, 0.09) 0%, transparent 55%), radial-gradient(circle at 90% 80%, rgba(59, 130, 246, 0.06) 0%, transparent 55%)',
            color: '#111827',
            fontFamily: 'sans-serif',
          }}
        >
          {/* Top Header Mockup */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px 28px',
              backgroundColor: '#FFFFFF',
              border: '1px solid #E5E7EB',
              borderRadius: '16px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.02)',
            }}
          >
            {/* Brand Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <img
                src={brandLogoUrl}
                alt="toolstaq logo"
                width={34}
                height={34}
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '8px',
                  objectFit: 'cover',
                }}
              />
              <span
                style={{
                  fontSize: '22px',
                  fontWeight: 800,
                  letterSpacing: '-0.03em',
                  color: '#111827',
                }}
              >
                toolstaq
              </span>
            </div>

            {/* Right Nav Items */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
              <span style={{ fontSize: '14px', fontWeight: 600, color: '#4B5563' }}>Tools</span>
              <span style={{ fontSize: '14px', fontWeight: 600, color: '#4B5563' }}>Categories</span>
              <span style={{ fontSize: '14px', fontWeight: 600, color: '#4B5563' }}>Providers</span>
              <span style={{ fontSize: '14px', fontWeight: 600, color: '#4B5563' }}>Compare</span>
              <div
                style={{
                  padding: '7px 16px',
                  borderRadius: '10px',
                  backgroundColor: '#8B5CF6',
                  color: '#ffffff',
                  fontSize: '13px',
                  fontWeight: 600,
                  boxShadow: '0 2px 6px rgba(139, 92, 246, 0.3)',
                }}
              >
                Subscribe
              </div>
            </div>
          </div>

          {/* Center Content Section: Left Aligned Text + Right Watermark Logo */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '36px 44px',
              backgroundColor: '#FFFFFF',
              border: '1px solid #E5E7EB',
              borderRadius: '24px',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.03)',
              margin: '16px 0',
              flex: 1,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Left Content Stack */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                textAlign: 'left',
                maxWidth: '740px',
                zIndex: 2,
              }}
            >
              {/* Badge Pill */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '6px 16px',
                  borderRadius: '100px',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E5E7EB',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#374151',
                  marginBottom: '18px',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
                }}
              >
                <span>{badgeText}</span>
              </div>

              {/* Title */}
              <div
                style={{
                  fontSize: title.length > 35 ? '44px' : '52px',
                  fontWeight: 800,
                  lineHeight: 1.14,
                  letterSpacing: '-0.035em',
                  color: '#111827',
                  textAlign: 'left',
                }}
              >
                {title}
              </div>

              {/* Subtitle */}
              <div
                style={{
                  fontSize: '19px',
                  color: '#4B5563',
                  lineHeight: 1.5,
                  marginTop: '16px',
                  textAlign: 'left',
                  maxWidth: '680px',
                  display: '-webkit-box',
                  overflow: 'hidden',
                  maxHeight: '60px',
                }}
              >
                {subtitle}
              </div>
            </div>

            {/* Right Watermark Logo */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'absolute',
                right: '40px',
                opacity: 0.15,
                zIndex: 1,
              }}
            >
              <img
                src={logoUrl}
                alt="watermark"
                width={240}
                height={240}
                style={{
                  width: '240px',
                  height: '240px',
                  borderRadius: '40px',
                  objectFit: 'contain',
                }}
              />
            </div>
          </div>

          {/* Bottom Footer Hairline */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 8px',
              fontSize: '14px',
              color: '#6B7280',
              fontWeight: 500,
            }}
          >
            <span style={{ fontWeight: 700, color: '#111827' }}>toolstaq.com</span>
            <span>The intelligent index for frontier AI tools</span>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    return new Response(`Failed to generate the OG image: ${e.message}`, {
      status: 500,
    });
  }
}
