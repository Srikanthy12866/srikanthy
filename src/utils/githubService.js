/**
 * GitHub API & Repository Fetching Service
 * Fetches releases, tags, branches, package.json version history, and assets (.deb / dpkg & .AppImage)
 * for Go-Seek and other products from GitHub.
 */

/**
 * Parses GitHub owner and repo name from URL
 */
export const parseGithubRepo = (url) => {
  if (!url) return { owner: "Srikanthy12866", repo: "Go-Seek" };
  try {
    const cleanUrl = url.replace(/\/$/, "");
    const parts = cleanUrl.split("/");
    const repo = parts.pop()?.replace(/\.git$/, "") || "Go-Seek";
    const owner = parts.pop() || "Srikanthy12866";
    return { owner, repo };
  } catch {
    return { owner: "Srikanthy12866", repo: "Go-Seek" };
  }
};

/**
 * Format bytes into human-readable string (e.g. 84.5 MB)
 */
export const formatBytes = (bytes, decimals = 1) => {
  if (!bytes || bytes === 0) return "0 B";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

/**
 * Convert ISO date to human relative time (e.g. 2 days ago)
 */
export const timeAgo = (dateInput) => {
  if (!dateInput) return "recently";
  try {
    const date = new Date(dateInput);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    if (seconds < 60) return "just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days}d ago`;
    const months = Math.floor(days / 30);
    if (months < 12) return `${months}mo ago`;
    const years = Math.floor(days / 365);
    return `${years}y ago`;
  } catch {
    return "recently";
  }
};

export const formatArtifactFileName = (template, { productName, packageName, version, arch, ext }) => {
  const tpl = template || "go-seek-${version}-${arch}.${ext}";
  const prodSlug = (productName || "Go-Seek").replace(/\s+/g, "-");
  return tpl
    .replace(/\$\{productName\}/g, prodSlug)
    .replace(/\$\{name\}/g, packageName || "go-seek")
    .replace(/\$\{version\}/g, version || "0.1.1")
    .replace(/\$\{arch\}/g, arch)
    .replace(/\$\{ext\}/g, ext);
};

export const buildVersionPackageEntry = ({
  id,
  version,
  label,
  releaseTitle,
  tagName,
  branch = "main",
  commitSha,
  date,
  productName = "Go Seek",
  packageName = "go-seek",
  artifactTemplate = "go-seek-${version}-${arch}.${ext}",
  owner = "Srikanthy12866",
  repo = "Go-Seek",
  releaseUrl,
  debAsset = null,
  debArm64Asset = null,
  appImageAsset = null,
  appImageArm64Asset = null,
  isLatest = false,
  notes = "",
}) => {
  const ref = tagName || commitSha || branch || "main";
  const targetReleaseUrl =
    releaseUrl ||
    (tagName
      ? `https://github.com/${owner}/${repo}/releases/tag/${tagName}`
      : `https://github.com/${owner}/${repo}/releases`);

  const debFileName =
    debAsset?.name ||
    formatArtifactFileName(artifactTemplate, {
      productName,
      packageName,
      version,
      arch: "amd64",
      ext: "deb",
    });
  const debArm64FileName =
    debArm64Asset?.name ||
    formatArtifactFileName(artifactTemplate, {
      productName,
      packageName,
      version,
      arch: "arm64",
      ext: "deb",
    });

  const appImageFileName =
    appImageAsset?.name ||
    formatArtifactFileName(artifactTemplate, {
      productName,
      packageName,
      version,
      arch: "x86_64",
      ext: "AppImage",
    });
  const appImageArm64FileName =
    appImageArm64Asset?.name ||
    formatArtifactFileName(artifactTemplate, {
      productName,
      packageName,
      version,
      arch: "arm64",
      ext: "AppImage",
    });

  const archiveZipUrl = `https://github.com/${owner}/${repo}/archive/${ref}.zip`;
  const archiveTarUrl = `https://github.com/${owner}/${repo}/archive/${ref}.tar.gz`;

  return {
    id: id || `v-${version}-${ref}`,
    version,
    label: label || `v${version}`,
    releaseTitle: releaseTitle || `${productName} v${version}`,
    tagName: tagName || null,
    branch,
    commitSha: commitSha ? commitSha.substring(0, 7) : null,
    fullSha: commitSha || null,
    date: date || null,
    productName,
    packageName,
    artifactTemplate,
    isLatest,
    notes,
    releaseUrl: targetReleaseUrl,
    sourceZipUrl: archiveZipUrl,
    sourceTarUrl: archiveTarUrl,
    sourceFileName: `${repo}-${version}-${ref.substring(0, 7)}.zip`,
    deb: {
      id: `deb-${version}-${ref}`,
      type: "deb",
      version,
      label: label || `v${version}`,
      badge: `Ubuntu / Debian (.deb) • v${version}`,
      title: `Debian / Ubuntu Package (.deb) — v${version}`,
      fileName: debFileName,
      arm64FileName: debArm64FileName,
      arch: "x86_64 (amd64)",
      targetOS: "Ubuntu 24.04 / 22.04 / 20.04 LTS & Debian 11/12",
      size: debAsset ? formatBytes(debAsset.size) : "~115.0 MB",
      downloadUrl: debAsset?.browser_download_url || targetReleaseUrl,
      arm64DownloadUrl: debArm64Asset?.browser_download_url || debAsset?.browser_download_url || targetReleaseUrl,
      sourceZipUrl: archiveZipUrl,
      isDirectAsset: !!debAsset,
      isAvailable: !!debAsset,
      releaseUrl: targetReleaseUrl,
      packageName,
      installCmd: `sudo dpkg -i ${debFileName}`,
      arm64InstallCmd: `sudo dpkg -i ${debArm64FileName}`,
      fixCmd: "sudo apt-get install -f -y",
      runCmd: packageName === "shr" ? '"/opt/Go Seek/shr" --no-sandbox' : "go-seek",
      uninstallCmd: `sudo dpkg -r ${packageName}`,
      description:
        "Native Ubuntu / Debian package installed via dpkg. Registers desktop launcher, icon, and sandboxed Electron kernel telemetry collector.",
    },
    appimage: {
      id: `appimage-${version}-${ref}`,
      type: "appimage",
      version,
      label: label || `v${version}`,
      badge: `Portable Linux (.AppImage) • v${version}`,
      title: `Universal Portable Linux (.AppImage) — v${version}`,
      fileName: appImageFileName,
      arm64FileName: appImageArm64FileName,
      arch: "x86_64",
      targetOS: "Ubuntu (All LTS versions), Debian, Fedora, Arch Linux",
      size: appImageAsset ? formatBytes(appImageAsset.size) : "~140.0 MB",
      downloadUrl: appImageAsset?.browser_download_url || targetReleaseUrl,
      arm64DownloadUrl: appImageArm64Asset?.browser_download_url || appImageAsset?.browser_download_url || targetReleaseUrl,
      sourceZipUrl: archiveZipUrl,
      isDirectAsset: !!appImageAsset,
      isAvailable: !!appImageAsset,
      releaseUrl: targetReleaseUrl,
      installCmd: `chmod +x ${appImageFileName} && ./${appImageFileName} --no-sandbox`,
      arm64InstallCmd: `chmod +x ${appImageArm64FileName} && ./${appImageArm64FileName} --no-sandbox`,
      runCmd: `./${appImageFileName} --no-sandbox`,
      fuseNote: "Ubuntu 22.04 / 24.04 may require: sudo apt install libfuse2 -y",
      description:
        "Single-file portable Linux binary. Runs without root installation and bundles Electron runtime + Linux sysfs hardware readers.",
    },
    source: {
      id: `source-${version}-${ref}`,
      type: "source",
      version,
      label: label || `v${version}`,
      badge: `GitHub Source (.zip) • v${version}`,
      title: `Complete Desktop Source (.zip) — v${version}`,
      fileName: `${repo}-${ref}.zip`,
      arch: "Universal / All Platforms",
      targetOS: "Ubuntu 20.04+ / Linux / macOS / Windows",
      size: "~1.4 MB",
      downloadUrl: archiveZipUrl,
      tarballUrl: archiveTarUrl,
      isDirectAsset: true,
      isAvailable: true,
      cloneCmd: `git clone https://github.com/${owner}/${repo}.git`,
      buildCmd: "npm install && npm run desktop:build",
      description:
        "Complete source archive from GitHub for this version. Build native .deb and .AppImage packages locally with npm run desktop:build.",
    },
  };
};

// Hosted binary assets in the Go-Seek-Versions package repository (AppImages & dpkgs folders)
export const HOSTED_PACKAGE_FOLDERS = {
  rootFolderUrl: "https://drive.google.com/drive/folders/1dc42SMDaPxLsSFS79CoRVKrLb8P1fAzH?usp=sharing",
  appImagesFolderUrl: "https://drive.google.com/drive/folders/1Almq9YT3B1NMArfgG7iN_tVdHXgF_9vV?usp=sharing",
  dpkgsFolderUrl: "https://drive.google.com/drive/folders/16pm2ufomG0CLlA4RVxSVuSj53Ow2s3a6?usp=sharing",
};

export const HOSTED_PACKAGE_ASSETS = {
  "0.1.1": {
    deb: {
      id: "1AP9iojvVUyIJ5k4wVyCsRyO3Ua2HGTwr",
      name: "go-seek-0.1.1-amd64.deb",
      size: 120281260,
      modifiedTime: "2026-11-18T12:24:08.139Z",
      browser_download_url:
        "https://drive.usercontent.google.com/download?id=1AP9iojvVUyIJ5k4wVyCsRyO3Ua2HGTwr&export=download&confirm=t",
      viewUrl: "https://drive.google.com/file/d/1AP9iojvVUyIJ5k4wVyCsRyO3Ua2HGTwr/view?usp=sharing",
      folderUrl: HOSTED_PACKAGE_FOLDERS.dpkgsFolderUrl,
    },
    appimage: {
      id: "13aq1nn1vWWR2taKTsBW59ueNdIz83rKR",
      name: "go-seek-0.1.1-x86_64.AppImage",
      size: 146264190,
      modifiedTime: "2026-11-18T12:21:55.466Z",
      browser_download_url:
        "https://drive.usercontent.google.com/download?id=13aq1nn1vWWR2taKTsBW59ueNdIz83rKR&export=download&confirm=t",
      viewUrl: "https://drive.google.com/file/d/13aq1nn1vWWR2taKTsBW59ueNdIz83rKR/view?usp=sharing",
      folderUrl: HOSTED_PACKAGE_FOLDERS.appImagesFolderUrl,
    },
  },
  "0.1.0": {
    appimage: {
      id: "1xMv2P2dLXHDoNAmHWPBtv9B47BEh3HyE",
      name: "go-seek-0.1.0-x86_64.AppImage",
      size: 146243767,
      modifiedTime: "2026-11-09T04:59:26.887Z",
      browser_download_url:
        "https://drive.usercontent.google.com/download?id=1xMv2P2dLXHDoNAmHWPBtv9B47BEh3HyE&export=download&confirm=t",
      viewUrl: "https://drive.google.com/file/d/1xMv2P2dLXHDoNAmHWPBtv9B47BEh3HyE/view?usp=sharing",
      folderUrl: HOSTED_PACKAGE_FOLDERS.appImagesFolderUrl,
    },
  },
};

// Default curated version history matching all versions present in Srikanthy12866/Go-Seek on GitHub & Go-Seek-Versions folder
export const DEFAULT_GO_SEEK_VERSIONS = [
  buildVersionPackageEntry({
    id: "v0.1.1-main",
    version: "0.1.1",
    label: "v0.1.1 (Latest • main)",
    releaseTitle: "Go Seek v0.1.1 — Full 11-Tab Linux Sysfs Telemetry & Desktop Build",
    branch: "main",
    commitSha: "4956728d9e81dfd57bcbe5c57690a97738880001",
    date: "2026-11-18T12:24:08Z",
    productName: "Go Seek",
    packageName: "go-seek",
    artifactTemplate: "go-seek-${version}-${arch}.${ext}",
    debAsset: HOSTED_PACKAGE_ASSETS["0.1.1"].deb,
    appImageAsset: HOSTED_PACKAGE_ASSETS["0.1.1"].appimage,
    releaseUrl: HOSTED_PACKAGE_FOLDERS.rootFolderUrl,
    isLatest: true,
    notes: "Latest main branch release with 110+ kernel sysfs/procfs telemetry parameters, global parameter search, and Ubuntu 24.04 sandbox fix. Both go-seek-0.1.1-amd64.deb (114.7 MB) and go-seek-0.1.1-x86_64.AppImage (139.5 MB) are hosted and ready for direct download.",
  }),
  buildVersionPackageEntry({
    id: "v0.1.0-main",
    version: "0.1.0",
    label: "v0.1.0 (Go Seek • AppImage Release)",
    releaseTitle: "Go Seek v0.1.0 — Segregated Diagnostic Menus & Phase 2 Telemetry",
    branch: "main",
    commitSha: "766697feee5e3dc196f8b5b187b64375fbd1b48d",
    date: "2026-11-09T04:59:26Z",
    productName: "Go Seek",
    packageName: "go-seek",
    artifactTemplate: "go-seek-${version}-${arch}.${ext}",
    appImageAsset: HOSTED_PACKAGE_ASSETS["0.1.0"].appimage,
    releaseUrl: HOSTED_PACKAGE_FOLDERS.appImagesFolderUrl,
    isLatest: false,
    notes: "Phase 2 hardware parameters with segregated navigation routes. Hosted go-seek-0.1.0-x86_64.AppImage (139.5 MB) is ready for direct download.",
  }),
  buildVersionPackageEntry({
    id: "v0.1.0-ubantu",
    version: "0.1.0",
    label: "v0.1.0 / Release V0.01 (tag: ubantu)",
    releaseTitle: "Go Seek — Hardware & System Information Release V0.01",
    tagName: "ubantu",
    branch: "ubantu",
    commitSha: "891cc675b99687f1c728e54ad4436cfb565f14b6",
    date: "2026-10-16T15:09:27Z",
    productName: "Fieldnote Device Report",
    packageName: "shr",
    artifactTemplate: "${productName}-${version}-${arch}.${ext}",
    appImageAsset: HOSTED_PACKAGE_ASSETS["0.1.0"].appimage,
    releaseUrl: "https://github.com/Srikanthy12866/Go-Seek/releases/tag/ubantu",
    isLatest: false,
    notes: "Initial tagged Ubuntu release (tag: ubantu / V0.01) featuring baseline Electron + systeminformation desktop telemetry.",
  }),
];

// Fallback metadata in case GitHub API rate limit (60 req/hr) is hit or offline
export const FALLBACK_GITHUB_DATA = {
  owner: "Srikanthy12866",
  repo: "Go-Seek",
  repoUrl: "https://github.com/Srikanthy12866/Go-Seek",
  branch: "main",
  productName: "Go Seek",
  packageName: "go-seek",
  version: "0.1.1",
  description: "Deep Hardware Diagnostic & Real-Time Host Telemetry Suite for Ubuntu / Linux",
  linuxTargets: ["AppImage", "deb"],
  artifactTemplate: "go-seek-${version}-${arch}.${ext}",
  scripts: {
    desktop:
      'concurrently -k -n ui,desktop "cross-env BROWSER=none react-scripts start" "wait-on http://localhost:3000 && cross-env ELECTRON_RUN_AS_NODE= ELECTRON_START_URL=http://localhost:3000 electron . --no-sandbox"',
    "desktop:build": "npm run build && electron-builder",
    "desktop:linux-arm64": "npm run build && electron-builder --linux AppImage deb --arm64",
  },
  dependencies: {
    systeminformation: "^5.33.15",
    electron: "^44.5.1",
    "electron-builder": "^26.15.3",
    react: "^19.3.0",
  },
  latestCommit: {
    sha: "4956728",
    fullSha: "4956728d9e81dfd57bcbe5c57690a97738880001",
    message: "Add hardware telemetry parameters across all report pages and fix Linux desktop launch",
    author: "Srikanthy12866",
    date: "2026-11-18T12:35:00Z",
  },
  releases: [],
  versionPackages: DEFAULT_GO_SEEK_VERSIONS,
  availableFiles: [
    DEFAULT_GO_SEEK_VERSIONS[0].deb,
    DEFAULT_GO_SEEK_VERSIONS[0].appimage,
    DEFAULT_GO_SEEK_VERSIONS[0].source,
  ],
  latestReleaseUrl: "https://github.com/Srikanthy12866/Go-Seek/releases",
  isCached: true,
};

// In-memory cache to prevent repeated API calls
const githubCache = new Map();

/**
 * Helper to fetch package.json at a specific Git ref (branch, tag, or commit SHA)
 * Uses raw.githubusercontent.com which does NOT count against GitHub REST API rate limits.
 */
async function fetchPackageJsonAtRef(owner, repo, ref) {
  try {
    const url = `https://raw.githubusercontent.com/${owner}/${repo}/${ref}/package.json`;
    const res = await fetch(url);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

/**
 * Fetches all relevant details for a GitHub repository:
 * - All Releases and assets (.deb, .AppImage)
 * - All Tags & Branches and package.json version history across commits
 * - Builds a complete versionPackages list so users can access every version of .AppImage & dpkg (.deb)
 */
export const fetchGithubRepoDetails = async (repoUrl) => {
  const { owner, repo } = parseGithubRepo(repoUrl);
  const cacheKey = `${owner}/${repo}`;

  if (githubCache.has(cacheKey)) {
    const cached = githubCache.get(cacheKey);
    if (Date.now() - cached.timestamp < 5 * 60 * 1000) {
      return cached.data;
    }
  }

  const result = {
    owner,
    repo,
    repoUrl: `https://github.com/${owner}/${repo}`,
    branch: "main",
    productName: "Go Seek",
    packageName: "go-seek",
    version: "0.1.1",
    description: "Deep Hardware Diagnostic & Real-Time Host Telemetry Suite for Ubuntu / Linux",
    linuxTargets: ["AppImage", "deb"],
    artifactTemplate: "go-seek-${version}-${arch}.${ext}",
    scripts: { ...FALLBACK_GITHUB_DATA.scripts },
    dependencies: { ...FALLBACK_GITHUB_DATA.dependencies },
    latestCommit: { ...FALLBACK_GITHUB_DATA.latestCommit },
    releases: [],
    tags: [],
    branches: [],
    versionPackages: [],
    latestReleaseUrl: `https://github.com/${owner}/${repo}/releases`,
    availableFiles: [],
    readmeContent: "",
    fetchedAt: new Date().toISOString(),
    isLive: false,
    rateLimited: false,
  };

  try {
    // 1. Fetch main package.json from raw.githubusercontent.com (No API rate limit)
    const mainPkg = await fetchPackageJsonAtRef(owner, repo, "main");
    if (mainPkg) {
      if (mainPkg.name) result.packageName = mainPkg.name;
      if (mainPkg.version) result.version = mainPkg.version;
      if (mainPkg.build?.productName) result.productName = mainPkg.build.productName;
      else if (mainPkg.desktopName) result.productName = mainPkg.desktopName;
      else if (mainPkg.name) result.productName = mainPkg.name;

      if (mainPkg.build?.linux?.target) {
        result.linuxTargets = mainPkg.build.linux.target;
      }
      if (mainPkg.build?.linux?.artifactName) {
        result.artifactTemplate = mainPkg.build.linux.artifactName;
      }
      if (mainPkg.scripts) {
        result.scripts = { ...result.scripts, ...mainPkg.scripts };
      }
      if (mainPkg.dependencies) {
        result.dependencies = { ...result.dependencies, ...mainPkg.dependencies };
      }
      result.isLive = true;
    }

    // 2. Fetch Releases, Tags, Branches, and package.json Commit History in parallel
    const [relRes, tagsRes, branchesRes, pkgCommitsRes, latestCommitRes] = await Promise.all([
      fetch(`https://api.github.com/repos/${owner}/${repo}/releases?per_page=30`, {
        headers: { Accept: "application/vnd.github.v3+json" },
      }).catch(() => null),
      fetch(`https://api.github.com/repos/${owner}/${repo}/tags?per_page=30`, {
        headers: { Accept: "application/vnd.github.v3+json" },
      }).catch(() => null),
      fetch(`https://api.github.com/repos/${owner}/${repo}/branches?per_page=30`, {
        headers: { Accept: "application/vnd.github.v3+json" },
      }).catch(() => null),
      fetch(`https://api.github.com/repos/${owner}/${repo}/commits?path=package.json&per_page=20`, {
        headers: { Accept: "application/vnd.github.v3+json" },
      }).catch(() => null),
      fetch(`https://api.github.com/repos/${owner}/${repo}/commits?per_page=1`, {
        headers: { Accept: "application/vnd.github.v3+json" },
      }).catch(() => null),
    ]);

    if (relRes?.ok) {
      result.releases = await relRes.json();
      result.isLive = true;
    } else if (relRes?.status === 403) {
      result.rateLimited = true;
    }

    if (tagsRes?.ok) {
      result.tags = await tagsRes.json();
    }
    if (branchesRes?.ok) {
      result.branches = await branchesRes.json();
    }

    let pkgCommits = [];
    if (pkgCommitsRes?.ok) {
      pkgCommits = await pkgCommitsRes.json();
    }

    if (latestCommitRes?.ok) {
      const commits = await latestCommitRes.json();
      if (Array.isArray(commits) && commits.length > 0) {
        const c = commits[0];
        result.latestCommit = {
          sha: c.sha.substring(0, 7),
          fullSha: c.sha,
          message: c.commit?.message?.split("\n")[0] || "Update repository",
          author: c.commit?.author?.name || c.author?.login || owner,
          date: c.commit?.author?.date || new Date().toISOString(),
        };
        result.isLive = true;
      }
    }

    // 3. Discover all versions from Releases, package.json Commits, and Branches
    const discoveredMap = new Map();

    // A. Current main branch version first
    if (mainPkg && mainPkg.build?.linux) {
      const v = mainPkg.version || "0.1.1";
      const tpl = mainPkg.build?.linux?.artifactName || "go-seek-${version}-${arch}.${ext}";
      const pName = mainPkg.build?.productName || mainPkg.desktopName || "Go Seek";
      const pkgName = mainPkg.name || "go-seek";
      const hosted = HOSTED_PACKAGE_ASSETS[v] || {};
      const key = `${v}|${pkgName}|main`;
      discoveredMap.set(
        key,
        buildVersionPackageEntry({
          id: `v${v}-main`,
          version: v,
          label: `v${v} (Latest • main)`,
          releaseTitle: `${pName} v${v} (main branch)`,
          branch: "main",
          commitSha: result.latestCommit?.fullSha,
          date: hosted.deb?.modifiedTime || hosted.appimage?.modifiedTime || result.latestCommit?.date,
          productName: pName,
          packageName: pkgName,
          artifactTemplate: tpl,
          owner,
          repo,
          debAsset: hosted.deb || null,
          appImageAsset: hosted.appimage || null,
          releaseUrl: HOSTED_PACKAGE_FOLDERS.rootFolderUrl,
          isLatest: true,
          notes: result.latestCommit?.message || "Latest main branch build.",
        })
      );
    }

    // B. Inspect all GitHub Releases (and any attached .deb / .AppImage assets)
    if (Array.isArray(result.releases)) {
      for (const rel of result.releases) {
        const tag = rel.tag_name;
        const relPkg = tag ? await fetchPackageJsonAtRef(owner, repo, tag) : null;
        const v = relPkg?.version || tag?.replace(/^v/i, "") || "0.1.0";
        const pName = relPkg?.build?.productName || relPkg?.desktopName || result.productName;
        const pkgName = relPkg?.name || "shr";
        const tpl = relPkg?.build?.linux?.artifactName || "${productName}-${version}-${arch}.${ext}";
        const hosted = HOSTED_PACKAGE_ASSETS[v] || {};

        const assets = Array.isArray(rel.assets) ? rel.assets : [];
        const debAsset =
          assets.find((a) => /\.deb$/i.test(a.name) && !/arm64/i.test(a.name)) ||
          assets.find((a) => /\.deb$/i.test(a.name)) ||
          hosted.deb ||
          null;
        const debArm64Asset =
          assets.find((a) => /\.deb$/i.test(a.name) && /arm64/i.test(a.name)) || null;
        const appImageAsset =
          assets.find((a) => /\.AppImage$/i.test(a.name) && !/arm64/i.test(a.name)) ||
          assets.find((a) => /\.AppImage$/i.test(a.name)) ||
          hosted.appimage ||
          null;
        const appImageArm64Asset =
          assets.find((a) => /\.AppImage$/i.test(a.name) && /arm64/i.test(a.name)) || null;

        const key = `${v}|${pkgName}|${tag}`;
        discoveredMap.set(
          key,
          buildVersionPackageEntry({
            id: `release-${tag || v}`,
            version: v,
            label: `v${v} (${rel.name || `Release: ${tag}`})`,
            releaseTitle: rel.name || `${pName} v${v}`,
            tagName: tag,
            branch: rel.target_commitish || tag || "main",
            date: rel.published_at || rel.created_at,
            productName: pName,
            packageName: pkgName,
            artifactTemplate: tpl,
            owner,
            repo,
            releaseUrl: rel.html_url,
            debAsset,
            debArm64Asset,
            appImageAsset,
            appImageArm64Asset,
            isLatest: discoveredMap.size === 0,
            notes: rel.body ? rel.body.split(/\r?\n/).filter(Boolean).slice(0, 2).join(" — ") : `Tagged GitHub Release (${tag})`,
          })
        );
      }
    }

    // C. Inspect package.json commit history to capture all historical versions pushed to GitHub
    if (Array.isArray(pkgCommits) && pkgCommits.length > 0) {
      const inspectedCommits = pkgCommits.slice(0, 10);
      const commitPkgs = await Promise.all(
        inspectedCommits.map(async (c) => ({
          commit: c,
          pkg: await fetchPackageJsonAtRef(owner, repo, c.sha),
        }))
      );

      for (const { commit, pkg } of commitPkgs) {
        if (!pkg || !pkg.build?.linux) continue;
        const v = pkg.version || "0.1.0";
        const pName = pkg.build?.productName || pkg.desktopName || "Go Seek";
        const pkgName = pkg.name || "go-seek";
        const tpl = pkg.build?.linux?.artifactName || "go-seek-${version}-${arch}.${ext}";
        const hosted = HOSTED_PACKAGE_ASSETS[v] || {};

        // Avoid duplicating a version+packageName combination we already added from main or release
        const alreadyHas = Array.from(discoveredMap.values()).some(
          (entry) => entry.version === v && entry.packageName === pkgName && entry.artifactTemplate === tpl
        );
        if (alreadyHas) continue;

        const shaShort = commit.sha.substring(0, 7);
        const msg = commit.commit?.message?.split("\n")[0] || `Version ${v}`;
        const key = `${v}|${pkgName}|${shaShort}`;
        discoveredMap.set(
          key,
          buildVersionPackageEntry({
            id: `v${v}-${shaShort}`,
            version: v,
            label: `v${v} (${pName} • ${shaShort})`,
            releaseTitle: `${pName} v${v} — ${msg}`,
            branch: "main",
            commitSha: commit.sha,
            date: hosted.appimage?.modifiedTime || commit.commit?.author?.date,
            productName: pName,
            packageName: pkgName,
            artifactTemplate: tpl,
            owner,
            repo,
            debAsset: hosted.deb || null,
            appImageAsset: hosted.appimage || null,
            releaseUrl: HOSTED_PACKAGE_FOLDERS.rootFolderUrl,
            isLatest: false,
            notes: `GitHub commit ${shaShort}: ${msg}`,
          })
        );
      }
    }

    // D. Ensure all known Go-Seek GitHub versions (v0.1.1, v0.1.0, and ubantu V0.01) are included even if API was rate-limited
    if (repo.toLowerCase() === "go-seek") {
      for (const defaultVer of DEFAULT_GO_SEEK_VERSIONS) {
        const exists = Array.from(discoveredMap.values()).some(
          (entry) =>
            entry.version === defaultVer.version &&
            entry.packageName === defaultVer.packageName &&
            (entry.tagName || "") === (defaultVer.tagName || "")
        );
        if (!exists) {
          discoveredMap.set(defaultVer.id, defaultVer);
        }
      }
    }

    const versionPackages = Array.from(discoveredMap.values());
    if (versionPackages.length === 0) {
      versionPackages.push(...DEFAULT_GO_SEEK_VERSIONS);
    }

    // Ensure exactly the first item is marked isLatest
    versionPackages.forEach((vp, idx) => {
      vp.isLatest = idx === 0;
    });

    result.versionPackages = versionPackages;
    result.latestReleaseUrl = versionPackages[0]?.releaseUrl || result.latestReleaseUrl;
    result.availableFiles = [
      versionPackages[0].deb,
      versionPackages[0].appimage,
      versionPackages[0].source,
    ];

    githubCache.set(cacheKey, {
      data: result,
      timestamp: Date.now(),
    });

    return result;
  } catch (error) {
    console.error("Error fetching repository details from GitHub:", error);
    return { ...FALLBACK_GITHUB_DATA };
  }
};
