export interface Mapper<I extends CSVRow, O extends QIFRow> {
    printHeaders(): void;
    printRow(row: I): void;
    map(rowNr: number, row: I): O;
}

export interface CSVRow extends Record<string, string> {

}

export interface QIFRow extends Record<string, string> {
    d: string;
    m?: string;
    t: string;
    p: string;
}
