# Contributing to Echorithm

Thank you for considering contributing to Echorithm! This document provides guidelines and information for contributors.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)

---

## 📜 Code of Conduct

### Our Standards

- Be respectful and inclusive
- Provide constructive feedback
- Accept constructive criticism gracefully
- Focus on what's best for the community
- Show empathy towards other community members

---

## 🚀 Getting Started

### 1. Fork the Repository

Click the "Fork" button at the top right of the repository page.

### 2. Clone Your Fork

```bash
git clone https://github.com/YOUR_USERNAME/Personalized_News_Aggregator.git
cd Personalized_News_Aggregator
```

### 3. Add Upstream Remote

```bash
git remote add upstream https://github.com/Najmul-Hasan-Shihab/Personalized_News_Aggregator.git
```

### 4. Set Up Development Environment

Follow the [SETUP_GUIDE.md](SETUP_GUIDE.md) for detailed setup instructions.

---

## 💻 Development Workflow

### 1. Create a Feature Branch

```bash
git checkout -b feature/your-feature-name
```

Branch naming conventions:
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation changes
- `refactor/` - Code refactoring
- `test/` - Adding or updating tests

### 2. Make Your Changes

Write clean, readable code following our coding standards.

### 3. Test Your Changes

**Backend:**
```bash
cd backend
python manage.py test
```

**Frontend:**
```bash
cd frontend/echorithm
npm run lint
```

### 4. Commit Your Changes

```bash
git add .
git commit -m "feat: add your feature description"
```

See [Commit Guidelines](#commit-guidelines) for commit message format.

### 5. Push to Your Fork

```bash
git push origin feature/your-feature-name
```

### 6. Create a Pull Request

Go to the original repository and click "New Pull Request".

---

## 🎨 Coding Standards

### Python (Backend)

**Style Guide:** PEP 8

```python
# Good
def fetch_articles(category: str, limit: int = 10) -> list:
    """
    Fetch articles from the database.
    
    Args:
        category: The category to filter by
        limit: Maximum number of articles to return
        
    Returns:
        List of article dictionaries
    """
    return articles_collection.find({"category": category}).limit(limit)
```

**Key Points:**
- Use type hints
- Write docstrings for functions
- Keep functions small and focused
- Use meaningful variable names
- Follow Django/DRF conventions

### JavaScript (Frontend)

**Style Guide:** Airbnb JavaScript Style Guide

```javascript
// Good
const fetchArticles = async (category, limit = 10) => {
  try {
    const response = await api.get(`/articles/?category=${category}&limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching articles:', error);
    throw error;
  }
};
```

**Key Points:**
- Use functional components with hooks
- Use async/await for asynchronous code
- Handle errors gracefully
- Use descriptive variable names
- Follow React best practices

### CSS

**Style Guide:** Use design system variables

```css
/* Good */
.news-card {
  background: var(--bg-primary);
  border-radius: var(--radius-xl);
  padding: var(--space-lg);
  box-shadow: var(--shadow-md);
  transition: all var(--transition-base);
}

.news-card:hover {
  box-shadow: var(--shadow-xl);
  transform: translateY(-4px);
}
```

**Key Points:**
- Use CSS custom properties (variables)
- Follow BEM naming convention
- Keep selectors simple and specific
- Maintain responsive design
- See [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) for full design tokens

---

## 📝 Commit Guidelines

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples

```
feat(api): add article recommendation endpoint

Implemented collaborative filtering algorithm to generate
personalized article recommendations based on user preferences
and reading history.

Closes #123
```

```
fix(frontend): resolve infinite scroll loading issue

Fixed bug where infinite scroll would trigger multiple times
causing duplicate article renders.

Fixes #456
```

```
docs(readme): update installation instructions

Added MongoDB Atlas setup instructions for cloud deployment.
```

### Scope

Optional but recommended. Examples:
- `api`, `frontend`, `backend`
- `auth`, `articles`, `recommendations`
- `ui`, `database`, `models`

---

## 🔄 Pull Request Process

### 1. Update Your Branch

Before creating a PR, ensure your branch is up to date:

```bash
git fetch upstream
git rebase upstream/main
```

### 2. Create Descriptive PR

**Title:** Clear and concise summary
**Description:** Include:
- What changes were made
- Why the changes were necessary
- How to test the changes
- Screenshots (if UI changes)
- Related issue numbers

### 3. PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Code refactoring

## Testing
- [ ] Backend tests pass
- [ ] Frontend linting passes
- [ ] Manual testing completed

## Screenshots (if applicable)
Add screenshots here

## Related Issues
Closes #123
```

### 4. Code Review

- Be responsive to feedback
- Make requested changes promptly
- Discuss disagreements professionally
- Thank reviewers for their time

### 5. After Approval

Once approved, a maintainer will merge your PR.

---

## 🐛 Reporting Bugs

### Before Submitting

1. Check existing issues
2. Ensure you're using the latest version
3. Try to reproduce in a clean environment

### Bug Report Template

```markdown
**Description:**
Clear description of the bug

**Steps to Reproduce:**
1. Go to '...'
2. Click on '...'
3. Scroll to '...'
4. See error

**Expected Behavior:**
What should happen

**Actual Behavior:**
What actually happens

**Screenshots:**
If applicable

**Environment:**
- OS: [e.g., Windows 11]
- Python: [e.g., 3.13]
- Node: [e.g., 18.17.0]
- Browser: [e.g., Chrome 120]
```

---

## 💡 Suggesting Features

### Feature Request Template

```markdown
**Feature Description:**
Clear description of the proposed feature

**Use Case:**
Why is this feature needed?

**Proposed Solution:**
How should it work?

**Alternatives Considered:**
Other approaches you've thought about

**Additional Context:**
Any other relevant information
```

---

## 📚 Resources

- [Django Documentation](https://docs.djangoproject.com/)
- [React Documentation](https://react.dev/)
- [Hugging Face Transformers](https://huggingface.co/docs/transformers)
- [MongoDB Documentation](https://docs.mongodb.com/)

---

## 🎯 Good First Issues

Look for issues labeled `good first issue` to get started contributing!

---

## 📞 Questions?

If you have questions about contributing:

1. Check this guide
2. Search existing issues and discussions
3. Create a new discussion in GitHub Discussions
4. Contact the maintainers

---

## 🙏 Thank You!

Your contributions make Echorithm better for everyone. We appreciate your time and effort!

---

**Happy Contributing! 🚀**
