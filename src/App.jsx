// src/App.jsx
import React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import MaxSheet from "./components/MaxSheet"; // مسیر درست به MaxSheet
import "./styles/maxsheet.css"; // CSS جدول

const theme = createTheme({
  palette: {
    mode: "light",
    background: { default: "#f8fafc" },
    primary: { main: "#1976d2" },
  },
  typography: { fontFamily: ['Inter', 'Roboto', 'Arial', 'sans-serif'].join(',') },
});

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="xl" sx={{ py: 2 }}>
        <MaxSheet />
      </Container>
    </ThemeProvider>
  );
}
