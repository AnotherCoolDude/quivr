import { useAxios } from "@/lib/useAxios";
import { useEffect, useState } from "react";
import { useSupabase } from "../../supabase-provider";

interface DocumentDataProps {
  documentName: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DocumentDetails = any;
//TODO: review this component logic, types and purposes

const DocumentData = ({ documentName }: DocumentDataProps): JSX.Element => {
  const { session } = useSupabase();
  const { axiosInstance } = useAxios();

  const [documents, setDocuments] = useState<DocumentDetails[]>([]);

  if (!session) {
    throw new Error("User session not found");
  }

  const format_value = (key: string, value: string) => {
    console.log(value);
    console.log(key);
    
    const parsed = parseInt(value);
    
    // check if value is not an integer
    if (isNaN(parsed)) {
      return value
    }

    // if value is an Int, format it to a human readable value based on type
    if (key === "date") { // check if key is date
      const date = new Date(parseInt(value.substring(0,4)), parseInt(value.substring(4,6)) - 1, parseInt(value.substring(7)));
      return date.toLocaleDateString()
    } else if (key === "file_size"){ // check if key is file size
      const bytes_dict: {[key: number]: string} = {
        0:"bytes",
        1:"KB",
        2:"MB",
        3:"GB",
        4:"TB"
      };
      const exponent = Math.round(Math.log(parsed) / Math.log(1024));
  
      return (parsed / (1024**exponent)).toFixed(2) +" "+ bytes_dict[exponent];
    } else { // key is Content
      return value
    }

  }

  // TODO: review the logic of this part and try to use unknown instead of any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  useEffect(() => {
    const fetchDocuments = async () => {
      const res = await axiosInstance.get<{ documents: DocumentDetails[] }>(
        `/explore/${documentName}`
      );
      setDocuments(res.data.documents);
    };
    fetchDocuments();
  }, [axiosInstance, documentName]);

  return (
    <div className="prose dark:prose-invert">
      <h1 className="text-bold text-3xl break-words">{documentName}</h1>
      <p>No. of chunks: {documents.length}</p>

      <div className="flex flex-col">
        {documents[0] &&
          Object.keys(documents[0]).map((doc) => {
            return (
              <div className="grid grid-cols-2 py-2 border-b" key={doc}>
                <p className="capitalize font-bold break-words">
                  {doc.replaceAll("_", " ")}
                </p>
                <span className="break-words my-auto">
                  {documents[0][doc] || "Not Available"}
                </span>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default DocumentData;
