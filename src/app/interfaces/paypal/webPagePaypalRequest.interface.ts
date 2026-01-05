export interface WebPagePaypalRequestInterface {
  success: boolean;
  data: {
    orderID: string;
    approveLink: string;
  }
}
