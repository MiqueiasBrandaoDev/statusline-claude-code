# Claude Code Statusline

> Visual status bar for Claude Code CLI — context window, rate limits, and current directory at a glance.

```
███░░░░░ 38% | ████░░░░ 51% | ██░░░░░░ 22%
Model:claude-sonnet-4-6 | /home/user/my-project
```

---

## What it shows

| Segment | Description |
|---|---|
| **Semana** | 7-day rate limit usage |
| **Sessão** | 5-hour rate limit usage |
| **Contexto** | Context window usage |
| **Model** | Active model display name |
| **Dir** | Current working directory |

Colors shift from green to amber automatically when any metric hits **75%**.

---

## Files

```
statusline.js           # Node.js script — reads JSON from stdin, outputs ANSI status lines
statusline-command.sh   # Bash prompt helper (user@host:dir format)
settings.json           # Claude Code config that wires the statusline in
```

---

## How it works

Claude Code pipes a JSON payload to the statusline command on every prompt render. The script parses it and writes two lines to stdout:

```
Line 1: Semana bar | Sessão bar | Contexto bar
Line 2: Model name | working directory
```

Each bar is 8 blocks (`█` filled, `░` empty) proportional to the percentage value.

---

## Setup

**1. Copy the script to your Claude config folder:**

```bash
cp statusline.js ~/.claude/statusline.js
```

**2. Add the statusLine config to your `settings.json`** (`~/.claude/settings.json` or project-level):

```json
{
  "statusLine": {
    "type": "command",
    "command": "node ~/.claude/statusline.js"
  }
}
```

**3. Restart Claude Code.** The status bar appears at the bottom of the terminal.

---

## Customization

### Change the color

Find the color constants at the top of `statusline.js`:

```js
const color     = '\x1b[38;2;19;161;14m';   // green  — normal state
const colorWarn = '\x1b[38;2;230;160;0m';   // amber  — above 75%
```

Replace the RGB values (`R;G;B`) with any true-color values you want.

### Change the warning threshold

```js
const c  = val >= 75 ? colorWarn : color;
```

Replace `75` with your preferred threshold (e.g. `80` or `90`).

### Bar width

The bar is 8 blocks by default:

```js
const f = Math.round(val * 8 / 100);
const b = [...Array(8)].map(...)
```

Change `8` to any width you like.

---

## Requirements

- [Claude Code](https://claude.ai/code) CLI
- [Node.js](https://nodejs.org) v18+ (uses only built-ins, no `npm install` needed)

---

## License

MIT
