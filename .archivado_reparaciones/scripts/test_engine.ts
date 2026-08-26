import { pdf, Document, Page, View, Text } from "@react-pdf/renderer";
import React from "react";

async function main() {
  const element = React.createElement(Document, {}, 
    React.createElement(Page, { size: "A4" }, 
      React.createElement(View, {}, 
        React.createElement(Text, {}, "Hello World")
      )
    )
  );
  
  try {
    console.log("Rendering...");
    const stream = await pdf(element).toBuffer() as any;
    if (stream && typeof stream.on === 'function') {
        console.log("Got STREAM");
    } else {
        console.log("Got BUFFER, size:", stream.length);
    }
  } catch (e) {
    console.error("FAILED:", e);
  }
}

main();
