require 'coffee-script'

express = require 'express'
приложение = express.createServer()

mongo = require 'mongoskin'
хранилище = mongo.db 'localhost:27017/sociopathy?auto_reconnect'

выполнить = require 'seq'
цепь = require './conveyor'
http = require('./express')(приложение).http

лекальщик = require './templater'
снасти = require './tools'

хранилище.bind 'people',
	выбрать: (настройки, возврат) ->
		условия = настройки.условия || {}
		@find(условия, { skip: настройки.с - 1, limit: настройки.сколько }).toArray возврат

http.put '/прописать', (ввод, вывод) ->
	цепь()
		.сделать ->
			настройки =
				query:
					'ключ': ввод.body.приглашение
					
			options =
				remove: yes
			
			хранилище.collection('invites').findAndModify настройки, [], {}, options, @
			
		.сделать ->
			хранилище.collection('people').save ввод.body, @
		
		.сделать (пользователь) ->
			вывод.send ключ: пользователь._id

		.ошибка (ошибка) ->
			console.error ошибка
			вывод.send ошибка: ошибка

http.get '/люди', (ввод, вывод) ->
	цепь()
		.делать ->
			хранилище.collection('people').выбрать { с: ввод.настройки.с, сколько: ввод.настройки.сколько }, @

		.делать ->
			хранилище.collection('people').count @
		
		.сделать (люди, поголовье) ->
			есть_ли_ещё = поголовье > (ввод.настройки.с - 1 + ввод.настройки.сколько)
			вывод.send люди: люди, 'есть ещё?': есть_ли_ещё 

		.ошибка (ошибка) ->
			console.error ошибка
			вывод.send ошибка: ошибка

http.post '/вход', (ввод, вывод) ->
	цепь()
		.сделать ->
			хранилище.collection('people').findOne({'пароль': ввод.body.пароль}, @)
		
		.сделать (пользователь) ->
			if not пользователь?
				return вывод.send ошибка: 'Пароль не опознан'
		
			ввод.session.пользователь = пользователь
			вывод.send пользователь: пользователь

		.ошибка (ошибка) ->
			console.error ошибка
			вывод.send ошибка: ошибка

http.post '/выход', (ввод, вывод) ->
	цепь()
		.сделать ->
			ввод.session.пользователь = null
			вывод.send {}

		.ошибка (ошибка) ->
			console.error ошибка
			вывод.send ошибка: ошибка
		
http.get '/приглашение/проверить', (ввод, вывод) ->
	цепь()
		.сделать ->
			хранилище.collection('invites').findOne({'ключ': ввод.настройки.приглашение}, @)
		
		.сделать (приглашение) ->
			if not приглашение?
				return вывод.send ошибка: 'Нет такого приглашения в списке'
				
			вывод.send приглашение: приглашение

		.ошибка (ошибка) ->
			console.error ошибка
			вывод.send ошибка: ошибка
			
http.get '/хранилище/заполнить', (ввод, вывод) ->
	цепь()
		.сделать ->
				хранилище.collection('people').drop @
		
		.ошибка (ошибка) ->
			if ошибка.message != 'ns not found'
				console.error ошибка
				вывод.send ошибка: ошибка

		.сделать ->
				хранилище.collection('people').ensureIndex 'пароль', true, @

		.сделать ->
				хранилище.collection('people').ensureIndex 'почта', true, @

		.сделать ->
				хранилище.collection('people').ensureIndex 'имя', true, @

		.сделать ->
			человек = 
				имя: 'Иванов Иван' 
				описание: 'заведующий'
				пол: 'мужской'
				откуда: 'Москва'
				пароль: '123'
				почта: 'ivan@ivanov.com'
				'время рождения': '12.09.1990'
				вера: 'христианин'
				убеждения: 'социалист' 
				картинка: '/картинки/temporary/картинка с личной карточки.jpg'
			
			for i in [1..21]
				человек._id = null
				человек.имя = 'Иванов Иван ' + i
				человек.пароль = '' + (i + 122)
				человек.почта = 'ivan' + i + '@ivanov.com'
				хранилище.collection('people').save(человек, this)
		
		.сделать ->
			хранилище.collection('invites').drop(this)
		
		.ошибка (ошибка) ->
			if ошибка.message != 'ns not found'
				console.error ошибка
				вывод.send ошибка: ошибка
		
		.сделать ->
			хранилище.collection('invites').ensureIndex 'ключ', true, @
		
		.сделать ->
			хранилище.collection('invites').save({ ключ: 'проверка' }, this)
		
		.сделать ->
			вывод.send {}
		
		.ошибка (ошибка) ->
			console.error ошибка
			вывод.send ошибка: ошибка
			
страницы = ['physics', 'люди', 'настройки', 'почта', 'прописка', 'беседка', 'обложка', 'помощь', 'заметка', 'читальня', 'управление']

страницы.forEach (страница) ->
	http.get "/страница/#{страница}", (ввод, вывод) ->
		лекальщик.собрать_и_отдать_страницу(страница, ввод, вывод)

приложение.listen 8080, '0.0.0.0'