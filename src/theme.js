import { createTheme } from "@mui/material/styles";
import { red } from "@mui/material/colors";

// Create a theme instance.
const theme = createTheme({
  cssVariables: true,
  palette: {
    primary: {
      main: "#76ABAE",
    },
    secondary: {
      main: "#19857b",
    },
    error: {
      main: red.A400,
    },

    background: {
      default: "#222831",
      paper: "#31363F"
    },
    text: {
      primary: "#EEEEEE",
      secondary: "#EEEEEE"
    }
  },
  components: {
    MuiTextField: {
      defaultProps: {
        size: "small",
      },
      styleOverrides: {
        root: {
          "& .MuiInputBase-root": {
            backgroundColor: "#31363F", // Background color for the input field
            color: "#EEEEEE", // Text color
          },
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "#76ABAE", // Border color for the input field
            },
            "&:hover fieldset": {
              borderColor: "#76ABAE", // Border color on hover
            },
            "&.Mui-focused fieldset": {
              borderColor: "#76ABAE", // Border color when focused
            },
          },
        },
      }
    },
    MuiSelect: {
      styleOverrides: {
        icon: {
          color: "#76ABAE",
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        h6: {
          //color: "#D3D3D3"
        },
        overline: {
          color: "#76ABAE"
        }
      }
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: "#76ABAE",
          "&.Mui-focused": {
            color: "#76ABAE",
          },
          
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        sizeMedium: {
          color: "#76ABAE"
        }
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          color: "#76ABAE"
        }
      }
    },
    MuiFormControl: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#76ABAE"
          },
          "& .MuiInputBase-root": {
            backgroundColor: "#31363F", // Background color for the input field
            color: "#EEEEEE", // Text color
          },
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "#76ABAE", // Border color for the input field
            },
            "&:hover fieldset": {
              borderColor: "#76ABAE", // Border color on hover
            },
            "&.Mui-focused fieldset": {
              borderColor: "#76ABAE", // Border color when focused
            },
          },
        }
      }
    }
  }
});

export default theme;
