соединения =
	эфир: {}
	
listeners = {}

online = redis.createClient()

api = {}

общения = {}

эфир = websocket
	.of('/эфир')
	.on 'connection', (соединение) ->
		fiberize.websocket(соединение)
		
		соединение.вид = 'эфир'
	
		пользователь = null
		
		disconnected = false
		
		выход = ->
			delete соединения.эфир[соединение.id]
			delete listeners[соединение.id]
	
			still_online = false
			for id, listener of listeners
				if listener.пользователь == id
					still_online = true
					
			# don't go offline if has another ether connections
			if not still_online
				if пользователь?
					online.hdel.bind_await(online)('ether:online', пользователь._id)
					
					for id, listener of listeners
						listener.offline(пользователь)
					
					# пользователь offline
			
			disconnected = true
			return соединение.disconnect()

		соединение.on 'выход', ->
			if not disconnected
				выход()
			
		соединение.on 'disconnect', ->
			if not disconnected
				выход()
			
		соединение.on 'close', ->
			if not disconnected
				выход()
		
		соединение.on 'пользователь', (тайный_ключ) ->
			пользователь = пользовательское.опознать.await(тайный_ключ)
		
			if not пользователь?
				throw 'Пользователь не найден: ' + тайный_ключ
					
			соединение.пользователь = { _id: пользователь._id }
			соединения.эфир[соединение.id] = соединение
						
			пользователь = пользовательское.поля(пользователь)

			was_online = online.hget.bind_await(online)('ether:online', пользователь._id.toString())
			
			if not was_online?
				online.hset('ether:online', пользователь._id.toString(), JSON.stringify(пользователь))
		
				for id, listener of listeners
					listener.online(пользователь)
					
			#
					
			listener = {}
			
			_id = пользователь._id.toString()
			
			listener.online = (user) =>
				#if _id != user._id.toString()
				#api.отправить('пользователи', 'online', Object.выбрать(['_id'], user))
					
			listener.offline = (user) ->
				#if _id != user._id.toString()
				#api.отправить('пользователи', 'offline', Object.выбрать(['_id'], user))
			
			listener.пользователь = _id
			listeners[соединение.id] = listener
			
			соединение.on 'уведомления', ->
				уведомления = новости.уведомления(соединение.пользователь)		
				соединение.emit('новости' + ':' + 'уведомления', уведомления)
			
			соединение.emit 'готов'
		
		соединение.on 'присутствие', ->
			activity = Activity[пользователь._id + '']
			
			if not activity?
				throw 'No activity monitor for user ' + пользователь.имя
			else
				activity.detected()

		соединение.on 'общение', (id) ->
			общение = общения[id.type]
			
			if not общение?
				throw 'communication type not found'
			
			environment =
				пользователь: пользователь
			
			общение.logic(environment)
			
		соединение.emit 'поехали'
		соединение.emit 'version', Options.Version
						
api.offline = (пользователь) ->
	for id, listener of listeners
		listener.offline(пользователь)

api.отправить = (group, name, data, options, возврат) ->
	if typeof options == 'function'
		возврат = options
		options = {}
			
	options = options || {}
	возврат = возврат || (() ->)
	
	connections = соединения.эфир
	
	if options.кому?
		for id, connection of connections
			if connection.пользователь?
				if connection.пользователь._id + '' == options.кому + ''
					connection.emit(group + ':' + name, data)
				
		return возврат(null, yes)

	if options.кроме?
		for id, connection of connections
			if connection.пользователь?
				if connection.пользователь._id + '' != options.кроме + ''
					connection.emit(group + ':' + name, data)
				
		return возврат(null, yes)
	
	for id, connection of connections
		if connection.пользователь?
			connection.emit(group + ':' + name, data)
			
	return возврат(null, yes)

api.соединение_с = (вид, options) ->
	if Object.пусто(соединения[вид])
		return false
	
	for id, connection of соединения[вид]
		if connection.пользователь?
			if connection.пользователь._id + '' == options.пользователь
				if not options._id?
					return connection
				if connection.custom_data?
					if connection.custom_data._id == options._id + ''
						return connection
		
	return false
    
api.пользователи = () ->
	пользователи = {}
	
	for id, connection of соединения.эфир
		пользователи[connection.пользователь._id + ''] = yes
		
	return Object.get_keys(пользователи)
	        
api.отправить_одному_соединению = (group, name, data, options, возврат) ->
	возврат = возврат || (() ->)
	
	connections = соединения.эфир
		
	if options.кому?
		user_connections = []
				
		for id, connection of connections
			if connection.пользователь?
				if connection.пользователь._id + '' == options.кому + ''
					connection.emit(group + ':' + name, data)
					return возврат(null, yes)
				
		console.error('No connections for user: ' + options.кому)
		return возврат(null, no)

	else if options.кроме?
		notified_users = []
		
		users_connections = {}
		
		for id, connection of connections
			if connection.пользователь?
				user_id = connection.пользователь._id + ''
				if !notified_users.has(user_id) && user_id != options.кроме + ''
					connection.emit(group + ':' + name, data)
					notified_users[user_id] = yes
				
		return возврат(null, yes)
	
api.в_сети_ли = (_id, возврат) ->
	user = online.hget.bind_await(online)('ether:online', _id + '')
	
	is_online = no
	if user?
		is_online = yes
		
	возврат(null, is_online)
			
api.соединения = соединения

api.общение = (общение, logic) ->
	общения[общение] = logic

global.эфир = api
