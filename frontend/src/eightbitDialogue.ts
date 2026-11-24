type Options = readonly [string, string, string]

export const flowPath = '/spread/vendor-ai-assistant/data-flow'

export const eightbitDialogue = {
  '/': [
    'Go on, open it. The good stuff’s inside. Hiring Tanmay?',
    'I guard the notebook. Tanmay builds the systems. Want to hire him?',
    'Hiring for backend or applied AI? You’ve got the right notebook.',
  ],
  '/spread/about': [
    'Tanmay earned a CSE dual degree at NIT Hamirpur. I earned a bookmark.',
    'At Octro, Kafka carried the events and Spark Streaming tracked funnel conversions.',
    'Tanmay built identity updates that could run again without changing the result.',
  ],
  '/spread/about#page-2': [
    'Raw records went into Vendor AI. A database the assistant could query came out.',
    'A model score tells you more when it has a baseline. See Meta-Contrast.',
    'If you like clean tables and suspiciously specific test results, stick around.',
  ],
  '/spread/skills-and-frameworks': [
    'PySpark for the pipeline. SQLite when the assistant needs a quick lookup.',
    'Python, Scala, SQL, C++. I only speak pixels, but I’m very fluent.',
    'PyTorch helped train Meta-Contrast. The test split had the final word.',
  ],
  '/spread/skills-and-frameworks#page-2': [
    'A checkpoint lets a workflow pick up where it left off. A bookmark for agents.',
    'An evaluation set gives you a way to tell whether a prompt change helped.',
    'Token cost, speed, and quality all get a vote when you choose a model.',
  ],
  '/spread/projects': [
    'Four builds. Pick a pothole, a wholesale question, an expert call, or an image.',
    'From road footage to wholesale records, half the job is making data usable.',
    'Start with the demos if you’re curious. You can follow the code from there.',
  ],
  '/spread/projects#page-2': [
    'Like data pipelines? Vendor AI takes you from raw records to answers.',
    'Want to see a camera at work? The pothole demo puts depth next to detections.',
    'Transcript App has the receipts. Meta-Contrast has the test results. Pick your rabbit hole.',
  ],
  '/spread/vendor-ai-assistant': [
    'Prices come from SQL. Return policies come from documents. Different questions, different drawers.',
    'PySpark processed 25,000 orders and 74,999 order lines. That’s a lot of receipts.',
    'Order lookups are scoped to the buyer. 8bit respects a closed ledger.',
  ],
  '/spread/vendor-ai-assistant#page-2': [
    'Ask for atta and the assistant checks which product you mean before quoting a price.',
    'The oil-return answer comes from the policy. The product catalog has other duties.',
    'Watch the assistant pause to clarify. Sometimes that’s the smartest thing it can do.',
  ],
  '/spread/oak-d-lite-pothole-detection': [
    'YOLOv8 spots the likely pothole. Stereo depth estimates how far away it is.',
    'Two cameras see the road from slightly different angles. That difference helps estimate depth.',
    'A pothole got a bounding box. Still waiting for it to get repaired.',
  ],
  '/spread/oak-d-lite-pothole-detection#page-2': [
    'Watch for the box, the confidence score, and the distance estimate in the same frame.',
    'That distance is an estimate. The clip shows the prototype working on a camera pass.',
    'Silent film. Very dramatic road surface.',
  ],
  '/spread/transcript-app': [
    'Load the transcripts, pick a question, and compare how each expert answered.',
    'Expand an answer to see its timestamp and the lines around it. Context travels with the quote.',
    'The interview guide is optional. Bring the transcripts and start there.',
  ],
  '/spread/transcript-app#page-2': [
    'Watch the same guide question go to several experts and come back as separate answers.',
    'Click a source in the demo. You’ll see exactly where the supporting excerpt came from.',
    'This walkthrough takes about five minutes. You can scrub straight to the source check.',
  ],
  '/spread/endoscopy-image-classification': [
    'Glare, blur, similar-looking tissue. Endoscopy gives a classifier plenty to squint at.',
    'Validation feedback helps decide which training images get a louder vote.',
    'On the five-class test, accuracy rose from 94.69% for the backbone to 96.92%.',
  ],
  '/spread/endoscopy-image-classification#page-2': [
    'One EfficientNet backbone feeds two heads. One predicts the class and one learns an embedding.',
    'The contrastive head helps pull features from the same class closer together.',
    'Follow the loop in the diagram. Validation feedback helps update the sample weights.',
  ],
  '/spread/research': [
    'The Meta-Contrast paper was presented at ICICST 2026 at NIT Jalandhar.',
    '96.92% came from a five-class Kvasir-VQA test. The paper shows what went into that number.',
    'Glare can fool a model. The paper explains how Tanmay and Ajay Kumar Mallick tackled it.',
  ],
  '/spread/research#page-2': [
    'Table 4.2 tests the contrastive loss and the meta-learner separately, then puts them together.',
    'The t-SNE plots show how the baseline and full model arrange image features.',
    'Chapter 4 explains the data split and training episodes. Spare a thought for my tiny reading glasses.',
  ],
  '/spread/certificates': [
    'The AI FDE course covered checkpoints, tool permissions, and human approval.',
    'Tanmay spent 21.5 hours on AI FDE. I spent mine perfecting the blink.',
    'One takeaway from AI FDE: give a tool only the permissions its job needs.',
  ],
  '/spread/certificates#page-2': [
    '33.5 hours covering LLM engineering, RAG, QLoRA, and agents.',
    'RAG gives a model something to read before it answers. A habit I fully endorse.',
    'QLoRA makes fine-tuning more memory-efficient. Handy when your GPU has a small appetite.',
  ],
  '/spread/resume': [
    'The résumé’s one page. My autobiography is six animations and a blink.',
    'Backend, data engineering, and applied AI, all on one sheet.',
    'Grab the PDF for later, or follow the GitHub link for the longer version.',
  ],
  '/spread/resume#page-2': [
    'Last page. First conversation? Here’s how to hire or reach Tanmay.',
    'The QR opens Tanmay’s résumé. Hiring? You can reach him directly, too.',
    'That’s the notebook. If Tanmay fits the role, say hello.',
  ],
  [flowPath]: [
    'Vendor records take the PySpark-to-SQLite route. Policies take the document-search route.',
    'Two paths, one answer box. The question decides which path to take.',
    'Follow the arrows. Structured records power lookups, while documents explain the rules.',
  ],
} as const satisfies Record<string, Options>

export type DialogueKey = keyof typeof eightbitDialogue

export function toDialogueKey(href: string): DialogueKey | null {
  return Object.hasOwn(eightbitDialogue, href) ? href as DialogueKey : null
}

export const hiringContact = { email: 'workingtanmay@gmail.com', phone: '+919317687514' }
