import { ref } from "vue";

export default () => {
  if (!("NDEFReader" in window)) {
    return { error: "NFC not supported" };
  }

  const ndef = new NDEFReader();
  let ignoreRead = false;

  let readAbort: AbortController | null;
  let readTimeout: number;

  const startReading = (timeout?: number) => {
    if (readAbort) {
      throw new Error("Already reading NFC");
    }
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
    }
  };

  const write = (
    data: any,
    timeout?: number
  ): { promise: Promise<unknown>; abort: () => void } => {
    const ctrl = new AbortController();
    let promise = new Promise((resolve, reject) => {
      ctrl.signal.onabort = () => reject("Time is up, bailing out!");
      setTimeout(() => ctrl.abort(), timeout);
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
    return { promise, abort: () => ctrl.abort() };
  };

  return { ndef, startReading, stopReading, write };
};
