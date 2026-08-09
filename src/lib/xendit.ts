import { Xendit, Invoice as InvoiceClient, PaymentRequest as PaymentRequestClient } from 'xendit-node'

if (!process.env.XENDIT_SECRET_KEY) {
  console.warn('[xendit] XENDIT_SECRET_KEY is not set — payment features will fail at runtime')
}

const xenditClient = new Xendit({ secretKey: process.env.XENDIT_SECRET_KEY! })

// Named service clients — prefer these over destructuring xenditClient
export const Invoice = xenditClient.Invoice
export const PaymentRequest = xenditClient.PaymentRequest
export const Customer = xenditClient.Customer
export const Payout = xenditClient.Payout

export default xenditClient

// ─── Usage reference ────────────────────────────────────────────────────────
//
// INVOICE — hosted payment page, supports all channels automatically
//
//   import { Invoice } from '@/lib/xendit'
//   import type { CreateInvoiceRequest } from 'xendit-node/invoice/models'
//
//   const invoice = await Invoice.createInvoice({
//     data: {
//       externalId: 'order-123',        // your unique ID
//       amount: 150000,                  // IDR, integer, no decimals
//       currency: 'IDR',
//       description: 'Order #123',
//       invoiceDuration: 86400,          // seconds until expiry (86400 = 24 h)
//       customer: { givenNames: 'Budi', email: 'budi@example.com' },
//       successRedirectUrl: 'https://yourapp.com/success',
//       failureRedirectUrl: 'https://yourapp.com/failure',
//     },
//   })
//   // invoice.invoiceUrl — redirect user here to pay
//   // invoice.id         — store this to check status later
//   // invoice.status     — 'PENDING' | 'SETTLED' | 'EXPIRED'
//
//   const existing = await Invoice.getInvoiceById({ invoiceId: invoice.id })
//   await Invoice.expireInvoice({ invoiceId: invoice.id })
//
// ─────────────────────────────────────────────────────────────────────────────
//
// PAYMENT REQUEST — e-wallet, QRIS, or Virtual Account (direct integration)
//
//   import { PaymentRequest } from '@/lib/xendit'
//   import type { PaymentRequestParameters } from 'xendit-node/payment_request/models'
//
//   // E-wallet (SHOPEEPAY, OVO, DANA, GOPAY, LINKAJA)
//   const pr = await PaymentRequest.createPaymentRequest({
//     data: {
//       country: 'ID',
//       currency: 'IDR',
//       amount: 50000,
//       referenceId: 'ref-' + Date.now(),
//       paymentMethod: {
//         type: 'EWALLET',
//         reusability: 'ONE_TIME_USE',
//         ewallet: {
//           channelCode: 'SHOPEEPAY',           // or OVO, DANA, GOPAY, LINKAJA
//           channelProperties: {
//             successReturnUrl: 'https://yourapp.com/success',
//           },
//         },
//       },
//     },
//   })
//   // pr.actions[0].url — redirect user here to complete payment
//
//   // QRIS (dynamic QR)
//   const qr = await PaymentRequest.createPaymentRequest({
//     data: {
//       currency: 'IDR',
//       amount: 50000,
//       referenceId: 'ref-' + Date.now(),
//       paymentMethod: {
//         type: 'QR_CODE',
//         reusability: 'ONE_TIME_USE',
//         qrCode: { channelCode: 'QRIS' },
//       },
//     },
//   })
//   // qr.paymentMethod.qrCode.channelProperties.qrString — render as QR image
//
//   // Virtual Account
//   const va = await PaymentRequest.createPaymentRequest({
//     data: {
//       currency: 'IDR',
//       amount: 100000,
//       referenceId: 'ref-' + Date.now(),
//       paymentMethod: {
//         type: 'VIRTUAL_ACCOUNT',
//         reusability: 'ONE_TIME_USE',
//         virtualAccount: {
//           channelCode: 'BCA',             // BCA, BNI, BRI, MANDIRI, PERMATA
//           channelProperties: {
//             customerName: 'Budi Santoso',
//             expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
//           },
//         },
//       },
//     },
//   })
//   // va.paymentMethod.virtualAccount.channelProperties.virtualAccountNumber
//
// ─────────────────────────────────────────────────────────────────────────────
//
// WEBHOOK VERIFICATION — validate incoming Xendit webhook callbacks
//
//   Xendit sends a POST to your /api/webhooks/xendit endpoint.
//   Verify the x-callback-token header matches XENDIT_WEBHOOK_TOKEN env var.
//   No SDK method needed — just compare the header string.
//
//   Example webhook handler (src/pages/api/webhooks/xendit.ts):
//
//   import type { NextApiRequest, NextApiResponse } from 'next'
//   export default function handler(req: NextApiRequest, res: NextApiResponse) {
//     if (req.method !== 'POST') return res.status(405).end()
//     if (req.headers['x-callback-token'] !== process.env.XENDIT_WEBHOOK_TOKEN) {
//       return res.status(401).end('Unauthorized')
//     }
//     const body = req.body
//     // body.status === 'PAID' | 'SETTLED' | 'EXPIRED'
//     // body.external_id matches your externalId
//     // Update your DB order status here
//     return res.status(200).end('OK')
//   }
