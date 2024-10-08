import { mapGetters } from 'vuex'

export const authenticationGetters = mapGetters('modules/auth/storeAuth', ['getNotification'])
export const dashboardGetters  =  mapGetters('modules/dashboard/storeDashboard', ['getReport'])
export const notificationGetters = mapGetters('modules/utility/storeNotification', ["getUploadedNotification"])
export const shiftGetters = mapGetters('modules/shift/storeShift', ["getUploadedShift"])
export const utilityGetters = mapGetters('modules/utility/storeUtility', ["getAlert", "getOptionSpot"])
export const spotGetters = mapGetters("modules/spot/storeSpot", ["getStateCurrentSpot"])
