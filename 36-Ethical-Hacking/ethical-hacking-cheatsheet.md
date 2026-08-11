# Ethical Hacking Cheat Sheet

Quick reference for penetration testing methodology, tools, OSINT,
common vulnerabilities, and the legal/ethical rules of engagement.

> Authorized testing only. Never test systems you do not own or lack
> written permission to test.

## Core Concepts

### What Is Ethical Hacking
- Authorized probing of systems to find and fix vulnerabilities
- Same techniques as attackers, but with scope, permission, and reports
- Roles: penetration tester, red team, bug bounty hunter
- Distinguish from black-hat (malicious) and grey-hat (gray area)

### Penetration Testing Phases

| Phase | Purpose | Key Activities |
|-------|---------|----------------|
| Reconnaissance | Gather intel | OSINT, DNS, whois |
| Scanning | Find live hosts/services | nmap, vuln scan |
| Enumeration | Detail services/accounts | Ports, shares, versions |
| Exploitation | Gain access | Exploits, metasploit |
| Post-exploitation | Keep access, move | Privilege escalation, pivoting |
| Reporting | Communicate findings | Risk, evidence, remediation |

### Engagement Types
- Black box: testers know nothing about the target
- White box: full source code and architecture given
- Grey box: partial knowledge (e.g., credentials or docs only)
- Scope defines targets, techniques, and hours allowed

## Tools Table

| Tool | Purpose | Typical Use |
|------|---------|-------------|
| Nmap | Network scanner | Port scan, OS/version detect |
| Metasploit | Exploit framework | Run/pair exploits, payloads |
| Burp Suite | Web proxy + attacker | Intercept, fuzz, scan web apps |
| Wireshark | Packet capture | Analyze live network traffic |
| Hydra | Password bruteforce | Crack login over SSH/FTP/web |
| John / Hashcat | Hash cracking | Offline password recovery |
| Gobuster / Dirbuster | Directory brute | Find hidden web paths |
| SQLMap | SQLi exploitation | Detect/dump DB via injection |
| Nikto | Web server scanner | Known misconfigs, old files |
| Kali Linux | Tool distro | Bundles the above, live USB |
| OWASP ZAP | Web app scanner | Free alternative to Burp |
| Aircrack-ng | Wireless | WPA cracking, packet capture |

### Nmap Quick Examples
```
nmap -sV 10.0.0.1            # service + version detection
nmap -sS 10.0.0.1            # SYN (stealth) scan
nmap -p- 10.0.0.1            # all 65535 ports
nmap -O 10.0.0.1             # OS fingerprinting
nmap -p 80,443 10.0.0.1 -A  # aggressive scan on web ports
```

### Hydra Example
```
hydra -l admin -P rockyou.txt ssh://10.0.0.1
```
- `-l` single username, `-L` username list
- `-p` single password, `-P` password list

## Reconnaissance (OSINT)

### Passive vs Active
- Passive: no direct contact, logs left on third parties (search, DNS)
- Active: direct interaction with the target (scanning, requests)

### Sources
- WHOIS: domain ownership, registrar, contact data
- DNS: dig/nslookup, subdomain enumeration
- Search engines + Google dorks (`site:`, `inurl:`, `filetype:`)
- Shodan/Censys: internet-exposed devices and ports
- GitHub: leaked secrets, internal repos, employee handles
- Social media & LinkedIn: employees, tech stack hints
- Public breach dumps: reused credential patterns
- Certificates (crt.sh): subdomains from issued TLS certs

### DNS Recon
```
dig example.com any          # all record types
dig -x 8.8.8.8               # reverse lookup
nslookup -type=MX example.com# mail servers
subfinder example.com        # subdomain brute + APIs
```

## Common Vulnerabilities

### OWASP Top 10 (Highlights)
| # | Class | Quick Mitigation |
|---|-------|------------------|
| 1 | Broken Access Control | Server-side checks, RBAC |
| 2 | Cryptographic Failures | Strong TLS, hash not encrypt |
| 3 | Injection | Parameterized queries, validate |
| 4 | Insecure Design | Threat models in dev |
| 5 | Security Misconfiguration | Patch, least privilege, headers |
| 6 | Vulnerable Components | Dependency scanning, updates |
| 7 | Auth Failures | MFA, rate limiting, expiry |
| 8 | Data Integrity Failures | Signatures, tamper detection |
| 9 | Logging Monitoring Failures | Centralized logs + alerts |
| 10 | SSRF | Validate URLs, deny internal |

### Privilege Escalation Notes
- Linux: `sudo -l`, SUID binaries, writable cron jobs, kernel exploits
- Windows: stored creds, unquoted service paths, always-install-elevated
- Check for world-writable configs and exposed service accounts

### Common Web Findings
- Verbose error messages revealing stack traces
- Default credentials left on admin panels
- Missing security headers, TLS older than 1.2
- Unauthenticated endpoints returning internal data
- Upload filters bypassable by double extensions or MIME spoofing

## Methodology

### Basic Web Test Flow
```
1. Map the app: crawl every page, note parameters
2. Proxy everything through Burp (set up CA certificate)
3. Enumerate auth, roles, and user-controlled inputs
4. Test each input: injection, XSS, path traversal, IDOR
5. Check headers, cookies (httpOnly, secure, SameSite)
6. Test rate limits and bruteforce resistance
7. Escalate IDOR: try object ids of other users
8. Re-test after each confirmed finding with proof
9. Produce report: severity, reproduction, remediation
```

### Reporting Essentials
```
Scope tested          targets, dates, permissions
Executive summary     plain-language risk picture
Findings table        severity, asset, probability
Evidence             screenshots, requests/responses
Remediation          concrete fix per vulnerability
Repeat testing       what was confirmed after fixes
```
- Score with CVSS; define agreed severity levels up front

## Legal and Ethical Notes

> Unauthorized access is illegal in most jurisdictions, even if no
> harm is done. Only test with explicit written authorization.

- Every engagement needs a signed scope document (rules of engagement)
- Stay inside scope: no scanning outside approved assets
- Never exfiltrate or destroy data you encounter
- Report responsibly: full disclosure after remediation, coordinated
- Respect disclosure timelines and bug bounty program rules
- Handling real stolen credentials? Report and stop, do not use them
- See also: CFAA (US), Computer Misuse Act (UK), local laws

## Real-World Application

- **Bug bounty (web app)**: HackerOne/Intigriti target; start with
  subdomain enumeration, map features, probe IDOR on object ids,
  test file upload filters, report with clean reproduction
- **Internal pentest**: authorized nmap sweep of netblocks, identify
  default services, weak SMB/auth, escalate to domain admin, report
- **Security review**: scan dependency tree, check cloud IAM over-permission,
  audit API keys exposure in git history, verify backup restoration

## Common Pitfalls

- Attacking out of scope or beyond the authorized subnet
- Skipping documentation; findings without reproduction steps
- Not cleaning Up payloads or accounts created during testing
- Storing target credentials or logs on personal devices
- Believing a scanner output without manual verification
- Assuming a finding is not exploitable due to app logic
- Over-running brute force against live production accounts

## Interview Tips

1. Walk through your phases: recon -> scan -> exploit -> report
2. Explain when you would pick a specific tool for a task
3. Draw the difference between black/grey/white box testing
4. Discuss a real vulnerability you found and how you reported it
5. Explain how you stay ethical and within scope
6. Know how to read and produce a good penetration test report
7. Be ready to explain CVSS severity scoring at a high level
8. Demonstrate curiosity: you research CVEs, read advisories
9. Mention the OWASP Top 10 and re-test expectations
10. Show respect for the rules of engagement before technical flair

> Skill without permission is a crime; skill with permission is a career.