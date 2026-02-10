# Contributing to Green Pizza

Thank you for your interest in contributing to Green Pizza!

## How to Contribute

### Reporting Issues

If you find a bug or have a suggestion:

1. Check if the issue already exists
2. Create a new issue with:
   - Clear title
   - Detailed description
   - Steps to reproduce (for bugs)
   - Expected vs actual behavior

### Making Changes

1. **Fork the repository**
2. **Create a branch:**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

3. **Make your changes:**
   - Follow the existing code style
   - Add tests if applicable
   - Update documentation

4. **Test your changes:**
   ```bash
   npm test
   npm run cypress:run
   ```

5. **Commit with Jira ID (if enabled):**
   ```bash
   git commit -m "GP-123 Add new pizza type"
   ```

6. **Push and create Pull Request:**
   ```bash
   git push origin feature/your-feature-name
   ```

## Code Style

- Use 2 spaces for indentation
- Use semicolons
- Use single quotes for strings
- Add comments for complex logic

## Testing

All contributions should include tests:

- Unit tests in `tests/`
- E2E tests in `cypress/e2e/`

## Documentation

Update documentation for:

- New features
- API changes
- Configuration options

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
