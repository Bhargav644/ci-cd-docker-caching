# CI/CD with Docker Caching 🚀

This repository demonstrates a **CI/CD pipeline using GitHub Actions with Docker layer caching** to optimize build times for a **Next.js application**.

The primary goal of this project is to showcase:
- Dockerizing a Next.js application
- Implementing CI/CD using GitHub Actions
- Leveraging **Docker layer caching** to significantly speed up repeated builds

---

## 📌 Tech Stack

- **Frontend:** Next.js (React, TypeScript)
- **Containerization:** Docker
- **CI/CD:** GitHub Actions
- **Runtime:** Node.js 18 (Alpine)
- **Caching:** GitHub Actions Docker cache (`type=gha`)

---

## 📂 Project Structure

```text
.
├── app/                    # Next.js App Router
├── public/                 # Static assets
├── .github/
│   └── workflows/          # GitHub Actions CI/CD workflows
├── Dockerfile               # Docker build configuration
├── package.json
├── next.config.js
└── README.md
