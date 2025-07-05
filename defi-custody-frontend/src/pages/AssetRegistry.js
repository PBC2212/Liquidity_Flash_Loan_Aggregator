import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
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
  Switch,
  FormControlLabel,
  LinearProgress,
  Avatar,
  Fade,
  Grow,
  Divider,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Visibility,
  CheckCircle,
  Warning,
  Error,
  Info,
  Launch,
  Upload,
  Security,
  Verified,
  Close,
} from '@mui/icons-material';
import { useWeb3 } from '../context/Web3Context';
import toast from 'react-hot-toast';

const AssetRegistry = () => {
  const {
    registerAsset,
    updateCompliance,
    getAssetInfo,
    isAssetCompliant,
    accounts,
    isConnected,
  } = useWeb3();

  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [dialogMode, setDialogMode] = useState('create'); // 'create', 'edit', 'view', 'compliance'

  // Form state
  const [formData, setFormData] = useState({
    tokenAddress: '',
    assetDescription: '',
    chainId: 11155111, // Sepolia
    custodyAddress: '',
    defiProtocol: '',
    custodyType: '',
    offchainDocs: '',
  });

  // Compliance state
  const [complianceData, setComplianceData] = useState({
    kycCompleted: false,
    amlCompleted: false,
    inspectionPassed: false,
    titleVerified: false,
    custodyConfirmed: false,
  });

  const custodyTypes = [
    'Escrow',
    'SPV',
    'Vault',
    'Trust',
    'Custodial Bank',
    'Self-Custody',
  ];

  useEffect(() => {
    if (isConnected) {
      loadAssets();
    }
  }, [isConnected]);

  const loadAssets = async () => {
    try {
      setLoading(true);
      // Mock data for demonstration
      // In a real app, you would fetch from the blockchain or a backend service
      const mockAssets = [
        {
          id: 1,
          tokenAddress: '0x1234567890123456789012345678901234567890',
          assetDescription: 'Manhattan Commercial Property - 123 Broadway',
          chainId: 11155111,
          custodyAddress: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcdef',
          defiProtocol: '0x0000000000000000000000000000000000000000',
          custodyType: 'SPV',
          offchainDocs: 'ipfs://QmXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
          compliance: {
            kycCompleted: true,
            amlCompleted: true,
            inspectionPassed: true,
            titleVerified: true,
            custodyConfirmed: false,
            lastUpdated: Date.now(),
          },
          isCompliant: false,
          value: '$2,500,000',
          status: 'Pending Custody',
        },
        {
          id: 2,
          tokenAddress: '0x2345678901234567890123456789012345678901',
          assetDescription: 'Tesla Model S Fleet (50 Vehicles)',
          chainId: 11155111,
          custodyAddress: '0xbcdefabcdefabcdefabcdefabcdefabcdefabcdefa',
          defiProtocol: '0x0000000000000000000000000000000000000000',
          custodyType: 'Vault',
          offchainDocs: 'ipfs://QmYYYYYYYYYYYYYYYYYYYYYYYYYYYY',
          compliance: {
            kycCompleted: true,
            amlCompleted: true,
            inspectionPassed: true,
            titleVerified: true,
            custodyConfirmed: true,
            lastUpdated: Date.now(),
          },
          isCompliant: true,
          value: '$1,800,000',
          status: 'Active',
        },
      ];

      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate loading
      setAssets(mockAssets);
    } catch (error) {
      console.error('Error loading assets:', error);
      toast.error('Failed to load assets');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAsset = () => {
    setDialogMode('create');
    setFormData({
      tokenAddress: '',
      assetDescription: '',
      chainId: 11155111,
      custodyAddress: '',
      defiProtocol: '',
      custodyType: '',
      offchainDocs: '',
    });
    setOpenDialog(true);
  };

  const handleEditAsset = (asset) => {
    setDialogMode('edit');
    setSelectedAsset(asset);
    setFormData({
      tokenAddress: asset.tokenAddress,
      assetDescription: asset.assetDescription,
      chainId: asset.chainId,
      custodyAddress: asset.custodyAddress,
      defiProtocol: asset.defiProtocol,
      custodyType: asset.custodyType,
      offchainDocs: asset.offchainDocs,
    });
    setOpenDialog(true);
  };

  const handleViewAsset = (asset) => {
    setDialogMode('view');
    setSelectedAsset(asset);
    setOpenDialog(true);
  };

  const handleUpdateCompliance = (asset) => {
    setDialogMode('compliance');
    setSelectedAsset(asset);
    setComplianceData(asset.compliance);
    setOpenDialog(true);
  };

  const handleSubmit = async () => {
    try {
      if (dialogMode === 'create') {
        await registerAsset(
          formData.tokenAddress,
          formData.assetDescription,
          formData.chainId,
          formData.custodyAddress,
          formData.defiProtocol || '0x0000000000000000000000000000000000000000',
          formData.custodyType,
          formData.offchainDocs
        );
        toast.success('Asset registered successfully!');
      } else if (dialogMode === 'compliance') {
        await updateCompliance(
          selectedAsset.tokenAddress,
          complianceData.kycCompleted,
          complianceData.amlCompleted,
          complianceData.inspectionPassed,
          complianceData.titleVerified,
          complianceData.custodyConfirmed
        );
        toast.success('Compliance updated successfully!');
      }
      
      setOpenDialog(false);
      loadAssets(); // Reload assets
    } catch (error) {
      console.error('Error submitting:', error);
      toast.error('Transaction failed');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'success';
      case 'Pending Custody':
        return 'warning';
      case 'Rejected':
        return 'error';
      default:
        return 'default';
    }
  };

  const getComplianceScore = (compliance) => {
    const checks = Object.values(compliance).filter(Boolean);
    return Math.round((checks.length / 5) * 100);
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
            Please connect your wallet to access the Asset Registry
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
              Asset Registry
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Register and manage real-world asset tokens with compliance tracking
            </Typography>
          </Box>
          
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleCreateAsset}
            sx={{
              borderRadius: 2,
              background: 'linear-gradient(45deg, #3f51b5 30%, #f50057 90%)',
              '&:hover': {
                background: 'linear-gradient(45deg, #2c387e 30%, #ab003c 90%)',
              },
            }}
          >
            Register New Asset
          </Button>
        </Box>

        {/* Summary Cards */}
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Grow in timeout={600}>
              <Card sx={{ p: 2 }}>
                <CardContent sx={{ p: 0 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
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
                      <Security sx={{ color: 'white' }} />
                    </Box>
                    <Box>
                      <Typography variant="h5" sx={{ fontWeight: 600 }}>
                        {assets.length}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Assets
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grow>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Grow in timeout={800}>
              <Card sx={{ p: 2 }}>
                <CardContent sx={{ p: 0 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
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
                      <Verified sx={{ color: 'white' }} />
                    </Box>
                    <Box>
                      <Typography variant="h5" sx={{ fontWeight: 600 }}>
                        {assets.filter(a => a.isCompliant).length}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Compliant
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grow>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Grow in timeout={1000}>
              <Card sx={{ p: 2 }}>
                <CardContent sx={{ p: 0 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
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
                      <Warning sx={{ color: 'white' }} />
                    </Box>
                    <Box>
                      <Typography variant="h5" sx={{ fontWeight: 600 }}>
                        {assets.filter(a => !a.isCompliant).length}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Pending
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grow>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Grow in timeout={1200}>
              <Card sx={{ p: 2 }}>
                <CardContent sx={{ p: 0 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
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
                    <Box>
                      <Typography variant="h5" sx={{ fontWeight: 600 }}>
                        $4.3M
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Value
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grow>
          </Grid>
        </Grid>
      </Box>

      {/* Assets Table */}
      <Fade in timeout={1400}>
        <Card sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
            Registered Assets
          </Typography>

          {loading ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <LinearProgress sx={{ mb: 2 }} />
              <Typography color="text.secondary">Loading assets...</Typography>
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Asset</TableCell>
                    <TableCell>Token Address</TableCell>
                    <TableCell>Custody Type</TableCell>
                    <TableCell>Value</TableCell>
                    <TableCell>Compliance</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {assets.map((asset) => (
                    <TableRow key={asset.id}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                            {asset.assetDescription.charAt(0)}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              {asset.assetDescription.length > 40
                                ? `${asset.assetDescription.slice(0, 40)}...`
                                : asset.assetDescription}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {asset.custodyType}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Tooltip title={asset.tokenAddress}>
                          <Chip
                            label={formatAddress(asset.tokenAddress)}
                            size="small"
                            variant="outlined"
                            onClick={() => navigator.clipboard.writeText(asset.tokenAddress)}
                            sx={{ cursor: 'pointer' }}
                          />
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={asset.custodyType}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {asset.value}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <LinearProgress
                            variant="determinate"
                            value={getComplianceScore(asset.compliance)}
                            sx={{ width: 60, height: 6, borderRadius: 3 }}
                            color={asset.isCompliant ? 'success' : 'warning'}
                          />
                          <Typography variant="caption" color="text.secondary">
                            {getComplianceScore(asset.compliance)}%
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={asset.status}
                          size="small"
                          color={getStatusColor(asset.status)}
                          icon={asset.isCompliant ? <CheckCircle /> : <Warning />}
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          <Tooltip title="View Details">
                            <IconButton size="small" onClick={() => handleViewAsset(asset)}>
                              <Visibility />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Edit Asset">
                            <IconButton size="small" onClick={() => handleEditAsset(asset)}>
                              <Edit />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Update Compliance">
                            <IconButton size="small" onClick={() => handleUpdateCompliance(asset)}>
                              <Security />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="View on Explorer">
                            <IconButton size="small">
                              <Launch />
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

      {/* Dialog for Create/Edit/View/Compliance */}
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
          <Typography variant="h6">
            {dialogMode === 'create' && 'Register New Asset'}
            {dialogMode === 'edit' && 'Edit Asset'}
            {dialogMode === 'view' && 'Asset Details'}
            {dialogMode === 'compliance' && 'Update Compliance'}
          </Typography>
          <IconButton onClick={() => setOpenDialog(false)}>
            <Close />
          </IconButton>
        </DialogTitle>
        
        <DialogContent dividers>
          {(dialogMode === 'create' || dialogMode === 'edit') && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Token Address"
                  value={formData.tokenAddress}
                  onChange={(e) => setFormData({ ...formData, tokenAddress: e.target.value })}
                  placeholder="0x..."
                  disabled={dialogMode === 'edit'}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Asset Description"
                  value={formData.assetDescription}
                  onChange={(e) => setFormData({ ...formData, assetDescription: e.target.value })}
                  placeholder="e.g., Manhattan Commercial Property - 123 Broadway"
                  multiline
                  rows={2}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Chain ID"
                  type="number"
                  value={formData.chainId}
                  onChange={(e) => setFormData({ ...formData, chainId: parseInt(e.target.value) })}
                  disabled
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Custody Type</InputLabel>
                  <Select
                    value={formData.custodyType}
                    onChange={(e) => setFormData({ ...formData, custodyType: e.target.value })}
                    label="Custody Type"
                  >
                    {custodyTypes.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Custody Address"
                  value={formData.custodyAddress}
                  onChange={(e) => setFormData({ ...formData, custodyAddress: e.target.value })}
                  placeholder="0x..."
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="DeFi Protocol (Optional)"
                  value={formData.defiProtocol}
                  onChange={(e) => setFormData({ ...formData, defiProtocol: e.target.value })}
                  placeholder="0x... or leave empty"
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Off-chain Documents"
                  value={formData.offchainDocs}
                  onChange={(e) => setFormData({ ...formData, offchainDocs: e.target.value })}
                  placeholder="IPFS hash or URL to documents"
                />
              </Grid>
            </Grid>
          )}

          {dialogMode === 'view' && selectedAsset && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  {selectedAsset.assetDescription}
                </Typography>
                <Divider sx={{ mb: 2 }} />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Token Address
                </Typography>
                <Typography variant="body1" sx={{ wordBreak: 'break-all' }}>
                  {selectedAsset.tokenAddress}
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Value
                </Typography>
                <Typography variant="h6" color="primary.main">
                  {selectedAsset.value}
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Custody Type
                </Typography>
                <Chip label={selectedAsset.custodyType} color="primary" />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Status
                </Typography>
                <Chip 
                  label={selectedAsset.status} 
                  color={getStatusColor(selectedAsset.status)}
                  icon={selectedAsset.isCompliant ? <CheckCircle /> : <Warning />}
                />
              </Grid>
            </Grid>
          )}

          {dialogMode === 'compliance' && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="body1" gutterBottom>
                  Update compliance status for this asset:
                </Typography>
              </Grid>
              
              {Object.entries(complianceData).map(([key, value]) => {
                if (key === 'lastUpdated') return null;
                
                const labels = {
                  kycCompleted: 'KYC Completed',
                  amlCompleted: 'AML Completed',
                  inspectionPassed: 'Inspection Passed',
                  titleVerified: 'Title Verified',
                  custodyConfirmed: 'Custody Confirmed',
                };
                
                return (
                  <Grid item xs={12} sm={6} key={key}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={value}
                          onChange={(e) => setComplianceData({
                            ...complianceData,
                            [key]: e.target.checked
                          })}
                          color="primary"
                        />
                      }
                      label={labels[key]}
                    />
                  </Grid>
                );
              })}
            </Grid>
          )}
        </DialogContent>
        
        {dialogMode !== 'view' && (
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setOpenDialog(false)}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSubmit}
              sx={{
                background: 'linear-gradient(45deg, #3f51b5 30%, #f50057 90%)',
              }}
            >
              {dialogMode === 'create' && 'Register Asset'}
              {dialogMode === 'edit' && 'Update Asset'}
              {dialogMode === 'compliance' && 'Update Compliance'}
            </Button>
          </DialogActions>
        )}
      </Dialog>
    </Container>
  );
};

export default AssetRegistry;