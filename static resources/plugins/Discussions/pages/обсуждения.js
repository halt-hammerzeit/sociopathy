(function()
{	
	title(text('pages.discussions.title'))
	
	page.query('#discussions', 'discussions')
	
	function start_new_discussion()
	{
		go_to(link_to('new communication', text('pages.discussions.communication type')))
	}
	
	page.data.подписан_на_обсуждения = []
	
	page.load_data
	({
		url: '/сеть/обсуждения',
		batch_size: 12,
		get_item_locator: function(data)
		{
			return data.обновлено_по_порядку
		},
		before_output: function(elements)
		{
			elements.for_each(function()
			{
				var discussion = $(this)
				
				if (Новости.news['Discussions'].обсуждения[discussion.attr('_id')])
					discussion.addClass('new')
			})
		},
		data: function(data)
		{
			parse_dates(data.обсуждения, 'создано')
	
			data.обсуждения.for_each(function()
			{
				var обсуждение = this
				
				this.подписчики = this.подписчики || []
				
				if (this.подписчики.contains(пользователь._id))
				{
					обсуждение.подписан = true
					
					page.data.подписан_на_обсуждения.add(обсуждение._id)
				}
				
				if (this.последнее_сообщение)
				{
					parse_date(this.последнее_сообщение, 'когда')
					this.последнее_сообщение.когда_примерно = неточное_время(this.последнее_сообщение.когда, {  blank_if_just_now: true })
				}
			})
			
			return data.обсуждения
		}
	})
	
	page.load = function()
	{
		page.подсказка('создание обсуждения', 'Вы можете завести новое обсуждение, выбрав действие «Начать новое обсуждение» (клавиша «' + Настройки.Клавиши.Показать_действия + '»)')
	
		breadcrumbs
		([
			{ title: text('pages.discussions.title'), link: '/сеть/обсуждение' }
		])
		
		page.Available_actions.add(text('pages.discussions.new'), start_new_discussion, { действие: 'Создать' })

		$(document).on_page('message_read', function(event, что)
		{
			if (!что.обсуждение)
				return
			
			var общение = page.get('.author_content_date > li[_id="' + что.обсуждение + '"]')
				
			if (общение.exists())
				общение.removeClass('new')
		})
		
		$(document).on_page('discussion_renamed', function(event, data)
		{
			var discussion = $('#discussions').find('>[_id="' + data._id + '"]')
			if (discussion.exists())
				discussion.find('.title').text(data.как)
		})
	}
	
	page.before_output_data(function(elements)
	{
		if (elements.is_empty())
		{
			page.discussions.remove()
			page.get('.main_content').find('> .empty').show()
		}
		
	//	Режим.разрешить('правка')
	})
	
	page.data_template = 'обсуждение в списке обсуждений'
	page.data_container = 'discussions'
	
	function create_context_menu(discussion)
	{
		var _id = discussion.attr('_id')
		
		if (!page.data.подписан_на_обсуждения.contains(_id))
			return
		
		var menu = {}
		menu[text('pages.discussions.discussion.unsubscribe')] = function()
		{
			page.Ajax.delete('/сеть/обсуждения/подписка',
			{
				_id: _id
			})
			.ok(function()
			{
				page.refresh()
			})
			.ошибка(function(ошибка)
			{
				error(ошибка)
			})
		}
		
		discussion.context_menu(menu)
	}
	
	page.Data_store.режим('обычный',
	{
		create: function(data)
		{
			// в обычном режиме - включать обратно подгрузку

			//populate_discussions('обсуждение в списке обсуждений')(data)
			//ajaxify_internal_links(page.discussions)
		},
		
		destroy: function()
		{
			//page.discussions.find('> li').empty()
		}
	})
	
	// в режиме правки отключать подгрузку
	
	page.save = function(data) { }
})()