import dotenv from 'dotenv'

dotenv.config()

export default {
	domain: 'http://localhost:3002',
	callbacks: {
		'signup.success': 'http://localhost:3001/?success=true',
		'signup.canceled': 'http://localhost:3001/?canceled=true',
		'signup.failed': 'http://localhost:3001/?failed=true',
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
		}
	},

	stripe: {
		privateKey: process.env['STRIPE_PRIVATE_KEY']
	}

}
