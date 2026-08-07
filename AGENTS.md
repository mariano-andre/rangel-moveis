<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may
all differ from your training data. Read the relevant guide in
`node_modules/next/dist/docs/` before writing any code. Heed deprecation
notices.

<!-- END:nextjs-agent-rules -->

<!-- BEGIN:general-agent-rules -->

# General Agent Rules

Strictly adhere to the following behavioral guidelines:

1. **Verify Automatically:** You MUST run `deno lint`, `deno check`, `deno fmt`,
   and run tests after EVERY small code change. Do not wait until the end of a
   task to verify your work.
2. **Commit Frequently:** You MUST create a Conventional Commit (e.g.,
   `feat(ui):`, `fix(db):`, `chore(deps):`, `refactor:`) immediately after every
   small change and successful verification.
3. **Prioritize Security (Adversarial Testing):** Actively adopt an adversarial
   mindset ("act as a hacker"). Proactively search for vulnerabilities, test bad
   scenarios, and attempt bypasses. Do not conserve tokens when verifying or
   testing security—thoroughness is absolutely essential.
4. **Do Not Fail Silently:** If a test fails, a build breaks, or a command
   returns an error code, do not ignore it. Analyze the error, explain what went
   wrong, and fix it before moving on.
5. **Preserve Existing Patterns:** Always match the surrounding code style,
   naming conventions, and architecture. Do not introduce new libraries or
   paradigms unless explicitly requested.
6. **Clean Up Temporary Artifacts:** If you create temporary scripts, debug
   logs, or scratch files to test something, you MUST delete them before
   concluding your task.
7. **No Destructive Assumptions:** If requirements are ambiguous (e.g., regarding
   data deletion or major architectural changes), stop and ask for clarification.
   Do not guess when the cost of being wrong is high.
8. **Keep Documentation in Sync:** Whenever you change the behavior of a
   function, component, or system, you MUST update the corresponding inline
   comments, docstrings, and READMEs.

<!-- END:general-agent-rules -->
