import { ref } from "vue";

export enum Status {
  IDLE,
  READING,
  WRITING,
  NOT_SUPPORTED,
}

export default () => {
  const error = ref<string | null>(null);
  if (!("NDEFReader" in window)) {
    error.value = "NFC not supported";
    return { error, status: Status.NOT_SUPPORTED };
  }

  const ndef = new NDEFReader();
  let ignoreRead = false;

  let readAbort: AbortController | null;
  let readTimeout: number;

  const latestRead = ref<NDEFReadingEvent>();
  const latestWrite = ref();
  const status = ref<Status>(Status.IDLE);

  ndef.onreading = (ev) => {
    if (!ignoreRead) {
      latestRead.value = ev;
    }
  };

  const startReading = (timeout?: number) => {
    if (readAbort) {
      throw new Error("Already reading NFC");
    }
    status.value = Status.READING;
    readAbort = new AbortController();
    ndef.scan({ signal: readAbort.signal }).catch((err) => (error.value = err));
    if (timeout) {
      readTimeout = window.setTimeout(stopReading, timeout);
    }
  };

  const stopReading = () => {
    if (readAbort) {
      readAbort.abort();
      readAbort = null;
      clearTimeout(readTimeout);
      status.value = Status.IDLE;
    }
  };

  const write = (
    data: any,
    timeout?: number
  ): { promise: Promise<unknown>; abort: () => void } => {
    const ctrl = new AbortController();
    let writeTimeout: number;
    let previousStatus = status.value;
    status.value = Status.WRITING;

    const abort = () => {
      ctrl.abort();
      clearTimeout(writeTimeout);
      status.value = previousStatus;
    };

    if (timeout) {
      writeTimeout = window.setTimeout(abort, timeout);
    }

    let promise = new Promise((resolve, reject) => {
      ctrl.signal.onabort = reject;
      ignoreRead = true;
      ndef.addEventListener(
        "reading",
        (event) => {
          ndef
            .write(data, { signal: ctrl.signal })
            .then(() => {
              latestWrite.value = data;
              resolve;
            }, reject)
            .finally(() => {
              ignoreRead = false;
            });
        },
        { once: true }
      );
    });
    return {
      promise,
      abort,
    };
  };

  return {
    ndef,
    status,
    startReading,
    stopReading,
    write,
    latestRead,
    latestWrite,
    error,
  };
};
