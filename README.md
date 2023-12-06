
# TableHTMLExport V3.0.0

A jQuery plugin that exports an HTML table to JSON, CSV, TXT, or PDF and forces the browser to download the generated file.

## Requirements
- [jQuery](https://jquery.com/)

## Installation

You can download the *tableHTMLExport.js* file from the *src* folder of this repository.

## Options

- `type`: String. Specifies the export type (csv, txt, json, pdf). Default: 'csv'.
- `separator`: String. Character used as a separator between columns when exporting to CSV. Default: '|'.
- `newline`: String. Characters used for a new line when exporting to CSV. Default: '\r\n'.
- `ignoreColumns`: String. CSS selectors of columns to be ignored. Default: ''.
- `ignoreRows`: String. CSS selectors of rows to be ignored. Default: 'no'.
- `htmlContent`: Boolean. Indicates if the table to be exported contains HTML code. Default: false.
- `consoleLog`: Boolean. Toggles the visibility of the export process logs. Default: false.
- `trimContent`: Boolean. Trims the content of the individual tags `<th>`, `<td>` of whitespace for CSV export. Default: true.
- `quoteFields`: Boolean. Indicates whether fields should be quoted when exported to CSV. Default: false.
- `filename`: String. The name of the file to be saved. Default: 'tableHTMLExport.csv'.
- `utf8`: Boolean. Adds a UTF-8 Byte Order Mark (BOM) for CSV export. Default: true.
- `orientation`: String. Page orientation for PDF export ('p' for portrait, 'l' for landscape). Default: 'p'.

## Examples

### Example HTML Table

```html
<table id="tableCompany">
  <thead>
    <tr>
      <th>Company</th>
      <th>Contact</th>
      <th class='acciones'>Country</th>
  </tr>    
  </thead>
  <tbody>
    <tr>
      <td>Alfreds Futterkiste</td>
      <td id="primero">Maria Anders</td>
      <td class="acciones">Germany</td>
    </tr>
    <tr>
      <td>Ernst Handel</td>
      <td>Roland Mendel</td>
      <td class="acciones">Austria</td>
    </tr>
    <tr>
      <td>Island Trading</td>
      <td>Helen Bennett</td>
      <td>UK</td>
    </tr>
    <tr id="ultimo">
      <td>Magazzini Alimentari Riuniti</td>
      <td>Giovanni Rovelli</td>
      <td>Italy</td>
    </tr>
  </tbody>  
</table>
```

### Export to JSON

```javascript
$("#tableCompany").tableHTMLExport({type: 'json', filename: 'tableLicenses.json', ignoreColumns: '.actions,#first', ignoreRows: '#last'});
```

### Export to CSV

```javascript
$("#tableCompany").tableHTMLExport({type: 'csv', filename: 'tableLicenses.csv', ignoreColumns: '.actions,#first', ignoreRows: '#last'});
```

### Export to PDF

To export to PDF, the [jsPDF-AutoTable](https://github.com/simonbengtsson/jsPDF-AutoTable) library is required.

```javascript
$("#tableCompany").tableHTMLExport({type: 'pdf', filename: 'tableLicenses.pdf', ignoreColumns: '.actions,#first', ignoreRows: '#last'});
```

## Notes

- When exporting to PDF, ensure the jsPDF-AutoTable library is included in your project.
- The plugin throws an error if the target element is not a `<table>` or if multiple tables are targeted at once.
