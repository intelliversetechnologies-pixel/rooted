# Task: Remove Firebase Auth and Replace with Auth0 in Sign-Up and Sign-In Pages

## Steps

1. Remove Firebase references in signup/page.tsx
   - Remove imports: createUserWithEmailAndPassword, auth from lib/firebase/config
   - Remove references to createUserWithEmailAndPassword
2. Implement Auth0 sign-up flow in signup/page.tsx
   - Import and configure Auth0’s Next.js client code
   - Add necessary code to handle user registration with Auth0
3. Remove Firebase references in signin/page.tsx
   - Remove imports: signInWithEmailAndPassword, auth from lib/firebase/config
   - Remove references to signInWithEmailAndPassword
4. Implement Auth0 sign-in flow in signin/page.tsx
   - Import and configure Auth0’s Next.js client code
   - Replace the signIn form handling with Auth0 logic
5. (Optional) Remove or minimize usage of lib/firebase/config.ts if it’s no longer needed
6. Test updated authentication flows
   - Confirm sign-up and sign-in work as expected
   - Check loading states, errors, and redirects
