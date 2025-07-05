import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  IconButton,
  Fade,
  Grow,
  useTheme,
  CircularProgress,
} from '@mui/material';
import {
  AccountBalanceWallet,
  Security,
  FlashOn,
  TrendingUp,
  Verified,
  Speed,
  Shield,
  Integration,
  ArrowForward,
  GitHub,
  Twitter,
  LinkedIn,
} from '@mui/icons-material';
import { useWeb3 } from '../context/Web3Context';

const LandingPage = () => {
  const theme = useTheme();
  const { connectWallet, loading } = useWeb3();
  const [connecting, setConnecting] = useState(false);

  const handleConnect = async () => {
    try {
      setConnecting(true);
      await connectWallet();
    } catch (error) {
      console.error('Connection failed:', error);
    } finally {
      setConnecting(false);
    }
  };

  const features = [
    {
      icon: <Security />,
      title: 'Secure Custody',
      description: 'Enterprise-grade custody solutions for real-world assets with full compliance tracking and verification.',
      color: '#3f51b5',
    },
    {
      icon: <FlashOn />,
      title: 'Flash Loan Aggregation',
      description: 'Access liquidity from multiple protocols including Aave, Balancer, and Uniswap with optimal rates.',
      color: '#f50057',
    },
    {
      icon: <Verified />,
      title: 'Compliance Ready',
      description: 'Built-in KYC, AML, and regulatory compliance features for institutional-grade asset management.',
      color: '#4caf50',
    },
    {
      icon: <Speed />,
      title: 'High Performance',
      description: 'Optimized smart contracts and efficient gas usage for seamless DeFi operations.',
      color: '#ff9800',
    },
    {
      icon: <Shield />,
      title: 'Multi-Layer Security',
      description: 'Advanced security measures including multi-signature wallets and risk management protocols.',
      color: '#9c27b0',
    },
    {
      icon: <Integration />,
      title: 'Easy Integration',
      description: 'Simple APIs and SDKs for seamless integration with existing financial infrastructure.',
      color: '#00bcd4',
    },
  ];

  const stats = [
    { label: 'Total Value Locked', value: '$2.5B+', growth: '+125%' },
    { label: 'Active Users', value: '50K+', growth: '+89%' },
    { label: 'Flash Loans Executed', value: '1M+', growth: '+234%' },
    { label: 'Assets Registered', value: '10K+', growth: '+156%' },
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: `
          radial-gradient(circle at 20% 20%, rgba(63, 81, 181, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 80% 80%, rgba(245, 0, 87, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 40% 60%, rgba(76, 175, 80, 0.05) 0%, transparent 50%),
          linear-gradient(180deg, #0a0a0a 0%, #1a1a1a 100%)
        `,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Animated Background Elements */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          overflow: 'hidden',
          pointerEvents: 'none',
        }}
      >
        {[...Array(12)].map((_, i) => (
          <Box
            key={i}
            sx={{
              position: 'absolute',
              width: 2,
              height: 2,
              borderRadius: '50%',
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              opacity: 0.4,
              animation: `float ${4 + i * 0.3}s ease-in-out infinite`,
              left: `${5 + i * 8}%`,
              top: `${10 + (i % 3) * 30}%`,
              animationDelay: `${i * 0.5}s`,
            }}
          />
        ))}
      </Box>

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <Box sx={{ py: 3, textAlign: 'center' }}>
          <Fade in timeout={800}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
              <Box
                sx={{
                  width: 60,
                  height: 60,
                  borderRadius: '50%',
                  background: 'linear-gradient(45deg, #3f51b5 30%, #f50057 90%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: 2,
                }}
              >
                <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold' }}>
                  DC
                </Typography>
              </Box>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  background: 'linear-gradient(45deg, #3f51b5 30%, #f50057 90%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                DeFi Custody Platform
              </Typography>
            </Box>
          </Fade>
        </Box>

        {/* Hero Section */}
        <Box sx={{ py: 8, textAlign: 'center' }}>
          <Fade in timeout={1000}>
            <Typography
              variant="h2"
              component="h1"
              sx={{
                fontWeight: 700,
                mb: 3,
                background: 'linear-gradient(45deg, #ffffff 30%, #b3b3b3 90%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontSize: { xs: '2.5rem', md: '3.5rem' },
              }}
            >
              The Future of
              <br />
              Decentralized Asset Management
            </Typography>
          </Fade>

          <Fade in timeout={1200}>
            <Typography
              variant="h5"
              sx={{
                color: 'text.secondary',
                mb: 4,
                maxWidth: 800,
                mx: 'auto',
                lineHeight: 1.6,
              }}
            >
              Secure custody, compliant asset management, and advanced flash loan aggregation
              for institutional-grade DeFi operations.
            </Typography>
          </Fade>

          <Fade in timeout={1400}>
            <Box sx={{ mb: 6 }}>
              <Button
                variant="contained"
                size="large"
                onClick={handleConnect}
                disabled={loading || connecting}
                startIcon={
                  connecting ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    <AccountBalanceWallet />
                  )
                }
                endIcon={!connecting && <ArrowForward />}
                sx={{
                  py: 2,
                  px: 4,
                  borderRadius: 3,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  background: 'linear-gradient(45deg, #3f51b5 30%, #f50057 90%)',
                  boxShadow: '0 8px 32px rgba(63, 81, 181, 0.4)',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 12px 40px rgba(63, 81, 181, 0.6)',
                  },
                  transition: 'all 0.3s ease-in-out',
                }}
              >
                {connecting ? 'Connecting...' : 'Connect Wallet & Start'}
              </Button>
            </Box>
          </Fade>
        </Box>

        {/* Stats Section */}
        <Box sx={{ py: 6 }}>
          <Grid container spacing={3}>
            {stats.map((stat, index) => (
              <Grid item xs={6} md={3} key={stat.label}>
                <Grow in timeout={800 + index * 200}>
                  <Card
                    sx={{
                      textAlign: 'center',
                      p: 3,
                      background: 'rgba(255, 255, 255, 0.05)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                  >
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 700,
                        mb: 1,
                        color: 'primary.main',
                      }}
                    >
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {stat.label}
                    </Typography>
                    <Typography variant="caption" color="success.main" sx={{ fontWeight: 600 }}>
                      {stat.growth}
                    </Typography>
                  </Card>
                </Grow>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Features Section */}
        <Box sx={{ py: 8 }}>
          <Typography
            variant="h3"
            component="h2"
            sx={{
              textAlign: 'center',
              fontWeight: 700,
              mb: 6,
              color: 'text.primary',
            }}
          >
            Powerful Features for Modern DeFi
          </Typography>

          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={6} lg={4} key={feature.title}>
                <Grow in timeout={1000 + index * 150}>
                  <Card
                    sx={{
                      height: '100%',
                      p: 3,
                      background: 'rgba(255, 255, 255, 0.05)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      transition: 'all 0.3s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: `0 20px 40px rgba(${feature.color.replace('#', '')}, 0.3)`,
                        border: `1px solid ${feature.color}`,
                      },
                    }}
                  >
                    <CardContent sx={{ p: 0 }}>
                      <Box
                        sx={{
                          width: 60,
                          height: 60,
                          borderRadius: 2,
                          background: `linear-gradient(45deg, ${feature.color}20, ${feature.color}40)`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mb: 3,
                          color: feature.color,
                        }}
                      >
                        {React.cloneElement(feature.icon, { sx: { fontSize: 30 } })}
                      </Box>
                      
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'text.primary' }}>
                        {feature.title}
                      </Typography>
                      
                      <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                        {feature.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grow>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* CTA Section */}
        <Box sx={{ py: 8, textAlign: 'center' }}>
          <Fade in timeout={1600}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 600,
                mb: 3,
                color: 'text.primary',
              }}
            >
              Ready to Get Started?
            </Typography>
          </Fade>

          <Fade in timeout={1800}>
            <Typography
              variant="h6"
              sx={{
                color: 'text.secondary',
                mb: 4,
                maxWidth: 600,
                mx: 'auto',
              }}
            >
              Join thousands of users who trust our platform for secure, compliant,
              and efficient DeFi operations.
            </Typography>
          </Fade>

          <Fade in timeout={2000}>
            <Button
              variant="outlined"
              size="large"
              onClick={handleConnect}
              disabled={loading || connecting}
              startIcon={<AccountBalanceWallet />}
              sx={{
                py: 2,
                px: 4,
                borderRadius: 3,
                fontSize: '1.1rem',
                fontWeight: 600,
                borderColor: 'primary.main',
                color: 'primary.main',
                '&:hover': {
                  borderColor: 'primary.light',
                  backgroundColor: 'rgba(63, 81, 181, 0.1)',
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease-in-out',
              }}
            >
              Connect Your Wallet
            </Button>
          </Fade>
        </Box>

        {/* Footer */}
        <Box sx={{ py: 4, borderTop: '1px solid', borderTopColor: 'divider' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              © 2024 DeFi Custody Platform. All rights reserved.
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton size="small" sx={{ color: 'text.secondary' }}>
                <GitHub />
              </IconButton>
              <IconButton size="small" sx={{ color: 'text.secondary' }}>
                <Twitter />
              </IconButton>
              <IconButton size="small" sx={{ color: 'text.secondary' }}>
                <LinkedIn />
              </IconButton>
            </Box>
          </Box>
        </Box>
      </Container>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
            opacity: 0.4;
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
            opacity: 0.8;
          }
        }
      `}</style>
    </Box>
  );
};

export default LandingPage;