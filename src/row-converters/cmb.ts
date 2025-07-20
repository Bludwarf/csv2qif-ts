import {Row, RowConverter} from "../row-converter";
import moment from "moment/moment";
import {QifTransaction} from "qif-ts/dist/types";

export class CMBRowConverter implements RowConverter<CMBRow> {
  printHeaders() {
    this.printRowStrings(
      "Row",
      "Date",
      "Libelle",
      "Debit",
      "Credit",
    );
  }

  printRow(rowNr: number, row: CMBRow) {
    this.printRowStrings(
      String(rowNr),
      String(row["Date operation"]),
      row.Libelle,
      String(row.Debit),
      String(row.Credit),
    );
  }

  printRowStrings(rowNr: string,
                  dateOperation: string, // date
                  libelle: string, // memo
                  debit: string,
                  credit: string,) {
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

  convert(rowNr: number, row: CMBRow): QifTransaction {
    const SrcDate = row["Date operation"];
    this.printRow(rowNr, row);

    const dateOperation = moment(SrcDate, "DD/MM/YYYY");
    let dateOperationString: string;

    if (dateOperation.isValid()) {
      dateOperationString = dateOperation.format("DD/MM/YY");
    } else {
      dateOperationString = " - invalid date " + SrcDate + "";
      console.log("Invalid date:", SrcDate);
    }

    return {
      date: dateOperationString,
      amount: this.getAmount(row),
      memo: row.Libelle.trim(),
      payee: this.getPayee(row),
    }
  }

  private getAmount(row: CMBRow): number {
    const debit = parseAmount(row.Debit);
    const credit = parseAmount(row.Credit);
    return credit - debit;
  }

  private getPayee(row: CMBRow): string | undefined {
    const regexpList: RegExp[] = [
      /CARTE \d\d\/\d\d (.+)/,
      /PRLV (.+)/,
    ]
    for (const regexp of regexpList) {
      const m = regexp.exec(row.Libelle);
      if (m) {
        return m[1];
      }
    }
    return undefined;
  }
}

function parseAmount(amount: CMBAmount): number {
  if (typeof (amount) === "number") {
    return amount;
  }
  const amountInCents = +amount.replace(',', '');
  const amountAsNumber: Cents = amountInCents / 100;
  checkAmountDecimals(amountAsNumber);
  return amountAsNumber;
}

function checkAmountDecimals(amountAsNumber: number) {
  const amountAsString = amountAsNumber + '';
  const commaIndex = amountAsString.indexOf('.');
  if (commaIndex !== -1) {
    const decimalsLength = amountAsString.length - (commaIndex + 1);
    if (decimalsLength > 2) {
      throw new Error(`Trop de décimales : ${decimalsLength}`);
    }
  }
}

type CMBAmount = string | number;
type Cents = number;

interface CMBRow extends Row {
  "Date operation": string | Date; // date
  Libelle: string; // memo
  Debit: CMBAmount;
  Credit: CMBAmount;
}
