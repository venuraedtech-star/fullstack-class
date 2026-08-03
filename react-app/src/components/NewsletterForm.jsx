import { useState } from "react";
import { Box, TextField, Button, Alert } from "@mui/material";

function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (email.trim() === "") return;
    setSubmitted(true);
  }

  return (
    <Box
      sx={{
        mt: 5,
        bgcolor: "action.hover",
        border: 1,
        borderColor: "divider",
        borderRadius: 2,
        p: 3,
        textAlign: "center",
      }}
    >
      {submitted ? (
        <Alert severity="success" sx={{ justifyContent: "center" }}>
          Thanks - You are Subscribed!
        </Alert>
      ) : (
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", gap: 1, justifyContent: "center" }}
        >
          <TextField
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@gmail.com"
            size="small"
            required
            sx={{ width: 260 }}
          />
          <Button type="submit" variant="contained">
            Subscribe
          </Button>
        </Box>
      )}
    </Box>
  );
}

export default NewsletterForm;
