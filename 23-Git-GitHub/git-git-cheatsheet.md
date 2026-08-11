# Git & GitHub Cheat Sheet

Quick reference for configuration, staging, branching, merging, remotes,
stash, logs, and undoing mistakes.

## Core Concepts

- **Working Tree**: Your files on disk.
- **Index/Staging**: Snapshot of files ready to commit.
- **Commit**: Permanent snapshot with message and parent pointer.
- **Branch**: Movable pointer to a commit.
- **HEAD**: Pointer to the current branch/commit.
- **Remote**: Copy of repo elsewhere (GitHub, GitLab).

## Configuration

```bash
git config --global user.name "Jane Doe"
git config --global user.email jane@example.com
git config --global core.editor vim
git config --global init.defaultBranch main
git config --list
git config --global alias.st status   # git st alias
```

> `--global` affects all repos; `--local` only the current repo.

## Staging & Committing

```bash
git status                # what changed
git add file.txt          # stage file
git add .                 # stage all
git add -p                # stage hunks interactively
git commit -m "msg"       # commit staged
git commit -am "msg"      # stage + commit tracked files
git diff                  # unstaged changes
git diff --staged         # staged changes
git diff HEAD             # all changes vs last commit
git status --short        # compact status
```

## Branching

### Create / Switch / Merge

```bash
git branch feature            # create branch
git switch feature            # switch (checkout feature)
git switch -c feature         # create + switch
git checkout -b feature       # older alias
git branch -a                 # list all branches
git branch -d feature         # delete (safe)
```

```text
main:       A---B---C
                     \
feature:              D---E
```

### Merge (fast-forward vs no-ff)

```bash
git switch main
git merge feature            # fast-forward if linear
git merge --no-ff feature    # merge commit always
git merge --squash feature   # single commit from all changes
```

### Rebase

```bash
git switch feature
git rebase main              # base feature on main tip
git rebase -i HEAD~3         # squash/reword/reorder last 3
git pull --rebase            # rebase onto remote
```

> Rule: rebase your own commits, never shared/public history.

### Conflict Resolution

1. Conflict files contain `<<<<<<<`, `=======`, `>>>>>>>` markers.
2. Edit the file to keep the desired content.
3. Stage and finish:

```bash
git add resolved.txt
git commit                 # finish merge
git merge --abort          # or cancel the merge
```

## Remote Operations

```bash
git remote -v
git clone git@github.com:user/repo.git
git fetch origin           # update remote refs only
git pull                   # fetch + merge
git pull --rebase          # fetch + rebase
git push origin main
git push -u origin feature # set upstream track
git remote add origin URL
git remote remove origin
```

> `fetch` never changes your branch; `pull` advances your work.

### GitHub Workflow

```text
fork -> branch -> commit -> push -> open PR -> review -> merge
```

- PR = pull request: propose changes from a branch to another.
- Squash merge on PR keeps history clean (one commit per PR).
- Use protected branches and CI for review safety.

## Stash

```bash
git stash                # save uncommitted work
git stash list
git stash pop            # restore and drop
git stash apply stash@{1}  # restore without dropping
git stash -u             # include untracked files
git stash drop           # discard top stash
```

> Stash uncommitted changes before switching branches or pulling.

## Logs

```bash
git log --oneline
git log --oneline --graph --all
git log -p                # show patches
git log --author="jane" --since="2 weeks ago"
git show <hash>           # inspect a commit
git blame file.txt        # who changed each line
```

## Undo Operations

| Command                       | Effect                          |
|-------------------------------|---------------------------------|
| `git checkout -- file`        | Discard unstaged changes        |
| `git restore file`            | Same, modern form                |
| `git reset HEAD file`         | Unstage (keep working changes)  |
| `git reset --soft HEAD~1`     | Undo commit, keep staged        |
| `git reset --mixed HEAD~1`    | Undo commit, unstage (default)  |
| `git reset --hard HEAD~1`     | Undo commit + discard changes   |
| `git revert <hash>`           | New commit undoing an old one   |

> `reset --hard` is destructive. Prefer `revert` on shared history.

### reset Modes Diagram

```text
soft:   HEAD <- commit; index & worktree unchanged
mixed:  HEAD <- commit; index reset; worktree unchanged
hard:   HEAD <- commit; index reset; worktree reset
```

## Useful Aliases

```bash
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.lg "log --oneline --graph --all"
git config --global alias.unstage "reset HEAD --"
```

## Ignoring Files (.gitignore)

```gitignore
node_modules/
*.log
.env
dist/
.vscode/
```

```bash
git check-ignore -v .env     # why is this ignored
git ls-files -i -c --exclude-standard   # list ignored tracked
git rm --cached .env          # untrack but keep on disk
```

> Commit early, commit often, but never commit generated files.

## .git Directory Basics

| Path            | Purpose                       |
|-----------------|-------------------------------|
| `.git/config`   | Local repo settings           |
| `.git/HEAD`     | Points to current branch      |
| `.git/objects`  | Commits, trees, blobs         |
| `.git/refs`     | Branch/tag pointers           |
| `.git/index`    | Staging area snapshot         |

## Merge vs Rebase vs Cherry-Pick

```text
merge:       A---B---C---M
feature:         D---E--/
rebase:      A---B---C---D'---E'
cherry-pick: A---B---C---F   (F = one commit from feature)
```

## Real-World Applications

- Feature branches + PRs with squash merge (GitHub flow).
- `git bisect` to find the commit that broke the build.
- `git stash` to switch context before urgent hotfix.
- Cherry-pick hotfix commits into release branches.

## Common Pitfalls

- Committing secrets; use `.gitignore` and secret scanners.
- `git add -A` sweeping unrelated files into one commit.
- Force push overwriting teammates' work.
- Large binary files bloating history (use LFS or artifacts).

## Interview Tips

1. Explain the difference between merge and rebase with a diagram.
2. Know when to use reset soft vs mixed vs hard.
3. Describe how to safely undo a pushed commit (revert).
4. Walk through a conflict resolution start to finish.
5. Compare fetch, pull (merge), and pull --rebase.