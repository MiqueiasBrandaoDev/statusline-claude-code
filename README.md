# Claude Code Statusline

> Barra de status visual para o Claude Code CLI — janela de contexto, rate limits e diretório atual em tempo real.

```
███░░░░░ 38% | ████░░░░ 51% | ██░░░░░░ 22%
Model:claude-sonnet-4-6 | /home/user/meu-projeto
```

---

## O que exibe

| Segmento | Descrição |
|---|---|
| **Semana** | Uso do rate limit dos últimos 7 dias |
| **Sessão** | Uso do rate limit das últimas 5 horas |
| **Contexto** | Uso da janela de contexto |
| **Model** | Nome do modelo ativo |
| **Dir** | Diretório de trabalho atual |

As cores mudam automaticamente de verde para âmbar quando qualquer métrica ultrapassa **75%**.

---

## Arquivos

```
statusline.js           # Script Node.js — lê JSON do stdin e exibe as linhas ANSI
statusline-command.sh   # Helper de prompt bash (formato user@host:dir)
settings.json           # Config do Claude Code que ativa o statusline
```

---

## Como funciona

O Claude Code envia um payload JSON para o comando do statusline a cada renderização do prompt. O script faz o parse e escreve duas linhas no stdout:

```
Linha 1: barra Semana | barra Sessão | barra Contexto
Linha 2: nome do modelo | diretório atual
```

Cada barra tem 8 blocos (`█` preenchido, `░` vazio) proporcionais ao valor percentual.

---

## Instalação

**1. Copie o script para a pasta de config do Claude:**

```bash
cp statusline.js ~/.claude/statusline.js
```

**2. Adicione a config do statusLine no `settings.json`** (`~/.claude/settings.json` ou no nível do projeto):

```json
{
  "statusLine": {
    "type": "command",
    "command": "node ~/.claude/statusline.js"
  }
}
```

**3. Reinicie o Claude Code.** A barra de status aparece na parte inferior do terminal.

---

## Personalização

### Alterar a cor

Encontre as constantes de cor no início do `statusline.js`:

```js
const color     = '\x1b[38;2;19;161;14m';   // verde  — estado normal
const colorWarn = '\x1b[38;2;230;160;0m';   // âmbar  — acima de 75%
```

Substitua os valores RGB (`R;G;B`) pelas cores que preferir.

### Alterar o limite de aviso

```js
const c  = val >= 75 ? colorWarn : color;
```

Troque `75` pelo limite desejado (ex.: `80` ou `90`).

### Largura da barra

A barra tem 8 blocos por padrão:

```js
const f = Math.round(val * 8 / 100);
const b = [...Array(8)].map(...)
```

Altere `8` para a largura que preferir.

---

## Requisitos

- [Claude Code](https://claude.ai/code) CLI
- [Node.js](https://nodejs.org) v18+ (usa apenas módulos nativos, sem necessidade de `npm install`)

---

## Licença

MIT
