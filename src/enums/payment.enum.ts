export enum PaymentMethod {
    cash = 'cash',
    card = 'card',
}

export enum PaymentStatus {
    pending = 'pending',
    authorized = 'authorized',
    completed = 'completed',
    failed = 'failed',
    cancelled = 'cancelled',
    refunded = 'refunded',
}
