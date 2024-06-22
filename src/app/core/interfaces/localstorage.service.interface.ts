import { Collection } from "collect.js";

export interface LocalStorageServiceInterface {

  /**
   * Saving data to localstorage
   *
   * @param key key of data
   * @param data data to be stored
   */
  saveData(key: string, data: string): void;

  /**
   * Removing data from localstorage
   *
   * @param key
   */
  removeData(key: string): void;

  /**
   * Clear all localstorage data
   *
   */
  clearData(): void;

  /**
   * Getting data from localstorage. You need cast to object or to string
   *
   * @param key
   * @example getData('data').toObject<PersonalInformation>();
   */
  getData(key: string): this;

  /**
   * Casting value from getData() method
   *
   */
  toString(): string;

  /**
   * Casting value from getData() method
   *
   */
  toCollection<T>(): Collection<T>;

  /**
   * Casting value from getData() method
   *
   */
  toObject<T>(): T;
}
