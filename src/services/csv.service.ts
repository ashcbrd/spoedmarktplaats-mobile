import Papa from 'papaparse';

export interface CsvPoolRow {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  subcategory?: string;
  postcode?: string;
  notes?: string;
}

export const CSV_TEMPLATE_HEADER =
  'first_name,last_name,email,phone,subcategory,postcode,notes';

export const CSV_TEMPLATE_EXAMPLE =
  CSV_TEMPLATE_HEADER +
  '\nJan,de Vries,jan@example.com,0612345678,plumber,1012AB,Betrouwbaar';

export const parseCsv = (csvString: string): {data: CsvPoolRow[]; errors: string[]} => {
  const result = Papa.parse<CsvPoolRow>(csvString, {
    header: true,
    skipEmptyLines: true,
    transformHeader: h => h.trim().toLowerCase().replace(/\s+/g, '_'),
  });

  const errors: string[] = [];
  const validRows: CsvPoolRow[] = [];

  result.data.forEach((row, idx) => {
    if (!row.first_name || !row.last_name || !row.email) {
      errors.push(`Rij ${idx + 2}: Voornaam, achternaam en e-mail zijn verplicht`);
    } else if (!/^[^@]+@[^@]+\.[^@]+$/.test(row.email)) {
      errors.push(`Rij ${idx + 2}: Ongeldig e-mailadres "${row.email}"`);
    } else {
      validRows.push(row);
    }
  });

  return {data: validRows, errors};
};
