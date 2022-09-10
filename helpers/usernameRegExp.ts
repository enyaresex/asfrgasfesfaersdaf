export default function usernameRegExp(value: string) {
  const res = /^[\dA-Za-z\s\-_wığüşöçĞÜŞÖÇİ\u0621-\u064A\s\d]+$/.test(value);
  return res;
}
