# Portfolio final revision

Implementation brief for OpenCode. The portfolio checkout is `C:\Users\LENOVO\portfolio`, with the frontend in `frontend/` and the supplied files in `assests/`. The product, brand, and tech stack documents and the earlier `change.md` inform this pass.

## 1. Replace Experiments with Skills and Frameworks

Remove the Experiments spread and bookmark from the book. Add a dedicated **Skills and Frameworks** spread after the About introduction, under the existing About bookmark. Keep About active on both About spreads. Update the spread order, page indicators, keyboard and swipe navigation, and internal links. Give the new spread a shareable route. Route old Experiments bookmarks to Skills and Frameworks. Keep the OAK-D-Lite recording under its own project. Review any Harbor link attached to the removed spread and remove that reference from the navigation.

Use the existing desktop two-page book. Put the résumé bullets on the left leaf and the AI FDE training bullets on the right. In the existing mobile view, show the same leaves in order, each with ordinary vertical scrolling. Use short grouped bullets, the existing type sizes, and the book's current spacing. If a line wraps at the smallest supported desktop width, tighten its wording while preserving the listed skills.

**Left leaf — Technical skills**

- **Programming** — Python, Scala, SQL, C++.
- **Data engineering** — Apache Spark, PySpark, Spark Streaming, Kafka, HBase, Hadoop/HDFS, Elasticsearch, MySQL, SQLite, Parquet, ETL, dimensional modelling.
- **LLM systems** — RAG, OpenAI API, embeddings, ChromaDB, vector search, reranking, Pydantic, SQLite FTS5, RapidFuzz, LiteLLM, Gradio.
- **Machine learning** — PyTorch, scikit-learn, pandas, NumPy, EfficientNetV2, CNNs, transfer learning, contrastive learning.
- **Developer tools** — Git, GitHub, Linux, Google Colab, uv.
- **CS foundations** — Data structures and algorithms, DBMS, operating systems, computer networks, object-oriented programming, machine learning, deep learning.

**Right leaf — Agentic AI and forward-deployed engineering**

- **LLMs and inference** — Model selection by quality, latency and cost. Structured outputs, prompt caching, OpenRouter provider routing, local and open-weight inference with Ollama, LM Studio and vLLM.
- **Agent frameworks and harnesses** — LangChain, LangGraph, Deep Agents and Claude Agent SDK. Coding agents, spec-driven delivery, context engineering, agent development lifecycle and tool permissions.
- **Retrieval and integrations** — Agentic RAG, Model Context Protocol (MCP), Qdrant, Agent2Agent (A2A), enterprise context and memory across sessions.
- **Workflow reliability** — Graph state, checkpoints, safe retries, human approval and resume, multi-agent coordination, and Postgres-backed state with Supabase.
- **Evaluation and observability** — Langfuse traces and experiments, cost-aware scoring, regression evaluation, held-out datasets, and gated improvement loops with rollback.
- **Architecture and rollout** — Discovery and RICE prioritization, AI governance, permission checks, prompt-injection defenses, FastAPI/OpenAPI, LiteLLM gateways, AWS Lambda and IAM, Amazon Bedrock AgentCore (Gateway, Policy, Identity, Memory, Runtime), and the Render alternative.

Introduce the right leaf as training completed through the AI FDE course. Where an existing project demonstrates a skill, use its current internal link. The linked course notes cover optional paths as well as the main labs. Keep them under course coverage unless project evidence supports a stronger claim. [Edward Donner’s AI FDE course outline](https://edwarddonner.com/2026/10/14/ai-fde-the-forward-deployed-engineer-agentic-ai-architect/)

## 2. Put the Transcript App demo in its current media slot

Replace the static project image with the supplied Transcript App demo at `assests/trasncript_app demo.mp4` (exact spelling). The existing still can serve as the poster if it shows the same app. Keep the current media frame and reserve its space before playback. Use native controls, inline playback on mobile, metadata-only preload, and user-initiated play. Add a one-line caption describing what the clip shows after reviewing it, and captions if speech carries information. Verify that playback, seeking, and fullscreen controls work without turning the book page.

Use `assests/960-oak-d-live_video.mp4` for the OAK-D-Lite project.

## 3. Add the paper and thesis to Research

| Evidence | Placement and label | Source |
| --- | --- | --- |
| Conference paper | Replace the excerpt link on Research notes with **Read the conference paper (PDF)**. Also surface it beside the Meta-Contrast results if the project already has an evidence row. | `assests/Tanmay_Patel_Conference_paper.pdf`, verified full 10-page paper. |
| M.Tech dissertation | Put **Read the M.Tech dissertation (PDF)** beside the dissertation entry on Research notes. | Use the approved dissertation-only copy. Export PDF pages 1–59 from `assests/thesis.pdf` to a separate public PDF. The source also contains a similarity-index annexure on page 60 and an integrity report on pages 61–129. Publish the 59-page export. |

Use ordinary inline hyperlinks with the existing evidence-link styling for both PDFs. Use the full dissertation title, *Robust Endoscopic Image Analysis Using Bi-Level Meta-Learning and Supervised Contrastive Geometry*, on the dissertation entry. Verify each public PDF opens from a direct route and has the expected title and page count.

## 4. Explain what each build does in the existing space

Keep the book format, type hierarchy, media-to-text balance, and working page-turn behavior. Replace generic descriptions with a short problem-and-outcome paragraph and up to three concise lines on what I built, why the design matters, and what the evidence shows. Keep one dominant visual per spread. Draft copy below can be trimmed to fit the current slots.

| Entry | Proposed copy direction |
| --- | --- |
| About | Lead with the NIT Hamirpur CSE dual degree and the thread across the portfolio: building data pipelines, making their outputs usable in applications, and evaluating model behavior. Use Octro as a concrete example. A stateful Spark Streaming pipeline consumed Kafka events, read funnel rules from MySQL, tracked conversion progress in HBase, and published aggregates to Elasticsearch. Mention the idempotent identity-mapping workflow if the About spread already has room for a second evidence line. |
| Vendor AI Assistant | “I built a wholesale assistant that answers product, price, stock, order and policy questions from different sources. Validated SQL tools handle operational lookups, with buyer-scoped order queries. Policy answers use Chroma retrieval and reranking.” Pair this with the PySpark Bronze–Silver–Gold pipeline for 400 products, 25,000 orders and 74,999 order lines. Mention quarantining invalid records and reconciliation as examples of the work behind reliable answers. Use the existing screenshots to show product clarification and a return-policy lookup. |
| OAK-D-Lite Pothole Detection | “I deployed YOLOv8 on an OAK-D-Lite and paired its detections with stereo depth. The camera demo overlays candidate potholes with model confidence and depth readouts.” Explain the split between object detection and stereo depth. Treat the clip as prototype evidence. It shows detections and readouts during a camera pass. |
| Transcript App | Lead with what the user supplies and what the app produces. Explain the processing flow and one design decision supported by the source. Use the demo caption to describe one complete workflow. Confirm the implemented inputs, outputs and processing steps from the code or your notes before writing those claims. |
| Meta-Contrast | “Glare, blur and similar-looking tissue make endoscopic images hard to classify. I combined an EfficientNetV2-B0 backbone with supervised contrastive learning to improve class separation. A small meta-learner uses validation feedback to adjust the influence of training samples.” Report 96.92% test accuracy versus 94.69% for the backbone-only ablation, alongside 0.9593 Cohen’s kappa and a 0.0227 Brier score on the five-class Kvasir-VQA experiment. Use the diagram to show where the two heads and the reweighting loop fit. |
| Research notes | Explain what each reading link offers. The conference paper presents the method and results discussed at ICICST 2026 at NIT Jalandhar. The M.Tech dissertation gives the fuller research account. Keep co-author credit and use the two full-document links. |

For any other visible project, follow the same approach after checking its source and evidence. Keep numeric claims tied to the résumé, paper, or project artifacts.

## 5. Add the certificates near the end

Add a **Certificates** spread directly before the final Résumé spread. Give each certificate one leaf on desktop and one page on mobile. Use the existing evidence styling, with the course title, completion date, and a compact **View certificate (PDF)** link. A small legible preview can use the existing media frame. Keep the résumé and contact links on the final spread.

- **AI FDE: The Forward Deployed Engineer & Agentic AI Architect** — Edward Donner, completed 13 November 2026, 21.5 hours. Source `assests/fde certificate.pdf`.
- **AI Engineer Core Track: LLM Engineering, RAG, QLoRA, Agents** — Ligency and Ed Donner, completed 5 September 2026, 33.5 hours. Source `assests/certificatre.pdf`.

## 6. Show the Meta-Contrast architecture on the project spread

Use the architecture as the main visual on the Meta-Contrast project spread, opposite the method and results. Use the supplied `assests/meta_contrast architecture.png` (exact spelling). The conference paper also shows the architecture as **Figure 1, PDF page 2**. Use a caption that explains the shared EfficientNetV2 backbone, classification and contrastive projection heads, and validation-driven feedback to the sample-weighting MLP. Supply equivalent alt text and a way to open the full-size figure. Fit the entire diagram inside the existing frame and preserve its aspect ratio.

## Checks for the implementation pass

- Run the frontend build and TypeScript checks. Test desktop and mobile page order, About bookmark state, old Experiments links, direct refresh, Back and Forward, keyboard navigation and reduced motion.
- Verify the skills bullets fit at desktop widths and remain readable on mobile. Confirm media controls leave page navigation inactive while in use, and that the page edges, typography and navigation remain consistent across the new spreads.
- Play both videos and verify their captions and posters match the projects. Check the diagram at full size and open the paper, approved dissertation copy, and both certificate PDFs from the built site.
