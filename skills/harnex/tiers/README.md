# Tier profiles

A profile maps the validation tiers (standards.md "Validation tiers") to the
exact commands of one repo. The orchestrator resolves one profile per
target repo before planning and passes its absolute path to every phase
agent. Agents run the profile's commands exactly; a tier the profile marks
`n/a` or cannot run is reported NOT VERIFIED, never improvised.

## Resolution (first match wins, per repo)
1. `<repo>/.harnex/tiers.md`: a repo-owned override in the same table
   format. Use it as is.
2. `generic.md` for everything else: derive the commands from the repo.

A workspace root whose scripts delegate to a package or subdirectory:
resolve inside the one the change touches.

State the result in one line per repo:
`Profile: <repo> → <profile> (<why>)`.

## Hints (not rules)
Where the commands usually live; the repo's own docs and CI always win.
- `package.json` + lockfile (npm, yarn, pnpm, bun): its scripts; TypeScript
  (`tsc --noEmit`) and React tooling when present.
- `pyproject.toml` or `requirements.txt`: pytest, ruff or flake8, mypy.
- `Cargo.toml`: `cargo test`, `cargo clippy`, `cargo check`.
- `go.mod`: `go test ./...`, `go vet`.
- `Package.swift` or `*.xcodeproj`: `swift test` or `xcodebuild test`.
- `build.gradle*` or `pom.xml`: the wrapper (`./gradlew`, `./mvnw`).
- Shell scripts: `shellcheck`, `bats`.
Anything else works the same way: read the repo.

## Profile contract
Every profile defines: runner, install, typecheck, lint, impacted (how to
select tests for the changed files), smoke, full, e2e, dev server, risk
triggers (paths that force the FULL tier), and prerequisites. A
prerequisite that is missing (Docker, registry credentials, a deployed
environment) makes the affected tier NOT VERIFIED with the reason.
