import { ImageResponse } from 'next/og';

export const alt = 'Neaz Md. Morshed - Virtual Assistant & Outsourcing Expert';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '0 90px',
          background: 'linear-gradient(135deg, #F8F9FF 0%, #E4E9FF 100%)',
          color: '#05100B',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 36 }}>
          <div
            style={{
              width: 84,
              height: 84,
              borderRadius: 22,
              background: '#5777FF',
              color: '#fff',
              fontSize: 40,
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            NM
          </div>
          <div style={{ marginLeft: 24, fontSize: 30, color: '#3D5BEF', fontWeight: 700 }}>neazmdmorshed.com</div>
        </div>
        <div style={{ fontSize: 88, fontWeight: 800, lineHeight: 1.05 }}>Neaz Md. Morshed</div>
        <div style={{ fontSize: 44, marginTop: 18, color: '#3D5BEF', fontWeight: 700 }}>
          Virtual Assistant & Outsourcing Expert
        </div>
        <div style={{ fontSize: 30, marginTop: 34, color: '#4A5568' }}>
          Web Design · Video Editing · Social Media Marketing · Admin Support
        </div>
      </div>
    ),
    size
  );
}
