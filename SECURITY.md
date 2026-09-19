# Security Policy

## Reporting a Vulnerability

This skin is pure presentation CSS injected into the DeepSeek Harness web
client — it performs no network calls, holds no credentials, and executes no
code beyond the `apply()` lifecycle hook that injects a stylesheet.

If you still find a security issue (e.g., an unsafe style injection path or a
supply-chain problem in the published npm package), please open a **private
security advisory** at:

https://github.com/TaiyakiOffical/claude-style-skin/security/advisories/new

Do not open public issues for security reports. You will receive a response
within 7 days.
