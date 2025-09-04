# D-Sent Messenger
![D-Sent Messenger Logo](./assets/logo.png)
Welcome to **D-Sent Messenger** — a decentralized, privacy-first peer-to-peer (P2P) chat platform that provides the functionality of modern communication tools (like Discord or Google Hangouts) without compromising on user privacy or requiring centralized control.

---

## 🌐 Overview

D-Sent Messenger is designed around a **minimal grid architecture**:
- **Grid-connected nodes**: Every user device acts as both a client and a peer in the network.
- **Minimal matchmaker server (optional)**: Used only for peer discovery and encrypted blob storage (friend/block lists, connection hints). No plaintext messages or passwords are stored.
- **Full end-to-end encryption (E2EE)**: Only sender and recipient can read direct messages (DMs). Group chat messages are encrypted with per-group shared keys.
- **Zero-knowledge storage**: Servers never see user data; all sensitive information is encrypted on the client.

This makes D-Sent Messenger resilient, censorship-resistant, and highly private — perfect for communities who demand maximum confidentiality.

---

## 🔒 Security Model

- **OPAQUE or SRP-based Authentication**: Secure remote password protocols ensure the server never learns plaintext passwords.
- **Client-side encryption of blobs**: Friend/block lists, session metadata, and connection hints are encrypted before leaving the client.
- **AES-GCM Encryption for Messages**: All chat messages are encrypted end-to-end using AES-GCM with ephemeral session keys.
- **Forward Secrecy**: Session keys rotate periodically; compromise of one key doesn’t expose past or future messages.
- **Zero Knowledge**: The server cannot decrypt stored data; only clients hold the necessary keys.

---

## 💬 Features (Discord/Google Hangouts parity)

### 1. **Core Messaging**
- **Direct Messages (DMs)** — End-to-end encrypted one-on-one chats.
- **Group Chats** — Per-group key-based encryption.
- **Threaded Conversations** — Replies grouped in conversation trees.
- **Rich Text Support** — Markdown-like formatting.
- **Media Attachments** — Images, audio, video encrypted and sent via P2P.

### 2. **Presence & Status**
- Online/Offline/Idle/Do Not Disturb indicators.
- Custom status messages.

### 3. **Friends & Blocking**
- Encrypted **friend list**.
- Encrypted **block list** (ensures unwanted peers cannot establish sessions).
- **Mutual consent** for friend requests.

### 4. **Voice & Video**
- **Peer-to-peer voice calls** with WebRTC.
- **Group video calls** with selective forwarding.
- **Screen sharing** (encrypted peer-to-peer).

### 5. **Servers & Channels (Community Model)**
- Community “servers” are **federated groups** identified by cryptographic IDs.
- Channels inside servers for topic-specific discussions.
- Moderation tools (ban, mute, roles) — implemented via **cryptographic access control lists**.

### 6. **Notifications**
- Encrypted push notifications (delivered through service workers).
- Configurable per-chat/channel.

### 7. **File Sharing & Storage**
- Encrypted file uploads using client-side key wrapping.
- Peer-to-peer file distribution (optionally grid-assisted for reliability).

### 8. **Cross-Platform PWA**
- Runs as a **Progressive Web App (PWA)**.
- Works on desktop, mobile, and offline-first mode.
- Background sync using **Service Workers**.

### 9. **Privacy Enhancements**
- No metadata leakage: messages are padded and time-randomized.
- Optional onion routing for peer connections.
- Dead man’s switch for automatic contact notification if a user goes missing.

---

## ⚙️ Technical Architecture

1. **Authentication**
   - OPAQUE/SRP protocol for zero-knowledge password authentication.
   - Handshake key (`UUID`) issued on successful login.

2. **Message Encryption**
   - Messages encrypted with AES-GCM.
   - Key agreement with X25519 for establishing per-session keys.
   - Forward secrecy via ephemeral session key rotation.

3. **Peer Discovery**
   - Minimal matchmaking server (optional).
   - Encrypted blobs store last connection info & peer hints.
   - Peer exchange via WebRTC ICE candidates.

4. **Storage**
   - Server stores encrypted blobs only.
   - Client performs KDF (Argon2/scrypt) on password to derive storage key.
   - Updates sent as encrypted JSON.

5. **Transport**
   - WebRTC for real-time P2P.
   - Data channels for text/media.
   - SRTP for voice/video.

---

## 🚀 Getting Started

1. **Install**
   - Open the PWA in any modern browser (Chrome/Firefox/Edge/Safari).
   - Optional: Add to home screen for full app experience.

2. **Register**
   - Choose a username.
   - Password is **never sent** to the server — only a verifier.
   - Client generates keys & encrypts initial state before sending.

3. **Login**
   - Perform OPAQUE/SRP handshake.
   - Fetch encrypted blobs, decrypt locally.
   - Establish P2P connections with friends.

4. **Start Chatting**
   - Create servers, channels, or DMs.
   - Share files, start voice/video calls, and enjoy secure messaging.

---

## 🔮 Roadmap

- ✅ End-to-end encrypted DMs
- ✅ Group chats with per-group keys
- ✅ Voice/video over WebRTC
- ✅ Progressive Web App (PWA) support
- 🔜 Onion-routed peer discovery
- 🔜 Decentralized identity system
- 🔜 Plugin ecosystem for community extensions

---

## 🛡️ Why Choose D-Sent Messenger?

- **Maximum Privacy** — Only intended peers can read messages.
- **Minimal Server Reliance** — Server used only for discovery/storage.
- **Full Feature Set** — Matches capabilities of Discord/Hangouts.
- **Grid Connected** — Resilient, decentralized, censorship-resistant.

---

## 📖 License

This project is licensed under the **AGPLv3** — free to use, modify, and distribute with attribution.

---

**Your conversations. Your data. Your control.**

