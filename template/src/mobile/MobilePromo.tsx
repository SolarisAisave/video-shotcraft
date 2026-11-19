import { AbsoluteFill, Easing, interpolate, Sequence, useCurrentFrame } from 'remotion';

/**
 * Mobile-readable revision of the Ink Press promo.
 * The original composition `AiflPromo` is unchanged and remains the baseline.
 *
 * Every essential line is at least 64px in this 1920×1080 frame, which is
 * 12px when the frame is viewed 360px wide. Primary lines are larger.
 * Dense page screenshots and decorative microtext are not used.
 * Copy is the template's existing fictional demo identity, shortened only
 * where a full line cannot stay large.
 */

const INK = '#13110f';
const AMBER = '#955905';
const PAPER = '#f2eee6';
const CARD = '#fffcf7';
const SERIF = 'ui-serif, Georgia, "Times New Roman", serif';
const SANS = 'ui-sans-serif, system-ui, sans-serif';

const clamp = { extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const };
const EASE = Easing.bezier(0.16, 1, 0.3, 1);

export const MOBILE_SHOTS = [
  { id: 'ink', from: 0, duration: 100 },
  { id: 'hero', from: 100, duration: 130 },
  { id: 'title1', from: 230, duration: 92 },
  { id: 'deal', from: 322, duration: 150 },
  { id: 'search', from: 472, duration: 130 },
  { id: 'title2', from: 602, duration: 92 },
  { id: 'radar', from: 694, duration: 120 },
  { id: 'weekly', from: 814, duration: 140 },
  { id: 'outro', from: 954, duration: 126 },
] as const;

export const MOBILE_TOTAL = MOBILE_SHOTS.reduce((sum, shot) => sum + shot.duration, 0);

const rise = (frame: number, start: number, dur = 14) =>
  interpolate(frame, [start, start + dur], [0, 1], { ...clamp, easing: EASE });

const fadeOut = (frame: number, duration: number, fade = 8) =>
  interpolate(frame, [duration - fade, duration], [1, 0], clamp);

const PaperStage: React.FC<{ children: React.ReactNode; opacity?: number }> = ({ children, opacity = 1 }) => (
  <AbsoluteFill
    style={{
      backgroundColor: PAPER,
      opacity,
      overflow: 'hidden',
      backgroundImage: 'radial-gradient(1100px 720px at 50% 42%, rgba(255,250,240,0.9), transparent 68%)',
    }}
  >
    {children}
  </AbsoluteFill>
);

type W = { t: string; accent?: boolean };

const Words: React.FC<{
  lines: W[][];
  frame: number;
  size: number;
  delay?: number;
  step?: number;
  align?: 'center' | 'left';
}> = ({ lines, frame, size, delay = 4, step = 4, align = 'center' }) => {
  let i = 0;
  return (
    <div style={{ textAlign: align, maxWidth: 1680 }}>
      {lines.map((line, li) => (
        <div key={li} style={{ lineHeight: 1.08 }}>
          {line.map((w) => {
            const d = delay + i * step;
            i += 1;
            const t = rise(frame, d, 12);
            return (
              <span
                key={`${li}-${w.t}`}
                style={{
                  display: 'inline-block',
                  marginRight: '0.28em',
                  fontFamily: SERIF,
                  fontWeight: 600,
                  fontSize: size,
                  color: w.accent ? AMBER : INK,
                  fontStyle: w.accent ? 'italic' : 'normal',
                  opacity: t,
                  transform: `translateY(${(1 - t) * 36}px)`,
                  filter: `blur(${(1 - t) * 6}px)`,
                }}
              >
                {w.t}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};

const Rule: React.FC<{ frame: number; start: number; width?: number }> = ({ frame, start, width = 220 }) => {
  const t = rise(frame, start, 16);
  return (
    <div
      style={{
        height: 12,
        width,
        borderRadius: 6,
        background: AMBER,
        transform: `scaleX(${t})`,
        transformOrigin: 'center',
        margin: '28px auto 0',
      }}
    />
  );
};

const InkOpen: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const kicker = rise(frame, 34, 14);
  const vDraw = interpolate(frame, [0, 14], [100, 0], clamp);
  const hDraw = interpolate(frame, [8, 22], [100, 0], clamp);
  return (
    <PaperStage opacity={fadeOut(frame, duration)}>
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', padding: '0 120px' }}>
        <svg width={88} height={88} viewBox="0 0 64 64" style={{ display: 'block', marginBottom: 28 }}>
          <line x1={32} y1={2} x2={32} y2={62} stroke={AMBER} strokeWidth={6} strokeLinecap="round" pathLength={100} strokeDasharray={100} strokeDashoffset={vDraw} />
          <line x1={2} y1={32} x2={62} y2={32} stroke={AMBER} strokeWidth={6} strokeLinecap="round" pathLength={100} strokeDasharray={100} strokeDashoffset={hDraw} />
        </svg>
        <Words
          frame={frame}
          size={120}
          delay={12}
          lines={[[{ t: 'AI' }, { t: 'Foundation' }, { t: 'Lab' }]]}
        />
        <Rule frame={frame} start={28} />
        <div
          style={{
            marginTop: 32,
            fontFamily: SANS,
            fontSize: 68,
            letterSpacing: '0.08em',
            color: INK,
            opacity: kicker,
            transform: `translateY(${(1 - kicker) * 16}px)`,
          }}
        >
          TEAM RESEARCH CONSOLE
        </div>
      </AbsoluteFill>
    </PaperStage>
  );
};

const Hero: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const enter = rise(frame, 0, 16);
  const lift = rise(frame, 22, 16);
  const reseat = rise(frame, 84, 16);
  const hover = lift * (1 - reseat);
  const note = rise(frame, 34, 12);
  const beam = interpolate(frame, [30, 82], [140, -980], clamp);
  const y = (1 - enter) * 90 - hover * 42;
  return (
    <PaperStage opacity={fadeOut(frame, duration)}>
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div
          style={{
            width: 1560,
            height: 460,
            position: 'relative',
            opacity: enter,
            transform: `translateY(${y}px)`,
            filter: `drop-shadow(0 ${22 + hover * 28}px ${40 + hover * 24}px rgba(19,17,15,${0.12 + hover * 0.12}))`,
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: CARD,
              borderRadius: 36,
              display: 'flex',
              overflow: 'hidden',
            }}
          >
            <div style={{ width: 22, background: AMBER, flex: 'none' }} />
            <div style={{ padding: '64px 64px 56px' }}>
              <div style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 80, color: INK, lineHeight: 1.08 }}>
                Confidence-routed model cascade
              </div>
              <div style={{ marginTop: 28, fontFamily: SERIF, fontWeight: 600, fontSize: 68, lineHeight: 1.12, opacity: note }}>
                <span style={{ color: INK }}>One card, </span>
                <span style={{ color: AMBER, fontStyle: 'italic' }}>one project.</span>
              </div>
            </div>
          </div>
          <svg width={1560} height={460} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
            <rect
              x={10}
              y={10}
              width={1540}
              height={440}
              rx={32}
              fill="none"
              stroke={AMBER}
              strokeWidth={14}
              strokeDasharray="780 2200"
              strokeDashoffset={beam}
              opacity={hover}
            />
          </svg>
        </div>
      </AbsoluteFill>
    </PaperStage>
  );
};

const TitleCard: React.FC<{ duration: number; lines: W[][]; size?: number }> = ({ duration, lines, size = 92 }) => {
  const frame = useCurrentFrame();
  return (
    <PaperStage opacity={fadeOut(frame, duration)}>
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', padding: '0 120px' }}>
        <Words frame={frame} size={size} lines={lines} step={5} />
        <Rule frame={frame} start={18} />
      </AbsoluteFill>
    </PaperStage>
  );
};

const Deal: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const aIn = rise(frame, 0, 16);
  const bIn = rise(frame, 8, 16);
  const hand = interpolate(frame, [46, 78], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const aFade = hand <= 0.4 ? 1 : 1 - (hand - 0.4) / 0.6;
  const card = (title: string, opacity: number, x: number, y: number, depth: number, rot = 0) => (
    <div
      style={{
        position: 'absolute',
        left: 200 + x,
        top: y,
        width: 1520,
        height: 300,
        background: CARD,
        borderRadius: 32,
        boxShadow: `0 ${16 + depth * 20}px ${36 + depth * 24}px rgba(19,17,15,${0.1 + depth * 0.08})`,
        display: 'flex',
        alignItems: 'center',
        padding: '0 56px',
        opacity,
        transform: `rotate(${rot}deg)`,
      }}
    >
      <div style={{ width: 20, alignSelf: 'stretch', background: AMBER, borderRadius: 8, margin: '36px 0', marginRight: 36 }} />
      <div style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 76, color: INK, lineHeight: 1.08 }}>{title}</div>
    </div>
  );
  return (
    <PaperStage opacity={fadeOut(frame, duration)}>
      {card(
        'Sensor drift early-warning',
        bIn,
        (1 - bIn) * 80,
        560 - hand * 380,
        hand,
      )}
      {card(
        'Self-healing CI triage router',
        aIn * aFade,
        (1 - aIn) * 240 - hand * 520,
        160 - hand * 160,
        1 - hand,
        -hand * 8,
      )}
    </PaperStage>
  );
};

const Search: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const query = 'nano-lab';
  const typed = Math.max(0, Math.min(query.length, Math.floor((frame - 10) / 3)));
  const caretOn = Math.floor(frame / 8) % 2 === 0;
  const filter = rise(frame, 42, 18);
  const row = (title: string, y: number, opacity: number, x: number, selected: number) => (
    <div
      style={{
        position: 'absolute',
        left: 140 + x,
        top: y,
        width: 1640,
        height: 210,
        background: CARD,
        borderRadius: 28,
        boxShadow: selected > 0.5 ? `0 0 0 14px ${AMBER}` : '0 16px 40px rgba(19,17,15,0.1)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 48px',
        opacity,
      }}
    >
      <div style={{ width: 18, height: 92, background: AMBER, borderRadius: 8, marginRight: 32, opacity: 0.35 + selected * 0.65 }} />
      <div style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 68, color: INK, lineHeight: 1.08 }}>{title}</div>
    </div>
  );
  return (
    <PaperStage opacity={fadeOut(frame, duration)}>
      <div
        style={{
          position: 'absolute',
          left: 140,
          top: 120,
          width: 1640,
          height: 150,
          borderRadius: 75,
          background: CARD,
          boxShadow: '0 16px 40px rgba(19,17,15,0.1)',
          display: 'flex',
          alignItems: 'center',
          padding: '0 52px',
          fontFamily: SERIF,
          fontWeight: 600,
          fontSize: 72,
          color: INK,
        }}
      >
        <span>{query.slice(0, typed)}</span>
        <span style={{ width: 5, height: 64, marginLeft: 8, background: AMBER, opacity: caretOn ? 1 : 0 }} />
      </div>
      {row('nano-lab: automated research loop', 340 - filter * 0, 1, 0, filter)}
      {row('Long-horizon coding arena', 580, 1 - filter, filter * 520, 0)}
    </PaperStage>
  );
};

const TitleRadar: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const digit = rise(frame, 18, 18);
  const sub = rise(frame, 28, 14);
  const h = 168;
  return (
    <PaperStage opacity={fadeOut(frame, duration)}>
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', padding: '0 120px' }}>
        <Words
          frame={frame}
          size={88}
          lines={[
            [{ t: 'Paper' }, { t: 'Radar,', accent: true }],
            [{ t: 'tailored' }, { t: 'for' }, { t: 'your' }, { t: 'morning' }, { t: 'reading.' }],
          ]}
          step={4}
        />
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 22, marginTop: 36, opacity: sub }}>
          <span style={{ display: 'inline-block', height: h, overflow: 'hidden', width: 110 }}>
            <span style={{ display: 'block', transform: `translateY(${-digit * 5 * h}px)` }}>
              {['0', '1', '2', '3', '4', '5'].map((n) => (
                <span
                  key={n}
                  style={{
                    display: 'flex',
                    height: h,
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: SERIF,
                    fontWeight: 600,
                    fontSize: 150,
                    color: AMBER,
                    lineHeight: 1,
                  }}
                >
                  {n}
                </span>
              ))}
            </span>
          </span>
          <span style={{ fontFamily: SANS, fontSize: 68, letterSpacing: '0.04em', color: INK }}>
            of 31 fetched today
          </span>
        </div>
      </AbsoluteFill>
    </PaperStage>
  );
};

const Radar: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const rows = [
    { n: '01', t: 'Drift-Aware Attention' },
    { n: '02', t: 'Knowing When to Ask' },
  ];
  const land = [rise(frame, 4, 16), rise(frame, 28, 18)];
  const press = interpolate(frame, [42, 48, 58], [0, 26, 0], clamp);
  return (
    <PaperStage opacity={fadeOut(frame, duration)}>
      {rows.map((row, i) => {
        const y = 250 + i * 280 + (1 - land[i]) * -220 + (i === 0 ? press : 0);
        return (
          <div
            key={row.n}
            style={{
              position: 'absolute',
              left: 140,
              top: y,
              width: 1640,
              height: 240,
              background: CARD,
              borderRadius: 28,
              boxShadow: '0 18px 44px rgba(19,17,15,0.12)',
              display: 'flex',
              alignItems: 'center',
              padding: '0 48px',
              gap: 32,
              opacity: land[i],
            }}
          >
            <div style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 68, color: AMBER, width: 110 }}>{row.n}</div>
            <div style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 76, color: INK, lineHeight: 1.08 }}>{row.t}</div>
          </div>
        );
      })}
    </PaperStage>
  );
};

const Weekly: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const open = rise(frame, 0, 14);
  const names = ['Lin', 'Marco', 'Yuki', 'Priya'];
  const popEase = Easing.bezier(0.2, 1.25, 0.3, 1);
  return (
    <PaperStage opacity={fadeOut(frame, duration)}>
      <div
        style={{
          position: 'absolute',
          left: 120,
          top: 120,
          width: 1680,
          height: 840,
          background: CARD,
          borderRadius: 32,
          boxShadow: '0 24px 60px rgba(19,17,15,0.12)',
          display: 'flex',
          overflow: 'hidden',
          opacity: open,
          transform: `translateY(${(1 - open) * 28}px)`,
        }}
      >
        <div style={{ width: 520, borderRight: '8px solid rgba(19,17,15,0.08)', padding: '36px 32px' }}>
          {names.map((name, i) => {
            const start = 20 + i * 10;
            const t = interpolate(frame, [start, start + 12], [0, 1], { ...clamp, easing: popEase });
            const bump = interpolate(frame, [start + 10, start + 14, start + 20], [1, 1.08, 1], clamp);
            const shown = Math.min(1, Math.max(0, t));
            return (
              <div
                key={name}
                style={{
                  height: 150,
                  display: 'flex',
                  alignItems: 'center',
                  fontFamily: SERIF,
                  fontWeight: 600,
                  fontSize: 68,
                  color: INK,
                  opacity: shown,
                  transform: `translateX(${(1 - shown) * 48}px) scale(${(0.94 + 0.06 * shown) * bump})`,
                }}
              >
                {name}
              </div>
            );
          })}
        </div>
        <div style={{ flex: 1, padding: '72px 64px' }}>
          <div style={{ fontFamily: SANS, fontSize: 64, letterSpacing: '0.08em', color: INK }}>WEEKLY BRIEF</div>
          <div style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 108, color: INK, lineHeight: 1.02, marginTop: 16 }}>2026-W28</div>
          <div style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 68, color: AMBER, marginTop: 18 }}>Foundation Lab Weekly</div>
        </div>
      </div>
    </PaperStage>
  );
};

const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const panel = rise(frame, 0, 12);
  const slots = [
    { t: 'Research', fromX: -280, fromY: 0, delay: 4 },
    { t: 'Radar', fromX: 0, fromY: -180, delay: 10 },
    { t: 'Weekly', fromX: 280, fromY: 0, delay: 16 },
  ];
  const mark = rise(frame, 34, 14);
  const tag = rise(frame, 48, 12);
  const cardW = 500;
  const gap = 28;
  const rowW = cardW * 3 + gap * 2;
  const left = (1920 - rowW) / 2;
  return (
    <PaperStage>
      <div
        style={{
          position: 'absolute',
          left: 100,
          top: 90,
          width: 1720,
          height: 900,
          borderRadius: 36,
          background: 'rgba(255,252,247,0.55)',
          boxShadow: '0 0 0 8px rgba(19,17,15,0.06)',
          opacity: panel,
        }}
      />
      {slots.map((slot, i) => {
        const t = rise(frame, slot.delay, 16);
        const x = left + i * (cardW + gap) + (1 - t) * slot.fromX;
        const y = 150 + (1 - t) * slot.fromY;
        return (
          <div
            key={slot.t}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              width: cardW,
              height: 200,
              background: CARD,
              borderRadius: 28,
              boxShadow: '0 16px 40px rgba(19,17,15,0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: SERIF,
              fontWeight: 600,
              fontSize: 68,
              color: INK,
              opacity: t,
            }}
          >
            {slot.t}
          </div>
        );
      })}
      <div
        style={{
          position: 'absolute',
          left,
          top: 390,
          width: rowW,
          height: 10,
          borderRadius: 5,
          background: AMBER,
          transform: `scaleX(${mark})`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 440,
          textAlign: 'center',
          opacity: mark,
          transform: `translateY(${(1 - mark) * 36}px) scale(${1.18 - 0.18 * mark})`,
        }}
      >
        <div style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 104, color: INK }}>AI Foundation Lab</div>
      </div>
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 600,
          textAlign: 'center',
          opacity: tag,
          transform: `translateY(${(1 - tag) * 20}px)`,
        }}
      >
        <div style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 68, color: INK, lineHeight: 1.15 }}>The whole team,</div>
        <div style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 68, color: INK, lineHeight: 1.15 }}>
          on the <span style={{ color: AMBER, fontStyle: 'italic' }}>same</span> page.
        </div>
      </div>
    </PaperStage>
  );
};

const SCENES: Record<(typeof MOBILE_SHOTS)[number]['id'], React.FC<{ duration: number }>> = {
  ink: InkOpen,
  hero: Hero,
  title1: ({ duration }) => (
    <TitleCard
      duration={duration}
      lines={[
        [{ t: 'All' }, { t: 'your' }, { t: 'team’s' }, { t: 'research,' }],
        [{ t: 'one', accent: true }, { t: 'place' }, { t: 'to' }, { t: 'go.' }],
      ]}
    />
  ),
  deal: Deal,
  search: Search,
  title2: TitleRadar,
  radar: Radar,
  weekly: Weekly,
  outro: () => <Outro />,
};

export const MobilePromo: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: PAPER }}>
      {MOBILE_SHOTS.map((shot) => {
        const Scene = SCENES[shot.id];
        return (
          <Sequence key={shot.id} from={shot.from} durationInFrames={shot.duration}>
            <Scene duration={shot.duration} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
