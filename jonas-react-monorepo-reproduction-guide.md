# Jonas React Course: Monorepo and GitHub Workflow

*A practical reproduction guide based on our completed hands-on exercise.*

## What we built

One Git repository contains multiple independently runnable React projects, even when their tools differ. The repository lives at `C:\Development\jonas-react-course` and was published at <https://github.com/gopesh123-us/jonas-react-course>.

```text
jonas-react-course/
├── .git/                         # One Git database for the whole course
├── .gitignore                    # Shared ignore rules
├── .gitattributes                # Git's text and line-ending rules
├── .editorconfig                 # Cross-editor text conventions
├── .prettierrc                   # Prettier formatting preferences
├── README.md
├── 00-intro/                     # Vite + React; own package.json
│   ├── .gitignore                # Additional project-specific rules
│   ├── src/
│   └── ...
├── 01-steps/                     # Create React App; own package.json
│   ├── .gitignore
│   ├── src/
│   └── ...
└── 02-state-management/          # Empty until first tracked file is added
```

**Core architecture:** one `.git/` at the root; multiple independent applications; one shared history. Each project may choose Vite, Create React App, Next.js, or other tooling and maintain its own `package.json` and lockfile. A monorepo does *not* require npm workspaces.

> **Environment:** The commands below use **Git Bash on Windows**. In Cmder running `cmd.exe`, environment variable and special-character syntax can differ. Run commands from the repository root unless otherwise stated.

## Milestone 1 — Initialize the local repository

We moved active development out of Dropbox after Vite reported an `EBUSY` file-lock error involving `node_modules/.vite`. Dropbox was a plausible cause, not proven. GitHub is our version-control synchronization point between laptops.

```bash
mkdir -p /c/Development
cd /c/Development
mkdir jonas-react-course
cd jonas-react-course

git init -b main
git status
git rev-parse --show-toplevel
```

- `git init -b main` creates the **single root `.git/`** and establishes `main` as the initial branch.
- `git status` shows the current branch and any staged, modified, or untracked files.
- `git rev-parse --show-toplevel` reports the root of the Git working tree. From inside `00-intro` or `01-steps`, it should still say `C:/Development/jonas-react-course`.

Create ordered folders:

```bash
mkdir 00-intro 01-steps 02-state-management
code .
```

Git does **not** track empty folders; `02-state-management/` will appear in GitHub when it contains a committed file. Use `ls -la` to inspect hidden files in Git Bash. The `tree` utility is not necessarily installed.

## Milestone 2 — Configure the root `.gitignore`

At `jonas-react-course/.gitignore`:

```gitignore
# Dependencies
node_modules/

# Builds
dist/
build/

# Local configuration/secrets
.env
.env.local
.env.*.local

# Logs and coverage
*.log
coverage/

# OS junk
.DS_Store
Thumbs.db
```

**Why:** `node_modules` and build outputs are reproducible and do not belong in source control; environment files may contain secrets. A root rule such as `node_modules/` applies to matching nested directories. Project-level `.gitignore` files may coexist and add local rules. `.gitignore` files are **not** repositories; `.git/` directories are.

## Milestone 3 — Generate independent React projects

### `00-intro`: Vite

From the **root**, with `00-intro` empty:

```bash
npm create vite@latest 00-intro -- --template react
cd 00-intro
npm install
npm run dev
```

Visit the localhost URL printed by Vite, then stop the server with `Ctrl+C` and return:

```bash
cd ..
```

`npm create vite@latest` scaffolds the project; `npm install` installs its dependencies; `npm run dev` starts its development server. Keep `00-intro/package.json` and `00-intro/package-lock.json` in Git, but ignore `node_modules/`.

### `01-steps`: Create React App

From the root:

```bash
npx create-react-app 01-steps
cd 01-steps
npm start
```

Visit the URL shown (typically `http://localhost:3000`), stop with `Ctrl+C`, and return to the root with `cd ..`.

**Caution:** Create React App is deprecated and is included here to reproduce an older course setup. Prefer Vite for new ordinary client-side React exercises. Different projects can use different React/Node versions; in the future a Node version manager and per-project version files may help.

**Nested Git check:** Some generators may create their own `.git/`. Verify with `git rev-parse --show-toplevel` while inside a project. If it points to the project rather than the monorepo root, inspect that nested repository before removing it; don't accidentally discard useful history. Project-level `.gitignore` files can remain.

## Milestone 4 — Inspect, stage, and create the baseline commit

```bash
git check-ignore -v 00-intro/node_modules/
git check-ignore -v 01-steps/node_modules/
git status --short

git add .
git status --short
git diff --cached --stat
git ls-files | grep node_modules
```

- `git check-ignore -v PATH` identifies the rule that ignores a path.
- `git status --short`: `??` means untracked; `A` in the first column means staged addition; ` M` means modified in the working tree but not staged.
- `git add .` places the relevant current content in the **index** (staging area), respecting ignore rules.
- `git diff --cached --stat` summarizes staged changes. `--cached` means **index vs. HEAD**.
- `git ls-files` lists tracked/staged paths. The `grep node_modules` command should have no matches; that indicates dependencies are not staged.

Then create and inspect the baseline:

```bash
git commit -m "chore: initialize React course monorepo"
git status
git log --oneline --decorate -3
```

Our actual initial commit was **`5a92feb`**. `git commit` records a snapshot of the **index**, creates a commit object, and advances the checked-out branch pointer. The root commit included both projects, but not their installed dependencies.

## Milestone 5 — Create the GitHub repository and push `main`

Create an empty GitHub repository named `jonas-react-course` (do **not** ask GitHub to initialize another README, ignore file, or license).

```bash
git remote add origin https://github.com/gopesh123-us/jonas-react-course.git
git remote -v
git push -u origin main
git branch -avv
```

- `origin` is the conventional **remote name** for the GitHub repository.
- `git remote -v` verifies fetch and push URLs.
- `git push -u origin main` publishes the branch and records `origin/main` as `main`'s upstream.
- `git branch -avv` lists local branches, remote-tracking references, commit IDs, and upstream relationships.

After pushing, local `main` and local remote-tracking reference `origin/main` both pointed to `5a92feb`.

## Milestone 6 — Develop a feature branch in only one project

A branch belongs to the **entire repository**, even when its commits change only `00-intro/`. Do not create a `.git/` for each project.

```bash
git status
git switch -c feature/intro-greeting
git branch -vv
git log --oneline --decorate -3
```

`git switch -c` creates the branch at the current commit and checks it out; no application folders are copied.

In `00-intro/src/App.jsx`, implement a greeting using `useState`, a *Personalize Greeting* button, and later a *Reset Greeting* button. We deliberately made **two feature commits** to explore squash merging.

First change:

```bash
git diff -- 00-intro/src/App.jsx
git add 00-intro/src/App.jsx
git diff --cached
git commit -m "feat(intro): add personalized greeting"
```

Second change:

```bash
git add 00-intro/src/App.jsx
git commit -m "feat(intro): add reset button"
git log --oneline --decorate --graph -5
```

Actual history at this stage:

```text
fbceb1a (HEAD -> feature/intro-greeting) feat(intro): add reset button
28df021 feat(intro): add personalized greeting
5a92feb (main, origin/main) chore: initialize React course monorepo
```

**Why stage a specific path?** `git add 00-intro/src/App.jsx` limits the commit to the intended project's file instead of accidentally including unrelated edits elsewhere in the monorepo.

## Milestone 7 — Publish feature branch and create pull request

```bash
git push -u origin feature/intro-greeting
git branch -vv
```

The branch on GitHub and the local `origin/feature/intro-greeting` remote-tracking reference now point to `fbceb1a`. The `-u` sets upstream tracking, so ordinary `git push` works later on that branch.

Open <https://github.com/gopesh123-us/jonas-react-course/pull/1> (or create a PR using GitHub's **Compare & pull request** link).

- **Base:** `main`
- **Compare:** `feature/intro-greeting`
- Review the **Commits** tab (2 commits) and **Files changed** tab (`00-intro/src/App.jsx`).
- The pull request proposes changes; creating it does not merge anything.

## Milestone 8 — Squash and merge on GitHub

Choose **Squash and merge**, then **Confirm squash and merge**.

GitHub created squash commit **`f69b398`** on GitHub's `main`, combining the final changes of both feature commits into **one new commit**.

```text
              B (28df021) -- C (fbceb1a)  feature/intro-greeting
             /
A (5a92feb)
             \
              S (f69b398)                 GitHub main
```

**Crucial distinction:** Squash merging doesn't adopt B and C into `main`'s ancestry. It creates S with their combined changes. In our simple case S and C have equivalent tracked-file content, but different parent histories. The GitHub feature branch still existed until explicitly deleted.

## Milestone 9 — Fetch, inspect, then fast-forward local `main`

After merging on GitHub, local `main` and local `origin/main` were still at `5a92feb` until we fetched. We deliberately fetched **while checked out on the feature branch**:

```bash
git status
git fetch origin
git branch -avv
git log --oneline --graph --decorate --all -8
```

Key fetch output:

```text
5a92feb..f69b398  main -> origin/main
```

This means Git downloaded the new objects and advanced the **local remote-tracking reference** `origin/main` to `f69b398`. It did **not** move local `main`, change `HEAD`, or edit the working tree.

With the usual default fetch refspec, `git fetch origin` updates remote-tracking references for multiple remote branches (depending on configuration), regardless of the currently checked-out local branch.

To inspect the configured refspec:

```bash
git config --get-all remote.origin.fetch
```

Typical value:

```text
+refs/heads/*:refs/remotes/origin/*
```

Now integrate the already-fetched squash commit:

```bash
git switch main
git merge --ff-only origin/main
git status
git branch -avv
git log --oneline --decorate --graph --all -8
```

`git switch main` checks out the previous local `main` snapshot; `git merge --ff-only origin/main` advances `main` from A to S because A is an ancestor of S. This also updates the **index and tracked working files** for the checked-out branch, including `00-intro/src/App.jsx`. **No new commit is created** by a fast-forward.

### Fetch vs. pull vs. merge

| Command | Downloads remote updates? | Integrates into checked-out branch? | Working tree? |
|---|---|---|---|
| `git fetch origin` | Yes | No | Unchanged |
| `git merge --ff-only origin/main` | No | Yes, if fast-forward possible | Updates as needed |
| `git pull --ff-only` | Yes | Yes, from the configured upstream, if fast-forward possible | Updates as needed |
| `git pull --ff-only origin main` | Yes | Yes, explicitly from remote `origin` branch `main` | Updates as needed |

**Syntax:** `origin/main` is a **local remote-tracking ref**, suitable as an argument to `git merge`. In `git pull origin main`, `origin` is the remote and `main` is the remote branch name. An ordinary `git pull` on your feature branch normally integrates its configured feature upstream, **not every branch fetched**. Actual behavior depends on configuration.

## Milestone 10 — Verify the index after fast-forward

Three Git states:

1. **HEAD:** current commit (`f69b398` on local `main`).
2. **Index:** staged next snapshot.
3. **Working tree:** files visible on disk.

Check differences:

```bash
git diff --cached --exit-code  # Index vs HEAD
git diff --exit-code           # Working tree vs index
```

With a clean state, both are silent and exit successfully. To compare tree object IDs directly:

```bash
git show -s --format=%T HEAD  # Tree ID stored in HEAD commit
git write-tree                # Tree ID assembled from current index
```

**Expected:** the two IDs match. `git write-tree` writes any required tree objects but does not create a commit or change the index. Matching tree IDs verifies identical tracked-file snapshots between HEAD and index, not the historical mechanism of the merge.

**Cmder note:** In a `cmd.exe`-style shell, `^` may be consumed as an escape character, so `git rev-parse HEAD^{tree}` can fail as `HEAD{tree}`. `git show -s --format=%T HEAD` avoids that issue. `echo $?` is Bash syntax; the terminal's active shell determines the correct exit-status command.

## Milestone 11 — Delete the remote branch and prune

On the merged PR page, click **Delete branch**. This removes the GitHub `feature/intro-greeting` branch reference; it does not undo the squash commit or delete the PR.

Then locally:

```bash
git fetch --prune origin
git branch -avv
git ls-remote --heads origin
```

- `--prune` removes local remote-tracking references for deleted remote branches.
- After pruning, the **local** feature branch remains, with upstream marked `[origin/feature/intro-greeting: gone]`.
- `git ls-remote --heads origin` contacts GitHub directly without modifying local refs. In our final result, it listed only `refs/heads/main`.

If pruning produces no deletion message and the remote-tracking reference remains, first confirm that the branch was actually deleted on GitHub; `git fetch --prune` cannot delete the GitHub branch itself.

## Milestone 12 — Confirm feature content and remove local branch

While checked out on `main`:

```bash
git diff main feature/intro-greeting -- 00-intro/src/App.jsx
```

There was **no output**, proving that this file had identical tracked content in both branch snapshots. We also knew this was the only file changed by the PR. Then we tried:

```bash
git branch -d feature/intro-greeting
```

Git refused: *branch is not fully merged*. That's expected: B and C are **not ancestors of S**, even though the code was squash-merged. After verifying the file contents, we explicitly deleted the local branch:

```bash
git branch -D feature/intro-greeting
```

`-D` forces **deletion of the local branch reference**, not a rollback of `main`. Never use `-D` blindly on an unreviewed branch; first confirm its work is preserved or intentionally disposable.

Final check:

```bash
git status
git branch -avv
git log --oneline --decorate --graph --all -5
```

At this point the branch list contained only local `main` and `origin/main`; both pointed to `f69b398`, and the working tree was clean.

## Milestone 13 — Add repository-wide text and formatting conventions

We then added three root files and committed them directly to `main` as a small maintenance change. Use these as sensible defaults and adapt them to course tooling.

### `.gitattributes`

```gitattributes
* text=auto

*.js   text eol=lf
*.jsx  text eol=lf
*.ts   text eol=lf
*.tsx  text eol=lf
*.css  text eol=lf
*.html text eol=lf
*.json text eol=lf
*.md   text eol=lf
*.yml  text eol=lf
*.yaml text eol=lf

*.bat  text eol=crlf
*.cmd  text eol=crlf

*.png  binary
*.jpg  binary
*.jpeg binary
*.gif  binary
*.ico  binary
*.webp binary
```

Git uses this to control text classification and check-in/checkout line endings. `* text=auto` asks Git to detect text and normalize it in the repository; explicit `text eol=lf` also specifies working-tree line endings for matching files. Existing tracked files are **not automatically renormalized** just because you add the file; consider `git add --renormalize .` separately only after inspecting the consequences.

### `.editorconfig`

```ini
root = true

[*]
charset = utf-8
end_of_line = lf
insert_final_newline = true
indent_style = space
indent_size = 2
trim_trailing_whitespace = true

[*.md]
trim_trailing_whitespace = false

[*.{bat,cmd}]
end_of_line = crlf
```

EditorConfig-aware editors use this for indentation, newlines, and encoding. `root = true` stops searching for parent `.editorconfig` files.

### `.prettierrc`

```json
{
  "singleQuote": true,
  "semi": true,
  "tabWidth": 2,
  "useTabs": false,
  "trailingComma": "all",
  "printWidth": 80,
  "arrowParens": "always",
  "endOfLine": "lf"
}
```

Prettier applies this **when run**; the file alone does not install Prettier or automatically reformat code. An optional `.prettierignore` can exclude additional files.

Stage only these new files, review, commit, and push:

```bash
git status --short
git add .gitattributes .editorconfig .prettierrc
git diff --cached --stat
git commit -m "chore: add repository formatting and line-ending configuration"
git push
```

Actual final commit: **`d4f9719`**. It created the three configuration files (51 lines) and was pushed successfully.

Final `main` history:

```text
d4f9719  chore: add repository formatting and line-ending configuration
f69b398  feat(intro): add interactive greeting and exclamation mark (#1)
5a92feb  chore: initialize React course monorepo
```

## Quick command reference

| Goal | Command | Why |
|---|---|---|
| Inspect current work | `git status` | Shows branch and state of index/working tree |
| Find repository root | `git rev-parse --show-toplevel` | Confirms nested app belongs to root repo |
| See all branch refs | `git branch -avv` | Shows local and remote-tracking refs with upstream status |
| Review graph | `git log --oneline --decorate --graph --all -8` | Visualize commit ancestry and pointers |
| See unstaged changes | `git diff` | Working tree vs index |
| See staged changes | `git diff --cached` | Index vs HEAD |
| Stage one app file | `git add 00-intro/src/App.jsx` | Avoid unrelated changes |
| Make a commit | `git commit -m "..."` | Record staged snapshot and move current branch |
| Create feature branch | `git switch -c feature/name` | Isolate a development line |
| Publish branch/upstream | `git push -u origin feature/name` | Create remote branch and configure tracking |
| Download remote refs | `git fetch origin` | Refresh remote-tracking refs without integration |
| Fast-forward `main` | `git switch main` then `git merge --ff-only origin/main` | Integrate already-fetched updates without new merge commit |
| Fetch + integrate upstream | `git pull --ff-only` | Combined operation on checked-out tracking branch |
| Delete GitHub branch | GitHub **Delete branch** | Remove remote branch after PR merge |
| Prune deleted refs | `git fetch --prune origin` | Remove stale `origin/feature/...` refs |
| View actual GitHub heads | `git ls-remote --heads origin` | Remote-only inspection |
| Safely delete local branch | `git branch -d feature/name` | Refuses if Git cannot prove merge ancestry |
| Force-delete local branch | `git branch -D feature/name` | Only after verifying work is preserved |
| Check ignore rule | `git check-ignore -v path` | Explain why a path is ignored |
| Inspect exact index tree | `git write-tree` | Compare staged snapshot with HEAD tree ID |

## Mental models worth retaining

- **Git repository = object database + references + working tree.** One `.git/` manages every project directory.
- **Branch = movable pointer to a commit**, not a folder. `HEAD` identifies what is checked out.
- **Commit = snapshot + parent relationship + metadata**, rather than merely a list of changed lines.
- **Index = proposed next tracked-file snapshot.** `git add` changes the index; `git commit` records it.
- **`origin/main` is local**, a remote-tracking reference showing your last fetched knowledge of GitHub's `main`; it is not a live GitHub connection.
- **Fetch ≠ merge.** Fetch updates objects and remote-tracking references. Merge integrates history into a checked-out local branch and ordinarily updates the tracked working tree.
- **Pull = fetch + integration** (merge, rebase, or fast-forward as configured); it does not indiscriminately merge every remote branch.
- **Fast-forward merge = move a branch pointer**, no new commit.
- **Squash merge = consolidate feature changes into one new commit on base**, not adopt the original feature commits into its ancestry.
- **Deleting a branch deletes a reference**, not automatically the code already incorporated elsewhere. After squash merging, ordinary safe deletion may refuse because ancestry differs.
- **One clone retrieves the course source and Git history**; `npm install`/`npm ci` must still be run in each project as needed, because `node_modules/` is ignored.

## Reusing the workflow for your next React exercise

1. Stay on up-to-date `main`: `git switch main && git pull --ff-only`.
2. Create a sequential directory for the new project (or generate directly into it).
3. Install its dependencies and confirm it runs.
4. Create a feature branch for a focused change: `git switch -c feature/project-feature`.
5. Stage only intended files, commit in meaningful increments, and push with `-u`.
6. Open a PR targeting `main`, review, squash-merge, and delete the GitHub feature branch.
7. Locally: `git fetch --prune origin`, `git switch main`, `git merge --ff-only origin/main`.
8. Verify preserved code; delete the local feature branch, using `-D` only when justified.
9. Check `git status` and `git branch -avv` before beginning the next project.

**Result:** A growing, clone-once course archive with independent React applications and a clear, maintainable `main` history.
