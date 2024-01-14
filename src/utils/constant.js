export const STATUS_MEANINGS_BY_CODE = {
  0: "Draft",
  1: "Live",
  2: "Unlisted",
};

export const STATUS_COLOR_BY_STATUS_CODE = {
  0: "#545b62", // Draft
  1: "#30d530", // Live
  2: "#6d45a4", // Unlisted
};

export const VIEW_TESTS = "View Tests";
export const EDIT_DETAILS = "Edit Details";
export const MODIFY_LISTING = "Modify Listing";
export const UNLIST = "Unlist";
export const SHARE = "Share";
export const DELETE = "Delete";
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
