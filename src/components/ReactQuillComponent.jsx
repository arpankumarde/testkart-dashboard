import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const ReactQuillComponent = ({ value, setValue, container }) => {
  const modules = {
    toolbar: {
      container: container ?? [
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
    <ReactQuill
      theme="snow"
      value={value}
      onChange={setValue}
      modules={modules}
      className="prose"
    />
  );
};

export default ReactQuillComponent;
