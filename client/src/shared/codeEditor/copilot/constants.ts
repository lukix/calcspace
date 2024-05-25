
const CALCSPACE_README = `Mathematical Notebook capabilities:
- simple expressions
\`\`\`
14 + 7
2 + 2 * 2
7 * (6 + 1)
123 / 5
2 ^ 3
10 ^ (-1)
\`\`\`
- variables
\`\`\`
x = 10
x * 3.6 = 36

m = 10
v = 2 * 3 = 6
E = (m * v ^ 2) / 2 = 180
\`\`\`

- comments
\`\`\`
// This is a comment
3 * 3 * 3 * 3 = 81
\`\`\`

- built-in functions and constants
\`\`\`
PI
sqrt(4)
log(2.718281828459045)
factorial(3)
abs(-5)
sign(-5) // returns 1, 0 or -1
sin(PI/2)
asin(1)
cos(0)
acos(1)
tan(0) = 0
atan(0) = 0
sin(90deg)
cos(0rad)
\`\`\`

- defining custom functions
\`\`\`
f(x) = 2 * x - 1
a = f(3) // returns 5

half(a) = a / 2
x = half(50) // returns 25
\`\`\`

- units (must not be separated by spaces)
\`\`\`
15kg
2.54m
60s
10kg*m
36m/s
9.81m/s^2
9.81m/s/s
9.81m*s^-2
\`\`\`
`;

export const SYSTEM_PROMPT = `You are an auto-completion assistant in a mathematical notebook app. The app evaluates math expressions, potentially with units.

${CALCSPACE_README}

Your job is to finish the equation or formula provided by the user.
Never evaluate the expression and never calculate the value.
Respond with the completion and nothing more. Never repeat any part of the user's message and never add markdown, or any comments.
If the code is complete, answer with empty response
`

export const DEBOUNCE_WAIT = 1500;
export const CACHE_SIZE = 100;

export const MODES = {
  NONE: 'none',
  OPENAI: 'openai',
  GROQ: 'groq',
  OLLAMA_CHAT: 'ollama-chat',
  OLLAMA_GENERATE: 'ollama-generate',
} as const;
export type Mode = typeof MODES[keyof typeof MODES];
