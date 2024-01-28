import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const ReactQuillComponet = ({ value, setValue }) => {
  return <ReactQuill theme="snow" value={value} onChange={setValue} />;
};

export default ReactQuillComponet;
