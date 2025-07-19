import csv from "csv-parser";
import fs from "fs";
import moment from "moment";
import {CMBMapper} from "./src/mappers/cmb";

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
  inputFile: string = "input.csv",
  outputFile: string = "output.qif"
): void {
  const qifData: string[] = [];
  qifData.push("!Type:Bank");

  console.log(
    "Number of data rows in the csv file:",
    fs.readFileSync(inputFile, "utf8").split("\n").length - 2
  );

  let rowNr = 1;

  console.log("");
  const mapper = new CMBMapper();
  // TODO Ajouter assert sur les headers : "Date operation";"Date valeur";"Libelle";"Debit";"Credit"
    mapper.printHeaders();
  console.log("".padEnd(80, "-"));


  fs.createReadStream(inputFile)
    .pipe(csv({ separator: ";", mapHeaders: ({ header }) => header.trim() }))
    .on("data", (row) => {
      const qifRow = mapper.map(rowNr++, row);
      qifData.push("D" + qifRow.d);
      if (qifRow.m) {
        qifData.push("M" + qifRow.m);
      }
      qifData.push("T" + qifRow.t);
      qifData.push("P" + qifRow.p);
      qifData.push("^");
    })
    .on("end", () => {
      console.log("");
      fs.writeFile(outputFile, qifData.join("\n"), (err) => {
        if (err) {
          console.log("Error writing QIF file", err);
        } else {
          console.log("QIF file created successfully");
        }
      });
    });
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
