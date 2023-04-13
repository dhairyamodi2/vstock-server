import { Injectable } from '@nestjs/common';
import User from 'src/user/user.entity';
import { PaymentsDto } from './payments.dto';
import { Stripe } from 'stripe';
import { PaymentResponse } from './payments.responses';
@Injectable()
export class PaymentsService {
    private stripe: Stripe
    constructor() {
        this.stripe = new Stripe('sk_test_51MwJarSBJ7cnqOzKU22H72pgfE07HgCftEivDTQVFC6ciOB7RglArEMDbsiq3jsGsIhJEPlFevjqYPqe4QYkUxY100Z0ef30gQ', { apiVersion: '2022-11-15' });
        


    }
    async processPayment(payload: PaymentsDto, user: User): Promise<PaymentResponse> {
        console.log(payload);
        try {
            const payment = await this.stripe.paymentIntents.create(
                {
                    amount: payload.s_name === 'BUSINESS' ? 799999 : 3999999,
                    currency: 'inr',
                    description: 'Stock Photography online',
                    metadata: {
                        company: 'vStock'
                    },
                    automatic_payment_methods: {
                        enabled: true
                    }
                }
            )
            const customer = await this.stripe.customers.create({
                name: 'Jenny Rosen',
                address: {
                    line1: '510 Townsend St',
                    postal_code: '98140',
                    city: 'San Francisco',
                    state: 'CA',
                    country: 'US',
                }
            })
            return { statusCode: 200, message: "", success: true, data: { client_secret: payment.client_secret } }
        } catch (error) {
            console.log(error);
            return { statusCode: 500, message: error, success: false, data: null }
        }


    }
}
