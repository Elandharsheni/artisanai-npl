import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import { getProducts, subscribeToProducts } from '../services/marketplace';

const SellerDashboard = () => {
  const location = useLocation();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    getProducts()
      .then((items) => {
        if (active) setProducts(items);
      })
      .catch((loadError) => {
        if (active) setError(loadError.message);
      });
    const unsubscribe = subscribeToProducts((items) => {
      setProducts(items);
      setError('');
    }, setConnected);
    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  const handleClose = () => {
    setSelectedProduct(null);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        p: 4,
        background: 'linear-gradient(to right, #f0f4f8, #ffffff)',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" color="primary" gutterBottom>
            📦 Seller Dashboard
          </Typography>
          <Typography color={connected ? 'success.main' : 'warning.main'}>
            {connected ? '● Live inventory updates enabled' : '● Connecting to live inventory...'}
          </Typography>
        </Box>
        <Button component={Link} to="/add" variant="contained">Add product</Button>
      </Box>
      {location.state?.notice && (
        <Typography role="status" sx={{ mt: 2, p: 1.5, bgcolor: '#edf5eb', color: '#37643a', borderRadius: 1 }}>
          {location.state.notice}
        </Typography>
      )}
      {error && <Typography role="alert" color="error" sx={{ mt: 2 }}>{error}</Typography>}
      {!products.length && !error && (
        <Typography sx={{ mt: 4 }}>Loading products...</Typography>
      )}

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
          },
          gap: 3,
          mt: 2,
        }}
      >
        {products.map((product) => (
          <Card
            key={product.id}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              borderRadius: 3,
              overflow: 'hidden',
              boxShadow: 3,
              transition: 'transform 0.2s',
              '&:hover': { transform: 'scale(1.02)' },
            }}
          >
            <CardMedia
              component="img"
              image={product.image || '/pot.jpg'}
              alt={product.title}
              height="200"
              onError={(event) => { event.currentTarget.src = '/pot.jpg'; }}
            />
            <CardContent>
              <Typography variant="h6" fontWeight={600}>
                {product.title}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                ₹{product.price}
              </Typography>
              <Typography color={product.stock ? 'success.main' : 'error.main'}>
                {product.stock} in stock
              </Typography>
            </CardContent>
            <Button
              sx={{
                py: 1.5,
                borderRadius: 0,
                fontWeight: 'bold',
                backgroundColor: '#22c55e',
                color: 'white',
                '&:hover': {
                  backgroundColor: '#16a34a',
                },
              }}
              onClick={() => setSelectedProduct(product)}
            >
              View Product
            </Button>
          </Card>
        ))}
      </Box>

      {/* View Product Modal */}
      <Dialog open={!!selectedProduct} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle fontWeight="bold">{selectedProduct?.title}</DialogTitle>
        <DialogContent>
          <Box sx={{ textAlign: 'center' }}>
            <img
              src={selectedProduct?.image || '/pot.jpg'}
              alt={selectedProduct?.title}
              onError={(event) => { event.currentTarget.src = '/pot.jpg'; }}
              style={{
                width: '100%',
                borderRadius: '10px',
                marginBottom: '1rem',
              }}
            />
            <Typography variant="h6" color="green">
              ₹{selectedProduct?.price}
            </Typography>
            <Typography mt={2}>{selectedProduct?.description}</Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="contained" color="error">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SellerDashboard;
