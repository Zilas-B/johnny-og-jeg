## Be aware: If Claude Code again ends up using a lot of tokens during one implementation, ask it if these rules were followed or need to be enforced.

Two rules:

1. Agents only read what I won't edit. Files I'll edit, I read directly at implementation time — never via an agent first (the edit-time read is mandatory anyway, so the agent pass is pure duplication).
2. Agents return findings, not verbatim code — locations, patterns, signatures. If I need the full file, I read it myself, once.

Net: agents are for breadth I won't touch; direct reads are for code I will.
