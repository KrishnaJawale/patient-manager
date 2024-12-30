//import outputs from "../amplify_outputs.json";
import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/data";
import { Container, Button } from "@mui/material";
import {
  Authenticator,
} from "@aws-amplify/ui-react";
import { Box, Typography } from "@mui/material";
import PatientTable from "./components/PatientTable"
import AddPatient from "./components/AddPatient";

export default function PracticeApp() {
  return (
    <Authenticator>
      {({ signOut }) => (
          <Container>
            <Box>
              <Typography variant="h3" sx={{textAlign: "center", mt: 4, mb: 3}}>
                Patient Management
              </Typography>
            </Box>
            <AddPatient></AddPatient>
            <PatientTable></PatientTable>
            <Button onClick={signOut} sx={{mt: 4}}>Sign Out</Button>
          </Container>
      )}
    </Authenticator>
  )
}