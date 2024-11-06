export const Draft = "Draft";
export const Live = "Live";
export const Unlisted = "Unlisted";

interface StatusMeanings {
  [key: number]: string;
}

export const STATUS_MEANINGS_BY_CODE: StatusMeanings = {
  0: Draft,
  1: Live,
  2: Unlisted,
};

interface StatusCode {
  [key: string]: number;
}

export const STATUS_CODE_BY_STATUS: StatusCode = {
  Draft: 0,
  Live: 1,
  Unlisted: 2,
};

interface StatusColor {
  [key: number]: string;
}

export const STATUS_COLOR_BY_STATUS_CODE: StatusColor = {
  0: "bg-[#545b62]", // Draft
  1: "bg-[#30d530]", // Live
  2: "bg-[#6d45a4]", // Unlisted
};

export const TEST_SERIES_TYPE = {
  Free: 0,
  Paid: 1,
};

export const DISCOUNT_TYPE = {
  PERCENTAGE: "percentage",
  AMOUNT: "amount",
};

export const VIEW_TESTS = "View Tests";
export const EDIT_DETAILS = "Edit Details";
export const MODIFY_LISTING = "Modify Listing";
export const UNLIST = "Unlist";
export const SHARE = "Share";
export const DELETE = "Delete";
export const ADD_QUESTION = "Add Questions";
export const LIST_ON_TESTKART = "List On TestKart";

export const LiveOptionsList = [
  VIEW_TESTS,
  EDIT_DETAILS,
  MODIFY_LISTING,
  UNLIST,
  SHARE,
];

export const DraftOptionsList = [VIEW_TESTS, EDIT_DETAILS, DELETE];

export const UnlistedOptionsList = [VIEW_TESTS, EDIT_DETAILS, LIST_ON_TESTKART];
