"use client";
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  typography: {
    fontFamily: "var(--font-roboto)",
  },
  palette: {
    primary: {
      main: "#673ab7", 
    },
    secondary: {
      main: "#d1c4e9", 
    },
  },
  cssVariables: true,
});

export default theme;
