# Blockchain Cheat Sheet

Quick reference for blocks, hashing, merkle trees, consensus,
smart contracts, tokens, wallets, and chain trade-offs.

> A blockchain is a shared, append-only ledger secured by cryptography
> and distributed consensus.

## Core Concepts

### Block Anatomy
```
Header:
  Previous hash (links the chain)
  Merkle root (summarizes transactions)
  Timestamp, nonce, difficulty target (PoW)
Body:
  List of transactions
```
- Changing one transaction changes the block hash
- A changed hash breaks the link, so history is tamper-evident
- Chain: each block references the hash of the one before it

### Key Properties
- Decentralized: no single owner of the ledger
- Immutable: append-only; rewriting costs enormous work
- Transparent: everyone can verify the same ledger
- Pseudonymous: identities behind public addresses (not anonymous)
- Trustless: rely on math and consensus, not on a counterparty

### Cryptography Basics Used
- Hash functions: SHA-256, Keccak-256 (one-way, deterministic)
- Digital signatures: ECDSA / Ed25519 prove you own an address
- Address = hash of a public key (short, human-friendly form)

### Merkle Tree
```
Transactions -> hashed pairwise -> single root hash
        t1  t2  t3  t4
        \/      \/
       h12     h34
          \    /
           root
```
- One root verifies all transactions
- A lightweight client verifies one tx with a small Merkle proof
- No need to download the full block to check a single entry

## Consensus Mechanisms Table

| Mechanism | How It Works | Examples | Energy | Finality Speed |
|-----------|--------------|----------|--------|----------------|
| PoW | Compete hashing a nonce | Bitcoin, Litecoin | Very high | Slow (minutes) |
| PoS | Stake collateral to propose | Ethereum, Cardano, Solana | Very low | Fast (seconds) |
| DPoS | Vote in delegates | EOS, Tron | Low | Fast |
| PoA | Trusted validators | Private/Besu, VeChain | Low | Fast |
| PBFT | Vote among validators | Hyperledger Fabric | Low | Instant (private) |
| PoH + PoS | Time ordering + stake | Solana | Low | Very fast |

- PoW security = cost of attack; PoS security = stake slashed
- Strongest security = chain with most decentralized hashpower/stake
- Undercutting the chain: an attacker forks, uses All resources

### 51% Attack
- Minority validates honestly -> if attacker gets >50% power/stake,
  they can double-spend and reorder transactions
- Mitigation: deep confirmations, large network, high cost of attack

## Transaction Lifecycle

### On-chain Flow
```
1. Sign: create tx, sign with the wallet's private key
2. Broadcast: send it to the network / mempool
3. Validate: nodes check signature, funds, nonce
4. Include: miner/validator picks it into a block
5. Execute: state changes are applied and recorded
6. Finalize: enough blocks/confirmations -> accepted
```
- Double spend risk lives between broadcast and finality
- Fees compete for inclusion; higher fee -> faster confirmation

### Block Confirmations Table
| Confirmations | Bitcoin Risk | Standard Rule |
|---------------|--------------|---------------|
| 0 | In mempool, reversible | Do not credit |
| 1-2 | Low, still some risk | Small payments |
| 6+ | Very low | Full settlement |
| 30+ | Negligible | Exchanges, large transfers |

## Smart Contracts

### What They Are
- Code deployed on-chain; anyone can call the functions
- Immutable once deployed (deployments choose upgrade patterns)
- Deterministic: same input -> same output on every node
- Execution costs gas, paid by the caller

### Solidity Example
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Greeter {
    string public greeting;

    constructor(string memory _greeting) {
        greeting = _greeting;
    }

    function setGreeting(string memory _greeting) public {
        greeting = _greeting;
    }
}
```

### Gas Concepts
- Every opcode costs gas; storage is the most expensive
- Keep logic simple and state small to save on fees
- Reentrancy hazard: external call before state updates
- Use the Checks-Effects-Interactions pattern; guard against reentry

## Wallets

### Custodial vs Non-Custodial

| Type | Keys | Example | Trade-off |
|------|------|---------|-----------|
| Custodial | Exchange holds keys | Binance, Coinbase | Convenient, trusted |
| Non-custodial | User holds keys | MetaMask, Ledger | Self-custody, your keys your coins |
| Hardware | Keys on offline device | Ledger, Trezor | Cold, safest for large sums |
| Paper | Keys printed offline | Manual backups | Secure vs digital theft |

- Mnemonic phrase (12-24 words) = the key; anyone with it controls funds
- Never share seed phrases; no support desk will ask for them
- Address reuse hurts privacy; use fresh addresses per transaction

## Token Types Table

| Standard | Type | Fungible | Key Idea |
|----------|------|----------|----------|
| ERC-20 | Fungible token | Yes | One token = another copy |
| ERC-721 | NFT | No | Each token unique (art, collectibles) |
| ERC-1155 | Multi-token | Both | Bundle fungible + NFTs in one |
| BEP-20 | BNB Smart Chain | Yes | ERC-20 equivalent |
| Native | Chain currency | Yes | ETH / BTC / SOL themselves |

### ERC-20 Minimal Interface
```solidity
interface IERC20 {
    function totalSupply() external view returns (uint256);
    function balanceOf(address owner) external view returns (uint256);
    function transfer(address to, uint256 value) external returns (bool);
    function approve(address spender, uint256 value) external returns (bool);
    function transferFrom(address from, address to, uint256 value)
        external returns (bool);
}
```

## Public vs Private Chains

| Aspect | Public (permissionless) | Private (permissioned) |
|--------|-------------------------|------------------------|
| Access | Anyone can read/write | Approved members only |
| Consensus | PoW / PoS / PoH | PoA / PBFT |
| Speed | Lower throughput | High throughput |
| Privacy | Transparent by default | Controlled access |
| Example | Ethereum, Bitcoin | Hyperledger Fabric, Besu |

- Consortium chains: multiple orgs jointly operate, semi-permissioned
- Reasons to go private: compliance, data privacy, known counterparties
- Public chain best when you need open trust and censorship resistance

## Real-World Application

- **NFT marketplace**: ERC-721 mint + list + marketplace, IPFS for
  artwork metadata, ERC-20 or native token for fees
- **DeFi lending**: ERC-20 collateral, a ledger contract tracks
  borrow/repay, oracle feeds prices, liquidation below threshold ratio
- **Supply chain track-and-trace**: private/consortium ledger records
  custody events; hash of documents on a public chain proves integrity
- **Tokenized payment**: stablecoins (ERC-20 pegged), merchant checkout
  converts fiat, instant-settled across borders

## Common Pitfalls

- Treating blockchain storage as free (gas, limited block space)
- Believing the chain itself is anonymous (pseudonymous instead)
- Sending on the wrong chain/network and losing funds forever
- Ignoring finality: accepting funds after one confirmation at scale
- Writing smart contract logic without testing -> exploited contract
- Storing seed phrases online or sharing them in screenshots
- Confusing hash/encryption: hashing is not encryption
- Assuming a fork is always safe; replay and split coin risks exist

## Interview Tips

1. Explain the hash chain: why tampering with one block is obvious
2. Describe how a Merkle proof lets a light client verify a tx
3. Compare PoW vs PoS: energy, security, finality, who burns what
4. Walk through a transaction from signing to final confirmation
5. Explain the difference between fungible and non-fungible tokens
6. Describe a smart contract reentrancy attack and the fix
7. Compare public vs private chains with real use cases
8. Explain what gas is and why it exists (spam prevention)
9. Discuss trade-offs: decentralization, scalability, security trilemma
10. Talk about why wallets keep keys and what "not your keys,
    not your coins" means

> Blockchain solves for trust between parties who do not trust each other.