http.get '/сеть/обсуждения', (ввод, вывод, пользователь) ->
	цепь(вывод)
		.сделать ->
			снасти.batch_loading(ввод, { from: 'discussions', query: {} }, @.в 'обсуждения')
			
		.сделать ->
			пользовательское.подставить(@.$.обсуждения, 'участники', @)
			
		.сделать ->
			вывод.send @.$
			
http.get '/сеть/обсуждение', (ввод, вывод, пользователь) ->
	цепь(вывод)
		.сделать ->
			if ввод.настройки._id?
				return @.done({ _id: db('discussions').id(ввод.настройки._id) })
				
			db('discussions').findOne({ id: ввод.настройки.id }, @)
		
		.сделать (обсуждение) ->
			снасти.batch_loading(ввод, { from: 'messages', query: { общение: обсуждение._id } }, @.в 'сообщения')
			
		.сделать ->
			пользовательское.подставить(@.$.сообщения, 'отправитель', @)
			
		.сделать ->
			вывод.send @.$