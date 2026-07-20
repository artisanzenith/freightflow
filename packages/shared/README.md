# packages/shared

Shared TypeScript domain layer used by both apps and Edge Functions.

**Status:** Not implemented yet.

## Contents (planned)

- Domain types (Load, Driver, Truck, Customer, Invoice, Document, Company, Profile)
- Enums (LoadStatus, Role, DocumentType, InvoiceStatus)
- Shared constants (status transitions, US units)

This package is the single source of truth for the domain model and prevents drift between client and server.
