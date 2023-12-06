/*The MIT License (MIT)

Copyright (c) 2018 https://github.com/FuriosoJack/TableHTMLExport

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.*/

(($) => {

  // ::: methods
  //
  $.fn.tableHTMLExport = function (options) {

    // ::: Default settings
    const defaults = {
      separator: '|',
      newline: '\r\n',
      ignoreColumns: '',
      ignoreRows: 'no',
      type: 'csv',
      htmlContent: false,
      consoleLog: false,
      trimContent: true,
      quoteFields: false,
      filename: 'tableHTMLExport.csv',
      utf8: true,
      orientation: 'p' // 'p' for portrait, 'l' for landscape
    };
    options = $.extend(defaults, options);

    // ::: Function to quote fields
    const quote = (text) => `"${text.replace('"', '""')}"`;

    // ::: Parse HTML or text content
    const parseString = (data) => {
      return options.htmlContent ? data.html().trim() : data.text().trim();
    };

    // ::: Function to initiate download
    const download = (filename, text) => {
      const element = document.createElement('a');
      element.href = `data:text/csv;charset=utf-8,${encodeURIComponent(text)}`;
      element.download = filename;

      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    };

    // ::: Convert table to JSON format
    const toJson = (el) => {
      const jsonHeaderArray = [];
      $(el).find('thead').find('tr').not(options.ignoreRows).each(function () {
        const jsonArrayTd = $(this).find('th').not(options.ignoreColumns)
          .filter(function () {
            return $(this).css('display') !== 'none';
          })
          .map(function () {
            return parseString($(this));
          })
          .get();
        jsonHeaderArray.push(jsonArrayTd);
      });

      const jsonArray = [];
      $(el).find('tbody').find('tr').not(options.ignoreRows).each(function () {
        const jsonArrayTd = $(this).find('td').not(options.ignoreColumns)
          .filter(function () {
            return $(this).css('display') !== 'none';
          })
          .map(function () {
            return parseString($(this));
          })
          .get();
        jsonArray.push(jsonArrayTd);
      });

      return {header: jsonHeaderArray[0], data: jsonArray};
    };

    // ::: Convert table to CSV format
    const toCsv = (table) => {
      let output = options.utf8 ? '\ufeff' : '';

      const rows = table.find('tr').not(options.ignoreRows);
      const numCols = rows.first().find("td,th").not(options.ignoreColumns).length;

      rows.each(function () {
        $(this).find("td").not(options.ignoreColumns).each((i, col) => {
          const content = options.trimContent ? $.trim($(col).text()) : $(col).text();
          output += options.quoteFields ? quote(content) : content;
          output += i !== numCols - 1 ? options.separator : options.newline;
        });
      });

      return output;
    };

    const el = this;
    let dataOutput;

    // ::: Switch to handle export type
    switch (options.type) {
      case 'csv':
      case 'txt':
        const table = this.filter('table');
        if (table.length <= 0) throw new Error('tableHTMLExport must be called on a <table> element');
        if (table.length > 1) throw new Error('converting multiple table elements at once is not supported yet');

        dataOutput = toCsv(table);
        if (options.consoleLog) console.log(dataOutput);
        download(options.filename, dataOutput);
        break;

      case 'json':
        const jsonExportArray = toJson(el);
        if (options.consoleLog) console.log(JSON.stringify(jsonExportArray));
        dataOutput = JSON.stringify(jsonExportArray);
        download(options.filename, dataOutput);
        break;

      case 'pdf':
        const jsonPdfData = toJson(el);
        const contentJsPdf = {
          head: [jsonPdfData.header],
          body: jsonPdfData.data
        };
        if (options.consoleLog) console.log(contentJsPdf);

        const doc = new jsPDF(options.orientation, 'pt');
        doc.autoTable(contentJsPdf);
        doc.save(options.filename);
        break;

      default:
        throw new Error('Unsupported export type');
    }

    return this;
  };

})(jQuery);
