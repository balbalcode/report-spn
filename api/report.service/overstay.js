export const overstayReportService = {
  getOverstayReportByDate
};

async function getOverstayReportByDate(month, spot_id) {
  const axios = window.$nuxt.$axios
  return await axios.get(`/v1/mgmt/reports/overstay?month=${month}&spot_id=${spot_id}`, {timeout: 500500}).then((data) => {
      if (data.status === 200) return data.data
  }).catch(error => {
      return Promise.reject(error);
  });
}