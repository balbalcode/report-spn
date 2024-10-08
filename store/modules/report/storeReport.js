import {incomeReportService} from '@/api/report.service/income'
import {motorcycleReportService} from "@/api/report.service/motorcycle";
import {casualReportService} from "@/api/report.service/casual";
import {cashlessReportService} from "@/api/report.service/cashless";
import {durationReportService} from "~/api/report.service/duration";
import {membershipReportService} from "@/api/report.service/membership";
import {dailyReportService} from "@/api/report.service/daily";
import {ticketReportService} from "~/api/report.service/ticket";
import {overstayReportService} from "~/api/report.service/overstay";
import {shiftReportService} from "~/api/report.service/shift";
import {officerStatReportService} from "~/api/report.service/officer-stat";
import {additionalReportService} from "~/api/report.service/additional-service";
import {transactionReportService} from "~/api/report.service/transaction";
import {problemTicketReportService} from "~/api/report.service/problem-ticket";
import {administrationReportService} from "~/api/report.service/administration";
import {attendanceReportService} from "~/api/report.service/attendance";
import {visitorReportService} from "~/api/report.service/visitor";
import {counterReportService} from "@/api/report.service/counter";
import {vehicleValidationReportService} from "@/api/report.service/vehicle-validation";
import {gateOpenReportService} from "@/api/report.service/gate-open";

const state = () => ({
    data: {},
    currentData: {}
});

const getters = {}


const actions = {
    getIncomeReport({commit, dispatch}, spot_id) {
        return incomeReportService.getIncomeReport(spot_id).then(data => {
            commit('returnData', data.values)
            return data.values
        }).catch((error) => {
            dispatch("modules/utility/storeUtility/setDefaultErrorAlert", {
                message: error.response.data.message,
                opener: payload.opener
            }, {root: true})
            throw error
        })
    },
    getIncomeReportByDate({commit, dispatch}, payload) {
        return incomeReportService.getIncomeReportByDate(payload.month, payload.spot_id).then(data => {
            commit('returnData', data.values)
            return data.values
        }).catch((error) => {
            dispatch("modules/utility/storeUtility/setDefaultErrorAlert", {
                message: error.response.data.message,
                opener: payload.opener
            }, {root: true})
            throw error
        })
    },

    getMotorcycleReport({commit, dispatch}, spot_id) {
        return motorcycleReportService.getMotorcycleReport(spot_id).then(data => {
            commit('returnData', data.values)
            return data.values
        }).catch((error) => {
            dispatch("modules/utility/storeUtility/setDefaultErrorAlert", {
                message: error.response.data.message,
                opener: payload.opener
            }, {root: true})
            throw error
        })
    },
    getMotorcycleReportByDate({commit, dispatch}, payload) {
        return motorcycleReportService.getMotorcycleReportByDate(payload.month, payload.spot_id).then(data => {
            commit('returnData', data.values)
            return data.values
        }).catch((error) => {
            dispatch("modules/utility/storeUtility/setDefaultErrorAlert", {
                message: error.response.data.message,
                opener: payload.opener
            }, {root: true})
            throw error
        })
    },

    getCasualReportIncome({commit, dispatch}, spot_id) {
        return casualReportService.getCasualReportIncome(spot_id).then(data => {
            commit('returnData', data.values)
            return data.values
        }).catch((error) => {
            dispatch("modules/utility/storeUtility/setDefaultErrorAlert", {
                message: error.response.data.message,
                opener: payload.opener
            }, {root: true})
            throw error
        })
    },
    getCasualReportIncomeByDate({commit, dispatch}, payload) {
        return casualReportService.getCasualReportIncomeByDate(payload.month, payload.spot_id).then(data => {
            commit('returnData', data.values)
            return data.values
        }).catch((error) => {
            dispatch("modules/utility/storeUtility/setDefaultErrorAlert", {
                message: error.response.data.message,
                opener: payload.opener
            }, {root: true})
            throw error
        })
    },

    getCasualReportQuantity({commit, dispatch}, spot_id) {
        return casualReportService.getCasualReportQuantity(spot_id).then(data => {
            commit('returnData', data.values)
            return data.values
        }).catch((error) => {
            dispatch("modules/utility/storeUtility/setDefaultErrorAlert", {
                message: error.response.data.message,
                opener: payload.opener
            }, {root: true})
            throw error
        })
    },
    getCasualReportQuantityByDate({commit, dispatch}, payload) {
        return casualReportService.getCasualReportQuantityByDate(payload.month, payload.spot_id).then(data => {
            commit('returnData', data.values)
            return data.values
        }).catch((error) => {
            dispatch("modules/utility/storeUtility/setDefaultErrorAlert", {
                message: error.response.data.message,
                opener: payload.opener
            }, {root: true})
            throw error
        })
    },

    getCashlessReportIncome({commit, dispatch}, spot_id) {
        return cashlessReportService.getCashlessReportIncome(spot_id).then(data => {
            commit('returnData', data.values)
            return data.values
        }).catch((error) => {
            dispatch("modules/utility/storeUtility/setDefaultErrorAlert", {
                message: error.response.data.message,
                opener: payload.opener
            }, {root: true})
            throw error
        })
    },
    getCashlessReportIncomeByDate({commit, dispatch}, payload) {
        return cashlessReportService.getCashlessReportIncomeByDate(payload.month, payload.spot_id).then(data => {
            commit('returnData', data.values)
            return data.values
        }).catch((error) => {
            dispatch("modules/utility/storeUtility/setDefaultErrorAlert", {
                message: error.response.data.message,
                opener: payload.opener
            }, {root: true})
            throw error
        })
    },

    getCashlessReportQuantity({commit, dispatch}, spot_id) {
        return cashlessReportService.getCashlessReportQuantity(spot_id).then(data => {
            commit('returnData', data.values)
            return data.values
        }).catch((error) => {
            dispatch("modules/utility/storeUtility/setDefaultErrorAlert", {
                message: error.response.data.message,
                opener: payload.opener
            }, {root: true})
            throw error
        })
    },
    getCashlessReportQuantityByDate({commit, dispatch}, payload) {
        return cashlessReportService.getCashlessReportQuantityByDate(payload.month, payload.spot_id).then(data => {
            commit('returnData', data.values)
            return data.values
        }).catch((error) => {
            dispatch("modules/utility/storeUtility/setDefaultErrorAlert", {
                message: error.response.data.message,
                opener: payload.opener
            }, {root: true})
            throw error
        })
    },

    getQuantityDurationReport({commit, dispatch}, payload) {
        return durationReportService.get(payload.filter).then(data => {
            commit('returnData', data.values)
            return data.values
        }).catch((error) => {
            dispatch("modules/utility/storeUtility/setDefaultErrorAlert", {
                message: error.response.data.message,
                opener: payload.opener
            }, {root: true})
            throw error
        })
    },

    requestAllQuantityDurationReport({commit, dispatch}, payload) {
        return durationReportService.requestAll(payload).then(data => {
            dispatch("modules/utility/storeUtility/setDefaultSuccessAlert", {
                message: data.message
            }, {root: true})
        }).catch((error) => {
            dispatch("modules/utility/storeUtility/setDefaultErrorAlert", {
                message: error.response.data.message,
            }, {root: true})
            throw error
        })
    },

    getMembershipReportPlateByDate({commit, dispatch}, payload) {
        return membershipReportService.getMembershipReportPlateByDate(payload.filter).then(data => {
            commit('returnData', data.values)
            return data.values
        }).catch((error) => {
            dispatch("modules/utility/storeUtility/setDefaultErrorAlert", {
                message: error.response.data.message,
                opener: payload.opener
            }, {root: true})
            throw error
        })
    },
    getMembershipReportCardByDate({commit, dispatch}, payload) {
        return membershipReportService.getMembershipReportCardByDate(payload.filter).then(data => {
            commit('returnData', data.values)
            return data.values
        }).catch((error) => {
            dispatch("modules/utility/storeUtility/setDefaultErrorAlert", {
                message: error.response.data.message,
                opener: payload.opener
            }, {root: true})
            throw error
        })
    },
    getMembershipReportAll({commit, dispatch}, payload) {
        return membershipReportService.getMembershipReportAll(payload.spot_id).then(data => {
            commit('returnData', data.values)
            return data.values
        }).catch((error) => {
            dispatch("modules/utility/storeUtility/setDefaultErrorAlert", {
                message: error.response.data.message,
                opener: payload.opener
            }, {root: true})
            throw error
        })
    },

    getDailyReportByDate({commit, dispatch}, payload) {
        return dailyReportService.getDailyReportByDate(payload.date, payload.spot_id).then(data => {
            commit('returnData', data.values)
            return data.values
        }).catch((error) => {
            dispatch("modules/utility/storeUtility/setDefaultErrorAlert", {
                message: error.response.data.message,
                opener: payload.opener
            }, {root: true})
            throw error
        })
    },

    getDailyStatsByDate({commit, dispatch}, payload) {
        return dailyReportService.getDailyStatsByDate(payload.date, payload.spot_id).then(data => {
            commit('returnData', data.values)
            return data.values
        }).catch((error) => {
            dispatch("modules/utility/storeUtility/setDefaultErrorAlert", {
                message: error.response.data.message,
                opener: payload.opener
            }, {root: true})
            throw error
        })
    },

    getLostTicketReport({commit, dispatch}, payload) {
        return ticketReportService.getTicketReportByDate(payload.filter).then(data => {
            commit('returnData', data.values)
            return data.values
        }).catch((error) => {
            dispatch("modules/utility/storeUtility/setDefaultErrorAlert", {
                message: error.response.data.message,
                opener: payload.opener
            }, {root: true})
            throw error
        })
    },

    getOverstayReportByDate({commit, dispatch}, payload) {
        return overstayReportService.getOverstayReportByDate(payload.month, payload.spot_id).then(data => {
            commit('returnData', data.values)
            return data.values
        }).catch((error) => {
            dispatch("modules/utility/storeUtility/setDefaultErrorAlert", {
                message: error.response.data.message,
                opener: payload.opener
            }, {root: true})
            throw error
        })
    },

    getShiftReportByDate({commit, dispatch}, payload) {
        return shiftReportService.getShiftReportByDate(payload.month, payload.spot_id, payload.vehicle_codes, payload.type).then(data => {
            commit('returnData', data.values)
            return data.values
        }).catch((error) => {
            dispatch("modules/utility/storeUtility/setDefaultErrorAlert", {
                message: error.response.data.message,
                opener: payload.opener
            }, {root: true})
            throw error
        })
    },

    getOfficerStatReport({commit, dispatch}, payload) {
        return officerStatReportService.getOfficerReport(payload.month, payload.spot_id).then(data => {
            commit('returnData', data.values)
            return data.values
        }).catch((error) => {
            dispatch("modules/utility/storeUtility/setDefaultErrorAlert", {
                message: error.response.data.message,
                opener: payload.opener
            }, {root: true})
            throw error
        })
    },


    getAdditionalReportByDate({commit, dispatch}, payload) {
        return additionalReportService.getAdditionalReportByDate(payload.month, payload.spot_id, payload.service).then(data => {
            commit('returnData', data.values)
            return data.values
        }).catch((error) => {
            dispatch("modules/utility/storeUtility/setDefaultErrorAlert", {
                message: error.response.data.message,
                opener: payload.opener
            }, {root: true})
            throw error
        })
    },

    getAdminShiftDetailReportByDate({commit, dispatch}, payload) {
        return shiftReportService.getAdminShiftDetailReportByDate(payload.date, payload.spot_id).then(data => {
            commit('returnData', data.values)
            return data.values
        }).catch((error) => {
            dispatch("modules/utility/storeUtility/setDefaultErrorAlert", {
                message: error.response.data.message,
                opener: payload.opener
            }, {root: true})
            throw error
        })
    },

    getAdminShiftReportByDate({commit, dispatch}, payload) {
        return shiftReportService.getAdminShiftReportByDate(payload.date, payload.spot_id).then(data => {
            commit('returnData', data.values)
            return data.values
        }).catch((error) => {
            dispatch("modules/utility/storeUtility/setDefaultErrorAlert", {
                message: error.response.data.message,
                opener: payload.opener
            }, {root: true})
            throw error
        })
    },

    getTransactionReport({commit, dispatch}, payload) {
        return transactionReportService.getTransactionReport(payload.filter).then(data => {
            commit('returnData', data.values)
            return data.values
        }).catch((error) => {
            dispatch("modules/utility/storeUtility/setDefaultErrorAlert", {
                message: error.response.data.message,
                opener: payload.opener
            }, {root: true})
            throw error
        })
    },

    requestTransactionReport({commit, dispatch}, payload) {
        return transactionReportService.requestTransactionReport(payload).then(data => {
            dispatch("modules/utility/storeUtility/setDefaultSuccessAlert", {
                message: data.message,
                opener: payload.opener
            }, {root: true})
            return data.values
        }).catch((error) => {
            dispatch("modules/utility/storeUtility/setDefaultErrorAlert", {
                message: error.response.data.message,
                opener: payload.opener
            }, {root: true})
            throw error
        })
    },

    getProblemTicketReport({commit, dispatch}, payload) {
        return problemTicketReportService.getProblemTicketReport(payload.filter).then(data => {
            commit('returnData', data.values)
            return data.values
        }).catch((error) => {
            dispatch("modules/utility/storeUtility/setDefaultErrorAlert", {
                message: error.response.data.message,
            }, {root: true})
            throw error
        })
    },

    getAdministrationReport({commit, dispatch}, payload) {
        return administrationReportService.getAdministrationReport(payload.filter).then(data => {
            commit('returnData', data.values)
            return data.values
        }).catch((error) => {
            dispatch("modules/utility/storeUtility/setDefaultErrorAlert", {
                message: error.response.data.message,
                opener: payload.opener
            }, {root: true})
            throw error
        })
    },

    getAttendanceReport({ commit, dispatch }, payload) {
      return attendanceReportService.getAttendanceReport(payload.filter).then(data => {
        return data.values
      }).catch((error) => {
        dispatch("modules/utility/storeUtility/setDefaultErrorAlert", {
          message: error.response.data.message,
          opener: payload.opener
        }, { root: true })
        throw error
      })
    },

    getLeaveReport({ commit, dispatch }, payload) {
      return attendanceReportService.getLeaveReport(payload.filter).then(data => {
        return data
      }).catch((error) => {
        dispatch("modules/utility/storeUtility/setDefaultErrorAlert", {
          message: error.response.data.message
        }, { root: true })
        throw error
      })
    },

    getVisitorReportByDate({commit, dispatch}, payload) {
        return visitorReportService.getVisitorReportByDate(payload.date, payload.spot_id).then(data => {
            commit('returnData', data.values)
            return data.values
        }).catch((error) => {
            dispatch("modules/utility/storeUtility/setDefaultErrorAlert", {
                message: error.response.data.message,
                opener: payload.opener
            }, {root: true})
            throw error
        })
    },

    getCounterReportByDate({commit, dispatch}, payload) {
        return counterReportService.getCounterReportByDate(payload.month, payload.spot_id, payload.vehicle_codes).then(data => {
            commit('returnData', data.values)
            return data.values
        }).catch((error) => {
            dispatch("modules/utility/storeUtility/setDefaultErrorAlert", {
                message: error.response.data.message,
                opener: payload.opener
            }, {root: true})
            throw error
        })
    },

    getVehicleValidationReport({ commit, dispatch }, payload) {
      return vehicleValidationReportService.get(payload.filter, payload.pagination, payload.order).then(data => {
        return data.values
      }).catch((error) => {
        dispatch("modules/utility/storeUtility/setDefaultErrorAlert", {
          message: error.response.data.message,
          opener: payload.opener
        }, { root: true })
        throw error
      })
    },

    requestAllVehicleValidationReport({ commit, dispatch }, payload) {
      return vehicleValidationReportService.requestAll(payload).then(data => {
        dispatch("modules/utility/storeUtility/setDefaultSuccessAlert", {
            message: data.message
        }, {root: true})
      }).catch((error) => {
        dispatch("modules/utility/storeUtility/setDefaultErrorAlert", {
          message: error.response.data.message,
        }, { root: true })
        throw error
      })
    },

    getGateOpenReport({ commit, dispatch }, payload) {
      return gateOpenReportService.getGateOpenReport(payload.filter).then(data => {
        return data.values
      }).catch((error) => {
        dispatch("modules/utility/storeUtility/setDefaultErrorAlert", {
          message: error.response.data.message,
          opener: payload.opener
        }, { root: true })
        throw error
      })
    },
};

const mutations = {
    returnData(state, data) {
        return data.values
    },

    clearData(state) {
        state.data = {}
        return ''
    }
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
};
