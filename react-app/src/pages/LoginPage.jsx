import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, TextField, Button, Typography } from "@mui/material";
import useAuth from "../hooks/useAuth";

function LoginPage() {
  const [username, setUsername] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    if (username.trim() === "") return;
    login(username);
    navigate("/admin");
  }

  return (
    <Box sx={{ maxWidth: 320, mx: "auto" }}>
      <Typography variant="h5" gutterBottom>
        Login
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <Button type="submit" variant="contained">
          Log in
        </Button>
      </Box>
    </Box>
  );
}

export default LoginPage;
