import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  private buildWhereClause(query: any) {
    const { startDate, endDate, neighborhood, field, type, status } = query;
    const where: any = {};

    if (neighborhood) where.neighborhood = neighborhood;
    if (field) where.field = field;
    if (type) where.type = type;
    if (status) where.status = status;

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate);
      if (endDate) where.createdAt.lte = new Date(endDate);
    }
    return where;
  }

  async getOverview(query: any) {
    const where = this.buildWhereClause(query);
    const totalCases = await this.prisma.legalCase.count({ where });
    const closedCases = await this.prisma.legalCase.count({
      where: { ...where, status: 'CLOSED' },
    });
    const openCases = totalCases - closedCases;

    const topNeighborhoods = await this.prisma.legalCase.groupBy({
      by: ['neighborhood'],
      where,
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 3,
    });

    const topFields = await this.prisma.legalCase.groupBy({
      by: ['field'],
      where,
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 3,
    });

    return {
      totalCases,
      openCases,
      closedCases,
      topNeighborhoods: topNeighborhoods.map(n => ({ neighborhood: n.neighborhood, count: n._count.id })),
      topFields: topFields.map(f => ({ field: f.field, count: f._count.id })),
      generatedAt: new Date().toISOString(),
    };
  }

  async getByNeighborhood(query: any) {
    const where = this.buildWhereClause(query);
    const totalCases = await this.prisma.legalCase.count({ where });
    const data = await this.prisma.legalCase.groupBy({
      by: ['neighborhood'],
      where,
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
    });

    return data.map(item => ({
      neighborhood: item.neighborhood,
      count: item._count.id,
      percentage: totalCases > 0 ? ((item._count.id / totalCases) * 100).toFixed(2) : 0,
    }));
  }

  async getByField(query: any) {
    const where = this.buildWhereClause(query);
    const totalCases = await this.prisma.legalCase.count({ where });
    const data = await this.prisma.legalCase.groupBy({
      by: ['field'],
      where,
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
    });

    return data.map(item => ({
      field: item.field,
      count: item._count.id,
      percentage: totalCases > 0 ? ((item._count.id / totalCases) * 100).toFixed(2) : 0,
    }));
  }

  async getCrossTab(query: any) {
    const where = this.buildWhereClause(query);
    const data = await this.prisma.legalCase.groupBy({
      by: ['neighborhood', 'field'],
      where,
      _count: { id: true },
      orderBy: [
        { neighborhood: 'asc' },
        { field: 'asc' },
      ]
    });

    return data.map(item => ({
      neighborhood: item.neighborhood,
      field: item.field,
      count: item._count.id,
    }));
  }

  async getSocialInsights(query: any) {
    const where = this.buildWhereClause(query);
    const topNeighborhoods = await this.prisma.legalCase.groupBy({
      by: ['neighborhood'],
      where,
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 1,
    });

    const topFields = await this.prisma.legalCase.groupBy({
      by: ['field'],
      where,
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 1,
    });

    const observations: string[] = [];
    const hypotheses: string[] = [];
    
    if (topNeighborhoods.length > 0) {
      const topN = topNeighborhoods[0];
      observations.push(`Khu phố ${topN.neighborhood} ghi nhận số lượng đơn cao nhất (${topN._count.id} đơn).`);
      hypotheses.push(`Số lượng đơn cao tại khu phố ${topN.neighborhood} có thể phản ánh một số yếu tố khách quan như mật độ dân cư tập trung, sự chủ động tiếp cận kênh phản ánh của người dân, hoặc các biến động cục bộ đang diễn ra. Cần đối chiếu thêm với dữ liệu dân số thực tế để đánh giá tỷ lệ tương đối.`);
    }

    if (topFields.length > 0) {
      const topF = topFields[0];
      observations.push(`Lĩnh vực ${topF.field} chiếm số lượng lớn nhất trong tổng số đơn thư (${topF._count.id} đơn).`);
      hypotheses.push(`Sự tập trung đơn thư vào lĩnh vực ${topF.field} gợi ý rằng đây có thể là vấn đề đang nhận được nhiều sự quan tâm hoặc áp lực xã hội trong cộng đồng. Điều này thường xuất hiện khi có sự thay đổi về chính sách, quy hoạch hoặc các tác động kinh tế - xã hội liên quan. Nên ưu tiên nguồn lực để giải thích, hỗ trợ pháp lý hoặc giải quyết dứt điểm các vướng mắc trong mảng này.`);
    }

    if (observations.length === 0) {
      observations.push("Không có dữ liệu đủ lớn để đưa ra quan sát.");
    }

    return {
      disclaimers: [
        "Số lượng đơn thư là số liệu tuyệt đối, chưa chuẩn hóa theo dân số/số hộ/mật độ cư trú.",
        "Các nhận định chỉ là gợi ý, giả thuyết diễn giải dựa trên số liệu mô tả ban đầu.",
        "Cần đối chiếu với dữ liệu dân số học và các nghiên cứu định tính khác để có kết luận chính xác."
      ],
      observations,
      hypotheses,
      recommendations: [
        "Xem xét bổ sung dữ liệu nhân khẩu học (tổng dân số, số hộ) của từng khu phố để tính toán tỷ lệ tương đối (số đơn/1000 dân).",
        "Tăng cường công tác tuyên truyền pháp luật và hỗ trợ cộng đồng tại các khu vực hoặc lĩnh vực có dấu hiệu gia tăng đơn thư.",
        "Thiết lập kênh khảo sát ý kiến người dân để đánh giá cảm nhận về công bằng thủ tục (procedural justice) và mức độ tin tưởng vào hệ thống."
      ]
    };
  }
}
