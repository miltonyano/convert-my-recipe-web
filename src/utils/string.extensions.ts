declare global {
  interface String {
    toUpperCaseFirst(): string;
  }
}

// eslint-disable-next-line no-extend-native
String.prototype.toUpperCaseFirst = function toUpperCaseFirst(): string {
  return this.charAt(0).toUpperCase() + this.slice(1);
};

export {};
