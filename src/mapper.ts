import {QifTransaction} from "qif-ts/dist/types";

export interface Mapper<I extends CSVRow> {
  printHeaders(): void;

  printRow(rowNr: number, row: I): void;

  map(rowNr: number, row: I): QifTransaction;
}

export interface CSVRow extends Record<string, any> {

}
