nodemailer = require 'nodemailer'

transport = nodemailer.createTransport('SMTP', { host: 'localhost' })

api = {}

api.письмо_на_отправку = (письмо) ->
	db('mail')._.insert(письмо)

api.письмо = (письмо) ->	
	message =
		from: Options.Mail.From #'Sender Name <sender@example.com>'
		to: письмо.кому #'"Receiver Name" <nodemailer@disposebox.com>'
		subject: письмо.тема #'Nodemailer is unicode friendly ✔'
		#headers: { 'X-Laziness-level': 1000 }
		text: письмо.сообщение #'Hello to myself!'
		#html:'<p><b>Hello</b> to myself <img src="cid:note@node"/></p>'+ '<p>Here\'s a nyan cat for you as an embedded attachment:<br/><img src="cid:nyan@node"/></p>'
	
	console.log('Sending Mail')
	transport.sendMail.do(message)
	#console.log('Message sent successfully!')

#transport.close() // close the connection pool

module.exports = api

доставить_письма = ->
	for письмо in db('mail')._.find()
		try
			api.письмо(письмо)
			db('mail')._.remove(письмо)
		catch error
			console.error('Failed to deliver the message')
		
доставить_письма.ticking(1000)