http.put '/сеть/круги/состав', (ввод, вывод) ->
	return if пользовательское.требуется_вход(ввод, вывод)
	
	кого = хранилище.collection('people').id(ввод.body.кого)
	круг = null
			
	цепь(вывод)
		.сделать ->
			пользовательское.пользователь(ввод, @._.в 'пользователь')

		.сделать ->
			if not ввод.body.круг?
				return хранилище.collection('circles').find({ пользователь: @._.пользователь._id }, { limit: 1 }).toArray(@)
			return @.done([{ _id: хранилище.collection('круг').id(ввод.body.круг) }])
			
		.сделать (круги) ->
			if not круги
				return вывод.send(ошибка: "Круг не найден")
			круг = круги[0]
			
			#хранилище.collection('circles').findOne({ пользователь: @._.пользователь._id, круг: круг }, @)
			
			#.сделать (круг) ->
			#if not круг?
			#	return вывод.send(ошибка: "Круг не найден")
			хранилище.collection('circles').update({ _id: круг._id }, { $addToSet: { члены: кого } }, @)
			
		.сделать ->
			вывод.send {}

http['delete'] '/сеть/круги/состав', (ввод, вывод) ->
	return if пользовательское.требуется_вход(ввод, вывод)
	
	кого = хранилище.collection('people').id(ввод.body.кого)
	круг = null
			
	цепь(вывод)
		.сделать ->
			пользовательское.пользователь(ввод, @._.в 'пользователь')
			
		.сделать ->
			if not ввод.body.круг?
				return хранилище.collection('circles').find({ пользователь: @._.пользователь._id }, { limit: 1 }).toArray(@)
			return @.done([{ _id: хранилище.collection('круг').id(ввод.body.круг) }])
				
		.сделать (круги) ->
			if not круги
				return вывод.send(ошибка: "Круг не найден")
			круг = круги[0]
			
			#.сделать ->
			хранилище.collection('circles').update({ _id: круг._id }, { $pull: { члены: кого } }, @)
			
		.сделать ->
			вывод.send {}

http.get '/сеть/круги', (ввод, вывод) ->
	return if пользовательское.требуется_вход(ввод, вывод)
	
	цепь(вывод)
		.сделать ->
			пользовательское.пользователь(ввод, @._.в 'пользователь')
			
		.сделать ->
			хранилище.collection('circles').find({ пользователь: @._.пользователь._id }).toArray(@)
			
		.сделать (круги) ->
			if not круги
				return вывод.send(круги: {})
				
			@.$.круги = круги
				
			@._.люди = {}
			for круг in @.$.круги
				for член in круг.члены
					@._.люди[член + ''] = yes
					
			@.done(Object.get_keys(@._.люди))
			
		.все_вместе (_id) ->
			пользовательское.взять(_id, @)
			
		.сделать (люди) ->
			for человек in люди
				@._.люди[человек._id + ''] = человек
			@.done()
			
		.сделать ->
			for круг in @.$.круги
				i = 0
				while (i < круг.члены.length)
					круг.члены[i] = @._.люди[круг.члены[i]]
					i++
			@.done()
			
		.сделать ->
			вывод.send @.$