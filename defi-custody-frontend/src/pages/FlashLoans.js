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
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Alert,
  LinearProgress,
  Avatar,
  Divider,
  Paper,
  Fade,
  Grow,
} from '@mui/material';
import {
  FlashOn,
  Add,
  Remove,
  Info,
  SwapHoriz,
  TrendingUp,
  Security,
  Speed,
  CheckCircle,
  Warning,
  Close,
  Launch,
  AccountBalance,
  Timer,
} from '@mui/icons-material';
import { useWeb3 } from '../context/Web3Context';
import { FLASH_LOAN_PROVIDERS, CONTRACT_ADDRESSES, TOKEN_INFO } from '../config/contracts';
import toast from 'react-hot-toast';

const FlashLoans = () => {
  const {
    initiateFlashLoan,
    getTokenPrice,
    getBalance,
    accounts,
    isConnected,
  } = useWeb3();

  const [openDialog, setOpenDialog] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loanHistory, setLoanHistory] = useState([]);

  // Flash loan form state
  const [loanData, setLoanData] = useState({
    provider: FLASH_LOAN_PROVIDERS.AAVE,
    loanAsset: CONTRACT_ADDRESSES.WETH,
    loanAmount: '',
    collateralTokens: [CONTRACT_ADDRESSES.USDC],
    collateralAmounts: [''],
  });

  // Provider comparison data
  const [providerRates, setProviderRates] = useState({
    [FLASH_LOAN_PROVIDERS.AAVE]: { fee: '0.09%', available: true, liquidity: '$2.5B' },
    [FLASH_LOAN_PROVIDERS.BALANCER]: { fee: '0.00%', available: true, liquidity: '$1.2B' },
    [FLASH_LOAN_PROVIDERS.UNISWAP]: { fee: '0.30%', available: true, liquidity: '$3.1B' },
  });

  const providerNames = {
    [FLASH_LOAN_PROVIDERS.AAVE]: 'Aave V3',
    [FLASH_LOAN_PROVIDERS.BALANCER]: 'Balancer V2',
    [FLASH_LOAN_PROVIDERS.UNISWAP]: 'Uniswap V3',
  };

  const tokenOptions = [
    { address: CONTRACT_ADDRESSES.WETH, symbol: 'WETH', name: 'Wrapped Ethereum' },
    { address: CONTRACT_ADDRESSES.USDC, symbol: 'USDC', name: 'USD Coin' },
    { address: CONTRACT_ADDRESSES.LINK, symbol: 'LINK', name: 'Chainlink' },
  ];

  const steps = [
    'Select Provider & Asset',
    'Configure Collateral',
    'Review & Execute',
  ];

  useEffect(() => {
    if (isConnected) {
      loadLoanHistory();
    }
  }, [isConnected]);

  const loadLoanHistory = async () => {
    try {
      // Mock data for demonstration
      const mockHistory = [
        {
          id: 1,
          provider: 'Aave V3',
          asset: 'WETH',
          amount: '10.5',
          fee: '0.009',
          status: 'Completed',
          timestamp: '2 hours ago',
          hash: '0x123abc...',
          profit: '+$125.50',
        },
        {
          id: 2,
          provider: 'Balancer V2',
          asset: 'USDC',
          amount: '50,000',
          fee: '0.00',
          status: 'Completed',
          timestamp: '1 day ago',
          hash: '0x456def...',
          profit: '+$89.25',
        },
        {
          id: 3,
          provider: 'Uniswap V3',
          asset: 'LINK',
          amount: '1,000',
          fee: '3.00',
          status: 'Failed',
          timestamp: '3 days ago',
          hash: '0x789ghi...',
          profit: '-$15.00',
        },
      ];
      
      setLoanHistory(mockHistory);
    } catch (error) {
      console.error('Error loading loan history:', error);
    }
  };

  const handleAddCollateral = () => {
    setLoanData({
      ...loanData,
      collateralTokens: [...loanData.collateralTokens, CONTRACT_ADDRESSES.WETH],
      collateralAmounts: [...loanData.collateralAmounts, ''],
    });
  };

  const handleRemoveCollateral = (index) => {
    const newTokens = loanData.collateralTokens.filter((_, i) => i !== index);
    const newAmounts = loanData.collateralAmounts.filter((_, i) => i !== index);
    setLoanData({
      ...loanData,
      collateralTokens: newTokens,
      collateralAmounts: newAmounts,
    });
  };

  const handleCollateralTokenChange = (index, token) => {
    const newTokens = [...loanData.collateralTokens];
    newTokens[index] = token;
    setLoanData({ ...loanData, collateralTokens: newTokens });
  };

  const handleCollateralAmountChange = (index, amount) => {
    const newAmounts = [...loanData.collateralAmounts];
    newAmounts[index] = amount;
    setLoanData({ ...loanData, collateralAmounts: newAmounts });
  };

  const calculateEstimatedFee = () => {
    const amount = parseFloat(loanData.loanAmount) || 0;
    const feeRate = parseFloat(providerRates[loanData.provider].fee.replace('%', '')) / 100;
    return (amount * feeRate).toFixed(6);
  };

  const handleExecuteFlashLoan = async () => {
    try {
      setLoading(true);
      
      await initiateFlashLoan(
        loanData.provider,
        loanData.loanAsset,
        loanData.loanAmount,
        loanData.collateralTokens,
        loanData.collateralAmounts
      );
      
      setOpenDialog(false);
      setActiveStep(0);
      toast.success('Flash loan executed successfully!');
      loadLoanHistory();
    } catch (error) {
      console.error('Error executing flash loan:', error);
      toast.error('Flash loan failed');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'success';
      case 'Pending':
        return 'warning';
      case 'Failed':
        return 'error';
      default:
        return 'default';
    }
  };

  const getProviderColor = (provider) => {
    switch (provider) {
      case 'Aave V3':
        return '#b6509e';
      case 'Balancer V2':
        return '#1e1e1e';
      case 'Uniswap V3':
        return '#ff007a';
      default:
        return '#3f51b5';
    }
  };

  if (!isConnected) {
    return (
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Card sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            Please connect your wallet to access Flash Loans
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
              Flash Loan Aggregator
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Access instant liquidity from multiple DeFi protocols with optimal rates
            </Typography>
          </Box>
          
          <Button
            variant="contained"
            startIcon={<FlashOn />}
            onClick={() => setOpenDialog(true)}
            sx={{
              borderRadius: 2,
              background: 'linear-gradient(45deg, #3f51b5 30%, #f50057 90%)',
              '&:hover': {
                background: 'linear-gradient(45deg, #2c387e 30%, #ab003c 90%)',
              },
            }}
          >
            New Flash Loan
          </Button>
        </Box>
      </Box>

      {/* Provider Comparison */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {Object.entries(providerRates).map(([provider, data], index) => (
          <Grid item xs={12} md={4} key={provider}>
            <Grow in timeout={600 + index * 200}>
              <Card 
                sx={{ 
                  p: 3, 
                  height: '100%',
                  border: '1px solid',
                  borderColor: 'divider',
                  '&:hover': {
                    borderColor: 'primary.main',
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 32px rgba(63, 81, 181, 0.2)',
                  },
                  transition: 'all 0.3s ease-in-out',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Avatar
                    sx={{
                      bgcolor: getProviderColor(providerNames[provider]),
                      width: 48,
                      height: 48,
                    }}
                  >
                    <FlashOn />
                  </Avatar>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {providerNames[provider]}
                    </Typography>
                    <Chip
                      label={data.available ? 'Available' : 'Unavailable'}
                      size="small"
                      color={data.available ? 'success' : 'error'}
                    />
                  </Box>
                </Box>

                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Flash Loan Fee
                    </Typography>
                    <Typography variant="h6" color="primary.main" sx={{ fontWeight: 600 }}>
                      {data.fee}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Available Liquidity
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {data.liquidity}
                    </Typography>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Speed sx={{ fontSize: 16, color: 'success.main' }} />
                    <Typography variant="caption" color="text.secondary">
                      Fast execution
                    </Typography>
                  </Box>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => {
                      setLoanData({ ...loanData, provider: parseInt(provider) });
                      setOpenDialog(true);
                    }}
                    disabled={!data.available}
                  >
                    Use Provider
                  </Button>
                </Box>
              </Card>
            </Grow>
          </Grid>
        ))}
      </Grid>

      {/* Recent Flash Loans */}
      <Fade in timeout={1200}>
        <Card sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Recent Flash Loans
            </Typography>
            <Button
              variant="outlined"
              size="small"
              endIcon={<Launch />}
            >
              View All
            </Button>
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Provider</TableCell>
                  <TableCell>Asset</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Fee</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Profit/Loss</TableCell>
                  <TableCell>Time</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loanHistory.map((loan) => (
                  <TableRow key={loan.id}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar
                          sx={{
                            width: 24,
                            height: 24,
                            bgcolor: getProviderColor(loan.provider),
                          }}
                        >
                          <FlashOn sx={{ fontSize: 14 }} />
                        </Avatar>
                        <Typography variant="body2">{loan.provider}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar sx={{ width: 24, height: 24 }}>
                          {loan.asset.charAt(0)}
                        </Avatar>
                        <Typography variant="body2">{loan.asset}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {loan.amount} {loan.asset}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {loan.fee} {loan.asset}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={loan.status}
                        size="small"
                        color={getStatusColor(loan.status)}
                        icon={
                          loan.status === 'Completed' ? <CheckCircle /> : 
                          loan.status === 'Failed' ? <Warning /> : <Timer />
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{
                          color: loan.profit.startsWith('+') ? 'success.main' : 'error.main',
                          fontWeight: 600,
                        }}
                      >
                        {loan.profit}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {loan.timestamp}
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

      {/* Flash Loan Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: 'background.paper',
            backgroundImage: 'none',
          },
        }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Create Flash Loan</Typography>
          <IconButton onClick={() => setOpenDialog(false)}>
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          <Stepper activeStep={activeStep} orientation="vertical">
            {/* Step 1: Select Provider & Asset */}
            <Step>
              <StepLabel>Select Provider & Asset</StepLabel>
              <StepContent>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel>Flash Loan Provider</InputLabel>
                      <Select
                        value={loanData.provider}
                        onChange={(e) => setLoanData({ ...loanData, provider: e.target.value })}
                        label="Flash Loan Provider"
                      >
                        {Object.entries(providerNames).map(([value, name]) => (
                          <MenuItem key={value} value={parseInt(value)}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Avatar sx={{ width: 24, height: 24, bgcolor: getProviderColor(name) }}>
                                <FlashOn sx={{ fontSize: 14 }} />
                              </Avatar>
                              {name} - Fee: {providerRates[value].fee}
                            </Box>
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Loan Asset</InputLabel>
                      <Select
                        value={loanData.loanAsset}
                        onChange={(e) => setLoanData({ ...loanData, loanAsset: e.target.value })}
                        label="Loan Asset"
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

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Loan Amount"
                      type="number"
                      value={loanData.loanAmount}
                      onChange={(e) => setLoanData({ ...loanData, loanAmount: e.target.value })}
                      placeholder="0.0"
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Alert severity="info" icon={<Info />}>
                      Estimated fee: {calculateEstimatedFee()} {tokenOptions.find(t => t.address === loanData.loanAsset)?.symbol}
                    </Alert>
                  </Grid>
                </Grid>

                <Box sx={{ mt: 2 }}>
                  <Button
                    variant="contained"
                    onClick={() => setActiveStep(1)}
                    disabled={!loanData.loanAmount}
                  >
                    Next
                  </Button>
                </Box>
              </StepContent>
            </Step>

            {/* Step 2: Configure Collateral */}
            <Step>
              <StepLabel>Configure Collateral</StepLabel>
              <StepContent>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Add collateral tokens to secure your flash loan
                </Typography>

                {loanData.collateralTokens.map((token, index) => (
                  <Grid container spacing={2} key={index} sx={{ mb: 2 }}>
                    <Grid item xs={12} sm={5}>
                      <FormControl fullWidth size="small">
                        <InputLabel>Collateral Token</InputLabel>
                        <Select
                          value={token}
                          onChange={(e) => handleCollateralTokenChange(index, e.target.value)}
                          label="Collateral Token"
                        >
                          {tokenOptions.map((option) => (
                            <MenuItem key={option.address} value={option.address}>
                              {option.symbol}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={5}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Amount"
                        type="number"
                        value={loanData.collateralAmounts[index]}
                        onChange={(e) => handleCollateralAmountChange(index, e.target.value)}
                        placeholder="0.0"
                      />
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <IconButton
                        onClick={() => handleRemoveCollateral(index)}
                        disabled={loanData.collateralTokens.length === 1}
                        color="error"
                      >
                        <Remove />
                      </IconButton>
                    </Grid>
                  </Grid>
                ))}

                <Button
                  variant="outlined"
                  startIcon={<Add />}
                  onClick={handleAddCollateral}
                  sx={{ mb: 2 }}
                >
                  Add Collateral
                </Button>

                <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                  <Button onClick={() => setActiveStep(0)}>
                    Back
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => setActiveStep(2)}
                    disabled={loanData.collateralAmounts.some(amount => !amount)}
                  >
                    Next
                  </Button>
                </Box>
              </StepContent>
            </Step>

            {/* Step 3: Review & Execute */}
            <Step>
              <StepLabel>Review & Execute</StepLabel>
              <StepContent>
                <Paper sx={{ p: 2, bgcolor: 'background.default', mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Flash Loan Summary
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">Provider:</Typography>
                      <Typography variant="body2">{providerNames[loanData.provider]}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">Asset:</Typography>
                      <Typography variant="body2">
                        {loanData.loanAmount} {tokenOptions.find(t => t.address === loanData.loanAsset)?.symbol}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">Estimated Fee:</Typography>
                      <Typography variant="body2">
                        {calculateEstimatedFee()} {tokenOptions.find(t => t.address === loanData.loanAsset)?.symbol}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">Collateral Items:</Typography>
                      <Typography variant="body2">{loanData.collateralTokens.length}</Typography>
                    </Grid>
                  </Grid>
                </Paper>

                <Alert severity="warning" sx={{ mb: 2 }}>
                  Flash loans must be repaid within the same transaction. Ensure you have a strategy to repay the loan plus fees.
                </Alert>

                <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                  <Button onClick={() => setActiveStep(1)}>
                    Back
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleExecuteFlashLoan}
                    disabled={loading}
                    sx={{
                      background: 'linear-gradient(45deg, #3f51b5 30%, #f50057 90%)',
                    }}
                  >
                    {loading ? 'Executing...' : 'Execute Flash Loan'}
                  </Button>
                </Box>
              </StepContent>
            </Step>
          </Stepper>
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default FlashLoans;