# UI Components Demo

## Demo

Watch the demo video:

https://streamable.com/46chs2

A small **React + TypeScript** demo application showcasing reusable UI components and a simple event management workflow.

The project demonstrates:

- Reusable UI components (`DataGrid`, `Form`, `Timeline`)
- Schema-driven forms using **Zod**
- Feature-based architecture
- Type-safe React development
- Clean separation between UI and domain logic

---
### Environment

- **Node.js:** v24.13.0
- **Yarn:** 3.6.3
- **NPM:** 11.6.2


# Getting Started

1. Navigate to the project directory:

```bash
cd exercise
```
2. Install dependencies
```bash
yarn install
```
3. Run dev
```bash
yarn dev
```

### Important

When creating a new event, ensure that the selected date falls within the range of dates displayed in the timeline based on the mock data.

### Personal Architecture Note


For this demo, I used a simple **feature-based structure** to separate reusable UI components from domain-specific logic.

In larger codebases, I typically prefer organizing projects using **Nx or Yarn workspaces**, where components can live in independent packages and be shared across applications. That approach mostly served me well in my previous work experience.

However, for the scope of this exercise, I chose a feature-based structure to keep the project simple while still demonstrating that reusable components (such as `DataGrid`, `Form`, and `Timeline`) are **independent of the business logic** and can be reused across features.