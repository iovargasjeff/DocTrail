# Releasing DocTrail

DocTrail uses an explicit first release followed by Release Please and npm Trusted Publishing. The npm package is public and scoped as `@iovargasjeff/doctrail`; confirm that your npm account or organization owns the `@iovargasjeff` scope before the first publish.

## One-time setup

1. Merge the package implementation to `main` through a pull request and wait for the `CI / Required` check.
2. From that merged commit, create and push the initial `v0.1.0` tag. Ensure `package.json` says `0.1.0` and run `npm run check` plus `npm pack --dry-run` first.
3. Authenticate to npm locally, enable 2FA, and publish the first scoped public package with `npm publish --access public`. This is a one-time interactive publication; it is intentionally not run by this repository's automation.
4. In npm package settings for `@iovargasjeff/doctrail`, configure a GitHub Actions Trusted Publisher for owner `iovargasjeff`, repository `DocTrail`, workflow filename `publish.yml`. Do not create a long-lived npm token.
5. Create a repository GitHub App dedicated to Release Please with only `Contents: read/write` and `Pull requests: read/write`. Install it only on `iovargasjeff/DocTrail`.
6. Add repository Actions secrets `RELEASE_PLEASE_APP_ID` and `RELEASE_PLEASE_APP_PRIVATE_KEY`. The private key is used only to mint a short-lived installation token for the release workflow.
7. Verify the npm publisher points at exactly `.github/workflows/publish.yml`. Trusted publishing from a public GitHub repository automatically attaches npm provenance.

The initial `v0.1.0` tag deliberately does not trigger `publish.yml`: the first publish is manual so npm's package record exists before Trusted Publisher configuration. Later tags publish through OIDC.

## Routine releases

Use Conventional Commits for changes, including skill instruction changes:

- `fix: ...` proposes a patch release.
- `feat: ...` proposes a minor release.
- `feat!: ...` or a `BREAKING CHANGE:` footer proposes a major release.

After changes reach `main`, Release Please opens or updates a release PR with the version and changelog. Review and merge that PR manually. The generated version tag triggers CI and then `publish.yml`; the workflow checks that `vX.Y.Z` matches `package.json`, reruns the quality/package checks, and runs `npm publish --access public` with OIDC. No ordinary commit is published, and release PRs are never auto-merged.

If the app secrets have not been configured, Release Please cannot create its authenticated PR; the workflow waits for the bootstrap tag and reports the missing setup in Actions. The publish workflow never falls back to a stored npm token.

## Rollback

Do not overwrite or silently unpublish a released version. If a version is unsafe, deprecate that version with an explicit npm deprecation message, then publish a patch release. If a release PR is incorrect, edit or close it before merging; do not create a tag until the reviewed release PR is merged.

## Initial release checklist

- [ ] npm scope belongs to the intended account/organization and the package name is available.
- [ ] `npm run check` passes on Windows, macOS, and Linux.
- [ ] `npm pack --dry-run` contains only the README, license, CLI, banner used by the README, and installable skill files; no evals, tests, caches, or lockfile.
- [ ] The package's bundled skill has the expected `doctrail` slug and all local references resolve.
- [ ] Publish v0.1.0 interactively with npm 2FA.
- [ ] Configure the exact Trusted Publisher workflow, then verify the next release tag publishes with OIDC and provenance.
- [ ] Configure the Release Please GitHub App and repository secrets.
- [ ] Add `CI / Required` as a required main-branch status check after the workflow's first successful run.

Existing copies of the skill do not update when npm publishes a new version. Users explicitly run `npx --yes @iovargasjeff/doctrail@latest update` when they want to update.
