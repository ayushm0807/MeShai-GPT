import { Box,Avatar, Typography } from '@mui/material';
import React from 'react'
import { useAuth } from '../../context/AuthContext';
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coldarkDark } from "react-syntax-highlighter/dist/esm/styles/prism";

function extractCodeFromString(message: string) {
    if (message.includes("```")) {
      const blocks = message.split("```");
      return blocks;
    }
  }
  
  function isCodeBlock(str: string) {
    if (
      str.includes("=") ||
      str.includes(";") ||
      str.includes("[") ||
      str.includes("]") ||
      str.includes("{") ||
      str.includes("}") ||
      str.includes("#") ||
      str.includes("//")
    ) {
      return true;
    }
    return false;
  }

  const processMessage = (message: string) => {
    // Handle bullet points, ensuring not to add extra spacing for consecutive bullet points
    let formattedMessage = message
        .replace(/^\*\s+/gm, '\n* ') // Replace * at the beginning of lines with bullet point
        .replace(/\n\n\*\s+/g, '\n'); // Ensure that \n\n* is replaced with two line breaks and a bullet point

    // Replace newline characters with double line breaks
    formattedMessage = formattedMessage.replace(/\n/g, '\n');

    // Split the message by '**' to isolate bold text parts (if needed)
    const parts = formattedMessage.split(/(\*\*.*?\*\*)/g);

    // Map through the parts to apply <strong> to bold text and handle line breaks
    return parts.flatMap((part, index) => {
        // Check if the part should be bold
        if (part.startsWith('**') && part.endsWith('**')) {
            // Remove the ** and wrap in <strong> tags, followed by a space
            return [
                <strong key={index}>{part.slice(2, -2)}</strong>,
                ' ' // Space after the bold text
            ];
        }

        // Handle line breaks and bullet points
        const lines = part.split('\n').map((line, idx) => (
            <span key={`${index}-${idx}`}>
                {idx > 0 && <br />} {/* Add a line break for each new line */}
                {line.trim()}
            </span>
        ));

        return lines;
    });
  };


const ChatItem = ({
    text,
    role,
  }: {
    text: string;
    role: "user" | "model";
  }) => {
    const beautyContent = processMessage(text);
    const messageBlocks = extractCodeFromString(text);
    const auth = useAuth();
  return role === "model" ? (
    <Box sx={{
        display: "flex",
        p: 1.5,
        bgcolor: "#004d5612",
        gap: 2.5,
        borderRadius: 2,
        my: 1,
      }}>
        
    <Avatar sx={{ ml: "0" }}>
        <img src="openai.png" alt="openai" width={"30px"} />
    </Avatar>

    <Box>
    {!messageBlocks && (
          <Typography sx={{ fontSize: "20px" }}>{beautyContent}</Typography>
        )}
        {messageBlocks &&
          messageBlocks.length &&
          messageBlocks.map((block) =>
            isCodeBlock(block) ? (
              <SyntaxHighlighter style={coldarkDark} language="javascript">
                {block}
              </SyntaxHighlighter>
            ) : (
              
              <Typography sx={{ fontSize: "20px" }}>{processMessage(block)}</Typography>
            )
          )}
    </Box>


    </Box>
  ) : (
    <Box
    sx={{
        display: "flex",
        p: 1.5,
        bgcolor: "#004d56",
        gap: 2,
        borderRadius: 2,
      }}>
        <Avatar sx={{ ml: "0", bgcolor: "black", color: "white" }}>
            {auth?.user?.name[0]}
            {auth?.user?.name?.split(" ")[1]?.[0] || ''}
        </Avatar>

        <Box>
            {!messageBlocks && (
                <Typography sx={{ fontSize: "20px" }}>{beautyContent}</Typography>
                )}
                {messageBlocks &&
                messageBlocks.length &&
                messageBlocks.map((block) =>
                    isCodeBlock(block) ? (
                    <SyntaxHighlighter style={coldarkDark} language="javascript">
                        {block}
                    </SyntaxHighlighter>
                    ) : (
                    <Typography sx={{ fontSize: "20px" }}>{block}</Typography>
                    )
                )}
        </Box>
    </Box>
  )

}

export default ChatItem
