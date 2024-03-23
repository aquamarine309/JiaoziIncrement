export const mixtureTypes = {
  salt: {
    id: "salt",
    name: "salt",
    purpose: "scs",
    effectFn: value => Decimal.sqrt(value).clampMin(1),
    className: "steamer"
  },
  sauses: {
    id: "sauses",
    name: "sause",
    purpose: "makers",
    effectFn: value => Decimal.pow(value, 5).clampMin(1),
  },
  vinegar: {
    id: "vinegar",
    name: "vinegar",
    purpose: "collections",
    effectFn: value => Math.clampMin(Math.pow(value.add(1).log10() / 2 + 1, 3.14), 1),
    className: "collection"
  }
}