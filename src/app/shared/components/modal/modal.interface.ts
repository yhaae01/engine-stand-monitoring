import { ModalSize } from "./modal.size";

export interface ModalInterface {
  size: ModalSize;
  title: string;
  idSelector: string; // Should be written in camelCase and unique.
}
