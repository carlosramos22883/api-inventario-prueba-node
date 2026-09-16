const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit');

// Función fábrica que acepta CUALQUIER modelo de Sequelize y sus columnas
module.exports = (Model, entityName, defaultAttributes) => {
  return {
    // 1. Exportar a CSV Genérico
    exportCSV: async (req, res) => {
      try {
        const records = await Model.findAll({ attributes: defaultAttributes });

        const keys = defaultAttributes;
        let csvData = keys.join(',') + '\n';

        records.forEach(record => {
          const row = keys.map(key => `"${record[key] || ''}"`).join(',');
          csvData += row + '\n';
        });

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename=${entityName}_reporte.csv`);
        res.status(200).send(csvData);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    },

    // 2. Exportar a Excel Genérico
    exportExcel: async (req, res) => {
      try {
        const records = await Model.findAll({ attributes: defaultAttributes });

        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet(entityName);

        sheet.columns = defaultAttributes.map(attr => ({
          header: attr.toUpperCase(),
          key: attr,
          width: 20
        }));

        sheet.getRow(1).font = { bold: true };

        records.forEach(record => {
          sheet.addRow(record.toJSON());
        });

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=${entityName}_reporte.xlsx`);

        await workbook.xlsx.write(res);
        res.end();
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    },

    // 3. Exportar a PDF Genérico
    exportPDF: async (req, res) => {
      try {
        const records = await Model.findAll({ attributes: defaultAttributes });

        const doc = new PDFDocument({ margin: 30, size: 'A4' });

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=${entityName}_reporte.pdf`);

        doc.pipe(res);

        doc.fontSize(20).fillColor('#333333').text(`Reporte de ${entityName.toUpperCase()}`, { align: 'center' });
        doc.moveDown();

        records.forEach((record, index) => {
          const rowText = defaultAttributes.map(attr => `${attr}: ${record[attr]}`).join(' | ');
          doc.fontSize(10).fillColor('#000000').text(`${index + 1}. [${rowText}]`);
          doc.moveDown(0.4);
        });

        doc.end();
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    }
  };
};