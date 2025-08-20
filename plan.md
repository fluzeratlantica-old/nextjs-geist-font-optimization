```markdown
## Overview
We will build a Next.js turn-based game app (inspired by Atlantica Online) that runs on localhost. It will include a client-side registration/login system (using localStorage) and a game page where players select a hero and a mercenary, then simulate a simple turn-based battle. The UI will be modern with clean typography, spacing, and layout. All user inputs and actions will be robustly error-handled, and each module will be implemented in a separate file for clear separation of concerns.

## File Structure and New Files
- **src/lib/auth.ts** – Handles user registration, login, session retrieval, and logout using localStorage.
- **src/lib/game.ts** – Provides game data and logic, including static arrays of heroes and mercenaries and a function to simulate a turn-based battle.
- **src/app/auth/register/page.tsx** – Registration page with a modern form for username, email, and password input.
- **src/app/auth/login/page.tsx** – Login page with a modern form for username and password input.
- **src/app/game/page.tsx** – Game page that checks user authentication, displays welcome text, shows hero/mercenary selection grids, and handles battle simulation.
- *(Optional)* Update **src/app/layout.tsx** and **src/app/globals.css** for consistent styling and navigation (e.g., a logout button).

## Detailed Step-by-Step Outline

### 1. Create Authentication Library (src/lib/auth.ts)
- **registerUser(username, email, password):**
  - Retrieve existing users from localStorage ("users").
  - Validate that the username/email is not already registered.
  - Save the new user into localStorage and return a success response.
  - Include try/catch for JSON parsing errors.
- **loginUser(username, password):**
  - Retrieve users from localStorage and validate the credentials.
  - On success, save the logged-in user into localStorage as "currentUser" and return the user data.
- **getCurrentUser():**
  - Read and return the "currentUser" object from localStorage.
- **logoutUser():**
  - Remove the "currentUser" entry from localStorage.

### 2. Create Game Logic Library (src/lib/game.ts)
- **getHeroes():**
  - Return a static array of hero objects (each containing id, name, hp, attack, defense, and description).
- **getMercenaries():**
  - Return a static array of mercenary objects with similar properties.
- **startBattle(hero, mercenary):**
  - Implement simple turn-based battle logic:
    - Initialize health values from hero and mercenary attributes.
    - Simulate rounds where each side alternates attacks (calculate damage based on attack and defense).
    - Record and return a battle log (an array of text messages describing each turn).
  - Ensure to check for invalid inputs and include error handling.

### 3. Implement Registration Page (src/app/auth/register/page.tsx)
- Create a React functional component that renders a centered form with:
  - Input fields: username, email, password, and (optionally) confirm password.
  - Form validation to ensure passwords match and fields are not empty.
- On submission:
  - Call `registerUser` from the auth library.
  - Display error messages for duplicate registration or validation errors.
  - On success, navigate to the login page using Next.js’s `useRouter`.
- Use modern, clean styling with proper spacing and typography.

### 4. Implement Login Page (src/app/auth/login/page.tsx)
- Create a React functional component that renders a login form with:
  - Input fields: username and password.
  - Error message area for incorrect credentials.
- On submission:
  - Call `loginUser` from the auth library.
  - If successful, navigate to the game page.
- Ensure the form has a modern and uncluttered design, similar to the registration page.

### 5. Implement Game Page (src/app/game/page.tsx)
- On component mount, use a hook (e.g., `useEffect`) to call `getCurrentUser`; if no valid user is found, redirect to the login page.
- Display a header with a welcome message that includes the user’s name.
- Use the game library to fetch heroes and mercenaries and render them in two separate, modern grid sections:
  - Each character card shows the name, hp, attack, defense, and description with clear typography.
  - Allow selection by clicking a card; visually indicate selection (e.g., highlighted border or background change).
- Add a "Mulai Battle" button that is disabled until both a hero and a mercenary have been selected.
- On clicking the button, call `startBattle` with the selected characters and display the resulting battle log in a scrollable, styled container.
- Include error handling to display user-friendly messages if any game logic errors occur.

### 6. Styling and Global Layout
- Update **src/app/globals.css** with custom CSS rules to ensure:
  - Form cards and game grids have modern spacing, borders, and consistent font styles.
  - Buttons include hover and disabled states.
- *(Optional)* Modify **src/app/layout.tsx** to include a global header with navigation and a logout option (calling `logoutUser`).

### 7. Testing and Error Handling
- Test the registration, login, and game functionalities by running the app on localhost.
- Use browser dev tools to monitor localStorage and ensure proper error messages are displayed when user input is invalid.
- Validate that the game page correctly prevents unauthorized access by redirecting unregistered users.
- Include console logs and try/catch wrappers to catch and display errors in the UI.

## Summary
- Created new libraries for authentication (src/lib/auth.ts) and game logic (src/lib/game.ts) with error handling.
- Developed registration and login pages (src/app/auth/register/page.tsx and src/app/auth/login/page.tsx) with modern, clean UI elements.
- Built a game page (src/app/game/page.tsx) that enforces user authentication, allows hero and mercenary selection, and simulates turn-based battles.
- Employed Next.js routing (app directory) and localStorage for client-side persistence.
- Incorporated responsive design principles ensuring clear typography, spacing, and layout.
- Provided robust error handling and clear user feedback for form validations and game actions.
- The entire app runs locally as requested, with tests planned to ensure proper functionality.
