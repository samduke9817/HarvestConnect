# Kenya Harvest Hub

## Overview

Kenya Harvest Hub is a B2C SaaS platform that connects Kenyan farmers directly with consumers, promoting fair prices, reducing intermediaries, and increasing market access. The platform enables farmers to list their products and manage their farming business while providing consumers with access to fresh, local produce through an intuitive marketplace interface.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The frontend is built using React with TypeScript, utilizing modern React patterns and hooks. The application uses Wouter for client-side routing, providing a lightweight alternative to React Router. State management is handled through React Query (@tanstack/react-query) for server state and React's built-in state management for local UI state.

**UI Framework**: The application uses shadcn/ui components built on top of Radix UI primitives, providing accessible and customizable components. Styling is implemented with Tailwind CSS using a custom design system with CSS variables for theming.

**Build System**: Vite is used as the build tool and development server, providing fast hot module replacement and optimized builds. The configuration includes support for TypeScript, React, and development-specific plugins for the Replit environment.

### Backend Architecture
The backend follows an Express.js architecture with TypeScript, implementing a RESTful API pattern. The server is structured with modular route handling and middleware for cross-cutting concerns like authentication and logging.

**API Design**: Routes are organized by domain (auth, products, farmers, cart, orders, etc.) with consistent REST conventions. The API includes comprehensive error handling and request/response logging middleware.

**Authentication**: The system uses Replit's OpenID Connect (OIDC) authentication with Passport.js strategy. Session management is handled through express-session with PostgreSQL storage, providing secure user authentication and authorization.

### Data Storage Solutions
The application uses PostgreSQL as the primary database with Drizzle ORM for type-safe database operations. The database schema is defined using Drizzle's schema definition with proper relationships and constraints.

**Database Schema**: Core entities include users, farmers, products, categories, orders, cart items, and reviews. The schema supports role-based access control with user roles (consumer, farmer, admin) and maintains referential integrity through foreign key relationships.

**Connection Management**: Database connections are managed through Neon's serverless PostgreSQL with connection pooling for optimal performance.

### Authentication and Authorization
**Session Management**: Uses PostgreSQL-backed sessions with configurable TTL and secure cookie settings. Session data includes user claims and role information for authorization decisions.

**Role-Based Access**: Three primary user roles (consumer, farmer, admin) with different access levels and dashboard views. Middleware functions protect routes based on authentication status and user roles.

**Security**: Implements secure session configuration with httpOnly cookies, CSRF protection, and proper error handling for unauthorized access attempts.

## External Dependencies

### Database Services
- **Neon Database**: Serverless PostgreSQL database hosting with WebSocket support for real-time connections
- **Drizzle ORM**: Type-safe ORM with migration support and schema validation

### Authentication Services
- **Replit Auth**: OpenID Connect authentication provider integrated with Replit's user system
- **Passport.js**: Authentication middleware for handling OIDC strategy and session management

### UI and Styling
- **Radix UI**: Accessible component primitives for complex UI components
- **Tailwind CSS**: Utility-first CSS framework for styling with custom design tokens
- **Lucide React**: Icon library providing consistent iconography

### Development and Build Tools
- **Vite**: Build tool and development server with TypeScript and React support
- **React Query**: Server state management with caching, synchronization, and error handling
- **React Hook Form**: Form library with validation using Zod schemas

### Payment Integration (Planned)
- **M-Pesa API**: Mobile payment integration for Kenyan market
- **Card Payment Processors**: Support for credit/debit card transactions

### Logistics and Delivery (Planned)
- **Third-party Logistics APIs**: Integration with local delivery services for order fulfillment
- **Geolocation Services**: For delivery address validation and route optimization