import { mapActions } from "vuex";

export const spotMethods = mapActions("modules/spot/storeSpot", [
  "getSpot",
  "getSpotList",
  "createSpot",
  "updateSpot",
  "getSpotDetail",
]);
export const officerMethods = mapActions("modules/officer/storeOfficer", [
  "getOfficer",
  "updateOfficer",
  "showOfficer",
  "deleteOfficer",
  "createOfficer",
  "inviteOfficer",
  "kickOfficer",
  "updatePinOfficer",
]);
export const officerRegistrationMethods = mapActions(
  "modules/officer/storeOfficerRegistration",
  ["getRegistedOfficers", "updateRegistedOfficer"]
);
export const officerLeaveMethods = mapActions(
  "modules/officer/storeOfficerLeave",
  ["updateOfficerLeave"]
);
export const finderMethods = mapActions(
  "modules/resolution-center/storeFinder",
  ["getFinderLog"]
);
export const s3Methods = mapActions("modules/utility/storeS3", [
  "getPreSignedPostUrl",
  "uploadDataToS3",
]);
export const reportMethods = mapActions("modules/report/storeReport", [
  "getIncomeReport",
  "getIncomeReportByDate",
  "getMotorcycleReport",
  "getMotorcycleReportByDate",
  "getCasualReportIncome",
  "getCasualReportIncomeByDate",
  "getCasualReportQuantity",
  "getCasualReportQuantityByDate",
  "getCashlessReportIncome",
  "getCashlessReportIncomeByDate",
  "getCashlessReportQuantity",
  "getCashlessReportQuantityByDate",
  "getMembershipReportPlateByDate",
  "getMembershipReportCardByDate",
  "getMembershipReportAll",
  "getDailyStatsByDate",
  "getDailyReportByDate",
  "getLostTicketReport",
  "getOverstayReportByDate",
  "getQuantityDurationReport",
  "requestAllQuantityDurationReport",
  "getShiftReportByDate",
  "getOfficerStatReport",
  "getAdditionalReportByDate",
  "getAdminShiftDetailReportByDate",
  "getAdminShiftReportByDate",
  "getAdministrationReport",
  "getTransactionReport",
  "requestTransactionReport",
  "getProblemTicketReport",
  "getAttendanceReport",
  "getLeaveReport",
  "getVisitorReportByDate",
  "getCounterReportByDate",
  "getVehicleValidationReport",
  "requestAllVehicleValidationReport",
  "getGateOpenReport",
]);
export const productMethods = mapActions("modules/product/storeProduct", [
  "getMembershipProduct",
  "getMembershipProductDetail",
  "getMembershipProductByType",
  "updateMembershipProduct",
  "createMembershipProduct",
]);
export const transactionMethods = mapActions(
  "modules/resolution-center/storeTransaction",
  [
    "getTransactionLog",
    "getAllTransaction",
    "filterTransaction",
    "getUnfinishedTransactionByEmployee",
  ]
);
export const userMethods = mapActions("modules/user/storeUser", [
  "getUser",
  "getUserDetail",
  "getUserBySpotId",
  "updateUser",
  "createUser",
  "deleteUser",
  "inviteUser",
  "updateAccessUser",
  "removeAccessUser",
]);
export const userAppMethods = mapActions("modules/user-app/storeUserApp", [
  "getUserApp",
]);
export const shiftMethods = mapActions("modules/shift/storeShift", [
  "getShift",
  "getShiftByDate",
  "getShiftDetail",
  "readUploadedShift",
  "actionShift",
  "uploadShift",
]);
export const utilityMethods = mapActions("modules/utility/storeUtility", [
  "setAlert",
  "removeAlert",
  "getCurrentVersionCode",
  "appendStackedDropdown",
  "popStackedDropdown",
  "setSingleDropdown",
  "clearSingleDropdown",
  "clearStackedDropdown",
  "setOptionSpot",
]);
export const paymentListMethods = mapActions("modules/spot/storePaymentList", [
  "getPaymentMethod",
]);
export const additionalServiceMethods = mapActions(
  "modules/additional-service/storeAdditionalService",
  ["getAdditional"]
);
// v2 section
export const v2reportMethods = mapActions("modules/report/v2.storeReport", [
  "getIncomeReportByDate",
  "getMotorcycleReportByDate",
  "getCasualReportIncomeByDate",
  "getCasualReportQuantityByDate",
  "getCashlessReportIncomeByDate",
  "getCashlessReportQuantityByDate",
  "getCashlessReportIncomeByShift",
]);
// v3 section
export const v3reportMethods = mapActions("modules/report/v3.storeReport", [
  "getIncomeReportByTransaction",
  "getIncomeReportByPayment",
  "getIncomeOverstayReport",
  "getIncomeReportByOfficer",
  "getQuantityReportByTransaction",
  "getQuantityReportByPayment",
  "getQuantityOverstayReport",
  "getQuantityInOutReport",
]);
