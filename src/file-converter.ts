import {QifTransaction, QifType} from "qif-ts/dist/types";
import fs from "fs";
import {CMBMapper} from "./mappers/cmb";
import csv from "csv-parser";
import {serializeQif} from "qif-ts";

export class FileConverter {
  convert(
    inputFile: string = "input.csv",
    outputFile: string = "output.qif"
  ): void {
    const qifTransactions: QifTransaction[] = [];

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
      .pipe(csv({separator: ";", mapHeaders: ({header}) => header.trim()}))
      .on("data", (row) => {
        const qifTransaction = mapper.map(rowNr++, row);
        qifTransactions.push(qifTransaction);
      })
      .on("end", () => {
        console.log("");
        const qifText = serializeQif({
          type: QifType.Bank,
          transactions: qifTransactions,
        });
        fs.writeFile(outputFile, qifText, (err) => {
          if (err) {
            console.log("Error writing QIF file", err);
          } else {
            console.log("QIF file created successfully");
          }
        });
      });
  }
}
