import {CSVRow, Mapper, QIFRow} from "../mapper";
import moment from "moment/moment";

export class CMBMapper implements Mapper<CMBCSVRow, CMBQIFRow> {
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

    map(rowNr: number, row: CMBCSVRow): CMBQIFRow {
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

        // qifData.push("M" + row.Libelle); // On inverse volontairement Mémo et Tiers (idem CMB)
        return {
            d: dateOperationString,
            t: this.t(row),
            p: row.Libelle.trim(), // On inverse volontairement Mémo et Tiers (idem CMB)
        }
    }

    t(row: CMBCSVRow): string {
        const debitAsCents = parseAmountAsCents(row.Debit);
        const creditAsCents = parseAmountAsCents(row.Credit);
        const diffAsCents = creditAsCents-debitAsCents;
        return formatAmountAsCents(diffAsCents);
    }

}

function parseAmountAsCents(amount: number | string): Cents {
    if (typeof(amount) === "number") {
        return amount * 100;
    }
    return +(amount.replace(',', ''));
}

function formatAmountAsCents(amountAsCents: Cents): string {
    const centsString = '' + (amountAsCents);
    return centsString.slice(0, -2) + ',' +  centsString.slice(-2);
}

type Cents = number;

interface CMBCSVRow extends CSVRow {
    "Date operation": string | Date; // date
    Libelle: string; // memo
    Debit: string | number;
    Credit: string | number;
}

interface CMBQIFRow extends QIFRow {

}
