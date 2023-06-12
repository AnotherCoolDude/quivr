export const formatValue = (key: string, value: string): string => {
   
    const parsed = parseInt(value);

    if (isNaN(parsed)) {
        return value;
    }

    // if value is an Int, format it to a human readable value based on type
    if (key === "date") { // check if key is date
        const date = new Date(parseInt(value.substring(0, 4)), parseInt(value.substring(4, 6)) - 1, parseInt(value.substring(7)));
        return date.toLocaleDateString();
    }
    
    if (key === "file_size") { // check if key is file size
        const bytes_dict: { [key: number]: string } = {
            0: "bytes",
            1: "KB",
            2: "MB",
            3: "GB",
            4: "TB"
        };
        const exponent = Math.round(Math.log(parsed) / Math.log(1024));
        return (parsed / (1024 ** exponent)).toFixed(2) + " " + bytes_dict[exponent];
    }

    return value;
};





