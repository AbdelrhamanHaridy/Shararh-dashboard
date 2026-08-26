import { Injectable } from '@angular/core';
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { PotentialCustomerCenterService } from '../services/potential-customer-center.service';

export interface ParsedLeadRow {
  name: string;
  phone: string;
  activity_name: string;
  governorate: string;
  city: string;
  street_name: string;
  source: string;
  notes: string;
}

// Same placeholder list used in the create-lead dialog — replace with a
// real API-backed list if/when one exists.
const GOVERNORATES = [
  { label: 'القاهرة', value: 'cairo' },
  { label: 'الجيزة', value: 'giza' },
  { label: 'الإسكندرية', value: 'alexandria' },
  { label: 'الدقهلية', value: 'dakahlia' },
  { label: 'الشرقية', value: 'sharqia' },
];

const REQUIRED_COLUMNS = [
  'name',
  'phone',
  'activity_name',
  'governorate',
  'city',
  'street_name',
  'source',
];

@Injectable({
  providedIn: 'root',
})
export class PotentialCustomerCenterExcelService {
  constructor(private potentialCustomerService: PotentialCustomerCenterService) {}

  async generateLeadsTemplate() {
    const workbook = new ExcelJS.Workbook();
    const ws = workbook.addWorksheet('Leads Template');

    ws.columns = [
      { header: 'Name', key: 'name', width: 25 },
      { header: 'Phone', key: 'phone', width: 20 },
      { header: 'Activity Name', key: 'activity_name', width: 25 },
      { header: 'Governorate', key: 'governorate', width: 20 },
      { header: 'City', key: 'city', width: 20 },
      { header: 'Street Name', key: 'street_name', width: 25 },
      { header: 'Source', key: 'source', width: 20 },
      { header: 'Notes', key: 'notes', width: 30 },
    ];

    const sourcesRes: any = await this.potentialCustomerService.getSources().toPromise();
    const sources = sourcesRes?.data?.sources ?? [];
    const sourceLabels: string[] = Array.isArray(sources)
      ? sources.map((s: any) => s.label ?? s.name ?? String(s.value ?? ''))
      : [];

    const listSheet = workbook.addWorksheet('Lists');
    listSheet.state = 'veryHidden';

    const governorateRange = this.addListToSheet(
      listSheet,
      GOVERNORATES.map((g) => g.label),
      'Governorates',
      1,
    );
    const sourceRange = this.addListToSheet(listSheet, sourceLabels, 'Sources', 2);

    for (let row = 2; row <= 500; row++) {
      ws.getCell(`D${row}`).dataValidation = {
        type: 'list',
        allowBlank: false,
        formulae: [`=Lists!${governorateRange}`],
      };
      ws.getCell(`G${row}`).dataValidation = {
        type: 'list',
        allowBlank: false,
        formulae: [`=Lists!${sourceRange}`],
      };
    }

    ws.getRow(1).eachCell((cell) => {
      cell.font = { bold: true };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE2EFDA' },
      };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
    });

    ws.getCell('A1').note = {
      texts: [
        {
          font: { size: 10, color: { argb: 'FF000000' }, name: 'Calibri' },
          text: 'Fill in lead details. Select Governorate and Source from dropdowns.',
        },
      ],
    };

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), 'leads-template.xlsx');
  }

  /**
   * Parses an uploaded .xlsx file into a structured leads array.
   * Throws an Error with a user-facing message if required columns are missing.
   */
  async parseLeadsFile(file: File): Promise<ParsedLeadRow[]> {
    const workbook = new ExcelJS.Workbook();
    const arrayBuffer = await file.arrayBuffer();
    await workbook.xlsx.load(arrayBuffer);

    const worksheet = workbook.getWorksheet('Leads Template') || workbook.worksheets[0];
    if (!worksheet) {
      throw new Error('لم يتم العثور على بيانات في الملف');
    }

    const headers: string[] = [];
    const rows: any[] = [];

    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) {
        row.eachCell((cell, colNumber) => {
          let header = String(cell.value || '')
            .trim()
            .toLowerCase();
          // Check the more specific "* Name" headers before the generic "name"
          // check below — otherwise "Street Name" / "Activity Name" both contain
          // "name" and get misclassified as the plain customer-name column.
          if (header.includes('activity')) header = 'activity_name';
          else if (header.includes('street')) header = 'street_name';
          else if (header.includes('name')) header = 'name';
          else if (header.includes('phone')) header = 'phone';
          else if (header.includes('governorate')) header = 'governorate';
          else if (header.includes('city')) header = 'city';
          else if (header.includes('source')) header = 'source';
          else if (header.includes('notes')) header = 'notes';
          else header = `col${colNumber}`;
          headers.push(header);
        });
        console.log('Headers:', headers);

        const missing = REQUIRED_COLUMNS.filter((h) => !headers.includes(h));
        if (missing.length > 0) {
          throw new Error(`أعمدة مفقودة: ${missing.join(', ')}`);
        }
        return;
      }

      const rowData: any = {};
      let hasData = false;

      row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
        const key = headers[colNumber - 1];
        if (!key) return;

        let value = cell.value;
        if (value && typeof value === 'object' && 'text' in value) {
          value = (value as any).text;
        }

        const cleanValue = value !== null && value !== undefined ? String(value).trim() : '';
        rowData[key] = cleanValue;
        if (cleanValue !== '') hasData = true;
      });

      if (hasData) rows.push(rowData);
    });

    const leads: ParsedLeadRow[] = rows
      .filter((row) => REQUIRED_COLUMNS.every((col) => row[col] !== undefined && row[col] !== ''))
      .map((row) => ({
        name: row.name,
        phone: row.phone,
        activity_name: row.activity_name,
        governorate: row.governorate,
        city: row.city,
        street_name: row.street_name,
        source: row.source,
        notes: row.notes ?? '',
      }));
    console.log(leads);

    if (leads.length === 0) {
      throw new Error('لا توجد صفوف صالحة للاستيراد');
    }

    return leads;
  }

  private addListToSheet(
    sheet: ExcelJS.Worksheet,
    items: string[],
    title: string,
    column: number,
  ): string {
    const colLetter = this.getColumnLetter(column);
    const startRow = sheet.lastRow ? sheet.lastRow.number + 2 : 1;

    sheet.getCell(`${colLetter}${startRow}`).value = title;
    sheet.getCell(`${colLetter}${startRow}`).font = { bold: true };

    items.forEach((label, i) => {
      sheet.getCell(`${colLetter}${startRow + i + 1}`).value = label;
    });

    const endRow = startRow + items.length;
    return `$${colLetter}$${startRow + 1}:$${colLetter}$${endRow}`;
  }

  private getColumnLetter(columnNumber: number): string {
    let letter = '';
    while (columnNumber > 0) {
      const mod = (columnNumber - 1) % 26;
      letter = String.fromCharCode(65 + mod) + letter;
      columnNumber = Math.floor((columnNumber - mod) / 26);
    }
    return letter;
  }
}
