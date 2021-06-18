/**
 * WARNING: I have no clue how to write tests for this since it interface with a physical device
 */

import useNFC, { NFCStatus } from "./useNFC";
import { mocked } from "ts-jest/utils";

describe("NDEFReader is mocked on global object", () => {
  it("Can create a new NDEFReader object", () => {
    let ndef = mocked(new NDEFReader());

    expect(ndef).toBeDefined();
    ndef.scan();
    expect(ndef.scan.mock.calls.length).toBe(1);
  });
});

describe("useNFC", () => {
  let {ndef: _ndef, ...nfc} = useNFC();
  let ndef = mocked(_ndef);
  it("Computes the correct status", () => {
    const { _setStatus } = nfc.debug;
    expect(nfc.status.value).toBe(NFCStatus.IDLE);
    _setStatus(NFCStatus.READING, true);
    expect(nfc.status.value).toBe(NFCStatus.READING);
    _setStatus(NFCStatus.WRITING, true);
    expect(nfc.status.value).toBe(NFCStatus.WRITING);
    _setStatus(NFCStatus.READING, false);
    expect(nfc.status.value).toBe(NFCStatus.WRITING);
    _setStatus(NFCStatus.WRITING, false);
    expect(nfc.status.value).toBe(NFCStatus.IDLE);
    _setStatus(NFCStatus.NOT_SUPPORTED, true);
    expect(nfc.status.value).toBe(NFCStatus.NOT_SUPPORTED);
    _setStatus(NFCStatus.NOT_SUPPORTED, false);
    expect(nfc.status.value).toBe(NFCStatus.IDLE);
  });

  it("Passes write data to NDEFReader", () => {
    let data = { foo: "bar" };
    nfc.write(data);
    expect(ndef.write.mock.calls[0][0]).toBe(data);
    expect(nfc.status.value).toBe(NFCStatus.WRITING);
  });

  it("Calling a new write overrides old one with new parameters", () => {
    let data = { foo: "bar2" };
    nfc.write(data);
    expect(ndef.write.mock.calls[1][0]).toBe(data);
  });
});
