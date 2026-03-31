\# Write Tests: $ARGUMENTS



\## Target

Write tests for: $ARGUMENTS



\## Rules

\- Framework: Vitest

\- File location: Next to the source file as \[name].test.ts or \[name].test.tsx

\- Cover: Happy path, error cases, and edge cases

\- Do NOT test pure UI components with no logic

\- Do NOT test Next.js pages (those need e2e tests)

\- Do NOT test third-party library behavior



\## Template



import { describe, it, expect } from 'vitest'



describe('\[function or component name]', () => {

&#x20; describe('happy path', () => {

&#x20;   it('should \[expected behavior] when \[condition]', () => {

&#x20;     // Arrange: Set up test data

&#x20;     // Act: Call the function

&#x20;     // Assert: Check the result

&#x20;   })

&#x20; })



&#x20; describe('error cases', () => {

&#x20;   it('should \[expected behavior] when \[invalid input]', () => {

&#x20;     // Arrange

&#x20;     // Act

&#x20;     // Assert

&#x20;   })

&#x20; })



&#x20; describe('edge cases', () => {

&#x20;   it('should handle \[edge case description]', () => {

&#x20;     // Arrange

&#x20;     // Act

&#x20;     // Assert

&#x20;   })

&#x20; })

})



\## Priority

1\. Zod schemas: Test with valid AND invalid data

2\. Utility functions: Test all branches and return values

3\. Zustand stores: Test actions and state changes

4\. Custom hooks: Test with renderHook from @testing-library/react

