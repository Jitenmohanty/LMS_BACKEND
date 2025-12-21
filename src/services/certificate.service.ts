import PDFDocument from 'pdfkit';
import Certificate from '../models/Certificate';
import User from '../models/User';
import Course from '../models/Course';
import crypto from 'crypto';

export class CertificateService {
  async createCertificate(userId: string, courseId: string) {
    // Check if certificate already exists
    const existingCert = await Certificate.findOne({ user: userId, course: courseId });
    if (existingCert) {
      return existingCert;
    }

    // Generate unique Certificate ID
    const certificateId = `CERT-${crypto.randomBytes(4).toString('hex').toUpperCase()}-${Date.now()}`;

    const certificate = await Certificate.create({
      user: userId,
      course: courseId,
      certificateId,
      completedAt: new Date()
    });

    return certificate;
  }

  async getCertificateStream(certificateId: string) {
    const certificate = await Certificate.findOne({ certificateId })
      .populate('user', 'name')
      .populate('course', 'title duration');

    if (!certificate) {
      throw new Error('Certificate not found');
    }

    const doc = new PDFDocument({
      layout: 'landscape',
      size: 'A4',
    });

    // --- Design the Certificate ---
    const user = certificate.user as any;
    const course = certificate.course as any;

    // Background Border
    doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40)
       .stroke('#CCAA00'); // Gold-ish border
    
    // Inner Border
    doc.rect(40, 40, doc.page.width - 80, doc.page.height - 80)
       .stroke('#CCAA00');

    // Header
    doc.fontSize(40).font('Helvetica-Bold').text('Certificate of Completion', 0, 100, { align: 'center' });

    // Body
    doc.moveDown();
    doc.fontSize(20).font('Helvetica').text('This is to certify that', { align: 'center' });

    doc.moveDown(1.5);
    doc.fontSize(30).font('Helvetica-Bold').text(user.name, { align: 'center', underline: true });

    doc.moveDown(1.5);
    doc.fontSize(20).font('Helvetica').text('has successfully completed the course', { align: 'center' });

    doc.moveDown(1.5);
    doc.fontSize(25).font('Helvetica-Bold').text(course.title, { align: 'center' });

    // Footer
    doc.moveDown(4);
    doc.fontSize(15).text(`Date: ${certificate.issueDate.toLocaleDateString()}`, 100, 450);
    doc.text(`Certificate ID: ${certificate.certificateId}`, 500, 450, { align: 'right' });

    // Signature Line
    doc.moveTo(100, 440).lineTo(300, 440).stroke();
    // doc.text('Instructor Signature', 100, 460); // Optional

    doc.end();

    return doc;
  }

  async getUserCertificates(userId: string) {
    return await Certificate.find({ user: userId })
      .populate('course', 'title thumbnail')
      .sort({ createdAt: -1 });
  }

  async getAllCertificates() {
    return await Certificate.find({})
      .populate('user', 'name email')
      .populate('course', 'title')
      .sort({ createdAt: -1 });
  }
}
