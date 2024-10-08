import utility from "~/plugins/utilities";
import logger from "~/plugins/sentry";
export default ({ app }, inject) => {
  inject("utility", utility);
  inject("logger", logger);
};
