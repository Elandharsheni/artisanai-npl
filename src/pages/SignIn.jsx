import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Paper, Typography, Box } from "@mui/material";
import { motion } from "framer-motion";

const SignIn = () => {
  const navigate = useNavigate();

  const handleLogin = (role) => {
    localStorage.setItem("role", role);
    localStorage.setItem("loggedIn", "true");
    navigate(role === "buyer" ? "/buyer" : "/dashboard");
  };

  return (
    <Box
      sx={{
        height: "100vh",
        backgroundImage: "url('/background.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        px: 2,
        position: "relative",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      {/* Background overlay */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background: "rgba(255,255,255,0.65)",
          backdropFilter: "blur(6px)",
        }}
      />

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6 }}
        style={{ zIndex: 10 }}
      >
        <Paper
          elevation={12}
          sx={{
            p: 5,
            width: 360,
            borderRadius: 4,
            textAlign: "center",
            fontFamily: "'Poppins', sans-serif",
            position: "relative",
            zIndex: 2,
          }}
        >
          {/* Logo */}
          <img
            src="/logo.png"
            alt="ArtisanAI Logo"
            style={{
              width: 80,
              height: 80,
              objectFit: "contain",
              margin: "0 auto 20px auto",
            }}
          />

          <Typography
            variant="h4"
            fontWeight="bold"
            color="primary"
            mb={1}
            sx={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Welcome Back
          </Typography>

          <Typography variant="body1" color="text.secondary" mb={4}>
            Choose your role to continue
          </Typography>

          <Button
            fullWidth
            variant="contained"
            color="success"
            size="large"
            onClick={() => handleLogin("buyer")}
            sx={{
              mb: 2,
              fontWeight: "bold",
              fontSize: "1.1rem",
              textTransform: "none",
              py: 1.5,
              boxShadow: 2,
              borderRadius: 2,
            }}
          >
            I'm a Buyer
          </Button>

          <Button
            fullWidth
            variant="outlined"
            color="secondary"
            size="large"
            onClick={() => handleLogin("seller")}
            sx={{
              fontWeight: "bold",
              fontSize: "1.1rem",
              textTransform: "none",
              py: 1.5,
              borderWidth: 2,
              borderRadius: 2,
            }}
          >
            I'm a Seller
          </Button>
        </Paper>
      </motion.div>
    </Box>
  );
};

export default SignIn;
