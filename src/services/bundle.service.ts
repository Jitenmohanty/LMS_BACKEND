// ============================================================================
// FILE: src/services/bundle.service.ts
// ============================================================================
import Bundle from '../models/Bundle';

export class BundleService {
  async createBundle(data: any) {
    const bundle = await Bundle.create(data);
    return bundle;
  }

  async getAllBundles() {
    const bundles = await Bundle.find({ isActive: true })
      .populate('courses', 'title thumbnail price')
      .sort({ createdAt: -1 });
    return bundles;
  }

  async getBundleById(bundleId: string) {
    const bundle = await Bundle.findById(bundleId)
      .populate('courses', 'title description thumbnail price instructor');
    
    if (!bundle) {
      throw new Error('Bundle not found');
    }

    return bundle;
  }

  async updateBundle(bundleId: string, data: any) {
    const bundle = await Bundle.findByIdAndUpdate(bundleId, data, { new: true });
    if (!bundle) {
      throw new Error('Bundle not found');
    }
    return bundle;
  }

  async deleteBundle(bundleId: string) {
    const bundle = await Bundle.findByIdAndDelete(bundleId);
    if (!bundle) {
      throw new Error('Bundle not found');
    }
    return bundle;
  }
}