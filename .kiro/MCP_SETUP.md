# MCP Server Setup for GeoCities Reborn

This project uses Model Context Protocol (MCP) servers to extend Kiro's capabilities.

## Installed MCP Servers

### 1. **Fetch Server** ✅ Enabled
**Purpose:** Test API endpoints and external services
**Use Cases:**
- Test Railway backend endpoints (`https://geocities-reborn-production.up.railway.app/api/*`)
- Validate Google Gemini API responses
- Check if published sites are accessible
- Debug CORS issues

**Example Usage:**
```
"Test the /api/gallery endpoint and show me the response"
"Fetch my published site at /site/[siteId] and verify it loads"
"Check if the Gemini API is responding correctly"
```

### 2. **Filesystem Server** ✅ Enabled
**Purpose:** Advanced file operations beyond Kiro's native tools
**Use Cases:**
- Batch file operations
- Search across multiple files
- File system monitoring
- Directory comparisons

**Example Usage:**
```
"Find all files that import Monaco Editor"
"List all CSS files that use the color #ff00ff"
"Compare frontend and backend package.json dependencies"
```

### 3. **Git Server** ✅ Enabled
**Purpose:** Version control operations
**Use Cases:**
- Check git status and uncommitted changes
- View commit history
- Create branches
- Manage git operations

**Example Usage:**
```
"Show me the git status"
"What files have changed since last commit?"
"Show the last 5 commits"
"Create a new branch for the new feature"
```

### 4. **MongoDB Server** ⚠️ Disabled (Requires Setup)
**Purpose:** Direct database inspection and queries
**Use Cases:**
- Debug why sites aren't appearing in gallery
- Verify user authentication data
- Check site view counts
- Inspect neighborhood data

**Setup Required:**
1. Get your MongoDB connection string from MongoDB Atlas
2. Edit `.kiro/settings/mcp.json`
3. Replace `mongodb+srv://your-connection-string` with your actual connection string
4. Set `"disabled": false`

**Example Usage (once enabled):**
```
"Show me all sites in the Area51 neighborhood"
"Why isn't my site appearing in the gallery?"
"Check if user authentication is working correctly"
"Show me the most viewed sites"
```

### 5. **Puppeteer Server** ✅ Enabled
**Purpose:** Browser automation and testing
**Use Cases:**
- Test live preview functionality
- Verify published sites render correctly
- Screenshot different pages
- Test responsive design
- Automated end-to-end testing

**Example Usage:**
```
"Navigate to my published site and take a screenshot"
"Test if the gallery page loads correctly"
"Check if the live preview iframe works"
"Test the mobile responsive design"
```

## Installation

These MCP servers use `uvx` (for Python-based servers) and `npx` (for Node-based servers).

### Install uv (if not already installed):
```bash
# Windows (PowerShell)
powershell -c "irm https://astral.sh/uv/install.ps1 | iex"

# Or via pip
pip install uv
```

### Verify Installation:
```bash
uvx --version
npx --version
```

## Usage Tips

### Testing API Endpoints
```
"Use fetch to test POST /api/publish with this data: {title: 'Test', city: 'Area51'}"
```

### Database Debugging
```
"Query MongoDB for all sites where city='Tokyo' and show their titles"
```

### Browser Testing
```
"Use Puppeteer to navigate to localhost:5173 and verify the homepage loads"
```

### Git Workflow
```
"Show me what files changed, then create a commit with message 'Add visitor counter'"
```

## Troubleshooting

### MCP Server Not Working?
1. Check if `uvx` or `npx` is installed
2. Restart Kiro IDE
3. Check the MCP Server view in Kiro's explorer panel
4. Look for error messages in the output

### MongoDB Connection Issues?
- Verify your connection string is correct
- Check if your IP is whitelisted in MongoDB Atlas
- Ensure the database user has proper permissions

### Puppeteer Issues?
- First run may take time to download Chromium
- Ensure you have enough disk space
- Check if antivirus is blocking browser automation

## Auto-Approved Tools

Some tools are auto-approved for faster workflow:
- `fetch` - HTTP requests
- `read_file`, `list_directory` - File operations
- `git_status`, `git_log` - Git read operations
- `puppeteer_navigate` - Browser navigation

Other operations will require your approval for security.

## Reconnecting Servers

MCP servers automatically reconnect when you:
- Save changes to `mcp.json`
- Restart Kiro IDE
- Use the "Reconnect MCP Servers" command

Or manually reconnect from the MCP Server view in the explorer panel.

---

## Example Workflows

### Workflow 1: Debug Published Site Not Appearing
```
1. "Use fetch to GET /api/gallery?city=Area51"
2. "Query MongoDB for sites where city='Area51'"
3. "Compare the results and tell me what's wrong"
```

### Workflow 2: Test New Feature End-to-End
```
1. "Show git status to see what changed"
2. "Use Puppeteer to test the new feature on localhost:5173"
3. "Take a screenshot of the result"
4. "If it works, create a git commit"
```

### Workflow 3: Validate API Integration
```
1. "Use fetch to test the Gemini API with a sample prompt"
2. "Check if the response format matches our TypeScript types"
3. "Test error handling by sending invalid data"
```

---

**Ready to use MCP!** These servers will make debugging, testing, and development much faster. 🚀
