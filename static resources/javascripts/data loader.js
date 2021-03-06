function data_loader_parameters(from)
{
	var parameters
	
	if (from)
	{
		if (typeof from === 'function')
			parameters = from()
		else
			parameters = from
	}

	return parameters || {}
}

function loader_get_data(data)
{
	if (this.options.data)
	{
		if (typeof this.options.data === 'string')
		{
			return data[this.options.data]
		}
		else if (typeof this.options.data === 'function')
		{
			var modified_data = this.options.data(data)
			if (modified_data)
				return modified_data
			
			return data
		}
	}
		
	return data
}

var Batch_loader = new Class
({
	Implements: [Options],
	
	options:
	{
		get_data: loader_get_data,
		finished: $.noop,
		loaded: $.noop,
		done: $.noop,
		done_more: $.noop,
		before_output_async: function(elements, callback) { callback() },
		after_output: $.noop,
		before_done: $.noop,
		before_done_more: $.noop,
		get_item_locator: function(object) { return object._id },
		reverse: false,
		Ajax: Ajax,
		each: $.noop,
		skipped_before: 0
	},
	
	есть_ли_ещё: true,
	index: 1,
	
	pages_loaded: 0,
	
	counter: 0,
	
	первый_раз: true,
	
	initialize: function(options)
	{
		this.setOptions(options)
		
		this.options.url = correct_data_url(this.options.url)
		
		if (page)
			if (!options.Ajax)
				this.options.Ajax = page.Ajax
			
		if (this.options.skip_pages)
			this.skip_pages(this.options.skip_pages)
	},
	
	reset: function(options)
	{
		this.set_skipped_before(0)
		this.counter = 0
		this.pages_loaded = 0
		this.первый_раз = true
		delete this.будет_уже_не_первый_раз
		delete this.latest
		this.deactivate()
	},
	
	skip_pages: function(pages)
	{
		this.set_skipped_before(pages * this.options.batch_size)
	},
	
	get_current_page: function(amendment)
	{
		amendment = amendment || 0
		
		/*
		console.log('skipped before: ' + this.options.skipped_before)
		console.log('counter: ' + this.counter)
		console.log('amendment: ' + amendment)
		*/
		
		return Math.ceil((this.options.skipped_before + this.counter + amendment) / this.options.batch_size)
	},
	
	set_skipped_before: function(skipped)
	{
		this.options.skipped_before = skipped
	},

	batch: function(возврат)
	{
		this.get(this.options.batch_size, возврат)
	},
	
	get: function(count, callback)
	{
		var loader = this
		
		var parameters = { сколько: count }
		
		if (this.latest)
			parameters.после = this.options.get_item_locator(this.latest)
			
		if (!parameters.после)
		{
			if (this.options.skipped_before)
			{
				parameters.пропустить = this.options.skipped_before
			}
		}
		
		var с_начала = false
		
		if (this.options.с_начала)
		{
			с_начала = true
			parameters.с_начала = true
			delete this.options.с_начала
		}
		
		if (this.options.order)
			parameters.порядок = this.options.order
		
		if (this.options.latest_first == true)
			parameters.задом_наперёд = true
			
		if (this.options.parameters)
			parameters = Object.combine(data_loader_parameters(this.options.parameters), parameters)
		
		if (this.будет_уже_не_первый_раз)
		{
			this.первый_раз = false
			delete this.будет_уже_не_первый_раз
		}
		
		if (this.первый_раз)
		{
			parameters.первый_раз = true
			this.будет_уже_не_первый_раз = true
		}
		
		console.log('Loading data with parameters:')
		console.log(parameters)
		
		this.options.Ajax.get(this.options.url, parameters)
		.ошибка(function(ошибка)
		{
			callback(ошибка)
		})
		.ok(function(data)
		{
			console.log('Loaded data:')
			console.log(data)
		
			loader.есть_ли_ещё = data['есть ещё?']
			
			if (с_начала && !loader.options.skipped_before)
				data['есть ли предыдущие?'] = false
				
			var data_list = loader.options.get_data.bind(loader)(data)
			
			if (!data_list.is_empty())
			{
				if (!loader.options.reverse)
				{
					loader.counter = loader.pages_loaded * loader.options.batch_size + data_list.length
				}
				else
				{
					loader.counter = - (loader.pages_loaded) * loader.options.batch_size - data_list.length
				}
				
				loader.pages_loaded++
			}

			data_list.for_each(function()
			{
				loader.options.each.bind(this)(data_list)
			})
			
			callback(null, data_list)
		})
	},
	
	/*
	no_data_yet: function()
	{
		return this.counter == 0
	},
	*/
	
	уже_загружено: function()
	{
		if (this.options.reverse)
			throw 'No counter for reversed loader'
		
		return this.counter
	},
	
	skipped: function()
	{
		return this.options.skipped_before
	},
	
	preload: function(finished)
	{
		this.load({ preload: true, callback: finished })
	},
	
	load: function(options)
	{
		var loader = this
		
		options = options || {}
		
		if (this.options.editable && !this.preloaded)
			this.заморозка = Режим.заморозить_переходы()
		
		if (this.первый_раз && this.preloaded)
		{
			this.loaded(loader.preloaded)
			delete this.preloaded
			return
		}
		
		this.batch(function(ошибка, список)
		{
			if (ошибка)
				return loader.options.callback(ошибка)
				
			if (options.preload)
			{
				loader.preloaded = список
				return options.callback()
			}
			
			loader.loaded(список)
		})
	},
	
	loaded: function(список)
	{
		var loader = this
		
		this.options.loaded(список)
		
		if (!список.is_empty())
		{
			this.earliest = список.first()
			this.latest = список.last()
			
			if (this.options.order === 'обратный')
			{
				var earliest = this.earliest
				
				this.earliest = this.latest
				this.latest = earliest
			}
		}
		
		var elements = []
		список.for_each(function()
		{
			var element = loader.options.render(this)
			if (element)
				elements.push(element)
		})
		
		if (this.первый_раз)
			this.options.before_done.bind(this)(список)
		else
			this.options.before_done_more.bind(this)(список)
	
		if (this.options.before_output)
			this.options.before_output.bind(this)(elements)
		
		this.options.before_output_async.bind(this)(elements, function()
		{
			elements.for_each(function()
			{
				loader.options.show(this)
			})
			
			if (!loader.есть_ли_ещё)
				loader.options.finished(список)
			
			loader.options.callback(null, function()
			{
				if (loader.options.after_output)
					loader.options.after_output(elements, { first_time: loader.первый_раз })
					
				if (loader.первый_раз)
					loader.options.done.bind(loader)(список)
				else
					loader.options.done_more.bind(loader)(список)
				
				if (loader.есть_ли_ещё)
					loader.activate()
					
				if (loader.заморозка)
				{
					loader.заморозка.разморозить()
					delete loader.заморозка
				}
			})
		})
	},
	
	activate: function() {},
	deactivate: function() {},
	finished: function() {},
	
	load_more: function()
	{
		this.deactivate()
		this.load()
		
		var loader = this
		return function()
		{
			loader.options.loading_more()
		}
	}
})

var Scroll_loader = new Class
({
	Extends: Batch_loader,

	initialize: function(options)
	{
		options = options || {}
		
		var old = options.after_output
		options.after_output = function()
		{
			this.options.scroll_detector.hide()

			if (old)
				old.apply(this, arguments)
		}
		.bind(this)
							
		this.parent(options)
		
		if (!this.options.hidden)
			this.show()
	},
	
	initialize_scrolling: function()
	{
		$(window).scrollTop(0)
		this.options.scroll_detector = this.options.scroll_detector || $('#scroll_detector')
	},
	
	disabled: function()
	{
		if (this.options.editable)
			if (!Режим.обычный_ли())
				return true
	},
	
	activate: function()
	{
		var loader = this
		
		this.options.scroll_detector.show()
		
		this.options.scroll_detector.node().on('appears_on_bottom', function(event)
		{
			if (loader.disabled())
				return info(text('loader.either way.can\'t load more while in edit mode'))
			
			loader.load_more()
			event.stopPropagation()
		})
		
		page.watch(this.options.scroll_detector)
		
		this.active = true
	},
	
	deactivate: function()
	{
		if (!this.active)
			return
			
		this.options.scroll_detector.hide()
		page.unwatch(this.options.scroll_detector)
		
		this.active = false
	}
})

var Data_loader = new Class
({
	Implements: [Options],
	
	options:
	{
		get_data: loader_get_data,
		done: $.noop,
		render: $.noop,
		show: $.noop,
		before_done: $.noop,
		each: $.noop,
		callback: function(error, action)
		{
			if (!error)
				action()
		},
		loading_more: $.noop,
		Ajax: Ajax
	},
	
	initialize: function(options)
	{
		this.setOptions(options)

		this.options.url = correct_data_url(this.options.url)
		
		if (this.options.conditional)
			this.options.callback = this.options.conditional.callback
		
		if (page)
			if (!options.Ajax)
				this.options.Ajax = page.Ajax
	},

	get: function(callback)
	{
		var loader = this
		
		this.options.Ajax.get(this.options.url, data_loader_parameters(this.options.parameters))
		.ошибка(function(text, ошибка)
		{
			if (loader.options.error)
				loader.options.error(text, ошибка)
			//	if (loader.options.error(text, ошибка) === false)
			//		return callback()
					
			callback(ошибка)
		})
		.ok(function(data)
		{
			data = loader.options.get_data.bind(loader)(data)
			
			if (data instanceof Array)
			{
				data.for_each(function()
				{
					loader.options.each.bind(this)(data)
				})
			}
			
			callback(null, data)
		})
	},
	
	preload: function(finished)
	{
		this.load({ preload: true, callback: finished })
	},
	
	load: function(options)
	{
		options = options || {}
	
		var loader = this
		
		if (this.preloaded)
		{
			this.loaded(loader.preloaded)
			delete this.preloaded
			return
		}
		
		this.get(function(ошибка, список)
		{
			if (ошибка)
			{
				loader.options.callback(ошибка)
				return
			}
			
			if (options.preload)
			{
				loader.preloaded = список
				return options.callback()
			}
		
			loader.loaded(список)
		})
	},
	
	loaded: function(список)
	{
		var loader = this
	
		if (список.constructor !== Array)
			список = [список]
			
		var elements = []
		список.for_each(function()
		{
			elements.push(loader.options.render(this))
		})
		
		this.options.before_done(список)
			
		if (this.options.before_output)
			this.options.before_output(elements)
			
		this.options.callback(null, function()
		{
			elements.for_each(function()
			{
				loader.options.show(this)
			})
			
			if (loader.options.after_output)
				loader.options.after_output(elements)
			
			loader.options.done(список)
		})
	}
})

var Data_templater = new Class
({
	initialize: function(options, loader)
	{
		loader = loader || options.loader
		
		if (options.data)
		{
			loader = new Data_loader(options.data)
		}
		
		if (!options.container)
			options.container = options.to
			
		// убрать потом этот conditional
		
		if (!options.conditional)
		{
			var main_conditional = page.get('.main_conditional')
			if (main_conditional.exists())
				options.conditional = initialize_conditional(page.get('.main_conditional'), { immediate: true })
		}	
		
		var conditional = options.conditional
		if (conditional && conditional.constructor === jQuery)
			conditional = initialize_conditional(options.conditional)
		
		// убрать потом этот conditional
		
		if (page)
			options.Ajax = options.Ajax || page.Ajax

		options.Ajax = options.Ajax || Ajax
			
		if (!options.postprocess_item)
			options.postprocess_item = $.noop
	
		var global_options = options
		
		options.render = options.render || function(data, options)
		{
			options = options || global_options
			
			var item = $.render(options.template, data)
				
			if (options.table)
			{
				if (!item.is('tr'))
				{
					if (!item.is('td'))
					{
						item = $('<td/>').append(item)
					}
					
					item = $('<tr/>').append(item)
				}
			}
			else if (!item.is('li') && !options.single)
				item = $('<li/>').append(item)
				
			item = options.postprocess_item.bind(item)(data) || item
			
			return item
		}
			
		options.show = options.show || function(item, options)
		{
			options = options || global_options
			
			item.appendTo(options.container)
		}
		
		if (!options.process_data)
			options.process_data = function(data) { return data }
		
		if (options.after_output)
			loader.options.after_output = options.after_output
		
		loader.options.render = function(item)
		{
			item = options.process_data(item)
			
			if (!options.data_structure)
				return options.render(item)
		
			var items = item
			var elements = {}
			Object.for_each(options.data_structure, function(property, property_options)
			{
				var value = items[property]
				
				if (!value)
					return
			
				if (value.constructor === Array)
				{
					return elements[property] = value._map(function()
					{
						return options.render(this, property_options)
					})
				}
				
				return elements[property] = options.render(value, property_options)
			})
			
			return elements
		}
		
		loader.options.show = function(element)
		{
			if (!options.data_structure)
				return options.show(element)
		
			var elements = element
			Object.for_each(options.data_structure, function(property, property_options)
			{
				var element = elements[property]
						
				if (!element)
					return
			
				if (element.constructor === Array)
				{
					return element.for_each(function()
					{
						options.show(this, property_options)
					})
				}
				
				return options.show(element, property_options)
			})
		}
		
		loader.options.Ajax = options.Ajax
		
		if (conditional)
		{
			loader.options.callback = conditional.callback
			loader.options.loading_more = conditional.loading_more
		}
		
		if (options.before_done)
			loader.options.before_done = options.before_done
		
		this.show = function()
		{
			loader.load()
		}
	}
})

function load_content(options)
{
	var loader = new Data_loader(options)
	
	new Data_templater
	({
		render: function() {},
		show: function() {},
		loader: loader
	})
	.show()
}