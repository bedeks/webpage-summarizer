import { sendToContentScript } from "@plasmohq/messaging"
import {useState} from "react";
import { Button } from "@mui/material";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';


function IndexPopup() {
  const [summary, setSummary] = useState("No summary found");

  return (
    <div
      style={{
      }}>
      <h2>
        Welcome to the webpage summarizer!
      </h2>
      <Button onClick={async() => {
          const resp = await sendToContentScript({name: "GenerateSummary"});
          setSummary(resp)}}>
            Summarize webpage content
            </Button>
      <Card>
      <CardContent>
        <Typography variant="body1">
          {summary}
        </Typography>
      </CardContent>
    </Card>
    </div>
  )
}

export default IndexPopup;
