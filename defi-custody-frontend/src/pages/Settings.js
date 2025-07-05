import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Tab,
  Tabs,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Tooltip,
  Alert,
  Chip,
  Avatar,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
  Fade,
  Grow,
} from '@mui/material';
import {
  Person,
  Security,
  Notifications,
  Build,
  Info,
  Edit,
  Save,
  Refresh,
  Warning,
  CheckCircle,
  VpnKey,
  Shield,
  Language,
  Palette,
  Storage,
  Code,
  Launch,
  ContentCopy,
  Delete,
  Close,
} from '@mui/icons-material';
import { useWeb3 } from '../context/Web3Context';
import { CONTRACT_ADDRESSES, NETWORK_CONFIG } from '../config/contracts';
import toast from 'react-hot-toast';

const Settings = () => {
  const {
    userInfo,
    accounts,
    isConnected,
    disconnectWallet,
    CONTRACT_ADDRESSES: contractAddresses,
  } = useWeb3();

  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState('');

  // User settings state
  const [userSettings, setUserSettings] = useState({
    displayName: '',
    email: '',
    language: 'en',
    theme: 'dark',
    currency: 'USD',
    timezone: 'UTC',
  });

  // Security settings state
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorEnabled: false,
    biometricEnabled: false,
    sessionTimeout: 30,
    autoLockEnabled: true,
  });

  // Notification settings state
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    transactionAlerts: true,
    priceAlerts: true,
    securityAlerts: true,
    marketingEmails: false,
  });

  // Contract settings state
  const [contractSettings, setContractSettings] = useState({
    slippageTolerance: 3,
    gasLimit: 'auto',
    maxGasPrice: 50,
    defaultProvider: 'auto',
  });

  const tabContent = [
    { label: 'Profile', icon: <Person /> },
    { label: 'Security', icon: <Security /> },
    { label: 'Notifications', icon: <Notifications /> },
    { label: 'Contracts', icon: <Build /> },
    { label: 'About', icon: <Info /> },
  ];

  const languageOptions = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Español' },
    { value: 'fr', label: 'Français' },
    { value: 'de', label: 'Deutsch' },
    { value: 'zh', label: '中文' },
    { value: 'ja', label: '日本語' },
  ];

  const currencyOptions = [
    { value: 'USD', label: 'US Dollar ($)' },
    { value: 'EUR', label: 'Euro (€)' },
    { value: 'GBP', label: 'British Pound (£)' },
    { value: 'JPY', label: 'Japanese Yen (¥)' },
  ];

  const themeOptions = [
    { value: 'dark', label: 'Dark Mode' },
    { value: 'light', label: 'Light Mode' },
    { value: 'auto', label: 'Auto (System)' },
  ];

  useEffect(() => {
    if (isConnected && userInfo) {
      setUserSettings({
        displayName: userInfo.name || '',
        email: userInfo.email || '',
        language: 'en',
        theme: 'dark',
        currency: 'USD',
        timezone: 'UTC',
      });
    }
  }, [isConnected, userInfo]);

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      // In a real app, you would save these settings to a backend or local storage
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Profile settings saved successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Failed to save profile settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSecurity = async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Security settings updated successfully!');
    } catch (error) {
      console.error('Error saving security settings:', error);
      toast.error('Failed to save security settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNotifications = async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Notification preferences saved successfully!');
    } catch (error) {
      console.error('Error saving notifications:', error);
      toast.error('Failed to save notification settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveContracts = async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Contract settings updated successfully!');
    } catch (error) {
      console.error('Error saving contract settings:', error);
      toast.error('Failed to save contract settings');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyAddress = (address) => {
    navigator.clipboard.writeText(address);
    toast.success('Address copied to clipboard!');
  };

  const handleExportSettings = () => {
    const settings = {
      userSettings,
      securitySettings,
      notificationSettings,
      contractSettings,
    };
    
    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'defi-custody-settings.json';
    link.click();
    URL.revokeObjectURL(url);
    
    toast.success('Settings exported successfully!');
  };

  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 8)}...${address.slice(-6)}`;
  };

  if (!isConnected) {
    return (
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Card sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            Please connect your wallet to access settings
          </Typography>
        </Card>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, color: 'text.primary', mb: 1 }}>
          Settings
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your account preferences and application settings
        </Typography>
      </Box>

      {/* Main Content */}
      <Grid container spacing={3}>
        {/* Sidebar Tabs */}
        <Grid item xs={12} md={3}>
          <Card sx={{ p: 0 }}>
            <Tabs
              orientation="vertical"
              value={activeTab}
              onChange={(e, newValue) => setActiveTab(newValue)}
              sx={{
                '& .MuiTab-root': {
                  textTransform: 'none',
                  alignItems: 'flex-start',
                  justifyContent: 'flex-start',
                  minHeight: 60,
                  px: 3,
                  py: 2,
                },
              }}
            >
              {tabContent.map((tab, index) => (
                <Tab
                  key={index}
                  icon={tab.icon}
                  label={tab.label}
                  iconPosition="start"
                  sx={{
                    '& .MuiTab-iconWrapper': {
                      mr: 2,
                    },
                  }}
                />
              ))}
            </Tabs>
          </Card>
        </Grid>

        {/* Content Area */}
        <Grid item xs={12} md={9}>
          {/* Profile Tab */}
          {activeTab === 0 && (
            <Fade in timeout={600}>
              <Card sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Profile Settings
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<Save />}
                    onClick={handleSaveProfile}
                    disabled={loading}
                    sx={{
                      background: 'linear-gradient(45deg, #3f51b5 30%, #f50057 90%)',
                    }}
                  >
                    Save Changes
                  </Button>
                </Box>

                <Grid container spacing={3}>
                  {/* Profile Picture & Basic Info */}
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3 }}>
                      <Avatar
                        src={userInfo?.profileImage}
                        sx={{ width: 80, height: 80, border: '2px solid', borderColor: 'primary.main' }}
                      >
                        {userInfo?.name?.charAt(0) || 'U'}
                      </Avatar>
                      <Box>
                        <Typography variant="h6" gutterBottom>
                          {userInfo?.name || 'Anonymous User'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Connected via {userInfo?.typeOfLogin || 'Web3Auth'}
                        </Typography>
                        <Chip
                          label={accounts[0] ? formatAddress(accounts[0]) : 'No Address'}
                          size="small"
                          onClick={() => handleCopyAddress(accounts[0])}
                          sx={{ cursor: 'pointer' }}
                        />
                      </Box>
                    </Box>
                    <Divider />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Display Name"
                      value={userSettings.displayName}
                      onChange={(e) => setUserSettings({ ...userSettings, displayName: e.target.value })}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Email Address"
                      type="email"
                      value={userSettings.email}
                      onChange={(e) => setUserSettings({ ...userSettings, email: e.target.value })}
                      disabled
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Language</InputLabel>
                      <Select
                        value={userSettings.language}
                        onChange={(e) => setUserSettings({ ...userSettings, language: e.target.value })}
                        label="Language"
                      >
                        {languageOptions.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Currency</InputLabel>
                      <Select
                        value={userSettings.currency}
                        onChange={(e) => setUserSettings({ ...userSettings, currency: e.target.value })}
                        label="Currency"
                      >
                        {currencyOptions.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Theme</InputLabel>
                      <Select
                        value={userSettings.theme}
                        onChange={(e) => setUserSettings({ ...userSettings, theme: e.target.value })}
                        label="Theme"
                      >
                        {themeOptions.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Timezone"
                      value={userSettings.timezone}
                      onChange={(e) => setUserSettings({ ...userSettings, timezone: e.target.value })}
                    />
                  </Grid>
                </Grid>
              </Card>
            </Fade>
          )}

          {/* Security Tab */}
          {activeTab === 1 && (
            <Fade in timeout={600}>
              <Card sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Security Settings
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<Save />}
                    onClick={handleSaveSecurity}
                    disabled={loading}
                    sx={{
                      background: 'linear-gradient(45deg, #3f51b5 30%, #f50057 90%)',
                    }}
                  >
                    Save Changes
                  </Button>
                </Box>

                <List>
                  <ListItem>
                    <ListItemText
                      primary="Two-Factor Authentication"
                      secondary="Add an extra layer of security to your account"
                    />
                    <ListItemSecondaryAction>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={securitySettings.twoFactorEnabled}
                            onChange={(e) => setSecuritySettings({
                              ...securitySettings,
                              twoFactorEnabled: e.target.checked
                            })}
                            color="primary"
                          />
                        }
                        label=""
                      />
                    </ListItemSecondaryAction>
                  </ListItem>

                  <Divider />

                  <ListItem>
                    <ListItemText
                      primary="Biometric Authentication"
                      secondary="Use fingerprint or face recognition for quick access"
                    />
                    <ListItemSecondaryAction>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={securitySettings.biometricEnabled}
                            onChange={(e) => setSecuritySettings({
                              ...securitySettings,
                              biometricEnabled: e.target.checked
                            })}
                            color="primary"
                          />
                        }
                        label=""
                      />
                    </ListItemSecondaryAction>
                  </ListItem>

                  <Divider />

                  <ListItem>
                    <ListItemText
                      primary="Auto-Lock"
                      secondary="Automatically lock the application when inactive"
                    />
                    <ListItemSecondaryAction>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={securitySettings.autoLockEnabled}
                            onChange={(e) => setSecuritySettings({
                              ...securitySettings,
                              autoLockEnabled: e.target.checked
                            })}
                            color="primary"
                          />
                        }
                        label=""
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                </List>

                <Box sx={{ mt: 3 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Session Timeout (minutes)
                  </Typography>
                  <TextField
                    type="number"
                    value={securitySettings.sessionTimeout}
                    onChange={(e) => setSecuritySettings({
                      ...securitySettings,
                      sessionTimeout: parseInt(e.target.value)
                    })}
                    sx={{ width: 200 }}
                    inputProps={{ min: 5, max: 120 }}
                  />
                </Box>

                <Alert severity="info" sx={{ mt: 3 }}>
                  <Typography variant="body2">
                    Your private keys are secured by Web3Auth and never stored on our servers.
                    We recommend enabling two-factor authentication for additional security.
                  </Typography>
                </Alert>
              </Card>
            </Fade>
          )}

          {/* Notifications Tab */}
          {activeTab === 2 && (
            <Fade in timeout={600}>
              <Card sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Notification Preferences
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<Save />}
                    onClick={handleSaveNotifications}
                    disabled={loading}
                    sx={{
                      background: 'linear-gradient(45deg, #3f51b5 30%, #f50057 90%)',
                    }}
                  >
                    Save Changes
                  </Button>
                </Box>

                <List>
                  <ListItem>
                    <ListItemText
                      primary="Email Notifications"
                      secondary="Receive important updates via email"
                    />
                    <ListItemSecondaryAction>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={notificationSettings.emailNotifications}
                            onChange={(e) => setNotificationSettings({
                              ...notificationSettings,
                              emailNotifications: e.target.checked
                            })}
                            color="primary"
                          />
                        }
                        label=""
                      />
                    </ListItemSecondaryAction>
                  </ListItem>

                  <Divider />

                  <ListItem>
                    <ListItemText
                      primary="Transaction Alerts"
                      secondary="Get notified when transactions are completed"
                    />
                    <ListItemSecondaryAction>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={notificationSettings.transactionAlerts}
                            onChange={(e) => setNotificationSettings({
                              ...notificationSettings,
                              transactionAlerts: e.target.checked
                            })}
                            color="primary"
                          />
                        }
                        label=""
                      />
                    </ListItemSecondaryAction>
                  </ListItem>

                  <Divider />

                  <ListItem>
                    <ListItemText
                      primary="Price Alerts"
                      secondary="Receive alerts when asset prices change significantly"
                    />
                    <ListItemSecondaryAction>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={notificationSettings.priceAlerts}
                            onChange={(e) => setNotificationSettings({
                              ...notificationSettings,
                              priceAlerts: e.target.checked
                            })}
                            color="primary"
                          />
                        }
                        label=""
                      />
                    </ListItemSecondaryAction>
                  </ListItem>

                  <Divider />

                  <ListItem>
                    <ListItemText
                      primary="Security Alerts"
                      secondary="Important security notifications and warnings"
                    />
                    <ListItemSecondaryAction>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={notificationSettings.securityAlerts}
                            onChange={(e) => setNotificationSettings({
                              ...notificationSettings,
                              securityAlerts: e.target.checked
                            })}
                            color="primary"
                            disabled
                          />
                        }
                        label=""
                      />
                    </ListItemSecondaryAction>
                  </ListItem>

                  <Divider />

                  <ListItem>
                    <ListItemText
                      primary="Marketing Emails"
                      secondary="Receive updates about new features and promotions"
                    />
                    <ListItemSecondaryAction>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={notificationSettings.marketingEmails}
                            onChange={(e) => setNotificationSettings({
                              ...notificationSettings,
                              marketingEmails: e.target.checked
                            })}
                            color="primary"
                          />
                        }
                        label=""
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                </List>
              </Card>
            </Fade>
          )}

          {/* Contracts Tab */}
          {activeTab === 3 && (
            <Fade in timeout={600}>
              <Card sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Contract Settings
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<Save />}
                    onClick={handleSaveContracts}
                    disabled={loading}
                    sx={{
                      background: 'linear-gradient(45deg, #3f51b5 30%, #f50057 90%)',
                    }}
                  >
                    Save Changes
                  </Button>
                </Box>

                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" gutterBottom>
                      Contract Addresses
                    </Typography>
                    <Paper sx={{ p: 2, bgcolor: 'background.default' }}>
                      {Object.entries(CONTRACT_ADDRESSES).map(([name, address]) => (
                        <Box key={name} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {name.replace(/_/g, ' ')}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Chip
                              label={formatAddress(address)}
                              size="small"
                              variant="outlined"
                            />
                            <Tooltip title="Copy Address">
                              <IconButton size="small" onClick={() => handleCopyAddress(address)}>
                                <ContentCopy sx={{ fontSize: 16 }} />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="View on Explorer">
                              <IconButton size="small">
                                <Launch sx={{ fontSize: 16 }} />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </Box>
                      ))}
                    </Paper>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Slippage Tolerance (%)"
                      type="number"
                      value={contractSettings.slippageTolerance}
                      onChange={(e) => setContractSettings({
                        ...contractSettings,
                        slippageTolerance: parseFloat(e.target.value)
                      })}
                      inputProps={{ min: 0.1, max: 10, step: 0.1 }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Max Gas Price (Gwei)"
                      type="number"
                      value={contractSettings.maxGasPrice}
                      onChange={(e) => setContractSettings({
                        ...contractSettings,
                        maxGasPrice: parseInt(e.target.value)
                      })}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Default Flash Loan Provider</InputLabel>
                      <Select
                        value={contractSettings.defaultProvider}
                        onChange={(e) => setContractSettings({
                          ...contractSettings,
                          defaultProvider: e.target.value
                        })}
                        label="Default Flash Loan Provider"
                      >
                        <MenuItem value="auto">Auto (Best Rate)</MenuItem>
                        <MenuItem value="aave">Aave V3</MenuItem>
                        <MenuItem value="balancer">Balancer V2</MenuItem>
                        <MenuItem value="uniswap">Uniswap V3</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Gas Limit</InputLabel>
                      <Select
                        value={contractSettings.gasLimit}
                        onChange={(e) => setContractSettings({
                          ...contractSettings,
                          gasLimit: e.target.value
                        })}
                        label="Gas Limit"
                      >
                        <MenuItem value="auto">Auto Estimate</MenuItem>
                        <MenuItem value="conservative">Conservative (+20%)</MenuItem>
                        <MenuItem value="custom">Custom</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>

                <Alert severity="warning" sx={{ mt: 3 }}>
                  <Typography variant="body2">
                    Contract settings affect transaction costs and execution. 
                    Only modify these settings if you understand the implications.
                  </Typography>
                </Alert>
              </Card>
            </Fade>
          )}

          {/* About Tab */}
          {activeTab === 4 && (
            <Fade in timeout={600}>
              <Card sx={{ p: 4 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 4 }}>
                  About DeFi Custody Platform
                </Typography>

                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3, bgcolor: 'background.default' }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Application Information
                      </Typography>
                      
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" color="text.secondary">Version</Typography>
                          <Typography variant="body2">v1.0.0</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" color="text.secondary">Network</Typography>
                          <Chip label="Sepolia Testnet" size="small" color="success" />
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" color="text.secondary">Chain ID</Typography>
                          <Typography variant="body2">{NETWORK_CONFIG.chainId}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" color="text.secondary">Last Updated</Typography>
                          <Typography variant="body2">July 2024</Typography>
                        </Box>
                      </Box>
                    </Paper>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3, bgcolor: 'background.default' }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Quick Actions
                      </Typography>
                      
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Button
                          variant="outlined"
                          startIcon={<Storage />}
                          onClick={handleExportSettings}
                          fullWidth
                        >
                          Export Settings
                        </Button>
                        
                        <Button
                          variant="outlined"
                          startIcon={<Code />}
                          fullWidth
                        >
                          Developer Documentation
                        </Button>
                        
                        <Button
                          variant="outlined"
                          startIcon={<Launch />}
                          fullWidth
                        >
                          View Source Code
                        </Button>
                        
                        <Button
                          variant="outlined"
                          color="error"
                          startIcon={<VpnKey />}
                          onClick={disconnectWallet}
                          fullWidth
                        >
                          Disconnect Wallet
                        </Button>
                      </Box>
                    </Paper>
                  </Grid>

                  <Grid item xs={12}>
                    <Alert severity="info">
                      <Typography variant="body2">
                        DeFi Custody Platform is a comprehensive solution for managing real-world assets
                        on the blockchain with built-in compliance tracking and flash loan aggregation.
                        This platform is designed for institutional and individual users who require
                        secure, compliant, and efficient DeFi operations.
                      </Typography>
                    </Alert>
                  </Grid>
                </Grid>
              </Card>
            </Fade>
          )}
        </Grid>
      </Grid>

      {/* Loading Overlay */}
      {loading && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
          }}
        >
          <Paper sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
            <LinearProgress sx={{ width: 200 }} />
            <Typography>Saving settings...</Typography>
          </Paper>
        </Box>
      )}
    </Container>
  );
};

export default Settings;