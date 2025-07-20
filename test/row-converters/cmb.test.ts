import {CMBRowConverter} from "../../src/row-converters/cmb";

describe('CMBRowConverter', () => {

  const rowConverter = new CMBRowConverter();

  test('convert', () => {
    // "Date operation";"Date valeur";"Libelle";"Debit";"Credit"
    // "05/07/2025";"05/07/2025";"CARTE 04/07 DING FRING ST GREGOIRE";"13,00";""
    const t = rowConverter.convert(1, {
      "Date operation": "05/07/2025",
      "Date valeur": "05/07/2025",
      "Libelle": "CARTE 04/07 DING FRING ST GREGOIRE",
      "Debit": "13,00",
      "Credit": "",
    })

    // TODO assert transaction
  })
})
