import { Injectable } from '@angular/core';

// TODO: Add sections here
export enum WipSection {}

export interface GlobalWipStorage {
  [key: string]: any;
}

@Injectable({ providedIn: 'root' })
export class GlobalWipService {
  private readonly STORAGE_KEY = 'app-wip';
  private wip: GlobalWipStorage = {};

  constructor() {
    this.load();
  }

  private load() {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      this.wip = stored ? JSON.parse(stored) : {};
    } catch {
      this.wip = {};
    }
  }

  private persist() {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.wip));
  }

  saveSection<T>(section: WipSection, data: T) {
    this.wip[section] = data;
    this.persist();
  }

  mergeSection<T extends object>(section: WipSection, partialData: Partial<T>) {
    const existing = (this.wip[section] as T) ?? ({} as T);
    this.wip[section] = { ...existing, ...partialData };
    this.persist();
  }

  get<T>(section: WipSection): T | null {
    return (this.wip[section] as T) ?? null;
  }

  clearSection(section: WipSection) {
    delete this.wip[section];
    this.persist();
  }

  clearAll() {
    this.wip = {};
    localStorage.removeItem(this.STORAGE_KEY);
  }
}
