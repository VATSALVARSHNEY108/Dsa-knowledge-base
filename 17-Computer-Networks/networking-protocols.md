---
layout: default
title: Networking Protocols
parent: Computer Networks
nav_order: 4
---

# Networking Protocols

## 1. Protocol Layers Overview

A protocol defines the rules for communication between network entities. The Internet relies on a suite of protocols organized into layers.

Protocol stack (Internet):

`
Application:  HTTP, HTTPS, FTP, SMTP, DNS, DHCP, SSH, Telnet
Transport:    TCP, UDP
Network:      IP (v4/v6), ICMP, ARP, IGMP
Link:         Ethernet, Wi-Fi (802.11), PPP, DSL
`

## 2. Application Layer Protocols

### HTTP / HTTPS (Hypertext Transfer Protocol)

- Port: 80 (HTTP), 443 (HTTPS)
- Request-Response protocol for web
- Methods: GET, POST, PUT, DELETE, PATCH, HEAD, OPTIONS

`
HTTP Request:
GET /index.html HTTP/1.1
Host: www.example.com
User-Agent: Mozilla/5.0
Accept: text/html

HTTP Response:
HTTP/1.1 200 OK
Content-Type: text/html
Content-Length: 1234

<html>...
`

| Status Code | Range | Meaning | Example |
|-------------|-------|---------|---------|
| 1xx | Informational | Continue, Switching Protocols | 101 WebSocket Upgrade |
| 2xx | Success | OK, Created, Accepted | 200 OK |
| 3xx | Redirection | Moved, Found, Not Modified | 301 Moved Permanently |
| 4xx | Client Error | Bad Request, Not Found | 404 Not Found |
| 5xx | Server Error | Internal Server Error, Gateway Timeout | 500 Internal Server Error |

**HTTPS**: HTTP over TLS/SSL. Encrypts all communication using asymmetric (handshake) + symmetric (data) encryption.

### DNS (Domain Name System)

- Port: 53 (UDP for queries, TCP for zone transfers)
- Hierarchical, distributed database

### SMTP (Simple Mail Transfer Protocol)

- Port: 25 (default), 587 (submission), 465 (SMTPS)
- Used for sending emails between mail servers
- Commands: HELO, MAIL FROM, RCPT TO, DATA, QUIT

### FTP (File Transfer Protocol)

- Port: 21 (control), 20 (data)
- Active vs Passive modes
- Commands: USER, PASS, LIST, RETR, STOR, DELE

### DHCP (Dynamic Host Configuration Protocol)

- Port: 67 (server), 68 (client)
- DORA process: Discover → Offer → Request → Acknowledge

## 3. Transport Layer Protocols

### TCP (Transmission Control Protocol)

- Connection-oriented, reliable, ordered
- Ports: 0-65535 (well-known 0-1023, registered 1024-49151, dynamic 49152-65535)

#### TCP Header (20-60 bytes)

`
 0                   1                   2                   3
 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
├─────────────────────────────────────────────────────────────────┤
│        Source Port (16)          │      Destination Port (16)   │
├─────────────────────────────────────────────────────────────────┤
│                       Sequence Number (32)                      │
├─────────────────────────────────────────────────────────────────┤
│                     Acknowledgment Number (32)                  │
├───────┬───────┬───────┬───────┬───────┬───────────────────────┤
│ Data  │Reservd│ Flags │  Window Size (16)                     │
│Offset │ (3)   │ (9)   │                                       │
├───────┴───────┴───────┴───────┴───────┴───────────────────────┤
│         Checksum (16)            │       Urgent Pointer (16)  │
├─────────────────────────────────────────────────────────────────┤
│                     Options (0-320 bits)                       │
└─────────────────────────────────────────────────────────────────┘
`

#### TCP Flags

| Flag | Name | Purpose |
|------|------|---------|
| SYN | Synchronize | Initiate connection |
| ACK | Acknowledgment | Confirm receipt |
| FIN | Finish | Graceful termination |
| RST | Reset | Abort connection |
| PSH | Push | Deliver immediately |
| URG | Urgent | Priority data |

#### Three-Way Handshake

`
Client                     Server
  │                          │
  │────── SYN (seq=x) ──────►│
  │                          │
  │◄─── SYN+ACK (seq=y,ack=x+1) ──│
  │                          │
  │────── ACK (seq=x+1,ack=y+1) ──►│
  │                          │
  │◄══════ Data Transfer ════►│
  │                          │
  │────── FIN ──────────────►│
  │◄────── ACK ──────────────│
  │◄────── FIN ──────────────│
  │────── ACK ──────────────►│
`

#### Flow Control (Sliding Window)

TCP uses a **receive window** (wnd) advertised by the receiver to prevent the sender from overwhelming it.

`
Sender                        Receiver
  │                              │
  │── window=10000 (2 segments)──►│
  │                              │ (buffer: 10000 free)
  │◄───── ACK+window=5000 ───────│ (processed 5000 bytes)
  │                              │
`

#### Congestion Control

| Algorithm | Purpose |
|-----------|---------|
| Slow Start | Exponential growth until threshold |
| Congestion Avoidance | Additive increase (AIMD) |
| Fast Retransmit | Retransmit after 3 duplicate ACKs |
| Fast Recovery | Avoid slow start after loss |

**Congestion Window (cwnd)** phases:
`
cwnd
│
│      Slow Start          Congestion Avoidance
│   ▲                   ───────────────────────
│   │                ▲
│   │             ▲
│   │          ▲
│   │       ▲
│   │    ▲
│   │ ▲
│   ├───────────────────────────────────► Time
│   ssthresh
`

### UDP (User Datagram Protocol)

- Connectionless, unreliable, no ordering
- Lower overhead (8-byte header)
- Use cases: DNS, VoIP, video streaming, gaming, DHCP

`
UDP Header (8 bytes):
├───────────────────────────────────────┤
│ Source Port (16) │ Dest Port (16)     │
├───────────────────────────────────────┤
│ Length (16)      │ Checksum (16)      │
└───────────────────────────────────────┘
`

### TCP vs UDP

| Feature | TCP | UDP |
|---------|-----|-----|
| Connection | Connection-oriented | Connectionless |
| Reliability | Guaranteed delivery | Best-effort |
| Ordering | Ordered | No ordering |
| Header size | 20-60 bytes | 8 bytes |
| Flow control | Yes (sliding window) | No |
| Congestion control | Yes (AIMD) | No |
| Speed | Slower | Faster |
| Use cases | Web, email, file transfer | Streaming, DNS, gaming |

## 4. Network Layer Protocols

### IP (Internet Protocol) — IPv4 Header

`
 0                   1                   2                   3
├─────────────────────────────────────────────────────────────┤
│Version│  IHL  │Type of Service│        Total Length        │
├─────────────────────────────────────────────────────────────┤
│        Identification         │Flags │   Fragment Offset   │
├─────────────────────────────────────────────────────────────┤
│  Time to Live │   Protocol    │       Header Checksum       │
├─────────────────────────────────────────────────────────────┤
│                     Source IP Address                       │
├─────────────────────────────────────────────────────────────┤
│                   Destination IP Address                    │
└─────────────────────────────────────────────────────────────┘
`

### ICMP (Internet Control Message Protocol)

- Used for error reporting and diagnostics
- ping uses ICMP Echo Request/Reply (Type 8/0)
- 	raceroute uses ICMP Time Exceeded (Type 11)

### ARP (Address Resolution Protocol)

Maps IP addresses to MAC addresses on a local network.

`
Host A wants to send to 192.168.1.2:
1. A broadcasts ARP request: "Who has 192.168.1.2?"
2. B responds: "I have 192.168.1.2, my MAC is 00:1A:2B:3C:4D:5E"
3. A caches the mapping in its ARP table
`

## 5. Link Layer Protocols

### Ethernet (IEEE 802.3)

- CSMA/CD (Carrier Sense Multiple Access with Collision Detection)
- Frame structure: Preamble → Dest MAC → Src MAC → Type → Data → FCS
- Speeds: 10 Mbps, 100 Mbps, 1 Gbps, 10 Gbps, 40 Gbps, 100 Gbps

### Wi-Fi (IEEE 802.11)

- CSMA/CA (Collision Avoidance) — different from Ethernet due to wireless
- Standards: 802.11a/b/g/n/ac/ax (Wi-Fi 6)

## 6. Key Protocol Ports

| Protocol | Port | Transport |
|----------|------|-----------|
| HTTP | 80 | TCP |
| HTTPS | 443 | TCP |
| FTP (control) | 21 | TCP |
| SSH | 22 | TCP |
| Telnet | 23 | TCP |
| SMTP | 25 | TCP |
| DNS | 53 | UDP/TCP |
| DHCP | 67/68 | UDP |
| POP3 | 110 | TCP |
| IMAP | 143 | TCP |
| SNMP | 161/162 | UDP |
| RDP | 3389 | TCP |
| MySQL | 3306 | TCP |
