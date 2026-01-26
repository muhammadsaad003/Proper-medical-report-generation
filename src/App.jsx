// src/App.jsx
import { useState } from "react";
import { queryBackend } from "./hfClient";

function App() {
  const [file, setFile] = useState(null);
  const [k, setK] = useState(5);
  const [loading, setLoading] = useState(false);
  const [caption, setCaption] = useState("");
  const [modality, setModality] = useState("");
  const [gallery, setGallery] = useState([]);

  const handleSubmit = async () => {
    if (!file) return;
    setLoading(true);
    setCaption("");
    setModality("");
    setGallery([]);

    try {
      const res = await queryBackend(file, k);
      setCaption(res.caption);
      setModality(res.modality);
      setGallery(res.gallery || []);
    } catch (err) {
      console.error(err);
      alert("Error calling backend. Check console.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
  };

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 24, fontFamily: "sans-serif" }}>
      <h1>Radiology Image Retrieval + Captioning</h1>
      <p style={{ color: "red" }}>
        Research demo only – not for real clinical use.
      </p>

      <div style={{ marginBottom: 16 }}>
        <input type="file" accept="image/*" onChange={handleFileChange} />
      </div>

      <div style={{ marginBottom: 16 }}>
        <label>
          Number of similar images:{" "}
          <input
            type="number"
            min={1}
            max={12}
            value={k}
            onChange={(e) => setK(Number(e.target.value))}
          />
        </label>
      </div>

      <button onClick={handleSubmit} disabled={!file || loading}>
        {loading ? "Processing..." : "Analyze image"}
      </button>

      {caption && (
        <>
          <h2>Generated Caption</h2>
          <p>{caption}</p>
        </>
      )}

      {modality && (
        <>
          <h2>Detected Modality</h2>
          <p>{modality}</p>
        </>
      )}

      {gallery && gallery.length > 0 && (
        <>
          <h2>Similar Images</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
            {gallery.map((item, idx) => {
              // When Gradio Gallery returns (image, caption) tuples,
              // item[0] is image URL, item[1] is caption.
              const imgSrc = Array.isArray(item) ? item[0] : item;
              const imgCaption = Array.isArray(item) ? item[1] : "";
              return (
                <figure key={idx} style={{ width: 160 }}>
                  <img
                    src={imgSrc}
                    alt={imgCaption || `similar-${idx}`}
                    style={{ width: "100%", borderRadius: 8 }}
                  />
                  <figcaption style={{ fontSize: 12 }}>{imgCaption}</figcaption>
                </figure>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

export default App;
