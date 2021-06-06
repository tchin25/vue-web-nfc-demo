import { ref, computed } from "vue";
import { tryOnUnmounted } from "@vueuse/shared";

export enum NFCStatus {
  IDLE,
  READING,
  WRITING,
  NOT_SUPPORTED,
}

export default () => {
  const error = ref<string | null>(null);
  const status = computed<NFCStatus>(() => {
    return _status.value.reduce((prev, curr) => {
      return prev > curr ? prev : curr;
    });
  });

  const _status = ref<NFCStatus[]>(new Array(4));

  const _setStatus = (nfcStatus: NFCStatus, value: boolean) => {
    _status.value[nfcStatus] = value ? nfcStatus : -1;
  }

  _setStatus(NFCStatus.IDLE, true);

  if (!("NDEFReader" in window)) {
    error.value = "NFC not supported";
    _setStatus(NFCStatus.NOT_SUPPORTED, true);
  }

  const _ndef = new NDEFReader();
  let _ignoreRead = false;

  let _readAbort = new AbortController();
  let _readTimeout: number;
  const latestRead = ref<NDEFReadingEvent>();

  let _writeAbort = new AbortController();
  let _writeTimeout: number;
  const latestWrite = ref();

  _ndef.onreading = (ev) => {
    if (!_ignoreRead) {
      latestRead.value = ev;
    }
  };

  const startReading = (timeout?: number) => {
    if (_status.value[NFCStatus.READING] === NFCStatus.READING) {
      throw new Error("Already reading NFC");
    }
    _readAbort = new AbortController();
    _setStatus(NFCStatus.READING, true);
    if (timeout) {
      _readTimeout = window.setTimeout(stopReading, timeout);
    }

    return _ndef
      .scan({ signal: _readAbort.signal })
      .catch((err) => (error.value = err));
  };

  const stopReading = () => {
    _readAbort.abort();
    _readAbort = new AbortController();
    clearTimeout(_readTimeout);
    _setStatus(NFCStatus.READING, false);
  };

  // TODO: Prevent native read immediately after write
  const write = (data: any, timeout?: number): Promise<unknown> => {
    if (_status.value[NFCStatus.WRITING] === NFCStatus.WRITING) {
      throw new Error("Already writing NFC");
    }

    _writeAbort = new AbortController();
    _setStatus(NFCStatus.WRITING, true);
    _ignoreRead = true;

    if (timeout) {
      _writeTimeout = window.setTimeout(abortWrite, timeout);
    }

    return new Promise((resolve, reject) => {
      _writeAbort.signal.onabort = reject;
      _ndef
        .write(data, { signal: _writeAbort.signal })
        .then(() => {
          latestWrite.value = data;
          resolve;
        }, reject)
        .finally(() => {
          clearTimeout(_writeTimeout);
          _ignoreRead = false;
          _setStatus(NFCStatus.WRITING, false);
        });
    });
  };

  const abortWrite = () => {
    _writeAbort.abort();
    _writeAbort = new AbortController();
    clearTimeout(_writeTimeout);
    _ignoreRead = false;
    _setStatus(NFCStatus.WRITING, false);
  };

  tryOnUnmounted(() => {
    stopReading();
    abortWrite();
  });

  return {
    ndef: _ndef,
    status,
    startReading,
    stopReading,
    write,
    abortWrite,
    latestRead,
    latestWrite,
    error,
  };
};
