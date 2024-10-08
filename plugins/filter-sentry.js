import { ignored_error } from "../config/ignored_error_sentry";

export default function (context) {
  return {
    beforeSend(event, hint) {
      if (ignored_error.indexOf(event.message) >= 0) {
        return null;
      } else {
        return event;
      }
    },
  };
}
