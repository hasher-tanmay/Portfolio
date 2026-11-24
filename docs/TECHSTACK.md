# Tech stack

| Area | Choice |
| --- | --- |
| Frontend | React, Vite, strict TypeScript |
| Book | Semantic HTML, responsive CSS, spine-pinned CSS 3D transforms, and reduced-motion styles |
| Backend | FastAPI and Pydantic on Python, managed with uv |
| Conversation | LangGraph with a checkpointer and one isolated thread per visitor conversation |
| Evidence | Curated project briefs and approved assets, plus read-only GitHub MCP for allowlisted public repos |
| Analytics | Separate site analytics for visits and clicks |

## Implementation boundaries

- Deploy the frontend preview as a static build. Configure the host to serve direct spread URLs on refresh. Serve only the assets selected for that build.
- Host FastAPI separately for the live release. Keep the API base URL in frontend configuration and allow only the appropriate frontend origins. Keep provider credentials in backend configuration.
- Use the current spread as optional chat context. FastAPI validates the conversation and scopes checkpoint access to the visitor. Route simple navigation requests to known links. Retrieve evidence for project questions and return citations with the answer.
- Start with CSS 3D. Revisit Three.js only if the first prototype shows that sheet bending is worth the extra complexity.
- Choose the frontend host, API host, model provider, checkpoint store, and analytics provider when their milestone needs them. Pin dependency versions during implementation and record setup commands in the README.
