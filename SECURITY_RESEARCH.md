# Security Research & Vulnerable Dependencies

## Purpose

This document outlines the intentionally vulnerable dependencies included in this project for **security research and educational learning**. All vulnerabilities listed here are known and documented.

## Vulnerable Dependencies Analysis

### 1. axios@1.6.0

**CVE Examples:**
- Server-Side Request Forgery (SSRF) vulnerabilities
- XXE (XML External Entity) processing in certain configurations

**Learning Points:**
- How HTTP clients can be exploited
- SSRF attack vectors
- Input validation importance

**Modern Fix:** Upgrade to axios >= 1.7.2

---

### 2. lodash@4.17.20

**CVE Examples:**
- Prototype pollution vulnerabilities
- Object key manipulation attacks

**Learning Points:**
- JavaScript prototype chain exploitation
- Object merging dangers
- Deep clone vulnerabilities

**Modern Fix:** Upgrade to lodash >= 4.17.21

---

### 3. jsonwebtoken@8.5.1

**CVE Examples:**
- Algorithm confusion attacks
- Key confusion vulnerabilities
- Token verification bypass

**Learning Points:**
- JWT security assumptions
- Algorithm negotiation attacks
- Key management importance

**Modern Fix:** Upgrade to jsonwebtoken >= 9.0.0

---

### 4. node-fetch@2.6.7

**CVE Examples:**
- HTTP header injection
- Request smuggling vulnerabilities

**Learning Points:**
- Header validation
- HTTP protocol vulnerabilities
- Fetch API security

**Modern Fix:** Upgrade to node-fetch >= 3.x or use native fetch

---

### 5. express@4.17.1

**CVE Examples:**
- Multiple middleware bypass vulnerabilities
- Path traversal in certain configurations
- Query parameter pollution

**Learning Points:**
- Web framework security
- Middleware execution order
- Input sanitization

**Modern Fix:** Upgrade to express >= 4.18.2

---

## Security Research Recommendations

1. **Isolated Environment**: Only use this in isolated, non-production environments
2. **Study CVE Details**: Research each CVE in detail on NVD/CVEDetails
3. **Understand Attack Vectors**: Learn HOW each vulnerability is exploited
4. **Build Fixes**: Try to patch vulnerabilities yourself
5. **Compare Versions**: See what changed in fixed versions
6. **Document Findings**: Record your security research findings

## Resources

- **National Vulnerability Database (NVD)**: https://nvd.nist.gov/
- **CVE Details**: https://www.cvedetails.com/
- **OWASP Top 10**: https://owasp.org/www-project-top-ten/
- **CWE List**: https://cwe.mitre.org/

## Using Vulnerability Scanners

Test this project with security tools:

```bash
# Using pnpm audit
pnpm audit

# Using OWASP Dependency-Check
pnpm add -g snyk
snyk test

# List vulnerable packages
pnpm audit --json
```

## Learning Outcomes

After studying these vulnerabilities, you should understand:

- [ ] How SSRF attacks work
- [ ] Prototype pollution exploitation
- [ ] JWT algorithm confusion attacks
- [ ] HTTP header injection techniques
- [ ] Express middleware security
- [ ] Dependency security best practices
- [ ] How to read CVE reports
- [ ] Security-first code review

## Next Steps

1. Analyze each CVE in detail
2. Attempt to exploit vulnerabilities (in isolated environment)
3. Research patch code differences
4. Implement security fixes
5. Re-test with vulnerability scanners
6. Document lessons learned

---

**WARNING**: This is for educational/security research only. Never deploy with these vulnerable versions in production.
