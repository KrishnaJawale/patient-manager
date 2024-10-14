import outputs from "../amplify_outputs.json";
import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/data";
import Container from '@mui/material/Container';
import { Box, Typography } from "@mui/material";
Amplify.configure(outputs);
const client = generateClient({
  authMode: "userPool",
});

export default function PracticeApp() {
    return <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
      <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
          My Practice App
        </Typography>
      </Box></Container>
}