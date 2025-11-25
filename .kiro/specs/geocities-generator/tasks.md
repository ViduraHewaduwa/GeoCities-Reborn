# Implementation Plan

- [x] 1. Set up React + Vite project structure and dependencies



  - Initialize Vite project with React and TypeScript template
  - Install and configure Tailwind CSS
  - Set up TypeScript configuration
  - Create directory structure: `/src/components`, `/src/lib`, `/src/types`, `/src/api`
  - Initialize separate Node.js backend in `/server` directory
  - Install Express and necessary backend dependencies
  - _Requirements: 8.5_

- [ ] 2. Implement core TypeScript interfaces and types
  - Create `/src/types/index.ts` with GeneratedPage, ThemePreset, ThemeConfig, AppState interfaces
  - Define DescriptionInputProps, PreviewPanelProps, ActionBarProps interfaces
  - Export all types for use across frontend and backend
  - _Requirements: 8.1, 8.2_

- [ ] 3. Build theme configuration system
  - Create `/src/lib/themes.ts` with THEME_CONFIGS constant
  - Implement theme configurations for Cyber, Gamer, Glitter, and Space themes
  - Include color palettes, keywords, and GIF categories for each theme
  - _Requirements: 6.1, 6.2, 6.3_

- [ ] 4. Implement AI prompt builder
  - Create `/server/lib/promptBuilder.ts` with buildGenerationPrompt and buildRemixPrompt functions
  - Construct prompts that include user description, theme guidelines, and retro element requirements
  - Add theme-specific styling instructions based on selected theme
  - Ensure prompts request self-contained HTML with inline CSS
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 7.1, 7.2, 7.3, 7.4, 7.5_

- [ ] 5. Create generation API endpoint
  - Implement `/server/routes/generate.ts` as POST endpoint in Express
  - Accept description and optional theme in request body
  - Integrate with MCP server for AI HTML generation
  - Validate generated HTML for basic structure
  - Return GeneratedPage JSON response
  - Add error handling for timeouts and AI service failures
  - Add CORS configuration for frontend requests
  - _Requirements: 1.2, 2.1, 2.5, 8.4_

- [ ] 6. Implement remix API endpoint
  - Create `/server/routes/remix.ts` as POST endpoint in Express
  - Accept original description and previous HTML in request body
  - Use promptBuilder.buildRemixPrompt to create variation prompt
  - Call AI model and return new GeneratedPage
  - Ensure output differs from previous version
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [ ] 7. Build DescriptionInput component
  - Create `/src/components/DescriptionInput.tsx` with text input and theme selector
  - Implement character count display (10-500 characters)
  - Add validation for minimum length and empty input
  - Create theme preset dropdown with Cyber, Gamer, Glitter, Space options
  - Add submit button with loading state
  - Display example prompts as placeholder or helper text
  - _Requirements: 1.1, 1.3, 1.4, 6.1, 6.4, 6.5_

- [ ] 8. Build PreviewPanel component
  - Create `/src/components/PreviewPanel.tsx` with sandboxed iframe
  - Implement iframe with `sandbox="allow-scripts"` attribute
  - Handle HTML content injection via srcdoc
  - Add loading state and error boundary
  - Implement responsive scaling to fit viewport
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [ ] 9. Build ActionBar component
  - Create `/src/components/ActionBar.tsx` with download and remix buttons
  - Implement download functionality using Blob and URL.createObjectURL
  - Generate descriptive filenames based on description keywords
  - Add remix button that triggers onRemix callback
  - Show loading states for both actions
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 5.1_

- [ ] 10. Implement main App component with state management
  - Create `/src/App.tsx` as main application component
  - Set up React state using useState for AppState (currentPage, isGenerating, error)
  - Implement handleGenerate function that calls backend `/api/generate` endpoint
  - Implement handleRemix function that calls backend `/api/remix` endpoint
  - Wire up DescriptionInput, PreviewPanel, and ActionBar components
  - Add error display and handling
  - _Requirements: 1.2, 1.5, 3.1, 8.2, 8.3_

- [ ] 11. Add input validation and error handling
  - Implement validation logic in DescriptionInput for character limits
  - Add error messages for empty, too short, and too long descriptions
  - Implement error handling in API routes with user-friendly messages
  - Add retry logic for API timeouts (one automatic retry)
  - Display error states in PreviewPanel when rendering fails
  - _Requirements: 1.3, 1.4, 3.5_

- [ ] 12. Style the application UI
  - Apply Tailwind CSS classes to create modern, clean UI chrome
  - Design layout with input section at top, preview panel below
  - Style theme selector as dropdown or button group
  - Add visual feedback for loading states (spinners, disabled buttons)
  - Ensure responsive design for mobile and desktop viewports
  - _Requirements: 3.4_

- [ ] 13. Configure MCP server integration and Express server
  - Create `/server/index.ts` as main Express server entry point
  - Set up MCP server configuration for HTML generation
  - Configure Express routes for /api/generate and /api/remix
  - Add CORS middleware for frontend communication
  - Test connection to AI model from backend
  - Implement error handling for MCP server unavailability
  - Add timeout configuration (10 seconds max)
  - _Requirements: 1.2, 8.1, 8.4_

- [ ] 14. Implement download file handling
  - Create utility function in `/src/lib/download.ts` for file generation
  - Generate HTML Blob from generated page content
  - Create descriptive filename from description (sanitize, kebab-case)
  - Trigger browser download with proper MIME type
  - Ensure downloaded files are self-contained and portable
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

- [ ] 15. Add example prompts and user guidance
  - Create array of example descriptions in DescriptionInput
  - Display examples as placeholder text or helper section
  - Include examples for each theme (e.g., "make me a 90s gamer homepage")
  - Add tooltip or info icon explaining what makes a good description
  - _Requirements: 1.4_

- [ ] 16. Verify retro element generation
  - Test that generated pages include marquee elements
  - Verify neon/gradient text effects are applied
  - Confirm pixel borders and decorative elements appear
  - Check that animated GIFs are embedded inline
  - Validate 90s-style backgrounds (gradients, patterns, textures)
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

- [ ] 17. Test theme preset functionality
  - Generate pages with each theme (Cyber, Gamer, Glitter, Space)
  - Verify theme-specific colors are applied
  - Confirm theme-appropriate imagery and GIFs are included
  - Test generation without theme selection (inferred from description)
  - Validate theme selection can be changed before generation
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [ ] 18. Test remix functionality
  - Generate initial page and trigger remix
  - Verify remix completes within 10 seconds
  - Confirm remixed output differs from original in layout or styling
  - Test that remix maintains core theme from original description
  - Validate remix button shows loading state during generation
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [ ] 19. Validate HTML output quality
  - Test that generated HTML is valid HTML5
  - Verify all CSS is inline (no external stylesheets)
  - Confirm pages are self-contained (no external dependencies)
  - Test downloaded files open correctly in Chrome, Firefox, Safari
  - Validate that all retro elements render properly
  - _Requirements: 2.1, 2.2, 2.5, 4.4_

- [ ] 20. Implement publishing service and storage
  - Create `/server/lib/storage.ts` with file-based storage functions
  - Implement directory structure for neighborhoods (cyber, gamer, glitter, space, random)
  - Create functions to save published sites as JSON files
  - Implement unique ID generation using nanoid or similar
  - Create index management for quick neighborhood lookups
  - _Requirements: 8.1, 10.1, 10.2, 10.4_

- [ ] 21. Create publish API endpoint
  - Implement `/server/routes/publish.ts` as POST endpoint
  - Accept html, description, and theme in request body
  - Generate unique site ID with theme prefix
  - Save site to appropriate neighborhood directory
  - Return PublishedSite with full URL
  - Handle errors for storage failures
  - _Requirements: 8.1, 8.2, 8.3, 8.4_

- [ ] 22. Create site retrieval API endpoints
  - Implement `GET /api/sites/:id` endpoint to serve individual published sites
  - Implement `GET /api/neighborhoods` endpoint to list all neighborhoods with counts
  - Implement `GET /api/neighborhoods/:theme` endpoint to list sites in a neighborhood
  - Add error handling for missing sites
  - Return appropriate JSON responses
  - _Requirements: 8.5, 9.1, 9.2, 9.3_

- [ ] 23. Update ActionBar component with publish functionality
  - Add publish button to `/src/components/ActionBar.tsx`
  - Implement onPublish callback that calls `/api/publish` endpoint
  - Add isPublishing loading state
  - Display published URL after successful publish
  - Add copy-to-clipboard button for published URL
  - Show success message with link to published site
  - _Requirements: 8.1, 8.2_

- [ ] 24. Build NeighborhoodBrowser component
  - Create `/src/components/NeighborhoodBrowser.tsx`
  - Display grid or list of neighborhoods (Cyber, Gamer, Glitter, Space, Random)
  - Show site count for each neighborhood
  - Implement neighborhood selection to view sites
  - Display list of sites with titles/descriptions
  - Add click handler to navigate to individual published sites
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_

- [ ] 25. Add routing for neighborhoods and published sites
  - Install and configure React Router
  - Create route for `/neighborhoods` with NeighborhoodBrowser
  - Create route for `/sites/:id` to display individual published sites
  - Add navigation links between generator and neighborhood browser
  - Implement site viewer that fetches and displays published HTML in iframe
  - _Requirements: 9.3, 9.5_

- [ ] 26. Test publishing and neighborhood features
  - Publish sites with different themes and verify they appear in correct neighborhoods
  - Test that published URLs are accessible and display correct content
  - Verify neighborhood browser shows all published sites
  - Test navigation between generator, neighborhoods, and individual sites
  - Confirm copy-to-clipboard functionality works
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 9.1, 9.2, 9.3, 9.4, 9.5_

- [ ] 27. Deploy MVP to hosting platform
  - Configure frontend deployment to Netlify or Vercel
  - Configure backend deployment to Railway, Render, or similar Node.js host
  - Set up persistent storage directory for published sites
  - Set up environment variables for MCP server connection
  - Configure CORS for production frontend URL
  - Test deployed application end-to-end including publishing
  - Verify API endpoints function correctly in production
  - Test that published sites persist and are accessible
  - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_
