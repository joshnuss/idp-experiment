import dotenv from 'dotenv'
import fs from 'fs'

dotenv.config()

export default {
	domain: 'https://id.app.local:3002',
	callbacks: {
		'signup.success': 'https://app.local:3003/?message=signup.success',
		'signup.canceled': 'https://app.local:3003/?message=signup.success',
		'signup.failed': 'https://app.local:3003/?message=signup.failed',
		'signin.success': 'https://app.local:3003/?message=signin.success',
		'signin.failed': 'https://app.local:3003/?message=signin.failed',
		'signout.success': 'https://app.local:3003/?message=signout.success',
		'signout.failed': 'https://app.local:3003/?message=signout.failed',
		'account.updated': 'https://app.local:3003/?message=account.updated',
		'portal.return': 'https://app.local:3003/?message=portal.return'
	},
	defaultProvider: 'bogus',
	providers: {
		bogus: {
			client_id: 'dummy-client-id',
			client_secret: 'dummy-client-secret'
		},
		google: {
			client_id: '...',
			client_secret: '...'
		}
	},

	defaultProduct: 'basic',
	defaultPeriod: 'monthly',
	products: {
		basic: {
			id: 'prod_Lql1KANDK9m9fY',
			prices: {
				monthly: 'price_1L93V8HfKEQGgXe51CYFFltu',
				yearly: 'price_1L93V8HfKEQGgXe51CYFFltu'
			}
		},
		pro: {
			id: 'prod_LrTkgRhGD2aUXc',
			prices: {
				monthly: 'price_1L9kmZHfKEQGgXe5ZMUmT07z',
				yearly: 'price_1L9kmZHfKEQGgXe5OQmVcLyb'
			}
		}
	},

	stripe: {
		privateKey: process.env['STRIPE_PRIVATE_KEY'],
		webhookSecret: process.env['STRIPE_WEBHOOK_SECRET']
	},

	keys: {
		private: await fs.promises.readFile('./idp.key'),
		public: await fs.promises.readFile('./idp.key.pub')
	},

	webhooks: {
		'access.revoked': [
		]
	}
}
