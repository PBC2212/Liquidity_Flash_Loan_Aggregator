import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Chip,
  Avatar,
  LinearProgress,
  Tab,
  Tabs,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Fade,
  Grow,
  Divider,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  SwapHoriz,
  Launch,
  Add,
  Remove,
  Refresh,
  MoreVert,
  AccountBalance,
  Security,
  AttachMoney,
  Timer,
  CheckCircle,
  Warning,
  Close,
} from '@mui/icons-material';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { useWeb3 } from '../context/Web3Context';
import { CONTRACT_ADDRESSES, TOKEN_INFO } from '../config/contracts';
import toast from 'react-hot-toast';

const Portfolio = () => {
  const {
    getBalance,
    getTokenPrice,
    accounts,
    isConnected,
  } = useWeb3();

  const [activeTab, setActiveTab] = useState(0);
  const [portfolioData, setPortfolioData] = useState({
    totalValue: 0,
    totalChange24h: 0,
    totalChangePercent: 0,
  });
  const [holdings, setHoldings] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [openTransferDialog, setOpenTransferDialog] = useState(false);

  // Transfer form state
  const [transferData, setTransferData] = useState({
    token: CONTRACT_ADDRESSES.WETH,
    amount: '',
    recipient: '',
  });

  // Mock chart data
  const chartData = [
    { name: 'Jan', value: 85000, assets: 3 },
    { name: 'Feb', value: 92000, assets: 4 },
    { name: 'Mar', value: 78000, assets: 4 },
    { name: 'Apr', value: 95000, assets: 5 },
    { name: 'May', value: 110000, assets: 5 },
    { name: 'Jun', value: 125000, assets: 6 },
    { name: 'Jul', value: 135000, assets: 6 },
  ];

  const allocationData = [
    { name: 'Real Estate Tokens', value: 45, color: '#3f51b5', amount: '$60,750' },
    { name: 'DeFi Tokens', value: 30, color: '#f50057', amount: '$40,500' },
    { name: 'Stablecoins', value: 15, color: '#4caf50', amount: '$20,250' },
    { name: 'Other Assets', value: 10, color: '#ff9800', amount: '$13,500' },
  ];

  const tokenOptions = [
    { address: CONTRACT_ADDRESSES.WETH, symbol: 'WETH', name: 'Wrapped Ethereum' },
    { address: CONTRACT_ADDRESSES.USDC, symbol: 'USDC', name: 'USD Coin' },
    { address: CONTRACT_ADDRESSES.LINK, symbol: 'LINK', name: 'Chainlink' },
  ];

  useEffect(() => {
    if (isConnected) {
      loadPortfolioData();
    }
  }, [isConnected]);

  const loadPortfolioData = async () => {
    try {
      setLoading(true);
      
      // Mock data for demonstration
      const mockHoldings = [
        {
          token: 'WETH',
          name: 'Wrapped Ethereum',
          balance: '5.247',
          value: '$10,494.00',
          change24h: '+$125.50',
          changePercent: '+1.21%',
          price: '$2,000.00',
          allocation: 35.2,
          address: CONTRACT_ADDRESSES.WETH,
        },
        {
          token: 'USDC',
          name: 'USD Coin',
          balance: '15,000.00',
          value: '$15,000.00',
          change24h: '+$0.00',
          changePercent: '+0.00%',
          price: '$1.00',
          allocation: 50.3,
          address: CONTRACT_ADDRESSES.USDC,
        },
        {
          token: 'LINK',
          name: 'Chainlink',
          balance: '285.73',
          value: '$4,285.95',
          change24h: '-$42.86',
          changePercent: '-0.99%',
          price: '$15.00',
          allocation: 14.5,
          address: CONTRACT_ADDRESSES.LINK,
        },
      ];

      const mockTransactions = [
        {
          id: 1,
          type: 'Deposit',
          token: 'WETH',
          amount: '2.5',
          value: '$5,000.00',
          status: 'Completed',
          timestamp: '2 hours ago',
          hash: '0x123...abc',
          from: accounts[0],
          to: 'DeFi Protocol',
        },
        {
          id: 2,
          type: 'Transfer',
          token: 'USDC',
          amount: '5,000',
          value: '$5,000.00',
          status: 'Completed',
          timestamp: '5 hours ago',
          hash: '0x456...def',
          from: accounts[0],
          to: '0x789...ghi',
        },
        {
          id: 3,
          type: 'Swap',
          token: 'LINK → WETH',
          amount: '100 → 0.75',
          value: '$1,500.00',
          status: 'Completed',
          timestamp: '1 day ago',
          hash: '0x789...ghi',
          from: 'Uniswap',
          to: accounts[0],
        },
      ];

      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate loading

      setHoldings(mockHoldings);
      setTransactions(mockTransactions);
      setPortfolioData({
        totalValue: 29779.95,
        totalChange24h: 82.64,
        totalChangePercent: 0.28,
      });
    } catch (error) {
      console.error('Error loading portfolio data:', error);
      toast.error('Failed to load portfolio data');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadPortfolioData();
    setRefreshing(false);
  };

  const handleTransfer = async () => {
    try {
      // This would integrate with your transfer functionality
      toast.success('Transfer initiated successfully!');
      setOpenTransferDialog(false);
      setTransferData({ token: CONTRACT_ADDRESSES.WETH, amount: '', recipient: '' });
    } catch (error) {
      console.error('Transfer failed:', error);
      toast.error('Transfer failed');
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 8)}...${address.slice(-6)}`;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Completed':
        return <CheckCircle sx={{ color: 'success.main', fontSize: 16 }} />;
      case 'Pending':
        return <Timer sx={{ color: 'warning.main', fontSize: 16 }} />;
      case 'Failed':
        return <Warning sx={{ color: 'error.main', fontSize: 16 }} />;
      default:
        return null;
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Deposit':
        return <TrendingUp sx={{ color: 'success.main', fontSize: 16 }} />;
      case 'Transfer':
        return <SwapHoriz sx={{ color: 'primary.main', fontSize: 16 }} />;
      case 'Swap':
        return <SwapHoriz sx={{ color: 'secondary.main', fontSize: 16 }} />;
      default:
        return <AccountBalance sx={{ fontSize: 16 }} />;
    }
  };

  if (!isConnected) {
    return (
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Card sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            Please connect your wallet to view your portfolio
          </Typography>
        </Card>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 600, color: 'text.primary' }}>
              Portfolio Overview
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Track your holdings, performance, and manage your assets
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
            <Button
              variant="contained"
              startIcon={<SwapHoriz />}
              onClick={() => setOpenTransferDialog(true)}
              sx={{
                borderRadius: 2,
                background: 'linear-gradient(45deg, #3f51b5 30%, #f50057 90%)',
              }}
            >
              Transfer
            </Button>
          </Box>
        </Box>

        {/* Portfolio Summary */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Grow in timeout={600}>
              <Card sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h3" sx={{ fontWeight: 600, mb: 1 }}>
                  {loading ? (
                    <LinearProgress sx={{ height: 8, borderRadius: 4 }} />
                  ) : (
                    formatCurrency(portfolioData.totalValue)
                  )}
                </Typography>
                <Typography variant="body1" color="text.secondary" gutterBottom>
                  Total Portfolio Value
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                  {portfolioData.totalChangePercent >= 0 ? (
                    <TrendingUp sx={{ color: 'success.main', fontSize: 16 }} />
                  ) : (
                    <TrendingDown sx={{ color: 'error.main', fontSize: 16 }} />
                  )}
                  <Typography
                    variant="body2"
                    sx={{
                      color: portfolioData.totalChangePercent >= 0 ? 'success.main' : 'error.main',
                      fontWeight: 600,
                    }}
                  >
                    {portfolioData.totalChangePercent >= 0 ? '+' : ''}
                    {formatCurrency(portfolioData.totalChange24h)} ({portfolioData.totalChangePercent}%)
                  </Typography>
                </Box>
              </Card>
            </Grow>
          </Grid>

          <Grid item xs={12} md={8}>
            <Grow in timeout={800}>
              <Card sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  Portfolio Performance (7D)
                </Typography>
                <Box sx={{ height: 200 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3f51b5" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#3f51b5" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" />
                      <YAxis stroke="rgba(255,255,255,0.5)" />
                      <RechartsTooltip
                        contentStyle={{
                          backgroundColor: '#1a1a1a',
                          border: '1px solid #333',
                          borderRadius: 8,
                        }}
                        formatter={(value) => [formatCurrency(value), 'Portfolio Value']}
                      />
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke="#3f51b5"
                        fillOpacity={1}
                        fill="url(#colorValue)"
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </Box>
              </Card>
            </Grow>
          </Grid>
        </Grid>
      </Box>

      {/* Main Content Tabs */}
      <Card sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          sx={{
            borderBottom: '1px solid',
            borderBottomColor: 'divider',
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 600,
            },
          }}
        >
          <Tab label="Holdings" />
          <Tab label="Transactions" />
          <Tab label="Analytics" />
        </Tabs>
      </Card>

      {/* Tab Content */}
      {activeTab === 0 && (
        <Fade in timeout={600}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
              Your Holdings
            </Typography>

            {loading ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <LinearProgress sx={{ mb: 2 }} />
                <Typography color="text.secondary">Loading holdings...</Typography>
              </Box>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Asset</TableCell>
                      <TableCell>Balance</TableCell>
                      <TableCell>Value</TableCell>
                      <TableCell>Price</TableCell>
                      <TableCell>24h Change</TableCell>
                      <TableCell>Allocation</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {holdings.map((holding) => (
                      <TableRow key={holding.token}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar sx={{ width: 32, height: 32 }}>
                              {holding.token.charAt(0)}
                            </Avatar>
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                {holding.token}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {holding.name}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {holding.balance}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {holding.value}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {holding.price}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {holding.changePercent.startsWith('+') ? (
                              <TrendingUp sx={{ color: 'success.main', fontSize: 16 }} />
                            ) : (
                              <TrendingDown sx={{ color: 'error.main', fontSize: 16 }} />
                            )}
                            <Box>
                              <Typography
                                variant="body2"
                                sx={{
                                  color: holding.changePercent.startsWith('+') ? 'success.main' : 'error.main',
                                  fontWeight: 500,
                                }}
                              >
                                {holding.changePercent}
                              </Typography>
                              <Typography
                                variant="caption"
                                sx={{
                                  color: holding.changePercent.startsWith('+') ? 'success.main' : 'error.main',
                                }}
                              >
                                {holding.change24h}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <LinearProgress
                              variant="determinate"
                              value={holding.allocation}
                              sx={{ width: 60, height: 6, borderRadius: 3 }}
                            />
                            <Typography variant="caption">
                              {holding.allocation}%
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 0.5 }}>
                            <Tooltip title="Transfer">
                              <IconButton
                                size="small"
                                onClick={() => {
                                  setTransferData({ ...transferData, token: holding.address });
                                  setOpenTransferDialog(true);
                                }}
                              >
                                <SwapHoriz />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="More Actions">
                              <IconButton size="small">
                                <MoreVert />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Card>
        </Fade>
      )}

      {activeTab === 1 && (
        <Fade in timeout={600}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
              Transaction History
            </Typography>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Type</TableCell>
                    <TableCell>Asset</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Value</TableCell>
                    <TableCell>From/To</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Time</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {transactions.map((tx) => (
                    <TableRow key={tx.id}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {getTypeIcon(tx.type)}
                          <Typography variant="body2">{tx.type}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {tx.token}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{tx.amount}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {tx.value}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {formatAddress(tx.to)}
                        </Typography>
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
      )}

      {activeTab === 2 && (
        <Fade in timeout={600}>
          <Grid container spacing={3}>
            {/* Asset Allocation */}
            <Grid item xs={12} lg={6}>
              <Card sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                  Asset Allocation
                </Typography>
                
                <Box sx={{ height: 300, mb: 2 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={allocationData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={120}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {allocationData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <RechartsTooltip
                        formatter={(value, name, props) => [
                          `${value}% (${props.payload.amount})`,
                          name
                        ]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {allocationData.map((item) => (
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
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {item.value}%
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {item.amount}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Card>
            </Grid>

            {/* Performance Metrics */}
            <Grid item xs={12} lg={6}>
              <Card sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                  Performance Metrics
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'background.default' }}>
                      <Typography variant="h5" sx={{ fontWeight: 600, color: 'success.main' }}>
                        +12.5%
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        7-Day Return
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={6}>
                    <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'background.default' }}>
                      <Typography variant="h5" sx={{ fontWeight: 600, color: 'primary.main' }}>
                        +24.8%
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        30-Day Return
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={6}>
                    <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'background.default' }}>
                      <Typography variant="h5" sx={{ fontWeight: 600, color: 'secondary.main' }}>
                        0.15
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Sharpe Ratio
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={6}>
                    <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'background.default' }}>
                      <Typography variant="h5" sx={{ fontWeight: 600, color: 'warning.main' }}>
                        8.2%
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Volatility
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />

                <Typography variant="subtitle2" gutterBottom>
                  Recent Activity Summary
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">
                      Total Transactions (30d)
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      24
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">
                      Average Transaction Size
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      $3,250
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">
                      Total Fees Paid
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      $45.20
                    </Typography>
                  </Box>
                </Box>
              </Card>
            </Grid>
          </Grid>
        </Fade>
      )}

      {/* Transfer Dialog */}
      <Dialog
        open={openTransferDialog}
        onClose={() => setOpenTransferDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: 'background.paper',
            backgroundImage: 'none',
          },
        }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Transfer Assets</Typography>
          <IconButton onClick={() => setOpenTransferDialog(false)}>
            <Close />
          </IconButton>
        </DialogTitle>
        
        <DialogContent dividers>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Token</InputLabel>
                <Select
                  value={transferData.token}
                  onChange={(e) => setTransferData({ ...transferData, token: e.target.value })}
                  label="Token"
                >
                  {tokenOptions.map((token) => (
                    <MenuItem key={token.address} value={token.address}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar sx={{ width: 24, height: 24 }}>
                          {token.symbol.charAt(0)}
                        </Avatar>
                        {token.symbol} - {token.name}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Amount"
                type="number"
                value={transferData.amount}
                onChange={(e) => setTransferData({ ...transferData, amount: e.target.value })}
                placeholder="0.0"
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Recipient Address"
                value={transferData.recipient}
                onChange={(e) => setTransferData({ ...transferData, recipient: e.target.value })}
                placeholder="0x..."
              />
            </Grid>
          </Grid>
        </DialogContent>
        
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpenTransferDialog(false)}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleTransfer}
            disabled={!transferData.amount || !transferData.recipient}
            sx={{
              background: 'linear-gradient(45deg, #3f51b5 30%, #f50057 90%)',
            }}
          >
            Transfer
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Portfolio;