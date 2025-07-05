import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Button,
  Avatar,
  Menu,
  MenuItem,
  Chip,
  Tooltip,
  Badge,
} from '@mui/material';
import {
  Menu as MenuIcon,
  AccountBalanceWallet,
  Logout,
  Settings,
  Person,
  Notifications,
  ContentCopy,
} from '@mui/icons-material';
import { useWeb3 } from '../../context/Web3Context';
import toast from 'react-hot-toast';

const Navbar = ({ onMenuClick }) => {
  const { 
    isConnected, 
    userInfo, 
    accounts, 
    disconnectWallet,
    loading 
  } = useWeb3();
  
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchor, setNotificationAnchor] = useState(null);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationOpen = (event) => {
    setNotificationAnchor(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchor(null);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Address copied to clipboard!');
  };

  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const handleDisconnect = async () => {
    handleProfileMenuClose();
    await disconnectWallet();
  };

  return (
    <AppBar 
      position="sticky" 
      elevation={0}
      sx={{ 
        backgroundColor: 'background.paper',
        borderBottom: '1px solid',
        borderBottomColor: 'divider',
        zIndex: 1200,
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', px: 3 }}>
        {/* Left Section */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={onMenuClick}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              fontWeight: 600,
              background: 'linear-gradient(45deg, #3f51b5 30%, #f50057 90%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            DeFi Custody Platform
          </Typography>
        </Box>

        {/* Right Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {isConnected ? (
            <>
              {/* Network Status */}
              <Chip
                label="Sepolia"
                size="small"
                color="success"
                variant="outlined"
                sx={{
                  borderColor: 'success.main',
                  color: 'success.main',
                  '& .MuiChip-label': {
                    fontSize: '0.75rem',
                    fontWeight: 600,
                  },
                }}
              />

              {/* Wallet Address */}
              {accounts[0] && (
                <Tooltip title="Click to copy address">
                  <Chip
                    icon={<AccountBalanceWallet sx={{ fontSize: 16 }} />}
                    label={formatAddress(accounts[0])}
                    onClick={() => copyToClipboard(accounts[0])}
                    sx={{
                      cursor: 'pointer',
                      backgroundColor: 'rgba(63, 81, 181, 0.1)',
                      border: '1px solid rgba(63, 81, 181, 0.3)',
                      color: 'primary.main',
                      '&:hover': {
                        backgroundColor: 'rgba(63, 81, 181, 0.2)',
                      },
                    }}
                  />
                </Tooltip>
              )}

              {/* Notifications */}
              <Tooltip title="Notifications">
                <IconButton
                  color="inherit"
                  onClick={handleNotificationOpen}
                  sx={{ color: 'text.primary' }}
                >
                  <Badge badgeContent={2} color="error">
                    <Notifications />
                  </Badge>
                </IconButton>
              </Tooltip>

              {/* Profile Menu */}
              <Tooltip title="Account">
                <IconButton
                  onClick={handleProfileMenuOpen}
                  sx={{ p: 0 }}
                >
                  <Avatar
                    src={userInfo?.profileImage}
                    alt={userInfo?.name || 'User'}
                    sx={{
                      width: 36,
                      height: 36,
                      border: '2px solid',
                      borderColor: 'primary.main',
                    }}
                  >
                    {userInfo?.name?.charAt(0) || 'U'}
                  </Avatar>
                </IconButton>
              </Tooltip>

              {/* Profile Menu Dropdown */}
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleProfileMenuClose}
                onClick={handleProfileMenuClose}
                PaperProps={{
                  elevation: 3,
                  sx: {
                    mt: 1.5,
                    minWidth: 200,
                    backgroundColor: 'background.paper',
                    border: '1px solid',
                    borderColor: 'divider',
                    '& .MuiMenuItem-root': {
                      px: 2,
                      py: 1,
                    },
                  },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                {/* User Info */}
                <Box sx={{ px: 2, py: 1, borderBottom: '1px solid', borderBottomColor: 'divider' }}>
                  <Typography variant="subtitle2" color="text.primary">
                    {userInfo?.name || 'Anonymous User'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {userInfo?.email || 'No email provided'}
                  </Typography>
                </Box>

                <MenuItem onClick={() => {/* Navigate to profile */}}>
                  <Person sx={{ mr: 2, fontSize: 20 }} />
                  Profile
                </MenuItem>
                
                <MenuItem onClick={() => {/* Navigate to settings */}}>
                  <Settings sx={{ mr: 2, fontSize: 20 }} />
                  Settings
                </MenuItem>
                
                <MenuItem 
                  onClick={handleDisconnect}
                  sx={{ 
                    color: 'error.main',
                    '&:hover': {
                      backgroundColor: 'rgba(244, 67, 54, 0.1)',
                    },
                  }}
                >
                  <Logout sx={{ mr: 2, fontSize: 20 }} />
                  Disconnect
                </MenuItem>
              </Menu>

              {/* Notifications Menu */}
              <Menu
                anchorEl={notificationAnchor}
                open={Boolean(notificationAnchor)}
                onClose={handleNotificationClose}
                PaperProps={{
                  elevation: 3,
                  sx: {
                    mt: 1.5,
                    minWidth: 300,
                    maxHeight: 400,
                    backgroundColor: 'background.paper',
                    border: '1px solid',
                    borderColor: 'divider',
                  },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                <Box sx={{ p: 2, borderBottom: '1px solid', borderBottomColor: 'divider' }}>
                  <Typography variant="h6" color="text.primary">
                    Notifications
                  </Typography>
                </Box>
                
                <MenuItem>
                  <Box>
                    <Typography variant="body2" color="text.primary">
                      Flash loan completed successfully
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      2 minutes ago
                    </Typography>
                  </Box>
                </MenuItem>
                
                <MenuItem>
                  <Box>
                    <Typography variant="body2" color="text.primary">
                      New asset registered
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      1 hour ago
                    </Typography>
                  </Box>
                </MenuItem>
                
                <Box sx={{ p: 2, textAlign: 'center', borderTop: '1px solid', borderTopColor: 'divider' }}>
                  <Button size="small" variant="outlined">
                    View All
                  </Button>
                </Box>
              </Menu>
            </>
          ) : (
            // Not connected state
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Chip
                label="Not Connected"
                size="small"
                color="error"
                variant="outlined"
              />
            </Box>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;