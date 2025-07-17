import { CSVLink } from "react-csv";
import { useEffect, useState } from "react";
import Papa from "papaparse";
import { FileDown } from "lucide-react";

export default function DownloadCSV({ data, filename = "export.csv", label }) {
    const [csvData, setCsvData] = useState("");

    useEffect(() => {
        if (data && data.length > 0) {
            const flattened = data.map(item => {
                const base = { ...item };
                if (base.actionBy && typeof base.actionBy === "object") {
                    base.reviewerName = base.actionBy.name;
                    base.reviewerEmail = base.actionBy.email;
                    delete base.actionBy;
                }
                if (base.submittedBy && typeof base.submittedBy === "object") {
                    base.submitterName = base.submittedBy.name;
                    base.submitterEmail = base.submittedBy.email;
                    delete base.submittedBy;
                }
                delete base.__v;
                delete base._id;
                delete base.itemId;
                return base;
            });

            setCsvData(Papa.unparse(flattened));
        }
    }, [data]);

    if (!data || data.length === 0) return null;

    return (
        <CSVLink
            data={csvData}
            filename={filename}
            className="bg-green-600 w-full md:w-auto justify-center flex items-center gap-1 text-white px-3 py-2.5 text-sm rounded hover:bg-green-700"
        >
            <FileDown size={16} strokeWidth={2.5} /> {label}
        </CSVLink>
    );
}
