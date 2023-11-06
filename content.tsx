import type { PlasmoCSConfig } from "plasmo"
import { sendToBackground } from "@plasmohq/messaging"
import { useMessage } from "@plasmohq/messaging/hook"
import {useState} from "React"
import { Button } from "@mui/material";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress'; // for loading spinner


export const config: PlasmoCSConfig = {
  all_frames: true,
  matches: ["<all_urls>"]
}
// const config: PlasmoCSConfig = {
//   matches: ["<all_urls>"]
// }
// window.addEventListener("load", async () => {
//     console.log(
//         document.documentElement.outerHTML)
//     const resp = await sendToBackground({
//       name: "openaichat",
//       body: {
//         prompt: document.documentElement.outerHTML
//       }
//     })
      
//     console.log(resp)
// })

function extractText(node) {
  let text = '';
  for (const childNode of node.childNodes) {
      if (childNode.nodeType === 3) { // Text node
          text += childNode.textContent.trim() + ' ';
      } else if (childNode.nodeType === 1) { // Element node
          text += extractText(childNode) + ' ';
      }
  }
  return text.trim();
}

async function GenerateSummaryForWebpage() {
  const openaiResp = await sendToBackground({
    name: "openaichat",
    body: {
      prompt: extractText(document.body)
    }
  })
  console.log(openaiResp)
  return openaiResp
}
const GenerateSummary = () => {
  const [summary, setSummary] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false); // to track if the summary has been generated

  const handleButtonClick = async () => {
    if (!isGenerated) {
      setIsLoading(true);
      const resp = await GenerateSummaryForWebpage();
      setSummary(JSON.stringify(resp));
      setIsLoading(false);
      setIsGenerated(true);
      setIsVisible(true);
    } else {
      setIsVisible(!isVisible);  // toggle visibility if the summary has been generated
    }
  };

  return (
    <div style={{ position: 'fixed', top: '10px', right: '10px', zIndex: 1000 }}>
      <Button onClick={handleButtonClick} disabled={isLoading}>
        {!isGenerated ? "Generate Summary" : (isVisible ? "Hide Summary" : "Show Summary")}
      </Button>
      {isLoading && <div style={{ 
          position: 'fixed', 
          top: '50%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)', 
          zIndex: 1100
        }}>
          <CircularProgress />
        </div>}
      {isVisible && ( 
        <Card style={{
          marginTop: '10px',
          opacity: 1,
          backgroundColor: 'white',
          maxWidth: '400px',
          overflow: 'hidden',
        }}>
          <CardContent>
            <Typography variant="body1">
              {summary}
            </Typography>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default GenerateSummary
