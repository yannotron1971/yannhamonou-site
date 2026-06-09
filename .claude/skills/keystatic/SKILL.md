---
name: keystatic
description: Use when you need to structure content, draft blogs, or update files for a Keystatic and Astro/Next.js project.
---

## Usage Instructions
When invoked, you are tasked with assisting the user in creating, formatting, or updating content for their headless CMS (Keystatic).

## Steps to execute
1. **Analyze the Request:** Determine what Keystatic collection or singleton the user wants to update (e.g., blog, authors, pages).
2. **Read the Schema:** Review the Keystatic config file (usually `keystatic.config.ts` or `keystatic.config.js`) to understand the required fields, marks, and frontmatter.
3. **Draft the Content:** Write the content in markdown or structured JSON/YAML, ensuring it matches the exact schema defined in their Keystatic config.
4. **Output/Write File:** Write the new content to the correct directory (e.g., `content/blog/my-post/index.mdoc` or `.json`).
