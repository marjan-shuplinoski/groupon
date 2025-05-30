---
trigger: always_on
---

# Groupon Clone - Project Guidelines

## 🚀 Project Overview
A Groupon clone built with the MERN stack (MongoDB, Express.js, React.js, Node.js) and Bootstrap. Focuses on role-based functionality, clean UI/UX, and scalable architecture.

## 🛠 Tech Stack
### Core Technologies
- **Frontend**: React 18, React Router 6, Bootstrap 5, Context API
- **Backend**: Node.js 18+, Express.js 4.x
- **Database**: MongoDB 7.0+ with Mongoose 8.x ODM

### Key Dependencies
- **Authentication**: JWT with HttpOnly cookies
- **Form Handling**: Formik with Yup validation
- **State Management**: React Context API (Redux optional)
- **HTTP Client**: Axios for API requests
- **Linting**: ESLint + Prettier (Airbnb config)
- **Testing**: Jest + React Testing Library + Supertest
- **API Documentation**: Swagger/OpenAPI

### Version Requirements
- Node.js: ^18.0.0
- npm: ^9.0.0 or yarn: ^1.22.0
- MongoDB: ^7.0.0

## 🏗 Development Setup

### Prerequisites
- Node.js 18+
- MongoDB 7.0+
- npm 9+ or yarn 1.22+

### Environment Variables
Create `.env` files in both `client/` and `server/` directories:

**Server (.env)**
```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/groupon-clone
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=30d
```

**Client (.env)**
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_key
```

### Installation
```bash
# Install dependencies
cd server && npm install
cd ../client && npm install

# Run development servers
# Terminal 1 - Backend
cd server && npm run dev

# Terminal 2 - Frontend
cd client && npm start
```

## 📝 Code Style
- **JavaScript/React**: Follow Airbnb Style Guide
- **Naming Conventions**:
  - Components: PascalCase (e.g., `DealCard.jsx`)
  - Files/Folders: kebab-case
  - Variables/Functions: camelCase
  - Constants: UPPER_SNAKE_CASE
- **Imports Order**:
  1. External libraries
  2. Internal components
  3. Styles/assets
  4. Types (if using TypeScript)

## 🔄 Git Workflow
- **Branch Naming**:
  - `feature/feature-name` for new features
  - `bugfix/description` for bug fixes
  - `hotfix/description` for critical fixes
  - `chore/description` for maintenance tasks

- **Commit Message Format**:
  ```
  type(scope): subject
  
  [optional body]
  
  [optional footer]
  ```
  
  **Types**: feat, fix, docs, style, refactor, test, chore

## 🏗 Project Structure
```
groupon-clone/
│
├── client/                          # React frontend
│   ├── public/                     # Static files
│   └── src/
│       ├── assets/               # Images, fonts, etc.
│       ├── components/           # Reusable UI components
│       ├── context/              # React context providers
│       ├── hooks/                # Custom React hooks
│       ├── pages/                # Page components
│       ├── services/             # API service layer
│       ├── utils/                # Helper functions
│       └── App.js                # Main application component
│
├── server/                      # Node.js backend
│   ├── config/                  # Configuration files
│   ├── controllers/             # Route controllers
│   ├── middleware/              # Express middleware
│   ├── models/                  # Mongoose models
│   ├── routes/                  # Route definitions
│   ├── services/                # Business logic
│   └── utils/                   # Utility functions
│
└── tests/                      # Test files (Jest)
    ├── unit/                   # Unit tests
    └── integration/            # Integration tests
```

## 🛡 API Conventions
### Rate Limiting
- **General API**: 100 requests per minute per IP
- **Auth Endpoints**: 10 requests per minute per IP
- **Admin Endpoints**: 50 requests per minute per IP

### Response Format
```json
{
  "success": true,
  "data": {},
  "message": "Success message",
  "error": null
}
```

### Error Handling
- **400 Bad Request**: Invalid input/data
- **401 Unauthorized**: Authentication required
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Resource not found
- **500 Internal Server Error**: Server error

### Endpoint Structure
- **Base URL**: `/api/v1`
- **Resources**:
  - `GET /deals` - List all deals
  - `GET /deals/:id` - Get single deal
  - `POST /deals` - Create deal (Merchant+)
  - `PATCH /deals/:id` - Update deal (Owner/Admin)
  - `DELETE /deals/:id` - Delete deal (Owner/Admin)

## 🧪 Testing
### Running Tests
```bash
# Run all tests
npm test

# Run specific test file
npm test path/to/test-file.test.js

# Run with coverage
npm run test:coverage
```

### Test Coverage
- Aim for >80% test coverage
- Test all critical paths and edge cases
- Mock external services and APIs

## 🚀 Deployment
### Staging
- Automatically deployed on push to `staging` branch
- Environment: staging.groupon-clone.com
- Database: MongoDB Atlas (staging cluster)

### Production
- Manually deployed from `main` branch
- Environment: groupon-clone.com
- Database: MongoDB Atlas (production cluster)

## 📚 Documentation
### API Documentation
- Swagger/OpenAPI at `/api-docs`
- Endpoint documentation in JSDoc format
- Request/response examples

### Database Schema
```javascript
// Example User Schema
const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'merchant', 'admin'], default: 'user' },
  // ... other fields
});

// Example Deal Schema
const dealSchema = new Schema({
  title: { type: String, required: true },
  description: String,
  originalPrice: { type: Number, required: true },
  dealPrice: { type: Number, required: true },
  // ... other fields
});
```

### Component Library
- Storybook for UI component documentation
- Prop types and default props
- Usage examples
- Interactive examples

## 👥 Team Conventions
- Daily standups at 10:00 AM
- Code reviews required before merging to `main`
- Use project board for task tracking
- Document all major architectural decisions in `/docs/adr`

## 🔐 Security
- Use environment variables for all secrets
- Implement rate limiting on auth endpoints
- Sanitize all user inputs
- Regular dependency updates
- Security headers enabled

## 🆘 Getting Help
- Check `#dev-support` on Slack
- Create a GitHub issue for bugs/feature requests
- Refer to `/docs` for additional documentation
