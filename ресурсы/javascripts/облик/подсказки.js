var Подсказки = (function()
{
	var включены = false
	
	$(function()
	{
		$(document).keydown(function(event) 
		{
			if (event.altKey && !event.ctrlKey && event.shiftKey)
			{
				switch(event.keyCode)
				{ 
					case Клавиши.Digit_0: 
						включены = !включены
						if (включены)				
							if (подсказка)
								info(подсказка)
						break
				}
			}
		})
	})				

	var подсказка
	
	var назначить_подсказку = function(сообщение)
	{
		if (включены)
			if (сообщение)
				info(сообщение)

		var предыдущая_подсказка = подсказка
		подсказка = сообщение
		return предыдущая_подсказка
	}
	
	var дополнить_подсказку = function(дополнение)
	{
		подсказка += '\n\n' + дополнение
	}
	
	var запомненные_подсказки = {}
	var запомнить = function(название)
	{
		запомненные_подсказки[название] = подсказка
	}
	
	var возстановить = function(название)
	{
		return запомненные_подсказки[название]
	}

	var result =
	{
		подсказка: назначить_подсказку,
		ещё_подсказка: дополнить_подсказку,
		запомнить: запомнить,
		возстановить: возстановить
	}
	
	return result
})()