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
            <Box display= "flex" alignItems="center" justifyContent="space-between" sx={{mt: 3, mb:3}}>
                <Typography variant="h3" sx={{ml:9.5, flexGrow: 1, textAlign: "center"}}>
                  Patient Management System
                </Typography>
                <Button onClick={signOut} sx={{marginLeft: "auto"}}>Sign Out</Button>
            </Box>
            
            <AddPatient></AddPatient>
            <PatientTable></PatientTable>
          </Container>
      )}
    </Authenticator>
  )
}
