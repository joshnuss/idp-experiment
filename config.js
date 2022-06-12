import dotenv from 'dotenv'
import fs from 'fs'

dotenv.config()

export default {
	domain: 'http://localhost:3002',
	callbacks: {
		'signup.success': 'http://localhost:3001/?message=signup.success',
		'signup.canceled': 'http://localhost:3001/?message=signup.success',
		'signup.failed': 'http://localhost:3001/?message=signup.failed',
		'signin.success': 'http://localhost:3001/?message=signin.success',
		'signin.failed': 'http://localhost:3001/?message=signin.failed',
		'signout.success': 'http://localhost:3001/?message=signout.success',
		'signout.failed': 'http://localhost:3001/?message=signout.failed',
		'account.updated': 'http://localhost:3001/?message=account.updated',
		'portal.return': 'http://localhost:3001/?message=portal.return'
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
			'http://localhost:3001/idp/events'
		]
	}
}
