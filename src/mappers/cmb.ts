import {CSVRow, Mapper, QIFRow} from "../mapper";
import moment from "moment/moment";
import { QifData } from 'qif-ts';
import {QifTransaction} from "qif-ts/dist/types";

export class CMBMapper implements Mapper<CMBCSVRow> {
    printHeaders() {
        this.printRowStrings(
            "Row",
            "Date",
            "Libelle",
            "Debit",
            "Credit",
        );
    }

    printRow(rowNr: number, row: CMBCSVRow) {
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

    map(rowNr: number, row: CMBCSVRow): QifTransaction {
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
            amount: this.t(row),
            memo: row.Libelle.trim(),
        }
    }

    t(row: CMBCSVRow): number {
        const debit = parseAmount(row.Debit);
        const credit = parseAmount(row.Credit);
        return credit-debit;
    }

}

function parseAmount(amount: CMBAmount): number {
    if (typeof(amount) === "number") {
        return amount;
    }
    return +(amount.replace(',', '')) / 100;
}

function parseAmountAsCents(amount: CMBAmount): Cents {
    if (typeof(amount) === "number") {
        return amount * 100;
    }
    return +(amount.replace(',', ''));
}

function formatAmountAsCents(amountAsCents: Cents): string {
    const centsString = '' + (amountAsCents);
    return centsString.slice(0, -2) + ',' +  centsString.slice(-2);
}

type CMBAmount = string | number;
type Cents = number;

interface CMBCSVRow extends CSVRow {
    "Date operation": string | Date; // date
    Libelle: string; // memo
    Debit: CMBAmount;
    Credit: CMBAmount;
}

interface CMBQIFRow extends QIFRow {

}
