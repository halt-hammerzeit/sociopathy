http.post '/вход', (ввод, вывод) ->
	цепь(вывод)
		.сделать ->
			пользовательское.взять({ имя: ввод.body.имя }, { полностью: yes }, @)
		
		.сделать (пользователь) ->
			if not пользователь?
				return вывод.send ошибка: 'Такого пользователя нет в нашей сети'
		
			if пользователь.пароль != ввод.body.пароль
				return вывод.send ошибка: 'Неверный пароль'
		
			пользовательское.войти(пользователь, ввод, вывод, @)
			
		.сделать (пользователь) ->
			вывод.send(пользователь: пользовательское.скрыть(пользователь))

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
			@._.человек = ввод.body
			
			@._.человек['когда пришёл'] = new Date()
			@._.человек['адресное имя'] = снасти.сделать_id(@._.человек.имя)
			#@._.человек.почта = @._.человек.имя + '@sobranie.net'
			
		#	снасти.hash(@._.человек.пароль, @)
			
		#.сделать (hash) ->
		#	@._.человек.пароль = hash
		
			пользовательское.создать(@._.человек, @._.в 'пользователь')
	
		.сделать (пользователь) ->
			@.done(пользовательское.сделать_тайный_ключ(пользователь))
			
		.сделать (тайный_ключ) ->
			хранилище.collection('people_private_keys').save { пользователь: @._.пользователь._id, 'тайный ключ': тайный_ключ }, @

		.сделать ->
			хранилище.collection('circles').save({ пользователь: человек._id, круг: 'Основной', члены: [] }, @)

		.сделать ->
			вывод.send ключ: @._.пользователь._id

http.get '/приглашение/проверить', (ввод, вывод) ->
	цепь(вывод)
		.сделать ->
			хранилище.collection('invites').findOne {ключ: ввод.настройки.приглашение.toString() }, @
		
		.сделать (приглашение) ->
			if not приглашение?
				return @.error('Нет такого приглашения в списке')
				
			вывод.send приглашение: приглашение

http.get '/пользовательские_данные_для_страницы', (ввод, вывод) ->
	if ввод.session?
		цепь(вывод)
			.сделать ->
				пользовательское.пользователь(ввод, @)
			.сделать (пользователь) ->
				пользователь = Object.выбрать(['_id', 'имя', 'адресное имя', 'пол', 'загружен ли аватар?', 'управляющий'], пользователь)
				пользователь.беседы = {}
				пользователь.обсуждения = {}
				пользователь.новости = {}
				вывод.send(пользователь: пользователь)
	else
		if ввод.cookies.user?
			вывод.clearCookie 'user'
		вывод.send(ошибка: 'Пользователь не найден')
		
http.put '/человек/данные', (ввод, вывод) ->
	return if пользовательское.требуется_вход(ввод, вывод)

	цепь(вывод)
		.сделать ->
			пользовательское.пользователь(ввод, @._.в 'пользователь')
		.сделать ->
			хранилище.collection('people').update({ _id: @._.пользователь._id }, { $set: { имя: ввод.body.имя, описание: ввод.body.описание, откуда: ввод.body.откуда } }, @)
		.сделать ->
			вывод.send {}
			
http.put '/человек/картинка', (ввод, вывод) ->
	return if пользовательское.требуется_вход(ввод, вывод)
	
	имя = ввод.body.имя.to_unix_file_name()
	
	путь = Options.Upload_server.Temporary_file_path + '/' + имя + '.jpg'
	место = null

	цепь(вывод)
		.сделать ->
			пользовательское.пользователь(ввод, @._.в 'пользователь')
		.сделать ->
			место = Options.Upload_server.File_path + '/люди/' + @._.пользователь['адресное имя'].to_unix_file_name() + '/картинка'
			снасти.создать_путь(место, @)
		.сделать ->			
			square_resize(путь, место + '/маленькая.jpg', Options.User.Picture.Chat.Size, @)
		.сделать ->
			снасти.переместить_и_переименовать(путь, { место: место, имя: 'большая.jpg' }, @)
		.сделать ->
			хранилище.collection('people').update({ _id: @._.пользователь._id }, { $set: { 'загружен ли аватар?': yes } }, @)
		.сделать ->
			вывод.send {}

http.get '/пользователь/настройки', (ввод, вывод) ->
	return if пользовательское.требуется_вход(ввод, вывод)
	
	цепь(вывод)
		.сделать ->
			пользовательское.пользователь_полностью(ввод, @._.в 'пользователь')
			
		.сделать (пользователь) ->
			настройки = {}
			
			if (пользователь.почта)
				настройки.почта = пользователь.почта
			
			if пользователь.настройки
				настройки.настройки = пользователь.настройки
				
			вывод.send настройки

http.post '/пользователь/настройки', (ввод, вывод) ->
	return if пользовательское.требуется_вход(ввод, вывод)
	
	цепь(вывод)
		.сделать ->
			пользовательское.пользователь_полностью(ввод, @._.в 'пользователь')
			
		.сделать (пользователь) ->
			@._.почта_изменилась = (пользователь.почта != ввод.body.почта)
			
			@._.новые_данные_пользователя = {}
			
			if (ввод.body.почта)
				@._.новые_данные_пользователя.почта = ввод.body.почта
			
		.сделать ->
			хранилище.collection('people').update({ _id: @._.пользователь._id }, { $set: @._.новые_данные_пользователя }, @)
			
		.сделать ->
			if @._.почта_изменилась
				почта.письмо(кому: @._.пользователь.имя + ' <' + @._.пользователь.почта + '>', тема: 'Проверка вашего нового почтового ящика', сообщение: 'Теперь это ваш почтовый ящик в нашей сети')
			вывод.send {}

http.get '/сеть/мусорка', (ввод, вывод) ->
	return if пользовательское.требуется_вход(ввод, вывод)
	
	цепь(вывод)
		.сделать ->
			пользовательское.пользователь(ввод, @._.в 'пользователь')
		.сделать ->
			хранилище.collection('trash').find({ пользователь: @._.пользователь._id }).toArray(@)
		.сделать (содержимое) ->
			вывод.send { содержимое: содержимое }
			
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