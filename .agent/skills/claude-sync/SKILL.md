---
name: claude-sync
description: Sync agent settings and instructions from .claude directory to .agent directory. Run this skill to keep the agent's context in sync with Claude Code users.
---

# Claude Sync Skill

## Overview
Team members might use Claude Code, which maintains its own agent settings, memory, and instructions inside the `.claude` directory. To ensure all AI agents share the same project context and rules, this skill synchronizes relevant configurations from `.claude` to `.agent` (or `.agents`).

## When to use
- When the user explicitly asks to sync `.claude` to `.agent`.
- When updating or initializing agent workspaces and you notice a `.claude` directory present.

## Instructions
Execute the following steps when using this skill:

1. **Check for `.claude` directory**:
   Verify if the `.claude` directory exists in the project root. If it does not, notify the user that there is no Claude context to sync.

2. **Analyze `.claude` contents**:
   Read the files within the `.claude` directory (e.g., memory files, custom instructions, prompts). 
   - Identify core project rules, architectural decisions, and coding standards.

3. **Synchronize to `.agent`**:
   Translate and merge the identified rules into the `.agent` format:
   - Update `AGENTS.md` if the rules are project-wide agent directives.
   - Create or update specific skill markdown files (e.g., `.agent/skills/<skill-name>/SKILL.md`) if there are specialized workflows.
   - Ensure the `.agent` and `.agents` directories remain consistent, avoiding duplications.

4. **Report**:
   Provide a concise summary to the user outlining which rules and settings were successfully synchronized from `.claude` to `.agent`.
