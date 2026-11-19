import { AbsoluteFill, Easing, interpolate, Sequence, useCurrentFrame } from 'remotion';

/**
 * Separate proof: Su Shi, 定风波, as a short ink-on-paper animation.
 * AiflPromo and AiflPromoMobile are not used here.
 * On-screen copy is only the verse lines below. No figure walks.
 * Drawn with code. The face is the system font WenQuanYi Micro Hei.
 */

const PAPER = '#efe4d2';
const INK = '#1c1915';
const FONT = '"WenQuanYi Micro Hei", "Droid Sans Fallback", sans-serif';

const FADE = 12;
const SCENE_DUR = 140;
const STEP = SCENE_DUR - FADE;

const LINES = [
  '莫听穿林打叶声',
  '何妨吟啸且徐行',
  '竹杖芒鞋轻胜马',
  '一蓑烟雨任平生',
  '回首向来萧瑟处',
  '也无风雨也无晴',
] as const;

export const POEM_TOTAL = SCENE_DUR * LINES.length - FADE * (LINES.length - 1);

const clamp = { extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const };

const hash = (n: number) => {
  const x = Math.sin(n * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};

const sceneOpacity = (frame: number, duration: number, last: boolean) => {
  const inn = interpolate(frame, [0, FADE], [0, 1], clamp);
  if (last) return inn;
  return Math.min(inn, interpolate(frame, [duration - FADE, duration], [1, 0], clamp));
};

const Line: React.FC<{ text: string; frame: number; duration: number; top: number; last: boolean; align?: 'left' }> = ({
  text,
  frame,
  duration,
  top,
  last,
  align,
}) => {
  const inn = interpolate(frame, [18, 34], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const out = last ? 1 : interpolate(frame, [duration - 32, duration - 18], [1, 0], clamp);
  const shown = Math.min(inn, out);
  return (
    <div
      style={{
        position: 'absolute',
        top,
        left: align === 'left' ? 120 : 0,
        right: align === 'left' ? undefined : 0,
        width: align === 'left' ? 900 : undefined,
        textAlign: align === 'left' ? 'left' : 'center',
        fontFamily: FONT,
        fontSize: 108,
        fontWeight: 400,
        color: INK,
        letterSpacing: '0.04em',
        lineHeight: 1.15,
        opacity: shown,
        transform: `translateY(${(1 - inn) * 16}px)`,
        textShadow: '0 0 12px #efe4d2, 0 0 22px #efe4d2, 0 0 4px #efe4d2',
      }}
    >
      {text}
    </div>
  );
};

const Culm: React.FC<{ x: number; height: number; width: number; lean: number; shade: number }> = ({
  x,
  height,
  width,
  lean,
  shade,
}) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      bottom: -30,
      width,
      height,
      transform: `rotate(${lean}deg)`,
      transformOrigin: '50% 100%',
    }}
  >
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: `rgba(22,32,26,${shade})`,
        borderRadius: width,
      }}
    />
    {[0.2, 0.4, 0.6, 0.78].map((p) => (
      <div
        key={p}
        style={{
          position: 'absolute',
          left: -width * 0.28,
          top: height * p,
          width: width * 1.56,
          height: Math.max(4, width * 0.16),
          borderRadius: 4,
          background: `rgba(18,26,20,${Math.min(1, shade + 0.12)})`,
        }}
      />
    ))}
    <div style={{ position: 'absolute', left: width * 0.3, top: 36, width: 110, height: 12, borderRadius: 12, background: `rgba(22,32,26,${shade})`, transform: 'rotate(-38deg)', transformOrigin: '0 50%' }} />
    <div style={{ position: 'absolute', left: width * 0.3, top: 58, width: 86, height: 10, borderRadius: 10, background: `rgba(22,32,26,${shade})`, transform: 'rotate(28deg)', transformOrigin: '0 50%' }} />
    <div style={{ position: 'absolute', left: -78, top: 70, width: 96, height: 10, borderRadius: 10, background: `rgba(22,32,26,${shade})`, transform: 'rotate(148deg)', transformOrigin: '100% 50%' }} />
  </div>
);

const Rain: React.FC<{ frame: number; amount: number }> = ({ frame, amount }) => {
  if (amount <= 0.02) return null;
  const drops = [];
  for (let i = 0; i < 48; i++) {
    const speed = 16 + hash(i + 20) * 20;
    const len = 18 + hash(i + 80) * 26;
    const y = ((hash(i + 140) * 1400 + frame * speed) % (1200 + len)) - 80;
    const x = hash(i + 3) * 2000 - 40;
    drops.push(
      <div
        key={i}
        style={{
          position: 'absolute',
          left: x,
          top: y,
          width: 2,
          height: len,
          opacity: amount,
          background: 'linear-gradient(to bottom, rgba(36,44,42,0), rgba(36,44,42,0.62))',
          transform: 'rotate(12deg)',
        }}
      />
    );
  }
  return <>{drops}</>;
};

const Ground: React.FC<{ darkness?: number }> = ({ darkness = 0.08 }) => (
  <div
    style={{
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      height: 280,
      background: `linear-gradient(to top, rgba(28,25,21,${darkness}), rgba(28,25,21,0))`,
    }}
  />
);

const Grove: React.FC<{ frame: number }> = ({ frame }) => (
  <AbsoluteFill>
    <Ground darkness={0.1} />
    <AbsoluteFill style={{ transform: `translateX(${-frame * 0.45}px)` }}>
      {[90, 280, 470, 690, 920, 1140, 1380, 1620, 1860].map((x, i) => (
        <Culm key={x} x={x} height={620 + (i % 3) * 80} width={14} lean={-2 + (i % 4)} shade={0.22} />
      ))}
    </AbsoluteFill>
    <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
      <polygon points="820,1080 1100,1080 1020,760 900,760" fill="rgba(28,25,21,0.1)" />
      <line x1="960" y1="760" x2="960" y2="1080" stroke={INK} strokeWidth="3" opacity="0.28" />
    </svg>
    <AbsoluteFill style={{ transform: `translateX(${-frame * 1.05}px)` }}>
      {[160, 540, 980, 1420, 1760].map((x, i) => (
        <Culm key={x} x={x} height={860 + (i % 2) * 70} width={26} lean={i % 2 === 0 ? -3 : 2} shade={0.55} />
      ))}
    </AbsoluteFill>
    <Rain frame={frame} amount={1} />
    <Culm x={30} height={980} width={36} lean={-4} shade={0.88} />
    <Culm x={1760} height={940} width={32} lean={3} shade={0.82} />
    {[0, 1, 2].map((i) => {
      const y = ((frame * (3 + i) + i * 240) % 900) + 40;
      const x = 420 + i * 380 + frame * 0.6;
      return (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: x,
            top: y,
            width: 46,
            height: 14,
            borderRadius: 12,
            background: 'rgba(22,32,26,0.55)',
            transform: `rotate(${20 + i * 30}deg)`,
          }}
        />
      );
    })}
  </AbsoluteFill>
);

const Road: React.FC<{ frame: number; rush: number; rain: number; sun: number }> = ({ frame, rush, rain, sun }) => {
  const stones = [];
  for (let i = 0; i < 6; i++) {
    const raw = (hash(i + 9) + frame * 0.012 * rush) % 1;
    const p = raw < 0 ? raw + 1 : raw;
    const depth = p * p;
    const y = 300 + depth * 780;
    const side = i % 2 === 0 ? -1 : 1;
    const x = 960 + side * (70 + depth * 560);
    stones.push(
      <ellipse key={i} cx={x} cy={y} rx={10 + depth * 28} ry={6 + depth * 12} fill="rgba(28,25,21,0.28)" />
    );
  }
  return (
    <AbsoluteFill>
      <div
        style={{
          position: 'absolute',
          left: 1180,
          top: 160,
          width: 220,
          height: 220,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(240,217,160,0.95), rgba(240,217,160,0) 70%)',
          opacity: sun,
        }}
      />
      <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
        <polygon points="760,300 1160,300 1760,1080 160,1080" fill="rgba(28,25,21,0.07)" />
        <line x1="760" y1="300" x2="160" y2="1080" stroke={INK} strokeWidth="6" opacity="0.45" />
        <line x1="1160" y1="300" x2="1760" y2="1080" stroke={INK} strokeWidth="6" opacity="0.45" />
        <line
          x1="960"
          y1="300"
          x2="960"
          y2="1080"
          stroke={INK}
          strokeWidth="4"
          opacity="0.35"
          strokeDasharray="26 34"
          strokeDashoffset={-frame * 18 * rush}
        />
        {stones}
      </svg>
      <AbsoluteFill style={{ transform: `translateX(${-frame * 1.4 * Math.abs(rush)}px)` }}>
        <Culm x={40} height={760} width={30} lean={-6} shade={0.7} />
        <Culm x={180} height={640} width={18} lean={-2} shade={0.4} />
      </AbsoluteFill>
      <AbsoluteFill style={{ transform: `translateX(${frame * 1.4 * Math.abs(rush)}px)` }}>
        <Culm x={1680} height={800} width={30} lean={5} shade={0.7} />
        <Culm x={1500} height={600} width={16} lean={2} shade={0.38} />
      </AbsoluteFill>
      <Rain frame={frame} amount={rain} />
    </AbsoluteFill>
  );
};

const Staff: React.FC<{ frame: number }> = ({ frame }) => {
  const drip = 300 + ((frame * 7) % 420);
  return (
    <AbsoluteFill>
      <Ground darkness={0.12} />
      <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
        <line x1="1180" y1="860" x2="1360" y2="250" stroke={INK} strokeWidth="22" strokeLinecap="round" />
        {[360, 500, 640, 780].map((y) => (
          <line key={y} x1={1288 - (860 - y) * 0.15} y1={y} x2={1328 - (860 - y) * 0.15} y2={y} stroke={INK} strokeWidth="8" strokeLinecap="round" />
        ))}
        <line x1="1336" y1={drip} x2="1342" y2={drip + 28} stroke={INK} strokeWidth="3" opacity="0.45" />
        <ellipse cx="1120" cy="900" rx="70" ry="22" fill="rgba(28,25,21,0.16)" />
        <g transform="translate(1500,860) rotate(-16)">
          <ellipse cx="0" cy="0" rx="120" ry="40" fill="#e7dcc4" stroke={INK} strokeWidth="8" />
          <path d="M-88,0 H88 M-70,-16 H70 M-70,16 H70" fill="none" stroke={INK} strokeWidth="3" opacity="0.45" />
          <path d="M-36,-30 Q0,-4 36,-30" fill="none" stroke={INK} strokeWidth="8" />
        </g>
        <g transform="translate(1700,940) rotate(14)">
          <ellipse cx="0" cy="0" rx="108" ry="36" fill="#e7dcc4" stroke={INK} strokeWidth="8" />
          <path d="M-78,0 H78 M-62,-14 H62 M-62,14 H62" fill="none" stroke={INK} strokeWidth="3" opacity="0.45" />
          <path d="M-30,-26 Q0,-2 30,-26" fill="none" stroke={INK} strokeWidth="8" />
        </g>
      </svg>
      <Rain frame={frame} amount={0.85} />
    </AbsoluteFill>
  );
};

const Cloak: React.FC<{ frame: number }> = ({ frame }) => {
  const sway = Math.sin(frame / 9) * 2.4;
  const straws = [];
  for (let i = 0; i < 15; i++) {
    const x = -150 + i * 22;
    const len = 300 - Math.abs(i - 7) * 10;
    straws.push(
      <line key={i} x1={x} y1={40} x2={x + (i - 7) * 3} y2={40 + len} stroke={INK} strokeWidth="4" opacity="0.75" />
    );
  }
  return (
    <AbsoluteFill>
      <Ground darkness={0.14} />
      <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
        <g transform={`translate(960,210) rotate(${sway})`}>
          <line x1="-620" y1="0" x2="620" y2="0" stroke={INK} strokeWidth="16" strokeLinecap="round" />
          <circle cx="0" cy="18" r="10" fill={INK} />
          <path d="M-180,34 C-250,170 -210,340 -90,430" fill="none" stroke={INK} strokeWidth="7" />
          <path d="M180,34 C250,170 210,340 90,430" fill="none" stroke={INK} strokeWidth="7" />
          <path d="M-160,46 Q0,16 160,46" fill="none" stroke={INK} strokeWidth="6" />
          {straws}
        </g>
        {[0, 1, 2].map((i) => {
          const r = 12 + ((frame * 2 + i * 46) % 46);
          return <circle key={i} cx={620 + i * 340} cy={1020} r={r} fill="none" stroke={INK} strokeWidth="3" opacity={0.4 * (1 - r / 64)} />;
        })}
      </svg>
      <Rain frame={frame} amount={1} />
    </AbsoluteFill>
  );
};

const Calm: React.FC<{ frame: number }> = ({ frame }) => (
  <AbsoluteFill>
    <div
      style={{
        position: 'absolute',
        left: 1240 + frame * 0.15,
        top: 150,
        width: 260,
        height: 260,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(240,217,160,0.95), rgba(240,217,160,0) 68%)',
      }}
    />
    <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
      <path d="M0,760 C280,700 520,730 820,690 C1140,640 1460,710 1920,670 L1920,1080 L0,1080 Z" fill="rgba(28,25,21,0.08)" />
      <polygon points="860,720 1060,720 1320,1080 600,1080" fill="rgba(255,250,240,0.38)" />
      <line x1="860" y1="720" x2="600" y2="1080" stroke={INK} strokeWidth="5" />
      <line x1="1060" y1="720" x2="1320" y2="1080" stroke={INK} strokeWidth="5" />
      <line x1="960" y1="730" x2="960" y2="1040" stroke={INK} strokeWidth="3" opacity="0.28" />
      <ellipse cx="1280" cy="920" rx="180" ry="24" fill="none" stroke={INK} strokeWidth="4" opacity="0.32" />
    </svg>
    <div
      style={{
        position: 'absolute',
        left: 80 + frame * 0.5,
        top: 640,
        width: 760,
        height: 70,
        borderRadius: 40,
        background: 'rgba(255,250,240,0.28)',
      }}
    />
    <Culm x={300} height={420} width={16} lean={-2} shade={0.35} />
  </AbsoluteFill>
);

const SceneBody: React.FC<{ index: number; frame: number }> = ({ index, frame }) => {
  if (index === 0) return <Grove frame={frame} />;
  if (index === 1) return <Road frame={frame} rush={1} rain={0.9} sun={0} />;
  if (index === 2) return <Staff frame={frame} />;
  if (index === 3) return <Cloak frame={frame} />;
  if (index === 4) {
    const clear = interpolate(frame, [0, 110], [0, 1], clamp);
    return (
      <AbsoluteFill>
        <Road frame={frame} rush={-0.35} rain={1 - clear} sun={clear} />
        <div
          style={{
            position: 'absolute',
            left: 560 + clear * 460,
            top: 188,
            width: 480,
            height: 120,
            borderRadius: 80,
            background: 'rgba(28,25,21,0.13)',
          }}
        />
      </AbsoluteFill>
    );
  }
  return <Calm frame={frame} />;
};

const TOPS = [620, 72, 150, 780, 64, 250];

const Scene: React.FC<{ index: number; duration: number; last: boolean }> = ({ index, duration, last }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ opacity: sceneOpacity(frame, duration, last), overflow: 'hidden' }}>
      <SceneBody index={index} frame={frame} />
      <Line text={LINES[index]} frame={frame} duration={duration} top={TOPS[index]} last={last} align={index === 2 ? 'left' : undefined} />
    </AbsoluteFill>
  );
};

export const DingFengBo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: PAPER, overflow: 'hidden' }}>
      <AbsoluteFill
        style={{
          backgroundImage: 'radial-gradient(900px 640px at 50% 40%, rgba(255,250,240,0.65), transparent 70%)',
        }}
      />
      {LINES.map((line, i) => (
        <Sequence key={line} from={i * STEP} durationInFrames={SCENE_DUR}>
          <Scene index={i} duration={SCENE_DUR} last={i === LINES.length - 1} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
