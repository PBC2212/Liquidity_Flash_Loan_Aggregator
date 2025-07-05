import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  Avatar,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  LinearProgress,
  Tooltip,
  Fade,
  Grow,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  AccountBalance,
  FlashOn,
  Security,
  Refresh,
  Launch,
  Add,
  MoreVert,
  CheckCircle,
  Warning,
  Error,
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { useWeb3 } from '../context/Web3Context';
import { CONTRACT_ADDRESSES, TOKEN_INFO } from '../config/contracts';

const Dashboard = () => {
  const navigate = useNavigate();
  const { 
    userInfo, 
    accounts, 
    isConnected,
    getTokenPrice,
    getBalance 
  } = useWeb3();

  const [portfolioData, setPortfolioData] = useState({
    totalValue: 0,
    totalAssets: 0,
    totalLoans: 0,
    performance: 0,
  });

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Mock data for demonstration
  const chartData = [
    { name: 'Jan', value: 4000 },
    { name: 'Feb', value: 3000 },
    { name: 'Mar', value: 5000 },
    { name: 'Apr', value: 4500 },
    { name: 'May', value: 6000 },
    { name: 'Jun', value: 5500 },
    { name: 'Jul', value: 7000 },
  ];

  const pieData = [
    { name: 'WETH', value: 45, color: '#3f51b5' },
    { name: 'USDC', value: 30, color: '#f50057' },
    { name: 'LINK', value: 25, color: '#4caf50' },
  ];

  const recentTransactions = [
    {
      id: 1,
      type: 'Flash Loan',
      asset: 'WETH',
      amount: '10.5',
      status: 'Completed',
      timestamp: '2 hours ago',
      hash: '0x123...abc',
    },
    {
      id: 2,
      type: 'Asset Registration',
      asset: 'Real Estate Token',
      amount: '1',
      status: 'Pending',
      timestamp: '5 hours ago',
      hash: '0x456...def',
    },
    {
      id: 3,
      type: 'Collateral Deposit',
      asset: 'USDC',
      amount: '25,000',
      status: 'Completed',
      timestamp: '1 day ago',
      hash: '0x789...ghi',
    },
  ];

  const quickActions = [
    {
      title: 'Register Asset',
      description: 'Add new RWA token',
      icon: <Add />,
      color: '#3f51b5',
      action: () => navigate('/assets'),
    },
    {
      title: 'Flash Loan',
      description: 'Access liquidity',
      icon: <FlashOn />,
      color: '#f50057',
      action: () => navigate('/flash-loans'),
    },
    {
      title: 'View Portfolio',
      description: 'Check holdings',
      icon: <AccountBalance />,
      color: '#4caf50',
      action: () => navigate('/portfolio'),
    },
  ];

  useEffect(() => {
    if (isConnected) {
      loadDashboardData();
    }
  }, [isConnected]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      // Simulate loading data
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real app, you would fetch actual data here
      setPortfolioData({
        totalValue: 125000,
        totalAssets: 5,
        totalLoans: 3,
        performance: 12.5,
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Completed':
        return <CheckCircle sx={{ color: 'success.main', fontSize: 16 }} />;
      case 'Pending':
        return <Warning sx={{ color: 'warning.main', fontSize: 16 }} />;
      case 'Failed':
        return <Error sx={{ color: 'error.main', fontSize: 16 }} />;
      default:
        return null;
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  if (!isConnected) {
    return null;
  }

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 600, color: 'text.primary' }}>
              Welcome back, {userInfo?.name || 'User'}! 👋
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Here's what's happening with your portfolio today.
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={handleRefresh}
              disabled={refreshing}
              sx={{ borderRadius: 2 }}
            >
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </Button>
          </Box>
        </Box>

        {/* Account Info */}
        <Card sx={{ p: 2, mb: 3, background: 'rgba(63, 81, 181, 0.1)', border: '1px solid rgba(63, 81, 181, 0.2)' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              src={userInfo?.profileImage}
              sx={{ width: 50, height: 50, border: '2px solid', borderColor: 'primary.main' }}
            >
              {userInfo?.name?.charAt(0) || 'U'}
            </Avatar>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h6" color="text.primary">
                {accounts[0] ? `${accounts[0].slice(0, 8)}...${accounts[0].slice(-6)}` : 'No account'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Connected via {userInfo?.typeOfLogin || 'Web3Auth'}
              </Typography>
            </Box>
            <Chip label="Sepolia" color="success" size="small" />
          </Box>
        </Card>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Grow in timeout={600}>
            <Card sx={{ p: 2 }}>
              <CardContent sx={{ p: 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2,
                      background: 'linear-gradient(45deg, #3f51b5 30%, #6573c3 90%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <AccountBalance sx={{ color: 'white' }} />
                  </Box>
                  <TrendingUp sx={{ color: 'success.main' }} />
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
                  {loading ? (
                    <LinearProgress sx={{ height: 8, borderRadius: 4 }} />
                  ) : (
                    formatCurrency(portfolioData.totalValue)
                  )}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Portfolio Value
                </Typography>
                <Typography variant="caption" color="success.main" sx={{ fontWeight: 600 }}>
                  +{portfolioData.performance}% this month
                </Typography>
              </CardContent>
            </Card>
          </Grow>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Grow in timeout={800}>
            <Card sx={{ p: 2 }}>
              <CardContent sx={{ p: 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2,
                      background: 'linear-gradient(45deg, #f50057 30%, #f73378 90%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Security sx={{ color: 'white' }} />
                  </Box>
                  <TrendingUp sx={{ color: 'success.main' }} />
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
                  {loading ? (
                    <LinearProgress sx={{ height: 8, borderRadius: 4 }} />
                  ) : (
                    portfolioData.totalAssets
                  )}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Registered Assets
                </Typography>
                <Typography variant="caption" color="success.main" sx={{ fontWeight: 600 }}>
                  2 pending verification
                </Typography>
              </CardContent>
            </Card>
          </Grow>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Grow in timeout={1000}>
            <Card sx={{ p: 2 }}>
              <CardContent sx={{ p: 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2,
                      background: 'linear-gradient(45deg, #4caf50 30%, #66bb6a 90%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <FlashOn sx={{ color: 'white' }} />
                  </Box>
                  <TrendingUp sx={{ color: 'success.main' }} />
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
                  {loading ? (
                    <LinearProgress sx={{ height: 8, borderRadius: 4 }} />
                  ) : (
                    portfolioData.totalLoans
                  )}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Active Flash Loans
                </Typography>
                <Typography variant="caption" color="success.main" sx={{ fontWeight: 600 }}>
                  100% success rate
                </Typography>
              </CardContent>
            </Card>
          </Grow>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Grow in timeout={1200}>
            <Card sx={{ p: 2 }}>
              <CardContent sx={{ p: 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2,
                      background: 'linear-gradient(45deg, #ff9800 30%, #ffb74d 90%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <TrendingUp sx={{ color: 'white' }} />
                  </Box>
                  <TrendingUp sx={{ color: 'success.main' }} />
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 600, mb: 1, color: 'success.main' }}>
                  {loading ? (
                    <LinearProgress sx={{ height: 8, borderRadius: 4 }} />
                  ) : (
                    '+12.5%'
                  )}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  30-Day Performance
                </Typography>
                <Typography variant="caption" color="success.main" sx={{ fontWeight: 600 }}>
                  Outperforming market
                </Typography>
              </CardContent>
            </Card>
          </Grow>
        </Grid>
      </Grid>

      {/* Main Content */}
      <Grid container spacing={3}>
        {/* Portfolio Chart */}
        <Grid item xs={12} lg={8}>
          <Fade in timeout={1400}>
            <Card sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Portfolio Performance
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Chip label="7D" size="small" />
                  <Chip label="1M" size="small" variant="outlined" />
                  <Chip label="3M" size="small" variant="outlined" />
                  <Chip label="1Y" size="small" variant="outlined" />
                </Box>
              </Box>
              
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" />
                    <YAxis stroke="rgba(255,255,255,0.5)" />
                    <RechartsTooltip
                      contentStyle={{
                        backgroundColor: '#1a1a1a',
                        border: '1px solid #333',
                        borderRadius: 8,
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#3f51b5"
                      strokeWidth={3}
                      dot={{ fill: '#3f51b5', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: '#3f51b5', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </Card>
          </Fade>
        </Grid>

        {/* Asset Allocation */}
        <Grid item xs={12} lg={4}>
          <Fade in timeout={1600}>
            <Card sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Asset Allocation
              </Typography>
              
              <Box sx={{ height: 200, mb: 2 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {pieData.map((item) => (
                  <Box key={item.name} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: '50%',
                          backgroundColor: item.color,
                        }}
                      />
                      <Typography variant="body2">{item.name}</Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {item.value}%
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Card>
          </Fade>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} lg={4}>
          <Fade in timeout={1800}>
            <Card sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Quick Actions
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {quickActions.map((action, index) => (
                  <Button
                    key={action.title}
                    variant="outlined"
                    onClick={action.action}
                    sx={{
                      p: 2,
                      justifyContent: 'flex-start',
                      borderColor: action.color,
                      color: action.color,
                      '&:hover': {
                        borderColor: action.color,
                        backgroundColor: `${action.color}20`,
                      },
                    }}
                    startIcon={action.icon}
                  >
                    <Box sx={{ textAlign: 'left', flexGrow: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {action.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {action.description}
                      </Typography>
                    </Box>
                  </Button>
                ))}
              </Box>
            </Card>
          </Fade>
        </Grid>

        {/* Recent Transactions */}
        <Grid item xs={12} lg={8}>
          <Fade in timeout={2000}>
            <Card sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Recent Transactions
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  endIcon={<Launch />}
                  onClick={() => navigate('/portfolio')}
                >
                  View All
                </Button>
              </Box>

              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Type</TableCell>
                      <TableCell>Asset</TableCell>
                      <TableCell>Amount</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Time</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentTransactions.map((tx) => (
                      <TableRow key={tx.id}>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {tx.type}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Avatar sx={{ width: 24, height: 24 }}>
                              {tx.asset.charAt(0)}
                            </Avatar>
                            <Typography variant="body2">{tx.asset}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{tx.amount}</Typography>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {getStatusIcon(tx.status)}
                            <Typography variant="body2">{tx.status}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {tx.timestamp}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Tooltip title="View on Explorer">
                            <IconButton size="small">
                              <Launch sx={{ fontSize: 16 }} />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>
          </Fade>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;