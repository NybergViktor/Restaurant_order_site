# Contributing to Restaurant Order System

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to this project.

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on what is best for the community
- Show empathy towards other contributors

## How to Contribute

### Reporting Bugs

If you find a bug, please create an issue with:
- Clear title and description
- Steps to reproduce the bug
- Expected vs actual behavior
- Environment details (OS, Node version, etc.)
- Screenshots if applicable

### Suggesting Enhancements

Enhancement suggestions are welcome! Please include:
- Clear description of the enhancement
- Use cases and benefits
- Potential implementation approach
- Any alternatives considered

### Pull Requests

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Make your changes
4. Test your changes thoroughly
5. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
6. Push to the branch (`git push origin feature/AmazingFeature`)
7. Open a Pull Request

## Development Setup

1. Fork and clone the repository
2. Install dependencies: `npm install`
3. Start MongoDB: `docker-compose up -d`
4. Seed database: `npm run seed`
5. Start development server: `npm run dev`

## Coding Standards

### TypeScript/JavaScript

- Use TypeScript for backend code
- Follow existing code style
- Use meaningful variable and function names
- Add comments for complex logic
- Use async/await instead of callbacks
- Handle errors appropriately

Example:
```typescript
// Good
async function getUserOrders(userId: string): Promise<Order[]> {
  try {
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });
    return orders;
  } catch (error) {
    console.error('Error fetching user orders:', error);
    throw new Error('Failed to fetch orders');
  }
}

// Avoid
function getOrders(id) {
  return Order.find({ userId: id });
}
```

### CSS

- Use existing CSS classes when possible
- Follow BEM naming convention for new classes
- Ensure responsive design
- Test on multiple screen sizes

### HTML

- Use semantic HTML5 elements
- Ensure accessibility (alt text, ARIA labels)
- Keep markup clean and readable
- Validate HTML

## Project Structure

When adding new features, follow this structure:

```
src/
├── models/        # Add new Mongoose models here
├── controllers/   # Add business logic here
├── routes/        # Add new API routes here
├── middleware/    # Add custom middleware here
└── utils/         # Add utility functions here

public/
├── css/           # Add/modify stylesheets
├── js/            # Add/modify frontend JavaScript
└── admin/         # Admin-specific pages
```

## Testing

Currently, the project doesn't have automated tests, but this is a great area for contribution!

### Manual Testing Checklist

Before submitting a PR, test:
- [ ] All existing features still work
- [ ] New features work as expected
- [ ] API endpoints return correct responses
- [ ] Frontend displays correctly
- [ ] Responsive design works
- [ ] Error handling works
- [ ] No console errors

### Adding Tests (Future)

We welcome contributions to add:
- Unit tests (Jest)
- Integration tests (Supertest)
- E2E tests (Playwright/Cypress)

## API Guidelines

When adding new API endpoints:

1. **Follow RESTful conventions**
   - GET for retrieving data
   - POST for creating data
   - PUT/PATCH for updating data
   - DELETE for removing data

2. **Use appropriate status codes**
   - 200: Success
   - 201: Created
   - 400: Bad Request
   - 404: Not Found
   - 500: Server Error

3. **Consistent response format**
   ```typescript
   // Success
   {
     success: true,
     data: {...}
   }
   
   // Error
   {
     success: false,
     message: "Error message",
     errors?: ["validation error 1", "validation error 2"]
   }
   ```

4. **Add validation**
   - Use the validation middleware
   - Validate all required fields
   - Check data types and formats
   - Return clear error messages

5. **Document your endpoint**
   - Add to README.md API section
   - Add to ARCHITECTURE.md if significant

## Database Guidelines

### Adding New Models

1. Create model file in `src/models/`
2. Define TypeScript interface
3. Create Mongoose schema
4. Add validation rules
5. Add timestamps
6. Export model

Example:
```typescript
import mongoose, { Document, Schema } from 'mongoose';

export interface INewModel extends Document {
  field1: string;
  field2: number;
  createdAt: Date;
  updatedAt: Date;
}

const NewModelSchema = new Schema<INewModel>({
  field1: {
    type: String,
    required: true,
    trim: true
  },
  field2: {
    type: Number,
    required: true,
    min: 0
  }
}, {
  timestamps: true
});

export default mongoose.model<INewModel>('NewModel', NewModelSchema);
```

### Database Migrations

If you need to modify existing data:
1. Create a migration script in `src/migrations/`
2. Document the migration in comments
3. Make it idempotent (safe to run multiple times)
4. Update seed script if needed

## Frontend Guidelines

### Adding New Pages

1. Create HTML file in `public/`
2. Link CSS in `public/css/styles.css`
3. Create JS file in `public/js/`
4. Update server.ts with route
5. Test on multiple devices

### Adding New Features to Existing Pages

1. Add HTML markup
2. Style with existing CSS classes
3. Add JavaScript functionality
4. Ensure mobile responsiveness
5. Test all user interactions

## Feature Ideas

Here are some features that would be great contributions:

### High Priority
- [ ] Admin authentication system
- [ ] Order notifications (WebSocket)
- [ ] Print receipts functionality
- [ ] Order history for tables
- [ ] Multi-language support

### Medium Priority
- [ ] Image upload for menu items
- [ ] Table reservation system
- [ ] Customer feedback system
- [ ] Analytics dashboard
- [ ] Order search and filtering

### Low Priority
- [ ] Dark mode
- [ ] Menu item ratings
- [ ] Dietary information (vegetarian, vegan, etc.)
- [ ] Allergen warnings
- [ ] Multiple currency support

## Documentation

When adding features, update:
- README.md (if user-facing)
- ARCHITECTURE.md (if architectural change)
- TESTING.md (if new test cases needed)
- API documentation (if new endpoints)

## Commit Messages

Use clear, descriptive commit messages:

```
Good:
- Add authentication middleware for admin routes
- Fix cart total calculation rounding error
- Update table QR code generation to use BASE_URL

Avoid:
- fix bug
- update code
- changes
```

### Commit Message Format

```
<type>: <subject>

<body>

<footer>
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

## Review Process

1. Submit PR with clear description
2. Ensure all checks pass
3. Address review feedback
4. Once approved, maintainer will merge

## Questions?

If you have questions:
- Check existing issues
- Check documentation files
- Create a new issue with your question

## License

By contributing, you agree that your contributions will be licensed under the ISC License.

---

Thank you for contributing to make this project better! 🎉
