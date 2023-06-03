import axios from "axios";
import { useSupabase } from "../../supabase-provider";

interface DocumentDataProps {
  documentName: string;
}

const DocumentData = async ({ documentName }: DocumentDataProps) => {
  const { session } = useSupabase();
  if (!session) {
    throw new Error("User session not found");
  }

  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/explore/${documentName}`,
    {
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    }
  );

  const format_value = (key: string, value: string) => {
  
    const parsed = parseInt(value);
    
    // check if value is not an integer
    if (isNaN(parsed)) {
      return value
    }

    // if value is an Int, format it to a human readable value based on type
    if (key === "date") { // check if key is date
      const date = new Date(parseInt(value.substring(0,4)), parseInt(value.substring(4,6)) - 1, parseInt(value.substring(7)));
      return date.toLocaleDateString()
    } else { // it's file size in this case
      const bytes_dict: {[key: number]: string} = {
        0:"bytes",
        1:"KB",
        2:"MB",
        3:"GB",
        4:"TB"
      };
      const exponent = Math.round(Math.log(parsed) / Math.log(1024));
  
      return (parsed / (1024**exponent)).toFixed(2) +" "+ bytes_dict[exponent];
    }

  }

  // TODO: review the logic of this part and try to use unknown instead of any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const documents = res.data.documents as any[];
  return (
    <div className="prose">
      <p>No. of documents: {documents.length}</p>
      {/* {documents.map((doc) => (
        <pre key={doc.name}>{JSON.stringify(doc)}</pre>
      ))} */}
      <div className="flex flex-col gap-2">
        {documents[0] &&
          Object.keys(documents[0]).map((k) => {
            return (
              <div className="grid grid-cols-2 border-b py-2" key={k}>
                <span className="capitalize font-bold">
                  {k.replaceAll("_", " ")}
                </span>
                <span className="">{format_value(k, documents[0][k]) || "Not Available"}</span>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default DocumentData;
