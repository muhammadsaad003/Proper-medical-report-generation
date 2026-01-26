// src/hfClient.js
import { Client, handle_file } from "@gradio/client";

const SPACE_ID = "saad003/radiology-retrieval-captioning"; // your backend Space

let clientPromise = null;

async function getClient() {
  if (!clientPromise) {
    clientPromise = Client.connect(SPACE_ID);
  }
  return clientPromise;
}

export async function queryBackend(file, k = 5) {
  const client = await getClient();

  const result = await client.predict("/", {
    image: handle_file(file), // first input of Gradio interface
    k: k,                      // second input (slider)
  });

  const [gallery, caption, modality] = result.data;

  return { gallery, caption, modality };
}
