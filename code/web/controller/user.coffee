http.post '/вход', (ввод, вывод) ->
	цепь(вывод)
		.сделать ->
			хранилище.collection('people').findOne { имя: ввод.body.имя }, @
		
		.сделать (пользователь) ->
			if not пользователь?
				return вывод.send ошибка: 'Такого пользователя нет в нашей сети'
		
			if пользователь.пароль != ввод.body.пароль
				return вывод.send ошибка: 'Неверный пароль'
		
			пользовательское.войти пользователь, ввод, вывод, @
			
		.сделать (пользователь) ->
			вывод.send пользователь: пользователь

http.post '/выход', (ввод, вывод) ->
	пользовательское.выйти ввод, вывод
	вывод.send {}
	
http.put '/прописать', (ввод, вывод) ->
	цепь(вывод)
		.сделать ->
			настройки =
				query:
					'ключ': ввод.body.приглашение
					
			options =
				remove: yes
			
			хранилище.collection('invites').findAndModify настройки, [], {}, options, @
			
		.сделать ->
			человек = ввод.body
			человек['когда пришёл'] = new Date()
			хранилище.collection('people').save ввод.body, @.в 'пользователь'
	
		.сделать (пользователь) ->
			хранилище.collection('people_private_keys').save { пользователь: пользователь._id, 'тайный ключ': пользователь._id + new Date().getTime() }, @

		.сделать (пользователь) ->
			вывод.send ключ: @.переменная('пользователь')._id

http.get '/приглашение/проверить', (ввод, вывод) ->
	цепь(вывод)
		.сделать ->
			хранилище.collection('invites').findOne {ключ: ввод.настройки.приглашение}, @
		
		.сделать (приглашение) ->
			if not приглашение?
				return @ 'Нет такого приглашения в списке'
				
			вывод.send приглашение: приглашение

http.get '/пользовательские_данные_для_страницы', (ввод, вывод) ->
	данные_для_страницы = {}
	
	if ввод.session?
		пользователь = ввод.session.пользователь
		данные_для_страницы.пользователь = пользовательское.выбрать_поля(['_id', 'имя', 'адресное имя'], пользователь)
	else
		if ввод.cookies.user?
			вывод.clearCookie 'user'
			данные_для_страницы.ошибка = 'Пользователь не найден'
		
	вывод.send данные_для_страницы

http.post '/человек/сменить картинку', (ввод, вывод) ->
	return if пользовательское.требуется_вход(ввод, вывод)

	имя = ввод.body.имя
	if имя.to_unix_path().indexOf('/') >= 0
		throw 'hack attempt: ' + имя
	
	путь = global.Upload_temporary_file_path + '/' + имя + '.jpg'
	место = global.Upload_file_path + '/люди/' + ввод.session.пользователь['адресное имя'] + '/картинка'
	
	цепь(вывод)
		.сделать ->
			снасти.создать_путь(место, @)
		.сделать ->
			снасти.переместить_и_переименовать(путь, { место: место, имя: 'на личной карточке.jpg' }, @)
		.сделать ->
			вывод.send {}
			
###
connect_utilities = require('connect').utils
http_proxy = require 'http-proxy'

http.post '/человек/сменить картинку', (ввод, вывод) ->
	приостановленный_ввод = connect_utilities.pause(ввод)
	return if пользовательское.требуется_вход(ввод, вывод)
	proxy = new http_proxy.RoutingProxy()
	proxy.proxyRequest(ввод, вывод,
		host: 'localhost'
		port: global.Upload_server_port
	)
	приостановленный_ввод.resume()
###