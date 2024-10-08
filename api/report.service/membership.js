import { helper } from "~/api/config/helper"

export const membershipReportService = {
    getMembershipReportPlateByDate, getMembershipReportCardByDate, getMembershipReportAll
};


async function getMembershipReportPlateByDate(filter) {
    let axios = window.$nuxt.$axios
    return await axios.get(`/v1/mgmt/reports/membership/license-plate?${helper(filter)}`, { timeout: 500500 }).then((data) => {
        if (data.status === 200) return data.data
    }).catch(error => {
        return Promise.reject(error);
    });
}

async function getMembershipReportCardByDate(filter) {
    let axios = window.$nuxt.$axios
    return await axios.get(`/v1/mgmt/reports/membership/card?${helper(filter)}`, { timeout: 500500 }).then((data) => {
        if (data.status === 200) return data.data
    }).catch(error => {
        return Promise.reject(error);
    });
}

async function getMembershipReportAll(spot_id) {
    let axios = window.$nuxt.$axios
    return await axios.get(`/v1/mgmt/reports/membership/all?spot_id=${spot_id}`, { timeout: 500500 }).then((data) => {
        if (data.status === 200) return data.data
    }).catch(error => {
        return Promise.reject(error);
    });
}



