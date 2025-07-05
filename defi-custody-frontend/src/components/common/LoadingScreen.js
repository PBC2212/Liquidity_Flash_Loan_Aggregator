import React from 'react';
import { Box, CircularProgress, Typography, Fade } from '@mui/material';

const LoadingScreen = ({ message = "Initializing DeFi Custody Platform..." }) => {
  return (
    <Fade in={true} timeout={300}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          backgroundColor: 'background.default',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 9999,
        }}
      >
        {/* Animated Background */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `
              radial-gradient(circle at 20% 20%, rgba(63, 81, 181, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 80% 80%, rgba(245, 0, 87, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 40% 60%, rgba(63, 81, 181, 0.05) 0%, transparent 50%)
            `,
          }}
        />

        {/* Main Content */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            zIndex: 1,
            textAlign: 'center',
          }}
        >
          {/* Logo/Brand */}
          <Box
            sx={{
              mb: 4,
              position: 'relative',
            }}
          >
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: 'linear-gradient(45deg, #3f51b5 30%, #f50057 90%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2,
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: -4,
                  left: -4,
                  right: -4,
                  bottom: -4,
                  borderRadius: '50%',
                  background: 'linear-gradient(45deg, #3f51b5, #f50057)',
                  opacity: 0.3,
                  animation: 'pulse 2s ease-in-out infinite',
                },
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  color: 'white',
                  fontWeight: 'bold',
                  zIndex: 1,
                }}
              >
                DC
              </Typography>
            </Box>
          </Box>

          {/* Loading Spinner */}
          <Box sx={{ position: 'relative', mb: 3 }}>
            <CircularProgress
              size={60}
              thickness={4}
              sx={{
                color: 'primary.main',
                '& .MuiCircularProgress-circle': {
                  strokeLinecap: 'round',
                },
              }}
            />
          </Box>

          {/* Loading Text */}
          <Typography
            variant="h5"
            sx={{
              color: 'text.primary',
              fontWeight: 600,
              mb: 1,
              background: 'linear-gradient(45deg, #3f51b5 30%, #f50057 90%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            DeFi Custody
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: 'text.secondary',
              mb: 4,
              maxWidth: 400,
              px: 2,
            }}
          >
            {message}
          </Typography>

          {/* Feature Pills */}
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 1,
              justifyContent: 'center',
              maxWidth: 500,
            }}
          >
            {[
              'Web3Auth Integration',
              'Flash Loan Aggregation',
              'Asset Custody',
              'Compliance Tracking',
            ].map((feature, index) => (
              <Box
                key={feature}
                sx={{
                  px: 2,
                  py: 0.5,
                  borderRadius: 20,
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    color: 'text.secondary',
                    fontSize: '0.75rem',
                  }}
                >
                  {feature}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Floating Particles Animation */}
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
          {[...Array(6)].map((_, i) => (
            <Box
              key={i}
              sx={{
                position: 'absolute',
                width: 4,
                height: 4,
                borderRadius: '50%',
                background: i % 2 === 0 ? 'primary.main' : 'secondary.main',
                opacity: 0.6,
                animation: `float ${3 + i * 0.5}s ease-in-out infinite`,
                left: `${10 + i * 15}%`,
                top: `${20 + i * 10}%`,
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
        </Box>

        {/* CSS Animations */}
        <style jsx>{`
          @keyframes pulse {
            0%, 100% {
              transform: scale(1);
              opacity: 0.3;
            }
            50% {
              transform: scale(1.1);
              opacity: 0.5;
            }
          }

          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes float {
            0%, 100% {
              transform: translateY(0) rotate(0deg);
            }
            50% {
              transform: translateY(-20px) rotate(180deg);
            }
          }
        `}</style>
      </Box>
    </Fade>
  );
};

export default LoadingScreen;