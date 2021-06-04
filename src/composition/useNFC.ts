import { ref } from "vue";

enum Status {
  IDLE,
  READING,
  WRITING
}

export default () => {
  if (!("NDEFReader" in window)) {
    return { error: "NFC not supported" };
  }

  const ndef = new NDEFReader();
  let ignoreRead = false;

  let readAbort: AbortController | null;
  let readTimeout: number;

  const latestRead = ref<NDEFReadingEvent>();
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
    ndef.scan({ signal: readAbort.signal });
    if (timeout) {
      readTimeout = setTimeout(() => stopReading, timeout);
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
    }
    
    if (timeout) {
      writeTimeout = setTimeout(abort, timeout);
    }

    let promise = new Promise((resolve, reject) => {
      ctrl.signal.onabort = reject;
      ignoreRead = true;
      ndef.addEventListener(
        "reading",
        (event) => {
          ndef
            .write(data, { signal: ctrl.signal })
            .then(resolve, reject)
            .finally(() => {
              ignoreRead = false;
            });
        },
        { once: true }
      );
    });
    return {
      promise,
      abort
    };
  };

  return { ndef, startReading, stopReading, write, latestRead };
};
