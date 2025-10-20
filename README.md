# CI/CD Docker Caching Demo

This project demonstrates how to set up a modern CI/CD pipeline with Docker layer caching for a Next.js application. It showcases best practices for automated testing, building, and deployment using GitHub Actions.

## What This Project Does

This is a Next.js web application that implements a complete CI/CD (Continuous Integration/Continuous Deployment) workflow. The main goal is to show how to:

1. Automatically build Docker images when code changes
2. Use Docker caching to speed up builds significantly
3. Validate pull requests before merging
4. Deploy to production automatically when code is merged to main branch

## Key Technologies Used

### Next.js
A React framework for building web applications. Next.js provides features like server-side rendering, automatic code splitting, and optimized production builds.

### Docker
A platform that packages applications into containers. Containers include everything needed to run the application (code, runtime, system tools, libraries) in an isolated environment.

### Multi-Stage Docker Build
The Dockerfile uses 3 stages to create efficient images:
- **Stage 1 (deps)**: Installs only the dependencies (node_modules)
- **Stage 2 (builder)**: Builds the Next.js application
- **Stage 3 (runner)**: Creates the final lightweight image with only what's needed to run the app

This approach keeps the final image small and fast.

### GitHub Actions
GitHub's built-in automation platform that runs workflows when certain events happen (like creating a pull request or pushing to main branch).

### GitHub Container Registry (GHCR)
A Docker image registry provided by GitHub. It stores your Docker images so they can be pulled and deployed later.

### Docker Buildx
An enhanced Docker build tool that supports advanced features like:
- Building for multiple platforms (linux/amd64, linux/arm64, etc.)
- Remote caching (storing build cache in a registry)

## The CI/CD Workflow Explained

### PR Validation Workflow

**File**: `.github/workflows/pr-validation.yml`

**When it runs**: Automatically triggers when you open, reopen, or update a pull request.

**What it does**:

1. **Checkout code**: Downloads your code from GitHub
2. **Set up QEMU**: Enables building Docker images for different CPU architectures
3. **Set up Docker Buildx**: Prepares the advanced Docker build system
4. **Login to GHCR**: Authenticates with GitHub Container Registry to push images
5. **Build and push image with caching**:
   - Builds the Docker image using the Dockerfile
   - Uses `cache-from` to pull previously cached layers from the registry
   - Speeds up builds by reusing unchanged layers
   - Pushes the built image with two tags:
     - `pr-<number>`: Unique tag for this specific PR
     - `candidate`: Tag marking this as the latest candidate for deployment
   - Uses `cache-to` to save build cache back to the registry for future builds
6. **Run tests/lint**: Runs code quality checks (linting) and tests

**Key caching mechanism**:
- `cache-from: type=registry,ref=ghcr.io/.../buildcache` - Pull cached layers
- `cache-to: type=registry,ref=ghcr.io/.../buildcache,mode=max` - Save all layers to cache

### Production Deployment Workflow

**File**: `.github/workflows/prod-deploy.yml`

**When it runs**: Automatically triggers when code is merged to the main branch.

**What it does**:

1. **Checkout code**: Downloads the latest main branch code
2. **Login to GHCR**: Authenticates to pull the previously built image
3. **Pull candidate image**: Downloads the image tagged as "candidate" (built during PR validation)
4. **Run container**:
   - Stops and removes any existing container named "next-app"
   - Starts a new container from the candidate image
   - Exposes port 3000 for web traffic
5. **Show logs**: Displays the last 50 lines of container logs for verification

## Important Terminology

### CI/CD
- **CI (Continuous Integration)**: Automatically testing and building code when changes are made
- **CD (Continuous Deployment)**: Automatically deploying tested code to production

### Docker Layers
Docker images are built in layers. Each instruction in the Dockerfile creates a layer. Layers are cached, so if a layer hasn't changed, Docker reuses it instead of rebuilding.

### Registry Cache
Instead of storing Docker build cache locally, it's stored in a container registry. This allows multiple builds (even on different machines) to share the same cache, speeding up builds significantly.

### Buildcache Tag
A special image tag (`buildcache`) that stores intermediate build layers. It's not meant to be run as a container, only to provide cache for future builds.

### GHCR (GitHub Container Registry)
GitHub's service for storing Docker images. The URL format is `ghcr.io/<username>/<repository>:<tag>`.

### OWNER_LC
An environment variable that converts the GitHub username/organization to lowercase (required because Docker registry names must be lowercase).

### Permissions
GitHub Actions needs specific permissions to access your code and push images:
- `contents: read` - Can read your code
- `packages: write` - Can push Docker images to GHCR

## How the Caching Works

1. **First build**: Takes longer because nothing is cached
2. **Subsequent builds**:
   - Docker checks each layer against the cached layers in the registry
   - If a layer hasn't changed (same files, same commands), it reuses the cached version
   - Only changed layers and layers after them need to be rebuilt
   - This can reduce build time from 5+ minutes to under 1 minute

The `mode=max` in cache-to means it caches all intermediate layers, not just the final ones. This provides maximum caching benefit.

## Local Development

Run the development server locally:

```bash
npm run dev
```

Open http://localhost:3000 in your browser to see the application.

The page auto-updates as you edit files in the `app` directory.

## Building Locally with Docker

Build the Docker image:

```bash
docker build -t next-app .
```

Run the container:

```bash
docker run -p 3000:3000 next-app
```

## Project Structure

- `/app` - Next.js application code
- `/.github/workflows` - GitHub Actions CI/CD workflows
- `Dockerfile` - Multi-stage Docker build configuration
- `package.json` - Node.js dependencies and scripts

## Why This Setup Matters

1. **Faster builds**: Caching reduces build time by 70-90%
2. **Automated validation**: Every PR is tested before merging
3. **Consistent deployments**: Same Docker image in testing and production
4. **No manual steps**: Push code and it automatically builds and deploys
5. **Cost effective**: Less build time means lower CI/CD costs

## Future Reference

When you come back to this project months later, remember:

- PRs automatically build and cache Docker images
- Merging to main automatically deploys the latest "candidate" image
- The Dockerfile creates 3 stages: deps, builder, runner
- Caching is stored in GHCR with the "buildcache" tag
- The entire workflow is automated through GitHub Actions
