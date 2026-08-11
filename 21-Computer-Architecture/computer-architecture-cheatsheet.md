# Computer Architecture Cheat Sheet

Quick reference for CPU structure, memory hierarchy, pipelining, ISA, and
addressing modes.

## Core Concepts

- **ISA**: The contract between software and hardware (interface).
- **Microarchitecture**: How the ISA is implemented internally.
- **CPU Clock**: Cycles per second; drives instruction execution.
- **Instruction Cycle**: Fetch -> Decode -> Execute -> Write-back.
- **Von Neumann vs Harvard**: Single vs separate instruction/data memory.

## CPU Components

- **ALU**: Arithmetic/logic unit (add, sub, and, or, compare).
- **Registers**: Fastest storage; hold operands and results.
- **PC (Program Counter)**: Address of next instruction.
- **Control Unit**: Decodes instructions, generates control signals.
- **CU's Microcode**: Internal low-level control for each instruction.
- **Cache**: Small, fast memory between CPU and RAM.
- **Buses**: Data/address/control paths between components.

## Memory Hierarchy

| Level       | Size          | Access Time      | Cost/bit | Example         |
|-------------|---------------|------------------|----------|-----------------|
| Register    | <1 KB         | ~0.2 - 0.5 ns    | Highest  | CPU registers   |
| L1 Cache    | 32-64 KB      | ~0.5 - 1 ns      | High     | Per-core SRAM   |
| L2 Cache    | 256KB-1MB     | ~3 - 10 ns       | High     | SRAM            |
| L3 Cache    | 2-32 MB       | ~10 - 40 ns      | Medium   | Shared SRAM     |
| RAM (DRAM)  | 8-64 GB       | ~60 - 100 ns     | Low      | System memory   |
| SSD         | 256GB-4TB     | ~0.1 - 0.2 ms    | Lower    | NVMe/SATA       |
| Disk (HDD)  | 1-16 TB       | ~5 - 10 ms       | Lowest   | Mechanical      |

> Reuse cached data keeps you fast — locality of reference matters.

## Pipelining

### 5-Stage Pipeline

```
IF -> ID -> EX -> MEM -> WB
Fetch | Decode | Execute | Memory | Write-back
```

- Multiple instructions overlap in different stages.
- Speedup ideal = number of stages (5x here); real is lower.

### Hazards

| Hazard   | Cause                                 | Mitigation             |
|----------|---------------------------------------|------------------------|
| Structural| Hardware resource conflict           | More hardware, stall   |
| Data     | Instruction needs prior result        | Forwarding, stall      |
| Control  | Branch changes PC                     | Predict, flush         |

- **Forwarding/Data Bypass**: Pass result directly to next EX.
- **Branch Prediction**: Guess direction; flush on mispredict.
- **Dependencies**: RAW, WAR, WAW hazards in out-of-order cores.

> Pipeline stalls reduce IPC; deeper pipelines raise branch cost.

### Pipeline Performance Metrics

```
CPI = Cycles Per Instruction
        = 1 + stalls (ideal = 1)
Speedup = 1 / (1 + stall_fraction)
Throughput = Instructions / Time
Latency  = Time for one instruction end-to-end
```

## Cache Design

### Associativity

| Map Type        | Line Placement      | Pros                 | Cons          |
|-----------------|---------------------|----------------------|---------------|
| Direct-mapped   | Fixed slot          | Simple, fast         | Conflict misses |
| Set-associative | Slot in a small set | Balanced             | Slightly slower |
| Fully associative| Anywhere           | Fewest misses        | Slowest, complex |

- **Spatial Locality**: Use nearby data -> fetch lines/blocks.
- **Temporal Locality**: Reuse recent data -> keep it in cache.
- **Compulsory / Capacity / Conflict** misses: three types to learn.

### Example

```text
32 KB, 64-byte blocks, direct-mapped cache:
  index bits = log2(32K / 64) = log2(512) = 9 bits
  tag + index + block offset all come from the address
```

## Out-of-Order Execution

- Reorder independent instructions to hide stalls.
- **Scoreboard / Tomasulo**: hardware schemes to schedule ops.
- **Register Renaming**: eliminates false (WAR/WAW) dependencies.
- Result still written back in program order (in-order retirement).

## Parallel Processing

| Model        | Description                            | Example      |
|--------------|----------------------------------------|--------------|
| SIMD         | One instruction, many data elements    | AVX, NEON    |
| MIMD         | Each core runs its own instructions    | Multicore CPUs |
| ILP          | Parallelism inside one instruction stream | Pipelines, OoO |
| Task-level   | Parallel tasks/threads                 | OpenMP, TBB  |

### Amdahl's Law

```
Speedup = 1 / ((1 - p) + p / n)
  p = parallelizable fraction
  n = number of cores
Limit as n -> infinity: 1 / (1 - p)
```

> Serial portion caps total speedup, no matter how many cores.

## Instruction Set Architecture

| Property       | RISC                          | CISC                    |
|----------------|-------------------------------|-------------------------|
| Instruction len| Fixed                         | Variable               |
| Addressing     | Load/store (memory via ld/st) | Memory operands allowed |
| Registers      | Many                          | Fewer                   |
| Example        | ARM, RISC-V, MIPS             | x86-64                 |

### Instruction Formats

```
Opcode | Register selectors | Immediate/Address
ADD    R1,  R2,  R3           # R1 = R2 + R3
```

- **Load/Store ISA**: Only load/store touch memory.
- **Stack ISA**: Operands on top of stack (Java/JVM style).
- **General-Purpose ISA**: Registers hold operands (most modern).

## Addressing Modes

| Mode          | Operand Location              | Example            |
|---------------|-------------------------------|--------------------|
| Immediate     | Value in instruction          | `ADD R1, #5`       |
| Register      | Value in a register           | `ADD R1, R2`       |
| Direct        | Memory address in instruction | `LOAD R1, [1000]`  |
| Indirect      | Address held in register/mem  | `LOAD R1, [R2]`    |
| Register Ind. | Address in register           | `LOAD R1, [R2]`    |
| Base+Offset   | Register + constant offset    | `LOAD R1, [R2+4]`  |
| Indexed       | Base + index register         | `LOAD R1, [R2+R3]` |
| Relative      | PC-relative (branches)        | `JUMP label`       |

## Memory Organization

- **Word**: Fundamental data unit (e.g., 32 or 64 bits).
- **Endianness**: Byte order — Little vs Big endian.
- **Byte Addressable**: Each byte has its own address.
- **Virtual Memory**: Maps virtual pages to physical frames.
- Two-level tables (page tables) require TLB to stay fast.
- **TLB Hit** = virtual-to-physical translation in ~1 cycle.

## I/O & Buses

| Approach      | How It Works                     | When To Use        |
|---------------|----------------------------------|--------------------|
| Polling       | CPU checks device status         | Short/simple reads |
| Interrupt     | Device signals CPU when ready    | Blocking, event-driven |
| DMA           | Device writes memory directly    | Bulk transfers     |

- **MMIO**: Device registers mapped into address space.
- **Programmed I/O**: CPU moves each word for slow devices.
- **Memory Bus vs Peripheral Bus**: Fast internal vs external.

## Real-World Applications

- Branch predictors power modern game/high-FPS CPUs (AMD Zen, Intel).
- SIMD (AVX/NEON) speeds media and ML workloads.
- GPUs: massive parallelism, wide memory bandwidth.
- Cache-aware algorithms beat asymptotically optimal lazy ones.
- Database indexing exploits sequential I/O and caching.
- Web servers scale with threads/cores (ILP + TLP together).

## Common Pitfalls

- Assuming O(1) lookups ignore cache misses.
- Forgetting pipeline stalls/branches when estimating performance.
- Confusing ISA with microarchitecture.
- Ignoring difference between SSDs (random fast) and HDDs (sequential).

## Interview Tips

1. Walk through fetch-decode-execute with a concrete instruction.
2. Explain why L1 is 64KB but RAM is 64GB (cost vs speed).
3. Describe what causes pipeline hazards and how to fix them.
4. Know how virtual memory uses TLB + page tables.
5. Relate cache behavior to real program loops (spatial/temporal locality).
6. Derive the memory hierarchy access-time table from memory.
7. Apply Amdahl's law to a realistic parallel program.

## Quick Comparison Tables

### Memory vs Cache vs Register

| Item       | Speed       | Capacity     | Purpose              |
|------------|-------------|--------------|----------------------|
| Register   | ~0.2 ns     | <1 KB        | Operands in CPU      |
| L1/L2/L3   | 1-40 ns     | KBs to MBs   | Keep data close      |
| Main Memory| ~100 ns     | GBs          | Programs & data      |

### RISC vs CISC Memory Access

| Action             | RISC                 | CISC                |
|--------------------|----------------------|---------------------|
| Add two memory vars| 3 instructions       | 1 instruction       |
| Compiler role      | Simpler instructions | Complex instructions |