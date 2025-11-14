# \## CI/CD Pipeline (Rubric 4)

# 

# This project includes a complete CI/CD pipeline implemented using GitHub Actions.

# 

# \### Pipeline Stages

# 1\. \*\*Build Stage\*\*

# &nbsp;  - Installs all dependencies using `npm ci`.

# 

# 2\. \*\*Test Stage\*\*

# &nbsp;  - Runs full Jest test suite.

# &nbsp;  - Executes unit, integration, and system tests.

# 

# 3\. \*\*Coverage Stage\*\*

# &nbsp;  - Jest coverage enabled (`coverageProvider: v8`).

# &nbsp;  - Enforces global threshold: 75% for branches, lines, functions, statements.

# &nbsp;  - Coverage report saved and uploaded as GitHub Actions artifact.

# 

# 4\. \*\*Lint Stage\*\*

# &nbsp;  - ESLint checks run using `npm run lint`.

# &nbsp;  - Ensures code quality and style consistency.

# 

# 5\. \*\*Security Scan\*\*

# &nbsp;  - Runs `npm audit --audit-level=high`.

# &nbsp;  - Outputs `security-report.json` uploaded as artifact.

# 

# \### Artifacts Generated

# \- Full HTML coverage report (in `coverage/`)

# \- Security audit report (`security-report.json`)

# 

# This pipeline ensures continuous integration quality and meets all requirements of Rubric 4.

# se-project

