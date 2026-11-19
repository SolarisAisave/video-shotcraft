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
  const kicker = rise(frame, 30, 14);
  return (
    <PaperStage opacity={fadeOut(frame, duration)}>
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', padding: '0 120px' }}>
        <Words
          frame={frame}
          size={128}
          lines={[[{ t: 'AI' }, { t: 'Foundation' }, { t: 'Lab' }]]}
        />
        <Rule frame={frame} start={22} />
        <div
          style={{
            marginTop: 36,
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
  const t = rise(frame, 0, 18);
  const note = rise(frame, 16, 14);
  return (
    <PaperStage opacity={fadeOut(frame, duration)}>
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', padding: '0 120px' }}>
        <div
          style={{
            width: 1560,
            background: CARD,
            borderRadius: 36,
            boxShadow: '0 28px 70px rgba(19,17,15,0.14)',
            display: 'flex',
            overflow: 'hidden',
            opacity: t,
            transform: `translateY(${(1 - t) * 80}px) scale(${0.96 + 0.04 * t})`,
          }}
        >
          <div style={{ width: 28, background: AMBER, flex: 'none' }} />
          <div style={{ padding: '72px 72px 64px' }}>
            <div style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 84, color: INK, lineHeight: 1.08 }}>
              Confidence-routed model cascade
            </div>
            <div
              style={{
                marginTop: 28,
                fontFamily: SERIF,
                fontWeight: 600,
                fontSize: 72,
                lineHeight: 1.12,
                opacity: note,
              }}
            >
              <span style={{ color: INK }}>One card, </span>
              <span style={{ color: AMBER, fontStyle: 'italic' }}>one project.</span>
            </div>
          </div>
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
  const push = rise(frame, 52, 18);
  const card = (title: string, shown: number, y: number) => (
    <div
      style={{
        position: 'absolute',
        left: 160,
        right: 160,
        top: 250,
        bottom: 250,
        background: CARD,
        borderRadius: 36,
        boxShadow: '0 28px 70px rgba(19,17,15,0.14)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 80px',
        opacity: shown,
        transform: `translateY(${y}px)`,
      }}
    >
      <div style={{ width: 28, alignSelf: 'stretch', background: AMBER, borderRadius: 8, marginRight: 48 }} />
      <div style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 92, color: INK, lineHeight: 1.08 }}>
        {title}
      </div>
    </div>
  );
  return (
    <PaperStage opacity={fadeOut(frame, duration)}>
      {card('Self-healing CI triage router', aIn, (1 - aIn) * 220 - push * 960)}
      {card('Sensor drift early-warning', push, (1 - push) * 780)}
    </PaperStage>
  );
};

const Search: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const query = 'nano-lab';
  const typed = Math.max(0, Math.min(query.length, Math.floor((frame - 8) / 3)));
  const caretOn = Math.floor(frame / 8) % 2 === 0;
  const result = rise(frame, 40, 16);
  return (
    <PaperStage opacity={fadeOut(frame, duration)}>
      <AbsoluteFill style={{ padding: '180px 140px 0' }}>
        <div
          style={{
            height: 168,
            borderRadius: 84,
            background: CARD,
            boxShadow: '0 18px 48px rgba(19,17,15,0.12)',
            display: 'flex',
            alignItems: 'center',
            padding: '0 56px',
            fontFamily: SERIF,
            fontWeight: 600,
            fontSize: 80,
            color: INK,
          }}
        >
          <span>{query.slice(0, typed)}</span>
          <span style={{ width: 4, height: 72, marginLeft: 6, background: AMBER, opacity: caretOn ? 1 : 0 }} />
        </div>
        <div
          style={{
            marginTop: 48,
            background: CARD,
            borderRadius: 32,
            boxShadow: '0 22px 56px rgba(19,17,15,0.12)',
            padding: '48px 56px',
            display: 'flex',
            alignItems: 'center',
            opacity: result,
            transform: `translateY(${(1 - result) * 48}px)`,
          }}
        >
          <div style={{ width: 22, alignSelf: 'stretch', background: AMBER, borderRadius: 8, marginRight: 36 }} />
          <div style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 76, color: INK, lineHeight: 1.1 }}>
            nano-lab: automated research loop
          </div>
        </div>
      </AbsoluteFill>
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
  return (
    <PaperStage opacity={fadeOut(frame, duration)}>
      <AbsoluteFill style={{ justifyContent: 'center', padding: '0 140px' }}>
        {rows.map((row, i) => {
          const t = rise(frame, 6 + i * 16, 16);
          return (
            <div
              key={row.n}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 36,
                padding: '36px 8px',
                borderTop: i === 0 ? '8px solid rgba(19,17,15,0.18)' : 'none',
                borderBottom: '8px solid rgba(19,17,15,0.18)',
                opacity: t,
                transform: `translateY(${(1 - t) * -56}px)`,
              }}
            >
              <div style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 72, color: AMBER, width: 120 }}>{row.n}</div>
              <div style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 80, color: INK, lineHeight: 1.08 }}>{row.t}</div>
            </div>
          );
        })}
      </AbsoluteFill>
    </PaperStage>
  );
};

const Weekly: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const head = rise(frame, 0, 14);
  const names = ['Lin', 'Marco', 'Yuki', 'Priya'];
  return (
    <PaperStage opacity={fadeOut(frame, duration)}>
      <AbsoluteFill style={{ padding: '120px 160px' }}>
        <div style={{ opacity: head, transform: `translateY(${(1 - head) * 24}px)` }}>
          <div style={{ fontFamily: SANS, fontSize: 64, letterSpacing: '0.08em', color: INK }}>WEEKLY BRIEF</div>
          <div style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 120, color: INK, lineHeight: 1.02, marginTop: 8 }}>
            2026-W28
          </div>
          <div style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 68, color: AMBER, marginTop: 8 }}>
            Foundation Lab Weekly
          </div>
        </div>
        <div style={{ marginTop: 48 }}>
          {names.map((name, i) => {
            const t = rise(frame, 28 + i * 10, 12);
            return (
              <div
                key={name}
                style={{
                  fontFamily: SERIF,
                  fontWeight: 600,
                  fontSize: 84,
                  color: INK,
                  lineHeight: 1.15,
                  opacity: t,
                  transform: `translateX(${(1 - t) * 40}px)`,
                }}
              >
                {name}
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </PaperStage>
  );
};

const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const chips = [
    { t: 'Research', x: 760, y: 70, delay: 0 },
    { t: 'Radar', x: 150, y: 250, delay: 6 },
    { t: 'Weekly', x: 1380, y: 250, delay: 10 },
  ];
  const mark = rise(frame, 26, 14);
  const tag = rise(frame, 42, 14);
  return (
    <PaperStage>
      {chips.map((c) => {
        const t = rise(frame, c.delay, 16);
        return (
          <div
            key={c.t}
            style={{
              position: 'absolute',
              left: c.x,
              top: c.y,
              background: CARD,
              borderRadius: 24,
              boxShadow: '0 16px 40px rgba(19,17,15,0.12)',
              padding: '22px 36px',
              fontFamily: SERIF,
              fontWeight: 600,
              fontSize: 76,
              color: INK,
              opacity: t,
              transform: `translateY(${(1 - t) * 36}px)`,
            }}
          >
            {c.t}
          </div>
        );
      })}
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', paddingTop: 80 }}>
        <div
          style={{
            fontFamily: SERIF,
            fontWeight: 600,
            fontSize: 116,
            color: INK,
            opacity: mark,
            transform: `scale(${1.16 - 0.16 * mark})`,
          }}
        >
          AI Foundation Lab
        </div>
        <div style={{ width: 220, height: 12, borderRadius: 6, background: AMBER, marginTop: 22, opacity: mark }} />
        <div style={{ marginTop: 28, textAlign: 'center', opacity: tag, transform: `translateY(${(1 - tag) * 16}px)` }}>
          <div style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 72, color: INK, lineHeight: 1.12 }}>
            The whole team,
          </div>
          <div style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 72, color: INK, lineHeight: 1.12 }}>
            on the <span style={{ color: AMBER, fontStyle: 'italic' }}>same</span> page.
          </div>
        </div>
      </AbsoluteFill>
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
