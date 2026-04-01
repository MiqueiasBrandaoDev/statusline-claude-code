#!/usr/bin/env node
let raw = '';
process.stdin.on('data', chunk => raw += chunk);
process.stdin.on('end', () => {
  try {
    const d = JSON.parse(raw);

    const model  = d?.model?.display_name ?? 'Claude';
    const pct    = Math.floor(d?.context_window?.used_percentage ?? 0);
    const cwd    = d?.workspace?.current_dir ?? '';

    const fiveHourPct = d?.rate_limits?.five_hour?.used_percentage ?? null;
    const sevenDayPct = d?.rate_limits?.seven_day?.used_percentage ?? null;

    const reset    = '\x1b[0m';
    const color    = '\x1b[38;2;19;161;14m';
    const colorDim = '\x1b[2;38;2;19;161;14m';
    const colorWarn= '\x1b[38;2;230;160;0m';
    const sep      = `${colorDim} | ${reset}`;

    const makebar = (val) => {
      const c = val >= 75 ? colorWarn : color;
      const d2 = val >= 75 ? colorWarn : colorDim;
      const f = Math.round(val * 8 / 100);
      const b = [...Array(8)].map((_, i) =>
        i < f ? `${c}█${reset}` : `${d2}░${reset}`
      ).join('');
      return `${b} ${c}${val}%${reset}`;
    };

    const modelPart   = `${color}Model:${model}${reset}`;
    const ctxPart     = `${color}Contexto:${reset}${makebar(pct)}`;
    const sessionPart = fiveHourPct !== null
      ? `${fiveHourPct >= 75 ? colorWarn : color}Sessão:${reset}${makebar(Math.round(fiveHourPct))}`
      : null;
    const weekPart    = sevenDayPct !== null
      ? `${sevenDayPct >= 75 ? colorWarn : color}Semana:${reset}${makebar(Math.round(sevenDayPct))}`
      : null;
    const dirPart     = cwd ? `${colorDim}${cwd}${reset}` : null;

    const line1 = [weekPart, sessionPart, ctxPart].filter(Boolean).join(sep);
    const line2 = [modelPart, dirPart].filter(Boolean).join(sep);

    process.stdout.write(line1 + '\n' + line2 + '\n');
  } catch {
    process.stdout.write('Claude Code\n');
  }
});
