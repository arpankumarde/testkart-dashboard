import {
  Draft,
  DraftOptionsList,
  Live,
  LiveOptionsList,
  STATUS_MEANINGS_BY_CODE,
  Unlisted,
  UnlistedOptionsList,
} from "./constant";

export const getOptions = (status: number) => {
  switch (STATUS_MEANINGS_BY_CODE[status]) {
    case Unlisted: {
      return UnlistedOptionsList;
    }
    case Live: {
      return LiveOptionsList;
    }
    case Draft: {
      return DraftOptionsList;
    }
    // Add more cases if needed
    default: {
      return [];
    }
  }
};

export const copyToClipboard = async (value: string) => {
  try {
    return await navigator.clipboard.writeText(value);
  } catch (error) {
    console.error("Unable to copy text to clipboard:", error);
  }
};

export const languages = [
  "English",
  "Hindi",
  "Bengali",
  "Marathi",
  "Telugu",
  "Tamil",
  "Gujarati",
  "Urdu",
  "Kannada",
  "Odia",
  "Malayalam",
  "Punjabi",
  "Assamese",
  "Maithili",
  "Meitei",
  "Sanskrit",
  "French",
  "German",
  "Mandarin",
  "Spanish",
  "Arabic",
  "Russian",
  "Portuguese",
  "Indonesian",
  "Japanese",
  "Turkish",
  "Vietnamese",
];
