import React, { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./EditorPage.css";
import { io } from "socket.io-client";


const SAVE_INTERVAL_MS = 2000;

function EditorPage() {
  const { id } = useParams();
  const socketRef = useRef(null);
  const quillRef = useRef(null);

  // Custom image handler
  function imageHandler() {
    const url = prompt("Enter image URL:");
    if (url) {
      const editor = quillRef.current.getEditor();
      const range = editor.getSelection();
      editor.insertEmbed(range ? range.index : 0, "image", url);
    }
  }

  const modules = {
    toolbar: {
      container: [
        [{ header: [1, 2, 3, false] }],
        [{ font: [] }],
        ["bold", "italic", "underline", "strike"],
        [{ color: [] }, { background: [] }],
        [{ script: "sub" }, { script: "super" }],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ indent: "-1" }, { indent: "+1" }],
        [{ align: [] }],
        ["link", "image"],
        ["clean"]
      ],
      handlers: {
        image: imageHandler
      }
    }
  };

  // Connect to socket
  useEffect(() => {
    const socket = io(process.env.REACT_APP_SERVER_URL);
    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("✅ Connected to socket:", socket.id);
    });

    return () => socket.disconnect();
  }, []);

  // Load document from server
  useEffect(() => {
    const socket = socketRef.current;
    const quill = quillRef.current?.getEditor();
    if (!socket || !quill) return;

    socket.once("load-document", (document) => {
      quill.setContents(document);
      quill.enable(true); // make sure it's editable
    });

    quill.disable(); // disable while loading
    socket.emit("get-document", { documentId: id });
  }, [id]);

  // Send changes to server
  useEffect(() => {
    const socket = socketRef.current;
    const quill = quillRef.current?.getEditor();
    if (!socket || !quill) return;

    const handler = (delta, oldDelta, source) => {
      if (source !== "user") return;
      socket.emit("send-changes", delta);
    };

    quill.on("text-change", handler);
    return () => quill.off("text-change", handler);
  }, []);

  // Receive remote changes
  useEffect(() => {
    const socket = socketRef.current;
    const quill = quillRef.current?.getEditor();
    if (!socket || !quill) return;

    const handler = (delta) => {
      quill.updateContents(delta);
    };

    socket.on("receive-changes", handler);
    return () => socket.off("receive-changes", handler);
  }, []);

  // Auto-save every 2s
  useEffect(() => {
    const socket = socketRef.current;
    const quill = quillRef.current?.getEditor();
    if (!socket || !quill) return;

    const interval = setInterval(() => {
      socket.emit("save-document", quill.getContents());
    }, SAVE_INTERVAL_MS);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="editor-wrapper">
      <div className="editor-container">
        <ReactQuill
          ref={quillRef}
          theme="snow"
          placeholder="Start typing your note..."
          modules={modules}
        />
      </div>
    </div>
  );
}

export default EditorPage;
