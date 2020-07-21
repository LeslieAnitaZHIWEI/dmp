import { AxiosInstance } from 'axios';

declare var axios: AxiosInstance;

declare module "*.vue" {
  import Vue from "vue";
  export default Vue;
}

interface PageData {
  /** 一页显示多少个 */
  size: number;
  /** 当前页序号 */
  currentPage: number;
}
