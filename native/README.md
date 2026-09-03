# Synqo AI Employee native apps

These apps open the production Synqo AI Employee workspace at
`https://www.synqoai.com/dashboard` in a secure native window.

## Android

- Package ID: `com.synqoai.employee`
- Version: `1.0.0` (`versionCode 1`)
- Minimum Android: 8.0 (API 26)
- Target Android: 16 (API 36)
- `app-debug.apk` is for direct device testing.
- `app-release.aab` must be signed with the private Synqo upload key before it
  is submitted to Google Play.

## Windows

- `Synqo-AI-Employee-1.0.0-x64.exe` is the installer.
- The portable build runs without installation.
- These first builds are not code-signed, so Windows SmartScreen may show an
  unknown-publisher warning. A trusted Windows code-signing certificate can be
  added for public distribution later.

## Updating

Every push affecting `native/**` runs the `Build native apps` GitHub Actions
workflow. Increment Android `versionCode` and the application version before
publishing a new store release. Keep the Android upload key private and backed
up; future Play Store updates must use the same key.
