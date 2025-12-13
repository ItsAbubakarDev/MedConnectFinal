# HealthCare Frontend

A modern, responsive React application for managing medical appointments and health records.

## Features

- User authentication (Login/Register) for both patients and doctors
- Patient Dashboard with appointment management
- Doctor search and appointment booking
- Medical records management
- Doctor Dashboard with appointment tracking
- Availability management for doctors
- Responsive design with modern UI
- Clean color palette (navy blue, grey, white, black)

## Tech Stack

- React 19
- React Router for navigation
- Axios for API calls
- Vite for build tooling
- Modern CSS with custom properties

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

3. Update the `.env` file with your backend API URL

### Development

Run the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build

Build for production:
```bash
npm run build
```

The built files will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── auth/          # Authentication components
│   └── common/        # Reusable UI components
├── context/           # React context (AuthContext)
├── pages/
│   ├── patient/       # Patient-specific pages
│   └── doctor/        # Doctor-specific pages
├── services/          # API service modules
├── App.jsx            # Main app component with routing
├── main.jsx           # Application entry point
└── index.css          # Global styles
```

## Available Routes

### Public Routes
- `/` - Home page
- `/login` - Login page
- `/register` - Registration page

### Patient Routes
- `/patient/dashboard` - Patient dashboard
- `/patient/search-doctors` - Search for doctors
- `/patient/book-appointment/:doctorId` - Book an appointment
- `/patient/medical-records` - View medical records

### Doctor Routes
- `/doctor/dashboard` - Doctor dashboard
- `/doctor/appointments` - View appointments
- `/doctor/availability` - Manage availability

## API Integration

The frontend communicates with the backend API through axios. All API calls are centralized in the `services/` directory:

- `api.js` - Base API configuration with interceptors
- `authService.js` - Authentication endpoints
- `appointmentService.js` - Appointment management
- `doctorService.js` - Doctor search and information
- `medicalRecordService.js` - Medical records management
- `availabilityService.js` - Doctor availability management

## Styling

The application uses a modern design system with:
- Navy blue primary color (#1e3a8a)
- Grey accents (#6b7280)
- White backgrounds (#ffffff)
- Black text (#111827)
- Responsive breakpoints for mobile, tablet, and desktop
- Smooth transitions and hover effects
- Card-based layouts with shadows

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Create a pull request

## License

MIT
