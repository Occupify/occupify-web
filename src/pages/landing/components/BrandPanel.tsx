import { UsersThreeIcon, BriefcaseMetalIcon, LightbulbIcon } from '@phosphor-icons/react'
import { OccupifyLogo } from '@/components/ui'

export function BrandPanel() {
  return (
    <div
      style={{
        flex: '1 1 54%',
        background: 'linear-gradient(145deg, #0A66C2 0%, #084FA0 50%, #042D5C 100%)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '56px 64px',
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Subtle background radial glow */}
      <div
        style={{
          position: 'absolute',
          top: '-15%',
          right: '-10%',
          width: 480,
          height: 480,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ position: 'relative', zIndex: 2 }}>
        <OccupifyLogo size={38} inverted={true} />
      </div>

      <div style={{ position: 'relative', zIndex: 2, margin: 'auto 0' }}>
        <h1
          style={{
            fontSize: 34,
            fontWeight: 800,
            color: '#fff',
            lineHeight: 1.25,
            maxWidth: 480,
            letterSpacing: '-0.025em',
            marginBottom: 16,
          }}
        >
          Mạng lưới chuyên nghiệp dành cho người Việt
        </h1>
        <p
          style={{
            fontSize: 15.5,
            color: 'rgba(255,255,255,0.80)',
            maxWidth: 440,
            lineHeight: 1.65,
            marginBottom: 36,
          }}
        >
          Kết nối, hợp tác và phát triển sự nghiệp cùng cộng đồng chuyên gia, doanh nghiệp và
          freelancer hàng đầu Việt Nam.
        </p>

        {/* Feature highlights */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            maxWidth: 460,
          }}
        >
          {[
            {
              Icon: UsersThreeIcon,
              text: 'Kết nối với hơn 500.000 chuyên gia tài năng',
            },
            {
              Icon: BriefcaseMetalIcon,
              text: 'Tìm kiếm dự án & hợp đồng freelance minh bạch',
            },
            {
              Icon: LightbulbIcon,
              text: 'Bảo đảm thanh toán an toàn qua cơ chế Escrow',
            },
          ].map(({ Icon, text }) => (
            <div
              key={text}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                background: 'rgba(255,255,255,0.08)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,255,255,0.14)',
                borderRadius: 10,
                padding: '12px 16px',
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: 'rgba(255,255,255,0.16)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Icon size={17} color="#fff" weight="fill" />
              </div>
              <span
                style={{
                  fontSize: 13.5,
                  color: 'rgba(255,255,255,0.92)',
                  fontWeight: 600,
                }}
              >
                {text}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Trust Metrics Bar */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          borderTop: '1px solid rgba(255,255,255,0.15)',
          paddingTop: 20,
          display: 'flex',
          alignItems: 'center',
          gap: 28,
        }}
      >
        <div>
          <div style={{ fontSize: 18, fontWeight: 800, color: '#fff' }}>500K+</div>
          <div
            style={{
              fontSize: 11.5,
              color: 'rgba(255,255,255,0.65)',
              fontWeight: 500,
            }}
          >
            Chuyên gia
          </div>
        </div>
        <div
          style={{
            width: 1,
            height: 24,
            background: 'rgba(255,255,255,0.15)',
          }}
        />
        <div>
          <div style={{ fontSize: 18, fontWeight: 800, color: '#fff' }}>10.000+</div>
          <div
            style={{
              fontSize: 11.5,
              color: 'rgba(255,255,255,0.65)',
              fontWeight: 500,
            }}
          >
            Dự án đã kết nối
          </div>
        </div>
        <div
          style={{
            width: 1,
            height: 24,
            background: 'rgba(255,255,255,0.15)',
          }}
        />
        <div>
          <div style={{ fontSize: 18, fontWeight: 800, color: '#fff' }}>100%</div>
          <div
            style={{
              fontSize: 11.5,
              color: 'rgba(255,255,255,0.65)',
              fontWeight: 500,
            }}
          >
            Bảo đảm thanh toán
          </div>
        </div>
      </div>
    </div>
  )
}
