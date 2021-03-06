(function()
{
	title(text('pages.main.title'))

	page.needs_to_load_content = false

	var gender_chooser
	
	page.query('#join_dialog', 'join_dialog')
	
	var step_by_step
	
	var joined_message
	
	var join_button
	
	function initialize_join_button()
	{
		join_button = new text_button("#join_button").does(function() { step_by_step.open() })
	}
	
	var прописан = false
	
	// create gender chooser
	function initialize_gender_chooser()
	{
		gender_chooser = new image_chooser
		(
			page.join_dialog.find('[name=gender] .chooser'),
			{
				target: page.join_dialog.find('[name=gender] input[type=hidden]'),
				on_choice: function()
				{
					step_by_step.slider.next()
				}
			}
		)
	}
	
	function initialize_step_by_step()
	{
		step_by_step = new Step_by_step_dialog_window
		({
			dialog_window: page.join_dialog,
		
			fields:
			{
				имя:
				{
				},
				пол:
				{
					control: gender_chooser
				},
				откуда:
				{
				},
				почта:
				{
				},
				пароль:
				{
				}
			},
			
			done: join_submission
		})
		
		page.register_dialog_window(step_by_step.dialog_window)
	}
	
	function activate_registration()
	{
		initialize_gender_chooser()
		
		initialize_step_by_step()
		
		initialize_join_button()
	}
	
	var conditional
	page.load = function()
	{
		if (пользователь)
			return
		
		if (Uri.parse().parameters['войти'] == 'true')
		{
			$('a.enter').click()
			Uri.remove_parameter('войти')
		}
		
		if (Configuration.Invites)
		{
			if (получить_настройку_запроса('приглашение'))
			{
				conditional = initialize_conditional($('.join_button_block').show())
				
				check_invite(function(error)
				{
					if (error)
						return conditional.callback(error)
					
					conditional.callback(null, function()
					{
						(function() { join_button.push() }).delay(1000)
					})
				})
			}
		}
		else
		{
			$('.join_button_block').children().hide()
			$('.join_button_block > [type=ok]').show()
			$('.join_button_block').show()
			
			activate_registration()
		}
	}
	
	function check_invite(callback)
	{
		var приглашение = получить_настройку_запроса('приглашение')
	
		page.Ajax.get('/приложение/приглашение/проверить', { приглашение: приглашение })
		.ошибка(function(message)
		{
			if (message === "Нет такого приглашения в списке")
				info('Ваше приглашение не найдено в списке. Возможно кто-то уже прописался по нему. Возможно эта ссылка неправильная. Напишите нам об этом, и мы вам поможем.')
			else
				info('Произошла ошибка в ходе проверки вашего приглашения. Напишите нам об этом, и мы вам поможем.')
	
			callback(message)
		})
		.ok(function(данные)
		{
			if (!данные.приглашение)
				return callback('no invite')
				
			activate_registration()
			callback()
		})
	}
	
	// actions
	
	// submit join request
	function join_submission(data, done)
	{
		data.приглашение = получить_настройку_запроса('приглашение')
	
		var loading = loading_indicator.show()
		page.Ajax.put('/приложение/прописать', data)
		.ошибка(function()
		{
			done()
			error('Не удалось прописаться')
		})
		.ok(function(данные) 
		{
			done()
			войти({ имя: data.имя, пароль: data.пароль, go_to: '/' })
		})
	}
})()