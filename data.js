/* Pathline prototype — dummy data.
   The job description is Nectar Social's public posting. Everything else
   (candidates, numbers, replies, transcripts, grades) is fictional. */
window.PL = window.PL || {};
PL.D = {};
(function (D) {

D.TODAY = 'Sep 23, 2026';
D.JD_URL = 'https://jobs.ashbyhq.com/nectar-social/13fe18ab-1548-4984-9f07-462343dda990';

D.JD_TEXT = `Product Manager, AI
Nectar Social · Palo Alto, CA · Hybrid · Full time
$170K – $225K · Offers equity · Offers bonus

ABOUT US
We're living through a fundamental shift in how people discover, evaluate, and purchase products. The next generation doesn't respond to traditional marketing -- they build relationships with brands through authentic social interactions, seek recommendations from communities they trust, and expect personalized experiences that feel human, not corporate.

At Nectar Social, we're building the AI-native social operating system that enables this new era of commerce. We believe every social interaction should deepen the relationship between brands and their communities while creating genuine value for both sides.

Founded by ex-Meta product and engineering leaders, we've raised over $30M in total capital from investors including GV and True Ventures. We work with brands like Oura Health, Caraway, e.l.f. Cosmetics, Kosas, OLIPOP, and many more.

THE ROLE
We're looking for a Senior Product Manager, AI to lead the development of AI-powered capabilities across Nectar's platform. In this role, you'll own the strategy and execution behind features that leverage generative AI, automation, and data-driven decision systems to help brands manage social engagement, community, and creator relationships.

WHAT YOU'LL BE DOING
- Own the end-to-end development of AI-powered product features from discovery and design through launch and iteration
- Partner closely with engineering teams to build and refine generative prompting systems, AI workflows, and model-powered features
- Serve as the voice of the customer by conducting research, gathering feedback, and translating insights into product improvements
- Define and track key performance metrics for AI-driven features such as automation impact, engagement outcomes, and accuracy
- Identify high-impact opportunities to apply AI across social engagement, personalization, and operational workflows
- Write product specifications, test features, and iterate quickly in a fast-moving startup environment
- Stay informed on industry developments across AI, generative technologies, and social commerce

WHAT WE'RE LOOKING FOR
- 5+ years of product management experience shipping successful software products
- Strong analytical skills with experience defining metrics and using data to guide product decisions
- Experience working with or strong interest in AI/ML technologies, particularly generative AI or prompting workflows
- Excellent communication and stakeholder management skills across technical and non-technical teams
- Proven ability to drive projects in fast-paced, high-ownership environments
- Comfort operating in ambiguity and prioritizing effectively in early-stage product environments

BONUS POINTS
- Experience working at early-stage or high-growth startups
- Background in social commerce, creator economy tools, or enterprise SaaS products
- Familiarity with machine learning systems such as LLMs, embedding systems, or recommendation engines
- Experience building products for consumer brands or marketing teams
- MBA or a track record of exceptional academic or professional achievement

WHAT WE OFFER
- Competitive compensation and early equity
- Health, vision, and dental benefits + 401(k) match
- ClassPass membership for fitness and wellness classes
- Hybrid schedule: 4 days in office, plus 3 remote flex days per quarter (after your first 3 months)
- Comprehensive stipends: $1,000/month housing stipend for living near the office, $50/month mobile stipend, and commuter benefits (train stipend or Palo Alto parking reimbursement)
- Free lunch in the heart of University Ave. in Palo Alto
- Clear career growth opportunities as the company scales`;

D.RESPONSIBILITIES = [
  'Own the end-to-end development of AI-powered product features from discovery and design through launch and iteration',
  'Partner closely with engineering teams to build and refine generative prompting systems, AI workflows, and model-powered features',
  'Serve as the voice of the customer by conducting research, gathering feedback, and translating insights into product improvements',
  'Define and track key performance metrics for AI-driven features such as automation impact, engagement outcomes, and accuracy',
  'Identify high-impact opportunities to apply AI across social engagement, personalization, and operational workflows',
  'Write product specifications, test features, and iterate quickly in a fast-moving startup environment',
  'Stay informed on industry developments across AI, generative technologies, and social commerce'
];

D.SUMMARY = 'Lead AI-powered capabilities across Nectar’s platform: generative AI, automation and data-driven systems that help brands manage social engagement, community and creator relationships.';

/* ---------- Attributes ---------- */
D.ATTRS = [
  { id: 'tech', name: 'Technical depth',
    def: 'Understands how AI models behave well enough to make trade-offs with engineers, not just hand off requirements.',
    why: 'Your core outcomes are AI features customers rely on, and the JD asks you to track accuracy.',
    strong: ['Shipped an LLM feature to real users and set up evals for it', 'Has written or talked about how models fail in production', 'Technical background: engineering role, CS degree, or builds with code'],
    weak: ['Demos or prototypes only', '“Partnered with the ML team” without owning decisions'] },
  { id: 'own', name: 'Ownership',
    def: 'Treats outcomes as theirs and drives them to done with no process pushing.',
    why: '“Own the end-to-end development”, in a small team with no PM layer to lean on.',
    strong: ['Took a product from idea to adoption as the only PM', 'Scope grew role over role, often before the title did', 'Recruited again by former managers'],
    weak: ['Owned one slice of a larger roadmap', 'Outcomes described as the team’s, never their own calls'] },
  { id: 'emp', name: 'Customer empathy',
    def: 'Curious about users’ real problems; turns messy feedback into the right problem to solve.',
    why: '“Serve as the voice of the customer”, and your buyers are social and brand teams who aren’t technical.',
    strong: ['Runs a regular research practice: interviews, councils, field visits', 'Has built for marketers, creators or brand teams', 'Writes about customer problems, not just features'],
    weak: ['Research fully delegated to UX', 'Only ever built for internal users'] },
  { id: 'rig', name: 'Empirical rigor',
    def: 'Judges ideas, including their own, by whether they measurably work.',
    why: 'You want automation impact, engagement and accuracy tracked from day one.',
    strong: ['Owned metrics with real numbers attached', 'Ran experiments and killed features that didn’t move them', 'Built dashboards or evals others relied on'],
    weak: ['“Data-informed” with no metrics named', 'Success measured by launches shipped'] },
  { id: 'adapt', name: 'Adaptability',
    def: 'Re-plans quickly and calmly when the facts change.',
    why: '“Iterate quickly” and “comfort operating in ambiguity”. And the models themselves change monthly.',
    strong: ['Navigated a pivot or re-org with a clear account of what changed', 'Early-stage roles where the job reshaped', 'Shipped across very different product areas'],
    weak: ['Long tenure in one stable scope', 'Describes change only as disruption'] }
];

D.RECOMMENDED = { id: 'hon', name: 'Intellectual honesty',
  def: 'Says what they don’t know and changes their mind when the evidence says so.',
  why: 'Not in your JD, but AI PMs need to call it when a feature isn’t working, including their own.',
  strong: ['Talks about a failure clearly, without blaming others', 'Has written a postmortem or killed their own project'],
  weak: ['Every story is a success', '“We” for wins, “they” for misses'],
  suggestRank: 4, suggestWhy: 'It’s essential for outcome 2: AI quality metrics engineering trusts.',
  overlap: 'rig', overlapWhy: 'Both cover changing your mind based on evidence.' };

D.OTHER_SUGGESTIONS = [
  { id: 'comm', name: 'Communication', def: 'Explains complex trade-offs clearly to technical and non-technical people.',
    why: 'In your JD, but nearly everyone claims it, so it won’t narrow a shortlist. Better assessed in person.' },
  { id: 'curio', name: 'Intellectual curiosity', def: 'Goes deep on how things work, unprompted.',
    why: 'Useful, but for this role it mostly overlaps with Technical depth.' },
  { id: 'prio', name: 'Prioritization judgment', def: 'Picks the few things that matter and says no to the rest.',
    why: '“Prioritizing effectively” is in your JD; Ownership covers most of it.' }
];

D.LIBRARY = [
  D.RECOMMENDED,
  { id: 'curio', name: 'Intellectual curiosity', def: 'Goes deep on how things work, unprompted.', why: 'The AI landscape shifts monthly; curious PMs keep the team current.', strong: ['Side projects or writing that go deep on new tools', 'Asks “why” several levels down in their own stories'], weak: ['Learning only when assigned'] },
  { id: 'comm', name: 'Communication', def: 'Explains complex trade-offs clearly to technical and non-technical people.', why: 'You’ll translate between engineers and brand teams every week.', strong: ['Writes specs or posts others cite', 'Presents to executives and customers'], weak: ['Only internal, informal updates'] },
  { id: 'prio', name: 'Prioritization judgment', def: 'Picks the few things that matter and says no to the rest.', why: 'A wide product surface and a small team.', strong: ['Can name what they cut and why', 'Roadmaps tied to a small set of outcomes'], weak: ['Everything is a priority'] },
  { id: 'taste', name: 'Product taste', def: 'Knows what good feels like for users and holds the bar on it.', why: 'AI features live or die on the feel of the output.', strong: ['Shipped products known for their UX', 'Can critique their own work specifically'], weak: ['Defers all quality calls to design'] },
  { id: 'resil', name: 'Resilience', def: 'Keeps going, calmly, through setbacks.', why: 'Early-stage AI work has many failed experiments.', strong: ['Recovered a failing launch', 'Stayed through a hard period and turned it around'], weak: ['Leaves at the first sign of trouble'] },
  { id: 'bias', name: 'Bias to action', def: 'Moves quickly from question to experiment.', why: '“Iterate quickly in a fast-moving startup environment.”', strong: ['Ships small experiments weekly', 'Prototypes before writing long docs'], weak: ['Long planning cycles before any test'] },
  { id: 'coach', name: 'Coachability', def: 'Seeks feedback and visibly changes because of it.', why: 'A founder-led team gives frequent, direct feedback.', strong: ['Describes feedback that changed how they work'], weak: ['Can’t name feedback they acted on'] },
  { id: 'systems', name: 'Systems thinking', def: 'Sees how parts of a product interact and plans for second-order effects.', why: 'AI runs across four engineering teams.', strong: ['Designed platforms other teams build on'], weak: ['Only feature-level scope'] }
];

D.EXPERIENCE_WORDS = /\b(years?|yrs|experience|shipped|has (led|built|shipped|worked|managed)|worked (at|on|with)|at a|background in|led a|managed a|degree|mba)\b/i;

/* ---------- Requirements ---------- */
D.REQ_QUOTES = {
  exp: '5+ years of product management experience shipping successful software products',
  metrics: 'Strong analytical skills with experience defining metrics and using data to guide product decisions',
  ai: 'Experience working with or strong interest in AI/ML technologies, particularly generative AI or prompting workflows',
  loc: 'Hybrid schedule: 4 days in office, plus 3 remote flex days per quarter (after your first 3 months)'
};

/* ---------- Company fact bank (JD + Farah's emails) ---------- */
D.FACTS = [
  'Series A from Menlo Ventures x Anthropic (Anthology Fund), GV and True Ventures; $30M+ raised',
  'Customers include OLIPOP, Oura, Figma, Unilever and e.l.f. Cosmetics',
  'Official data partnerships with Meta, TikTok, Reddit, LinkedIn and X',
  'Four engineering teams: Connectors, Intelligence, Experiences, Foundations',
  'Founded by former Meta engineering and product leaders',
  '$1,000/month housing stipend for living near the office'
];

D.HMS = ['Farah Uraizee · CTO & Co-founder', 'Joe', 'Misbah', 'Kaan'];

/* ---------- Candidates (fictional) ----------
   lv = evidence level for [tech, own, emp, rig, adapt]: S strong, M medium, U unknown */
D.CANDS = [
  { id: 'c1', name: 'Maya Okafor', title: 'Senior PM', co: 'Series C marketing SaaS', loc: 'San Francisco', bay: true, yrs: 6, b2b: true, move: 'High', warm: 'Knows your eng lead', exc: 'tech', lv: 'SSMSU', hon: 'S',
    why: 'Shipped an LLM reply assistant with its own evals; owned it from beta to 40% of accounts.',
    whyYou: 'Your write-up on building evals for an LLM reply assistant is exactly the problem we’re solving at a much bigger scale.' },
  { id: 'c2', name: 'Aisha Bello', title: 'Senior PM, AI', co: 'AI customer-support startup', loc: 'Oakland', bay: true, yrs: 5, b2b: true, move: 'High', exc: 'rig', lv: 'SMMSM', hon: 'S',
    why: 'Owns accuracy and deflection metrics for an AI support agent; publishes her eval scorecards.',
    whyYou: 'The way you publish eval scorecards for your support agent is exactly how we want to run AI quality.' },
  { id: 'c3', name: 'Daniel Reyes', title: 'Group PM', co: 'Consumer marketplace', loc: 'Seattle', bay: false, yrs: 8, b2b: false, move: 'Medium', exc: 'own', lv: 'MSSMS',
    why: 'Took a new product from 0 to $4M ARR as the only PM; prototypes with LLMs on the side.',
    whyYou: 'Taking a new product to $4M ARR as the only PM is the kind of ownership this role needs.' },
  { id: 'c4', name: 'Hannah Cho', title: 'Senior PM', co: 'Social listening SaaS', loc: 'San Jose', bay: true, yrs: 6, b2b: true, move: 'High', exc: 'emp', lv: 'MSSMS',
    why: 'Led the analytics product for social and brand teams for four years; knows this buyer cold.',
    whyYou: 'Six years building for social and brand teams means you already know our customers.' },
  { id: 'c5', name: 'Arjun Mehta', title: 'PM, ML platform', co: 'Public developer-tools company', loc: 'Palo Alto', bay: true, yrs: 5, b2b: true, move: 'Medium', warm: 'Knows 2 people on your team', exc: 'tech', lv: 'SMMSM',
    why: 'Former ML engineer; shipped an embeddings-based search now used by 2M developers.',
    whyYou: 'Going from ML engineer to PM on embeddings search is rare, and exactly the depth this role needs.' },
  { id: 'c6', name: 'Mei Lin', title: 'Senior PM', co: 'Customer messaging SaaS', loc: 'San Mateo', bay: true, yrs: 6, b2b: true, move: 'High', exc: 'tech', lv: 'SSMSM',
    why: 'Shipped AI-suggested replies for support teams that cut handle time 28%.',
    whyYou: 'Shipping AI-suggested replies that cut handle time 28% is close to what brands need in social.' },
  { id: 'c7', name: 'Nadia Haddad', title: 'Senior PM', co: 'Conversational AI startup', loc: 'Berkeley', bay: true, yrs: 5, b2b: true, move: 'High', exc: 'tech', lv: 'SMMMS',
    why: 'Designed the prompt and routing system for a chat agent handling 2M conversations a month.',
    whyYou: 'Designing prompt and routing systems at 2M conversations a month is directly relevant to our automations.' },
  { id: 'c8', name: 'Lucía Fernández', title: 'Senior PM, Generative AI', co: 'Design-tools scale-up', loc: 'New York', bay: false, yrs: 6, b2b: true, move: 'High', exc: 'tech', lv: 'SSMSM',
    why: 'Shipped a generative image feature to millions of users and owns its quality and safety evals.',
    whyYou: 'Owning quality evals for a generative feature at that scale is exactly what we need.' },
  { id: 'c9', name: 'David Osei', title: 'Senior PM', co: 'Workflow automation SaaS', loc: 'San Francisco', bay: true, yrs: 7, b2b: true, move: 'Medium', exc: 'own', lv: 'SSMMM',
    why: 'Took an AI workflow builder from idea to 30% of paying accounts as its only PM.',
    whyYou: 'Taking an AI workflow builder to 30% of paying accounts is the playbook for our automations.' },
  { id: 'c10', name: 'Grace Adeyemi', title: 'Senior PM', co: 'Series B martech startup', loc: 'Austin', bay: false, yrs: 5, b2b: true, move: 'High', exc: 'own', lv: 'MSMSS',
    why: 'Sole PM for an automation product that grew from 3 to 60 customers in 18 months.',
    whyYou: 'Growing an automation product from 3 to 60 customers as the sole PM is the scope we’re hiring for.' },
  { id: 'c11', name: 'Yara Nasser', title: 'Senior PM', co: 'AI writing startup', loc: 'San Francisco', bay: true, yrs: 5, b2b: false, move: 'High', exc: 'adapt', lv: 'SMMMS', hon: 'S',
    why: 'Re-planned her roadmap three times as models changed, and shipped every time.',
    whyYou: 'Re-planning three times as the models changed, and shipping every time, is what this role looks like.' },
  { id: 'c12', name: 'Priya Raman', title: 'Senior PM', co: 'Customer data platform', loc: 'Mountain View', bay: true, yrs: 7, b2b: true, move: 'Medium', exc: 'rig', lv: 'MSSSM',
    why: 'Defined the core engagement metrics for a customer data platform used by 400 brands.',
    whyYou: 'Defining engagement metrics for 400 brands is the kind of rigor our customers will feel.' },
  { id: 'c13', name: 'Sofia Russo', title: 'Senior PM, AI', co: 'Sales-intelligence SaaS', loc: 'Palo Alto', bay: true, yrs: 5, b2b: true, move: 'High', exc: 'rig', lv: 'SMMSM',
    why: 'Owns precision and recall targets for an AI lead-scoring model, reviewed weekly with engineering.',
    whyYou: 'Owning precision and recall targets for a production model is the rigor we want on every AI launch.' },
  { id: 'c14', name: 'Kenji Watanabe', title: 'Staff PM', co: 'Enterprise collaboration SaaS', loc: 'San Francisco', bay: true, yrs: 9, b2b: true, move: 'Medium', exc: 'rig', lv: 'MMMSM',
    why: 'Runs one of his company’s most experiment-heavy areas: 120+ tests a year.',
    whyYou: 'Running 120+ experiments a year is the rigor we want behind every AI launch.' },
  { id: 'c15', name: 'Tomás Lindqvist', title: 'Lead PM', co: 'Creator-economy platform', loc: 'Los Angeles', bay: false, yrs: 7, b2b: false, move: 'Medium', exc: 'emp', lv: 'MSSMM',
    why: 'Built creator payout and brand-deal tools; runs a monthly creator council.',
    whyYou: 'Your work with creators on brand-deal tooling maps directly onto our creator workflows.' },
  { id: 'c16', name: 'Marcus Hill', title: 'PM', co: 'Social commerce startup', loc: 'San Francisco', bay: true, yrs: 5, b2b: false, move: 'High', exc: 'adapt', lv: 'MMSMS',
    why: 'Early PM through two pivots: shipped live shopping, then creator storefronts.',
    whyYou: 'Two pivots and two shipped products in social commerce means you know this space from the inside.' },
  { id: 'c17', name: 'Elena Petrova', title: 'Senior PM', co: 'Community platform SaaS', loc: 'Denver', bay: false, yrs: 6, b2b: true, move: 'High', exc: 'emp', lv: 'MSSMM',
    why: 'Built moderation and community tools for brand communities; ran 200+ customer interviews.',
    whyYou: 'Running 200+ interviews with brand community managers is the customer depth this role needs.' },
  { id: 'c18', name: 'Fatima Zahra', title: 'PM, Trust & Safety', co: 'Large social network', loc: 'Menlo Park', bay: true, yrs: 5, b2b: false, move: 'High', exc: 'rig', lv: 'SMMSM',
    why: 'Built classifier quality metrics for content moderation at billion-post scale.',
    whyYou: 'Measuring classifier quality at billion-post scale is directly relevant to our intelligence layer.' },
  { id: 'c19', name: 'Oliver Grant', title: 'Group PM', co: 'Consumer social app', loc: 'Palo Alto', bay: true, yrs: 8, b2b: false, move: 'Medium', exc: 'own', lv: 'MSMMM',
    why: 'Owned messaging for a consumer app as it grew from 1M to 20M users.',
    whyYou: 'Scaling messaging from 1M to 20M users is close to the infrastructure we’re building for brands.' },
  { id: 'c20', name: 'Isaac Levi', title: 'Senior PM', co: 'Data infrastructure company', loc: 'Sunnyvale', bay: true, yrs: 7, b2b: true, move: 'Medium', exc: 'tech', lv: 'SMMSM',
    why: 'Former data engineer; shipped the connector framework behind 150 integrations.',
    whyYou: 'Shipping the framework behind 150 integrations is directly relevant to our Connectors team.' },
  { id: 'c21', name: 'Victor Alvarez', title: 'Senior PM', co: 'Social media management SaaS', loc: 'Miami', bay: false, yrs: 6, b2b: true, move: 'High', exc: 'emp', lv: 'MSSMM',
    why: 'Built the scheduling and inbox tools social teams use at 3,000 brands.',
    whyYou: 'Building inbox tools for social teams at 3,000 brands means you know exactly who we serve.' },
  { id: 'c22', name: 'Rosa Delgado', title: 'Senior PM', co: 'Retail tech company', loc: 'San Francisco', bay: true, yrs: 7, b2b: true, move: 'Medium', exc: 'own', lv: 'MSSMM',
    why: 'Owned a personalization product end to end, from pilot to 12 retail brands.',
    whyYou: 'Taking personalization from pilot to 12 retail brands is the end-to-end ownership we need.' },
  { id: 'c23', name: 'Jonah Weiss', title: 'PM', co: 'Influencer marketing startup', loc: 'New York', bay: false, yrs: 5, b2b: true, move: 'Medium', exc: 'emp', lv: 'MMSMS',
    why: 'Built creator discovery and outreach tools used by 900 brand teams.',
    whyYou: 'Building creator discovery for 900 brand teams maps directly onto our creator workflows.' },
  { id: 'c24', name: 'Amara Nwosu', title: 'PM', co: 'Consumer fintech', loc: 'San Francisco', bay: true, yrs: 5, b2b: false, move: 'High', exc: 'adapt', lv: 'MSMMS',
    why: 'Launched in three markets in two years, re-scoping each time regulation shifted.',
    whyYou: 'Launching across three markets as the rules shifted shows the adaptability this role needs.' },
  { id: 'c25', name: 'Chris Morgan', title: 'Lead PM', co: 'Marketing analytics SaaS', loc: 'Boston', bay: false, yrs: 8, b2b: true, move: 'Medium', exc: 'rig', lv: 'MSMSM',
    why: 'Built the earned-media reporting suite brand marketers use every week.',
    whyYou: 'Your earned-media reporting work lines up with one of our core surfaces.' },
  { id: 'c26', name: 'Samuel Park', title: 'PM', co: 'Ad-tech company', loc: 'Chicago', bay: false, yrs: 6, b2b: true, move: 'Medium', exc: 'rig', lv: 'MMMSM',
    why: 'Owns attribution metrics for brand campaigns across social platforms.',
    whyYou: 'Owning attribution across social platforms means you already speak our customers’ language.' },
  { id: 'c27', name: 'Ben Carter', title: 'Senior PM', co: 'E-commerce platform', loc: 'Toronto', bay: false, yrs: 6, b2b: true, move: 'Medium', exc: 'emp', lv: 'MMSMM',
    why: 'Built merchant tools for direct-to-consumer brands; sits in on five merchant calls a week.',
    whyYou: 'Five merchant calls a week building for DTC brands: our customers are the same people.' },
  { id: 'c28', name: 'Ethan Brooks', title: 'Group PM', co: 'HR tech SaaS', loc: 'Seattle', bay: false, yrs: 9, b2b: true, move: 'Medium', exc: 'own', lv: 'MSMMM',
    why: 'Built a new product line to $10M ARR over three years.',
    whyYou: 'Building a product line to $10M ARR is the ownership we need as we scale.' },
  { id: 'c29', name: 'Leo Martins', title: 'Senior PM', co: 'Video platform', loc: 'Los Angeles', bay: false, yrs: 6, b2b: false, move: 'Medium', exc: 'emp', lv: 'MMSMM',
    why: 'Built creator analytics used by 50K channels; runs a creator advisory board.',
    whyYou: 'Running a creator advisory board gives you the empathy our creator workflows need.' },
  { id: 'c30', name: 'Zoe Kim', title: 'PM', co: 'Consumer AI app', loc: 'San Francisco', bay: true, yrs: 4, b2b: false, move: 'High', exc: 'tech', lv: 'SMMSS', hon: 'M',
    why: 'Shipped three LLM features in 18 months, each with a public changelog of quality fixes.',
    whyYou: 'Shipping three LLM features with public quality changelogs is exactly the habit we want.' }
];

D.NEW_MATCHES = [
  { id: 'n1', name: 'Hana Sato', title: 'Senior PM', co: 'Brand-safety AI startup', loc: 'San Francisco', bay: true, yrs: 6, b2b: true, move: 'High', exc: 'rig', lv: 'SMMSM',
    why: 'Owns precision targets for a brand-safety classifier used by 200 advertisers.',
    whyYou: 'Owning precision targets for a brand-safety classifier is exactly the quality bar our brands expect.', rankIfAdded: 3 },
  { id: 'n2', name: 'Kwame Mensah', title: 'Lead PM', co: 'Social commerce marketplace', loc: 'Oakland', bay: true, yrs: 7, b2b: false, move: 'High', exc: 'own', lv: 'MSSMS',
    why: 'Launched a creator storefront product and grew it to 8,000 sellers as the lead PM.',
    whyYou: 'Growing creator storefronts to 8,000 sellers is right at the heart of social commerce.', rankIfAdded: 6 },
  { id: 'n3', name: 'Laura Becker', title: 'Senior PM', co: 'Customer engagement SaaS', loc: 'Berlin', bay: false, yrs: 6, b2b: true, move: 'High', exc: 'emp', lv: 'MSSMM',
    why: 'Runs a 40-brand customer council for an engagement product used by social teams.',
    whyYou: 'Running a 40-brand customer council is the customer depth this role needs.', rankIfAdded: 9 },
  { id: 'n4', name: 'Ravi Iyer', title: 'Senior PM, AI', co: 'Voice AI company', loc: 'San Jose', bay: true, yrs: 5, b2b: true, move: 'High', exc: 'tech', lv: 'SMMSM',
    why: 'Shipped a voice agent to 300 enterprise customers with a nightly regression eval suite.',
    whyYou: 'Running a nightly regression eval suite for a production voice agent is the depth we need.', rankIfAdded: 4 }
];

D.EVIDENCE_POOLS = {
  tech: { S: ['Shipped an LLM feature to production users', 'Set up offline evals before each model change', 'Former engineer; still reviews model outputs weekly'],
          M: ['Worked closely with ML engineers on ranking features', 'Prototypes with LLM APIs; no production launch yet'],
          U: ['Not visible in profile; tested in the chat and take-home'] },
  own:  { S: ['Sole PM from idea to adoption', 'Scope grew each year before the title did', 'Recruited twice by a former manager'],
          M: ['Owned a major area inside a larger roadmap'],
          U: ['Not visible in profile'] },
  emp:  { S: ['Runs a recurring customer council', 'Built directly for marketers or brand teams', 'Writes publicly about customer problems'],
          M: ['Regular customer calls, mostly with admins', 'Research partly led by a UX team'],
          U: ['Not visible in profile'] },
  rig:  { S: ['Owned metrics with named targets and results', 'Killed a feature after it missed its metric', 'Built an eval scorecard the team relied on'],
          M: ['Tracks adoption metrics; fewer quality measures'],
          U: ['Not visible in profile'] },
  adapt:{ S: ['Navigated a pivot and re-scoped fast', 'Shipped across very different product areas'],
          M: ['Steady growth in one product area'],
          U: ['Not visible in profile; tested in the chat and take-home'] },
  hon:  { S: ['Published a candid postmortem of a failed launch'],
          M: ['Some reflective writing on what they got wrong'],
          U: ['Rarely visible in a profile; tested in the chat and take-home'] }
};

/* ---------- Outreach emails ---------- */
/* Tokens: [[first]] [[whyYou]] [[title]] [[base]] [[stagesLine]] [[stagesDetail]] [[totalHours]]
   [[commitment]] [[outcome1]] [[whyNow]] [[reportsTo]] [[engineers]]
   Growth-only optional tokens: [[gRevenue]] [[gCustomers]] [[gTeam]]
   Lines starting with "- " are list items. */
D.EMAILS = {
  base: [
    { day: 0, theme: 'Hook', subject: 'Senior PM, AI at Nectar Social', reveals: 'Company, why you, role, base range, process',
      base: ['Hey [[first]],',
        'I’m Farah, CTO & Co-Founder at Nectar Social. We’re the Applied AI category leader in social, and we replace a legacy SaaS player every two weeks. Customers include OLIPOP, Oura, Figma, Unilever and e.l.f. Cosmetics, and we have official data partnerships with Meta, TikTok, Reddit, LinkedIn and X.',
        '[[whyYou]]',
        'We’re hiring a [[title]] to own AI across our platform, spanning intelligence, automation and creator workflows. It’s hands-on: you’d work directly with customers and engineering, decide what gets built, and ship it. Base is [[base]] plus early equity, based in Palo Alto.',
        'The process is [[stagesLine]], and we reply within [[commitment]] at every step.',
        'Worth a conversation?', 'Farah'],
      shorter: ['Hey [[first]],',
        'I’m Farah, CTO & Co-Founder at Nectar Social, the Applied AI leader in social. OLIPOP, Oura, Figma and Unilever run on us.',
        '[[whyYou]]',
        'We’re hiring a [[title]] to own AI across the platform. Base [[base]] plus early equity, Palo Alto. Process: [[stagesLine]]; replies within [[commitment]].',
        'Worth a conversation?', 'Farah'],
      warmer: ['Hi [[first]],',
        'I’m Farah, CTO & Co-Founder at Nectar Social, and I wanted to reach out to you personally.',
        '[[whyYou]]',
        'We’re the Applied AI category leader in social (brands like OLIPOP, Oura, Figma and Unilever run on us) and we’re looking for a [[title]] to shape how AI shows up across everything we build. It’s hands-on and close to customers and engineering. Base is [[base]] plus early equity, in Palo Alto.',
        'The process is [[stagesLine]], and you’ll always hear back from us within [[commitment]].',
        'Would you be open to a conversation? I’d love to hear what you’re working on.', 'Farah'] },
    { day: 3, theme: 'The role, day to day', subject: 'Re: Senior PM, AI at Nectar Social', reveals: 'Teams, product surface, what you’d own, a 12-month outcome',
      base: ['Hey [[first]],',
        'Wanted to share what this role looks like day to day.',
        'We have four engineering teams (Connectors, Intelligence, Experiences, Foundations), and the product surface is wide: social listening, earned media analytics, AI-powered automations, creator workflows, and integrations across TikTok, Instagram, Reddit and more.',
        'As our [[title]], you’d:',
        '- Own the strategy for our AI features, from discovery through launch',
        '- Sit in customer calls weekly to see how social and brand teams actually work',
        '- Partner with engineering on prompting systems and model-powered features, and ship quickly',
        '- Define how we measure AI quality, like accuracy and automation impact, and make real trade-offs with it',
        'A year from now, success looks like [[outcome1]].',
        'Happy to dig into any of this if you’re curious.'],
      shorter: ['Hey [[first]],',
        'Quick look at the day to day: four engineering teams, a wide surface (listening, analytics, automations, creator workflows), and you’d own AI across it: strategy, weekly customer calls, shipping with engineering, and the quality metrics.',
        'A year from now, success looks like [[outcome1]].',
        'Happy to share more.'],
      warmer: ['Hi [[first]],',
        'I thought it might help to paint a picture of what your days would actually look like.',
        'We have four engineering teams (Connectors, Intelligence, Experiences, Foundations) and a wide product surface: social listening, earned media analytics, AI-powered automations, creator workflows and integrations across TikTok, Instagram, Reddit and more.',
        'As our [[title]], you’d:',
        '- Own the strategy for our AI features, from discovery through launch',
        '- Spend time with customers every week, seeing how social and brand teams really work',
        '- Build side by side with engineering on prompting systems and model-powered features',
        '- Define what great AI quality means for us, and hold us to it',
        'A year from now, we’d love to be celebrating [[outcome1]], together.',
        'If any of this sparks questions, I’m happy to talk it through.'] },
    { day: 7, theme: 'Why now', subject: 'Re: Senior PM, AI at Nectar Social', reveals: 'Market timing, traction, why the role is open',
      base: ['Hey [[first]],',
        'Quick context on timing.',
        'Every major brand is trying to treat social as a real channel, not a content calendar. They need systems for conversations, communities, creators and commerce across platforms, and that infrastructure doesn’t exist yet.',
        'That’s what we’re building, and it’s working:',
        '- Enterprise clients like Unilever, OLIPOP, Oura and Figma',
        '- A Series A from Menlo Ventures x Anthropic (Anthology Fund), GV and True Ventures',
        '- A team of former Meta engineering and product leaders who built at billion-user scale',
        '[[whyNow]] Joining now means high ownership, a direct say in product strategy, and early equity with meaningful upside.',
        'If building the AI layer for social commerce sounds interesting, I’d love to connect.'],
      shorter: ['Hey [[first]],',
        'Why now: brands want to run social as a real channel, and the infrastructure doesn’t exist yet. We’re building it. Unilever, OLIPOP, Oura and Figma are on the platform, and we just closed a Series A from Menlo x Anthropic (Anthology Fund), GV and True.',
        '[[whyNow]] Early equity, high ownership.',
        'Interested?'],
      warmer: ['Hi [[first]],',
        'I wanted to share why this moment feels special for us.',
        'Brands everywhere are realizing social is their most important owned channel, and the tools haven’t caught up. That’s the gap we’re filling, and customers like Unilever, OLIPOP, Oura and Figma are already with us. We also just closed a Series A from Menlo Ventures x Anthropic (Anthology Fund), GV and True Ventures.',
        '[[whyNow]] You’d have real ownership, a direct say in strategy, and early equity with meaningful upside.',
        'If that sounds like the kind of place you’d thrive, I’d really love to connect.'] },
    { day: 12, theme: 'People + process', subject: 'Re: Senior PM, AI at Nectar Social', reveals: 'Reports to, team size, process and time cost',
      base: ['Hey [[first]],',
        'Two things people usually ask about: who they’d work with, and what the process looks like.',
        'You’d report to [[reportsTo]] and work with [[engineers]] engineers across our four teams, alongside a founding team that scaled Facebook Groups to over a billion users.',
        'The process is [[stagesDetail]]. That’s about [[totalHours]] hours of your time in total, and we reply within [[commitment]] at every step.',
        'If it helps, I’m happy to connect you with someone on the team for an informal chat first.'],
      shorter: ['Hey [[first]],',
        'You’d report to [[reportsTo]] and work with [[engineers]] engineers. The process is [[stagesDetail]] (about [[totalHours]] hours in total), with replies within [[commitment]].',
        'Happy to intro you to someone on the team first.'],
      warmer: ['Hi [[first]],',
        'I know the people matter as much as the role, so here’s who you’d be working with.',
        'You’d report to [[reportsTo]] and work alongside [[engineers]] engineers across our four teams, with a founding team that scaled Facebook Groups to over a billion users.',
        'And so there are no surprises: the process is [[stagesDetail]], about [[totalHours]] hours of your time in total. We’ll always reply within [[commitment]].',
        'If you’d like to meet someone on the team informally first, I’d be glad to set that up.'] },
    { day: 18, theme: 'Graceful close', subject: 'Re: Senior PM, AI at Nectar Social', reveals: 'A “later” option and a referral ask',
      base: ['Hey [[first]],',
        'I’ll stop here. I know timing is often the issue. If now isn’t right, just reply “later” and I’ll check back in a few months. And if someone comes to mind who’d be great for this, I’d really appreciate an intro.',
        'Either way, thanks for reading.', 'Farah'],
      shorter: ['Hey [[first]],',
        'Last note from me. If the timing’s off, reply “later” and I’ll check back. If someone comes to mind, an intro would mean a lot.',
        'Thanks, Farah'],
      warmer: ['Hi [[first]],',
        'This will be my last note. I really appreciate you reading this far. If the timing isn’t right, just reply “later” and I’ll gladly check back in a few months.',
        'And if someone you respect comes to mind, an intro would mean a lot.',
        'Wishing you the best either way,', 'Farah'] }
  ],
  growth: [
    { day: 0, theme: 'Hook: momentum', subject: 'Nectar Social is scaling: Senior PM, AI', reveals: 'Momentum up front, why you, role, base range',
      base: ['Hey [[first]],',
        'I’m Farah, CTO & Co-Founder at Nectar Social. We replace a legacy SaaS player every two weeks, and we just closed a Series A from Menlo Ventures x Anthropic (Anthology Fund), GV and True Ventures.',
        '[[gRevenue]]',
        '[[whyYou]]',
        'We’re hiring a [[title]] to own AI as we scale. Base is [[base]] plus early equity, in Palo Alto. The process is [[stagesLine]], with replies within [[commitment]].',
        'Worth a conversation?', 'Farah'] },
    { day: 3, theme: 'The growth story', subject: 'Re: Nectar Social is scaling: Senior PM, AI', reveals: 'Customers, data partnerships, growth numbers you chose to share',
      base: ['Hey [[first]],',
        'A bit more on the momentum:',
        '- Brands like OLIPOP, Oura, Figma, Unilever and e.l.f. Cosmetics run social on Nectar',
        '- Official data partnerships with Meta, TikTok, Reddit, LinkedIn and X',
        '- [[gCustomers]]',
        'Social has become the most important owned channel for brands, and the tooling hasn’t kept up. We’re building that layer, AI-native from day one.'] },
    { day: 7, theme: 'What growth means for the role', subject: 'Re: Nectar Social is scaling: Senior PM, AI', reveals: 'Scope expanding with the company; 12-month outcome',
      base: ['Hey [[first]],',
        'Here’s what that growth means for this role.',
        'Today, AI touches a few of our workflows. Over the next year it needs to run through all four engineering teams: Connectors, Intelligence, Experiences and Foundations. You’d set that direction.',
        'A year from now, success looks like [[outcome1]].',
        '[[whyNow]]'] },
    { day: 12, theme: 'Growth for you', subject: 'Re: Nectar Social is scaling: Senior PM, AI', reveals: 'Team growth, early equity, people and process',
      base: ['Hey [[first]],',
        '[[gTeam]]',
        'Early hires here grow with the company: early equity with meaningful upside, and scope that expands as we do.',
        'You’d report to [[reportsTo]] and work with [[engineers]] engineers. The process is [[stagesDetail]], and we reply within [[commitment]].'] },
    { day: 18, theme: 'Graceful close', subject: 'Re: Nectar Social is scaling: Senior PM, AI', reveals: 'A “later” option and a referral ask',
      base: ['Hey [[first]],',
        'We’re moving quickly, so I’ll stop here. If now isn’t right, reply “later” and I’ll check back in a few months. And if someone comes to mind, I’d really appreciate an intro.',
        'Thanks for reading.', 'Farah'] }
  ]
};

D.GROWTH_PLAN = [
  'Hook: momentum up front (a legacy player replaced every two weeks, the Series A), then the role and base range',
  'The growth story: customers, data partnerships, and any growth numbers you choose to share',
  'What growth means for this role: AI scope expands across all four teams',
  'Growth for you: team growth, early equity, the people and the process',
  'Graceful close'
];

/* ---------- Replies, chat, take-home ---------- */
D.REPLIES = [
  { id: 'c1', when: 'Oct 1', kind: 'Interested', msg: 'Hi Farah, thanks for reaching out. The eval problem at your scale is exactly what I’ve been thinking about. Happy to talk.',
    rec: 'chat', reasons: ['Relocation and work authorization are unknown', 'Adaptability has no evidence yet'] },
  { id: 'c2', when: 'Oct 2', kind: 'Interested', msg: 'This sounds great. I’d love to learn more. I can do a take-home this week if that’s easiest.',
    rec: 'takehome', reasons: ['Strong evidence on all top attributes', 'Must-haves all likely'] },
  { id: 'c3', when: 'Oct 2', kind: 'Tell me more', msg: 'Curious. Can you share more about how the AI team is structured today?',
    rec: 'chat', reasons: ['Relocation is unknown (Seattle)', 'Technical depth evidence is medium'] }
];

D.TRANSCRIPT = `Farah: Thanks for making time, Maya. What made you reply?
Maya: Honestly, the eval question. We built a judge model to score reply quality before rollout, and I'm curious how you handle quality across so many brands' voices.
Farah: Walk me through how you rolled that out.
Maya: We started with 50 hand-labeled conversations per brand, then let the judge model gate releases. The first version was too strict; we loosened it after it blocked a fix we needed.
Farah: What would you do differently?
Maya: Involve support leads earlier. I owned the metric, but I didn't bring them the definitions soon enough.
Farah: Palo Alto four days a week, does that work?
Maya: Yes, I'm in SF already, and I'm authorized to work in the US.
Farah: What would you want to own in your first six months?
Maya: The quality layer for automations. Hands-on, close to customers.`;

D.TAKEHOME = {
  sections: [
    { id: 'deliv', title: 'Deliverables', tests: [],
      html: '<ul><li><b>Submission:</b> email your work to farah@nectarsocial.com by 8pm on the due date you choose.</li><li><b>Time:</b> [[timebox]].</li><li><b>AI tools:</b> encouraged. Tell us how you used them.</li></ul>' },
    { id: 'scenario', title: 'Scenario', tests: ['emp'],
      html: '<p>You’ve just joined <b>Relay</b> as its first AI PM. Relay (a fictional company) helps consumer brands manage comments and DMs across TikTok, Instagram and Reddit. Its AI reply assistant drafts responses for social teams to approve.</p><p>Adoption is high, but brands say drafts sometimes miss their tone, and two customers paused the feature after a reply went out with a wrong product claim. The founders believe AI replies can become the core of the product, if brands can trust them.</p>' },
    { id: 'task', title: 'Your task', tests: ['own', 'tech', 'skill-ai'],
      html: '<p>Design and prototype how Relay should make AI replies trustworthy enough that social teams approve them with confidence. Build a clickable prototype of the key experience for a social media manager, plus a one-page plan for measuring reply quality.</p>' },
    { id: 'minimum', title: 'At minimum, a reviewer should be able to', tests: ['emp', 'own'],
      html: '<ul><li>See how a social media manager reviews, edits and approves AI drafts</li><li>Understand how Relay would know whether reply quality is improving</li><li>See what you’d ship first, and why</li></ul>' },
    { id: 'decisions', title: 'Decisions you’ll need to make', tests: ['rig', 'tech', 'own', 'adapt', 'skill-metrics'],
      html: '<ul><li>What does “good” mean for a reply, and how would you measure it?</li><li>Where should a human stay in the loop, and where shouldn’t they?</li><li>What do you ship first, and what are you deliberately not building?</li><li><b>Halfway through:</b> assume the founders cut your timeline to one week. What do you drop?</li></ul><p>There are no right answers. We’re evaluating reasoning, not opinions.</p>' },
    { id: 'review', title: 'Review session', tests: ['hon', 'tech', 'rig'],
      html: '<ol><li>Walk us through your prototype</li><li>The key decisions you made, and what you chose not to build</li><li>How you used AI tools, and where you had to push back on them</li></ol>' }
  ],
  note: 'Relay is fictional. This isn’t our roadmap, and we won’t use your work.'
};

D.SUBMISSIONS = [
  { id: 'c1', submitted: 'Oct 13, 7:42pm', due: 'Today, 6pm', left: 11, reviewers: { farah: null, kaan: 'advance' }, kaanNote: 'Best eval plan we’ve seen: judge model plus hand-labeled set.',
    grades: { tech: 'Strong', own: 'Strong', emp: 'Medium', rig: 'Strong', adapt: 'Strong', hon: 'Strong' }, ai: 'Meets', metrics: 'Meets',
    excerpt: { tech: '“Eval plan: a judge model plus 50 hand-labeled replies per brand, before any rollout.”', adapt: 'Cut scope cleanly at the timeline twist, and explained what and why.' } },
  { id: 'c2', submitted: 'Oct 14, 9:05am', due: 'Oct 16, 9am', left: 35, reviewers: { farah: null, kaan: null }, kaanNote: 'Strong on metrics; prototype a bit thin.',
    grades: { tech: 'Strong', own: 'Medium', emp: 'Medium', rig: 'Strong', adapt: 'Medium', hon: 'Strong' }, ai: 'Meets', metrics: 'Exceeds',
    excerpt: { rig: '“Primary metric: approved-without-edit rate, segmented by brand voice cluster.”' } },
  { id: 'c4', submitted: 'Oct 14, 4:20pm', due: 'Oct 16, 4pm', left: 42, reviewers: { farah: null, kaan: 'reject' }, kaanNote: 'Great customer insight, thin on how the models would actually work.',
    grades: { tech: 'Medium', own: 'Strong', emp: 'Strong', rig: 'Medium', adapt: 'Strong', hon: 'Medium' }, ai: 'Partially meets', metrics: 'Meets',
    excerpt: { emp: 'Interviewed three social media managers before designing, and quoted them in the doc.' } }
];

D.AVATAR_COLORS = ['#1D6B57', '#3B5B92', '#8A4B2A', '#6B4E8A', '#2F6F7E', '#8C6A1F', '#7A3B4F', '#4A6B2F'];

})(PL.D);
