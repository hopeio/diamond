import forage from "localforage";
import type { LocalForage, ProxyStorage, ExpiresData } from "./types";

class StorageProxy implements ProxyStorage {
  protected storage: LocalForage;
  constructor(storageModel: LocalForage) {
    this.storage = storageModel;
    this.storage.config({
      // 首选IndexedDB作为第一驱动，不支持IndexedDB会自动降级到localStorage（WebSQL被弃用，详情看https://developer.chrome.com/blog/deprecating-web-sql）
      driver: [this.storage.INDEXEDDB, this.storage.LOCALSTORAGE],
      name: "hopeio"
    });
  }

  /**
   * @description 将对应键名的数据保存到离线仓库
   * @param k 键名
   * @param v 键值
   * @param m 缓存时间（单位`分`，默认`0`分钟，永久缓存）
   */
  public async setItem<T>(k: string, v: T, m = 0): Promise<T> {
    const value = await this.storage.setItem<ExpiresData<T>>(k, {
      data: v,
      // 负数视为永久，避免写入即过期的意外
      expires: m > 0 ? new Date().getTime() + m * 60 * 1000 : 0
    });
    return value.data;
  }

  /**
   * @description 从离线仓库中获取对应键名的值；过期条目顺手删除，不再占用存储
   */
  public async getItem<T>(k: string): Promise<T | null> {
    const value = await this.storage.getItem<ExpiresData<T>>(k);
    if (!value) {
      return null;
    }
    if (value.expires === 0 || value.expires > new Date().getTime()) {
      return value.data;
    }
    // 过期即删，失败不影响读取语义
    this.storage.removeItem(k).catch(() => {});
    return null;
  }

  /**
   * @description 从离线仓库中删除对应键名的值
   */
  public async removeItem(k: string) {
    return this.storage.removeItem(k);
  }

  /**
   * @description 从离线仓库中删除所有的键名，重置数据库
   */
  public async clear() {
    return this.storage.clear();
  }

  /**
   * @description 获取数据仓库中所有的key
   */
  public async keys() {
    return this.storage.keys();
  }
}

/**
 * 二次封装 [localforage](https://localforage.docschina.org/) 支持设置过期时间，提供完整的类型提示
 */
export const localForage = () => new StorageProxy(forage);
