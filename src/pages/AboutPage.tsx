// import React from 'react';
// import PageContent from '../components/PageContent.tsx';
// import Button from '../components/Button.tsx';

// const AboutPage: React.FC = () => {
//   return (
//     <PageContent title="About Us">
//       <p className="text-lg mb-6">
//         Plant Paradise is dedicated to providing high-quality plants and gardening essentials.
//         Our mission is to connect people with nature and foster a love for sustainable living.
//       </p>
//       <p className="text-lg mb-6">
//         We believe in nurturing growth, both in our plants and in our community.
//         Join us on this green journey!
//       </p>
//       <Button>Learn More</Button>
//     </PageContent>
//   );
// };

// export default AboutPage;


import React from 'react';
import PageContent from '../components/PageContent.tsx';
import Button from '../components/Button.tsx';
import { useTheme } from '../hooks/useTheme.ts';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Stat {
  value: string;
  label: string;
  icon: string;
}

interface TeamMember {
  name: string;
  role: string;
  avatar: string;
  bio: string;
}

interface Value {
  icon: string;
  title: string;
  description: string;
}

// ─── Static Data ──────────────────────────────────────────────────────────────

const STATS: Stat[] = [
  { value: '10K+', label: 'Delivered', icon: '🌿' },
  { value: '4.9★', label: 'Average Rating',   icon: '⭐' },
  { value: '50+',  label: ' Varieties',  icon: '🌸' },
  { value: '5 yrs', label: 'In Business',     icon: '🏡' },
];

const VALUES: Value[] = [
  {
    icon: '♻️',
    title: 'Sustainability',
    description: 'Every order is packed with recycled materials. We offset 100% of our shipping emissions.',
  },
  {
    icon: '🌱',
    title: 'Quality First',
    description: 'Each plant is hand-selected, nurtured in our greenhouse, and shipped only when it is ready.',
  },
  {
    icon: '🤝',
    title: 'Community',
    description: 'We partner with local growers and donate 1% of revenue to urban greening projects.',
  },
];

const TEAM: TeamMember[] = [
  {
    name: 'vikrant ',
    role: 'Founder & Head Botanist',
    avatar: '🧑‍🌾',
    bio: '15 years of horticultural expertise, passionate about rare tropical species.',
  },
  {
    name: 'vishal',
    role: 'Head of Sustainability',
    avatar: '🌍',
    bio: 'Environmental scientist turned plant entrepreneur. Champion of zero-waste packaging.',
  },
  {
    name: 'chirag',
    role: 'Customer Experience Lead',
    avatar: '💬',
    bio: 'Ensures every customer feels supported from first purchase to thriving plant.',
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

const StatCard: React.FC<Stat & { textClass: string; cardClass: string }> = ({
  value, label, icon, textClass, cardClass,
}) => (
  <div className={`flex flex-col items-center gap-1 p-5 rounded-xl text-center ${cardClass}`}>
    <span className="text-2xl" aria-hidden="true">{icon}</span>
    <span className={`text-2xl font-bold tabular-nums ${textClass}`}>{value}</span>
    <span className={`text-xs opacity-60 ${textClass}`}>{label}</span>
  </div>
);

const ValueCard: React.FC<Value & { textClass: string; cardClass: string }> = ({
  icon, title, description, textClass, cardClass,
}) => (
  <div className={`flex flex-col gap-3 p-6 rounded-xl ${cardClass}`}>
    <span className="text-3xl" aria-hidden="true">{icon}</span>
    <h3 className={`text-base font-semibold ${textClass}`}>{title}</h3>
    <p className={`text-sm leading-relaxed opacity-60 ${textClass}`}>{description}</p>
  </div>
);

const TeamCard: React.FC<TeamMember & { textClass: string; cardClass: string }> = ({
  name, role, avatar, bio, textClass, cardClass,
}) => (
  <div className={`flex flex-col items-center text-center gap-3 p-6 rounded-xl ${cardClass}`}>
    <span className="text-4xl" aria-hidden="true">{avatar}</span>
    <div>
      <p className={`text-sm font-semibold ${textClass}`}>{name}</p>
      <p className={`text-xs opacity-50 ${textClass}`}>{role}</p>
    </div>
    <p className={`text-xs leading-relaxed opacity-60 ${textClass}`}>{bio}</p>
  </div>
);

// ─── Page ─────────────────────────────────────────────────────────────────────

const AboutPage: React.FC = () => {
  const { theme } = useTheme();
  const { text, cardBg } = theme.colors;

  return (
    <PageContent title="About Us">

      {/* ── Hero blurb ── */}
      <section aria-labelledby="about-intro" className="max-w-2xl mb-10">
        <p id="about-intro" className={`text-lg leading-relaxed mb-4 opacity-80 ${text}`}>
          Plant Paradise is dedicated to providing high-quality plants and gardening
          essentials. Our mission is to connect people with nature and foster a love
          for sustainable living.
        </p>
        <p className={`text-lg leading-relaxed mb-6 opacity-80 ${text}`}>
          We believe in nurturing growth — in our plants and in our community.
          Join us on this green journey.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button variant="solid" size="md">
            Shop Plants
          </Button>
          <Button variant="outline" size="md">
            Our Story
          </Button>
        </div>
      </section>

      {/* ── Stats ── */}
      <section aria-label="Key statistics" className="mb-12">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {STATS.map((stat) => (
            <StatCard key={stat.label} {...stat} textClass={text} cardClass={cardBg} />
          ))}
        </div>
      </section>

      {/* ── Values ── */}
      <section aria-labelledby="values-heading" className="mb-12">
        <h2
          id="values-heading"
          className={`text-xl font-semibold mb-6 ${text} ${theme.fonts?.heading ?? ''}`}
        >
          What We Stand For
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {VALUES.map((v) => (
            <ValueCard key={v.title} {...v} textClass={text} cardClass={cardBg} />
          ))}
        </div>
      </section>

      {/* ── Team ── */}
      <section aria-labelledby="team-heading" className="mb-12">
        <h2
          id="team-heading"
          className={`text-xl font-semibold mb-6 ${text} ${theme.fonts?.heading ?? ''}`}
        >
          Meet the Team
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {TEAM.map((member) => (
            <TeamCard key={member.name} {...member} textClass={text} cardClass={cardBg} />
          ))}
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section
        aria-label="Call to action"
        className={`rounded-2xl p-8 text-center ${cardBg}`}
      >
        <p className={`text-2xl font-bold mb-2 ${text} ${theme.fonts?.heading ?? ''}`}>
          Ready to grow? 🌱
        </p>
        <p className={`text-sm opacity-60 mb-6 ${text}`}>
          Browse our curated collection and find your next favourite plant.
        </p>
        <Button variant="solid" size="lg">
          Explore the Shop
        </Button>
      </section>

    </PageContent>
  );
};

export default AboutPage;