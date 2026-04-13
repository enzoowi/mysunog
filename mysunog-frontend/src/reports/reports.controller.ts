import { Controller, Get, Query, Res, Param } from '@nestjs/common';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Get('incidents/pdf')
  async downloadPdf(
    @Query('barangay') barangay: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Res() res: any,
  ) {
    const buffer = await this.reportsService.generatePdf(
      barangay,
      startDate,
      endDate,
    );

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="incident-report-${Date.now()}.pdf"`,
      'Content-Length': buffer.length,
    });

    res.end(buffer);
  }

  @Get('incidents/:id/pdf')
  async downloadSinglePdf(
    @Param('id') id: string,
    @Res() res: any,
  ) {
    const buffer = await this.reportsService.generateSingleIncidentPdf(Number(id));

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="incident-${id}-report-${Date.now()}.pdf"`,
      'Content-Length': buffer.length,
    });

    res.end(buffer);
  }

  @Get('incidents/excel')
  async downloadExcel(
    @Query('barangay') barangay: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Res() res: any,
  ) {
    const buffer = await this.reportsService.generateExcel(
      barangay,
      startDate,
      endDate,
    );

    res.set({
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="incident-report-${Date.now()}.xlsx"`,
      'Content-Length': buffer.length,
    });

    res.end(buffer);
  }
}
