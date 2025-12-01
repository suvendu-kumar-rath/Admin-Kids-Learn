# Kids Learning Admin Panel

A modern, feature-rich admin panel for managing a kids learning platform built with React and Vite.

## 🎯 Features

### Authentication System
- **Login Page**: Secure admin login with form validation
- **Protected Routes**: All admin pages require authentication
- **Session Management**: Persistent login using localStorage
- **Logout Functionality**: Secure logout from any page

### Dashboard
- Real-time statistics cards (Students, Courses, Completions, Ratings)
- Recent activities feed
- Top performing courses
- Quick action buttons
- Beautiful gradient design

### Student Management
- View all students with detailed cards
- Search functionality by name
- Filter by status (Active/Inactive)
- Student progress tracking
- Individual student profiles

### Course Management
- Grid and list view toggle
- Course categories and levels
- Student enrollment tracking
- Rating and completion statistics
- Create new courses

### Analytics
- Student growth charts
- Course performance metrics
- Revenue tracking
- Completion rate analysis
- Key insights dashboard

### 🎨 Customization Hub
- **Add Category**: Create new learning categories
  - Enter category name
  - Enter item name
  - Upload photos (with preview)
  - Record voice pronunciations
  - Post category
- **Manage Categories**: View and edit existing categories
- **Content Library**: Browse uploaded media
- **Theme Settings**: Customize appearance

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start development server**
   ```bash
   npm run dev
   ```

3. **Build for production**
   ```bash
   npm run build
   ```

4. **Preview production build**
   ```bash
   npm run preview
   ```

## 🔐 Login

The application starts with a login page. For demo purposes, you can login with **any email and password**.

```
URL: http://localhost:3001/login
Demo: Use any credentials to login
```

## 📁 Project Structure

```
Kids_Learning_Admin/
├── src/
│   ├── components/
│   │   ├── Layout.jsx          # Main layout wrapper
│   │   ├── Sidebar.jsx         # Navigation sidebar
│   │   ├── Header.jsx          # Top header bar
│   │   └── ProtectedRoute.jsx  # Route protection
│   ├── context/
│   │   └── AuthContext.jsx     # Authentication context
│   ├── pages/
│   │   ├── Login.jsx           # Login page
│   │   ├── Dashboard.jsx       # Main dashboard
│   │   ├── Students.jsx        # Student management
│   │   ├── Courses.jsx         # Course management
│   │   ├── Analytics.jsx       # Analytics & reports
│   │   ├── Customization.jsx   # Customization hub
│   │   └── AddCategory.jsx     # Add new category form
│   ├── App.jsx                 # Main app component
│   ├── main.jsx                # App entry point
│   └── index.css               # Global styles
├── package.json
├── vite.config.js
└── index.html
```

## 🎨 Features Walkthrough

### 1. Login Flow
1. Open the app → Redirected to login page
2. Enter any email and password
3. Click "Sign In"
4. Redirected to dashboard

### 2. Adding a New Category
1. Login to admin panel
2. Click "Customization" in sidebar
3. Click "Add Category" card
4. Fill in the form:
   - **Category Name**: e.g., "Animals", "Colors", "Numbers"
   - **Item Name**: e.g., "Lion", "Red", "One"
   - **Upload Photo**: Click upload area, select image (max 5MB)
   - **Record Voice**: Click "Start Recording", speak, click "Stop Recording"
5. Review all fields
6. Click "Post Category"
7. Success! Category is created

### 3. Navigation
- **Dashboard**: Overview and statistics
- **Students**: Manage student records
- **Courses**: Manage learning courses
- **Analytics**: View performance data
- **Customization**: Add/manage content
- **Logout**: Sign out from sidebar footer

## 🎯 Key Components

### Voice Recording Feature
- Uses browser's MediaRecorder API
- Real-time recording with visual feedback
- Audio playback before submission
- Remove and re-record functionality

### Image Upload
- Drag and drop support
- Image preview before upload
- File size validation (5MB limit)
- Remove and replace functionality

### Form Validation
- Required field checking
- Real-time error messages
- Prevents submission with missing data
- Visual error indicators

## 🌈 Design Features

- **Modern UI**: Clean, colorful interface perfect for education
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Gradient Themes**: Beautiful purple/blue gradient accents
- **Smooth Animations**: Fade-ins, hover effects, transitions
- **Interactive Elements**: Progress bars, charts, cards
- **Emoji Icons**: Friendly, kid-appropriate design

## 🔧 Technologies Used

- **React 18**: Modern React with hooks
- **Vite**: Fast build tool and dev server
- **React Router**: Client-side routing
- **Context API**: State management
- **CSS3**: Modern styling with variables
- **MediaRecorder API**: Voice recording
- **FileReader API**: Image preview

## 📝 Development Notes

### Adding New Pages
1. Create component in `src/pages/`
2. Add route in `App.jsx`
3. Add menu item in `Sidebar.jsx`

### Protecting Routes
Wrap routes with `<ProtectedRoute>` component to require authentication.

### Styling
- Global styles in `index.css`
- Component styles in respective `.css` files
- CSS variables defined in `:root`

## 🚀 Deployment

```bash
# Build for production
npm run build

# Files will be in dist/ folder
# Deploy dist/ folder to your hosting service
```

## 📄 License

This project is for educational purposes.

## 👨‍💻 Author

Built for Kids Learning Platform Admin Management

---

**Current Status**: ✅ Fully functional with authentication, customization, and category management system.
