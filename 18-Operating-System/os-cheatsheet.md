---
layout: default
title: OS Cheatsheet
parent: Operating System
nav_order: 1
---

# OS Cheat Sheet

Quick reference for operating system fundamentals: processes, scheduling,
memory, deadlocks, synchronization, and virtualization.

## Core Concepts

- **OS**: Software managing hardware and providing an interface to programs.
- **Kernel**: Core of the OS; handles processes, memory, and devices.
- **System Calls**: `fork`, `exec`, `read`, `write`, `open`, `close`, `wait`.
- **User Mode vs Kernel Mode**: Restricted vs privileged instruction execution.
- **Context Switch**: Saving one process state, loading another (costly).
- **Interrupts**: Hardware signals that preempt the CPU.

### Process vs Thread

| Feature      | Process                | Thread                      |
|--------------|------------------------|-----------------------------|
| Definition   | Program in execution   | Unit of execution           |
| Address space| Own memory space       | Shares process memory       |
| Switching    | Slow (context switch)  | Fast                        |
| Isolation    | High (crashes safely)  | Low (crash kills all)       |
| Communication| IPC (pipes, sockets)   | Shared memory (fast)        |
| Overhead     | High                   | Low                         |
| Created by   | OS                     | Process / library           |

> Threads share code, data, and heap but keep separate stacks and registers.

## Process States

```
New -> Ready -> Running -> Waiting -> Terminated
              ^    |
              '----'  (time slice expires)
```

## Scheduling Algorithms

| Algorithm    | Criteria        | Pros              | Cons                 |
|--------------|-----------------|-------------------|----------------------|
| FCFS         | Arrival time    | Simple            | Convoy effect        |
| SJF          | Burst time      | Optimal avg wait  | Needs burst estimate, starvation |
| SRTF         | Preemptive SJF  | Best avg wait     | Same issues as SJF   |
| Round Robin  | Time quantum q  | Fair, responsive  | q tuning critical    |
| Priority     | Priority value  | Importance-based  | Starvation of low    |
| Multilevel   | Category/band   | Groups by type    | Rigid between queues |

### Formulas

```
Turnaround Time = Completion Time - Arrival Time
Waiting Time    = Turnaround Time - Burst Time
Response Time   = First Response - Arrival Time
CPU Utilization = Busy Time / Total Time
Throughput      = Processes Completed / Time
```

> Round robin: small `q` = many switches; large `q` = FCFS-like behavior.

## Deadlock

### Four Necessary Conditions
1. **Mutual Exclusion** — resource held exclusively.
2. **Hold and Wait** — holding resources while waiting for more.
3. **No Preemption** — resources cannot be forcibly taken.
4. **Circular Wait** — a cycle of processes each waiting on another.

### Handling

| Strategy   | Approach                               |
|------------|----------------------------------------|
| Prevention | Break one of the 4 conditions          |
| Avoidance  | Banker's algorithm (safe states)       |
| Detection  | Wait-for graph, cycle detection        |
| Recovery   | Kill processes / preempt resources     |

> Break circular wait by imposing a global order on resource types.

## Memory Management

### Paging vs Segmentation

| Feature       | Paging                   | Segmentation             |
|---------------|--------------------------|--------------------------|
| Unit          | Fixed-size pages/frames  | Variable-size segments   |
| Fragmentation | Internal                 | External                 |
| Addressing    | Page + offset            | Segment + offset         |
| Visibility    | Transparent to program   | Visible to program       |
| Protection    | Per page                 | Per segment              |

### Page Replacement Algorithms

| Algorithm  | Miss Handling             | Pros                | Cons            |
|------------|---------------------------|---------------------|-----------------|
| FIFO       | Evict oldest loaded       | Simple              | Belady's anomaly|
| LRU        | Evict least recently used | Good locality reuse | Hardware cost  |
| Optimal    | Evict unused longest      | Minimal faults      | Needs future   |
| LFU        | Evict least frequent      | Frequent kept       | Counter overhead|
| Clock      | Approx LRU, ref bit       | Cheap               | Less accurate  |

### Address Translation Formulas

```
Pages        = Process Size / Page Size
Frames       = Physical Memory / Frame Size
PTE bits     = log2(Number of Frames)
EAT          = hit * fast + (1 - hit) * slow
```

> Belady's anomaly: FIFO can get MORE faults as frames increase.

## Virtual Memory

- **Demand Paging**: Load pages only when accessed.
- **Thrashing**: Too many page faults; system spends time paging.
- **Working Set**: Pages a process actively uses right now.
- **TLB**: Cache for page table entries (very fast translation).

## Inter-Process Communication (IPC)

| Mechanism | Type               | Use Case                  |
|-----------|--------------------|---------------------------|
| Pipe      | Unidirectional     | Parent <-> child          |
| FIFO      | Named pipe         | Unrelated processes       |
| Message Queue | Structured msgs | Producer <-> consumer     |
| Shared Memory | Fast RAW access | High-throughput data      |
| Semaphores | Synchronization   | Guard shared regions      |
| Sockets   | Network-capable    | Machines across network   |

> Shared memory is fastest but needs explicit synchronization.

## File Systems

### Trade-offs

| FS          | Strengths                    | Typical Use         |
|-------------|------------------------------|---------------------|
| ext4        | Default Linux, journaled     | Linux boot/data     |
| XFS         | Large files, scalability     | Big servers         |
| NTFS        | Windows default, ACLs        | Windows disks       |
| APFS        | macOS, snapshots             | Macs                |
| FAT32/exFAT | Compatible, portable         | USB drives          |

- **Inode**: Metadata (permissions, size, block list).
- **Journaling**: Logs metadata changes for crash recovery.
- **Mounting**: Attaching filesystems to a mount point.

## Disk Scheduling

| Algorithm | Behavior                         | Pros              |
|-----------|----------------------------------|-------------------|
| FCFS      | Serve requests in arrival order  | Fair, simple      |
| SSTF      | Closest cylinder first           | Low seek, starvation risk |
| SCAN      | Sweep one direction, then other  | Bounded wait (elevator) |
| C-SCAN    | One-way sweep, wrap around       | Uniform waits     |

> The SCAN family is the elevator algorithm: same modeled motion.

## Synchronization

- **Race Condition**: Concurrent access to shared data without protection.
- **Critical Section**: Code region that must run atomically.
- **Mutex**: One holder, provides mutual exclusion.
- **Semaphore**: Counter; `wait()` decrements, `signal()` increments.
- **Monitor**: High-level construct with condition variables.
- **Producer-Consumer**: Bounded buffer solved with semaphores.

> Busy-waiting wastes CPU; block threads instead of spinning (except for
> very short critical sections where spinlocks win).

## Virtualization

| Type       | Description                | Example       |
|------------|----------------------------|---------------|
| Type 1     | Bare-metal hypervisor      | VMware ESXi   |
| Type 2     | Runs on a host OS          | VirtualBox    |
| Containers | OS-level, share kernel     | Docker        |

- **Hypervisor**: Creates and runs VMs.
- **Namespaces**: Isolate processes (container building blocks).
- **Cgroups**: Limit CPU/memory per group (container building blocks).

## Real-World Applications

- Linux scheduler = CFS (fair, red-black tree based).
- MySQL uses locks + MVCC; detects deadlocks and kills a victim.
- Chrome uses one process per tab for crash isolation.
- Redis = single-threaded event loop (no locking needed).
- AWS Lambda = containers per function invocation (isolated).
- PostgreSQL uses a shared buffer pool (cache) for table pages.
- JVM threads share heap; OS threads map 1:1 to native threads.

## Common Pitfalls

- Confusing thread safety with process isolation.
- Forgetting `wait()` when a child exits -> zombie processes.
- Ignoring starvation when adding priority scheduling.
- Using FIFO with growing working sets -> performance cliff.
- Assuming context switches are free (measure with benchmarks).
- Holding locks across slow I/O (serialization bottleneck).

## Interview Tips

1. Walk through deadlock conditions with a concrete example.
2. Derive scheduling formulas, do not just name algorithms.
3. Compare paging and segmentation from a view of fragmentation.
4. Know TLB + multi-level page tables for address translation.
5. Practice the Producer-Consumer with semaphores from memory.
6. Relate each OS concept to a real product you have used.
7. Explain why threads share address space and processes do not.

## Key Terms Glossary

- **Kernel Space / User Space**: Privileged vs unprivileged memory.
- **Copy-on-Write (CoW)**: Lazy copy fork; pages shared until write.
- **Memory-Mapped File**: Map file into virtual address space.
- **Overlay/Swap**: Move pages/processes to disk when low on RAM.
- **Interrupt-Driven I/O**: CPU notified by device when done.
- **DMA**: Device writes memory directly, freeing the CPU.