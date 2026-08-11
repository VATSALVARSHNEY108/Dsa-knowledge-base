---
layout: default
title: Cybersecurity Cheatsheet
parent: Cybersecurity
nav_order: 1
---

# Cybersecurity Cheat Sheet

Quick reference for core security concepts, common attacks, defense
layers, encryption, and best practices.

> Security is a process, not a product. Threat modeling comes first.

## Core Concepts

### CIA Triad
| Pillar | Meaning | Example Control |
|--------|---------|-----------------|
| Confidentiality | Only authorized see data | Encryption, ACLs |
| Integrity | Data not altered | Hashing, signatures |
| Availability | Data/service accessible | Redundancy, DDoS defense |

- Extensions: Authenticity (real source), Non-repudiation (can't deny), Accountability
- A control may trade one pillar to protect another

### Attack Surface
- Everything reachable by an attacker: open ports, web forms, APIs,
  third-party services, employees (social engineering), physical access
- Reduce it: close unused ports, kill unused endpoints, least privilege
- Attack vectors: network, web, wireless, physical, human, supply chain

### Security Terminology
- Vulnerability: a weakness (CVE, CWE)
- Exploit: code/technique that uses the vulnerability
- Threat: potential to cause harm (actor + intent)
- Risk = Likelihood x Impact
- Zero-day: unknown/unpatched vulnerability
- Threat modeling: STRIDE or PASTA early in development

## Common Attacks Table

| Attack | What Happens | Mitigation |
|--------|--------------|-----------|
| XSS | Attacker injects JS run in victim's browser | Escape output, CSP, sanitize input |
| SQL Injection | Malicious SQL alters queries | Parameterized queries, ORM |
| CSRF | Forced request using victim's session | CSRF tokens, SameSite cookies |
| MITM | Attacker intercepts traffic | TLS, cert pinning, HSTS |
| DDoS | Overwhelms resources | CDN, rate limiting, WAF |
| Phishing | Social engineering for credentials/installs | Training, MFA, link inspection |
| Session Hijacking | Steal session/token | httpOnly, secure cookies, rotation |
| Path Traversal | Read files outside root (`../../etc/passwd`) | Whitelist paths, normalize |
| Command Injection | OS commands from input | Avoid shell, validate strictly |
| Clickjacking | Trick clicks into hidden UI | X-Frame-Options, frame ancestors |
| IDOR | Access another user's resource by ID | Server-side ownership checks |
| Replay | Reuse captured valid request | Nonces, timestamps, signatures |

### Attack Code Example (SQLi vs Safe)
```python
# Vulnerable: string concatenation
query = f"SELECT * FROM users WHERE name = '{user_input}'"

# Safe: parameterized
cursor.execute(
    "SELECT * FROM users WHERE name = %s",
    (user_input,)
)
```

### XSS Example and Fix
```javascript
// Vulnerable
element.innerHTML = userInput;
// Safe
element.textContent = userInput;
```

## Defense Layers

### Defense in Depth
```
Perimeter (firewall, WAF, CDN)
  -> Network (segmentation, IDS/IPS)
    -> Host (patch, AV, hardening)
      -> Application (input validation, least privilege)
        -> Data (encryption at rest + in transit)
          -> Human (training, MFA)
```
- Assume breach: even if one layer fails, others contain the damage

### Security Headers
```http
Content-Security-Policy: default-src 'self'
Strict-Transport-Security: max-age=31536000
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Referrer-Policy: no-referrer
Permissions-Policy: geolocation=()
```

## Encryption Basics

### Symmetric vs Asymmetric

| Property | Symmetric | Asymmetric |
|----------|-----------|-----------|
| Keys | One shared key | Key pair (public/private) |
| Speed | Fast | Slow |
| Use case | Bulk data (TLS session) | Key exchange, signatures |
| Examples | AES, ChaCha20 | RSA, ECC |
| Risk | Key distribution | Private key compromise |

### How It Fits Together
```
TLS handshake:
  Client + Server exchange asymmetric keys (safe) -> agree on session key
  -> bulk traffic encrypted with fast symmetric AES
Password storage:  hash with salt, use bcrypt/argon2
File integrity:     hash/HMAC checks, signed artifacts
```
- Hash vs encryption: hashes are one-way, encryption is reversible
- Always salt and use slow hashes for passwords (bcrypt, argon2)

## Security Best Practices

### Authentication & Access
- MFA everywhere, especially admins
- Passwords hashed with bcrypt/argon2 + per-user salt
- Session and token expiry + rotation
- Least privilege: give the minimum access required
- Role-based access control (RBAC) + ownership checks for IDOR

### Application
- Validate and sanitize all input server-side
- Parameterized queries only; never raw string SQL
- Escape output at the presentation layer
- Patch regularly; watch CVEs for your stack
- Dependency scanning (npm audit, pip-audit, Snyk)

### Infrastructure
- Firewall only needed ports; default-deny
- Encryption in transit (TLS 1.2+) and at rest
- Centralize logs, alert on anomalies, test backups
- Rotate keys and secrets; use a vault
- Automated scan in CI: SAST, DAST, container scanning
- Prepare an incident response plan and run drills

### Disposal & Compliance
- Secure delete: overwrite or destroy media
- Know regulations: GDPR, HIPAA, PCI-DSS, SOC 2
- Data minimization: collect only what you need

## Real-World Application

- **Web store**: TLS, parameterized queries, CSRF tokens on forms,
  encrypted card data (PCI) via payment provider, WAF in front
- **SaaS platform**: MFA + SSO (OAuth/OIDC), RBAC per tenant, secrets
  in a vault, automated vuln scanning in CI, audit logs
- **API service**: rate limits, JWTs with short expiry, IP allowlists
  for admin routes, input schema validation, monitoring on anomalies

## Common Pitfalls

- Storing passwords in plaintext or with unsalted MD5/SHA1
- Trusting client input for IDs -> IDOR
- Using `innerHTML` or template literals with user data -> XSS
- String-built SQL queries -> SQLi
- Disabling TLS verification or using weak ciphers
- Hardcoding secrets and committing them to git
- CORS wide open (`*`) with credentials
- Ignoring patch management "until it breaks"
- Only testing security after release, never during design

## Interview Tips

1. Explain the CIA triad and give a control for each pillar
2. Compare XSS vs CSRF with concrete examples in code
3. Explain how TLS handshake combines symmetric + asymmetric crypto
4. Describe defense-in-depth layers for a web application
5. Explain why we salt and slow-hash passwords, not encrypt them
6. Walk through an IDOR exploit and its server-side fix
7. Discuss the tradeoff between usability and security controls
8. Know the principle of least privilege and give an example
9. Explain the difference between encryption, hashing, and signing
10. Show threat-modeling instincts, not just a list of tools

> Think like the attacker, build like the defender.