# Custom Modal System

## Overview
Replaced browser dialogs (alert, prompt, confirm) with custom modal windows for a professional, consistent user experience.

## Modal Types

### 1. InputModal
For text input (replaces `prompt()`)

**Features:**
- Custom title and label
- Default value support
- Placeholder text
- Auto-focus on input
- Enter to submit
- Escape to cancel

**Usage:**
```typescript
<InputModal
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  onSubmit={(value) => handleSubmit(value)}
  title="Project Name"
  label="Enter your project name:"
  defaultValue="My Site"
  placeholder="Enter name..."
/>
```

### 2. ConfirmModal
For confirmations (replaces `confirm()`)

**Features:**
- Custom title and message
- Customizable button text
- Danger mode (red button)
- Cancel/Confirm actions

**Usage:**
```typescript
<ConfirmModal
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  onConfirm={() => handleConfirm()}
  title="Delete File"
  message="Are you sure you want to delete this file?"
  confirmText="Delete"
  cancelText="Cancel"
  danger={true}
/>
```

### 3. AlertModal
For notifications (replaces `alert()`)

**Features:**
- Three types: info, success, error
- Icon indicators
- Custom title and message
- Single OK button

**Usage:**
```typescript
<AlertModal
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  title="Success!"
  message="Your page has been published."
  type="success"
/>
```

### 4. FileActionsModal
For file operations (custom)

**Features:**
- Rename action
- Duplicate action
- Delete action
- Icon buttons
- Danger styling for delete

**Usage:**
```typescript
<FileActionsModal
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  fileName="index.html"
  onRename={() => handleRename()}
  onDelete={() => handleDelete()}
  onDuplicate={() => handleDuplicate()}
/>
```

## Design Features

### Visual Design
- **Dark theme** - Matches VS Code aesthetic
- **Smooth animations** - Fade in overlay, slide in content
- **Backdrop blur** - Focus on modal
- **Rounded corners** - Modern appearance
- **Shadow effects** - Depth and elevation

### User Experience
- **Keyboard support** - Escape to close, Enter to submit
- **Click outside** - Close modal
- **Auto-focus** - Input fields focused automatically
- **Prevent scroll** - Body scroll disabled when open
- **Responsive** - Works on all screen sizes

### Accessibility
- **Keyboard navigation** - Full keyboard support
- **Focus management** - Proper focus handling
- **Clear actions** - Obvious buttons
- **Visual feedback** - Hover states

## Implementation Details

### Modal Structure
```
┌─────────────────────────────────┐
│ Modal Overlay (backdrop)        │
│  ┌───────────────────────────┐  │
│  │ Modal Content             │  │
│  │  ┌─────────────────────┐  │  │
│  │  │ Header              │  │  │
│  │  │  Title         [X]  │  │  │
│  │  ├─────────────────────┤  │  │
│  │  │ Body                │  │  │
│  │  │  Content here       │  │  │
│  │  │  [Cancel] [Confirm] │  │  │
│  │  └─────────────────────┘  │  │
│  └───────────────────────────┘  │
└─────────────────────────────────┘
```

### State Management
```typescript
const [showModal, setShowModal] = useState(false)
const [modalData, setModalData] = useState('')

// Open modal
setShowModal(true)

// Close modal
setShowModal(false)

// Handle submit
const handleSubmit = (value: string) => {
  setModalData(value)
  setShowModal(false)
}
```

### Styling
- **Colors**: VS Code dark theme palette
- **Fonts**: System fonts, 14px base
- **Spacing**: Consistent padding/margins
- **Transitions**: 0.2s ease-out
- **Z-index**: 1000 for overlay

## Use Cases in Editor

### Project Management
- **Set project name** - InputModal on template selection
- **Rename project** - InputModal on click/double-click
- **Clear project** - ConfirmModal with danger styling

### File Management
- **New file** - InputModal for filename
- **Rename file** - InputModal with current name
- **Delete file** - ConfirmModal with warning
- **File actions** - FileActionsModal on right-click

### Publishing
- **Publish success** - AlertModal with URL
- **Publish error** - AlertModal with error message

## Benefits vs Browser Dialogs

### Browser Dialogs (Old)
- ❌ Blocks entire browser
- ❌ Inconsistent styling
- ❌ Limited customization
- ❌ Poor UX
- ❌ No animations
- ❌ Ugly appearance

### Custom Modals (New)
- ✅ Non-blocking
- ✅ Consistent styling
- ✅ Fully customizable
- ✅ Great UX
- ✅ Smooth animations
- ✅ Professional appearance

## Keyboard Shortcuts

### All Modals
- `Escape` - Close modal
- `Click outside` - Close modal

### InputModal
- `Enter` - Submit form
- `Escape` - Cancel

### ConfirmModal
- `Enter` - Confirm action
- `Escape` - Cancel

### AlertModal
- `Enter` - Close
- `Escape` - Close

## Responsive Design

### Desktop (>768px)
- Modal width: 400-600px
- Centered on screen
- Horizontal button layout

### Mobile (<768px)
- Modal width: 90%
- Vertical button layout
- Full-width buttons
- Adjusted padding

## Animation Details

### Overlay
```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
```

### Content
```css
@keyframes slideIn {
  from {
    transform: translateY(-20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
```

## Color Palette

### Backgrounds
- Overlay: `rgba(0, 0, 0, 0.7)`
- Modal: `#2d2d30`
- Header: `#252526`
- Input: `#3c3c3c`

### Text
- Primary: `#cccccc`
- Secondary: `#858585`

### Buttons
- Primary: `#007acc`
- Secondary: `#3e3e42`
- Danger: `#f48771`

### Borders
- Default: `#3e3e42`
- Focus: `#007acc`

## Future Enhancements

- [ ] Drag to reposition
- [ ] Resize modals
- [ ] Multiple modals stacking
- [ ] Custom animations
- [ ] Sound effects
- [ ] Loading states
- [ ] Progress indicators
- [ ] Toast notifications

## Summary

The custom modal system provides:
- ✅ Professional appearance
- ✅ Consistent UX
- ✅ Full customization
- ✅ Smooth animations
- ✅ Keyboard support
- ✅ Responsive design
- ✅ Dark theme
- ✅ Better than browser dialogs

Replaces all browser dialogs with beautiful, functional modals!
