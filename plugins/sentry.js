import * as Sentry from "@sentry/browser";
let transactions = {};
let span = {};

export default {
  initTracer(name, tags) {
    transactions[`${name}`] = Sentry.startTransaction({
      name: name,
      op: "mark",
      tags: tags,
    });
  },

  addLoggerUiRender({ context, description, data }) {
    this.addLoggerOther({
      context: context,
      description: description,
      data: data,
      op: "ui.render",
    });
  },

  addLoggerUiClick({ context, description, data }) {
    this.addLoggerOther({
      context: context,
      description: description,
      data: data,
      op: "ui.action.click",
    });
  },

  addLoggerUiInput({ context, description, data }) {
    this.addLoggerOther({
      context: context,
      description: description,
      data: data,
      op: "ui.task",
    });
  },

  addLoggerFunction({ context, description, data }) {
    this.addLoggerOther({
      context: context,
      description: description,
      data: data,
      op: "function",
    });
  },

  addLoggerAPI({ context, description, data }) {
    this.addLoggerOther({
      context: context,
      description: description,
      data: data,
      op: "http.client",
    });
  },

  addLoggerMark({ context, description, data }) {
    this.addLoggerOther({
      context: context,
      description: description,
      data: data,
      op: "mark",
    });
  },

  addLoggerOther({ context, description, data, operation }) {
    if (transactions[`${context}`]) {
      span[`${description}`] = transactions[`${context}`].startChild({
        op: operation,
        description: description,
        data: data,
      });
    }
  },

  setStatusLogger(name, status) {
    if (span[`${name}`]) {
      span[`${name}`].finish();
    }
  },

  setStatusTracer(name, status) {
    if (transactions[`${name}`]) {
      transactions[`${name}`].finish();
    }
  },

  finishLogger(name) {
    if (span[`${name}`]) {
      span[`${name}`].finish();
    }
  },

  finishTracer(name) {
    if (transactions[`${name}`]) {
      transactions[`${name}`].finish();
    }
  },
};
