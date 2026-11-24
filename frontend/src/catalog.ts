export const profile = {
  name: 'Tanmay Patel',
  title: 'Backend & Applied AI Engineer',
  github: 'https://github.com/hasher-tanmay',
  linkedin: 'https://www.linkedin.com/in/tanmay-patel22/',
  resume: '/resume.pdf',
  resumeDrive: 'https://drive.google.com/file/d/1bbphDAvdkYb4XFUR4Ba1KKkAuMNY95wn/view?usp=sharing',
} as const

export const chapters = [
  { slug: 'about', name: 'About' },
  { slug: 'projects', name: 'Projects' },
  { slug: 'research', name: 'Research' },
  { slug: 'resume', name: 'Résumé' },
] as const

export type Chapter = typeof chapters[number]['slug']
export type Link = { label: string; href: string; download?: string }
type Note = { label: string; text: string; link?: Link }
type Picture = { src: string; alt: string; caption: string; width: number; height: number }
export type Evidence =
  | { kind: 'flow'; label: string; branches: { steps: string[]; icon: 'data' | 'document' }[]; output: string }
  | { kind: 'picture'; picture: Picture }
  | { kind: 'video'; src: string; poster: string; caption: string; label: string; width: number; height: number; captions?: string }
  | { kind: 'metrics'; metrics: { value: string; label: string }[]; caption: string }
  | { kind: 'resume' }

export type Spread = {
  slug: string
  chapter: Chapter
  title: string
  intro: string
  notes: Note[]
  facingTitle: string
  facingNotes?: Note[]
  skillGroups?: { technical: Note[]; training: Note[]; course: Link }
  leftPreview?: Picture
  evidence?: Evidence
  images?: Picture[]
  links?: Link[]
  leftLinks?: Link[]
  related?: string[]
  relatedDescriptions?: Readonly<Record<string, string>>
}

const socials: Link[] = [
  { label: 'GitHub', href: profile.github },
  { label: 'LinkedIn', href: profile.linkedin },
]
const repo = (name: string, label = 'View code'): Link => ({
  label, href: `${profile.github}/${name}`,
})
export const skillsSlug = 'skills-and-frameworks'
const paper: Link = {
  label: 'Read the conference paper (PDF)',
  href: '/evidence/meta-contrast-conference-paper.pdf',
}

export const spreads: readonly Spread[] = [
  {
    slug: 'about', chapter: 'about', title: 'Under the cover',
    intro: 'I earned a CSE dual degree at NIT Hamirpur. I build data pipelines, put their outputs to work in apps, and test how models behave.',
    notes: [
      { label: 'Octro · Funnel analytics', text: 'I worked on a stateful Spark Streaming pipeline that read Kafka events and MySQL funnel rules, tracked conversions in HBase, and sent aggregates to Elasticsearch.' },
      { label: 'Identity mapping', text: 'I built an idempotent workflow to maintain user identity mappings in HBase.' },
    ],
    facingTitle: 'What I work with',
    facingNotes: [{ label: 'From data to evidence', text: 'Vendor AI Assistant shows how I turned raw data into a serving database. Meta-Contrast shows how I tested a classifier against its backbone-only baseline.' }],
    related: [skillsSlug, 'vendor-ai-assistant', 'endoscopy-image-classification'],
    links: socials,
  },
  {
    slug: skillsSlug, chapter: 'about', title: 'Skills and Frameworks',
    intro: 'Technical skills',
    notes: [],
    facingTitle: 'Agentic AI and forward-deployed engineering',
    skillGroups: {
      technical: [
        { label: 'Programming', text: 'Python, Scala, SQL, C++.' },
        { label: 'Data engineering', text: 'Apache Spark, PySpark, Spark Streaming, Kafka, HBase, Hadoop/HDFS, Elasticsearch, MySQL, SQLite, Parquet, ETL, dimensional modelling.' },
        { label: 'LLM systems', text: 'RAG, OpenAI API, embeddings, ChromaDB, vector search, reranking, Pydantic, SQLite FTS5, RapidFuzz, LiteLLM, Gradio.' },
        { label: 'Machine learning', text: 'PyTorch, scikit-learn, pandas, NumPy, EfficientNetV2, CNNs, transfer and contrastive learning.' },
        { label: 'Developer tools', text: 'Git, GitHub, Linux, Google Colab, uv.' },
        { label: 'CS foundations', text: 'Data structures and algorithms, DBMS, operating systems, computer networks, OOP, machine learning and deep learning.' },
      ],
      training: [
        { label: 'Inference', text: 'Model quality/latency/cost, structured outputs, prompt caching, OpenRouter routing; local/open weights: Ollama, LM Studio, vLLM.' },
        { label: 'Harnesses', text: 'LangChain, LangGraph, Deep Agents, Claude Agent SDK; coding agents, spec-driven delivery, context engineering, lifecycle, tool permissions.' },
        { label: 'Integrations', text: 'Agentic RAG, MCP, Qdrant, Agent2Agent (A2A), enterprise context, cross-session memory.' },
        { label: 'Reliability', text: 'Graph state, checkpoints, safe retries, human approval/resume, multi-agent coordination, Supabase/Postgres.' },
        { label: 'Evaluation', text: 'Langfuse tracing/experiments, cost-aware scoring, regressions, held-out sets, gated improvement/rollback.' },
        { label: 'Rollout', text: 'Discovery, RICE, AI governance, permission checks, prompt-injection defenses; FastAPI/OpenAPI, LiteLLM gateways, AWS Lambda/IAM, Render; Bedrock AgentCore (Gateway, Policy, Identity, Memory, Runtime).' },
      ],
      course: { label: 'AI FDE course outline', href: 'https://edwarddonner.com/2026/10/14/ai-fde-the-forward-deployed-engineer-agentic-ai-architect/' },
    },
    related: ['vendor-ai-assistant', 'endoscopy-image-classification'],
  },
  {
    slug: 'projects', chapter: 'projects', title: 'Selected projects',
    intro: 'I built a wholesale assistant, a camera that spots potholes, a tool for reviewing expert calls, and a model for classifying endoscopy images.',
    notes: [],
    facingTitle: 'Project index',
    related: ['vendor-ai-assistant', 'oak-d-lite-pothole-detection', 'transcript-app', 'endoscopy-image-classification'],
    relatedDescriptions: {
      'vendor-ai-assistant': 'Answers wholesale questions using a PySpark pipeline, buyer-scoped SQL lookups, and document retrieval.',
      'oak-d-lite-pothole-detection': 'Runs YOLOv8 on the camera and pairs pothole detections with stereo depth readouts.',
      'transcript-app': 'Compares answers across expert calls and lets readers inspect timestamped source excerpts.',
      'endoscopy-image-classification': 'Classifies endoscopy images using supervised contrastive learning and validation-guided sample weighting.',
    },
  },
  {
    slug: 'vendor-ai-assistant', chapter: 'projects', title: 'Vendor AI Assistant',
    intro: 'I built a wholesale assistant for product, price, stock, order, and policy questions.',
    notes: [
      { label: 'Serving', text: 'Validated SQL tools handle operational lookups; order queries are buyer-scoped. Policy answers use Chroma retrieval and reranking.' },
      { label: 'Pipeline', text: 'My Bronze–Silver–Gold PySpark pipeline processed 400 products, 25,000 orders, and 74,999 order lines, with quarantine and reconciliation checks.' },
    ],
    facingTitle: 'Retailer demo',
    evidence: { kind: 'flow', branches: [
      { steps: ['Vendor records', 'PySpark pipeline', 'SQLite · SQL tools'], icon: 'data' },
      { steps: ['Policy documents', 'Document retrieval'], icon: 'document' },
    ], output: 'Role-aware assistant', label: 'Vendor records are curated in PySpark and queried through SQLite tools. Policy documents follow a separate retrieval path. Both supply the assistant.' },
    links: [repo('Vendor-AI-Assistant')],
    images: [
      { src: '/evidence/vendor-catalog.jpg', alt: 'Retailer demo asks about the price of atta and receives two possible products.', caption: '01 · Clarification: the assistant asks which atta product the retailer means.', width: 1040, height: 552 },
      { src: '/evidence/vendor-policy.jpg', alt: 'Retailer demo asks about oil returns and receives policy guidance.', caption: '02 · Returns: the assistant answers from the policy rather than the catalog.', width: 1040, height: 406 },
    ],
  },
  {
    slug: 'oak-d-lite-pothole-detection', chapter: 'projects', title: 'OAK-D-Lite Pothole Detection',
    intro: 'An OAK-D-Lite prototype marks candidate potholes and shows how far away they are estimated to be.',
    notes: [
      { label: 'Build notes', text: 'I paired YOLOv8 detections with stereo depth. The detector locates candidates; stereo depth estimates distance.' },
      { label: 'Evidence', text: 'The camera pass shows the boxes, confidence, and depth readouts together. It does not measure their accuracy.' },
    ],
    facingTitle: 'Camera recording',
    evidence: { kind: 'video', src: '/evidence/oak-d-demo.mp4', poster: '/evidence/oak-d-poster.jpg', width: 540, height: 540,
      label: 'Silent OAK-D-Lite camera recording',
      caption: 'Silent clip: detection boxes show confidence and depth readouts on pavement. The clip does not validate either reading.' },
  },
  {
    slug: 'transcript-app', chapter: 'projects', title: 'Transcript App',
    intro: 'Load text transcripts and an optional interview guide to review answers by expert and compare calls.',
    notes: [
      { label: 'Workflow', text: 'Choose a guide question, request an answer for each expert, and expand a source to inspect its timestamp and surrounding dialogue.' },
      { label: 'Design decision', text: 'Keep the supporting excerpt next to the answer so it can be checked without leaving the comparison workflow.' },
    ],
    facingTitle: 'From the walkthrough',
    evidence: { kind: 'video', src: '/evidence/transcript-demo.mp4', poster: '/evidence/transcript-demo-poster.jpg',
      label: 'Transcript App walkthrough', width: 1100, height: 600,
      caption: 'Demo of Transcript App' },
    links: [repo('transcript-app', 'Repository')],
  },
  {
    slug: 'endoscopy-image-classification', chapter: 'projects', title: 'Meta-Contrast',
    intro: 'Glare, blur, and similar-looking tissue make endoscopic images hard to classify.',
    notes: [
      { label: 'Method', text: 'I paired EfficientNetV2-B0 with supervised contrastive learning and used validation feedback to reweight training samples.' },
      { label: 'Five-class Kvasir-VQA test', text: '96.92% accuracy vs. 94.69% for the backbone alone; Cohen’s κ 0.9593; Brier score 0.0227. These results do not establish clinical performance.', link: paper },
    ],
    facingTitle: 'Meta-Contrast architecture',
    evidence: { kind: 'picture', picture: {
      src: '/evidence/meta-contrast-diagram.png', alt: 'EfficientNetV2-B0 feeds classification and contrastive projection heads. A validation-driven MLP reweights training samples for the combined loss.',
      caption: 'The shared EfficientNetV2 backbone feeds two heads. Validation feedback updates the MLP that weights their training losses.', width: 1100, height: 510,
    } },
    links: [repo('Endoscopy_Image_Classification', 'View notebook')],
    related: ['research'],
  },
  {
    slug: 'research', chapter: 'research', title: 'Research notes',
    intro: 'Meta-Contrast · Conference paper',
    notes: [
      { label: 'Problem', text: 'Similar-looking tissue, glare, and blur make endoscopy classes hard to tell apart.' },
      { label: 'Method', text: 'Supervised contrastive learning groups features by class. A meta-learner reweights samples using validation feedback.' },
      { label: 'Test result · Kvasir-VQA', text: '96.92% test accuracy versus 94.69% for the backbone alone. Presented at ICICST 2026, NIT Jalandhar; co-authored with Ajay Kumar Mallick.', link: paper },
    ],
    facingTitle: 'M.Tech dissertation',
    facingNotes: [
      { label: 'Robust Endoscopic Image Analysis Using Bi-Level Meta-Learning and Supervised Contrastive Geometry', text: 'Chapter 4 details the data split and 15-epoch training episodes. The validation split guides how the model reweights samples.' },
      { label: 'Ablations and representations', text: 'Table 4.2 tests the contrastive loss and meta-learner separately and together, including calibration by Brier score. The t-SNE plots compare how the baseline and full model organize image features.', link: { label: 'Read the M.Tech dissertation (PDF)', href: '/evidence/mtech-dissertation.pdf' } },
    ],
    related: ['endoscopy-image-classification'],
  },
  {
    slug: 'certificates', chapter: 'resume', title: 'Certificates',
    intro: 'Course completions',
    leftPreview: { src: '/evidence/fde.png', alt: 'AI FDE certificate of completion for Tanmay Patel', caption: 'AI FDE certificate preview', width: 1920, height: 1080 },
    notes: [{ label: 'AI FDE: The Forward Deployed Engineer & Agentic AI Architect', text: 'Edward Donner · 13 November 2026 · 21.5 hours', link: { label: 'View certificate (PDF)', href: '/evidence/ai-fde-certificate.pdf' } }],
    facingTitle: 'Core Track certificate',
    evidence: { kind: 'picture', picture: { src: '/evidence/llm.png', alt: 'AI Engineer Core Track certificate of completion for Tanmay Patel', caption: 'AI Engineer Core Track certificate preview', width: 1920, height: 1080 } },
    facingNotes: [{ label: 'AI Engineer Core Track: LLM Engineering, RAG, QLoRA, Agents', text: 'Ligency and Ed Donner · 5 September 2026 · 33.5 hours', link: { label: 'View certificate (PDF)', href: '/evidence/ai-engineer-core-certificate.pdf' } }],
  },
  {
    slug: 'resume', chapter: 'resume', title: 'Résumé',
    intro: 'The last page of the notebook. Take a copy of my résumé or find me on GitHub and LinkedIn.',
    notes: [{ label: 'Tanmay Patel', text: 'Data engineering, backend systems, and applied AI.' }],
    leftLinks: [
      { label: 'View PDF', href: profile.resume },
      { label: 'Download PDF', href: profile.resume, download: 'Tanmay_Patel_Resume.pdf' },
      ...socials,
    ],
    facingTitle: 'Scan to open my résumé',
    evidence: { kind: 'resume' },
  },
]
