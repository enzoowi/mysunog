import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FireIncident } from '../incidents/fire-incident.entity';
import PDFDocument from 'pdfkit';
import * as ExcelJS from 'exceljs';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(FireIncident)
    private incidentsRepo: Repository<FireIncident>,
  ) {}

  async getIncidents(barangay?: string, startDate?: string, endDate?: string) {
    const query = this.incidentsRepo.createQueryBuilder('incident');

    if (barangay && barangay !== 'All') {
      query.andWhere('incident.barangay = :barangay', { barangay });
    }
    if (startDate) {
      query.andWhere('incident.incidentDate >= :startDate', { startDate });
    }
    if (endDate) {
      query.andWhere('incident.incidentDate <= :endDate', { endDate });
    }

    query.orderBy('incident.incidentDate', 'DESC');
    return query.getMany();
  }

  async generatePdf(
    barangay?: string,
    startDate?: string,
    endDate?: string,
  ): Promise<any> {
    const incidents = await this.getIncidents(barangay, startDate, endDate);

    return new Promise((resolve) => {
      const doc = new PDFDocument({ margin: 40, size: 'A4' });
      const chunks: any[] = [];

      doc.on('data', (chunk: any) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));

      // Header
      doc
        .fontSize(18)
        .text('mySunog - Fire Incident Report', { align: 'center' });
      doc.moveDown(0.5);
      doc
        .fontSize(10)
        .text(`Generated: ${new Date().toLocaleString()}`, { align: 'center' });
      if (barangay && barangay !== 'All')
        doc.text(`Barangay: ${barangay}`, { align: 'center' });
      if (startDate || endDate)
        doc.text(`Period: ${startDate || '...'} to ${endDate || '...'}`, {
          align: 'center',
        });
      doc.moveDown();

      // Summary
      doc.fontSize(12).text(`Total Incidents: ${incidents.length}`);
      const totalDamage = incidents.reduce(
        (s, i) => s + Number(i.estimatedDamage || 0),
        0,
      );
      const totalCasualties = incidents.reduce(
        (s, i) => s + Number(i.casualties || 0),
        0,
      );
      const totalInjuries = incidents.reduce(
        (s, i) => s + Number(i.injuries || 0),
        0,
      );
      doc.text(`Total Estimated Damage: ₱${totalDamage.toLocaleString()}`);
      doc.text(`Total Casualties: ${totalCasualties}`);
      doc.text(`Total Injuries: ${totalInjuries}`);
      doc.moveDown();

      // Table
      doc.fontSize(10);
      incidents.forEach((incident, index) => {
        if (doc.y > 700) doc.addPage();
        doc
          .font('Helvetica-Bold')
          .text(
            `${index + 1}. ${incident.barangay} - ${incident.incidentDate}`,
          );
        doc
          .font('Helvetica')
          .text(
            `   Time: ${incident.incidentTime} | Cause: ${incident.cause || 'N/A'} | Property: ${incident.propertyType || 'N/A'}`,
          )
          .text(
            `   Damage: ₱${incident.estimatedDamage || 0} | Casualties: ${incident.casualties || 0} | Injuries: ${incident.injuries || 0}`,
          )
          .text(`   Remarks: ${incident.remarks || 'N/A'}`);
        doc.moveDown(0.5);
      });

      doc.end();
    });
  }

  async generateSingleIncidentPdf(id: number): Promise<any> {
    const incident = await this.incidentsRepo.findOne({ where: { id } });
    if (!incident) throw new Error('Incident not found');

    return new Promise((resolve) => {
      const doc = new PDFDocument({ margin: 40, size: 'A4' });
      const chunks: any[] = [];

      doc.on('data', (chunk: any) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));

      // Header
      doc.fontSize(20).text('mySunog - Fire Incident Report', { align: 'center' });
      doc.moveDown(0.5);
      doc.fontSize(10).text(`Generated: ${new Date().toLocaleString()}`, { align: 'center' });
      doc.moveDown(2);

      // Incident Details
      doc.fontSize(14).font('Helvetica-Bold').text('Incident Details');
      doc.moveDown(0.5);
      doc.fontSize(12).font('Helvetica');
      
      const leftColX = 40;
      const rightColX = 300;
      let startY = doc.y;

      doc.font('Helvetica-Bold').text('Incident ID:', leftColX, startY).font('Helvetica').text(`#${incident.id}`, leftColX + 100, startY);
      doc.font('Helvetica-Bold').text('Date:', rightColX, startY).font('Helvetica').text(incident.incidentDate, rightColX + 80, startY);
      startY += 20;

      doc.font('Helvetica-Bold').text('Time:', leftColX, startY).font('Helvetica').text(incident.incidentTime, leftColX + 100, startY);
      doc.font('Helvetica-Bold').text('Barangay:', rightColX, startY).font('Helvetica').text(incident.barangay, rightColX + 80, startY);
      startY += 20;

      doc.font('Helvetica-Bold').text('Coordinates:', leftColX, startY).font('Helvetica').text(`${incident.latitude}, ${incident.longitude}`, leftColX + 100, startY);
      startY += 30;

      doc.fontSize(14).font('Helvetica-Bold').text('Assessment & Damages', leftColX, startY);
      startY += 20;
      doc.fontSize(12);

      doc.font('Helvetica-Bold').text('Cause:', leftColX, startY).font('Helvetica').text(incident.cause || 'Unknown', leftColX + 100, startY);
      doc.font('Helvetica-Bold').text('Property Type:', rightColX, startY).font('Helvetica').text(incident.propertyType || 'N/A', rightColX + 100, startY);
      startY += 20;

      doc.font('Helvetica-Bold').text('Est. Damage:', leftColX, startY).font('Helvetica').text(`P ${Number(incident.estimatedDamage || 0).toLocaleString()}`, leftColX + 100, startY);
      doc.font('Helvetica-Bold').text('Casualties:', rightColX, startY).font('Helvetica').text(incident.casualties?.toString() || '0', rightColX + 100, startY);
      startY += 20;

      doc.font('Helvetica-Bold').text('Injuries:', leftColX, startY).font('Helvetica').text(incident.injuries?.toString() || '0', leftColX + 100, startY);
      startY += 30;

      doc.fontSize(14).font('Helvetica-Bold').text('Remarks', leftColX, startY);
      startY += 20;
      doc.fontSize(12).font('Helvetica').text(incident.remarks || 'No remarks provided.', leftColX, startY, { align: 'justify', width: 500 });
      
      doc.end();
    });
  }

  async generateExcel(
    barangay?: string,
    startDate?: string,
    endDate?: string,
  ): Promise<any> {
    const incidents = await this.getIncidents(barangay, startDate, endDate);

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Fire Incidents');

    sheet.columns = [
      { header: 'ID', key: 'id', width: 8 },
      { header: 'Date', key: 'incidentDate', width: 14 },
      { header: 'Time', key: 'incidentTime', width: 10 },
      { header: 'Barangay', key: 'barangay', width: 20 },
      { header: 'Cause', key: 'cause', width: 20 },
      { header: 'Property Type', key: 'propertyType', width: 18 },
      { header: 'Estimated Damage (₱)', key: 'estimatedDamage', width: 20 },
      { header: 'Casualties', key: 'casualties', width: 12 },
      { header: 'Injuries', key: 'injuries', width: 12 },
      { header: 'Latitude', key: 'latitude', width: 14 },
      { header: 'Longitude', key: 'longitude', width: 14 },
      { header: 'Remarks', key: 'remarks', width: 30 },
    ];

    // Style header row
    sheet.getRow(1).font = { bold: true };
    sheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFD32F2F' },
    };
    sheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };

    incidents.forEach((incident) => {
      sheet.addRow({
        id: incident.id,
        incidentDate: incident.incidentDate,
        incidentTime: incident.incidentTime,
        barangay: incident.barangay,
        cause: incident.cause || 'N/A',
        propertyType: incident.propertyType || 'N/A',
        estimatedDamage: Number(incident.estimatedDamage || 0),
        casualties: incident.casualties || 0,
        injuries: incident.injuries || 0,
        latitude: Number(incident.latitude),
        longitude: Number(incident.longitude),
        remarks: incident.remarks || '',
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    return buffer;
  }
}
