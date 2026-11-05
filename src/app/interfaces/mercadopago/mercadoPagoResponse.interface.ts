export interface MercadoPagoPreferenceResponseInterface {
    success: boolean;
    data?: {
        preferenceId: string;
        checkoutUrl: string;
    };
}

export interface MercadoPagoPaymentResponseInterface {
    success: boolean;
    data: {
        id: string;
        status: string;
    };
}