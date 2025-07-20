import {QifTransaction} from "qif-ts/dist/types";

export interface RowConverter<I extends Row> {
  printHeaders(): void;

  printRow(rowNr: number, row: I): void;

  convert(rowNr: number, row: I): QifTransaction;
}

export interface Row extends Record<string, any> {

}
