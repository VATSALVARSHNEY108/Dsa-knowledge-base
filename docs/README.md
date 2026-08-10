# CS & Software Engineering Knowledge Base

**This folder powers the GitHub Pages website for this repository.**

The site is built with [Jekyll](https://jekyllrb.com/) using the
[Just the Docs](https://just-the-docs.com/) theme, and is published automatically by
GitHub Pages from the `docs/` directory.

## Live Site

**[https://shubhu-io.github.io/Dsa-knowledge-base/](https://shubhu-io.github.io/Dsa-knowledge-base/)**

The source repository is at: [https://github.com/shubhu-io/Dsa-knowledge-base](https://github.com/shubhu-io/Dsa-knowledge-base)

## Structure

```
docs/
├── _config.yml          # Site configuration (theme, navigation, search, GitHub links)
├── _includes/           # Custom head/header/footer snippets + theme-toggle JS
├── _sass/custom/        # Custom styles (hero, cards, tables, code blocks)
├── assets/
│   ├── css/             # Dark & light scheme stylesheets (theme switching)
│   └── images/          # Favicon
├── index.md             # Homepage with full topic index
├── languages.md         # Programming languages page
├── 404.md               # Custom 404 page
└── README.md            # This file
```

## Editing Locally

This is a documentation site; no build commands are required for content changes.
To preview changes locally:

```bash
gem install jekyll bundler just-the-docs
jekyll serve --source docs
```

The site will be available at `http://127.0.0.1:4000/Dsa-knowledge-base/`.

## Conventions

- Topic content lives in the numbered `NN-*` folders at the repository root and is
  linked from `index.md` via GitHub links.
- `index.md` maintains the full topic index grouped by category. Keep the ordering
  and descriptions in sync when adding new topics.
- Use lowercase-hyphenated markdown filenames for new pages.
- The dark/light theme toggle stores its choice in `localStorage` (`jtd-theme`).
