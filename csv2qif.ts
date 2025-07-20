import fs from "fs";
import {FileConverter} from "./src/file-converter";
import {DirectoryConverter} from "./src/directory-converter";
import {CMBRowConverter} from "./src/row-converters/cmb";

function printRow(
  rowNr: string | number,
  dateOperation: string | Date, // date
  libelle: string, // memo
  debit: string | number,
  credit: string | number,
) {
  console.log(
    String(rowNr).padEnd(3),
    " | ",
    String(dateOperation).padEnd(10),
    " | ",
    String(debit).padStart(10),
    " | ",
    String(credit).padStart(10),
    " | ",
    libelle.padEnd(20)
  );
}

function csv2qif(
  inputFile?: string,
  outputFile?: string
): void {
  const rowConverter = new CMBRowConverter();
  const converter = inputFile && fs.lstatSync(inputFile).isDirectory()
    ? new DirectoryConverter(rowConverter)
    : new FileConverter(rowConverter);
  converter.convert(inputFile, outputFile);
}

// Usage:
const args = process.argv.slice(2);
switch (args.length) {
  case 0:
    csv2qif();
    break;
  case 1:
    csv2qif(args[0]);
    break;
  default:
    csv2qif(args[0], args[1]);
}

// TODO tester : "02/05/2022";"02/05/2022";"CARTE 30/04 SUPER U 35 ROMILLE";"38,02";""
// TODO tester : "30/04/2025";"30/04/2025";"vers Coffre";"50,00";""
// TODO tester : "30/04/2025";"30/04/2025";"VIR CPAM ILLE ET VILAINE";"";"112,49"
