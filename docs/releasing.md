# Releasing DocTrail

DocTrail uses an explicit first release followed by Release Please and npm Trusted Publishing. The public npm package `@iovargasjeff/doctrail@0.1.0` and Git tag `v0.1.0` already exist. The next automatic release has not yet been verified.

## Current automation status

- [x] Publish the initial scoped package `@iovargasjeff/doctrail@0.1.0` interactively with npm authentication/2FA.
- [x] Push the matching `v0.1.0` tag.
- [ ] In npm package settings, configure a GitHub Actions Trusted Publisher for owner `iovargasjeff`, repository `DocTrail`, workflow filename `publish.yml`. Do not create a long-lived npm token.
- [ ] Create a repository GitHub App dedicated to Release Please with only `Contents: read/write` and `Pull requests: read/write`; install it only on `iovargasjeff/DocTrail`.
- [ ] Add repository Actions secrets `RELEASE_PLEASE_APP_ID` and `RELEASE_PLEASE_APP_PRIVATE_KEY`. The private key is used only to mint a short-lived installation token for the release workflow. Never paste it into chat or commit it.
- [ ] Verify the npm publisher points at exactly `.github/workflows/publish.yml` and test an end-to-end subsequent release. npm Trusted Publishing can attach provenance when the workflow and package are configured correctly.

The initial `v0.1.0` tag deliberately does not trigger `publish.yml`: the first publish created the npm package record before Trusted Publisher configuration. Later version tags should publish through OIDC.

## Routine releases

Use Conventional Commits for changes, including skill instruction changes:

- `fix: ...` proposes a patch release.
- `feat: ...` proposes a minor release.
- `feat!: ...` or a `BREAKING CHANGE:` footer proposes a major release.

After changes reach `main`, Release Please opens or updates a release PR with the version and changelog. Review and merge that PR manually. The generated version tag triggers CI and then `publish.yml`; the workflow checks that `vX.Y.Z` matches `package.json`, reruns the quality/package checks, and runs `npm publish --access public` with OIDC. No ordinary commit is published, and release PRs are never auto-merged.

If the App secrets have not been configured, Release Please cannot create its authenticated PR and the workflow will fail at the token step. Configure both secrets before expecting automatic release PRs. The publish workflow never falls back to a stored npm token.

## Rollback

Do not overwrite or silently unpublish a released version. If a version is unsafe, deprecate that version with an explicit npm deprecation message, then publish a patch release. If a release PR is incorrect, edit or close it before merging; do not create a tag until the reviewed release PR is merged.

## Pre-release verification

- [ ] `npm run check` passes on Windows, macOS, and Linux.
- [ ] `npm pack --dry-run` contains only the README, license, CLI, banner used by the README, and installable skill files; no evals, tests, caches, or lockfile.
- [ ] The package's bundled skill has the expected `doctrail` slug and all local references resolve.
- [ ] `Required` is required on `main`.
- [ ] After one reviewed Release Please PR is merged, the matching version tag triggers `publish.yml` and npm records the expected version/provenance.

Existing copies of the skill do not update when npm publishes a new version. Users explicitly run `npx --yes @iovargasjeff/doctrail@latest update` when they want to update.
