# Releasing DocTrail

DocTrail uses Release Please and npm Trusted Publishing. The latest package version is shown on the [npm package page](https://www.npmjs.com/package/@iovargasjeff/doctrail). The `v0.1.1` release verified the automatic OIDC publication path end to end, and npm reported an SLSA provenance attestation for that version.

## Current automation status

- [x] Publish the initial scoped package `@iovargasjeff/doctrail@0.1.0` interactively with npm authentication/2FA.
- [x] Push the matching `v0.1.0` tag.
- [x] Configure the npm GitHub Actions Trusted Publisher for owner `iovargasjeff`, repository `DocTrail`, workflow filename `publish.yml` (created via npm CLI; npm reports `publish` and `stage publish` permissions). Do not create a long-lived npm token.
- [x] Create a repository GitHub App dedicated to Release Please with only `Contents: read/write` and `Pull requests: read/write`; install it only on `iovargasjeff/DocTrail`.
- [x] Add repository Actions secrets `RELEASE_PLEASE_APP_ID` and `RELEASE_PLEASE_APP_PRIVATE_KEY`. The private key is used only to mint a short-lived installation token for the release workflow. Never paste it into chat or commit it.
- [x] Verify the `v0.1.1` release workflow and npm OIDC publication; confirm npm records version `0.1.1` and its SLSA provenance attestation.

The initial `v0.1.0` tag deliberately does not trigger `publish.yml`: the first publish created the npm package record before Trusted Publisher configuration. The later `v0.1.1` tag successfully triggered `publish.yml` and published through OIDC.

## Routine releases

Use Conventional Commits for changes, including skill instruction changes:

- `fix: ...` proposes a patch release.
- `feat: ...` proposes a minor release.
- `feat!: ...` or a `BREAKING CHANGE:` footer proposes a major release.

After changes reach `main`, Release Please opens or updates a release PR with the version and changelog. Review and merge that PR manually. The generated version tag triggers CI and then `publish.yml`; the workflow checks that `vX.Y.Z` matches `package.json`, reruns the quality/package checks, and runs `npm publish --access public` with OIDC. No ordinary commit is published, and release PRs are never auto-merged.

Release Please uses the repository App secrets to mint a short-lived token. The publish workflow uses npm OIDC and never falls back to a stored npm token.

## Rollback

Do not overwrite or silently unpublish a released version. If a version is unsafe, deprecate that version with an explicit npm deprecation message, then publish a patch release. If a release PR is incorrect, edit or close it before merging; do not create a tag until the reviewed release PR is merged.

## Pre-release verification

- [ ] `npm run check` passes on Windows, macOS, and Linux.
- [ ] `npm pack --dry-run` contains only the README, license, CLI, banner used by the README, and installable skill files; no evals, tests, caches, or lockfile.
- [ ] The package's bundled skill has the expected `doctrail` slug and all local references resolve.
- [x] `Required` is required on `main` (verified in branch protection settings).
- [x] Verified once: merging the reviewed `v0.1.1` Release Please PR created the matching version tag, triggered `publish.yml`, and published npm version `0.1.1` with provenance.

Existing copies of the skill do not update when npm publishes a new version. Users explicitly run `npx --yes @iovargasjeff/doctrail@latest update` when they want to update.
