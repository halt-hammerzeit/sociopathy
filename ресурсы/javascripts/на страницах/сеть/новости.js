(function()
{
	title('Новости')
	
	page.query('#news', 'news')
	
	page.load = function()
	{
		var conditional = initialize_conditional($('.main_conditional'), { immediate: true })
		
		new Data_templater
		({
			template_url: '/страницы/кусочки/новость.html',
			container: page.news,
			conditional: conditional,
			loader: new  Batch_data_loader_with_infinite_scroll
			({
				url: '/приложение/сеть/новости',
				batch_size: 5,
				scroll_detector: content.find('#scroll_detector'),
				before_done: news_loaded,
				get_data: function(data)
				{
					parse_dates(data.новости, 'когда')
					return data.новости
				}
			})
		})
	}
	
	function news_loaded()
	{
		Youtube.load_pictures(page.news)
		Vimeo.load_pictures(page.news)

		$(document).trigger('page_initialized')
		
	//	Режим.разрешить('правка')
	//	Режим.разрешить('действия')
	}
	
	page.needs_initializing = true
})()