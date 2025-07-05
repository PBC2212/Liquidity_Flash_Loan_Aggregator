import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Box } from '@mui/material';
import { Toaster } from 'react-hot-toast';

// Context Providers
import { Web3Provider } from './context/SimpleWeb3Context';

// Components
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import LoadingScreen from './components/common/LoadingScreen';

// Pages
import Dashboard from './pages/Dashboard';
import AssetRegistry from './pages/AssetRegistry';
import FlashLoans from './pages/FlashLoans';
import Portfolio from './pages/Portfolio';
import Settings from './pages/Settings';
import LandingPage from './pages/LandingPage';

// Hooks
import { useWeb3 } from './context/SimpleWeb3Context';

// Create dark theme
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#3f51b5',
      light: '#6573c3',
      dark: '#2c387e',
    },
    secondary: {
      main: '#f50057',
      light: '#f73378',
      dark: '#ab003c',
    },
    background: {
      default: '#0a0a0a',
      paper: '#1a1a1a',
    },
    text: {
      primary: '#ffffff',
      secondary: '#b3b3b3',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#1a1a1a',
          border: '1px solid #333',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: '#333',
            },
            '&:hover fieldset': {
              borderColor: '#555',
            },
          },
        },
      },
    },
  },
});

// Main App Layout Component
const AppLayout = ({ children }) => {
  const { isConnected, loading } = useWeb3();
  const [sidebarOpen, setSidebarOpen] = React.useState(true);

  if (loading) {
    return <LoadingScreen />;
  }

  if (!isConnected) {
    return <LandingPage />;
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          display: 'flex', 
          flexDirection: 'column',
          ml: sidebarOpen ? '240px' : '60px',
          transition: 'margin-left 0.3s ease-in-out'
        }}
      >
        <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <Box sx={{ flexGrow: 1, p: 3, backgroundColor: 'background.default' }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};

// Main App Component
const App = () => {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Web3Provider>
        <Router>
          <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
            <Routes>
              <Route path="/" element={
                <AppLayout>
                  <Dashboard />
                </AppLayout>
              } />
              <Route path="/dashboard" element={
                <AppLayout>
                  <Dashboard />
                </AppLayout>
              } />
              <Route path="/assets" element={
                <AppLayout>
                  <AssetRegistry />
                </AppLayout>
              } />
              <Route path="/flash-loans" element={
                <AppLayout>
                  <FlashLoans />
                </AppLayout>
              } />
              <Route path="/portfolio" element={
                <AppLayout>
                  <Portfolio />
                </AppLayout>
              } />
              <Route path="/settings" element={
                <AppLayout>
                  <Settings />
                </AppLayout>
              } />
            </Routes>
            
            <Toaster
              position="bottom-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#1a1a1a',
                  color: '#fff',
                  border: '1px solid #333',
                },
              }}
            />
          </Box>
        </Router>
      </Web3Provider>
    </ThemeProvider>
  );
};

export default App;