"use client";

import { Suspense } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

interface ReactQuillComponentProps {
  value: string;
  setValue: (value: string) => void;
}

const ReactQuillComponent = ({ value, setValue }: ReactQuillComponentProps) => {
  const modules = {
    toolbar: {
      container: [
        [{ header: [2, 3, 4, false] }],
        ["bold", "italic", "underline", "strike"],
        ["blockquote", "code-block"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["image"],
        ["clean"],
      ],
    },
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ReactQuill
        theme="snow"
        value={value}
        onChange={setValue}
        modules={modules}
        className="prose"
      />
    </Suspense>
  );
};

export default ReactQuillComponent;
