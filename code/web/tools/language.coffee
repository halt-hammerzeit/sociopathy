Array.prototype.clean = ->
    @filter((item) -> return item != null)

Array.prototype.is_empty = () ->
	@length == 0
	
Array.prototype.пусто = () ->
	@is_empty()
	
Array.prototype.trim = () ->
	array = []
	@forEach (element) ->
		if element?
			array.push element
	array
	
Array.prototype.where_am_i = () ->
	try
		this_variable_doesnt_exist['you are here'] += 0
	catch error
		console.log error.stack
	
Array.prototype.has = (element) ->
	@indexOf(element) >= 0

RegExp.escape = (string) ->
	specials = new RegExp("[.*+?|()\\[\\]{}\\\\]", "g")
	return string.replace(specials, "\\$&")

String.prototype.replace_all = (what, with_what) ->
	regexp = new RegExp(RegExp.escape(what), "g")
	return @replace(regexp, with_what)
	
String.prototype.escape_html = ->
	@replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")
	
String.prototype.to_unix_path = ->
	@replace(/\\/g, '/')
	
String.prototype.to_unix_file_name = ->
	if @ == '.' || @ == '..'
		throw 'Invalid Unix file name: ' + @
	@replace(/\//g, encodeURIComponent('/'))
	#.replace(/\|/g, encodeURIComponent('|')).replace(/;/g, encodeURIComponent(';'))

Object.key = (object) ->
	the_key = null
	
	for key, value of object
		the_key = key
	
	return the_key

Object.merge_recursive = (obj1, obj2) ->
	for ключ, значение of obj2
		#if obj2.hasOwnProperty(ключ)
		if typeof obj2[ключ] == 'object' && obj1[ключ]?
			obj1[ключ] = Object.merge_recursive(obj1[ключ], obj2[ключ])
		else
			obj1[ключ] = obj2[ключ]

	return obj1
	
Object.x_over_y = (obj1, obj2) ->
	if not obj1?
		return obj2
	Object.merge_recursive(obj2, obj1)

#Object.x_over_y = (source, destination) ->
#	for key, value of source
#		destination[key] = value
#	destination

Object.выбрать = (названия, object) ->
	if object instanceof Array
		i = 0
		while i < object.length
			object[i] = Object.выбрать(названия, object[i])
			i++
		return object
		
	поля = {}
	for название in названия
		поля[название] = object[название]
	поля
	
Object.get_keys = (object) ->
	keys = []
	for key, value of object
		if object.hasOwnProperty(key)
			keys.add(key)
	keys
	
Object.пусто = (object) ->
	for key, value of object
		if object.hasOwnProperty(key)
			return no
	return yes
	
RegExp.escape = (string) ->
	specials = new RegExp("[.*+?|()\\[\\]{}\\\\]", 'g')
	new String(string).replace(specials, "\\$&")
	
String.prototype.starts_with = (substring) ->
	@indexOf(substring) == 0

String.prototype.ends_with = (substring) ->
	index = @lastIndexOf(substring)
	index >= 0 && index == @length - substring.length
	
Array.prototype.last = () ->
	return if @пусто()
	@[@length - 1]
	
Array.prototype.map_to = (mapper) ->
	result = []
	@forEach (element) ->
		result.add(mapper.bind(element)())
	result
	
Array.prototype.zip = (array) ->
	if array.length != @length
		throw 'Zipped array lengths don\'t match'
		
	result = []
		
	i = 0
	while i < @length
		result.push [@[i], array[i]]
		i++
		
	result
	
Array.prototype.put = (element) ->
	if @indexOf(element) < 0
		@push(element)

Array.prototype.merge_into = (where, name, matcher) ->
	if not matcher?
		i = 0
		while i < where.length
			where[i][name] = this[i]
			i++
		return where
	
	for element in @
		for destination in where
			if matcher.bind(element)(destination)
				destination[name] = element
				
	return where
		
Object.clone = (obj) ->
	if not obj? or typeof obj isnt 'object'
		return obj
	
	if obj instanceof Date
		return new Date(obj.getTime()) 
	
	if obj instanceof RegExp
		flags = ''
		flags += 'g' if obj.global?
		flags += 'i' if obj.ignoreCase?
		flags += 'm' if obj.multiline?
		flags += 'y' if obj.sticky?
		return new RegExp(obj.source, flags) 
	
	newInstance = new obj.constructor()
	
	for key of obj
		newInstance[key] = Object.clone obj[key]
	
	return newInstance

String.prototype.random = () ->
	@split('')[Math.floor(Math.random() * @length)]

Array.toString = (array) ->
	string = '['
	
	i = 0
	while (i < array.length)
		if typeof array[i] == 'object'
			string += JSON.stringify(array[i])
		else
			string += array[i]
			
		if (i < array.length - 1)
			string += ', '
		i++
		
	string += ']'
	
	return string

Object.path = (object, path) ->
	for key in path.split('.')
		if not object?
			return
		object = object[key]
	object
	
Array.prototype.add = Array.prototype.push

Array.prototype.remove_at = (at) ->
	@splice(at, 1)
	
String.prototype.before = (what) ->
	index = @indexOf(what)
	if index >= 0
		return @substring(0, index)
		
	return @

String.prototype.after = (what) ->
	index = @indexOf(what)
	if index >= 0
		return @substring(index + what.length)
		
	return @

String.prototype.contains = (what) ->
	return @indexOf(what) >= 0

Object.size = (object) ->
	size = 0
	
	for key, value of object
		size++
	
	return size

Function.prototype.delay = (delay) ->
	it = @
	
	fiberized = ->
		fiber ->
			it()
			
	setTimeout(fiberized, delay)
	
Object.for_each = (object, action) ->
	for key, value of object
		action.bind(value)(key, value)
		
Function.prototype.ticking = (period, bind, parameters) ->
	running = true
	timeout_id = null
	
	func = this
	periodical = ->
		if func() == false
			return
		
		if running
			next()
	
	next = ->
		timeout_id = periodical.delay(period, bind, parameters)
	
	periodical()
	
	stop = ->
		clearTimeout(timeout_id)
		running = false
	
	return { stop: stop }