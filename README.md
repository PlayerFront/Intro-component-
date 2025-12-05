# Form Implementation Comparison

A React project demonstrating two different approaches to form implementation: handmade vs library-based.

## Architecture

src/
├── Versions/
│ ├── legacy/ # Handmade implementation
│ │ ├── hooks/ # useField, useAuth
│ │ ├── services/ # auth-service
│ │ └── mocks/ # fakeAuthServer
│ └── modern/ # Library-based implementation
│ └── components/ # React Hook Form + Zod
└── App.jsx # Version switcher

## 🔄 Available Versions

### Legacy Version (Handmade)
- ✅ Custom hooks: useField, useAuth
- ✅ Manual validation logic
- ✅ Mock server with user "database"
- ✅ Dynamic registration/login flow
- ✅ Full state management

### Modern Version (React Hook Form + Zod)  
- ✅ Declarative validation with Zod schemas
- ✅ Optimized re-renders with isolated updates
- ✅ Built-in form states (loading, errors, etc.)
- ✅ TypeScript-ready validation
- ✅ Minimal boilerplate code

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev