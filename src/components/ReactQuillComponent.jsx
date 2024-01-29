import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const ReactQuillComponent = ({ value, setValue }) => {
  const modules = {
    toolbar: {
      container: [
        [{ header: [1, 2, 3, 4, false] }],
        ["bold", "italic", "underline", "strike"],
        ["blockquote", "code-block"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link", "image"],
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
    />
  );
};

export default ReactQuillComponent;
