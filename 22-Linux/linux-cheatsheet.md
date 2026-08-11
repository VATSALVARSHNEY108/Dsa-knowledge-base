---
layout: default
title: Linux Cheatsheet
parent: Linux
nav_order: 2
---

# Linux Cheat Sheet

Quick reference for filesystem, permissions, processes, text tools, package
management, editors, and monitoring.

## Core Concepts

- Everything is a **file** (devices, sockets, pipes included).
- Single **root** path `/?`; paths separated by `/`.
- **Multi-user**: users/groups control access to everything.
- **Dotfiles**: hidden files start with `.` (visible with `ls -a`).
- **Shell**: Command interpreter (bash, zsh, fish).

## Filesystem Navigation

```bash
pwd                 # print working directory
ls -la              # list all with details
cd ~                # go home; cd - back to previous
find . -name "*.log" -size +100M
which curl          # locate an executable
locate nginx.conf   # fast search from DB (updatedb)
tree -L 2 /etc      # directory tree, 2 levels deep
```

### Linux FHS Layout

| Path    | Purpose                            |
|---------|------------------------------------|
| `/bin`  | Essential user binaries            |
| `/sbin` | System admin binaries              |
| `/etc`  | Configuration files                |
| `/var`  | Variable data (logs, spool)        |
| `/tmp`  | Temporary files                    |
| `/home` | User home directories              |
| `/root` | Root user's home                   |
| `/dev`  | Device files                       |
| `/proc` | Runtime kernel/process info        |

## Permissions Model

Three kinds: **read (r=4)**, **write (w=2)**, **execute (x=1)**.

```
-rw-r--r--  1  alice  devs  1234  file.txt
 |/|/|/|/    user   group  size
 type user  group other
 d = directory; - = regular file; l = symlink
```

### chmod Numbers

| Number | Meaning           | Sum  |
|--------|-------------------|------|
| 4      | read              | r    |
| 2      | write             | w    |
| 1      | execute           | x    |
| 7      | r+ w + x          | rwx  |
| 6      | read + write      | rw-  |
| 5      | read + execute    | r-x  |
| 0      | no permission     | ---  |

```bash
chmod 755 script.sh     # owner rwx, group r-x, others r-x
chmod 600 key.pem       # owner rw only (SSH keys)
chmod u+x script.sh     # add execute for user only
chown alice:devs app    # owner alice, group devs
```

> Scripts need `x`; config needs `r`; secrets `600` or `700`.

## Process Management

```bash
ps aux                     # all processes
ps -ef --forest            # process tree
top                        # live CPU/mem
htop                       # nicer top if installed
kill -9 1234               # SIGKILL (force)
kill -15 1234              # SIGTERM (graceful, default)
pgrep -f nginx             # find PIDs by name/pattern
pkill -f "python app.py"
jobs / fg / bg             # manage background jobs
```

### Signals

| Signal | Number | Meaning               |
|--------|--------|-----------------------|
| SIGHUP | 1      | Terminal closed, reload|
| SIGINT | 2      | Ctrl+C                 |
| SIGTERM| 15     | Graceful termination   |
| SIGKILL| 9      | Kill immediately        |

## grep / awk / sed

### grep

```bash
grep -i error app.log        # case-insensitive
grep -r "TODO" src/          # recursive
grep -c "warning" app.log    # count matches
grep -v "^#" config.conf     # invert (drop comments)
```

### awk

```bash
awk '{print $1, $3}' file        # print fields
awk '{sum += $NF} END {print sum}' data.log
awk -F: '{print $1}' /etc/passwd # split on ':'
```

### sed

```bash
sed 's/old/new/g' file          # replace all
sed -i.bak 's/foo/bar/' file    # in-place with backup
sed -n '10,20p' file            # print lines 10-20
```

> Pipeline example: `ps aux | grep java | awk '{print $2}'`.

## Package Managers

| Distro      | Tool             | Install example              |
|-------------|------------------|------------------------------|
| Debian/Ubuntu | `apt`          | `sudo apt install nginx`     |
| RHEL/Fedora | `dnf`/`yum`      | `sudo dnf install nginx`     |
| Arch        | `pacman`         | `sudo pacman -S nginx`       |
| Alpine      | `apk`            | `apk add nginx`              |
| macOS (brew)| `brew`           | `brew install nginx`         |

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl git
sudo apt remove nginx
```

> `update` refreshes index; `upgrade` applies package changes.

## Text Editors Essentials

| Editor | Action                |
|--------|-----------------------|
| vim    | `i` insert, `Esc`, `:wq` save+quit, `dd` delete line |
| nano   | `Ctrl+O` save, `Ctrl+X` exit |
| sed/awk| Non-interactive editing |

```bash
vim file.txt
nano file.txt
```

## System Monitoring

```bash
free -h                     # memory usage
df -h                       # disk usage per filesystem
du -sh /var/log             # directory size
uptime                      # load average
vmstat 1                    # CPU/memory/virtual stats
iostat                      # I/O stats
ss -tulpn                   # listening ports (netstat replacement)
dmesg | tail                # kernel messages
systemctl status nginx      # service status
journalctl -u nginx -f      # follow service logs
```

## Real-World Applications

- `chmod 755` for deployed binaries; `600` for secrets.
- `grep | awk | sed` chains for log analysis in ops.
- `ps` + `kill` to manage runaway processes.
- `systemctl` to manage services on servers (systemd).
- `cron` for scheduled backups; `crontab -l` to list.

## Environment Variables

```bash
export MY_VAR=hello        # set for current shell
echo $MY_VAR
env                        # list all variables
unset MY_VAR
echo $PATH                 # command search path
```

- `~/.bashrc`: settings for interactive bash shells.
- `~/.profile`: login shell settings.
- `export` makes a variable available to child processes.

## Archives & Compression

```bash
tar czf backup.tar.gz /datadir    # create .tar.gz
tar xzf backup.tar.gz             # extract
tar czf - /data | ssh host "tar xzf -"   # stream to remote
gzip -k file.txt                  # compress, keep original
gunzip file.txt.gz
zip -r out.zip dir/               # zip format
```

## Hard vs Soft Links

| Link Type      | Points To          | Behavior On Target Delete |
|----------------|--------------------|---------------------------|
| Hard link      | Same inode         | Data survives             |
| Symbolic link  | Path string        | Breaks (dangling)         |

```bash
ln old.txt hard.txt        # hard link (same file)
ln -s old.txt soft.txt     # symlink (pointer)
```

## Common Pitfalls

- Forgetting `sudo` on permission-restricted paths.
- `rm -rf` on the wrong path (no recycle bin).
- Using `>` in pipes (truncates files).
- Live-editing huge logs instead of `tail -f`.
- Running chmod 777 on public content out of laziness.

## Interview Tips

1. Explain `chmod 755` and `chmod 600` from bytes/rwx.
2. Show a real pipeline: `grep` errors, count with `awk`.
3. Compare `kill` signals for graceful vs force shutdown.
4. Describe the FHS: where configs, logs, and binaries live.
5. Use `man` and `--help` to demonstrate self-sufficiency.