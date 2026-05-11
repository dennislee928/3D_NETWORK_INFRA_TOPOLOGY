# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |

## Reporting a Vulnerability

Please report security vulnerabilities by opening an issue on GitHub with the label `security`.
Do NOT disclose security vulnerabilities in public GitHub discussions or issues without first reporting them.

## Security Measures

- All credentials must be passed via environment variables, never hardcoded
- CORS is restricted to configured origins via `ALLOWED_ORIGINS` env var
- API endpoints use JWT authentication (see `doc/roadmap.md`)
- Rate limiting is enforced on all API routes
- Input validation is performed on all request bodies
