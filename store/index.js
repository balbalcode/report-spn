import Vue from "vue";
import Vuex from "vuex";
import spots from "@/store/modules/spot/storeSpot";
import officer from "@/store/modules/officer/storeOfficer";
import s3 from "@/store/modules/utility/storeS3";
import report from "@/store/modules/report/storeReport";
import product from "@/store/modules/product/storeProduct";
import user from "@/store/modules/user/storeUser";
import utility from "~/store/modules/utility/storeUtility";
import additional_service from "~/store/modules/additional-service/storeAdditionalService";

// v2 section
import v2Report from "~/store/modules/report/v2.storeReport";

Vue.use(Vuex);

export const store = new Vuex.Store({
  modules: {
    spots,
    officer,
    s3,
    report,
    product,
    user,
    utility,
    additional_service,
    v2Report,
  },
  strict: "production",
});
