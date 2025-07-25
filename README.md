# Pack File Uploader

A production-ready file upload service built with TypeScript, Express.js, PostgreSQL, and AWS S3. This project demonstrates enterprise-level architecture patterns, comprehensive testing strategies, and scalability considerations for real-world applications.

## 🎯 Project Overview

This project showcases the implementation of a robust file upload system with the following key capabilities:

- **Secure File Management**: Upload, storage, and retrieval with AWS S3 integration
- **Metadata Persistence**: PostgreSQL with type-safe Kysely ORM
- **API-First Design**: RESTful endpoints with comprehensive Swagger documentation
- **Enterprise Authentication**: API key-based security
- **Real-time Analytics**: File statistics and breakdowns
- **Production Infrastructure**: SST deployment with infrastructure as code

## 🏗️ Architecture & Design Decisions

### Clean Architecture Implementation
```
Controllers → Services → Repository → Database/S3
     ↓
Middleware Stack (Auth, Error Handling)
```

### Technology Choices & Rationale

| Technology | Alternative | Why Chosen |
|------------|-------------|------------|
| **Kysely** | Prisma/TypeORM | Superior TypeScript integration, raw SQL control |
| **Express.js** | Fastify/Nest.js | Mature ecosystem, team familiarity, middleware flexibility |
| **Zod** | Joi/Yup | Runtime type safety, seamless TypeScript integration |
| **SST** | CDK/Terraform | Type-safe infrastructure, better DX for AWS |
| **Jest** | Vitest/Mocha | Comprehensive testing ecosystem, excellent mocking |

## 🚀 Key Features Implemented

### Core Functionality
- ✅ **File Upload** with multipart form support
- ✅ **Metadata Management** with structured validation
- ✅ **Duplicate Handling** with download counters
- ✅ **Presigned URLs** for secure downloads
- ✅ **Statistics API** with real-time aggregations
- ✅ **Error Handling** with custom error types
- ✅ **API Documentation** with Swagger/OpenAPI

### Technical Excellence
- ✅ **Test Coverage** (Unit + Integration)
- ✅ **Type Safety** end-to-end with TypeScript
- ✅ **Input Validation** with Zod schemas
- ✅ **Database Migrations** with enum support
- ✅ **Security** with API key authentication
- ✅ **Monitoring** ready with structured logging

## 📊 Implementation Highlights

### Database Design
```sql
-- Enum-driven design for data consistency
CREATE TYPE "Category" AS ENUM ('ProjectManagement', 'Leadership', 'Negotiation', 'SoftwareDevelopment', 'ProblemSolving');

-- Optimized table structure
CREATE TABLE file (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL UNIQUE,
  description VARCHAR(1000) NOT NULL,
  category "Category" NOT NULL,
  language "Language" NOT NULL,
  provider "Provider" NOT NULL,
  role "Role" NOT NULL,
  count INTEGER NOT NULL DEFAULT 1,
  file_reference TEXT NOT NULL
);
```

### Testing Strategy
- **Unit Tests**: Isolated component testing with comprehensive mocking
- **Integration Tests**: Full HTTP stack with real PostgreSQL
- **Test Coverage**: Controllers, Services, and Repository layers
- **CI/CD Ready**: Automated testing with Docker containers

## 🔄 Trade-offs & Compromises

### Implemented vs. Ideal State

**What I Built** (for demonstration):
- Basic file upload and retrieval
- Simple API key authentication
- PostgreSQL with enum constraints
- S3 integration with presigned URLs

**What I Would Add** (with more time):
- **HTTPS/TLS Termination**: SSL certificates and secure transport layer
- **File Type Validation**: MIME type checking and virus scanning
- **Advanced Security**: Rate limiting, RBAC, audit logging
- **Performance Features**: Caching layer, CDN integration
- **Operational Tools**: Health checks, metrics, alerting
- **User Experience**: Bulk operations, search, file previewing

### Technical Debt Identified
1. **HTTPS/TLS**: Currently running on HTTP - needs SSL termination for production
2. **Error Granularity**: More specific error codes and messages
3. **Validation Depth**: File content validation beyond metadata
4. **Caching Strategy**: Redis for frequently accessed data
5. **Monitoring**: Application metrics and distributed tracing, by means Prometheus
6. **Security Hardening**: Rate limiting and DDoS protection

## 🏢 Production & Scaling Considerations

### Scaling Architecture

#### Growth Phase 
- **TLS Termination**: Load balancer with SSL certificates (AWS ACM)
- **Database**: Read replicas, connection pooling with PgBouncer
- **Storage**: CDN integration for global distribution with HTTPS
- **Caching**: Redis for session management and file metadata
- **Search**: Elasticsearch for advanced file search capabilities
- **Security**: WAF, DDoS protection, rate limiting

#### Enterprise Scale 
- **Microservices**: Split into upload, metadata, and analytics services
- **Event-Driven**: Message queues for asynchronous processing
- **Database Sharding**: Partition by tenant or geographic region
- **Global Distribution**: Multi-region deployment with data residency

### Multi-Tenant Strategy

#### Recommended Approach: Schema per Tenant
```sql
-- Each tenant gets isolated schema in shared database
CREATE SCHEMA tenant_techcorp;
CREATE SCHEMA tenant_startupxyz;

-- Identical table structure per tenant
CREATE TABLE tenant_techcorp.file (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL UNIQUE,
  description VARCHAR(1000) NOT NULL,
  category "Category" NOT NULL,
  file_reference TEXT NOT NULL
);

CREATE TABLE tenant_startupxyz.file (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL UNIQUE,
  description VARCHAR(1000) NOT NULL,
  category "Category" NOT NULL,
  file_reference TEXT NOT NULL
);
```

#### Implementation Benefits
- **Strong Isolation**: Complete data separation at database level
- **Cost Efficient**: Shared database infrastructure and connection pooling
- **Scalable**: Single application instance serves all tenants
- **Maintainable**: Schema migrations applied consistently across tenants
- **Secure**: No risk of cross-tenant data leakage
- **Flexible**: Different tenants can have schema customizations if needed

## 🚀 Getting Started

### Quick Setup
```bash
# Clone and setup
git clone <repo-url>
cd pack-file-uploader
pnpm install
npx sst refresh #or npx sst init 

# Run tests
pnpm run test

# Start development
pnpm dev
```

### Test
```bash
pnpm run test:unit        
pnpm run test:integration 

```

## 💡 Key Learning Demonstrations

This project showcases practical experience with:

### Backend Architecture
- **Clean Architecture**: Separation of concerns across layers
- **Dependency Injection**: Testable, maintainable code structure
- **Error Handling**: Centralized error management with custom types

### Database Design
- **Type Safety**: End-to-end TypeScript with database schemas
- **Performance**: Proper indexing and query optimization
- **Migrations**: Schema evolution with enum types

### Cloud Integration
- **AWS S3**: Secure file storage with presigned URLs
- **Infrastructure as Code**: SST for repeatable deployments
- **Security**: API key authentication and data encryption

### Testing 
- **Test Strategy**: Unit, integration, and contract testing
- **Mocking**: Strategic mocking for external dependencies
