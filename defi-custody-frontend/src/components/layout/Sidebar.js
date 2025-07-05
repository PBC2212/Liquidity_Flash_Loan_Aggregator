import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Divider,
  IconButton,
  Tooltip,
  Chip,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  AccountBalance as AssetIcon,
  FlashOn as FlashIcon,
  Portfolio as PortfolioIcon,
  Settings as SettingsIcon,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Security,
  Assessment,
} from '@mui/icons-material';

const drawerWidth = 240;
const collapsedWidth = 60;

const navigationItems = [
  {
    title: 'Dashboard',
    path: '/dashboard',
    icon: <DashboardIcon />,
    description: 'Overview & Analytics',
  },
  {
    title: 'Asset Registry',
    path: '/assets',
    icon: <AssetIcon />,
    description: 'Manage RWA Tokens',
    badge: 'New',
  },
  {
    title: 'Flash Loans',
    path: '/flash-loans',
    icon: <FlashIcon />,
    description: 'Liquidity Aggregation',
  },
  {
    title: 'Portfolio',
    path: '/portfolio',
    icon: <PortfolioIcon />,
    description: 'Your Holdings',
  },
  {
    title: 'Settings',
    path: '/settings',
    icon: <SettingsIcon />,
    description: 'Configuration',
  },
];

const Sidebar = ({ open, onToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path) => {
    navigate(path);
  };

  const isActive = (path) => {
    return location.pathname === path || (path === '/dashboard' && location.pathname === '/');
  };

  return (
    <Drawer
      variant="permanent"
      open={open}
      sx={{
        width: open ? drawerWidth : collapsedWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        transition: 'width 0.3s ease-in-out',
        '& .MuiDrawer-paper': {
          width: open ? drawerWidth : collapsedWidth,
          overflowX: 'hidden',
          transition: 'width 0.3s ease-in-out',
          backgroundColor: 'background.paper',
          borderRight: '1px solid',
          borderRightColor: 'divider',
          boxShadow: '0 0 20px rgba(0,0,0,0.1)',
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: open ? 'space-between' : 'center',
          p: 2,
          minHeight: 64,
          borderBottom: '1px solid',
          borderBottomColor: 'divider',
        }}
      >
        {open && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: 'linear-gradient(45deg, #3f51b5 30%, #f50057 90%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  color: 'white',
                  fontWeight: 'bold',
                }}
              >
                DC
              </Typography>
            </Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                background: 'linear-gradient(45deg, #3f51b5 30%, #f50057 90%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontSize: '1rem',
              }}
            >
              DeFi Custody
            </Typography>
          </Box>
        )}
        
        <IconButton onClick={onToggle} size="small">
          {open ? <ChevronLeft /> : <ChevronRight />}
        </IconButton>
      </Box>

      {/* Navigation */}
      <List sx={{ pt: 1, px: 1 }}>
        {navigationItems.map((item) => (
          <ListItem key={item.path} disablePadding sx={{ display: 'block', mb: 0.5 }}>
            <Tooltip 
              title={!open ? item.title : ''} 
              placement="right"
              arrow
            >
              <ListItemButton
                onClick={() => handleNavigation(item.path)}
                selected={isActive(item.path)}
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                  borderRadius: 2,
                  mx: 0.5,
                  transition: 'all 0.2s ease-in-out',
                  '&.Mui-selected': {
                    backgroundColor: 'primary.main',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'primary.dark',
                    },
                    '& .MuiListItemIcon-root': {
                      color: 'white',
                    },
                  },
                  '&:hover': {
                    backgroundColor: isActive(item.path) ? 'primary.dark' : 'action.hover',
                    transform: 'translateX(4px)',
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                    color: isActive(item.path) ? 'white' : 'text.secondary',
                    transition: 'color 0.2s ease-in-out',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                
                {open && (
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                    <Box>
                      <ListItemText
                        primary={item.title}
                        secondary={item.description}
                        primaryTypographyProps={{
                          fontSize: '0.875rem',
                          fontWeight: isActive(item.path) ? 600 : 500,
                          color: isActive(item.path) ? 'white' : 'text.primary',
                        }}
                        secondaryTypographyProps={{
                          fontSize: '0.75rem',
                          color: isActive(item.path) ? 'rgba(255,255,255,0.7)' : 'text.secondary',
                        }}
                      />
                    </Box>
                    {item.badge && (
                      <Chip
                        label={item.badge}
                        size="small"
                        sx={{
                          height: 20,
                          fontSize: '0.6rem',
                          backgroundColor: isActive(item.path) ? 'rgba(255,255,255,0.2)' : 'secondary.main',
                          color: isActive(item.path) ? 'white' : 'white',
                        }}
                      />
                    )}
                  </Box>
                )}
              </ListItemButton>
            </Tooltip>
          </ListItem>
        ))}
      </List>

      <Divider sx={{ mx: 2, my: 2 }} />

      {/* Quick Stats Section (when expanded) */}
      {open && (
        <Box sx={{ px: 2, pb: 2 }}>
          <Typography
            variant="caption"
            sx={{
              color: 'text.secondary',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: 1,
              mb: 1,
              display: 'block',
            }}
          >
            Quick Stats
          </Typography>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Box
              sx={{
                p: 1.5,
                borderRadius: 2,
                backgroundColor: 'rgba(63, 81, 181, 0.1)',
                border: '1px solid rgba(63, 81, 181, 0.2)',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                <TrendingUp sx={{ fontSize: 16, color: 'primary.main' }} />
                <Typography variant="caption" color="text.secondary">
                  Total Value
                </Typography>
              </Box>
              <Typography variant="h6" color="primary.main" sx={{ fontWeight: 600 }}>
                $0.00
              </Typography>
            </Box>

            <Box
              sx={{
                p: 1.5,
                borderRadius: 2,
                backgroundColor: 'rgba(245, 0, 87, 0.1)',
                border: '1px solid rgba(245, 0, 87, 0.2)',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                <Security sx={{ fontSize: 16, color: 'secondary.main' }} />
                <Typography variant="caption" color="text.secondary">
                  Assets
                </Typography>
              </Box>
              <Typography variant="h6" color="secondary.main" sx={{ fontWeight: 600 }}>
                0
              </Typography>
            </Box>

            <Box
              sx={{
                p: 1.5,
                borderRadius: 2,
                backgroundColor: 'rgba(76, 175, 80, 0.1)',
                border: '1px solid rgba(76, 175, 80, 0.2)',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                <Assessment sx={{ fontSize: 16, color: '#4caf50' }} />
                <Typography variant="caption" color="text.secondary">
                  Loans
                </Typography>
              </Box>
              <Typography variant="h6" sx={{ color: '#4caf50', fontWeight: 600 }}>
                0
              </Typography>
            </Box>
          </Box>
        </Box>
      )}
    </Drawer>
  );
};

export default Sidebar;