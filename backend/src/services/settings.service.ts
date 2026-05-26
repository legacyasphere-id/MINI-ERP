import { prisma } from './prisma.service';

export interface SettingsData {
  warehouseName:    string;
  warehouseCode:    string;
  timezone:         string;
  currency:         string;
  lowStockPct:      number;
  overstockPct:     number;
  movementLogLimit: number;
}

export const settingsService = {
  async get(): Promise<SettingsData> {
    return prisma.settings.upsert({
      where:  { id: 'singleton' },
      update: {},
      create: { id: 'singleton' },
      select: {
        warehouseName:    true,
        warehouseCode:    true,
        timezone:         true,
        currency:         true,
        lowStockPct:      true,
        overstockPct:     true,
        movementLogLimit: true,
      },
    });
  },

  async update(data: Partial<SettingsData>): Promise<SettingsData> {
    return prisma.settings.upsert({
      where:  { id: 'singleton' },
      update: data,
      create: { id: 'singleton', ...data },
      select: {
        warehouseName:    true,
        warehouseCode:    true,
        timezone:         true,
        currency:         true,
        lowStockPct:      true,
        overstockPct:     true,
        movementLogLimit: true,
      },
    });
  },
};
