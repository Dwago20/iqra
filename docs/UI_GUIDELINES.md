# Islamic UI Design Guidelines for Iqra

## Color Palette

### Primary Colors
- **Primary**: `#16A34A` (emerald-600) - Main brand color, buttons, links
- **Primary Dark**: `#15803D` (emerald-700) - Hover states, active elements

### Accent Colors
- **Sky**: `#0EA5E9` (sky-500) - Information, secondary actions
- **Amber**: `#EAB308` (amber-500) - Warnings, attention elements
- **Success**: `#10B981` (emerald-500) - Success states, correct answers
- **Error**: `#EF4444` (red-500) - Error states, incorrect answers

### Neutral Colors
- **Background**: `#F8FAFC` (slate-50) - Main background
- **Card Background**: `#FFFFFF` - Card and component backgrounds
- **Text Primary**: `#1F2937` (gray-800) - Main text
- **Text Secondary**: `#6B7280` (gray-500) - Secondary text, labels
- **Border**: `#E5E7EB` (gray-200) - Borders, dividers

## Typography

### Font Stacks
- **UI/English**: System font stack (already in index.css)
- **Arabic**: `"Amiri", "Scheherazade New", "Noto Sans Arabic", serif` - Readable Arabic fonts with proper diacritics support

### Font Sizes
- **Heading 1**: `2rem` (32px)
- **Heading 2**: `1.5rem` (24px)
- **Heading 3**: `1.25rem` (20px)
- **Body**: `1rem` (16px)
- **Small**: `0.875rem` (14px)
- **Arabic Text**: `1.5rem` minimum for readability

## Layout & Components

### Spacing Scale
- **xs**: `0.25rem` (4px)
- **sm**: `0.5rem` (8px)
- **md**: `1rem` (16px)
- **lg**: `1.5rem` (24px)
- **xl**: `2rem` (32px)
- **2xl**: `3rem` (48px)

### Border Radius
- **Small**: `8px` - Buttons, small components
- **Medium**: `12px` - Cards, inputs
- **Large**: `16px` - Major containers
- **Round**: `50%` - Circular elements

### Shadows
- **Subtle**: `0 1px 3px rgba(0, 0, 0, 0.1)`
- **Medium**: `0 4px 6px rgba(0, 0, 0, 0.1)`
- **Large**: `0 10px 15px rgba(0, 0, 0, 0.1)`

### Cards
- Background: White
- Border radius: `16px`
- Padding: `1.5rem`
- Shadow: Subtle to medium
- Border: Optional 1px solid border color

### Buttons
- Border radius: `12px`
- Padding: `0.75rem 1.5rem`
- Font weight: 500
- Transition: All properties 200ms ease
- Hover: Slight scale (1.02) and darker color

## Tajweed Color System

### Tajweed Rules & Colors
- **Madd (Elongation)**: `#3B82F6` (blue-500) - Soft blue for vowel elongation
- **Ghunna (Nasal)**: `#10B981` (emerald-500) - Green for nasal sounds
- **Qalqala (Echo)**: `#8B5CF6` (violet-500) - Purple for echoing letters
- **Idgham (Merging)**: `#06B6D4` (cyan-500) - Cyan for letter merging
- **Ikhfa (Concealment)**: `#F59E0B` (amber-500) - Amber for concealed sounds
- **Iqlab (Conversion)**: `#EC4899` (pink-500) - Pink for letter conversion
- **Silent Letters**: `#9CA3AF` (gray-400) - Muted for non-pronounced letters

### CSS Classes
```css
.tajweed-madd { color: #3B82F6; border-bottom: 2px solid #3B82F6; }
.tajweed-ghunna { color: #10B981; border-bottom: 2px solid #10B981; }
.tajweed-qalqala { color: #8B5CF6; border-bottom: 2px solid #8B5CF6; }
.tajweed-idgham { color: #06B6D4; border-bottom: 2px solid #06B6D4; }
.tajweed-ikhfa { color: #F59E0B; border-bottom: 2px solid #F59E0B; }
.tajweed-iqlab { color: #EC4899; border-bottom: 2px solid #EC4899; }
.tajweed-silent { color: #9CA3AF; opacity: 0.7; }
```

## Accessibility

### Color Contrast
- All text meets WCAG AA standards (4.5:1 ratio minimum)
- Interactive elements have clear focus states
- Color is not the only way to convey information

### Focus States
- Visible focus rings using primary color with opacity
- Keyboard navigation support throughout
- Screen reader friendly labels

### Arabic Text Accessibility
- Sufficient font size (minimum 1.5rem for Arabic)
- High contrast against backgrounds
- Proper RTL text direction support
- Clear spacing between words and lines

## Implementation Notes

### CSS Variables
Use CSS custom properties for consistent theming:
```css
:root {
  --color-primary: #16A34A;
  --color-primary-dark: #15803D;
  --radius-lg: 16px;
  /* ... etc */
}
```

### Component Patterns
1. **Cards**: White background, rounded corners, subtle shadow
2. **Buttons**: Primary color, hover effects, proper padding
3. **Forms**: Clear labels, focus states, validation styling
4. **Arabic Text**: Proper font, RTL support, adequate spacing

### Responsive Design
- Mobile-first approach
- Breakpoints: 640px (sm), 768px (md), 1024px (lg)
- Flexible layouts using CSS Grid and Flexbox
- Touch-friendly button sizes (minimum 44px)

## Cultural Considerations

### Islamic Design Principles
- Clean, minimalist aesthetic
- Respectful treatment of Arabic text
- Calming, focused color palette
- Clear hierarchy and organization
- Emphasis on readability and accessibility

### User Experience
- Intuitive navigation
- Clear feedback for actions
- Progressive disclosure of information
- Respectful error handling
- Encouraging progress indicators
