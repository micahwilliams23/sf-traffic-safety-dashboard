import Papa from "papaparse";
import type { Dispatch, SetStateAction } from "react";

const fetchDataFromUrl = async (
  url: string,
  initialState: any,
  setState: Dispatch<SetStateAction<typeof initialState>>,
) => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.text();
    Papa.parse(result, {
      header: true,
      dynamicTyping: true,
      complete: (results) => {setState(results.data);}
    } as Papa.ParseWorkerConfig<unknown> & {
    download?: false | undefined;
});
  } catch (err) {console.log(err)}
};

export default fetchDataFromUrl;
