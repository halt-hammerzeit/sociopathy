http.get '/сеть/мусорка', (ввод, вывод, пользователь) ->
	$ = {}
	снасти.batch_loading(ввод, $, 'trash', { from: 'system_trash', query: {}, parameters: { sort: [['_id', -1]] } })
	пользовательское.подставить.await($.trash, 'кто_выбросил')
	вывод.send $
			
http.post '/сеть/мусорка/восстановить', (ввод, вывод, пользователь) ->
	_id = db('system_trash').id(ввод.данные._id)
	
	trash = db('system_trash')._.find_one(_id)
	
	switch trash.что
		when 'раздел читальни'
			console.log('')
		when 'заметка читальни'
			console.log('')
		when 'книга'
			console.log('')
		else
			console.log('')
	
	вывод.send({})
	
global.system_trash = (что, data, пользователь) ->
	мусор = { что: что, когда_выброшено: new Date(), кто_выбросил: пользователь._id }
	
	мусор.данные = data
	
	db('system_trash')._.save(мусор)